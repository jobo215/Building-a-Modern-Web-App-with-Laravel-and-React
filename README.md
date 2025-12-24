# Building a Modern Web App with Laravel and React

A modern full-stack web application built with **Laravel** as the backend API and **React** as the frontend, demonstrating clean architecture, best practices, and seamless communication between the two.

## 🚀 Tech Stack

- **Backend:** Laravel
- **Frontend:** React
- **API Communication:** Axios
- **Authentication:** Laravel JWT
- **Database:** MySQL

## ✨ Features

- RESTful API built with Laravel
- React Single Page Application (SPA)
- User authentication and authorization
- Clean and scalable project structure
- Ready-to-extend architecture

## 📂 Project Structure

```text
Laravel-App/
React-App/
```

## ⚙️ Installation
### Backend (Laravel)

```text
cd Laravel-App
composer install
cp .env
php artisan key:generate
php artisan migrate
php artisan serve
````

### Frontend (React)

```text
cd React-App
npm install
npm run dev
```

## 🔗 API & Frontend Connection

The React application communicates with the Laravel backend via a REST API.
Authentication is handled using secure tokens and middleware.

## 🎯 Purpose

This project is intended for:

- Developers learning how to connect React with a Laravel backend
- Demonstrating modern full-stack web application architecture
- Serving as a starter template for real-world applications

## 📜 License

This project is open-source and available under the MIT License.