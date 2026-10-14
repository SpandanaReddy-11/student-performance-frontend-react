# Student Performance Analysis - React Frontend

Built with React 18, Vite, React Router and Chart.js. It talks to the Node/Express backend API.

## Run
Start the backend first (see the backend repository), then:

```
npm install
npm run dev
```
Open http://localhost:3000

## Backend address
Default: `http://localhost:5000/api`. To change it, copy `.env.example` to `.env` and edit `VITE_API_URL`.

## Build for production
```
npm run build
npm run preview
```

## Demo login
Teacher: admin@school.com / admin123
Students sign up on the registration page with the email their teacher added.

## Folder structure
```
src/
  main.jsx              entry point
  App.jsx               routes and route protection
  api.js                fetch helper + token storage
  AuthContext.jsx       login, register, logout state
  useApi.js             hook that loads data from the API
  styles.css            all styles
  components/
    AuthLayout.jsx      split layout for login and register
    DashboardLayout.jsx header + navigation for the dashboard
    FormModal.jsx       pop-up form
    Toast.jsx           small messages
    Badge.jsx           status label
  pages/
    Home.jsx  Login.jsx  Register.jsx
    Overview.jsx        teacher class overview
    Students.jsx        student list, add, delete
    StudentDetail.jsx   marks, attendance, charts (teacher and student)
    Attendance.jsx      daily attendance sheet
```

## Routes
- `/` home, `/login`, `/register`
- `/dashboard/overview`, `/dashboard/students`, `/dashboard/students/:id`, `/dashboard/attendance` (teacher only)
- `/dashboard/me` (student only)

## Backend repository
https://github.com/SpandanaReddy-11/student-performance-backend
