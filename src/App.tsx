import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import IndexPage from './components/landingpage/index.js';
import MainLayout from './layout/MainLayout';
import Contact from './components/contact/Contact';
import SoftwareSolutions from './pages/SoftwareSolutions.js';
import Careers from './pages/Careers.js';
import AboutUs from './pages/About.js';
import Training from './pages/Training.js';
import Products from './pages/Products.js';
import Staffingsolutions from './pages/Staffingsolutions.js';
import { ToastContainer } from 'react-toastify';
import ApplicationForm from './components/JobApplicationForm/JobApplicationForm.tsx'
import EmployeeIDForm from './pages/EmployeeIDForm.jsx'

const App = () => {
    const ScrollToTop = () => {
        const { pathname } = useLocation();

        useEffect(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Instantly scrolls to the top
        }, [pathname]); // Runs every time the path changes

        return null;
    };



    return (
        <div className='background dark:text-white sm:max-w-screen max-sm:overflow-hidden'>
            <ToastContainer className='top-28' />

            <ScrollToTop />

            {/* This makes it scroll to top automatically */}
            <Routes>
                <Route
                    path='/'
                    element={<MainLayout />}
                >
                    <Route
                        index
                        element={<Navigate to='/index' />}
                    />
                    <Route
                        path='/index'
                        element={<IndexPage />}
                    />
                    <Route
                        path='/contact'
                        element={<Contact />}
                    />
                    <Route
                        path='/software-solutions'
                        element={<SoftwareSolutions />}
                    />
                    <Route
                        path='/about-us'
                        element={<AboutUs />}
                    />
                    <Route
                        path='/careers'
                        element={<Careers />}
                    />
                    <Route
                        path='/training'
                        element={<Training />}
                    />
                    <Route
                        path='/products'
                        element={<Products />}
                    />
                    <Route
                        path='/staffing-solutions'
                        element={<Staffingsolutions />}
                    />
                    <Route
                        path='/Application-Form'
                        element={<ApplicationForm />}
                    />
                    <Route
                        path='*'
                        element={<Navigate to='/index' />}
                    />
                    <Route
                        path="/employee/:uuid"
                        element={<EmployeeIDForm />}
                    />

                </Route>
            </Routes>
        </div>
    );
};

export default App;
