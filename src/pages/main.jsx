import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import SearchHeader from '../components/search-header';
import LogoutModal from '../components/logout-modal';
import CompanyInfo from '../components/company-info';
import PetCard from '../components/pet-card';
import NewsletterSection from '../components/newsletter-section';

const Main = () => {
    return (
        <div>
            <Header/>
            
            <main>
                <SearchHeader/>
                <CompanyInfo/>
            </main>
            <Footer/>
        </div>
    )
}

export default Main;