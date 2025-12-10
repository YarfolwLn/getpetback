import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FormTabs from '../components/FormTabs';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';
import PasswordRequirements from '../components/PasswordRequirements';
import ApiService from '../services/Api';
import AuthService from '../services/AuthService';
import { validateField } from '../utils/Validation';

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
                            setErrors({ general: 'Ошибка при автоматическом входе' });
                        }
                    } catch (loginError) {
                        console.error('Ошибка при автоматическом входе:', loginError);
                        setErrors({ general: 'Ошибка при автоматическом входе' });
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
                
                // Получаем данные пользователя
                let userData = { 
                    email: formData.login.email,
                    name: result.data.name || '',
                    phone: result.data.phone || ''
                };
                
                // Сохраняем данные авторизации
                AuthService.login(result.data.token, userData);
                
                setSuccessMessage('Вход выполнен успешно!');
                setTimeout(() => {
                    navigate('/profile');
                }, 1000);
                
            } else {
                console.error('Ошибка при входе: нет токена в ответе');
                setErrors({ general: 'Ошибка при входе' });
            }
            
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.status === 401 || error.status === 422) {
                setErrors({ general: 'Неверный email или пароль' });
            } else {
                setErrors({ general: 'Ошибка при подключении к серверу' });
            }
        } finally {
            setLoading(false);
        }
    };

    // Универсальный обработчик ввода
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
        
        // Очищаем общую ошибку при изменении любого поля
        if (errors.general) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.general;
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
            
            <div className="register-container main-content-container">
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
                                            <RegisterForm
                                                formData={formData.register}
                                                errors={errors}
                                                loading={loading}
                                                onInputChange={handleInputChange}
                                                renderPasswordRequirements={renderPasswordRequirements}
                                            />
                                        </form>
                                    )}

                                    {/* Форма входа */}
                                    {activeForm === 'login' && (
                                        <form onSubmit={handleLoginSubmit}>
                                            <LoginForm
                                                formData={formData.login}
                                                errors={errors}
                                                loading={loading}
                                                onInputChange={handleInputChange}
                                            />
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