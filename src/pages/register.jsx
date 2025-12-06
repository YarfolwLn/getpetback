// src/pages/register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import FormTabs from '../components/FormTabs';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';
import PasswordRequirements from '../components/PasswordRequirements';
import ApiService from '../services/api';
import AuthService from '../services/AuthService';
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

    // Проверяем, авторизован ли пользователь при загрузке
    useEffect(() => {
        if (AuthService.isAuthenticated()) {
            console.log('Пользователь уже авторизован, перенаправление в профиль');
            navigate('/profile');
        }
    }, [navigate]);

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
    
            console.log('Отправка данных регистрации:', { ...userData, password: '***' });
            
            // 1. Регистрация
            const response = await ApiService.register(userData);
            console.log('Ответ от регистрации:', response);
            
            if (response && !response.error) {
                setSuccessMessage('Регистрация успешна! Выполняется вход...');
                
                // 2. Автоматический вход после регистрации
                setTimeout(async () => {
                    try {
                        const loginResult = await ApiService.login(
                            formData.register.email,
                            formData.register.password
                        );
                        
                        console.log('Результат автоматического входа:', loginResult);
                        
                        if (loginResult && loginResult.data && loginResult.data.token) {
                            console.log('Автоматический вход выполнен, токен получен');
                            
                            // Сохраняем данные авторизации
                            AuthService.login(loginResult.data.token, {
                                name: formData.register.name,
                                email: formData.register.email,
                                phone: formData.register.phone
                            });
                            
                            setSuccessMessage('Регистрация и вход выполнены успешно!');
                            setTimeout(() => {
                                navigate('/profile');
                            }, 1000);
                        } else {
                            console.error('Ошибка при автоматическом входе: нет токена в ответе');
                            setErrors({ login: 'Ошибка при автоматическом входе' });
                        }
                    } catch (loginError) {
                        console.error('Ошибка при автоматическом входе:', loginError);
                        setErrors({ login: 'Ошибка при автоматическом входе' });
                    }
                }, 1500);
                
            } else {
                setErrors({ general: response?.error?.message || 'Ошибка при регистрации' });
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            
            if (error.status === 422) {
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
            console.log('Отправка данных входа:', {
                email: formData.login.email,
                password: '***'
            });
            
            // 1. Выполняем вход
            const result = await ApiService.login(
                formData.login.email,
                formData.login.password
            );
            
            console.log('Результат входа:', result);
            
            if (result && result.data && result.data.token) {
                console.log('Вход выполнен, токен получен');
                
                // Пытаемся найти пользователя по email для получения полных данных
                let userData = { email: formData.login.email };
                try {
                    const foundUser = await ApiService.findUserByEmail(formData.login.email);
                    if (foundUser) {
                        console.log('Пользователь найден:', foundUser);
                        userData = { ...userData, ...foundUser };
                    }
                } catch (userError) {
                    console.warn('Не удалось найти пользователя по email:', userError);
                }
                
                // Сохраняем данные авторизации
                AuthService.login(result.data.token, userData);
                
                setSuccessMessage('Вход выполнен успешно!');
                setTimeout(() => {
                    navigate('/profile');
                }, 1000);
                
            } else {
                console.error('Ошибка при входе: нет токена в ответе');
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

    // Исправленный обработчик ввода
    const handleRegisterInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            register: {
                ...prev.register,
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

    const handleLoginInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            login: {
                ...prev.login,
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

    const handleTabChange = (tab) => {
        setActiveForm(tab);
        setErrors({});
        setSuccessMessage('');
    };

    const renderPasswordRequirements = () => (
        <PasswordRequirements password={formData.register.password} />
    );

    return (
        <div>
            <Header />
            
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
                                    <FormTabs 
                                        activeForm={activeForm}
                                        onTabChange={handleTabChange}
                                    />

                                    {/* Форма регистрации */}
                                    {activeForm === 'register' && (
                                        <form onSubmit={handleRegisterSubmit}>
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
                                                        onChange={(e) => handleRegisterInputChange('name', e.target.value)}
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
                                                        onChange={(e) => handleRegisterInputChange('phone', e.target.value)}
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
                                                        onChange={(e) => handleRegisterInputChange('email', e.target.value)}
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
                                                        onChange={(e) => handleRegisterInputChange('password', e.target.value)}
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
                                                        onChange={(e) => handleRegisterInputChange('confirmPassword', e.target.value)}
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
                                                    onChange={(e) => handleRegisterInputChange('agreeTerms', e.target.checked)}
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
                                        <form onSubmit={handleLoginSubmit}>
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
                                                        onChange={(e) => handleLoginInputChange('email', e.target.value)}
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
                                                        onChange={(e) => handleLoginInputChange('password', e.target.value)}
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
        </div>
    );
};

export default Register;