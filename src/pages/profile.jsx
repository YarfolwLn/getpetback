import React, { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import ProfileStats from '../components/profile-stats';
import UserAds from '../components/user-ads';
import LogoutModal from '../components/logout-modal';
import AuthRequiredModal from '../components/auth-required-modal';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('ads');
    const [userData, setUserData] = useState({
        name: 'Иван',
        email: 'ivan.petrov@example.com',
        phone: '+7 (999) 123-45-67',
        registrationDate: '152 дня назад'
    });

    const [contactData, setContactData] = useState({
        phone: '+7 (999) 123-45-67',
        email: 'ivan.petrov@example.com'
    });

    const userAds = [
        {
            id: 1,
            title: "Найдена кошка",
            description: "Найдена кошка, порода Сфинкс, очень грустная",
            image: "images/cat.jpg",
            district: "Василеостровский район",
            date: "12.01.2024",
            status: "active",
            statusText: "Активное",
            mark: "VL-0214"
        },
        {
            id: 2,
            title: "Пропала белка",
            description: "Домашняя белка пропала из вольера. Откликается на кличку 'Пуша'.",
            image: "images/belka.jpg",
            district: "Петроградский район",
            date: "05.01.2024",
            status: "wasFound",
            statusText: "Хозяин найден",
            mark: "BL-0156"
        }
    ];

    const handleContactSubmit = (e) => {
        e.preventDefault();
        // Логика сохранения контактных данных
        console.log('Сохранение контактных данных:', contactData);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        // Логика смены пароля
        console.log('Смена пароля');
    };

    return (
        <div>
            <Header isAuthenticated={true} userName={userData.name} />
            
            {/* Шапка профиля */}
            <header className="profile-header">
                <div className="content-container">
                    <div className="row align-items-center">
                        <div className="col">
                            <h1 className="h2 mb-1">{userData.name}</h1>
                            <p className="mb-1">
                                <i className="bi bi-info-circle me-1"></i>
                                <a href={`mailto:${userData.email}`}>{userData.email}</a>
                            </p>
                            <p className="mb-0">
                                <i className="bi bi-calendar me-1"></i>
                                Зарегистрирован: {userData.registrationDate}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="content-container">
                <div className="row">
                    {/* Боковая панель */}
                    <div className="col-md-3">
                        <ProfileStats adsCount={userAds.length} petsCount={1} />
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
                                <UserAds ads={userAds} />
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
                                                    <p className="form-control-plaintext">{userData.name}</p>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label text-muted">Номер телефона</label>
                                                <p className="form-control-plaintext">{userData.phone}</p>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label text-muted">Адрес электронной почты</label>
                                                <p className="form-control-plaintext">
                                                    <a href={`mailto:${userData.email}`}>{userData.email}</a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Изменение контактных данных */}
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="card-title h5 mb-0">
                                                <i className="bi bi-telephone me-2"></i>Контактные данные
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
                                                            className="form-control" 
                                                            id="phone" 
                                                            value={contactData.phone}
                                                            onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                                                            placeholder="+7 (999) 123-45-67"
                                                        />
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
                                                            className="form-control" 
                                                            id="email"
                                                            value={contactData.email}
                                                            onChange={(e) => setContactData({...contactData, email: e.target.value})}
                                                            placeholder="your@email.com" 
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="d-flex gap-2">
                                                    <button type="submit" className="btn btn-primary">
                                                        <i className="bi bi-check-lg me-1"></i>Сохранить изменения
                                                    </button>
                                                    <button type="reset" className="btn btn-outline-secondary">
                                                        <i className="bi bi-arrow-clockwise me-1"></i>Отменить
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                    {/* Смена пароля */}
                                    <div className="card mt-4">
                                        <div className="card-header">
                                            <h4 className="card-title h5 mb-0">
                                                <i className="bi bi-shield-lock me-2"></i>Безопасность
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
                                                        minLength="6" 
                                                        required
                                                    />
                                                    <div className="form-text">Пароль должен содержать не менее 6 символов</div>
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="confirmPassword" className="form-label">Подтверждение пароля</label>
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
            <LogoutModal />
            <AuthRequiredModal />
        </div>
    );
};

export default Profile;