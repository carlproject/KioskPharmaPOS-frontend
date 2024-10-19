import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Login from './pages/Login';

function AppRoutes() {
  return (
    <Router>
      <Routes>
      <Route path='/login' Component={Login}/>
      </Routes>
    </Router>
  )
}

export default AppRoutes;