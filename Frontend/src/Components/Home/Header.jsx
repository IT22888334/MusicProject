import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "../Modals/AuthModal";

const Header = () => {
  const navigate = useNavigate();
  const [isAuthModalOpened, setIsAuthModalOpened] = useState(false);
  
  return (
    <header className="header">
      <nav>
        <div className="nav__header">
          <div className="nav__logomain">
            <Link to="/">
              <img src="/assets/musicmentor-logo.svg" alt="MusicMentor logo" />
            </Link>
          </div>
          <div className="nav__menu__btn" id="menu-btn">
            <span>
              <i className="ri-menu-line"></i>
            </span>
          </div>
        </div>
        <ul className="nav__links" id="nav-links">
          <li className="link">
            <Link to="/contact">Contact Us</Link>
          </li>
          <li className="link">
            <Link to="#browse-tutorials">Discover Tutorials</Link>
          </li>
          <li className="link">
            <Link
              to="/share"
              onClick={(e) => {
                if (!localStorage.getItem("userId")) {
                  e.preventDefault();
                  setIsAuthModalOpened(true); // Open the authentication modal if not logged in
                }
              }}
            >
              Share Your Music
            </Link>
          </li>
          <li className="link">
            <button
              onClick={() => {
                if (localStorage.getItem("userId")) {
                  navigate("/community"); // Navigate to the community page
                } else {
                  setIsAuthModalOpened(true); // Open the authentication modal
                }
              }}
              className="btn"
            >
              Join MusicMentor
            </button>
          </li>
        </ul>
      </nav>
      <div className="section__container header__container" id="home">
        <div>
          <img src="/assets/musicmentor-hero.svg" alt="Musicians collaborating" />
        </div>
        <div className="header__content">
          <h4>Learn, Share & Collaborate</h4>
          <h1 className="section__header">Elevate Your Musical Journey with MusicMentor!</h1>
          <p>
            Explore tutorials from talented musicians, share your skills, and connect with a vibrant 
            community of music enthusiasts. Whether you're a beginner or pro, MusicMentor helps you 
            grow your musical abilities.
          </p>
          <div className="header__btn">
            <button
              onClick={() => {
                if (localStorage.getItem("userId")) {
                  navigate("/community"); // Navigate to the community page
                } else {
                  setIsAuthModalOpened(true); // Open the authentication modal
                }
              }}
              className="btn"
            >
              Start Your Musical Journey
            </button>
          </div>
        </div>
      </div>
      <AuthModal
        onClose={() => {
          setIsAuthModalOpened(false);
        }}
        isOpen={isAuthModalOpened}
      />
    </header>
  );
};

export default Header;