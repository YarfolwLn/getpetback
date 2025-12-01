// src/pages/addob.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import LogoutModal from '../components/logout-modal';
import ApiService from '../services/api';
import { validateField } from '../utils/validation';

const Addob = () => {
    const navigate = useNavigate();
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
    const [images, setImages] = useState([null, null, null]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [districts] = useState([
        'Адмиралтейский район',
        'Василеостровский район',
        'Выборгский район',
        'Калининский район',
        'Кировский район',
        'Колпинский район',
        'Красногвардейский район',
        'Красносельский район',
        'Кронштадтский район',
        'Курортный район',
        'Московский район',
        'Невский район',
        'Петроградский район',
        'Петродворцовый район',
        'Приморский район',
        'Пушкинский район',
        'Фрунзенский район',
        'Центральный район'
    ]);

    // Автозаполнение данных для авторизованного пользователя
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            // Загружаем данные пользователя
            const loadUserData = async () => {
                try {
                    const userId = 1; // В реальном приложении нужно получить ID пользователя
                    const response = await ApiService.getUserProfile(userId);
                    
                    if (response && response.data && response.data.user) {
                        const user = response.data.user[0];
                        setFormData(prev => ({
                            ...prev,
                            name: user.name || '',
                            phone: user.phone || '',
                            email: user.email || ''
                        }));
                    }
                } catch (error) {
                    console.error('Ошибка при загрузке данных пользователя:', error);
                }
            };
            
            loadUserData();
        }
    }, []);

    // Валидация формы
    const validateForm = () => {
        const newErrors = {};

        // Проверка обязательных полей
        if (!formData.petType.trim()) {
            newErrors.petType = 'Укажите вид животного';
        }
        
        if (!formData.petDescription.trim()) {
            newErrors.petDescription = 'Введите описание';
        }
        
        if (!formData.petLocation) {
            newErrors.petLocation = 'Выберите район';
        }
        
        if (!images[0]) {
            newErrors.photo1 = 'Добавьте хотя бы одну фотографию';
        }
        
        if (!formData.name.trim()) {
            newErrors.name = 'Введите ваше имя';
        } else {
            const nameValidation = validateField('name', formData.name);
            if (!nameValidation.isValid) {
                newErrors.name = nameValidation.message;
            }
        }
        
        if (!formData.phone.trim()) {
            newErrors.phone = 'Введите телефон';
        } else {
            const phoneValidation = validateField('phone', formData.phone);
            if (!phoneValidation.isValid) {
                newErrors.phone = phoneValidation.message;
            }
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Введите email';
        } else {
            const emailValidation = validateField('email', formData.email);
            if (!emailValidation.isValid) {
                newErrors.email = emailValidation.message;
            }
        }

        // Валидация пароля при регистрации
        if (formData.register) {
            if (!formData.password.trim()) {
                newErrors.password = 'Введите пароль';
            } else {
                const passwordValidation = validateField('password', formData.password);
                if (!passwordValidation.isValid) {
                    newErrors.password = passwordValidation.message;
                }
            }
            
            if (!formData.password_confirmation.trim()) {
                newErrors.password_confirmation = 'Подтвердите пароль';
            } else if (formData.password !== formData.password_confirmation) {
                newErrors.password_confirmation = 'Пароли не совпадают';
            }
        }

        // Согласие на обработку данных
        if (!formData.confirm) {
            newErrors.confirm = 'Необходимо согласие на обработку персональных данных';
        }

        return newErrors;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Очищаем ошибку при изменении поля
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        
        if (!file) return;
        
        // Проверяем формат файла (только PNG)
        if (file.type !== 'image/png') {
            setErrors(prev => ({
                ...prev,
                [`photo${index + 1}`]: 'Формат файла должен быть PNG'
            }));
            return;
        }
        
        // Проверяем размер файла (максимум 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({
                ...prev,
                [`photo${index + 1}`]: 'Размер файла не должен превышать 5MB'
            }));
            return;
        }
        
        const newImages = [...images];
        newImages[index] = file;
        setImages(newImages);
        
        // Создаем превью
        const reader = new FileReader();
        reader.onload = (e) => {
            const newPreviews = [...imagePreviews];
            newPreviews[index] = e.target.result;
            setImagePreviews(newPreviews);
        };
        reader.readAsDataURL(file);
        
        // Очищаем ошибку
        if (errors[`photo${index + 1}`]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[`photo${index + 1}`];
                return newErrors;
            });
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages[index] = null;
        setImages(newImages);
        
        const newPreviews = [...imagePreviews];
        newPreviews[index] = null;
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const formDataObj = new FormData();
            
            // Добавляем файлы
            images.forEach((image, index) => {
                if (image) {
                    formDataObj.append(`photo${index + 1}`, image);
                }
            });

            // Добавляем текстовые поля
            formDataObj.append('kind', formData.petType);
            formDataObj.append('description', formData.petDescription);
            formDataObj.append('district', formData.petLocation);
            formDataObj.append('name', formData.name);
            formDataObj.append('phone', formData.phone);
            formDataObj.append('email', formData.email);
            formDataObj.append('confirm', formData.confirm ? 1 : 0);
            
            if (formData.mark.trim()) {
                formDataObj.append('mark', formData.mark);
            }

            // Если выбрана регистрация
            if (formData.register) {
                formDataObj.append('password', formData.password);
                formDataObj.append('password_confirmation', formData.password_confirmation);
            }

            const response = await ApiService.createOrder(formDataObj);
            
            if (response && response.data && response.data.id) {
                setSuccessMessage('Объявление успешно создано!');
                
                // Перенаправляем на страницу с деталями через 2 секунды
                setTimeout(() => {
                    navigate(`/pet/${response.data.id}`);
                }, 2000);
                
            } else {
                setErrors({ general: 'Ошибка при создании объявления' });
            }
            
        } catch (error) {
            console.error('Create order error:', error);
            
            if (error.status === 422) {
                // Ошибки валидации с сервера
                const serverErrors = error.data?.error?.errors || {};
                const formattedErrors = {};
                
                Object.keys(serverErrors).forEach(key => {
                    if (Array.isArray(serverErrors[key])) {
                        formattedErrors[key] = serverErrors[key][0];
                    } else {
                        formattedErrors[key] = serverErrors[key];
                    }
                });
                
                setErrors(formattedErrors);
            } else {
                setErrors({ general: 'Ошибка при подключении к серверу' });
            }
        } finally {
            setLoading(false);
        }
    };

    const renderPasswordRequirements = () => {
        if (!formData.register) return null;
        
        const password = formData.password;
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
                        {/* Сообщения об ошибках и успехе */}
                        {errors.general && (
                            <div className="alert alert-danger" role="alert">
                                {errors.general}
                            </div>
                        )}
                        
                        {successMessage && (
                            <div className="alert alert-success" role="alert">
                                {successMessage}
                            </div>
                        )}

                        <form id="adForm" onSubmit={handleSubmit} noValidate>
                            <div className="row">
                                <div className="mb-3">
                                    <label htmlFor="petType" className="form-label fw-bold">Вид животного *</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.petType ? 'is-invalid' : ''}`}
                                        id="petType" 
                                        value={formData.petType}
                                        onChange={(e) => handleInputChange('petType', e.target.value)}
                                        placeholder="Например: кошка, собака, попугай" 
                                        required
                                        disabled={loading}
                                    />
                                    {errors.petType && (
                                        <div className="invalid-feedback">
                                            {errors.petType}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="petDescription" className="form-label fw-bold">Описание *</label>
                                <textarea 
                                    className={`form-control ${errors.petDescription ? 'is-invalid' : ''}`}
                                    id="petDescription" 
                                    rows="4" 
                                    value={formData.petDescription}
                                    onChange={(e) => handleInputChange('petDescription', e.target.value)}
                                    placeholder="Опишите животное, особенности, где найдено/потеряно, приметы, кличка..." 
                                    required
                                    disabled={loading}
                                ></textarea>
                                {errors.petDescription && (
                                    <div className="invalid-feedback">
                                        {errors.petDescription}
                                    </div>
                                )}
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
                                    disabled={loading}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="petLocation" className="form-label fw-bold">Район Санкт-Петербурга *</label>
                                <select 
                                    className={`form-select ${errors.petLocation ? 'is-invalid' : ''}`}
                                    id="petLocation" 
                                    value={formData.petLocation}
                                    onChange={(e) => handleInputChange('petLocation', e.target.value)}
                                    required
                                    disabled={loading}
                                >
                                    <option value="" disabled>Выберите район</option>
                                    {districts.map((district, index) => (
                                        <option key={index} value={district}>
                                            {district}
                                        </option>
                                    ))}
                                </select>
                                {errors.petLocation && (
                                    <div className="invalid-feedback">
                                        {errors.petLocation}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="petPhoto1" className="form-label fw-bold">Фотография *</label>
                                <input 
                                    type="file" 
                                    className={`form-control ${errors.photo1 ? 'is-invalid' : ''}`}
                                    id="petPhoto1" 
                                    accept="image/png, .png" 
                                    onChange={(e) => handleImageChange(e, 0)}
                                    required
                                    disabled={loading}
                                />
                                <div className="form-text">Формат: PNG. Максимальный размер: 5MB</div>
                                {errors.photo1 && (
                                    <div className="invalid-feedback">
                                        {errors.photo1}
                                    </div>
                                )}
                                
                                <label htmlFor="petPhoto2" className="form-label fw-bold mt-3">Дополнительная фотография</label>
                                <input 
                                    type="file" 
                                    className={`form-control ${errors.photo2 ? 'is-invalid' : ''}`}
                                    id="petPhoto2" 
                                    accept="image/png, .png" 
                                    onChange={(e) => handleImageChange(e, 1)}
                                    disabled={loading}
                                />
                                {errors.photo2 && (
                                    <div className="invalid-feedback">
                                        {errors.photo2}
                                    </div>
                                )}

                                <label htmlFor="petPhoto3" className="form-label fw-bold mt-3">Дополнительная фотография</label>
                                <input 
                                    type="file" 
                                    className={`form-control ${errors.photo3 ? 'is-invalid' : ''}`}
                                    id="petPhoto3" 
                                    accept="image/png, .png" 
                                    onChange={(e) => handleImageChange(e, 2)}
                                    disabled={loading}
                                />
                                {errors.photo3 && (
                                    <div className="invalid-feedback">
                                        {errors.photo3}
                                    </div>
                                )}

                                {/* Превью изображений */}
                                <div id="imagePreview" className="mt-3">
                                    <div className="row">
                                        {imagePreviews.map((preview, index) => (
                                            preview && (
                                                <div key={index} className="col-md-4 mb-3">
                                                    <div className="position-relative">
                                                        <img 
                                                            src={preview} 
                                                            className="preview-image img-thumbnail w-100" 
                                                            alt={`Preview ${index + 1}`}
                                                            style={{ height: '200px', objectFit: 'cover' }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm position-absolute top-0 end-0 mt-1 me-1"
                                                            onClick={() => removeImage(index)}
                                                            disabled={loading}
                                                        >
                                                            <i className="bi bi-x"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5 className="fw-bold mb-3">Контактная информация *</h5>
                                
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Имя</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        id="name" 
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
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
                                
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Телефон</label>
                                    <input 
                                        type="tel" 
                                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                        id="phone" 
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
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
                                
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email" 
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="example@mail.ru" 
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

                            <div className="mb-4">
                                <div className="form-check">
                                    <input 
                                        className="form-check-input"
                                        type="checkbox" 
                                        id="register" 
                                        checked={formData.register}
                                        onChange={(e) => handleInputChange('register', e.target.checked)}
                                        disabled={loading}
                                    />
                                    <label className="form-check-label fw-bold" htmlFor="register">
                                        Зарегистрировать меня как пользователя
                                    </label>
                                    <div className="form-text">
                                        Если отмечено, будет создан аккаунт с указанными email и паролем
                                    </div>
                                </div>
                            </div>

                            {formData.register && (
                                <div className="password-fields mb-4 show" id="passwordFields">
                                    <h5 className="fw-bold mb-3">Пароль для регистрации *</h5>
                                    
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Пароль</label>
                                        <input 
                                            type="password" 
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            id="password" 
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            placeholder="Введите пароль"
                                            disabled={loading}
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback">
                                                {errors.password}
                                            </div>
                                        )}
                                        {renderPasswordRequirements()}
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label htmlFor="password_confirmation" className="form-label">Подтверждение пароля</label>
                                        <input 
                                            type="password" 
                                            className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                                            id="password_confirmation" 
                                            value={formData.password_confirmation}
                                            onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                                            placeholder="Повторите пароль"
                                            disabled={loading}
                                        />
                                        {errors.password_confirmation && (
                                            <div className="invalid-feedback">
                                                {errors.password_confirmation}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <div className="form-check">
                                    <input 
                                        className={`form-check-input ${errors.confirm ? 'is-invalid' : ''}`}
                                        type="checkbox" 
                                        id="confirm" 
                                        checked={formData.confirm}
                                        onChange={(e) => handleInputChange('confirm', e.target.checked)}
                                        required
                                        disabled={loading}
                                    />
                                    <label className="form-check-label" htmlFor="confirm">
                                        Я согласен на обработку персональных данных *
                                    </label>
                                    {errors.confirm && (
                                        <div className="invalid-feedback">
                                            {errors.confirm}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button 
                                    type="submit" 
                                    className="btn btn-submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                            Публикация...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-send me-1"></i>Опубликовать объявление
                                        </>
                                    )}
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