from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.schemas.employee import EmployeeCreate, EmployeeResponse, EmployeeList
from app.services.employee_service import EmployeeService

router = APIRouter(prefix="/api/v1/employees", tags=["employees"])


@router.get("", response_model=EmployeeList)
def list_employees(db: Session = Depends(get_db)):
    service = EmployeeService(db)
    employees = service.get_all()
    return EmployeeList(employees=employees, total=len(employees))


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    service = EmployeeService(db)
    employee = service.get_by_employee_id(employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found",
        )
    return employee


@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee_data: EmployeeCreate, db: Session = Depends(get_db)):
    service = EmployeeService(db)

    existing_by_id = service.get_by_employee_id(employee_data.employee_id)
    if existing_by_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Employee with ID '{employee_data.employee_id}' already exists",
        )

    existing_by_email = service.get_by_email(employee_data.email)
    if existing_by_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Employee with email '{employee_data.email}' already exists",
        )

    try:
        employee = service.create(employee_data)
        return employee
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Employee with this ID or email already exists",
        )


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    service = EmployeeService(db)
    if not service.delete(employee_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found",
        )
    return None
