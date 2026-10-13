@echo off
echo ===================================================
echo     Starting BharatScheme AI Full-Stack App
echo ===================================================
echo.

echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "BharatScheme AI Backend" cmd /k "cd backend && .venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React Vite Frontend on http://localhost:5173 ...
start "BharatScheme AI Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo BharatScheme AI is running!
echo Access the web portal at: http://localhost:5173
echo API documentation at:     http://127.0.0.1:8000/docs
echo ===================================================
