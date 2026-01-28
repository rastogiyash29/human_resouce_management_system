# HRMS Lite

A lightweight Human Resource Management System for managing employees and tracking attendance.

## Features

- **Employee Management**: Add, view, and delete employees
- **Attendance Tracking**: Mark and update daily attendance
- **Dashboard**: View statistics including total employees, present today, and absent today
- **Filtering**: Filter attendance by employee or date

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Database
- **Pydantic** - Data validation

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Lucide React** - Icons

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI application
│   │   ├── config.py         # Configuration settings
│   │   ├── database.py       # Database connection
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── routers/          # API endpoints
│   │   └── services/         # Business logic
│   ├── requirements.txt
│   └── render.yaml
│
├── frontend/
│   ├── src/
│   │   ├── api/              # API client
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom hooks
│   │   └── pages/            # Page components
│   ├── package.json
│   └── vercel.json
```

## API Endpoints

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/employees` | List all employees |
| GET | `/api/v1/employees/{employee_id}` | Get single employee |
| POST | `/api/v1/employees` | Create employee |
| DELETE | `/api/v1/employees/{employee_id}` | Delete employee |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/attendance` | List attendance (optional filters) |
| GET | `/api/v1/attendance/{employee_id}` | Get employee's attendance |
| POST | `/api/v1/attendance` | Mark attendance |
| PUT | `/api/v1/attendance/{id}` | Update attendance status |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/dashboard/stats` | Get dashboard statistics |

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL

# Run the server
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env if needed

# Run development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Deployment

### Backend (Render)

1. Create a new PostgreSQL database on Render
2. Create a new Web Service connected to your repository
3. Set the build command: `pip install -r requirements.txt`
4. Set the start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `CORS_ORIGINS`: Your frontend URL (comma-separated if multiple)

### Frontend (Vercel)

1. Import your repository on Vercel
2. Set the root directory to `frontend`
3. Add environment variable:
   - `VITE_API_URL`: Your backend API URL

## Environment Variables

### Backend
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost:5173,https://your-app.vercel.app` |

### Frontend
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

## License

MIT
# human_resouce_management_system
