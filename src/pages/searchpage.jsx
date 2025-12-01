import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import SearchHeader from '../components/search-header';
import belkaImage from '../assets/images/belka.jpg';
import catImage from '../assets/images/cat.jpg';
import ezhImage from '../assets/images/ezh.jpg';
import tigerImage from '../assets/images/tiger.jpg';
import dogImage from '../assets/images/dog.jpg';
import parrotImage from '../assets/images/parrot.jpg';

const SearchPage = () => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useState({
        district: '',
        animalType: ''
    });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 8;

    const allAds = [
        {
            id: 1,
            title: "Найдена кошка",
            description: "Пушистая кошка найдена в центре города. Ищет хозяев. Приучена к лотку, очень ласковая.",
            image: catImage,
            district: "Центральный район",
            animalType: "кошка",
            date: "12.01.2024",
            status: "Найдено",
            badge: "bg-success"
        },
        {
            id: 2,
            title: "Найдена белка",
            description: "Милая белочка ищет новый дом. Очень активная и дружелюбная.",
            image: belkaImage,
            district: "Петроградский район",
            animalType: "белка",
            date: "15.01.2024",
            status: "Найдено",
            contact: "+7 (911) 234-56-79",
            author: "Мария",
            badge: "bg-success"
        },
        {
            id: 3,
            title: "Найден ёж",
            description: "Колючий ёжик найден в парке. Требуется специальный уход. Очень добрый, несмотря на колючки.",
            image: ezhImage,
            district: "Невский район",
            animalType: "ёж",
            date: "08.01.2024",
            status: "Найдено",
            contact: "+7 (911) 234-56-80",
            author: "Анна",
            badge: "bg-success"
        },
        {
            id: 4,
            title: "Найден тигрёнок",
            description: "Маленький тигрёнок найден в пригороде. Требуется специализированный уход и содержание.",
            image: tigerImage,
            district: "Приморский район",
            animalType: "тигр",
            date: "15.01.2024",
            status: "Найдено",
            contact: "+7 (911) 234-56-81",
            author: "Сергей",
            badge: "bg-success"
        },
        {
            id: 5,
            title: "Пропала собака",
            description: "Пропала собака породы хаски. Кобель, 2 года. Откликнется на кличку Рекс. Носит синий ошейник.",
            image: dogImage,
            district: "Выборгский район",
            animalType: "собака",
            date: "10.01.2024",
            status: "Пропало",
            contact: "+7 (911) 234-56-82",
            author: "Алексей",
            badge: "bg-danger"
        },
        {
            id: 6,
            title: "Найден попугай",
            description: "Найден волнистый попугай голубого окраса. Ищет хозяев. Умеет говорить несколько слов.",
            image: parrotImage,
            district: "Фрунзенский район",
            animalType: "попугай",
            date: "07.01.2024",
            status: "Найдено",
            contact: "+7 (911) 234-56-83",
            author: "Ольга",
            badge: "bg-success"
        },
        {
            id: 7,
            title: "Найдена черепаха",
            description: "Сухопутная черепаха найдена в парке. Ищет хозяев, требуется специальный уход.",
            image: "https://via.placeholder.com/300x300?text=Черепаха",
            district: "Кировский район",
            animalType: "черепаха",
            date: "20.01.2024",
            status: "Найдено",
            contact: "+7 (911) 234-56-84",
            author: "Дмитрий",
            badge: "bg-success"
        },
        {
            id: 8,
            title: "Пропал хомяк",
            description: "Пропал карликовый хомяк. Очень маленький, белого окраса. Откликается на кличку Пуфик.",
            image: "https://via.placeholder.com/300x300?text=Хомяк",
            district: "Московский район",
            animalType: "хомяк",
            date: "18.01.2024",
            status: "Пропало",
            contact: "+7 (911) 234-56-85",
            author: "Елена",
            badge: "bg-danger"
        },
        {
            id: 9,
            title: "Найден кролик",
            description: "Декоративный кролик найден во дворе. Очень пугливый, но добрый. Ищет хозяев.",
            image: "https://via.placeholder.com/300x300?text=Кролик",
            district: "Фрунзенский район",
            animalType: "кролик",
            date: "16.01.2024",
            status: "Найдено",
            contact: "+7 (911) 234-56-86",
            author: "Андрей",
            badge: "bg-success"
        },
        {
            id: 10,
            title: "Пропала морская свинка",
            description: "Пропала морская свинка рыжего окраса. Очень общительная, любит овощи.",
            image: "https://via.placeholder.com/300x300?text=Морская+свинка",
            district: "Калининский район",
            animalType: "морская свинка",
            date: "14.01.2024",
            status: "Пропало",
            contact: "+7 (911) 234-56-87",
            author: "Светлана",
            badge: "bg-danger"
        },
        {
            id: 11,
            title: "Найден уж",
            description: "Неядовитый уж найден на дачном участке. Совершенно безопасен, ищет новый дом.",
            image: "https://via.placeholder.com/300x300?text=Уж",
            district: "Курортный район",
            animalType: "уж",
            date: "13.01.2024",
            status: "Найдено",
            contact: "+7 (911) 234-56-88",
            author: "Виктор",
            badge: "bg-success"
        },
        {
            id: 12,
            title: "Пропала канарейка",
            description: "Пропала желтая канарейка. Очень красиво поет, откликается на свист.",
            image: "https://via.placeholder.com/300x300?text=Канарейка",
            district: "Адмиралтейский район",
            animalType: "канарейка",
            date: "11.01.2024",
            status: "Пропало",
            contact: "+7 (911) 234-56-89",
            author: "Наталья",
            badge: "bg-danger"
        },
        {
            id: 13,
            title: "Найден щенок",
            description: "Маленький щенок найден в парке. Очень игривый и дружелюбный, ищет хозяев.",
            image: "https://via.placeholder.com/300x300?text=Щенок",
            district: "Приморский район",
            animalType: "собака",
            date: "22.01.2024",
            status: "Найдено",
            contact: "+7 (911) 234-56-90",
            author: "Михаил",
            badge: "bg-success"
        },
        {
            id: 14,
            title: "Пропал котенок",
            description: "Пропал маленький котенок серого окраса. Очень пугливый, откликается на 'кис-кис'.",
            image: "https://via.placeholder.com/300x300?text=Котенок",
            district: "Василеостровский район",
            animalType: "кошка",
            date: "21.01.2024",
            status: "Пропало",
            contact: "+7 (911) 234-56-91",
            author: "Оксана",
            badge: "bg-danger"
        },
        {
            id: 15,
            title: "Найдена ящерица",
            description: "Экзотическая ящерица найдена в теплице. Требуется специальный уход и террариум.",
            image: "https://via.placeholder.com/300x300?text=Ящерица",
            district: "Петродворцовый район",
            animalType: "ящерица",
            date: "19.01.2024",
            status: "Найдено",
            contact: "+7 (911) 234-56-92",
            author: "Артем",
            badge: "bg-success"
        },
        {
            id: 16,
            title: "Пропала крыса",
            description: "Пропала домашняя крыса белого окраса. Очень умная, откликается на кличку Нюша.",
            image: "https://via.placeholder.com/300x300?text=Крыса",
            district: "Красногвардейский район",
            animalType: "крыса",
            date: "17.01.2024",
            status: "Пропало",
            contact: "+7 (911) 234-56-93",
            author: "Ирина",
            badge: "bg-danger"
        }
    ];

    // Функция для получения параметров из URL
    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            animalType: params.get('animalType') || '',
            district: params.get('district') || ''
        };
    };

    // При изменении URL (например, при переходе с главной страницы)
    useEffect(() => {
        const queryParams = getQueryParams();
        setSearchParams(prev => ({
            ...prev,
            animalType: queryParams.animalType,
            district: queryParams.district
        }));
        
        // Запускаем поиск с учетом параметров из URL
        performSearch(1, queryParams.animalType, queryParams.district);
    }, [location.search]);

    const performSearch = async (page = 1, animalTypeParam = null, districtParam = null) => {
        setLoading(true);
        setCurrentPage(page);

        // Используем переданные параметры или текущие из состояния
        const animalTypeToSearch = animalTypeParam !== null ? animalTypeParam : searchParams.animalType;
        const districtToSearch = districtParam !== null ? districtParam : searchParams.district;

        // Имитация задержки API
        setTimeout(() => {
            let filteredAds = allAds;

            // Применяем фильтры
            if (districtToSearch) {
                filteredAds = filteredAds.filter(ad => ad.district === districtToSearch);
            }

            if (animalTypeToSearch) {
                filteredAds = filteredAds.filter(ad => 
                    ad.animalType.toLowerCase().includes(animalTypeToSearch.toLowerCase()) ||
                    ad.title.toLowerCase().includes(animalTypeToSearch.toLowerCase()) ||
                    ad.description.toLowerCase().includes(animalTypeToSearch.toLowerCase())
                );
            }

            // Пагинация
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedAds = filteredAds.slice(startIndex, endIndex);

            setResults(paginatedAds);
            setTotalCount(filteredAds.length);
            setLoading(false);
        }, 500);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        
        // Обновляем URL с новыми параметрами поиска
        const params = new URLSearchParams();
        if (searchParams.animalType) params.append('animalType', searchParams.animalType);
        if (searchParams.district) params.append('district', searchParams.district);
        
        // Обновляем URL без перезагрузки страницы
        window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
        
        performSearch(1, searchParams.animalType, searchParams.district);
    };

    const handleReset = () => {
        setSearchParams({ district: '', animalType: '' });
        setCurrentPage(1);
        
        // Очищаем query-параметры в URL
        window.history.pushState({}, '', location.pathname);
        
        performSearch(1, '', '');
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        performSearch(page);
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div>
            <Header isAuthenticated={false} />
            
            <SearchHeader />
            
            <div className="container">
                {/* Расширенный поиск */}
                <div className="search-filters">
                    <h4 className="mb-3">Расширенный поиск</h4>
                    <form id="advancedSearchForm" onSubmit={handleSearch}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="districtSearch" className="form-label fw-bold">Район Санкт-Петербурга</label>
                                <select 
                                    className="form-select" 
                                    id="districtSearch"
                                    value={searchParams.district}
                                    onChange={(e) => setSearchParams({...searchParams, district: e.target.value})}
                                >
                                    <option value="">Все районы</option>
                                    <option value="Адмиралтейский район">Адмиралтейский район</option>
                                    <option value="Василеостровский район">Василеостровский район</option>
                                    <option value="Выборгский район">Выборгский район</option>
                                    <option value="Калининский район">Калининский район</option>
                                    <option value="Кировский район">Кировский район</option>
                                    <option value="Колпинский район">Колпинский район</option>
                                    <option value="Красногвардейский район">Красногвардейский район</option>
                                    <option value="Красносельский район">Красносельский район</option>
                                    <option value="Кронштадтский район">Кронштадтский район</option>
                                    <option value="Курортный район">Курортный район</option>
                                    <option value="Московский район">Московский район</option>
                                    <option value="Невский район">Невский район</option>
                                    <option value="Петроградский район">Петроградский район</option>
                                    <option value="Петродворцовый район">Петродворцовый район</option>
                                    <option value="Приморский район">Приморский район</option>
                                    <option value="Пушкинский район">Пушкинский район</option>
                                    <option value="Фрунзенский район">Фрунзенский район</option>
                                    <option value="Центральный район">Центральный район</option>
                                </select>
                                <div className="form-text">Поиск по полному соответствию района</div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="animalTypeSearch" className="form-label fw-bold">Вид животного</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="animalTypeSearch" 
                                    placeholder="Например: кошка, собака, попугай"
                                    value={searchParams.animalType}
                                    onChange={(e) => setSearchParams({...searchParams, animalType: e.target.value})}
                                />
                                <div className="form-text">Поиск по частичному соответствию</div>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-search">
                                <i className="bi bi-search me-1"></i>Найти объявления
                            </button>
                            <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>
                                <i className="bi bi-arrow-clockwise me-1"></i>Сбросить
                            </button>
                        </div>
                    </form>
                </div>

                {/* Спиннер загрузки */}
                {loading && (
                    <div className="loading-spinner">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Загрузка...</span>
                        </div>
                        <p className="mt-2">Загрузка объявлений...</p>
                    </div>
                )}

                {/* Статистика результатов */}
                <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
                    <h4>Найдено объявлений: <span className="text-primary">{totalCount}</span></h4>
                </div>

                {/* Результаты поиска */}
                {!loading && (
                    <>
                        {results.length === 0 ? (
                            <div className="no-results">
                                <i className="bi bi-search" style={{fontSize: '4rem'}}></i>
                                <h4 className="mt-3">Ничего не найдено</h4>
                                <p className="text-muted">Попробуйте изменить поисковый запрос</p>
                                <button className="btn btn-primary mt-2" onClick={handleReset}>
                                    <i className="bi bi-arrow-clockwise me-1"></i>Показать все объявления
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="row search-results">
                                    {results.map(ad => (
                                        <div key={ad.id} className="col-md-3 mb-4">
                                            <div className="card h-100">
                                                <img src={ad.image} className="card-img-top" alt={ad.title}/>
                                                <div className="card-body">
                                                    <h5 className="card-title">{ad.title}</h5>
                                                    <p className="card-text">{ad.description}</p>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="badge district-badge">{ad.district}</span>
                                                        <span className={`badge ${ad.badge}`}>{ad.status}</span>
                                                    </div>
                                                </div>
                                                <div className="card-footer">
                                                    <small className="text-muted">{ad.date}</small>
                                                    <button className="btn btn-outline-primary btn-sm float-end">
                                                        Подробнее
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Пагинация */}
                                {totalPages > 1 && (
                                    <nav aria-label="Page navigation" className="mt-4">
                                        <ul className="pagination justify-content-center">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                                    &laquo;
                                                </button>
                                            </li>
                                            {[...Array(totalPages)].map((_, i) => (
                                                <li key={i} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                                                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                                        {i + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                                                    &raquo;
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default SearchPage;