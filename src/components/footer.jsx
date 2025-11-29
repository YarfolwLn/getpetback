import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-4">
            <div className="footer-container">
                <div className="row">
                    <div className="col-md-4">
                        <h5>YarfPets</h5>
                        <p>Помогаем домашним животным найти свой дом.</p>
                    </div>
                    <div className="col-md-4">
                        <h5>Контакты</h5>
                        <ul className="list-unstyled">
                            <li><i className="bi bi-telephone"></i> +7 (999) 123-45-67</li>
                            <li><i className="bi bi-envelope"></i> info@yarfpets.ru</li>
                            <li><i className="bi bi-geo-alt"></i> Санкт-Петербург</li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Быстрые ссылки</h5>
                        <ul className="list-unstyled">
                            <li><a href="/main" className="text-decoration-none text-light">Главная</a></li>
                            <li><a href="/profile" className="text-decoration-none text-light">Личный кабинет</a></li>
                            <li><a href="/addob" className="text-decoration-none text-light">Добавить объявление</a></li>
                            <li><a href="/searchob" className="text-decoration-none text-light">Поиск</a></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center mt-3">
                    <p>&copy; 2025 YarfPets. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;