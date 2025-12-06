// src/components/PasswordRequirements.jsx
import React from 'react';
import PropTypes from 'prop-types';

const PasswordRequirements = ({ password }) => {
    const requirements = [
        { text: 'Минимум 7 символов', met: password.length >= 7 },
        { text: 'Хотя бы 1 цифра', met: /\d/.test(password) },
        { text: 'Хотя бы 1 строчная буква', met: /[a-z]/.test(password) },
        { text: 'Хотя бы 1 заглавная буква', met: /[A-Z]/.test(password) }
    ];

    return (
        <div className="password-requirements mt-2">
            {requirements.map((req, index) => (
                <div key={index} className={`requirement ${req.met ? 'met' : 'unmet'}`}>
                    <i className={`bi ${req.met ? 'bi-check-circle' : 'bi-circle'}`}></i>
                    <span>{req.text}</span>
                </div>
            ))}
        </div>
    );
};

PasswordRequirements.propTypes = {
    password: PropTypes.string.isRequired
};

export default PasswordRequirements;