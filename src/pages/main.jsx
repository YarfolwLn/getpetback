// src/pages/main.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import CompanyInfo from '../components/company-info';
import NewsletterSection from '../components/newsletter-section';
import SearchHeader from '../components/search-header';
import ApiService from '../services/api';
import placeholderImage from '../assets/images/placeholder.svg';

const Main = () => {
    const [sliderPets, setSliderPets] = useState([]);
    const [recentPets, setRecentPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSlider, setShowSlider] = useState(true);

    // Загрузка данных для слайдера
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                
                // Загрузка слайдера
                const sliderResponse = await ApiService.getPetsSlider();
                if (sliderResponse && sliderResponse.data && sliderResponse.data.pets) {
                    const pets = sliderResponse.data.pets;
                    setSliderPets(pets);
                    setShowSlider(pets.length > 0);
                } else {
                    // Если нет данных, пробуем получить пустой массив
                    const emptyResponse = await ApiService.getPetsSlider(true);
                    setSliderPets(emptyResponse?.data?.pets || []);
                    setShowSlider(false);
                }
                
                // Загрузка последних найденных животных
                const recentResponse = await ApiService.getRecentPets();
                if (recentResponse && recentResponse.data && recentResponse.data.orders) {
                    // Сортируем по дате
                    const sortedPets = recentResponse.data.orders.sort((a, b) => {
                        return new Date(b.date) - new Date(a.date);
                    }).slice(0, 6); // Берем только 6 последних
                    
                    setRecentPets(sortedPets);
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setShowSlider(false);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Debounce поиск для подсказок
    useEffect(() => {
        if (searchQuery.length > 3) {
            const timer = setTimeout(async () => {
                try {
                    const response = await ApiService.searchPets(searchQuery, 1000);
                    if (response && response.data && response.data.orders) {
                        setSearchSuggestions(response.data.orders.slice(0, 5)); // Показываем до 5 подсказок
                    }
                } catch (error) {
                    console.error('Ошибка при поиске:', error);
                    setSearchSuggestions([]);
                }
            }, 1000);

            return () => clearTimeout(timer);
        } else {
            setSearchSuggestions([]);
        }
    }, [searchQuery]);

    const handleNewsletterSubmit = async (email) => {
        try {
            const response = await ApiService.subscribeToNews(email);
            
            if (response && !response.error) {
                return { 
                    success: true, 
                    message: 'Вы успешно подписались на рассылку!' 
                };
            } else {
                return { 
                    success: false, 
                    message: response.error?.message || 'Ошибка при подписке' 
                };
            }
        } catch (error) {
            if (error.status === 422) {
                return { 
                    success: false, 
                    message: error.data?.error?.errors?.email?.[0] || 'Ошибка валидации' 
                };
            }
            return { 
                success: false, 
                message: 'Ошибка при подключении к серверу' 
            };
        }
    };

    const getStatusBadge = (registered) => {
        return registered ? 'bg-success' : 'bg-secondary';
    };

    if (loading) {
        return (
            <div>
                <Header isAuthenticated={false} />
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                    <p className="mt-2">Загрузка данных...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header isAuthenticated={false} />
            
            <SearchHeader 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                suggestions={searchSuggestions}
            />

            <CompanyInfo />

            {/* Карусель со слайдером */}
            {showSlider && (
                <div className="carousel-container">
                    <h2 className="carousel-title">Животные, которые нашли хозяев</h2>
                    <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                            {sliderPets.map((_, index) => (
                                <button 
                                    key={index}
                                    type="button" 
                                    data-bs-target="#carouselExampleCaptions" 
                                    data-bs-slide-to={index}
                                    className={index === 0 ? "active" : ""}
                                    aria-label={`Slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>
                        <div className="carousel-inner">
                            {sliderPets.map((pet, index) => (
                                <div key={pet.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <div className="row align-items-center">
                                        <div className="col-md-6">
                                            <div className="carousel-image-container">
                                                <img 
                                                    src={pet.image || placeholderImage} 
                                                    className="d-block w-100 square-slider-image" 
                                                    alt={pet.kind} 
                                                    style={{ objectFit: 'cover', height: '400px' }}
                                                    onError={(e) => {
                                                        e.target.src = placeholderImage;
                                                        e.target.style.objectFit = 'contain';
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="carousel-content">
                                                <h4>{pet.kind}</h4>
                                                <p>{pet.description}</p>
                                                <div className="mt-3">
                                                    <span className="badge bg-success">Хозяин найден</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {sliderPets.length > 1 && (
                            <>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Последние найденные животные */}
            <div className="container mt-5">
                <h2 className="text-center mb-4">Последние найденные животные</h2>
                {recentPets.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-muted">Нет данных о найденных животных</p>
                    </div>
                ) : (
                    <div className="row">
                        {recentPets.map(pet => (
                            <div key={pet.id} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    <img 
                                        src={pet.photo || pet.photos || placeholderImage} 
                                        className="card-img-top" 
                                        alt={pet.kind}
                                        style={{ height: '250px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = placeholderImage;
                                            e.target.style.objectFit = 'contain';
                                        }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{pet.kind}</h5>
                                        <p className="card-text">{pet.description}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="badge district-badge">{pet.district}</span>
                                            <span className={`badge ${getStatusBadge(pet.registered)}`}>
                                                {pet.registered ? 'Зарегистрировано' : 'Не зарегистрировано'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <small className="text-muted">{pet.date}</small>
                                        <button 
                                            className="btn btn-outline-primary btn-sm float-end"
                                            onClick={() => window.location.href = `/pet/${pet.id}`}
                                        >
                                            Подробнее
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <NewsletterSection onSubmit={handleNewsletterSubmit} />

            <Footer />
        </div>
    );
};

export default Main;