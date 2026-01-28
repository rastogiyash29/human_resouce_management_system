from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate


class EmployeeService:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Employee]:
        return self.db.query(Employee).order_by(Employee.created_at.desc()).all()

    def get_by_employee_id(self, employee_id: str) -> Employee | None:
        return (
            self.db.query(Employee)
            .filter(Employee.employee_id == employee_id)
            .first()
        )

    def get_by_email(self, email: str) -> Employee | None:
        return self.db.query(Employee).filter(Employee.email == email).first()

    def create(self, employee_data: EmployeeCreate) -> Employee:
        employee = Employee(
            employee_id=employee_data.employee_id,
            full_name=employee_data.full_name,
            email=employee_data.email,
            department=employee_data.department,
        )
        try:
            self.db.add(employee)
            self.db.commit()
            self.db.refresh(employee)
            return employee
        except IntegrityError:
            self.db.rollback()
            raise

    def delete(self, employee_id: str) -> bool:
        employee = self.get_by_employee_id(employee_id)
        if not employee:
            return False
        self.db.delete(employee)
        self.db.commit()
        return True

    def count(self) -> int:
        return self.db.query(Employee).count()
