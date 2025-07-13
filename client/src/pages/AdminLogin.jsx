import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { loginAdmin } from "../redux/slices/authSlice";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "admin", // Always admin for admin login
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(loginAdmin(formData)).unwrap();
      
      if (result.user?.role === "admin") {
        toast.success("Admin login successful!");
        navigate("/admin");
      } else {
        toast.error("You are not authorized as admin");
      }
    } catch (err) {
      toast.error(err.message || "Admin login failed. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="card shadow-lg border-0 rounded-lg">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <FaShieldAlt className="text-primary mb-3" size={48} />
                  <h2 className="text-primary fw-bold">Admin Access</h2>
                  <p className="text-muted">Sign in to access admin panel</p>
                </div>

                <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaEnvelope className="text-primary" />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter admin email"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-medium">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaLock className="text-primary" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter admin password"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}>
                        {showPassword ? (
                          <FaEyeSlash className="text-primary" />
                        ) : (
                          <FaEye className="text-primary" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 mb-3"
                    disabled={loading}>
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"></span>
                        Signing in...
                      </>
                    ) : (
                      "Admin Login"
                    )}
                  </button>

                  <div className="text-center">
                    <p className="mb-0">
                      <a href="/" className="text-primary text-decoration-none fw-medium">
                        Back to Home
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminLogin;
