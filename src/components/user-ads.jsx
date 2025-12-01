// src/components/user-ads.jsx
import React, { useState } from 'react';
import EditAdModal from '../components/edit-ad-modal';
import DeleteAdModal from '../components/delete-ad-modal';
import placeholderImage from '../assets/images/placeholder.svg';

const UserAds = ({ ads, onAdUpdate, onAdDelete, getStatusClass }) => {
    const [editingAd, setEditingAd] = useState(null);
    const [deletingAd, setDeletingAd] = useState(null);

    const handleEditClick = (ad) => {
        setEditingAd(ad);
    };

    const handleDeleteClick = (ad) => {
        setDeletingAd(ad);
    };

    const handleSaveEdit = (updatedData) => {
        if (editingAd && onAdUpdate) {
            onAdUpdate(editingAd.id, updatedData);
        }
        setEditingAd(null);
    };

    const handleConfirmDelete = (adId) => {
        if (onAdDelete) {
            onAdDelete(adId);
        }
        setDeletingAd(null);
    };

    return (
        <section className="tab-pane fade show active" id="ads" role="tabpanel" aria-labelledby="ads-tab">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Мои объявления</h3>
                <a href="/add" className="btn btn-primary">
                    <i className="bi bi-plus-circle me-1"></i>Добавить объявление
                </a>
            </div>

            {ads.length === 0 ? (
                <div className="text-center py-5">
                    <i className="bi bi-newspaper" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                    <h4 className="mt-3">У вас нет объявлений</h4>
                    <p className="text-muted">Создайте свое первое объявление о найденном животном</p>
                    <a href="/add" className="btn btn-primary mt-2">
                        <i className="bi bi-plus-circle me-1"></i>Добавить объявление
                    </a>
                </div>
            ) : (
                <div className="row">
                    {ads.map(ad => (
                        <article key={ad.id} className="col-md-6 mb-4">
                            <div className="card h-100">
                                <img 
                                    src={ad.image || placeholderImage} 
                                    className="card-img-top" 
                                    alt={ad.title || ad.kind}
                                    style={{ height: '250px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.src = placeholderImage;
                                        e.target.style.objectFit = 'contain';
                                    }}
                                />
                                <div className="card-body">
                                    <h4 className="card-title h5">{ad.title || ad.kind}</h4>
                                    <p className="card-text">{ad.description}</p>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <small className="text-muted">{ad.district}</small>
                                        <span className={`badge ${getStatusClass ? getStatusClass(ad.status) : ''}`}>
                                            {ad.statusText}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <small className="text-muted">{ad.date}</small>
                                    </div>
                                    <div className="mt-2">
                                        <small className="text-muted">Метка: {ad.mark || 'Не указана'}</small>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <div className="btn-group w-100">
                                        <button 
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => handleEditClick(ad)}
                                        >
                                            <i className="bi bi-pencil"></i>
                                            <span className="visually-hidden">Редактировать объявление</span>
                                        </button>
                                        <button 
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDeleteClick(ad)}
                                        >
                                            <i className="bi bi-trash"></i>
                                            <span className="visually-hidden">Удалить объявление</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Модальное окно редактирования */}
            {editingAd && (
                <EditAdModal
                    ad={editingAd}
                    show={!!editingAd}
                    onClose={() => setEditingAd(null)}
                    onSave={handleSaveEdit}
                />
            )}

            {/* Модальное окно удаления */}
            {deletingAd && (
                <DeleteAdModal
                    ad={deletingAd}
                    show={!!deletingAd}
                    onClose={() => setDeletingAd(null)}
                    onDelete={handleConfirmDelete}
                />
            )}
        </section>
    );
};

export default UserAds;