// src/components/newsletter-section.jsx
import React, { useState } from 'react';

const NewsletterSection = ({ onSubmit }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Базовая валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setMessage('Пожалуйста, введите корректный email адрес');
            setMessageType('error');
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            if (onSubmit) {
                const result = await onSubmit(email);
                
                if (result.success) {
                    setMessage(result.message || 'Вы успешно подписались на рассылку!');
                    setMessageType('success');
                    setEmail('');
                } else {
                    setMessage(result.message || 'Ошибка при подписке');
                    setMessageType('error');
                }
            } else {
                // Fallback если onSubmit не передан
                setTimeout(() => {
                    setMessage('Вы успешно подписались на рассылку!');
                    setMessageType('success');
                    setEmail('');
                    setLoading(false);
                }, 1000);
            }
        } catch (error) {
            setMessage('Ошибка при подключении к серверу');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="newsletter-section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="text-center mb-4">
                            <h3>Подпишитесь на наши новости</h3>
                            <p className="text-muted">Будьте в курсе новых объявлений и событий YarfPets</p>
                        </div>
                        
                        <form id="newsletterForm" onSubmit={handleSubmit}>
                            <div className="input-group mb-3">
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    placeholder="Введите ваш email" 
                                    aria-label="Email" 
                                    id="emailInput"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                                <button 
                                    className="btn btn-primary" 
                                    type="submit" 
                                    id="subscribeBtn"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="btn-spinner" aria-hidden="true"></span>
                                            <span className="visually-hidden">Загрузка...</span>
                                        </>
                                    ) : (
                                        'Подписаться'
                                    )}
                                </button>
                            </div>
                            <div className="form-text">Мы будем отправлять вам только важные уведомления и новости</div>
                        </form>
                        
                        {/* Сообщения */}
                        {message && (
                            <div 
                                className={`alert text-center mt-3 ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`} 
                                role="alert"
                            >
                                {messageType === 'success' && (
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                )}
                                {messageType === 'error' && (
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                )}
                                <span>{message}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .btn-spinner {
                    display: inline-block;
                    width: 1rem;
                    height: 1rem;
                    vertical-align: -0.125em;
                    border: 0.15em solid currentColor;
                    border-right-color: transparent;
                    border-radius: 50%;
                    animation: spinner-border 0.75s linear infinite;
                }
                
                @keyframes spinner-border {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </section>
    );
};

export default NewsletterSection;