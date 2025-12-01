// src/pages/register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import LogoutModal from '../components/logout-modal';
import ApiService from '../services/api';
import { validateField } from '../utils/validation';

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
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // Валидация формы регистрации
    const validateRegisterForm = () => {
        const newErrors = {};
        const { name, phone, email, password, confirmPassword, agreeTerms } = formData.register;

        // Имя
        const nameValidation = validateField('name', name);
        if (!name || !nameValidation.isValid) {
            newErrors.name = nameValidation.message || 'Введите ваше имя';
        }

        // Телефон
        const phoneValidation = validateField('phone', phone);
        if (!phone || !phoneValidation.isValid) {
            newErrors.phone = phoneValidation.message || 'Введите корректный номер телефона';
        }

        // Email
        const emailValidation = validateField('email', email);
        if (!email || !emailValidation.isValid) {
            newErrors.email = emailValidation.message || 'Введите корректный email';
        }

        // Пароль
        const passwordValidation = validateField('password', password);
        if (!password || !passwordValidation.isValid) {
            newErrors.password = passwordValidation.message || 'Введите корректный пароль';
        }

        // Подтверждение пароля
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        // Согласие с условиями
        if (!agreeTerms) {
            newErrors.agreeTerms = 'Необходимо согласие на обработку персональных данных';
        }

        return newErrors;
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateRegisterForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const userData = {
                name: formData.register.name,
                phone: formData.register.phone,
                email: formData.register.email,
                password: formData.register.password,
                password_confirmation: formData.register.confirmPassword,
                confirm: formData.register.agreeTerms ? 1 : 0
            };

            const response = await ApiService.register(userData);
            
            if (response && !response.error) {
                setSuccessMessage('Регистрация успешна! Выполняется вход...');
                
                // Автоматический вход после регистрации
                setTimeout(async () => {
                    try {
                        const loginResult = await ApiService.login(
                            formData.register.email,
                            formData.register.password
                        );
                        
                        if (loginResult && loginResult.data && loginResult.data.token) {
                            navigate('/profile');
                        }
                    } catch (loginError) {
                        setErrors({ login: 'Ошибка при автоматическом входе' });
                    }
                }, 1500);
                
            } else {
                setErrors({ general: response.error?.message || 'Ошибка при регистрации' });
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            
            if (error.status === 422) {
                // Ошибки валидации с сервера
                const serverErrors = error.data?.error?.errors || {};
                const formattedErrors = {};
                
                Object.keys(serverErrors).forEach(key => {
                    if (Array.isArray(serverErrors[key])) {
                        formattedErrors[key] = serverErrors[key][0];
                    } else {
                        formattedErrors[key] = serverErrors[key];
                    }
                });
                
                setErrors(formattedErrors);
            } else {
                setErrors({ general: 'Ошибка при подключении к серверу' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const result = await ApiService.login(
                formData.login.email,
                formData.login.password
            );
            
            if (result && result.data && result.data.token) {
                setSuccessMessage('Вход выполнен успешно!');
                setTimeout(() => {
                    navigate('/profile');
                }, 1000);
            } else {
                setErrors({ login: 'Ошибка при входе' });
            }
            
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.status === 401 || error.status === 422) {
                setErrors({ login: 'Неверный email или пароль' });
            } else {
                setErrors({ login: 'Ошибка при подключении к серверу' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (formType, field, value) => {
        setFormData(prev => ({
            ...prev,
            [formType]: {
                ...prev[formType],
                [field]: value
            }
        }));
        
        // Очищаем ошибку при изменении поля
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const renderPasswordRequirements = () => {
        const password = formData.register.password;
        const requirements = [
            { text: 'Минимум 7 символов', met: password.length >= 7 },
            { text: 'Хотя бы 1 цифра', met: /\d/.test(password) },
            { text: 'Хотя бы 1 строчная буква', met: /[a-z]/.test(password) },
            { text: 'Хотя бы 1 заглавная буква', met: /[A-Z]/.test(password) }
        ];

        return (
            <div className="password-requirements mt-2">
                {requirements.map((req, index) => (
                    <div key={index} className={`requirement ${req.met ? 'met' : 'unmet'}`}>
                        <i className={`bi ${req.met ? 'bi-check-circle' : 'bi-circle'}`}></i>
                        <span>{req.text}</span>
                    </div>
                ))}
            </div>
        );
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
                                    {/* Сообщения об ошибках и успехе */}
                                    {errors.general && (
                                        <div className="alert alert-danger" role="alert">
                                            {errors.general}
                                        </div>
                                    )}
                                    
                                    {successMessage && (
                                        <div className="alert alert-success" role="alert">
                                            {successMessage}
                                        </div>
                                    )}

                                    {/* Табы для переключения между формами */}
                                    <div className="form-tabs">
                                        <div className="form-tabs-container">
                                            <button 
                                                className={`form-tab ${activeForm === 'register' ? 'active' : ''}`}
                                                onClick={() => {
                                                    setActiveForm('register');
                                                    setErrors({});
                                                    setSuccessMessage('');
                                                }}
                                            >
                                                Регистрация
                                            </button>
                                            <button 
                                                className={`form-tab ${activeForm === 'login' ? 'active' : ''}`}
                                                onClick={() => {
                                                    setActiveForm('login');
                                                    setErrors({});
                                                    setSuccessMessage('');
                                                }}
                                            >
                                                Вход
                                            </button>
                                        </div>
                                    </div>

                                    {/* Форма регистрации */}
                                    {activeForm === 'register' && (
                                        <form id="registerForm" onSubmit={handleRegisterSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="regName" className="form-label">Имя *</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-person"></i>
                                                    </span>
                                                    <input 
                                                        type="text" 
                                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                        id="regName" 
                                                        value={formData.register.name}
                                                        onChange={(e) => handleInputChange('register', 'name', e.target.value)}
                                                        placeholder="Введите ваше имя" 
                                                        required
                                                        disabled={loading}
                                                    />
                                                    {errors.name && (
                                                        <div className="invalid-feedback">
                                                            {errors.name}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="regPhone" className="form-label">Телефон *</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-telephone"></i>
                                                    </span>
                                                    <input 
                                                        type="tel" 
                                                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                        id="regPhone" 
                                                        value={formData.register.phone}
                                                        onChange={(e) => handleInputChange('register', 'phone', e.target.value)}
                                                        placeholder="+7 (999) 123-45-67" 
                                                        required
                                                        disabled={loading}
                                                    />
                                                    {errors.phone && (
                                                        <div className="invalid-feedback">
                                                            {errors.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="regEmail" className="form-label">Email *</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-envelope"></i>
                                                    </span>
                                                    <input 
                                                        type="email" 
                                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                        id="regEmail" 
                                                        value={formData.register.email}
                                                        onChange={(e) => handleInputChange('register', 'email', e.target.value)}
                                                        placeholder="Введите ваш email" 
                                                        required
                                                        disabled={loading}
                                                    />
                                                    {errors.email && (
                                                        <div className="invalid-feedback">
                                                            {errors.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="regPassword" className="form-label">Пароль *</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-lock"></i>
                                                    </span>
                                                    <input 
                                                        type="password" 
                                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                        id="regPassword" 
                                                        value={formData.register.password}
                                                        onChange={(e) => handleInputChange('register', 'password', e.target.value)}
                                                        placeholder="Придумайте пароль" 
                                                        required 
                                                        minLength="7"
                                                        disabled={loading}
                                                    />
                                                    {errors.password && (
                                                        <div className="invalid-feedback">
                                                            {errors.password}
                                                        </div>
                                                    )}
                                                </div>
                                                {renderPasswordRequirements()}
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="regConfirmPassword" className="form-label">Подтверждение пароля *</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-lock-fill"></i>
                                                    </span>
                                                    <input 
                                                        type="password" 
                                                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                                        id="regConfirmPassword" 
                                                        value={formData.register.confirmPassword}
                                                        onChange={(e) => handleInputChange('register', 'confirmPassword', e.target.value)}
                                                        placeholder="Повторите пароль" 
                                                        required
                                                        disabled={loading}
                                                    />
                                                    {errors.confirmPassword && (
                                                        <div className="invalid-feedback">
                                                            {errors.confirmPassword}
                                                        </div>
                                                    )}
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
                                                    className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                                                    id="agreeTerms" 
                                                    checked={formData.register.agreeTerms}
                                                    onChange={(e) => handleInputChange('register', 'agreeTerms', e.target.checked)}
                                                    required
                                                    disabled={loading}
                                                />
                                                <label className="form-check-label" htmlFor="agreeTerms">
                                                    Я согласен с условиями использования и политикой конфиденциальности *
                                                </label>
                                                {errors.agreeTerms && (
                                                    <div className="invalid-feedback">
                                                        {errors.agreeTerms}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="d-grid mb-3">
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-register btn-lg"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Регистрация...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-person-plus me-2"></i>Зарегистрироваться
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Форма входа */}
                                    {activeForm === 'login' && (
                                        <form id="loginForm" onSubmit={handleLoginSubmit}>
                                            {errors.login && (
                                                <div className="alert alert-danger" role="alert">
                                                    {errors.login}
                                                </div>
                                            )}
                                            
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
                                                        disabled={loading}
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
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-grid mb-3">
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-register btn-lg"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Вход...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-box-arrow-in-right me-2"></i>Войти
                                                        </>
                                                    )}
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