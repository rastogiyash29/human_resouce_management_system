import re
from datetime import datetime

from pydantic import BaseModel, EmailStr, field_validator


class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

    @field_validator("employee_id")
    @classmethod
    def validate_employee_id(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Employee ID is required")
        if not re.match(r"^[a-zA-Z0-9_-]+$", v):
            raise ValueError(
                "Employee ID must contain only alphanumeric characters, hyphens, and underscores"
            )
        return v.strip()

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Full name is required")
        return v.strip()

    @field_validator("department")
    @classmethod
    def validate_department(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Department is required")
        return v.strip()


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EmployeeList(BaseModel):
    employees: list[EmployeeResponse]
    total: int
