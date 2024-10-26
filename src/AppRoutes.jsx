import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import Login from './pages/Login';
import ForgetPassword from './pages/ForgetPassword';
import LandingPage from './pages/LandingPage';
import Cart from './components/pos/Cart';
import RegisterPage from './pages/RegisterPage';
import MeetTheTeam from './components/MeetTheTeam';
import Nav from './components/Nav';
import NavLayout from './layout/NavLayout';

function AppRoutes() {

  return (
    <Router>
      <Routes>
      <Route path='/login' Component={Login}/>
      <Route path='/register' Component={RegisterPage}/>
      <Route path='/forgot-password' Component={ForgetPassword}/>
      
      <Route element={<NavLayout />}>
          <Route path="/" Component={LandingPage} />
          <Route path="/meet-the-team" Component={MeetTheTeam} />
        </Route>
      




      <Route path='/cart' Component={Cart}/>

      <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes;