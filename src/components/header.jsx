import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import logo from '../assets/images/logo.png';

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');

    // Обновление состояния авторизации при изменении
    useEffect(() => {
        const updateAuthState = () => {
            const authStatus = AuthService.isAuthenticated();
            setIsAuthenticated(authStatus);
            setUserName(AuthService.getUserName());
        };

        // Первоначальная проверка
        updateAuthState();

        // Подписываемся на события изменения авторизации
        window.addEventListener('authChange', updateAuthState);
        window.addEventListener('userDataUpdate', updateAuthState);

        return () => {
            window.removeEventListener('authChange', updateAuthState);
            window.removeEventListener('userDataUpdate', updateAuthState);
        };
    }, []);

    return (
        <header className="modern-navbar navbar navbar-expand-lg navbar-light bg-light sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="YarfPets Logo" />
                </Link>
                
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/search">
                                <i className="bi bi-search me-1"></i>Поиск
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/add">
                                <i className="bi bi-plus-circle me-1"></i>Добавить объявление
                            </Link>
                        </li>
                    </ul>
                    
                    <div className="d-flex align-items-center">
                        {isAuthenticated ? (
                            <>
                                <Link className="btn btn-primary me-2" to="/profile">
                                    <i className="bi bi-person me-1"></i><span className="fw-default">{userName || 'Пользователь'}</span> | Личный кабинет
                                </Link>
                                <button className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#logoutModal">
                                    <i className="bi bi-box-arrow-right me-1"></i>Выйти
                                </button>
                            </>
                        ) : (
                            <Link className="btn btn-primary" to="/register">
                                <i className="bi bi-person me-1"></i>Войти / Регистрация
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;