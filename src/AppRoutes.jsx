import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Cart from './components/pos/Cart';
import RegisterPage from './pages/RegisterPage';
import MeetTheTeam from './components/MeetTheTeam';
import NavLayout from './layout/NavLayout';
import Contact from './components/Contact';
import ForgotPasswordComponent from './components/authComponents/ForgotPasswordComponent';
import AdminSide from './pages/adminPage/AdminSide';

function AppRoutes() {

  return (
    <Router>
      <Routes>
      <Route path='/login' Component={Login}/>
      <Route path='/register' Component={RegisterPage}/>
      <Route path='/forgot-password' Component={ForgotPasswordComponent}/>
      
      <Route element={<NavLayout />}>
          <Route path="/" Component={LandingPage} />
          <Route path="/meet-the-team" Component={MeetTheTeam} />
          <Route path="/contact-us" Component={Contact} />
        </Route>
      
      <Route path='/admin/' Component={AdminSide} />
      <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes;