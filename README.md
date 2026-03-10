# Future Sight Reviews UI

Production React + TypeScript frontend for uploading review data and displaying AI-generated summaries with follow-up chat.

## Tech Stack
- React 18 + TypeScript
- Vite 5
- ESLint

## Local Development
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

## Build
```bash
npm run build
```

## Environment Variables
- `VITE_API_BASE_URL`: Backend base URL.
  - Default: `http://localhost:8000`
  - Production: set this in your hosting provider’s environment configuration.

## Runtime Flow
- Upload a `.csv` file or provide a review URL.
- Frontend calls:
  - `POST /api/v1/reviews/summarize` with `multipart/form-data` (`file`)
  - `POST /api/v1/reviews/scrape-summarize` with JSON (`url`)
- On success, UI renders:
  - `summary`, `sentiment`, `key_themes`, `common_issues`, `stats`
  - Chat interface for follow-up questions

## Deploying to Render
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Environment:
   - Set `VITE_API_BASE_URL` to your backend URL (for example, `https://your-backend.onrender.com`).

## Backend References (Local)
- Swagger: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
