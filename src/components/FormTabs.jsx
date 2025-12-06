// src/components/FormTabs.jsx
import React from 'react';
import PropTypes from 'prop-types';

const FormTabs = ({ activeForm, onTabChange }) => {
    return (
        <div className="form-tabs">
            <div className="form-tabs-container">
                <button 
                    className={`form-tab ${activeForm === 'register' ? 'active' : ''}`}
                    onClick={() => onTabChange('register')}
                    type="button"
                >
                    Регистрация
                </button>
                <button 
                    className={`form-tab ${activeForm === 'login' ? 'active' : ''}`}
                    onClick={() => onTabChange('login')}
                    type="button"
                >
                    Вход
                </button>
            </div>
        </div>
    );
};

FormTabs.propTypes = {
    activeForm: PropTypes.oneOf(['register', 'login']).isRequired,
    onTabChange: PropTypes.func.isRequired
};

export default FormTabs;