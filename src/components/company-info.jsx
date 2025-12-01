import React from 'react';
import infoImage from '../assets/images/info.png';

const CompanyInfo = () => {
    return(
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="text-center mb-5">
                        <h2 className="mb-4">О компании YarfPets</h2>
                        <p className="lead">YarfPets - это современная платформа, созданная для помощи домашним животным и их хозяевам в Санкт-Петербурге.</p>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <img src={infoImage} className="img-fluid rounded shadow mx-auto d-block info-image" alt="Команда YarfPets"/>
                        </div>
                        <div className="col-lg-6">
                            <p>Мы помогаем:</p>
                            <ul className="list-unstyled">
                                <li><i className="bi bi-check-circle text-primary me-2"></i>Находить потерявшихся питомцев</li>
                                <li><i className="bi bi-check-circle text-primary me-2"></i>Пристраивать животных в добрые руки</li>
                                <li><i className="bi bi-check-circle text-primary me-2"></i>Объединять сообщество любителей животных</li>
                                <li><i className="bi bi-check-circle text-primary me-2"></i>Оказывать информационную поддержку</li>
                            </ul>
                            <p>Наша миссия - сделать город безопасным для домашних животных и помочь каждому питомцу обрести любящую семью.</p>
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="row justify-content-center text-center">
                            <div className="col-md-4 mb-3">
                                <div className="border rounded p-3">
                                    <h3 className="text-primary">500+</h3>
                                    <p className="mb-0">Найденных животных</p>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="border rounded p-3">
                                    <h3 className="text-primary">18</h3>
                                    <p className="mb-0">Районов охвата</p>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="border rounded p-3">
                                    <h3 className="text-primary">24/7</h3>
                                    <p className="mb-0">Поддержка</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CompanyInfo;