import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import axios from "axios";
const Contact = () => {
  const { loading, success, error } = useSelector((state) => state.messages);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/addFeedback",
        formData
      );
      console.log(response);
      if (response.data.success === true) {
        toast(response.data.message);
      }
    } catch (err) {
      console.error("Error while submitting feedback:", err);
      toast("Something went wrong!");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}>
      {/* Hero Section */}
      <section
        className="page-hero"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg)",
        }}>
        <div className="hero-slide">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <h1 className="display-3 text-white mb-4">Contact Us</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-center">
                    <li className="breadcrumb-item">
                      <a href="/" className="text-white">
                        Home
                      </a>
                    </li>
                    <li
                      className="breadcrumb-item active text-secondary"
                      aria-current="page">
                      Contact
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            {/* Contact Info */}
            <div className="col-lg-4" data-aos="fade-up">
              <div className="card h-100 border-0 shadow">
                <div className="card-body p-4">
                  <h3 className="card-title text-primary mb-4 position-relative pb-3">
                    Get in Touch
                    <div
                      className="position-absolute bottom-0 start-0"
                      style={{
                        width: "50px",
                        height: "2px",
                        backgroundColor: "var(--secondary-color)",
                      }}></div>
                  </h3>
                  <p className="text-muted mb-4">
                    We'd love to hear from you. Contact us for reservations,
                    inquiries, or any assistance you may need.
                  </p>

                  <div className="contact-details">
                    <div className="d-flex mb-4">
                      <div
                        className="d-flex justify-content-center align-items-center rounded-circle me-3"
                        style={{ width: "3rem", height: "3rem" }}>
                        <FaMapMarkerAlt className="text-primary" />
                      </div>
                      <div>
                        <h5 className="mb-1">Address</h5>
                        <p className="text-muted mb-0">
                          Nathia Gali, Abbottabad, KPK, Pakistan
                        </p>
                      </div>
                    </div>

                    <div className="d-flex mb-4">
                      <div
                        className="d-flex justify-content-center align-items-center rounded-circle me-3"
                        style={{ width: "3rem", height: "3rem" }}>
                        <FaPhone className="text-primary" />
                      </div>
                      <div>
                        <h5 className="mb-1">Phone</h5>
                        <p className="text-muted mb-0">+92 300 1234567</p>
                        <p className="text-muted mb-0">+92 321 9876543</p>
                      </div>
                    </div>

                    <div className="d-flex mb-4">
                      <div
                        className="d-flex justify-content-center align-items-center rounded-circle me-3"
                        style={{ width: "3rem", height: "3rem" }}>
                        <FaEnvelope className="text-primary" />
                      </div>
                      <div>
                        <h5 className="mb-1">Email</h5>
                        <p className="text-muted mb-0">info@sardarhouse.com</p>
                        <p className="text-muted mb-0">
                          bookings@sardarhouse.com
                        </p>
                      </div>
                    </div>

                    <div className="d-flex">
                      <div
                        className="d-flex justify-content-center align-items-center rounded-circle me-3"
                        style={{ width: "3rem", height: "3rem" }}>
                        <FaClock className="text-primary" />
                      </div>
                      <div>
                        <h5 className="mb-1">Working Hours</h5>
                        <p className="text-muted mb-0">24/7 Customer Support</p>
                        <p className="text-muted mb-0">
                          Check-in: 2:00 PM, Check-out: 12:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-8" data-aos="fade-up" data-aos-delay="100">
              <div className="card border-0 shadow">
                <div className="card-body p-4">
                  <h3 className="card-title text-primary mb-4 position-relative pb-3">
                    Send us a Message
                    <div
                      className="position-absolute bottom-0 start-0"
                      style={{
                        width: "50px",
                        height: "2px",
                        backgroundColor: "var(--secondary-color)",
                      }}></div>
                  </h3>

                  {success && (
                    <div className="alert alert-success" role="alert">
                      Your message has been sent successfully! We'll get back to
                      you soon.
                    </div>
                  )}

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="name">Your Name</label>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="email">Your Email</label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="subject"
                            name="subject"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="subject">Subject</label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-floating">
                          <textarea
                            className="form-control"
                            id="message"
                            name="message"
                            placeholder="Your Message"
                            style={{ height: "150px" }}
                            value={formData.message}
                            onChange={handleChange}
                            required></textarea>
                          <label htmlFor="message">Your Message</label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={resetForm}
                            disabled={loading}>
                            Reset
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}>
                            {loading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"></span>
                                Sending...
                              </>
                            ) : (
                              "Send Message"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-0">
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-12">
              <div data-aos="fade-up">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13249.071317049432!2d73.35!3d34.0833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38de3105c9a5b4e3%3A0x4a0d6c7365ba0a51!2sNathia%20Gali%2C%20Abbottabad%2C%20Khyber%20Pakhtunkhwa%2C%20Pakistan!5e0!3m2!1sen!2s!4v1623456789012!5m2!1sen!2s"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Sardar House Location"></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;
