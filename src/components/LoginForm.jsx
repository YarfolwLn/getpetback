// src/components/LoginForm.jsx
import React from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({ 
    formData, 
    errors, 
    loading, 
    onInputChange 
}) => {
    return (
        <form id="loginForm">
            {errors.login && (
                <div className="alert alert-danger" role="alert">
                    {errors.login}
                </div>
            )}
            
            <div className="mb-3">
                <label htmlFor="loginEmail" className="form-label">Email</label>
                <div className="input-group">
                    <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                    </span>
                    <input 
                        type="email" 
                        className="form-control"
                        id="loginEmail" 
                        value={formData.email}
                        onChange={(e) => onInputChange('login', 'email', e.target.value)}
                        placeholder="Введите ваш email" 
                        required
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="loginPassword" className="form-label">Пароль</label>
                <div className="input-group">
                    <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                    </span>
                    <input 
                        type="password" 
                        className="form-control"
                        id="loginPassword" 
                        value={formData.password}
                        onChange={(e) => onInputChange('login', 'password', e.target.value)}
                        placeholder="Введите ваш пароль" 
                        required
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="d-grid mb-3">
                <button 
                    type="submit" 
                    className="btn btn-register btn-lg"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Вход...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-box-arrow-in-right me-2"></i>Войти
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

LoginForm.propTypes = {
    formData: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    onInputChange: PropTypes.func.isRequired
};

export default LoginForm;