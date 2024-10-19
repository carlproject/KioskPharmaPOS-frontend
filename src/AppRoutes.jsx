import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Login from './pages/Login';
import Register from './pages/Register';

function AppRoutes() {
  return (
    <Router>
      <Routes>
      <Route path='/login' Component={Login}/>
      <Route path='/register' Component={Register}/>
      </Routes>
    </Router>
  )
}

export default AppRoutes;