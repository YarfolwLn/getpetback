// src/pages/pet-details.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import ApiService from '../services/api';
import placeholderImage from '../assets/images/placeholder.svg';

const PetDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const loadPetDetails = async () => {
            try {
                setLoading(true);
                const response = await ApiService.getPetDetails(id);
                
                if (response && response.data && response.data.pet && response.data.pet.length > 0) {
                    setPet(response.data.pet[0]);
                } else {
                    setError('Животное не найдено');
                }
            } catch (error) {
                console.error('Ошибка при загрузке информации о животном:', error);
                
                if (error.status === 404) {
                    setError('Животное не найдено');
                } else if (error.status === 204) {
                    setError('Информация о животном отсутствует');
                } else {
                    setError('Ошибка при загрузке информации');
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadPetDetails();
        }
    }, [id]);

    const handlePreviousImage = () => {
        if (pet && pet.photos && pet.photos.length > 0) {
            setActiveImageIndex((prevIndex) => 
                prevIndex === 0 ? pet.photos.length - 1 : prevIndex - 1
            );
        }
    };

    const handleNextImage = () => {
        if (pet && pet.photos && pet.photos.length > 0) {
            setActiveImageIndex((prevIndex) => 
                prevIndex === pet.photos.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Не указана';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    // Получаем массив фото для отображения
    const getPhotosArray = () => {
        if (!pet) return [];
        
        // Если есть массив photos
        if (pet.photos && Array.isArray(pet.photos) && pet.photos.length > 0) {
            return pet.photos;
        }
        
        // Если есть одно фото
        if (pet.photo) {
            return [pet.photo];
        }
        
        return [];
    };

    const photos = getPhotosArray();

    if (loading) {
        return (
            <div>
                <Header isAuthenticated={false} />
                <div className="container py-5 text-center">
                    <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                    <p className="mt-3">Загрузка информации о животном...</p>
                </div>
            </div>
        );
    }

    if (error || !pet) {
        return (
            <div>
                <Header isAuthenticated={false} />
                <div className="container py-5">
                    <div className="alert alert-danger" role="alert">
                        {error || 'Животное не найдено'}
                    </div>
                    <button 
                        className="btn btn-primary mt-3"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left me-2"></i>Вернуться назад
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header isAuthenticated={false} />
            
            <div className="container py-5">
                <button 
                    className="btn btn-outline-secondary mb-4"
                    onClick={() => navigate(-1)}
                >
                    <i className="bi bi-arrow-left me-2"></i>Назад к поиску
                </button>
                
                <div className="card">
                    <div className="row g-0">
                        {/* Изображения */}
                        <div className="col-md-6">
                            <div className="position-relative" style={{ minHeight: '400px' }}>
                                {photos.length > 0 ? (
                                    <>
                                        <img 
                                            src={photos[activeImageIndex] || placeholderImage} 
                                            className="img-fluid rounded-start w-100 h-100" 
                                            alt={pet.kind}
                                            style={{ objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.src = placeholderImage;
                                                e.target.style.objectFit = 'contain';
                                            }}
                                        />
                                        
                                        {/* Навигация по изображениям */}
                                        {photos.length > 1 && (
                                            <>
                                                <button 
                                                    className="btn btn-primary position-absolute top-50 start-0 translate-middle-y ms-3"
                                                    onClick={handlePreviousImage}
                                                    style={{ zIndex: 1 }}
                                                >
                                                    <i className="bi bi-chevron-left"></i>
                                                </button>
                                                <button 
                                                    className="btn btn-primary position-absolute top-50 end-0 translate-middle-y me-3"
                                                    onClick={handleNextImage}
                                                    style={{ zIndex: 1 }}
                                                >
                                                    <i className="bi bi-chevron-right"></i>
                                                </button>
                                                
                                                {/* Индикаторы */}
                                                <div className="position-absolute bottom-0 start-0 end-0 mb-3">
                                                    <div className="d-flex justify-content-center">
                                                        {photos.map((_, index) => (
                                                            <button
                                                                key={index}
                                                                className={`btn btn-sm mx-1 ${index === activeImageIndex ? 'btn-primary' : 'btn-secondary'}`}
                                                                onClick={() => setActiveImageIndex(index)}
                                                                style={{ width: '10px', height: '10px', padding: 0 }}
                                                            >
                                                                <span className="visually-hidden">Изображение {index + 1}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="d-flex justify-content-center align-items-center w-100 h-100 bg-light rounded-start">
                                        <div className="text-center">
                                            <i className="bi bi-image" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                                            <p className="mt-2 text-muted">Нет фотографий</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Информация */}
                        <div className="col-md-6">
                            <div className="card-body h-100 d-flex flex-column">
                                <h1 className="card-title mb-3">{pet.kind}</h1>
                                
                                <div className="mb-4">
                                    <h5 className="fw-bold">Описание</h5>
                                    <p className="card-text">{pet.description || 'Описание отсутствует'}</p>
                                </div>
                                
                                <div className="mt-auto">
                                    <h5 className="fw-bold mb-3">Детали</h5>
                                    <table className="table table-borderless">
                                        <tbody>
                                            <tr>
                                                <th className="text-muted" style={{ width: '40%' }}>ID объявления:</th>
                                                <td>{pet.id}</td>
                                            </tr>
                                            <tr>
                                                <th className="text-muted">Район:</th>
                                                <td>{pet.district || 'Не указан'}</td>
                                            </tr>
                                            <tr>
                                                <th className="text-muted">Дата:</th>
                                                <td>{formatDate(pet.date)}</td>
                                            </tr>
                                            <tr>
                                                <th className="text-muted">Клеймо:</th>
                                                <td>{pet.mark || 'Не указано'}</td>
                                            </tr>
                                            <tr>
                                                <th className="text-muted">Статус:</th>
                                                <td>
                                                    <span className="badge bg-success">
                                                        {pet.registered ? 'Зарегистрировано' : 'Не зарегистрировано'}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    
                                    <h5 className="fw-bold mb-3 mt-4">Контактная информация</h5>
                                    <table className="table table-borderless">
                                        <tbody>
                                            <tr>
                                                <th className="text-muted" style={{ width: '40%' }}>Имя:</th>
                                                <td>{pet.name || 'Не указано'}</td>
                                            </tr>
                                            <tr>
                                                <th className="text-muted">Телефон:</th>
                                                <td>
                                                    {pet.phone ? (
                                                        <a href={`tel:${pet.phone}`} className="text-decoration-none">
                                                            {pet.phone}
                                                        </a>
                                                    ) : 'Не указан'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="text-muted">Email:</th>
                                                <td>
                                                    {pet.email ? (
                                                        <a href={`mailto:${pet.email}`} className="text-decoration-none">
                                                            {pet.email}
                                                        </a>
                                                    ) : 'Не указан'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    
                                    <div className="mt-4">
                                        <button 
                                            className="btn btn-primary me-2"
                                            onClick={() => window.history.back()}
                                        >
                                            <i className="bi bi-arrow-left me-1"></i>Назад
                                        </button>
                                        <button 
                                            className="btn btn-outline-primary"
                                            onClick={() => navigate('/search')}
                                        >
                                            <i className="bi bi-search me-1"></i>Поиск других животных
                                        </button>
                                    </div>
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

export default PetDetails;