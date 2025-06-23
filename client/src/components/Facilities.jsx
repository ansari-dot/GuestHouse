import { motion } from "framer-motion"
import {
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaParking,
  FaSnowflake,
  FaCoffee,
  FaConciergeBell,
  FaDumbbell,
} from "react-icons/fa"

const facilities = [
  {
    id: 1,
    name: "Free WiFi",
    description: "Stay connected with high-speed internet throughout the property",
    icon: <FaWifi className="facility-icon" />,
  },
  {
    id: 2,
    name: "Swimming Pool",
    description: "Enjoy our outdoor swimming pool with mountain views",
    icon: <FaSwimmingPool className="facility-icon" />,
  },
  {
    id: 3,
    name: "Restaurant",
    description: "Taste local and international cuisine at our in-house restaurant",
    icon: <FaUtensils className="facility-icon" />,
  },
  {
    id: 4,
    name: "Free Parking",
    description: "Complimentary parking for all our guests",
    icon: <FaParking className="facility-icon" />,
  },
  {
    id: 5,
    name: "Air Conditioning",
    description: "All rooms equipped with climate control systems",
    icon: <FaSnowflake className="facility-icon" />,
  },
  {
    id: 6,
    name: "Coffee Shop",
    description: "Enjoy freshly brewed coffee and snacks throughout the day",
    icon: <FaCoffee className="facility-icon" />,
  },
  {
    id: 7,
    name: "Room Service",
    description: "24/7 room service for your convenience",
    icon: <FaConciergeBell className="facility-icon" />,
  },
  {
    id: 8,
    name: "Fitness Center",
    description: "Stay fit with our modern gym equipment",
    icon: <FaDumbbell className="facility-icon" />,
  },
]

const Facilities = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-md-8 mx-auto text-center">
            <h6 className="section-subtitle" data-aos="fade-up">
              Our Amenities
            </h6>
            <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
              Hotel Facilities
            </h2>
            <p className="section-description" data-aos="fade-up" data-aos-delay="200">
              Discover the exceptional amenities and services that make your stay at Sardar House comfortable and
              memorable.
            </p>
          </div>
        </div>

        <motion.div
          className="row g-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {facilities.map((facility) => (
            <div className="col-md-6 col-lg-3" key={facility.id}>
              <motion.div
                className="facility-card"
                variants={itemVariants}
                whileHover={{ y: -10, boxShadow: "0 1rem 2rem rgba(0, 0, 0, 0.2)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="facility-icon-wrapper">{facility.icon}</div>
                <h5 className="facility-title">{facility.name}</h5>
                <p className="facility-description">{facility.description}</p>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Facilities