import React from 'react';

const ProfileStats = ({ adsCount, petsCount }) => {
    return(
        <div className="card">
            <div className="card-body">
                <h2 className="card-title h5">Статистика</h2>
                <div className="mb-3">
                    <div className="d-flex justify-content-between">
                        <span>Объявлений:</span>
                        <span className="fw-bold" id="ordersCount">{adsCount}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span>Найдено хозяев:</span>
                        <span className="fw-bold" id="petsCount">{petsCount}</span>
                    </div>
                </div>
                <h2 className="card-title h5 mt-3">Быстрые действия</h2>
                <div className="d-grid gap-2">
                    <a href="/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle me-1"></i>Добавить объявление
                    </a>
                    <button className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#logoutModal">
                        <i className="bi bi-box-arrow-right me-1"></i>Выйти
                    </button>
                </div>
            </div>
        </div>
    )
};

export default ProfileStats;