import Nav from '../components/Nav';
import { Outlet } from 'react-router-dom';

function NavLayout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

export default NavLayout;
