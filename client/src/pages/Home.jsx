import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import HeroSlider from "../components/HeroSlider"
import Facilities from "../components/Facilities"
import RoomCard from "../components/RoomCard"
import Testimonials from "../components/Testimonials"
import { fetchRooms } from "../redux/slices/roomsSlice"
import { FaArrowRight } from "react-icons/fa"

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { rooms, loading, error } = useSelector((state) => state.rooms)

  useEffect(() => {
    if (!rooms || rooms.length === 0) {
      dispatch(fetchRooms());
    }
  }, [dispatch, rooms]);

  const handleRoomClick = (room) => {
    navigate(`/rooms`, { state: { selectedRoomId: room._id } });
  };

  const featuredRooms = Array.isArray(rooms) ? rooms.slice(0, 3) : []

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <HeroSlider />

      {/* About Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right">
              <img
                src="https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg"
                alt="About Sardar House"
                className="img-fluid rounded"
                style={{ height: "400px", width: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <h6 className="section-subtitle">Welcome to Sardar House</h6>
              <h2 className="section-title">Experience Luxury in the Heart of Nathia Gali</h2>
              <p className="section-description">
                Nestled in the picturesque mountains of Nathia Gali, Sardar House offers a perfect blend of luxury,
                comfort, and natural beauty. Our guest house is designed to provide you with an unforgettable
                experience, whether you're seeking a peaceful retreat or an adventure in the mountains.
              </p>
              <p className="section-description">
                With stunning views, exceptional service, and modern amenities, we ensure that your stay with us is
                nothing short of extraordinary.
              </p>
              <Link to="/about" className="btn btn-primary">
                Discover More <FaArrowRight className="ms-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <Facilities />

      {/* Rooms Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-md-8 mx-auto text-center">
              <h6 className="section-subtitle" data-aos="fade-up">
                Accommodation
              </h6>
              <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
                Our Popular Rooms
              </h2>
              <p className="section-description" data-aos="fade-up" data-aos-delay="200">
                Choose from our selection of beautifully designed rooms offering comfort and luxury.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : featuredRooms.length === 0 ? (
            <div className="text-center">
              <p>No featured rooms available at the moment.</p>
            </div>
          ) : (
            <div className="row g-4">
              {featuredRooms.map((room) => (
                <div key={room._id || room.id} className="col-lg-4 col-md-6">
                  <RoomCard room={room} onClick={handleRoomClick} />
                </div>
              ))}
            </div>
          )}

          <div className="row mt-5">
            <div className="col-12 text-center">
              <Link to="/rooms" className="btn btn-outline-primary btn-lg">
                View All Rooms <FaArrowRight className="ms-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="text-center" data-aos="fade-up">
                <div className="row align-items-center">
                  <div className="col-lg-8 mb-4 mb-lg-0">
                    <h2 className="mb-3">Ready to Experience Luxury?</h2>
                    <p className="mb-0 fs-5">
                      Book your stay at Sardar House today and enjoy the perfect mountain getaway.
                    </p>
                  </div>
                  <div className="col-lg-4 text-lg-end">
                    <Link to="/booking" className="btn btn-secondary btn-lg">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default Home