from datetime import date

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.attendance import Attendance
from app.models.employee import Employee
from app.schemas.attendance import AttendanceCreate, AttendanceUpdate


class AttendanceService:
    def __init__(self, db: Session):
        self.db = db

    def get_all(
        self,
        employee_ids: list[str] | None = None,
        date_from: date | None = None,
        date_to: date | None = None,
        status: str | None = None,
    ) -> list[Attendance]:
        query = self.db.query(Attendance)

        if employee_ids:
            query = query.filter(Attendance.employee_id.in_(employee_ids))
        if date_from:
            query = query.filter(Attendance.date >= date_from)
        if date_to:
            query = query.filter(Attendance.date <= date_to)
        if status:
            query = query.filter(Attendance.status == status)

        return query.order_by(Attendance.date.desc(), Attendance.id.desc()).all()

    def get_summary(
        self,
        employee_ids: list[str] | None = None,
        date_from: date | None = None,
        date_to: date | None = None,
    ) -> dict:
        from sqlalchemy import func

        query = self.db.query(
            Attendance.status,
            func.count(Attendance.id).label("count")
        )

        if employee_ids:
            query = query.filter(Attendance.employee_id.in_(employee_ids))
        if date_from:
            query = query.filter(Attendance.date >= date_from)
        if date_to:
            query = query.filter(Attendance.date <= date_to)

        results = query.group_by(Attendance.status).all()

        summary = {"present": 0, "absent": 0}
        for status, count in results:
            if status == "Present":
                summary["present"] = count
            elif status == "Absent":
                summary["absent"] = count

        return summary

    def get_by_id(self, attendance_id: int) -> Attendance | None:
        return self.db.query(Attendance).filter(Attendance.id == attendance_id).first()

    def get_by_employee_id(self, employee_id: str) -> list[Attendance]:
        return (
            self.db.query(Attendance)
            .filter(Attendance.employee_id == employee_id)
            .order_by(Attendance.date.desc())
            .all()
        )

    def get_by_employee_and_date(
        self, employee_id: str, attendance_date: date
    ) -> Attendance | None:
        return (
            self.db.query(Attendance)
            .filter(
                Attendance.employee_id == employee_id, Attendance.date == attendance_date
            )
            .first()
        )

    def create(self, attendance_data: AttendanceCreate) -> Attendance:
        attendance = Attendance(
            employee_id=attendance_data.employee_id,
            date=attendance_data.date,
            status=attendance_data.status.value,
        )
        try:
            self.db.add(attendance)
            self.db.commit()
            self.db.refresh(attendance)
            return attendance
        except IntegrityError:
            self.db.rollback()
            raise

    def update(
        self, attendance_id: int, attendance_data: AttendanceUpdate
    ) -> Attendance | None:
        attendance = self.get_by_id(attendance_id)
        if not attendance:
            return None
        attendance.status = attendance_data.status.value
        self.db.commit()
        self.db.refresh(attendance)
        return attendance

    def count_by_date_and_status(self, target_date: date, status: str) -> int:
        return (
            self.db.query(Attendance)
            .filter(Attendance.date == target_date, Attendance.status == status)
            .count()
        )

    def employee_exists(self, employee_id: str) -> bool:
        return (
            self.db.query(Employee)
            .filter(Employee.employee_id == employee_id)
            .first()
            is not None
        )
