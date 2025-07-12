// import Signup from './components/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import LandingPage from './components/LandingPage'
import ChatPage from './components/ChatPage'
import HomePage from './components/HomePage'
import ProfilePage from './components/ProfilePage'
import ProfilePageOrg from './components/ProfilePageOrg'
import RecruitmentResponses from './components/RecruitmentResponses'
import { validateToken } from './api'

// Conditional Profile Page Component
const ConditionalProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  
  if (!user) return null;
  
  // Render org profile page for org users, regular profile page for others
  return user.role === 'org' ? <ProfilePageOrg /> : <ProfilePage />;
};

function App() {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only set up token validation if user is logged in
    if (user) {
      // Check token every 5 minutes
      const interval = setInterval(() => {
        validateToken();
      }, 5 * 60 * 1000); // 5 minutes

      // Also check token when the page becomes visible (user comes back to tab)
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          validateToken();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/homepage' element={<HomePage />} />
        <Route path='/chat' element={<ChatPage />} />
        <Route path='/profile' element={<ConditionalProfilePage />} />
        <Route path='/recruitment/:recruitmentId/responses' element={<RecruitmentResponses />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
