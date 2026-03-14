# ERP Management System

A **Full Stack ERP (Enterprise Resource Planning) Management System** built using **Spring Boot, React, MySQL, and JWT Authentication**.
This system helps manage **Employees, Departments, Attendance, Leave, Inventory, Sales, and Finance** within an organization.

---

# 🚀 Features

### 🔐 Authentication & Security

* JWT Token Authentication
* Role Based Authorization (ADMIN / HR / EMPLOYEE / USER)
* Spring Security Integration
* Password Encryption using BCrypt

### 👨‍💼 Employee Management

* Create Employee
* Update Employee
* Soft Delete Employee
* Employee Search
* Pagination Support

### 🏢 Department Management

* Create Departments
* View Departments
* Department Assignment to Employees

### 📅 Attendance System

* Employee Check-in
* Employee Check-out
* View Personal Attendance History

### 📝 Leave Management

* Apply Leave
* View My Leaves
* Admin Approve/Reject Leave
* Leave Status Tracking

### 📦 Inventory Management

* Add Inventory Items
* Update Inventory
* Delete Inventory
* View Inventory List

### 💰 Finance Management

* Record Income
* Record Expenses
* Update/Delete Financial Records

### 📊 Sales Management

* Create Sales Records
* Track Product Sales
* Automatic Total Calculation

### 📈 Dashboard Analytics

* Total Employees
* Total Departments
* Attendance Records
* Leave Records
* Inventory Items
* Total Sales
* Total Income
* Total Expenses
* Profit Calculation

---

# 🛠️ Tech Stack

## Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate
* Maven

## Frontend

* React
* Vite
* Axios
* React Router

## Database

* MySQL

---

# 📂 Project Structure

```
erp-project
│
├── erp-backend
│   ├── config
│   ├── controller
│   ├── dto
│   ├── exception
│   ├── model
│   ├── repository
│   ├── security
│   ├── service
│   └── service.impl
│
├── erp-frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│
└── README.md
```

---

# 🗄️ Database Setup

Create a MySQL database:

```sql
CREATE DATABASE erp_system;
```

Update `application.properties`:

```
spring.datasource.url=jdbc:mysql://localhost:3306/erp_system
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

# ▶️ Running the Backend

Navigate to the backend folder:

```
cd erp-backend
```

Run the project:

```
mvn spring-boot:run
```

Backend will start on:

```
http://localhost:8080
```

---

# ▶️ Running the Frontend

Navigate to frontend folder:

```
cd erp-frontend
```

Install dependencies:

```
npm install
```

Start the React app:

```
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🔐 Authentication Flow

1. User registers or login
2. Backend generates JWT token
3. Frontend stores token
4. Token sent in `Authorization Header`

```
Authorization: Bearer <token>
```

---

# 📌 API Base URL

```
http://localhost:8080/api
```

Example endpoints:

```
POST /api/auth/login
POST /api/auth/register
GET /api/employees
POST /api/departments
POST /api/attendance/check-in
POST /api/leaves/apply
GET /api/dashboard
```

---

# 📸 Screenshots

(Add screenshots here)

Example:

* Login Page
* Dashboard
* Employee Management
* Inventory Module
* Sales Module

---

# 👨‍💻 Author

Karan G

---

# 📄 License

This project is licensed under the MIT License.
