import React, { useEffect } from 'react'
import AdminPanel from '../../components/admin/AdminPanel'
import AddProduct from '../../components/admin/AddProduct'
import { useNavigate } from 'react-router-dom'

function AdminSide() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdminAuthenticated = sessionStorage.getItem('isAdminAuthenticated');

    if (!isAdminAuthenticated) {
      navigate('/login')
    }
  }, [navigate]);

  return (
    <>
    <AdminPanel />
    <AddProduct />
    </>
  )
}

export default AdminSide