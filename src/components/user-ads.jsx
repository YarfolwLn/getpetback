import React from 'react';

const UserAds = ({ ads }) => {
    return(
        <section className="tab-pane fade show active" id="ads" role="tabpanel" aria-labelledby="ads-tab">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Мои объявления</h3>
                <a href="/add-ad" className="btn btn-primary">
                    <i className="bi bi-plus-circle me-1"></i>Добавить объявление
                </a>
            </div>

            <div className="row">
                {ads.map(ad => (
                    <article key={ad.id} className="col-md-6 mb-4">
                        <div className="card h-100">
                            <img src={ad.image} className="card-img-top" alt={ad.title}/>
                            <div className="card-body">
                                <h4 className="card-title h5">{ad.title}</h4>
                                <p className="card-text">{ad.description}</p>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <small className="text-muted">{ad.district}</small>
                                    <span className={`badge badge-status-${ad.status}`}>{ad.statusText}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted">ID: {ad.id}</small>
                                    <small className="text-muted">{ad.date}</small>
                                </div>
                                <div className="mt-2">
                                    <small className="text-muted">Метка: {ad.mark}</small>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="btn-group w-100">
                                    <button className="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target={`#editAdModal${ad.id}`}>
                                        <i className="bi bi-pencil"></i>
                                        <span className="visually-hidden">Редактировать объявление</span>
                                    </button>
                                    <button className="btn btn-outline-danger btn-sm" data-bs-toggle="modal" data-bs-target={`#deleteAdModal${ad.id}`}>
                                        <i className="bi bi-trash"></i>
                                        <span className="visually-hidden">Удалить объявление</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>  
        </section>
    )
};

export default UserAds;