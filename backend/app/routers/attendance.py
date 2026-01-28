from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceUpdate,
    AttendanceResponse,
    AttendanceList,
    BulkAttendanceCreate,
    BulkAttendanceResult,
)
from app.services.attendance_service import AttendanceService

router = APIRouter(prefix="/api/v1/attendance", tags=["attendance"])


def _to_response(attendance) -> AttendanceResponse:
    return AttendanceResponse(
        id=attendance.id,
        employee_id=attendance.employee_id,
        date=attendance.date,
        status=attendance.status,
        created_at=attendance.created_at,
        employee_name=attendance.employee.full_name if attendance.employee else None,
    )


@router.get("", response_model=AttendanceList)
def list_attendance(
    employee_ids: list[str] | None = Query(None),
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    status: str | None = Query(None),
    db: Session = Depends(get_db),
):
    service = AttendanceService(db)
    records = service.get_all(
        employee_ids=employee_ids,
        date_from=date_from,
        date_to=date_to,
        status=status,
    )
    # Get summary without status filter to show total counts
    summary = service.get_summary(
        employee_ids=employee_ids,
        date_from=date_from,
        date_to=date_to,
    )
    return AttendanceList(
        attendance=[_to_response(r) for r in records],
        total=len(records),
        present_count=summary["present"],
        absent_count=summary["absent"],
    )


@router.get("/{employee_id}", response_model=AttendanceList)
def get_employee_attendance(employee_id: str, db: Session = Depends(get_db)):
    service = AttendanceService(db)

    if not service.employee_exists(employee_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found",
        )

    records = service.get_by_employee_id(employee_id)
    return AttendanceList(
        attendance=[_to_response(r) for r in records], total=len(records)
    )


@router.post("", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance_data: AttendanceCreate, db: Session = Depends(get_db)):
    service = AttendanceService(db)

    if not service.employee_exists(attendance_data.employee_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{attendance_data.employee_id}' not found",
        )

    existing = service.get_by_employee_and_date(
        attendance_data.employee_id, attendance_data.date
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Attendance for employee '{attendance_data.employee_id}' on {attendance_data.date} already exists",
        )

    try:
        attendance = service.create(attendance_data)
        return _to_response(attendance)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Attendance record already exists for this employee and date",
        )


@router.post("/bulk", response_model=BulkAttendanceResult, status_code=status.HTTP_201_CREATED)
def mark_bulk_attendance(data: BulkAttendanceCreate, db: Session = Depends(get_db)):
    service = AttendanceService(db)
    created = []
    skipped = []

    for employee_id in data.employee_ids:
        if not service.employee_exists(employee_id):
            skipped.append({"employee_id": employee_id, "reason": "Employee not found"})
            continue

        existing = service.get_by_employee_and_date(employee_id, data.date)
        if existing:
            skipped.append({"employee_id": employee_id, "reason": "Attendance already marked"})
            continue

        try:
            attendance_data = AttendanceCreate(
                employee_id=employee_id,
                date=data.date,
                status=data.status,
            )
            attendance = service.create(attendance_data)
            created.append(_to_response(attendance))
        except IntegrityError:
            skipped.append({"employee_id": employee_id, "reason": "Database error"})

    return BulkAttendanceResult(created=created, skipped=skipped)


@router.put("/{id}", response_model=AttendanceResponse)
def update_attendance(
    id: int, attendance_data: AttendanceUpdate, db: Session = Depends(get_db)
):
    service = AttendanceService(db)
    attendance = service.update(id, attendance_data)
    if not attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attendance record with ID {id} not found",
        )
    return _to_response(attendance)
