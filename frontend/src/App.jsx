import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Spinner from './components/common/Spinner';

// Public pages
import HostelListingPage  from './pages/public/HostelListingPage';
import HostelDetailPage   from './pages/public/HostelDetailPage';
import RoomDetailPage     from './pages/public/RoomDetailPage';
import NotFoundPage       from './pages/public/NotFoundPage';
import ForbiddenPage      from './pages/public/ForbiddenPage';
 
// Auth pages
import LoginPage    from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
 
// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import BookingForm      from './pages/student/BookingForm';
import BookingDetail    from './pages/student/BookingDetail';
import UploadReceiptPage from './pages/student/UploadReceiptPage';
import ProfilePage      from './pages/student/ProfilePage';
 
// Admin pages
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminBookings     from './pages/admin/AdminBookings';
import AdminHostels      from './pages/admin/AdminHostels';
import AdminUsers        from './pages/admin/AdminUsers';
import AdminBookingReview from './pages/admin/AdminBookingReview';
 
// Manager pages
import ManagerDashboard from './pages/admin/ManagerDashboard';
 
/** Redirects unauthenticated users to /login */
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullScreen />;
  if (!user)   return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/403" replace />;
  return children;
}
 
/** Redirects authenticated users away from login/register */
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullScreen />;
  if (user) {
    if (user.role === 'admin')   return <Navigate to="/admin" replace />;
    if (user.role === 'manager') return <Navigate to="/manager" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
 
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"          element={<HostelListingPage />} />
        <Route path="/hostels"   element={<HostelListingPage />} />
        <Route path="/hostels/:id" element={<HostelDetailPage />} />
        <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
        <Route path="/403"       element={<ForbiddenPage />} />
        <Route path="*"          element={<NotFoundPage />} />

        {/* Guest only */}
        <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Student */}
        <Route path="/dashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/book/:roomId" element={<ProtectedRoute roles={['student']}><BookingForm /></ProtectedRoute>} />
        <Route path="/bookings/:id" element={<ProtectedRoute roles={['student','admin','manager']}><BookingDetail /></ProtectedRoute>} />
        <Route path="/bookings/:id/upload" element={<ProtectedRoute roles={['student']}><UploadReceiptPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin"            element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/bookings"   element={<ProtectedRoute roles={['admin','manager']}><AdminBookings /></ProtectedRoute>} />
        <Route path="/admin/bookings/:id" element={<ProtectedRoute roles={['admin','manager']}><AdminBookingReview /></ProtectedRoute>} />
        <Route path="/admin/hostels"    element={<ProtectedRoute roles={['admin']}><AdminHostels /></ProtectedRoute>} />
        <Route path="/admin/users"      element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />

        {/* Manager */}
        <Route path="/manager"          element={<ProtectedRoute roles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </>
  );
}
