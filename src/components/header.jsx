import React from 'react';
import logo from '../assets/images/logo.jpg';

const Header = ({ isAuthenticated = false, userName = "Иван" }) => {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary modern-navbar">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    <img src={logo} alt="Логотип YarfPets" style={{ borderRadius: 8, width: 80, height: 80 }} />
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" href="/profile">Личный кабинет</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/register">Регистрация/Вход</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/add">Добавить объявление</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/search">Поиск по объявлениям</a>
                        </li>
                    </ul>
                    
                    {isAuthenticated && (
                        <div className="navbar-nav">
                            <div className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                                    <i className="bi bi-person-circle me-2"></i>
                                    {userName}
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="/profile"><i className="bi bi-person me-2"></i>Личный кабинет</a></li>
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