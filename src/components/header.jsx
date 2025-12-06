// src/components/header.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.jpg';
import ApiService from '../services/api'; // Импортируем ApiService

const Header = ({ isAuthenticated = false, userName = "" }) => {
    const [userNameState, setUserNameState] = useState(userName);
    
    useEffect(() => {
        // Проверяем авторизацию по наличию токена
        const checkAuthAndGetName = () => {
            const token = localStorage.getItem('auth_token');
            const authenticated = !!token || isAuthenticated;
            
            if (authenticated) {
                // Пытаемся получить имя из пропсов
                if (userName && userName.trim() !== '') {
                    setUserNameState(userName);
                } else {
                    // Или из localStorage
                    const storedName = ApiService.getStoredUserName();
                    if (storedName && storedName.trim() !== '') {
                        setUserNameState(storedName);
                    } else {
                        // Или из user_data в localStorage
                        const userDataStr = localStorage.getItem('user_data');
                        if (userDataStr) {
                            try {
                                const userData = JSON.parse(userDataStr);
                                if (userData.name && userData.name.trim() !== '') {
                                    setUserNameState(userData.name);
                                }
                            } catch (error) {
                                console.error('Ошибка при чтении user_data:', error);
                            }
                        }
                    }
                }
            }
        };
        
        checkAuthAndGetName();
    }, [isAuthenticated, userName]);
    
    const authenticated = !!localStorage.getItem('auth_token') || isAuthenticated;

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary modern-navbar">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="Логотип YarfPets" style={{ borderRadius: 8, width: 80, height: 80 }} />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {/* Показываем "Личный кабинет" только авторизованным пользователям */}
                        {authenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">Личный кабинет</Link>
                            </li>
                        )}
                        
                        {/* Всегда показываем регистрацию/вход */}
                        {!authenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">Регистрация/Вход</Link>
                            </li>
                        )}  
                        
                        {/* Всегда показываем добавление объявления */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/add">Добавить объявление</Link>
                        </li>
                        
                        {/* Всегда показываем поиск */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/search">Поиск по объявлениям</Link>
                        </li>
                    </ul>
                    
                    {/* Dropdown для авторизованного пользователя */}
                    {authenticated && (
                        <div className="navbar-nav">
                            <div className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                                    <i className="bi bi-person-circle me-2"></i>
                                    {userNameState || "Пользователь"}
                                </a>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="/profile"><i className="bi bi-person me-2"></i>Личный кабинет</Link></li>
                                    <li><hr className="dropdown-divider"/></li>
                                    <li>
                                        <a className="dropdown-item text-danger" href="/" data-bs-toggle="modal" data-bs-target="#logoutModal">
                                            <i className="bi bi-box-arrow-right me-2"></i>Выйти
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;