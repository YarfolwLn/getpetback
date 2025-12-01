import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import CompanyInfo from '../components/company-info';
import NewsletterSection from '../components/newsletter-section';
import PetCard from '../components/pet-card';
import PetModal from '../components/pet-modal';
import SearchHeader from '../components/search-header';
import belkaImage from '../assets/images/belka.jpg';
import catImage from '../assets/images/cat.jpg';
import ezhImage from '../assets/images/ezh.jpg';
import tigerImage from '../assets/images/tiger.jpg';
import dogImage from '../assets/images/dog.jpg';
import parrotImage from '../assets/images/parrot.jpg';

const Main = () => {
    const pets = [
        {
            id: 1,
            title: "Найдена белка",
            description: "Милая белочка ищет новый дом. Очень активная и дружелюбная.",
            image: belkaImage,
            district: "Петроградский район",
            date: "15.01.2024",
            contact: "+7 (911) 234-56-79",
            author: "Мария",
            animalType: "белка",
            mark: "BL-0156",
            status: "Найдено"
        },
        {
            id: 2,
            title: "Найдена кошка",
            description: "Пушистая кошка ищет заботливых хозяев. Приучена к лотку.",
            image: catImage,
            district: "Василеостровский район",
            date: "12.01.2024",
            contact: "+7 (911) 234-56-78",
            author: "Иван",
            animalType: "кошка",
            mark: "VL-0214",
            status: "Найдено"
        },
        {
            id: 3,
            title: "Найден ёж",
            description: "Колючий ёжик ищет новый дом. Требуется специальный уход.",
            image: ezhImage,
            district: "Невский район",
            date: "08.01.2024",
            contact: "+7 (911) 234-56-80",
            author: "Анна",
            animalType: "ёж",
            mark: "EH-0347",
            status: "Найдено"
        },
        {
            id: 4,
            title: "Найден тигрёнок",
            description: "Маленький тигрёнок найден в пригороде. Требуется специализированный уход.",
            image: tigerImage,
            district: "Приморский район",
            date: "15.01.2024",
            contact: "+7 (911) 234-56-81",
            author: "Сергей",
            animalType: "тигр",
            mark: "TG-0789",
            status: "Найдено"
        },
        {
            id: 5,
            title: "Пропала собака",
            description: "Пропала собака породы хаски. Кобель, 2 года. Откликнется на кличку Рекс.",
            image: dogImage,
            district: "Выборгский район",
            date: "10.01.2024",
            contact: "+7 (911) 234-56-82",
            author: "Алексей",
            animalType: "собака",
            mark: "DG-0456",
            status: "Пропало"
        },
        {
            id: 6,
            title: "Найден попугай",
            description: "Найден волнистый попугай голубого окраса. Ищет хозяев.",
            image: parrotImage,
            district: "Фрунзенский район",
            date: "07.01.2024",
            contact: "+7 (911) 234-56-83",
            author: "Ольга",
            animalType: "попугай",
            mark: "PT-0234",
            status: "Найдено"
        }
    ];

    return (
        <div>
            <Header isAuthenticated={false} />
            
            {/* Шапка поиска */}
            <SearchHeader/>

            {/* Информация о компании */}
            <CompanyInfo />

            {/* Карусель с последними найденными животными */}
            <div className="carousel-container">
                <h2 className="carousel-title">Последние найденные животные</h2>
                <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" 
                                className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" 
                                aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" 
                                aria-label="Slide 3"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" 
                                aria-label="Slide 4"></button>
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <div className="carousel-image-container">
                                        <img src={belkaImage} className="d-block w-100" alt="Белка"/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="carousel-content">
                                        <h4>Найдена белка</h4>
                                        <p>Помогите найти дом для этой милой белочки. Очень активная и дружелюбная, откликается на кличку "Пуша".</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <div className="carousel-image-container">
                                        <img src={catImage} className="d-block w-100" alt="Кошка"/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="carousel-content">
                                        <h4>Найдена кошка</h4>
                                        <p>Ищет хозяев пушистый друг. Приучена к лотку, очень ласковая и общительная.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <div className="carousel-image-container">
                                        <img src={ezhImage} className="d-block w-100" alt="Ёж"/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="carousel-content">
                                        <h4>Найден ёж</h4>
                                        <p>Колючий, но очень добрый. Требуется специальный уход и забота.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <div className="carousel-image-container">
                                        <img src={tigerImage} className="d-block w-100" alt="Тигр"/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="carousel-content">
                                        <h4>Найден тигрёнок</h4>
                                        <p>Требуется помощь в содержании экзотического животного. Очень игривый и любознательный.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            {/* Активные объявления */}
            <div className="container mt-5">
                <h2 className="text-center mb-4">Активные объявления</h2>
                <div className="row">
                    {pets.map(pet => (
                        <PetCard key={pet.id} pet={pet} />
                    ))}
                </div>
            </div>

            {/* Секция подписки */}
            <NewsletterSection />

            {/* Футер */}
            <Footer />

            {/* Модальные окна */}
            {pets.map(pet => (
                <PetModal key={pet.id} pet={pet} />
            ))}
        </div>
    );
};

export default Main;