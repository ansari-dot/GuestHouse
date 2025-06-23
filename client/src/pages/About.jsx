import { motion } from "framer-motion"
import { FaCheck, FaUsers, FaHistory, FaEye } from "react-icons/fa"

const About = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      {/* Hero Section */}
      <section className="page-hero" style={{ backgroundImage: "url(https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg)" }}>
        <div className="hero-slide">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <h1 className="display-3 text-white mb-4">About Us</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-center">
                    <li className="breadcrumb-item">
                      <a href="/" className="text-white">Home</a>
                    </li>
                    <li className="breadcrumb-item active text-secondary" aria-current="page">
                      About
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right">
              <div className="position-relative">
                <img
                  src="https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg"
                  alt="Sardar House"
                  className="img-fluid rounded-3 about-main-img"
                />
                <img
                  src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"
                  alt="Sardar House Interior"
                  className="img-fluid rounded-3 position-absolute about-overlay-img"
                />
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <h6 className="section-subtitle">Our Story</h6>
              <h2 className="section-title">A Legacy of Hospitality in Nathia Gali</h2>
              <p className="section-description">
                Founded in 2010, Sardar House has been providing exceptional hospitality to guests from around the
                world. What started as a small family-owned guest house has grown into one of the most sought-after
                accommodations in Nathia Gali.
              </p>
              <p className="section-description">
                Our commitment to quality service, attention to detail, and the warm Pakistani hospitality has earned us
                a reputation as a premier destination for travelers seeking comfort and luxury in the mountains.
              </p>
              <div className="row mt-4">
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <FaCheck className="text-secondary me-3" />
                    <span>Luxury Accommodations</span>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <FaCheck className="text-secondary me-3" />
                    <span>Panoramic Mountain Views</span>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <FaCheck className="text-secondary me-3" />
                    <span>Exceptional Dining</span>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <FaCheck className="text-secondary me-3" />
                    <span>Personalized Service</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Owner Message */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h6 className="section-subtitle">Owner's Message</h6>
              <h2 className="section-title">Welcome to Our Home</h2>
              <div className="mb-4">
                <img 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" 
                  alt="Owner" 
                  className="rounded-circle img-fluid about-owner-img"
                />
              </div>
              <blockquote className="blockquote">
                <p className="fst-italic text-muted">
                  "At Sardar House, we believe in creating more than just a place to stay. We strive to create
                  experiences that our guests will cherish for a lifetime. Our team is dedicated to ensuring that every
                  aspect of your stay exceeds your expectations. We look forward to welcoming you to our home in the
                  beautiful mountains of Nathia Gali."
                </p>
                <footer className="blockquote-footer mt-3">
                  <cite>Muhammad Sardar, Founder & Owner</cite>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4" data-aos="fade-up">
              <div className="card h-100 text-center border-0 shadow">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-center align-items-center rounded-circle mx-auto mb-4" style={{ width: "4rem", height: "4rem" }}>
                    <FaUsers className="text-primary" style={{ fontSize: "1.75rem" }} />
                  </div>
                  <h3 className="card-title h5">Our Team</h3>
                  <p className="card-text">
                    Our dedicated team consists of hospitality professionals who are passionate about creating memorable
                    experiences for our guests. From our front desk staff to our housekeeping team, everyone at Sardar
                    House is committed to providing exceptional service.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="card h-100 text-center border-0 shadow">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-center align-items-center rounded-circle mx-auto mb-4" style={{ width: "4rem", height: "4rem" }}>
                    <FaEye className="text-primary" style={{ fontSize: "1.75rem" }} />
                  </div>
                  <h3 className="card-title h5">Our Vision</h3>
                  <p className="card-text">
                    To be recognized as the premier hospitality destination in Nathia Gali, known for our exceptional
                    service, luxurious accommodations, and commitment to sustainable tourism that benefits the local
                    community and preserves the natural beauty of the region.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="card h-100 text-center border-0 shadow">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-center align-items-center rounded-circle mx-auto mb-4" style={{ width: "4rem", height: "4rem" }}>
                    <FaHistory className="text-primary" style={{ fontSize: "1.75rem" }} />
                  </div>
                  <h3 className="card-title h5">Our Mission</h3>
                  <p className="card-text">
                    To provide our guests with an unforgettable mountain retreat experience through personalized service,
                    comfortable accommodations, and authentic Pakistani hospitality, while promoting sustainable tourism
                    practices that respect and preserve the local environment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Counter Section */}
      <section
        className="py-5 position-relative"
        style={{ 
          backgroundImage: "url(https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(16, 55, 92, 0.85)" }}></div>
        <div className="container position-relative">
          <div className="row g-4 text-white">
            <div className="col-6 col-md-3 text-center" data-aos="fade-up">
              <h2 className="display-4 fw-bold text-secondary">12+</h2>
              <p className="text-uppercase fw-bold">Years of Experience</p>
            </div>
            <div className="col-6 col-md-3 text-center" data-aos="fade-up" data-aos-delay="100">
              <h2 className="display-4 fw-bold text-secondary">20+</h2>
              <p className="text-uppercase fw-bold">Luxury Rooms</p>
            </div>
            <div className="col-6 col-md-3 text-center" data-aos="fade-up" data-aos-delay="200">
              <h2 className="display-4 fw-bold text-secondary">5000+</h2>
              <p className="text-uppercase fw-bold">Happy Guests</p>
            </div>
            <div className="col-6 col-md-3 text-center" data-aos="fade-up" data-aos-delay="300">
              <h2 className="display-4 fw-bold text-secondary">4.8</h2>
              <p className="text-uppercase fw-bold">Average Rating</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default About