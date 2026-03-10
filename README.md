# FutureFirst Reviews UI

Production-oriented React + TypeScript frontend for uploading a reviews CSV and displaying backend-generated summaries.

## Tech Stack
- React 18 + TypeScript
- Vite 5
- ESLint

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Run the app:
   ```bash
   npm run dev
   ```

## Environment Variables
- `VITE_API_BASE_URL`: Backend base URL. Default: `http://localhost:8000`

## Implemented Flow
- User uploads `.csv` file
- Frontend sends `multipart/form-data` with `file` to:
  - `POST /api/v1/reviews/summarize`
- Loading state shown while API call is running
- API `detail` message shown directly on failures
- On success, UI renders:
  - `summary`
  - `total_reviews`
  - UI renders AI chat interface

## Backend References
- Swagger: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
