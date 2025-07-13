import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import LoadingSpinner from "./LoadingSpinner"

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth)

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If admin access is required, check if user is admin
  if (requireAdmin) {
    if (!user || user.role !== 'admin') {
      return <Navigate to="/admin-login" replace />
    }
  }

  return children
}

export default ProtectedRoute