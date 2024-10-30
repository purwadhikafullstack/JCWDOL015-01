import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={{ backgroundColor: '#f8f8f8', padding: '20px', textAlign: 'center' }}>
            <div style={{ marginBottom: '10px' }}>
                <h4>Contact Us</h4>
                <p>Email: info@example.com</p>
                <p>Phone: (123) 456-7890</p>
            </div>
            <div style={{ marginBottom: '10px' }}>
                <h4>Quick Links</h4>
                <a href="/about" style={{ margin: '0 10px' }}>About Us</a>
                <a href="/services" style={{ margin: '0 10px' }}>Services</a>
                <a href="/contact" style={{ margin: '0 10px' }}>Contact</a>
            </div>
            <div>
                <h4>Follow Us</h4>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>Facebook</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>Twitter</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>Instagram</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>LinkedIn</a>
            </div>
            <div style={{ marginTop: '20px' }}>
                <p>&copy; 2024 Your Company Name. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
