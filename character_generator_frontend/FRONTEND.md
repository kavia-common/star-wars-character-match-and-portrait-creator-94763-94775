# Character Generator Frontend

Run the app:
- npm install
- Copy .env.example to .env and set REACT_APP_API_BASE_URL (e.g., http://localhost:8000)
- npm start

Routes:
- /        Start screen
- /quiz    Quiz flow
- /upload  Selfie upload (file or camera)
- /result  Result view and share/download
- /admin   Admin panel (questions and characters)

Notes:
- The frontend expects the backend to expose:
  - GET  /api/quiz
  - POST /api/quiz/submit
  - POST /api/upload-selfie (multipart form-data: file, optional resultId)
  - GET  /api/results/:resultId
  - CRUD /api/admin/questions
  - CRUD /api/admin/characters
