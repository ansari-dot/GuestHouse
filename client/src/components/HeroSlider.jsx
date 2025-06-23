import { useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"

const slides = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    title: "Welcome to Sardar House",
    subtitle: "Luxury Retreat in Nathia Gali",
    description: "Experience the beauty of mountains with our premium accommodations and services.",
    buttonText: "Explore Rooms",
    buttonLink: "/rooms",
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
    title: "Breathtaking Views",
    subtitle: "Surrounded by Nature",
    description: "Wake up to stunning mountain views and fresh air in our carefully designed rooms.",
    buttonText: "Book Now",
    buttonLink: "/booking",
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    title: "Unforgettable Experience",
    subtitle: "Create Lasting Memories",
    description: "Enjoy our world-class amenities and personalized service for a perfect getaway.",
    buttonText: "View Gallery",
    buttonLink: "/gallery",
  },
]

const HeroSlider = () => {
  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="hero-slider-container" ref={ref}>
      <Swiper
        modules={[EffectFade, Autoplay, Navigation, Pagination]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        className="hero-swiper h-100"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div 
              className="hero-slide d-flex align-items-center" 
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Gradient Overlay for Home Hero Only */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(100, 100, 100, 0.4))',
                  zIndex: 0,
                }}
              ></div>
              <div className="container h-100">
                <div className="row h-100 align-items-center">
                  <div className="col-lg-8 col-md-10">
                    <motion.div 
                      className="hero-content" 
                      initial="hidden" 
                      animate={controls} 
                      variants={textVariants}
                    >
                      <motion.span className="subtitle d-block" variants={itemVariants}>
                        {slide.subtitle}
                      </motion.span>
                      <motion.h1 className="title" variants={itemVariants}>
                        {slide.title}
                      </motion.h1>
                      <motion.p className="description" variants={itemVariants}>
                        {slide.description}
                      </motion.p>
                      <motion.div variants={itemVariants}>
                        <Link to={slide.buttonLink} className="btn btn-primary btn-lg">
                          {slide.buttonText}
                        </Link>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default HeroSlider