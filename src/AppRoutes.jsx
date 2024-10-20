import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Login from './pages/Login';
import Register from './pages/Register';
import ForgetPassword from './pages/ForgetPassword';
import LandingPage from './pages/LandingPage';
import AccountInfo from './forms/UserInfo/AccountInfo';

function AppRoutes() {
  return (
    <Router>
      <Routes>
      <Route path='/' Component={LandingPage}/>
      <Route path='/login' Component={Login}/>
      <Route path='/register' Component={Register}/>
      <Route path='/forgot-password' Component={ForgetPassword}/>
      <Route path='/trylang' Component={AccountInfo}/>
      </Routes>
    </Router>
  )
}

export default AppRoutes;