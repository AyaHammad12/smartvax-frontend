
# 💉 SmartVax – Frontend

This is the **React frontend** for the **SmartVax** system – a web platform to manage child vaccinations, health records, and reminders.  
This project is part of the **COMP4382 Graduation Project** at Birzeit University.

---

## 📁 Project Structure

- `/src/` – Source code folder  
- `/src/pages/` – Main pages (appointments, certificates, growth analysis)  
- `/src/components/` – UI components  
- `/src/styles/` – Custom CSS  
- `App.js` – Routing configuration  
- `index.js` – App entry point

---

## ▶️ How to Run the Project

### ✅ Requirements:
- Node.js (v18 or higher)
- npm

### ▶️ Steps:

```bash
cd smartvax-frontend
npm install
npm start
```

🔗 The frontend will run on:  
**http://localhost:3000**

🔗 It connects to the backend running at:  
**http://localhost:8080**

---

## ⭐ Main Features

- 💬 **AI Chatbot for Symptom Inquiry**  
  Parents can chat with the system about symptoms experienced by their child after vaccination.  
  The chatbot provides suggestions or directs parents to consult health workers based on symptom severity.


- 📅 **Appointment Management**  
  Parents can view, book, and request to reschedule appointments.  
  Health workers review and approve appointment changes.

- 📋 **Vaccination Certificates**  
  Generate official certificates for completed vaccinations (regular & additional).

- 📈 **Child Growth Analysis**  
  Parents enter weight and height → system analyzes based on child's age in days and displays normal range + diagnosis.

- 🔔 **Smart Reminders**  
  Automatic alerts before appointments, after missed visits, and follow-ups for post-vaccine care.

- 🤖 **AI Feedback Analyzer**  
  Analyze parent-reported symptoms after vaccination using Weka ML.

- 🔍 **Search by Child ID**  
  Health workers can search children by national ID to access full vaccination schedule.

- 🧑‍⚕️ **Health Worker Dashboard**  
  Manage requests, send reminders, and oversee vaccination activity by center.

- 🔐 **Role-Based Interface**  
  System adapts the UI and access based on user role: `PARENT` or `HEALTH_WORKER`.

---

## 👩‍💻 Team Members

- **Hala Qurt** 
- **Aya Hammad** 
- **Asmaa Ankoush** 

---

## 📄 Notes

- Frontend is built with **React** and supports **Arabic (RTL)** fully.  
- Backend is based on **Spring Boot** and exposes REST APIs under `/api/`.  
- The system uses **session-based authentication** (`fetch` with `credentials: include`).  
- Growth analysis is calculated based on **child’s date of birth** to derive **age in days**.  
- Smart reminder logic is integrated with the backend using scheduled jobs and role filters.

---
