 # 🎓 Smart Academic Result Management System

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3)
![License](https://img.shields.io/badge/License-MIT-green)

A responsive React 18 web application for end-to-end academic result management, with dedicated **Student** and **Administrator** dashboards.

**This project was developed to simplify academic result management by providing separate dashboards for students and administrators, enabling efficient record management, analytics, and report generation.**


## 📑 Table of Contents


- [✨ Features](#-features)
- [📂 Project Structure](#-project-structure)
- [🌐 Live Demo](#-live-demo)
- [🚀 Getting Started](#-getting-started)
- [🔑 Demo Credentials](#-demo-credentials)
- [📸 Screenshots](#-screenshots)
- [🛠 Tech Stack](#-tech-stack)
- [🚀 Future Enhancements](#-future-enhancements)
- [👨‍💻 Author](#-author)

## ✨ Features
- Student & Admin authentication (with forgot-password flows)
- CRUD operations on student records via React Hooks (`useState`, `useEffect`, `useReducer`)
- Marks entry, grading, and subject-wise analytics (Canvas visualizations)
 
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
  
## 🌐 Live Demo

🔗 [Live Website](https://smart-academic-result-management-system-nygi-yhhilnakr.vercel.app)

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/Ravindra1412/Smart-Academic-Result-Management-System.git
```

### Navigate to the Project

```bash
cd Smart-Academic-Result-Management-System
```

### Install Dependencies

```bash
npm install
```

### Run the Development Server

```bash
npm start
```

The application will run locally at:

```text
http://localhost:3000
```
 

### Build for Production

```bash
npm run build
```

## 🔑 Demo Credentials
 
- **Student:** Roll `STU001` / Password `2003`
- **Admin:** Username `admin` / Password `Admin@2024`


## 📸 Screenshots

### Student Dashboard

![Student Dashboard](https://github.com/user-attachments/assets/54f667da-d359-4fcb-9b8f-c70e832c2452)

### Student Records

![Student Records](https://github.com/user-attachments/assets/09b5829f-3f14-4494-bc88-a38ac39a96b6)

### Result Management

![Result Management](https://github.com/user-attachments/assets/43b4094e-da36-465b-b574-c3823ecb2979)

### Responsive Interface

![Responsive Interface](https://github.com/user-attachments/assets/ce32d8d4-ffa6-48e2-a51e-a2bb4fa4b3ba)

## 🛠 Tech Stack

- React 18
- JavaScript (ES6)
- HTML5
- CSS3
- Context API
- React Hooks (`useState`, `useEffect`, `useReducer`)
- jsPDF
- Git & GitHub

---

## 🚀 Future Enhancements

- User authentication with JWT
- Database integration (MongoDB/MySQL)
- Email notifications
- Cloud deployment
- Student performance analytics

## 👨‍💻 Author

**Ravindra Swami**

- GitHub: [Ravindra1412](https://github.com/Ravindra1412)
- LinkedIn: [Ravindra Swami](https://www.linkedin.com/in/ravindra-swami-2675b0324)

 
