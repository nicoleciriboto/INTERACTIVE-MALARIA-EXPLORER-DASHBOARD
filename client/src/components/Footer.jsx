import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Interactive Malaria Explorer Dashboard. All rights reserved.</p>
      <div className="footer-links">
        <a href="https://www.who.int/" target="_blank" rel="noopener noreferrer">WHO</a>
        <a href="https://malariaatlas.org/" target="_blank" rel="noopener noreferrer">Malaria Atlas</a>
        <a href="https://github.com/nicoleciriboto" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </footer>
  );
};

export default Footer;
