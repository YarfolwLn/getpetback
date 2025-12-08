import React from 'react';
import PropTypes from 'prop-types';

const RegisterForm = ({ 
    formData, 
    errors, 
    loading, 
    onInputChange,
    renderPasswordRequirements 
}) => {
    return (
        <div>
            <div className="mb-3">
                <label htmlFor="regName" className="form-label">Имя *</label>
                <div className="input-group">
                    <span className="input-group-text">
                        <i className="bi bi-person"></i>
                    </span>
                    <input 
                        type="text" 
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="regName" 
                        value={formData.name}
                        onChange={(e) => onInputChange('register', 'name', e.target.value)}
                        placeholder="Введите ваше имя" 
                        required
                        disabled={loading}
                    />
                    {errors.name && (
                        <div className="invalid-feedback">
                            {errors.name}
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="regPhone" className="form-label">Телефон *</label>
                <div className="input-group">
                    <span className="input-group-text">
                        <i className="bi bi-telephone"></i>
                    </span>
                    <input 
                        type="tel" 
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        id="regPhone" 
                        value={formData.phone}
                        onChange={(e) => onInputChange('register', 'phone', e.target.value)}
                        placeholder="+7 (999) 123-45-67" 
                        required
                        disabled={loading}
                    />
                    {errors.phone && (
                        <div className="invalid-feedback">
                            {errors.phone}
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="regEmail" className="form-label">Email *</label>
                <div className="input-group">
                    <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                    </span>
                    <input 
                        type="email" 
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="regEmail" 
                        value={formData.email}
                        onChange={(e) => onInputChange('register', 'email', e.target.value)}
                        placeholder="Введите ваш email" 
                        required
                        disabled={loading}
                    />
                    {errors.email && (
                        <div className="invalid-feedback">
                            {errors.email}
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="regPassword" className="form-label">Пароль *</label>
                <div className="input-group">
                    <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                    </span>
                    <input 
                        type="password" 
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="regPassword" 
                        value={formData.password}
                        onChange={(e) => onInputChange('register', 'password', e.target.value)}
                        placeholder="Придумайте пароль" 
                        required 
                        minLength="7"
                        disabled={loading}
                    />
                    {errors.password && (
                        <div className="invalid-feedback">
                            {errors.password}
                        </div>
                    )}
                </div>
                {renderPasswordRequirements && renderPasswordRequirements()}
            </div>

            <div className="mb-3">
                <label htmlFor="regConfirmPassword" className="form-label">Подтверждение пароля *</label>
                <div className="input-group">
                    <span className="input-group-text">
                        <i className="bi bi-lock-fill"></i>
                    </span>
                    <input 
                        type="password" 
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        id="regConfirmPassword" 
                        value={formData.confirmPassword}
                        onChange={(e) => onInputChange('register', 'confirmPassword', e.target.value)}
                        placeholder="Повторите пароль" 
                        required
                        disabled={loading}
                    />
                    {errors.confirmPassword && (
                        <div className="invalid-feedback">
                            {errors.confirmPassword}
                        </div>
                    )}
                </div>
            </div>

            <div className="location-info">
                <p>
                    <i className="bi bi-info-circle me-2"></i>
                    Сервис YarfPets в настоящее время доступен только в Санкт-Петербурге
                </p>
            </div>

            <div className="mb-3 form-check">
                <input 
                    type="checkbox" 
                    className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                    id="agreeTerms" 
                    checked={formData.agreeTerms}
                    onChange={(e) => onInputChange('register', 'agreeTerms', e.target.checked)}
                    required
                    disabled={loading}
                />
                <label className="form-check-label" htmlFor="agreeTerms">
                    Я согласен с условиями использования и политикой конфиденциальности *
                </label>
                {errors.agreeTerms && (
                    <div className="invalid-feedback">
                        {errors.agreeTerms}
                    </div>
                )}
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
                            Регистрация...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-person-plus me-2"></i>Зарегистрироваться
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

RegisterForm.propTypes = {
    formData: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    onInputChange: PropTypes.func.isRequired,
    renderPasswordRequirements: PropTypes.func
};

export default RegisterForm;