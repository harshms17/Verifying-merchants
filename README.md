# 🧑‍💼 Merchant Management App

A full-stack, role-based web application that enables Super Admins to seamlessly manage Merchants and Regional Admins. This project provides intuitive UI and powerful backend controls to approve, block, and create accounts with regional access control.

---

## 🚀 Features

### ✅ For Super Admins
- 🔎 View and manage all registered merchants
  - Categorized by `Verified` & `Unverified`
  - Toggle verification (Approve / Block merchants)
- 👥 View and manage all Admin accounts
  - Add new Admins via a simple form
  - Fire existing admins

### 🧰 Tech Stack

| Frontend           | Backend   | Database | Auth                 | Misc             |
|--------------------|-----------|----------|----------------------|------------------|
| Next.js (App Router) | Node.js   | MongoDB  | Cookie-based (with JWT) | TailwindCSS      |
| React Hooks        | API Routes| Mongoose ODM | js-cookie          | Fully responsive|

---

## 🧑‍💻 Project Structure

📁 src/  
┣ 📁 models/ → Mongoose Schemas (Merchant, Admin)  
┣ 📁 app/  
┃ ┣ 📁 api/ → Backend API routes  
┃ ┗ 📁 dashboard/ → Super Admin dashboard (UI + logic)  
┣ 📁 components/ → Reusable UI components (WIP)  
┗ 📁 utils/ → Utility functions & middlewares

---
