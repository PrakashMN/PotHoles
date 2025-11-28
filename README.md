# Pothole Detection System

This project is a real-time pothole detection application using a YOLO-based backend and a React frontend.

## Prerequisites

- **Python** (3.8 or higher)
- **Node.js** (16 or higher)
- **Git**

## Cloning the Repository

Open your terminal (PowerShell recommended on Windows) and run:

```powershell
git clone https://github.com/PrakashMN/PotHoles.git
cd PotHoles
```

## Backend Setup

The backend is built with FastAPI and uses a YOLO model for detection.

1. Open a new terminal and navigate to the `backend` directory:
   ```powershell
   cd backend
   ```

2. (Optional) Create and activate a virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate
   ```

3. Install the required Python packages:
   ```powershell
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```powershell
   uvicorn main:app --reload
   ```
   The backend will start running at `http://127.0.0.1:8000`.

## Frontend Setup

The frontend is built with React and Vite.

1. Open a **new** terminal window and navigate to the `frontend` directory:
   ```powershell
   cd frontend
   ```

2. Install the dependencies:
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   npm run dev
   ```
   The frontend will typically run at `http://localhost:5173`.

## Usage

1. Ensure both the backend and frontend servers are running.
2. Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`).
3. Grant camera permissions if prompted.
4. The application will stream video from your camera and detect potholes in real-time using the backend model.
