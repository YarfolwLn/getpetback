import React, { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import LogoutModal from '../components/logout-modal';

const Register = () => {
    const [activeForm, setActiveForm] = useState('register');
    const [formData, setFormData] = useState({
        register: {
            name: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeTerms: false
        },
        login: {
            email: '',
            password: ''
        }
    });

    const handleInputChange = (formType, field, value) => {
        setFormData(prev => ({
            ...prev,
            [formType]: {
                ...prev[formType],
                [field]: value
            }
        }));
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        // Логика регистрации
        console.log('Регистрация:', formData.register);
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        // Логика входа
        console.log('Вход:', formData.login);
    };

    return (
        <div>
            <Header isAuthenticated={false} />
            
            <div className="register-container">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            <div className="register-card">
                                <div className="register-header">
                                    <h1 className="h3 mb-2">Добро пожаловать в YarfPets!</h1>
                                    <p className="mb-0">Присоединяйтесь к нашему сообществу любителей животных</p>
                                </div>
                                
                                <div className="register-body">
                                    {/* Табы для переключения между формами */}
                                    <div className="form-tabs">
                                        <div className="form-tabs-container">
                                            <button 
                                                className={`form-tab ${activeForm === 'register' ? 'active' : ''}`}
                                                onClick={() => setActiveForm('register')}
                                            >
                                                Регистрация
                                            </button>
                                            <button 
                                                className={`form-tab ${activeForm === 'login' ? 'active' : ''}`}
                                                onClick={() => setActiveForm('login')}
                                            >
                                                Вход
                                            </button>
                                        </div>
                                    </div>

                                    {/* Форма регистрации */}
                                    {activeForm === 'register' && (
                                        <form id="registerForm" onSubmit={handleRegisterSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="regName" className="form-label">Имя</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-person"></i>
                                                    </span>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        id="regName" 
                                                        value={formData.register.name}
                                                        onChange={(e) => handleInputChange('register', 'name', e.target.value)}
                                                        placeholder="Введите ваше имя" 
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="regPhone" className="form-label">Телефон</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-telephone"></i>
                                                    </span>
                                                    <input 
                                                        type="tel" 
                                                        className="form-control" 
                                                        id="regPhone" 
                                                        value={formData.register.phone}
                                                        onChange={(e) => handleInputChange('register', 'phone', e.target.value)}
                                                        placeholder="+7 (999) 123-45-67" 
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="regEmail" className="form-label">Email</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-envelope"></i>
                                                    </span>
                                                    <input 
                                                        type="email" 
                                                        className="form-control" 
                                                        id="regEmail" 
                                                        value={formData.register.email}
                                                        onChange={(e) => handleInputChange('register', 'email', e.target.value)}
                                                        placeholder="Введите ваш email" 
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="regPassword" className="form-label">Пароль</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-lock"></i>
                                                    </span>
                                                    <input 
                                                        type="password" 
                                                        className="form-control" 
                                                        id="regPassword" 
                                                        value={formData.register.password}
                                                        onChange={(e) => handleInputChange('register', 'password', e.target.value)}
                                                        placeholder="Придумайте пароль" 
                                                        required 
                                                        minLength="7"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="regConfirmPassword" className="form-label">Подтверждение пароля</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-lock-fill"></i>
                                                    </span>
                                                    <input 
                                                        type="password" 
                                                        className="form-control" 
                                                        id="regConfirmPassword" 
                                                        value={formData.register.confirmPassword}
                                                        onChange={(e) => handleInputChange('register', 'confirmPassword', e.target.value)}
                                                        placeholder="Повторите пароль" 
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="location-info">
                                                <p>
                                                    <i className="bi bi-info-circle me-2"></i>
                                                    Сервис YarfPets в настоящее время доступен только в Санкт-Петербурге
                                                </p>
                                            </div>

                                            <div className="mb-3 form-check">
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input" 
                                                    id="agreeTerms" 
                                                    checked={formData.register.agreeTerms}
                                                    onChange={(e) => handleInputChange('register', 'agreeTerms', e.target.checked)}
                                                    required
                                                />
                                                <label className="form-check-label" htmlFor="agreeTerms">
                                                    Я согласен с условиями использования и политикой конфиденциальности
                                                </label>
                                            </div>

                                            <div className="d-grid mb-3">
                                                <button type="submit" className="btn btn-register btn-lg">
                                                    <i className="bi bi-person-plus me-2"></i>Зарегистрироваться
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Форма входа */}
                                    {activeForm === 'login' && (
                                        <form id="loginForm" onSubmit={handleLoginSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="loginEmail" className="form-label">Email</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-envelope"></i>
                                                    </span>
                                                    <input 
                                                        type="email" 
                                                        className="form-control" 
                                                        id="loginEmail" 
                                                        value={formData.login.email}
                                                        onChange={(e) => handleInputChange('login', 'email', e.target.value)}
                                                        placeholder="Введите ваш email" 
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="loginPassword" className="form-label">Пароль</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-lock"></i>
                                                    </span>
                                                    <input 
                                                        type="password" 
                                                        className="form-control" 
                                                        id="loginPassword" 
                                                        value={formData.login.password}
                                                        onChange={(e) => handleInputChange('login', 'password', e.target.value)}
                                                        placeholder="Введите ваш пароль" 
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-grid mb-3">
                                                <button type="submit" className="btn btn-register btn-lg">
                                                    <i className="bi bi-box-arrow-in-right me-2"></i>Войти
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <LogoutModal />
        </div>
    );
};

export default Register;