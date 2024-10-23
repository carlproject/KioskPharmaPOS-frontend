import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Login from './pages/Login';
import ForgetPassword from './pages/ForgetPassword';
import LandingPage from './pages/LandingPage';
import AccountInfo from './forms/UserInfo/AccountInfo';
import Cart from './components/pos/Cart';
import RegisterPage from './pages/RegisterPage';

function AppRoutes() {
  return (
    <Router>
      <Routes>
      <Route path='/' Component={LandingPage}/>
      <Route path='/login' Component={Login}/>
      <Route path='/register' Component={RegisterPage}/>
      <Route path='/forgot-password' Component={ForgetPassword}/>
      <Route path='/cart' Component={Cart}/>
      </Routes>
    </Router>
  )
}

export default AppRoutes;