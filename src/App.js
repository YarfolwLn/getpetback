// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Main from './pages/main';
import SearchPage from './pages/searchpage';
import Profile from './pages/profile';
import Register from './pages/register';
import Addob from './pages/addob';
import PetDetails from './pages/pet-details';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Компонент для проверки авторизации
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('auth_token');
    console.log('PrivateRoute: токен =', token ? 'ЕСТЬ' : 'НЕТ');
    
    if (!token) {
        console.log('PrivateRoute: нет токена, редирект на /register');
        return <Navigate to="/register" />;
    }
    
    return children;
};

// Компонент для редиректа авторизованных пользователей с register
const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
        console.log('PublicRoute: пользователь уже авторизован, редирект в профиль');
        return <Navigate to="/profile" />;
    }
    
    return children;
};

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/pet/:id" element={<PetDetails />} />
                    
                    {/* Публичный маршрут только для регистрации */}
                    <Route path="/register" element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    } />
                    
                    {/* Страница добавления объявления - доступна всем */}
                    <Route path="/add" element={<Addob />} />
                    
                    {/* Защищенный маршрут для профиля */}
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    } />
                    
                    {/* Резервный маршрут */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;