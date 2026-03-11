import React, { createContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie';

export const Authcontext = createContext()
 
const AuthContextProvider = ({children}) => {
  const [token, settoken] = useState(null)
  function insertToken(tkn) {
    settoken(tkn)
  }
        
 function Logout(){
   settoken(null)
   Cookies.remove("token");
 }
   useEffect(function(){
        if(Cookies.get("token") != null ){
          settoken(Cookies.get("token"))
        }
   },[])

  return (
    <Authcontext.Provider value={{

      token,
      insertToken,
      Logout

    }}>{children}</Authcontext.Provider >
  )
}

export default AuthContextProvider