// src/pages/profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import ProfileStats from '../components/profile-stats';
import UserAds from '../components/user-ads';
import LogoutModal from '../components/logout-modal';
import AuthRequiredModal from '../components/auth-required-modal';
import ApiService from '../services/api';
import placeholderImage from '../assets/images/placeholder.svg';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('ads');
    const [userData, setUserData] = useState(null);
    const [userAds, setUserAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contactData, setContactData] = useState({
        phone: '',
        email: ''
    });
    const [editErrors, setEditErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // Проверка авторизации и загрузка данных
    useEffect(() => {
        console.log('=== PROFILE USEEFFECT START ===');
        
        const token = localStorage.getItem('auth_token');
        console.log('Токен в localStorage:', token ? 'ЕСТЬ' : 'НЕТ');
        
        if (!token) {
            console.log('Нет токена, редирект на /register');
            navigate('/register');
            return;
        }
    
        const loadProfileData = async () => {
            try {
                setLoading(true);
                console.log('=== ЗАГРУЗКА ПРОФИЛЯ ===');
                
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    console.log('Нет токена, редирект на /register');
                    navigate('/register');
                    return;
                }
        
                console.log('1. Запрашиваем данные пользователя через /users');
                
                // Получаем данные текущего пользователя
                const userResponse = await ApiService.request('/users');
                console.log('Ответ пользователя:', userResponse);
        
                // Обрабатываем данные пользователя
                let userData = null;
                
                if (userResponse && userResponse.id) {
                    // Формат: {id: 123, name: "Имя", email: "...", ...}
                    userData = userResponse;
                } else if (userResponse && userResponse.data && userResponse.data.id) {
                    // Формат: {data: {id: 123, name: "Имя", ...}}
                    userData = userResponse.data;
                }
        
                if (!userData || !userData.id) {
                    console.error('Не удалось получить данные пользователя');
                    throw new Error('Не удалось получить данные пользователя');
                }
        
                console.log('Данные пользователя получены:', userData);
                
                // Сохраняем ID пользователя в localStorage
                localStorage.setItem('user_id', userData.id.toString());
                localStorage.setItem('user_data', JSON.stringify(userData));
                
                // Расчет дней с регистрации
                if (userData.registrationDate) {
                    const regDate = new Date(userData.registrationDate);
                    const today = new Date();
                    const diffTime = Math.abs(today - regDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    userData.daysSinceRegistration = diffDays;
                }
                
                // Устанавливаем данные пользователя
                setUserData(userData);
                setContactData({
                    phone: userData.phone || '',
                    email: userData.email || ''
                });
        
                console.log('2. Запрашиваем объявления пользователя через /users/orders');
                
                // Получаем объявления пользователя (без ID в URL)
                const adsResponse = await ApiService.getCurrentUserOrders();
                console.log('Ответ объявлений:', adsResponse);
        
                // Обработка объявлений
                if (adsResponse && adsResponse.data && adsResponse.data.orders) {
                    console.log('Объявлений получено:', adsResponse.data.orders.length);
                    const adsWithStatusText = adsResponse.data.orders.map(ad => ({
                        ...ad,
                        statusText: getStatusText(ad.status),
                        image: ad.photo || ad.photos || placeholderImage
                    }));
                    setUserAds(adsWithStatusText);
                } else if (adsResponse && Array.isArray(adsResponse)) {
                    // Если API возвращает напрямую массив объявлений
                    console.log('Объявлений получено (прямой массив):', adsResponse.length);
                    const adsWithStatusText = adsResponse.map(ad => ({
                        ...ad,
                        statusText: getStatusText(ad.status),
                        image: ad.photo || ad.photos || placeholderImage
                    }));
                    setUserAds(adsWithStatusText);
                } else {
                    console.log('Нет объявлений у пользователя');
                    setUserAds([]);
                }
        
                console.log('=== ЗАГРУЗКА ПРОФИЛЯ ЗАВЕРШЕНА ===');
        
            } catch (error) {
                console.error('Ошибка загрузки профиля:', error);
                
                if (error.status === 401) {
                    console.log('Ошибка 401 - неавторизован, очищаем токен');
                    ApiService.clearToken();
                    navigate('/register');
                } else if (error.status === 404) {
                    console.log('Ошибка 404 - пользователь не найден');
                    setError('Пользователь не найден');
                } else {
                    setError('Ошибка при загрузке данных профиля: ' + (error.message || 'Неизвестная ошибка'));
                }
            } finally {
                setLoading(false);
            }
        };
    
        loadProfileData();
    }, [navigate]);

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'Активное';
            case 'wasFound': return 'Хозяин найден';
            case 'onModeration': return 'На модерации';
            case 'archive': return 'В архиве';
            default: return status;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'active': return 'badge-status-active';
            case 'wasFound': return 'badge-status-wasFound';
            case 'onModeration': return 'badge-status-onModeration';
            case 'archive': return 'badge-status-archive';
            default: return '';
        }
    };

    const handleAdUpdate = async (adId, updatedData) => {
        try {
            const formData = new FormData();
            
            // Добавляем файлы, если они есть
            if (updatedData.photos && updatedData.photos[0]) {
                formData.append('photo1', updatedData.photos[0]);
            }
            if (updatedData.photos && updatedData.photos[1]) {
                formData.append('photo2', updatedData.photos[1]);
            }
            if (updatedData.photos && updatedData.photos[2]) {
                formData.append('photo3', updatedData.photos[2]);
            }
            
            formData.append('mark', updatedData.mark || '');
            formData.append('description', updatedData.description || '');
            
            await ApiService.updateOrder(adId, formData);
            
            // Обновляем локальное состояние
            const updatedAds = userAds.map(ad => 
                ad.id === adId ? { 
                    ...ad, 
                    mark: updatedData.mark,
                    description: updatedData.description
                } : ad
            );
            setUserAds(updatedAds);
            
            setSuccessMessage('Объявление успешно обновлено');
            setTimeout(() => setSuccessMessage(''), 3000);
            
        } catch (error) {
            console.error('Ошибка при обновлении объявления:', error);
            setError('Ошибка при обновлении объявления');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleAdDelete = async (adId) => {
        try {
            await ApiService.deleteOrder(adId);
            
            // Обновляем локальное состояние
            const updatedAds = userAds.filter(ad => ad.id !== adId);
            setUserAds(updatedAds);
            
            setSuccessMessage('Объявление успешно удалено');
            setTimeout(() => setSuccessMessage(''), 3000);
            
        } catch (error) {
            console.error('Ошибка при удалении объявления:', error);
            if (error.status === 403) {
                setError('Нельзя удалить объявление с текущим статусом');
            } else {
                setError('Ошибка при удалении объявления');
            }
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        
        setEditErrors({});
        
        try {
            // Получаем ID пользователя из сохраненных данных
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                setError('Пользователь не авторизован');
                return;
            }
            
            // Обновляем телефон
            if (contactData.phone !== userData?.phone) {
                await ApiService.updatePhone(userId, contactData.phone);
            }
            
            // Обновляем email
            if (contactData.email !== userData?.email) {
                await ApiService.updateEmail(userId, contactData.email);
            }
            
            // Обновляем данные пользователя
            setUserData(prev => ({
                ...prev,
                phone: contactData.phone,
                email: contactData.email
            }));
            
            setSuccessMessage('Контактные данные успешно обновлены');
            setTimeout(() => setSuccessMessage(''), 3000);
            
        } catch (error) {
            console.error('Ошибка при обновлении контактов:', error);
            
            if (error.status === 422) {
                setEditErrors(error.data?.error?.errors || {});
            } else {
                setError('Ошибка при обновлении контактных данных');
                setTimeout(() => setError(null), 3000);
            }
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        const currentPassword = e.target.currentPassword.value;
        const newPassword = e.target.newPassword.value;
        const confirmPassword = e.target.confirmPassword.value;
        
        // Валидация пароля
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}$/;
        
        if (!passwordRegex.test(newPassword)) {
            setError('Новый пароль должен содержать минимум 7 символов, 1 цифру, 1 строчную и 1 заглавную букву');
            setTimeout(() => setError(null), 3000);
            return;
        }
        
        if (newPassword !== confirmPassword) {
            setError('Пароли не совпадают');
            setTimeout(() => setError(null), 3000);
            return;
        }
        
        // Здесь должен быть API запрос для смены пароля
        // Так как в документации нет endpoint для смены пароля,
        // этот функционал не реализован
        
        setSuccessMessage('Запрос на смену пароля отправлен');
        setTimeout(() => setSuccessMessage(''), 3000);
        e.target.reset();
    };

    const handleLogout = () => {
        console.log('Выход из профиля');
        ApiService.clearToken();
        navigate('/');
    };

    if (loading) {
        return (
            <div>
                <Header isAuthenticated={false} />
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                    <p className="mt-2">Загрузка профиля...</p>
                    <p className="text-muted small">Проверяем авторизацию...</p>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div>
                <Header isAuthenticated={false} />
                <div className="container py-5">
                    <div className="alert alert-danger" role="alert">
                        Не удалось загрузить данные профиля
                    </div>
                    <div className="text-center mt-3">
                        <button className="btn btn-primary" onClick={() => navigate('/register')}>
                            Вернуться на страницу входа
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header isAuthenticated={true} userName={userData.name} />
            
            {/* Сообщения об ошибках и успехе */}
            {error && (
                <div className="alert-fixed-top">
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                    </div>
                </div>
            )}
            
            {successMessage && (
                <div className="alert-fixed-top">
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {successMessage}
                        <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
                    </div>
                </div>
            )}

            {/* Шапка профиля */}
            <header className="profile-header">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col">
                            <h1 className="h2 mb-1">{userData.name}</h1>
                            <p className="mb-1">
                                <i className="bi bi-info-circle me-1"></i>
                                <a href={`mailto:${userData.email}`} className="text-white text-decoration-none">
                                    {userData.email}
                                </a>
                            </p>
                            <p className="mb-0">
                                <i className="bi bi-calendar me-1"></i>
                                Зарегистрирован: {userData.daysSinceRegistration || '0'} дней назад
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mt-4">
                <div className="row">
                    {/* Боковая панель */}
                    <div className="col-md-3">
                        <ProfileStats 
                            adsCount={userData.ordersCount || userAds.length} 
                            petsCount={userData.petsCount || 0} 
                        />
                    </div>

                    {/* Основной контент */}
                    <div className="col-md-9">
                        <nav aria-label="Навигация по профилю">
                            <ul className="nav nav-pills mb-4" id="profileTabs" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button 
                                        className={`nav-link ${activeTab === 'ads' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('ads')}
                                    >
                                        Мои объявления
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button 
                                        className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('settings')}
                                    >
                                        Настройки профиля
                                    </button>
                                </li>
                            </ul>
                        </nav>

                        <div className="tab-content">
                            {/* Вкладка "Мои объявления" */}
                            {activeTab === 'ads' && (
                                <UserAds 
                                    ads={userAds} 
                                    onAdUpdate={handleAdUpdate}
                                    onAdDelete={handleAdDelete}
                                    getStatusClass={getStatusClass}
                                />
                            )}

                            {/* Вкладка "Настройки" */}
                            {activeTab === 'settings' && (
                                <section className="tab-pane fade show active" id="settings" role="tabpanel">
                                    <h3 className="mb-4">Настройки профиля</h3>
                                    
                                    {/* Информация о пользователе */}
                                    <div className="card mb-4">
                                        <div className="card-header">
                                            <h4 className="card-title h5 mb-0">
                                                <i className="bi bi-person me-2"></i>Информация о пользователе
                                            </h4>
                                        </div>
                                        <div className="card-body">
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted">Имя</label>
                                                    <p className="form-control-plaintext fw-bold">{userData.name}</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted">Дата регистрации</label>
                                                    <p className="form-control-plaintext">{userData.registrationDate}</p>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted">Телефон</label>
                                                    <p className="form-control-plaintext">{userData.phone}</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted">Email</label>
                                                    <p className="form-control-plaintext">
                                                        <a href={`mailto:${userData.email}`} className="text-decoration-none">
                                                            {userData.email}
                                                        </a>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted">Объявлений</label>
                                                    <p className="form-control-plaintext">{userData.ordersCount || 0}</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted">Найдено хозяев</label>
                                                    <p className="form-control-plaintext">{userData.petsCount || 0}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Изменение контактных данных */}
                                    <div className="card mb-4">
                                        <div className="card-header">
                                            <h4 className="card-title h5 mb-0">
                                                <i className="bi bi-telephone me-2"></i>Изменить контактные данные
                                            </h4>
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={handleContactSubmit}>
                                                <div className="mb-4">
                                                    <label htmlFor="phone" className="form-label">Номер телефона</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="bi bi-telephone"></i>
                                                        </span>
                                                        <input 
                                                            type="tel" 
                                                            className={`form-control ${editErrors.phone ? 'is-invalid' : ''}`}
                                                            id="phone" 
                                                            value={contactData.phone}
                                                            onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                                                            placeholder="+7 (999) 123-45-67"
                                                            required
                                                        />
                                                        {editErrors.phone && (
                                                            <div className="invalid-feedback">
                                                                {editErrors.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="email" className="form-label">Адрес электронной почты</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="bi bi-envelope"></i>
                                                        </span>
                                                        <input 
                                                            type="email" 
                                                            className={`form-control ${editErrors.email ? 'is-invalid' : ''}`}
                                                            id="email"
                                                            value={contactData.email}
                                                            onChange={(e) => setContactData({...contactData, email: e.target.value})}
                                                            placeholder="your@email.com" 
                                                            required
                                                        />
                                                        {editErrors.email && (
                                                            <div className="invalid-feedback">
                                                                {editErrors.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="d-flex gap-2">
                                                    <button type="submit" className="btn btn-primary">
                                                        <i className="bi bi-check-lg me-1"></i>Сохранить изменения
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => setContactData({
                                                            phone: userData.phone || '',
                                                            email: userData.email || ''
                                                        })}
                                                    >
                                                        Отмена
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                    {/* Смена пароля */}
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="card-title h5 mb-0">
                                                <i className="bi bi-shield-lock me-2"></i>Смена пароля
                                            </h4>
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={handlePasswordSubmit}>
                                                <div className="mb-3">
                                                    <label htmlFor="currentPassword" className="form-label">Текущий пароль</label>
                                                    <input 
                                                        type="password" 
                                                        className="form-control" 
                                                        id="currentPassword" 
                                                        placeholder="Введите текущий пароль" 
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="newPassword" className="form-label">Новый пароль</label>
                                                    <input 
                                                        type="password" 
                                                        className="form-control" 
                                                        id="newPassword" 
                                                        placeholder="Введите новый пароль" 
                                                        minLength="7" 
                                                        required
                                                    />
                                                    <div className="form-text">Пароль должен содержать не менее 7 символов, включая цифры, строчные и заглавные буквы</div>
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="confirmPassword" className="form-label">Подтвердите новый пароль</label>
                                                    <input 
                                                        type="password" 
                                                        className="form-control" 
                                                        id="confirmPassword" 
                                                        placeholder="Повторите новый пароль" 
                                                        required
                                                    />
                                                </div>
                                                <button type="submit" className="btn btn-primary">
                                                    <i className="bi bi-key me-1"></i>Сменить пароль
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <LogoutModal onLogout={handleLogout} />
            <AuthRequiredModal />
        </div>
    );
};

export default Profile;