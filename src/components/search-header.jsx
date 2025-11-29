import React from 'react';

const SearchHeader = () => {
    return(
        <div className="search-header">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-8">
                        <h1 className="display-5 fw-bold">Найдите своего питомца в Санкт-Петербурге</h1>
                        <p className="lead">Помогаем воссоединить животных с их хозяевами</p>
                    </div>
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body">
                                <form id="mainSearchForm">
                                    <div className="input-group">
                                        <input type="text" className="form-control" id="mainSearchInput" placeholder="Введите вид животного, породу, приметы..."/>
                                        <button className="btn btn-search" type="submit">
                                            <i className="bi bi-search"></i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default SearchHeader;