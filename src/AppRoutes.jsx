import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom'

import Login from './pages/Login';
import ForgetPassword from './pages/ForgetPassword';
import LandingPage from './pages/LandingPage';
import AccountInfo from './forms/UserInfo/AccountInfo';
import Cart from './components/pos/Cart';
import RegisterPage from './pages/RegisterPage';
import MeetTheTeam from './components/MeetTheTeam';
import Nav from './components/Nav';



function AppRoutes() {

  const location = useLocation();
  const showNavbar = location.pathname === '/' || location.pathname === '/meet-the-team';
  return (
    <Router>
        {showNavbar && <Nav />}
      <Routes>
      <Route path='/' Component={LandingPage}/>
      <Route path='/login' Component={Login}/>
      <Route path='/register' Component={RegisterPage}/>
      <Route path='/forgot-password' Component={ForgetPassword}/>
      <Route path='/meet-the-team' Component={MeetTheTeam}/>
      <Route path='/cart' Component={Cart}/>

      <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes;