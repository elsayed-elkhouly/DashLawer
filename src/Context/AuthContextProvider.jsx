import React, { createContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';

export const Authcontext = createContext()

const AuthContextProvider = ({ children }) => {
  const [token, settoken] = useState(null)
  const [setting, setSetting] = useState([])
  function insertToken(tkn) {
    settoken(tkn)
  }

  function Logout() {
    try {
      const res = axios.post("https://lawersystem-production.up.railway.app/auth/logout", null, {
        headers: {
          authorization: `Bearer ${token}`,
        }
      })
      settoken(null)
      Cookies.remove("token");
    } catch (error) {

    }
  }
  async function getSetting() {
    const res = await axios.get("https://lawersystem-production.up.railway.app/SettingsService/")
    setSetting(res?.data)
  }
  useEffect(function () {
    getSetting()
    if (Cookies.get("token") != null) {
      settoken(Cookies.get("token"))
    }
  }, [])

  return (
    <Authcontext.Provider value={{

      token,
      insertToken,
      Logout,
      setting

    }}>{children}</Authcontext.Provider >
  )
}

export default AuthContextProvider