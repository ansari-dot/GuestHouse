import { Link } from "react-router-dom"
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaTripadvisor,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
} from "react-icons/fa"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer-section">
      <div className="footer-top py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <div className="footer-logo mb-4">
                  <Link to="/" className="text-white text-decoration-none">
                    <h3 className="mb-0">Sardar House</h3>
                  </Link>
                </div>
                <p className="footer-desc">
                  Sardar House is a luxury guest house located in the heart of Nathia Gali, offering breathtaking views
                  of the mountains and exceptional hospitality to make your stay memorable.
                </p>
                <div className="footer-social">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <FaFacebookF />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <FaTwitter />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <FaInstagram />
                  </a>
                  <a href="https://tripadvisor.com" target="_blank" rel="noopener noreferrer" aria-label="TripAdvisor">
                    <FaTripadvisor />
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-6">
              <div className="footer-widget">
                <h4 className="footer-widget-title">Quick Links</h4>
                <ul className="footer-links">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/rooms">Rooms</Link>
                  </li>
                  <li>
                    <Link to="/gallery">Gallery</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact</Link>
                  </li>
                  <li>
                    <Link to="/booking">Book Now</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h4 className="footer-widget-title">Contact Info</h4>
                <ul className="footer-contact">
                  <li>
                    <FaMapMarkerAlt className="contact-icon" />
                    <span>Nathia Gali, Abbottabad, KPK, Pakistan</span>
                  </li>
                  <li>
                    <FaPhone className="contact-icon" />
                    <span>+92 300 1234567</span>
                  </li>
                  <li>
                    <FaEnvelope className="contact-icon" />
                    <span>info@sardarhouse.com</span>
                  </li>
                  <li>
                    <FaClock className="contact-icon" />
                    <span>24/7 Customer Support</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h4 className="footer-widget-title">Newsletter</h4>
                <p className="newsletter-text">Subscribe to our newsletter to receive updates and special offers.</p>
                <form className="newsletter-form">
                  <div className="input-group">
                    <input type="email" className="form-control" placeholder="Your Email" required />
                    <button className="btn btn-secondary" type="submit">
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom py-3">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p className="copyright-text mb-0">&copy; {currentYear} Sardar House. All Rights Reserved.</p>
            </div>
            <div className="col-md-6">
              <ul className="footer-bottom-links">
                <li>
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms-conditions">Terms & Conditions</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer