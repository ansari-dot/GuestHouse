import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import { FaQuoteLeft, FaStar } from "react-icons/fa"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Travel Blogger",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    rating: 5,
    text: "Sardar House exceeded all my expectations. The views are breathtaking, the rooms are spacious and clean, and the staff went above and beyond to make our stay memorable. I highly recommend this place for anyone visiting Nathia Gali.",
  },
  {
    id: 2,
    name: "Michael Chen",
    position: "Business Traveler",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    rating: 5,
    text: "As a frequent traveler, I've stayed in many hotels, but Sardar House stands out for its exceptional service and attention to detail. The peaceful environment made it perfect for both work and relaxation.",
  },
  {
    id: 3,
    name: "Aisha Khan",
    position: "Family Vacation",
    image: "https://images.pexels.com/photos/324658/pexels-photo-324658.jpeg",
    rating: 4,
    text: "We had a wonderful family vacation at Sardar House. The kids loved the outdoor activities, and we enjoyed the delicious food. The rooms were comfortable and the mountain views were spectacular.",
  },
  {
    id: 4,
    name: "David Wilson",
    position: "Honeymoon Trip",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    rating: 5,
    text: "We chose Sardar House for our honeymoon and couldn't have made a better choice. The romantic atmosphere, private balcony, and excellent service made our special trip unforgettable.",
  },
]

const Testimonials = () => {
  const swiperRef = useRef(null)

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => <FaStar key={index} className={index < rating ? "star-filled" : "star-empty"} />)
  }

  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <section className="py-5" data-aos="fade-up">
      <div className="container">
        <div className="row mb-5">
          <div className="col-md-8 mx-auto text-center">
            <h6 className="section-subtitle">Testimonials</h6>
            <h2 className="section-title">What Our Guests Say</h2>
            <p className="section-description">
              Read authentic reviews from our valued guests who have experienced the hospitality at Sardar House.
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <Swiper
              ref={swiperRef}
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="testimonials-swiper"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="testimonial-card">
                    <div className="quote-icon">
                      <FaQuoteLeft />
                    </div>
                    <div className="testimonial-rating mb-3">{renderStars(testimonial.rating)}</div>
                    <p className="testimonial-text">{testimonial.text}</p>
                    <div className="testimonial-author">
                      <img
                        src={testimonial.image ? `${backendUrl}/uploads/${testimonial.image}` : "/default-avatar.png"}
                        alt={testimonial.name}
                        className="testimonial-avatar"
                      />
                      <div className="testimonial-info">
                        <h5 className="testimonial-name">{testimonial.name}</h5>
                        <p className="testimonial-position">{testimonial.position}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials