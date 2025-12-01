import React from 'react';
import ApiService from '../services/api';
import { useNavigate } from 'react-router-dom';

const LogoutModal = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        ApiService.clearToken();
        if (onLogout) {
            onLogout();
        } else {
            navigate('/');
        }
    };

    return (
        <div className="modal fade" id="logoutModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Подтверждение выхода</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="text-center">
                            <i className="bi bi-box-arrow-right text-warning" style={{fontSize: '3rem'}}></i>
                            <h5 className="mt-3">Вы уверены, что хотите выйти?</h5>
                            <p className="text-muted">Для доступа к личному кабинету потребуется снова войти в систему.</p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button 
                            type="button" 
                            className="btn btn-danger" 
                            onClick={handleLogout}
                            data-bs-dismiss="modal"
                        >
                            <i className="bi bi-box-arrow-right me-1"></i>Выйти
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;