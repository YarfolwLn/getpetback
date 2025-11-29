import React, { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import LogoutModal from '../components/logout-modal';

const Addob = () => {
    const [formData, setFormData] = useState({
        petType: '',
        petDescription: '',
        mark: '',
        petLocation: '',
        name: '',
        phone: '',
        email: '',
        register: false,
        password: '',
        password_confirmation: '',
        confirm: false
    });

    const [imagePreviews, setImagePreviews] = useState([]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newPreviews = [...imagePreviews];
                newPreviews[index] = e.target.result;
                setImagePreviews(newPreviews);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Логика отправки формы
        console.log('Данные формы:', formData);
    };

    return (
        <div>
            <Header isAuthenticated={false} />
            
            <div className="container form-container">
                <div className="card shadow">
                    <div className="card-header bg-primary text-white">
                        <h2 className="card-title mb-0">
                            <i className="bi bi-plus-circle me-2"></i>Добавить объявление
                        </h2>
                    </div>
                    <div className="card-body p-4">
                        <form id="adForm" onSubmit={handleSubmit} noValidate>
                            <div className="row">
                                <div className="mb-3">
                                    <label htmlFor="petType" className="form-label fw-bold">Вид животного</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="petType" 
                                        value={formData.petType}
                                        onChange={(e) => handleInputChange('petType', e.target.value)}
                                        placeholder="Например: кошка, собака, попугай" 
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="petDescription" className="form-label fw-bold">Описание</label>
                                <textarea 
                                    className="form-control" 
                                    id="petDescription" 
                                    rows="4" 
                                    value={formData.petDescription}
                                    onChange={(e) => handleInputChange('petDescription', e.target.value)}
                                    placeholder="Опишите животное, особенности, где найдено/потеряно, приметы, кличка..." 
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="mark" className="form-label fw-bold">Клеймо (необязательно)</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="mark" 
                                    value={formData.mark}
                                    onChange={(e) => handleInputChange('mark', e.target.value)}
                                    placeholder="Номер клейма"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="petLocation" className="form-label fw-bold">Район Санкт-Петербурга</label>
                                <select 
                                    className="form-select" 
                                    id="petLocation" 
                                    value={formData.petLocation}
                                    onChange={(e) => handleInputChange('petLocation', e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Выберите район</option>
                                    <option value="admiralteysky">Адмиралтейский район</option>
                                    <option value="vasileostrovsky">Василеостровский район</option>
                                    {/* ... остальные районы */}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="petPhoto1" className="form-label fw-bold">Фотография (обязательно)</label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    id="petPhoto1" 
                                    accept=".png, image/png" 
                                    onChange={(e) => handleImageChange(e, 0)}
                                    required
                                />
                                
                                <label htmlFor="petPhoto2" className="form-label fw-bold mt-3">Дополнительная фотография</label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    id="petPhoto2" 
                                    accept=".png, image/png" 
                                    onChange={(e) => handleImageChange(e, 1)}
                                />

                                <label htmlFor="petPhoto3" className="form-label fw-bold mt-3">Дополнительная фотография</label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    id="petPhoto3" 
                                    accept=".png, image/png" 
                                    onChange={(e) => handleImageChange(e, 2)}
                                />

                                <div id="imagePreview" className="mt-2">
                                    {imagePreviews.map((preview, index) => (
                                        preview && (
                                            <img key={index} src={preview} className="preview-image" alt={`Preview ${index + 1}`} />
                                        )
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5 className="fw-bold mb-3">Контактная информация</h5>
                                
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Имя</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="name" 
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Введите ваше имя" 
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Телефон</label>
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        id="phone" 
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="+7 (999) 123-45-67" 
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email" 
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="example@mail.ru" 
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="form-check">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id="register" 
                                        checked={formData.register}
                                        onChange={(e) => handleInputChange('register', e.target.checked)}
                                    />
                                    <label className="form-check-label fw-bold" htmlFor="register">
                                        Зарегистрировать меня как пользователя
                                    </label>
                                </div>
                            </div>

                            {formData.register && (
                                <div className="password-fields mb-4 show" id="passwordFields">
                                    <h5 className="fw-bold mb-3">Пароль для регистрации</h5>
                                    
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Пароль</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            id="password" 
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            placeholder="Введите пароль"
                                        />
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label htmlFor="password_confirmation" className="form-label">Подтверждение пароля</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            id="password_confirmation" 
                                            value={formData.password_confirmation}
                                            onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                                            placeholder="Повторите пароль"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <div className="form-check">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id="confirm" 
                                        checked={formData.confirm}
                                        onChange={(e) => handleInputChange('confirm', e.target.checked)}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="confirm">
                                        Я согласен на обработку персональных данных
                                    </label>
                                </div>
                            </div>

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button type="submit" className="btn btn-submit">
                                    <i className="bi bi-send me-1"></i>Опубликовать объявление
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
            <LogoutModal />
        </div>
    );
};

export default Addob;