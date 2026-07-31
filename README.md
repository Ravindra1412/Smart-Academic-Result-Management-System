# Smart Academic Result Management System

A responsive React 18 web application for end-to-end academic result management, with dedicated **Student** and **Administrator** dashboards.

## ✨ Features
- Student & Admin authentication (with forgot-password flows)
- CRUD operations on student records via React Hooks (`useState`, `useEffect`, `useReducer`)
- Marks entry, grading, and subject-wise analytics (Canvas charts)
- 6-month attendance tracking with calendar view
- Class leaderboard & subject toppers
- Paper-viewing request workflow (student ↔ admin)
- Notification center shared across dashboards
- CSV & PDF report export (jsPDF)
- Light / dark theme, keyboard shortcuts, zoom controls
- Fully responsive layout (HTML5 + CSS3)

## 📂 Project Structure

```
Smart-Academic-Result-Management-System/
├── public/
│   └── index.html          # HTML shell (loader, canvas, keyboard/zoom widgets)
├── src/
│   ├── components/         # Reusable UI components
│   │   └── modals/         # Modal dialogs (login recovery, add/edit/view student)
│   ├── context/
│   │   └── AppContext.js   # Global state via useReducer + Context API
│   ├── hooks/
│   │   └── useUIHooks.js   # Custom hooks (clock, animated numbers, mouse glow…)
│   ├── pages/               # Top-level routed views
│   │   ├── admin/           # Admin dashboard sections (overview, students, marks…)
│   │   └── student/         # Student dashboard tabs (notices, paper requests)
│   ├── utils/                # Pure helpers, constants, storage, exports
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## 🚀 Getting Started

1. Clone the repository

```bash
git clone https://github.com/Ravindra1412/Smart-Academic-Result-Management-System.git
```

2. Navigate to the project

```bash
cd Smart-Academic-Result-Management-System
```

3. Install dependencies

```bash
npm install
```

4. Start the development server

```bash
npm start
```

The application will run locally at:

```text
http://localhost:3000
```

### Build for production

```bash
npm run build
```

## 🔑 Demo Credentials
- **Student:** Roll `STU001` / Password `2003`
- **Admin:** Username `admin` / Password `Admin@2024`

## 🛠 Tech Stack
React 18 · Context API · `useReducer` · Custom Hooks · HTML5 · CSS3 · jsPDF
