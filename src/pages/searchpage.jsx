import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import SearchHeader from '../components/search-header';
import ApiService from '../services/api';
import placeholderImage from '../assets/images/placeholder.svg';

const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState({
        district: '',
        animalType: ''
    });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    // Удалена неиспользуемая переменная userName
    const pageSize = 8;

    const districts = [
        'Адмиралтейский район',
        'Василеостровский район',
        'Выборгский район',
        'Калининский район',
        'Кировский район',
        'Колпинский район',
        'Красногвардейский район',
        'Красносельский район',
        'Кронштадтский район',
        'Курортный район',
        'Московский район',
        'Невский район',
        'Петроградский район',
        'Петродворцовый район',
        'Приморский район',
        'Пушкинский район',
        'Фрунзенский район',
        'Центральный район'
    ];

    const getQueryParams = useCallback(() => {
        const params = new URLSearchParams(location.search);
        return {
            animalType: params.get('animalType') || params.get('kind') || '',
            district: params.get('district') || ''
        };
    }, [location.search]);

    const loadAllOrders = useCallback(async (page) => {
        setLoading(true);
        try {
            const response = await ApiService.searchOrders({});
            if (response && response.data && response.data.orders) {
                const allResults = response.data.orders;
                
                const startIndex = (page - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                const paginatedResults = allResults.slice(startIndex, endIndex);

                setResults(paginatedResults);
                setTotalCount(allResults.length);
                setTotalPages(Math.ceil(allResults.length / pageSize));
            } else {
                setResults([]);
                setTotalCount(0);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('Ошибка при загрузке объявлений:', error);
            setResults([]);
            setTotalCount(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, []);

    const performSearch = useCallback(async (page, params) => {
        setLoading(true);
        setCurrentPage(page);

        try {
            if (!params.animalType && !params.district) {
                await loadAllOrders(page);
                return;
            }

            const response = await ApiService.searchOrders({
                kind: params.animalType,
                district: params.district
            });
            
            if (response && response.data && response.data.orders) {
                const allResults = response.data.orders;
                
                const startIndex = (page - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                const paginatedResults = allResults.slice(startIndex, endIndex);

                setResults(paginatedResults);
                setTotalCount(allResults.length);
                setTotalPages(Math.ceil(allResults.length / pageSize));
            } else {
                setResults([]);
                setTotalCount(0);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('Ошибка при поиске:', error);
            setResults([]);
            setTotalCount(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, [loadAllOrders]);

    // Удален useEffect для userName, так как переменная больше не используется

    useEffect(() => {
        const queryParams = getQueryParams();
        const newSearchParams = {
            animalType: queryParams.animalType,
            district: queryParams.district
        };
        
        setSearchParams(newSearchParams);
        setSearchQuery(queryParams.animalType);
        
        if (queryParams.animalType || queryParams.district) {
            performSearch(1, newSearchParams);
        } else {
            loadAllOrders(1);
        }
    }, [location.search, getQueryParams, performSearch, loadAllOrders]);

    useEffect(() => {
        if (searchQuery.length > 2) {
            const timer = setTimeout(async () => {
                try {
                    // Используем searchOrders для получения подсказок
                    const response = await ApiService.searchOrders({ kind: searchQuery });
                    
                    if (response && response.data && response.data.orders) {
                        // Берем только первые 5 результатов для подсказок
                        const suggestions = response.data.orders.slice(0, 10);
                        
                        // Данные для подсказок
                        const formattedSuggestions = suggestions.map(order => ({
                            id: order.id,
                            kind: order.kind || '',
                            description: order.description || '',
                            district: order.district || '',
                            photo: order.photo || order.photos || null
                        }));
                        
                        setSearchSuggestions(formattedSuggestions);
                    } else {
                        setSearchSuggestions([]);
                    }
                } catch (error) {
                    console.error('Ошибка при поиске подсказок:', error);
                    setSearchSuggestions([]);
                }
            }, 300); // Задержка 300мс для быстрого отклика
    
            return () => clearTimeout(timer);
        } else {
            setSearchSuggestions([]);
        }
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        
        const params = new URLSearchParams();
        if (searchParams.animalType) params.append('kind', searchParams.animalType);
        if (searchParams.district) params.append('district', searchParams.district);
        
        navigate(`/search?${params.toString()}`);
        
        performSearch(1, searchParams);
    };

    const handleReset = () => {
        setSearchParams({ district: '', animalType: '' });
        setSearchQuery('');
        setCurrentPage(1);
        
        navigate('/search');
        
        loadAllOrders(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        
        if (searchParams.animalType || searchParams.district) {
            performSearch(page, searchParams);
        } else {
            loadAllOrders(page);
        }
    };

    const handleSearchInputChange = (value) => {
        setSearchQuery(value);
        setSearchParams(prev => ({ ...prev, animalType: value }));
    };

    const getStatusBadge = (registred) => {
        return registred ? 'bg-success' : 'bg-secondary';
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            pages.push(
                <li key="first" className="page-item">
                    <button className="page-link" onClick={() => handlePageChange(1)}>
                        1
                    </button>
                </li>
            );
            if (startPage > 2) {
                pages.push(
                    <li key="dots1" className="page-item disabled">
                        <span className="page-link">...</span>
                    </li>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(i)}>
                        {i}
                    </button>
                </li>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <li key="dots2" className="page-item disabled">
                        <span className="page-link">...</span>
                    </li>
                );
            }
            pages.push(
                <li key="last" className="page-item">
                    <button className="page-link" onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                    </button>
                </li>
            );
        }

        return (
            <nav aria-label="Page navigation" className="mt-4">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                            className="page-link" 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &laquo;
                        </button>
                    </li>
                    {pages}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                            className="page-link" 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            &raquo;
                        </button>
                    </li>
                </ul>
            </nav>
        );
    };

    return (
        <div>
            <Header />
            
            <SearchHeader 
                searchQuery={searchQuery}
                onSearchChange={handleSearchInputChange}
                suggestions={searchSuggestions}
            />
            
            <div className="container mt-4">
                <div className="search-filters card mb-4">
                    <div className="card-body">
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
                                        {districts.map((district, index) => (
                                            <option key={index} value={district}>
                                                {district}
                                            </option>
                                        ))}
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
                                        onChange={(e) => {
                                            setSearchParams({...searchParams, animalType: e.target.value});
                                            setSearchQuery(e.target.value);
                                        }}
                                    />
                                    <div className="form-text">Поиск по частичному соответствию</div>
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-search" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                            Поиск...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-search me-1"></i>Найти объявления
                                        </>
                                    )}
                                </button>
                                <button type="button" className="btn btn-outline-secondary" onClick={handleReset} disabled={loading}>
                                    <i className="bi bi-arrow-clockwise me-1"></i>Сбросить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h4>
                        Найдено объявлений: 
                        <span className="text-primary ms-2">{totalCount}</span>
                    </h4>
                    {totalPages > 0 && (
                        <div className="text-muted">
                            Страница {currentPage} из {totalPages}
                        </div>
                    )}
                </div>

                {loading && (
                    <div className="loading-spinner text-center py-5">
                        <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
                            <span className="visually-hidden">Загрузка...</span>
                        </div>
                        <p className="mt-3">Загрузка объявлений...</p>
                    </div>
                )}

                {!loading && (
                    <>
                        {results.length === 0 ? (
                            <div className="no-results text-center py-5">
                                <i className="bi bi-search" style={{fontSize: '4rem', color: '#6c757d'}}></i>
                                <h4 className="mt-3">Ничего не найдено</h4>
                                <p className="text-muted">Попробуйте изменить параметры поиска</p>
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
                                                <img 
                                                    src={ad.photo || ad.photos || placeholderImage} 
                                                    className="card-img-top" 
                                                    alt={ad.kind}
                                                    style={{ height: '200px', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.src = placeholderImage;
                                                        e.target.style.objectFit = 'contain';
                                                    }}
                                                />
                                                <div className="card-body d-flex flex-column">
                                                    <h5 className="card-title">{ad.kind}</h5>
                                                    <p className="card-text flex-grow-1">
                                                        {ad.description && ad.description.length > 100 
                                                            ? `${ad.description.substring(0, 100)}...`
                                                            : ad.description}
                                                    </p>
                                                    <div className="mt-auto">
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <span className="badge district-badge">{ad.district}</span>
                                                            <span className={`badge ${getStatusBadge(ad.registred)}`}>
                                                                {ad.registred ? 'Зарегистрировано' : 'Не зарегистрировано'}
                                                            </span>
                                                        </div>
                                                        {ad.mark && (
                                                            <div className="mb-2">
                                                                <small className="text-muted">Клеймо: {ad.mark}</small>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="card-footer">
                                                    <small className="text-muted">{ad.date}</small>
                                                    <a 
                                                        className="btn btn-outline-primary btn-sm float-end"
                                                        href={`/pet/${ad.id}`}
                                                    >
                                                        Подробнее
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {renderPagination()}
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