import { h2 } from 'framer-motion/client'
import React from 'react'
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({children}) => {
    if (Cookies.get("token") == null) {
     return <Navigate to={"/Login"}/> ;
        
    }
  return (
    <>{children}</>
  )
}

export default ProtectedRoute