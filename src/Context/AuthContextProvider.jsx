import { createContext, useContext, useEffect, useState } from "react"
import api from '../api/axios';


import Cookies from "js-cookie"
import { useQuery } from "@tanstack/react-query";

export const Authcontext = createContext()

const AuthContextProvider = ({ children }) => {
  const [token, settoken] = useState(Cookies.get("token") || null)
  const [setting, setSetting] = useState([])

  function insertToken(tkn) {
    settoken(tkn)
  }

  function Logout() {
    try {
      api.post("/auth/logout", null, {
        headers: {
          authorization: `Bearer ${token}`,
        }
      })
    } catch (error) { }

    settoken(null)
    Cookies.remove("token")
  }

  async function getSetting() {
    const res = await api.get("/SettingsService/", {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    setSetting(res?.data)
  }
  function getAllBooks() {
    return api.get("/lawReminder/dropdown", {
      headers: {
        authorization: `Bearer ${token}`,

      }
    })
  }
  const { data: AllBooks } = useQuery({
  queryKey: ["AllBooks", token],
  queryFn: getAllBooks,
  enabled: !!token
})

  useEffect(function () {
    getSetting()
  }, [])

  return (
    <Authcontext.Provider value={{ token, insertToken, Logout, setting, AllBooks }}>
      {children}
    </Authcontext.Provider>
  )
}


export default AuthContextProvider