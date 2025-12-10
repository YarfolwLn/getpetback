// edit-ad-modal.jsx
import React, { useState } from 'react';

const EditAdModal = ({ ad, show, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        photos: [null, null, null],
        mark: ad.mark || '',
        description: ad.description || ''
    });

    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        const newPhotos = [...formData.photos];
        newPhotos[index] = file;
        setFormData({ ...formData, photos: newPhotos });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title h5">Редактирование объявления</h2>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="editPhoto1" className="form-label">Фото 1 (обязательное)</label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    id="editPhoto1" 
                                    accept="image/png" 
                                    onChange={(e) => handleFileChange(0, e)}
                                    required
                                />
                                <div className="form-text">Формат: PNG</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editPhoto2" className="form-label">Фото 2</label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    id="editPhoto2" 
                                    accept="image/png"
                                    onChange={(e) => handleFileChange(1, e)}
                                />
                                <div className="form-text">Формат: PNG</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editPhoto3" className="form-label">Фото 3</label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    id="editPhoto3" 
                                    accept="image/png"
                                    onChange={(e) => handleFileChange(2, e)}
                                />
                                <div className="form-text">Формат: PNG</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editMark" className="form-label">Метка/клеймо</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="editMark" 
                                    value={formData.mark}
                                    onChange={(e) => setFormData({...formData, mark: e.target.value})}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editDescription" className="form-label">Описание</label>
                                <textarea 
                                    className="form-control" 
                                    id="editDescription" 
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                ></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Отмена</button>
                                <button type="submit" className="btn btn-primary">Сохранить изменения</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAdModal;