import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchHeader = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        // Переход на страницу поиска с передачей параметра
        navigate(`/search?animalType=${encodeURIComponent(searchQuery)}`);
    };

    return(
        <div className="search-header">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-8">
                        <h1 className="display-5 fw-bold">Найдите своего питомца в Санкт-Петербурге</h1>
                        <p className="lead">Помогаем воссоединить животных с их хозяевами</p>
                    </div>
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body">
                                <form id="mainSearchForm" onSubmit={handleSearch}>
                                    <div className="input-group">
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="mainSearchInput" 
                                            placeholder="Введите вид животного, породу, приметы..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <button className="btn btn-search" type="submit">
                                            <i className="bi bi-search"></i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default SearchHeader;