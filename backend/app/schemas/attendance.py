from datetime import date, datetime
from enum import Enum

from pydantic import BaseModel, field_validator


class AttendanceStatus(str, Enum):
    PRESENT = "Present"
    ABSENT = "Absent"


class AttendanceBase(BaseModel):
    employee_id: str
    date: date
    status: AttendanceStatus

    @field_validator("date")
    @classmethod
    def validate_date(cls, v: date) -> date:
        # Allow 1 day buffer for timezone differences (client may be ahead of UTC server)
        from datetime import timedelta
        if v > date.today() + timedelta(days=1):
            raise ValueError("Attendance date cannot be in the future")
        return v


class AttendanceCreate(AttendanceBase):
    pass


class BulkAttendanceCreate(BaseModel):
    employee_ids: list[str]
    date: date
    status: AttendanceStatus

    @field_validator("date")
    @classmethod
    def validate_date(cls, v: date) -> date:
        # Allow 1 day buffer for timezone differences (client may be ahead of UTC server)
        from datetime import timedelta
        if v > date.today() + timedelta(days=1):
            raise ValueError("Attendance date cannot be in the future")
        return v

    @field_validator("employee_ids")
    @classmethod
    def validate_employee_ids(cls, v: list[str]) -> list[str]:
        if not v:
            raise ValueError("At least one employee must be selected")
        return v


class AttendanceUpdate(BaseModel):
    status: AttendanceStatus


class AttendanceResponse(BaseModel):
    id: int
    employee_id: str
    date: date
    status: AttendanceStatus
    created_at: datetime
    employee_name: str | None = None

    class Config:
        from_attributes = True


class AttendanceList(BaseModel):
    attendance: list[AttendanceResponse]
    total: int
    present_count: int = 0
    absent_count: int = 0


class BulkAttendanceResult(BaseModel):
    created: list[AttendanceResponse]
    skipped: list[dict]
