import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, adminOnly = false, vendorOnly = false }) => {
  const { isAuthenticated, isAdmin, isVendor } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  if (vendorOnly && !isVendor) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
