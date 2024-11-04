import React, { useEffect, useState } from 'react'
import AdminPanel from '../../components/admin/AdminPanel'
import AddProduct from '../../components/admin/AddProduct'
import { useNavigate } from 'react-router-dom'
import Inventory from '../../components/admin/Inventory'
import UserManagement from '../../components/admin/UserManagement'
import Product from '../../components/admin/Product'
import Analytics from '../../components/admin/Analytics'
import Notifications from '../../components/admin/Notifications'

function AdminSide() {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('Dashboard');

  useEffect(() => {
    const isAdminAuthenticated = sessionStorage.getItem('isAdminAuthenticated');

    if (!isAdminAuthenticated) {
      navigate('/login')
    }
  }, [navigate]);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Dashboard':
        return <AddProduct />;
      case 'User Management':
        return <UserManagement />;
      case 'Sales And Product':
        return <Product />
      case 'Inventory':
        return <Inventory />;
      case 'Analytics':
        return <Analytics />
      default:
        return <AddProduct />;
    }
  };

  return (
    <>
    <AdminPanel setActiveComponent={setActiveComponent} activeComponent={activeComponent}/>
    <div className="flex-1 p-2">
        {renderComponent()}
      </div>
    </>
  )
}

export default AdminSide