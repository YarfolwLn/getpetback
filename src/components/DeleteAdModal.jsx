// delete-ad-modal.jsx
import React from 'react';

const DeleteAdModal = ({ ad, show, onClose, onDelete }) => {
    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title h5">Удаление объявления</h2>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="text-center">
                            <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
                            <h3 className="h5 mt-3">Вы уверены, что хотите удалить объявление?</h3>
                            <p className="text-muted">ID: {ad.id}, Название: {ad.title}</p>
                            <p className="text-muted">Это действие нельзя отменить.</p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Отмена</button>
                        <button 
                            type="button" 
                            className="btn btn-danger"
                            onClick={() => {
                                onDelete(ad.id);
                                onClose();
                            }}
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteAdModal;