import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode, Navigation, Thumbs, Zoom } from "swiper/modules"
import { FaTimes } from "react-icons/fa"

// Sample gallery data
const galleryData = {
  categories: [
    { id: "all", name: "All" },
    { id: "rooms", name: "Rooms" },
    { id: "dining", name: "Dining" },
    { id: "exterior", name: "Exterior" },
    { id: "amenities", name: "Amenities" },
  ],
  images: [
    { id: 1, src: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg", category: "rooms", title: "Luxury Suite" },
    { id: 2, src: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg", category: "rooms", title: "Deluxe Room" },
    { id: 3, src: "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg", category: "dining", title: "Restaurant" },
    { id: 4, src: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg", category: "dining", title: "Breakfast Buffet" },
    { id: 5, src: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg", category: "exterior", title: "Hotel Front View" },
    { id: 6, src: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg", category: "exterior", title: "Garden Area" },
    { id: 7, src: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg", category: "amenities", title: "Swimming Pool" },
    { id: 8, src: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg", category: "amenities", title: "Fitness Center" },
    { id: 9, src: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg", category: "rooms", title: "Family Suite" },
    { id: 10, src: "https://images.pexels.com/photos/1001965/pexels-photo-1001965.jpeg", category: "exterior", title: "Mountain View" },
    { id: 11, src: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg", category: "dining", title: "Coffee Shop" },
    { id: 12, src: "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg", category: "amenities", title: "Spa" },
  ],
}

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getImageUrl = (src) => src ? (src.startsWith('http') ? src : `${backendUrl}/uploads/${src}`) : "/default-room.jpg";

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("all")
  const [filteredImages, setFilteredImages] = useState([])
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    currentIndex: 0,
  })
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredImages(galleryData.images)
    } else {
      setFilteredImages(galleryData.images.filter((image) => image.category === activeCategory))
    }
  }, [activeCategory])

  const openLightbox = (index) => {
    setLightbox({
      isOpen: true,
      currentIndex: index,
    })
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setLightbox({
      ...lightbox,
      isOpen: false,
    })
    document.body.style.overflow = "auto"
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      {/* Hero Section */}
      <section className="page-hero" style={{ backgroundImage: "url(https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg)" }}>
        <div className="hero-slide">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <h1 className="display-3 text-white mb-4">Gallery</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-center">
                    <li className="breadcrumb-item">
                      <a href="/" className="text-white">Home</a>
                    </li>
                    <li className="breadcrumb-item active text-secondary" aria-current="page">
                      Gallery
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-5">
        <div className="container">
          {/* Category Filter */}
          <div className="row mb-5">
            <div className="col-12 text-center" data-aos="fade-up">
              <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                {galleryData.categories.map((category) => (
                  <button
                    key={category.id}
                    className={`btn ${activeCategory === category.id ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="row g-4">
            {filteredImages.map((image, index) => (
              <div className="col-md-6 col-lg-4" key={image.id} data-aos="fade-up" data-aos-delay={index * 50}>
                <div 
                  className="position-relative overflow-hidden rounded cursor-pointer"
                  onClick={() => openLightbox(index)}
                  style={{ height: "250px" }}
                >
                  <img 
                    src={getImageUrl(image.src)} 
                    alt={image.title} 
                    className="img-fluid w-100 h-100"
                    style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                  />
                  <div 
                    className="position-absolute bottom-0 start-0 w-100 p-3 text-white"
                    style={{ 
                      background: "linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)",
                      opacity: 0,
                      transition: "opacity 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = 1}
                    onMouseLeave={(e) => e.target.style.opacity = 0}
                  >
                    <h5 className="mb-1">{image.title}</h5>
                    <p className="mb-0 small opacity-75">
                      {galleryData.categories.find((cat) => cat.id === image.category)?.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox.isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.9)", zIndex: 9999 }}
        >
          <button 
            className="btn btn-link position-absolute text-white"
            style={{ top: "1rem", right: "1rem", fontSize: "1.5rem", zIndex: 10000 }}
            onClick={closeLightbox}
          >
            <FaTimes />
          </button>

          <div className="w-100" style={{ maxWidth: "1000px", padding: "0 2rem" }}>
            <Swiper
              modules={[FreeMode, Navigation, Thumbs, Zoom]}
              navigation
              zoom
              thumbs={{ swiper: thumbsSwiper }}
              initialSlide={lightbox.currentIndex}
              className="mb-3"
            >
              {filteredImages.map((image) => (
                <SwiperSlide key={image.id}>
                  <div className="swiper-zoom-container">
                    <img src={getImageUrl(image.src)} alt={image.title} className="img-fluid w-100" />
                  </div>
                  <div className="text-center text-white mt-3">
                    <h5>{image.title}</h5>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <Swiper
              onSwiper={setThumbsSwiper}
              modules={[FreeMode, Navigation, Thumbs]}
              spaceBetween={10}
              slidesPerView={4}
              freeMode
              watchSlidesProgress
              style={{ height: "100px" }}
            >
              {filteredImages.map((image) => (
                <SwiperSlide key={image.id}>
                  <img 
                    src={getImageUrl(image.src)} 
                    alt={image.title} 
                    className="img-fluid w-100 h-100 rounded"
                    style={{ objectFit: "cover", opacity: 0.5, cursor: "pointer" }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default Gallery