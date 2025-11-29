import React from 'react';

const NewsletterSection = () => {
    return(
        <section className="newsletter-section">
            <div className="content-container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="text-center mb-4">
                            <h3>Подпишитесь на наши новости</h3>
                            <p className="text-muted">Будьте в курсе новых объявлений и событий YarfPets</p>
                        </div>
                        
                        <form id="newsletterForm">
                            <div className="input-group mb-3">
                                <input type="email" className="form-control" placeholder="Введите ваш email" aria-label="Email" id="emailInput" required/>
                                <button className="btn btn-primary" type="submit" id="subscribeBtn">
                                    <span id="subscribeText">Подписаться</span>
                                    <span id="subscribeSpinner" className="btn-spinner d-none" aria-hidden="true"></span>
                                </button>
                            </div>
                            <div className="form-text">Мы будем отправлять вам только важные уведомления и новости</div>
                        </form>
                        
                        <div id="successMessage" className="alert alert-success d-none text-center" role="alert">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            <strong>Спасибо за подписку!</strong> Вы успешно подписались на наши новости.
                        </div>
                        
                        <div id="errorMessage" className="alert alert-danger d-none text-center" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <span id="errorText">Произошла ошибка при подписке</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default NewsletterSection;