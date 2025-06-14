import React, { useContext, useState, useEffect } from 'react'; // Added useState, useEffect
import { Button } from '../UI/button';
import Navbar from '../UI/navbar'; // Your existing Navbar
import { AppContext } from '../../context/AppContext';
import { IoArrowForward } from 'react-icons/io5';
import { FiMenu, FiX, FiActivity, FiBriefcase } from 'react-icons/fi'; // Added FiBriefcase for Employee icon
import clsx from 'clsx';
import { toast } from 'react-toastify'; // Assuming setup elsewhere
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Use Link for navigation
import { LoginPopUpContext } from '../../context/LoginPopContext';
import LoginPopup from '../Login/LoginPopup';
import { AccountVerifyContext } from '../../context/AccountVerifyContext';
// import AccountVerify from '../accountVerification/accountVerify';
import ThemeToggle from '../UI/ThemeToggle';
import ScrollingText from '../UI/ScrollingText'; // Assuming you have a scrolling text component
// For conditional classes

const Header: React.FC = () => {
    // Added React.FC type
    const { userData, setIsLoggedin, setUserData, backendUrl } =
        useContext(AppContext);
    const {
        verifyAccountPopup,
        setVerifyAccountPopup,
        handleVerifyAccountOpen,
        handleVerifyAccountClose,
    } = useContext(AccountVerifyContext);

    const { handleLoginClick, setPopup, popup, handleLoginClose } =
        useContext(LoginPopUpContext);

    const navigate = useNavigate(); // For programmatic navigation like logout

    // --- State for Mobile Menu ---
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Close mobile menu if window resizes to desktop width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                // lg breakpoint
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const NavItems = [
        // ... (Keep your NavItems array as is) ...
        { label: 'Home', href: '/index' },
        {
            label: 'Solutions',
            children: [
                { label: 'Software Solutions', href: '/software-solutions' },
                { label: 'Staffing Solutions', href: '/staffing-solutions' },
            ],
        },
        { label: 'Products', href: '/products' },
        { label: 'Contact', href: '/contact' },
         {
            label: 'Training',
            children: [
                { label: 'Smaatix Training', href: '/training' },
                { label: 'Clinimode Training', href: 'https://clinimode.com' },
            ],
        },
        { label: 'Careers', href: '/careers' },
        { label: 'About Us', href: '/about-us' },
    ];

    const Logout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(`${backendUrl}/api/auth/logout`);
            if (response.status === 200) {
                toast.success('Logged out successfully');
                if (setIsLoggedin) setIsLoggedin(false);
                if (setUserData) setUserData(false);
                navigate('/index');
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Logout failed');
        } finally {
            setIsMobileMenuOpen(false); // Close mobile menu after action
        }
    };

    // Function to render nav links for both desktop and mobile
    const renderNavLinks = (isMobile = false) => {
        return NavItems.map((item) => {
            if (item.children) {
                if (isMobile) {
                    return (
                        <div
                            key={item.label}
                            className='py-2'
                        >
                            <span className='font-semibold text-foreground  px-4'>
                                {item.label}
                            </span>
                            <ul className='pl-6 mt-1 space-y-1'>
                                {item.children.map((child) => (
                                    <li key={child.label}>
                                        <Link
                                            to={child.href}
                                            className='block px-4 py-1 text-foreground-secondary hover:bg-[--interactive-bg-hover] rounded'
                                            onClick={toggleMobileMenu}
                                        >
                                            {child.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                } else {
                    // Desktop uses Navbar component (handled below)
                    return null;
                }
            }
            return (
                <Link
                    key={item.label}
                    to={item.href}
                    className={clsx(
                        'block px-4 py-2 rounded transition-colors',
                        isMobile
                            ? 'text-foreground hover:bg-[--interactive-bg-hover]' // Mobile link styling
                            : 'text-sm font-medium text-foreground hover:text-accent-start dark:text-neutral-100 dark:hover:text-accent-start' // Desktop link styling (passed to Navbar or direct)
                    )}
                    onClick={isMobile ? toggleMobileMenu : undefined} // Close menu on mobile click
                >
                    {item.label}
                </Link>
            );
        });
    };

    return (
        <>
            <header className='sticky top-0 z-50 w-full h-16 border-b border-[--header-border] bg-[--header-background] backdrop-blur-lg'>
                <div className='container mx-auto px-4 md:px-6 h-full flex items-center justify-between gap-4'>
                    {/* Logo */}
                    <Link
                        to='/index'
                        className='flex-shrink-0'
                    >
                        <img
                            src='/smaatix-logo.png' // Use root-relative path if logo is in public/
                            alt='Smaatix Logo'
                            // Adjusted size for responsiveness
                            className='h-9 w-auto md:h-10'
                            // Remove fixed width/height attributes if using CSS size
                        />
                    </Link>
    
                    {/* Desktop Navigation (Hidden on Mobile/Tablet) */}
                    <nav className='hidden lg:flex items-center'>
                        <Navbar navItems={NavItems} />
                    </nav>
    
                    {/* Right Side Controls */}
                    <div className='flex items-center gap-2 md:gap-3'>
                        {/* Clinimode Special Button */}
                        <a 
                            href="https://clinimode.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-teal-500/20 text-foreground hover:from-blue-500/30 hover:to-teal-500/30 border border-blue-500/30 shadow-sm transition-all duration-300 relative overflow-hidden"
                            aria-label="Visit Clinimode"
                        >
                            {/* Glow effect */}
                            <span className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/40 to-teal-400/0 blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-500"></span>
                            
                            {/* Content */}
                            <FiActivity className="h-5 w-5 text-blue-500 relative z-10" />
                            <span className="text-sm font-medium hidden sm:inline relative z-10 bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent font-semibold">Clinimode</span>
                            <h1 className="sr-only">Clinimode</h1>
                        </a>
    
                        {/* Employee Login Button */}
                        <a 
                            href="https://email.godaddy.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-foreground hover:from-purple-500/30 hover:to-indigo-500/30 border border-purple-500/30 shadow-sm transition-all duration-300 relative overflow-hidden"
                            aria-label="Employee Login"
                        >
                            {/* Glow effect */}
                            <span className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/40 to-indigo-400/0 blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-500"></span>
                            
                            {/* Content */}
                            <FiBriefcase className="h-5 w-5 text-purple-500 relative z-10" />
                            <span className="text-sm font-medium hidden sm:inline relative z-10 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent font-semibold">Employee</span>
                            <h1 className="sr-only">Employee Login</h1>
                        </a>
    
                        <ThemeToggle />
    
                        {/* --- User/Login Section --- */}
                        {userData ? (
                            <div className='group relative'>
                                <button className='flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background dark:bg-neutral-200 dark:text-neutral-900 text-sm font-semibold uppercase'>
                                    {userData?.name?.[0] || '?'}{' '}
                                    {/* Safer access */}
                                </button>
                                {/* Profile Dropdown */}
                                <div className='absolute right-0 top-full z-20 mt-2 w-48 origin-top-right scale-95 transform rounded-lg border border-[--card-border] bg-[--card-background] p-1.5 opacity-0 shadow-[var(--card-shadow)] transition-all duration-200 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100'>
                                    <ul className='text-sm'>
                                        {/* profile link if applicable */}
                                        {/* <li><Link to="/profile" className="block w-full text-left px-3 py-1.5 rounded hover:bg-[--interactive-bg-hover] text-foreground">Profile</Link></li> */}
                                        {!userData?.isVerified && (
                                            <li>
                                                <button
                                                    className='block w-full text-left px-3 py-1.5 rounded hover:bg-[--interactive-bg-hover] text-foreground'
                                                    onClick={() => {
                                                        handleVerifyAccountOpen();
                                                        setIsMobileMenuOpen(
                                                            false
                                                        );
                                                    }}
                                                >
                                                    Verify Email
                                                </button>
                                            </li>
                                        )}
                                        <li>
                                            <button
                                                className='block w-full text-left px-3 py-1.5 rounded hover:bg-[--interactive-bg-hover] text-foreground'
                                                onClick={Logout}
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className='hidden sm:block'>
                                <Button
                                    variant={'ghost'}
                                    size={'sm'}
                                    onClick={handleLoginClick}
                                    className='group flex items-center gap-1'
                                >
                                    Login
                                    <IoArrowForward className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                                </Button>
                            </div>
                        )}
    
                        {/* Mobile Menu Toggle (Hidden on Large screens) */}
                        <div className='lg:hidden'>
                            <button
                                onClick={toggleMobileMenu}
                                className='inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-[--interactive-bg-hover] focus:outline-none'
                                aria-controls='mobile-menu'
                                aria-expanded={isMobileMenuOpen}
                            >
                                <span className='sr-only'>Open main menu</span>
                                {isMobileMenuOpen ? (
                                    <FiX
                                        className='block h-6 w-6'
                                        aria-hidden='true'
                                    />
                                ) : (
                                    <FiMenu
                                        className='block h-6 w-6'
                                        aria-hidden='true'
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
    
                {/* --- Mobile Menu --- */}
                <div
                    id='mobile-menu'
                    className={clsx(
                        'absolute left-0 top-16 z-40 w-full origin-top transform border-b border-[--header-border] bg-white shadow-lg backdrop-blur-lg transition-all duration-300 ease-in-out lg:hidden',
                        isMobileMenuOpen
                            ? 'scale-y-100 opacity-100'
                            : 'scale-y-95 opacity-0 pointer-events-none'
                    )}
                >
                    <nav className='space-y-1 px-4 pb-4 pt-2 max-md:bg-background backdrop-blur-3xl'>
                        {renderNavLinks(true)}
    
                        {/* Employee Login for Mobile Menu */}
                        <div className='mt-4 pt-4 border-t border-[--color-border]'>
                            <a 
                                href="https://email.godaddy.com/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-fit flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-foreground hover:from-purple-500/30 hover:to-indigo-500/30 border border-purple-500/30"
                                onClick={toggleMobileMenu} // Close menu on click
                            >
                                <FiBriefcase className="h-5 w-5 text-purple-500" />
                                <span className="text-sm font-medium">Employee Login</span>
                            </a>
                        </div>
    
                        {/* Login Button for Mobile Menu (if not logged in) */}
                        {!userData && (
                            <div className='mt-4'>
                                <Button
                                    variant={'default'} // Maybe solid button here
                                    size={'sm'}
                                    onClick={() => {
                                        handleLoginClick();
                                        toggleMobileMenu();
                                    }} // Close menu on click
                                    className='w-fit group flex items-center justify-center gap-1'
                                >
                                    Login
                                    <IoArrowForward className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
                {/* --- End Mobile Menu --- */}
                <ScrollingText/>
            </header>
    
            {/* Popups remain outside the header */}
            <LoginPopup />
    
            {/* {verifyAccountPopup && <AccountVerify />} */}
        </>
    );
};

export default Header;