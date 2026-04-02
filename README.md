# 🚀 SpringRestAngularTest

[![Status](https://img.shields.io/badge/status-Work%20In%20Progress-orange?style=for-the-badge)](https://github.com/hsummerhays/SpringRestAngularTest)
[![Built with AI](https://img.shields.io/badge/Built%20With-AI-blueviolet?style=for-the-badge)](https://github.com/hsummerhays/SpringRestAngularTest)

A full-stack project demonstrating a seamless integration between a **Spring Boot** backend and an **Angular** frontend, secured with **Azure Entra ID**.

> [!NOTE]
> This is a **work in process** made remarkably easy by the power of AI.

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 4.0.5
- **Language**: Java 17
- **Build Tool**: Gradle 9.1.0
- **Database**: SQLite (local dev)
- **Security**: Azure Entra ID (OAuth2 Resource Server)

### Frontend
- **Framework**: Angular 21.2.0
- **Security**: MSAL Angular (Azure AD/Entra ID integration)
- **Styling**: Modern, responsive UI

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js & npm
- PowerShell (for automated lifecycle scripts)

### Installation & Run
Simply run the included lifecycle script to launch both the backend and frontend in a split-pane, maximized terminal:

```powershell
./run.ps1
```

### 🛑 Termination
To kill the relevant processes and clean up your environment:

```powershell
./stop.ps1
```

---

## 📡 Endpoints
- **Backend**: [http://localhost:8080/hello](http://localhost:8080/hello)
- **Frontend**: [http://localhost:4200](http://localhost:4200)
- **Customer API (Secured)**: [http://localhost:8080/api/customers](http://localhost:8080/api/customers)

---

## 📂 Project Structure
- `src/`: Java source code (Controllers, Services, Models).
- `frontend/`: Angular application source.
- `.agents/`: Specialized AI instructions and workflows.
- `run.ps1` & `stop.ps1`: Automated lifecycle management.
