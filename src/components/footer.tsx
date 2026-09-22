import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer>
      <div className="footer-bar">
        <div className="footer-left">
          <p className="footer-signature">Road Safety Academy</p>
          <p className="footer-tag">Every Journey Safe. Every Life Valued.</p>
        </div>

        <div className="footer-links">
          <p className="footer-heading">Quick Links</p>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/donate">Donate</Link>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <p className="footer-heading">Get In Touch</p>
          <ul>
            <li>
              <Mail />
              info@ayubowan.lk
            </li>
            <li>
              <Phone />
              +94 11 234 5678
            </li>
            <li>
              <MapPin />
              123 Galle Road, Colombo 03, Sri Lanka
            </li>
          </ul>
        </div>

        <div className="footer-social">
          <p className="footer-heading">Follow</p>
          <ul>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer noopener">
                <Facebook style={{ width: '1rem', height: '1rem' }} />
                &nbsp;Facebook
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noreferrer noopener">
                <Twitter style={{ width: '1rem', height: '1rem' }} />
                &nbsp;Twitter
              </a>
            </li>
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer noopener">
                <Linkedin style={{ width: '1rem', height: '1rem' }} />
                &nbsp;LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Road Safety Academy (RSA). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
