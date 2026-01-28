from datetime import date
from fastapi import FastAPI, Query, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.config import settings
from app.database import engine, Base
from app.routers import employees, attendance
from app.services.employee_service import EmployeeService
from app.services.attendance_service import AttendanceService
from app.database import SessionLocal

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HRMS Lite API",
    description="Human Resource Management System - Lite Edition",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()},
    )


@app.get("/")
def root():
    return {"message": "HRMS Lite API", "version": "1.0.0", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api/v1/dashboard/stats")
def get_dashboard_stats(today: date | None = Query(None)):
    db = SessionLocal()
    try:
        employee_service = EmployeeService(db)
        attendance_service = AttendanceService(db)

        # Use client's date if provided, otherwise fall back to server date
        target_date = today or date.today()

        total_employees = employee_service.count()
        present_today = attendance_service.count_by_date_and_status(target_date, "Present")
        absent_today = attendance_service.count_by_date_and_status(target_date, "Absent")

        return {
            "total_employees": total_employees,
            "present_today": present_today,
            "absent_today": absent_today,
        }
    finally:
        db.close()


app.include_router(employees.router)
app.include_router(attendance.router)
