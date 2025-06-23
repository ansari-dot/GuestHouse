import { useState, useEffect } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { toggleDarkMode, toggleRTL } from "../redux/slices/themeSlice"
import { FaSun, FaMoon, FaGlobe } from "react-icons/fa"
import ProfileDropdown from "./ProfileDropdown"

const Navbar = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const { darkMode, rtl } = useSelector((state) => state.theme)
  const { user } = useSelector((state) => state.auth)
  const [scrolled, setScrolled] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setExpanded(false)
  }, [location])

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top ${scrolled ? "bg-white shadow" : ""} ${
        darkMode ? "navbar-dark" : "navbar-light"
      }`}
      style={{ transition: "all 0.3s ease" }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <span className="text-primary">Sardar House</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-controls="navbarNav"
          aria-expanded={expanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${expanded ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${isActive ? "active text-primary" : ""}`} 
                to="/"
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${isActive ? "active text-primary" : ""}`} 
                to="/about"
              >
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${isActive ? "active text-primary" : ""}`} 
                to="/rooms"
              >
                Rooms
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${isActive ? "active text-primary" : ""}`} 
                to="/gallery"
              >
                Gallery
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${isActive ? "active text-primary" : ""}`} 
                to="/contact"
              >
                Contact
              </NavLink>
            </li>
            {user ? (
              <li className="nav-item">
                <ProfileDropdown />
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => `nav-link btn btn-outline-primary me-2 ${isActive ? "active" : ""}`} 
                    to="/register"
                  >
                    Sign Up
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => `nav-link btn btn-primary text-white ${isActive ? "active" : ""}`} 
                    to="/login"
                  >
                    Login
                  </NavLink>
                </li>
              </>
            )}
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link btn btn-primary text-white ms-2 ${isActive ? "active" : ""}`} 
                to="/booking"
              >
                Book Now
              </NavLink>
            </li>
          </ul>

          <div className="d-flex ms-lg-3 mt-3 mt-lg-0">
            <button
              className="btn btn-sm btn-outline-secondary me-2"
              onClick={() => dispatch(toggleDarkMode())}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => dispatch(toggleRTL())}
              aria-label={rtl ? "Switch to LTR" : "Switch to RTL"}
            >
              <FaGlobe />
              <span className="ms-1 d-none d-md-inline">{rtl ? "LTR" : "RTL"}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar