# Recipe Lounge (Early Version)

This is the early development version of **Recipe Lounge**.  
Currently, only the **folder sidebar** is implemented.  
More features such as recipe pages will be added later.

---

## Tech Stack

### **Backend**
- Java 17
- Spring Boot 3.5.7
- Maven 3.9+
- PostgreSQL

### **Frontend**
- React + TypeScript
- Vite
- CSS

---

## Prerequisites

Before running the project locally, make sure you have the following installed:

### **General Requirements**
- **Java 17+**
- **Maven 3.9.11+**
- **PostgreSQL (recommended: version 18.x)**

### **IDE Requirements**
#### **VS Code**
You must install:
- **Java Extension Pack** (Oracle)
- **Maven for Java**

#### **IntelliJ IDEA**
- No additional configuration required  
  (IntelliJ detects Maven + Java automatically)

---

## Check Installed Versions (Windows CMD)

You can verify your installed tools using:

```
java -version
mvn -version
psql --version
```
---

## Database Setup (only needed for now)
```CREATE DATABASE recipelounge;```

Update your application.yml if needed:
```
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/recipelounge
    username: your_username
    password: your_password
```

---
    
## How to run the project
- you need 2 terminals to start frontend (Vite) and backend (Tomcat) server

1)
```
cd backend
mvn spring-boot:run
```

2)
```
cd frontend
npm install
npm run dev
```
