// src/components/search-header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchHeader = ({ searchQuery: externalSearchQuery, onSearchChange, suggestions = [] }) => {
    const [localSearchQuery, setLocalSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);
    const navigate = useNavigate();

    // Синхронизация с внешним состоянием
    useEffect(() => {
        if (externalSearchQuery !== undefined) {
            setLocalSearchQuery(externalSearchQuery);
        }
    }, [externalSearchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        
        if (localSearchQuery.trim()) {
            navigate(`/search?animalType=${encodeURIComponent(localSearchQuery)}`);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setLocalSearchQuery(value);
        
        if (onSearchChange) {
            onSearchChange(value);
        }
        
        setShowSuggestions(value.length > 0);
    };

    const handleSuggestionClick = (suggestion) => {
        setLocalSearchQuery(suggestion.kind || suggestion.description || '');
        setShowSuggestions(false);
        
        if (onSearchChange) {
            onSearchChange(suggestion.kind || suggestion.description || '');
        }
    };

    const handleClickOutside = (e) => {
        if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
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
                                    <div className="input-group" ref={suggestionsRef}>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="mainSearchInput" 
                                            placeholder="Введите вид животного, породу, приметы..."
                                            value={localSearchQuery}
                                            onChange={handleInputChange}
                                            onFocus={() => {
                                                if (localSearchQuery.length > 0 && suggestions.length > 0) {
                                                    setShowSuggestions(true);
                                                }
                                            }}
                                            autoComplete="off"
                                        />
                                        <button className="btn btn-search" type="submit">
                                            <i className="bi bi-search"></i>
                                        </button>
                                        
                                        {showSuggestions && suggestions.length > 0 && (
                                            <div className="suggestions-dropdown">
                                                {suggestions.map((suggestion, index) => (
                                                    <div 
                                                        key={index}
                                                        className="suggestion-item"
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                    >
                                                        <div className="suggestion-text">
                                                            <strong>{suggestion.kind}</strong>
                                                            <small className="text-muted d-block">
                                                                {suggestion.description && suggestion.description.length > 50 
                                                                    ? `${suggestion.description.substring(0, 50)}...`
                                                                    : suggestion.description}
                                                            </small>
                                                        </div>
                                                        <div className="suggestion-meta">
                                                            <span className="badge bg-light text-dark">
                                                                {suggestion.district}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchHeader;