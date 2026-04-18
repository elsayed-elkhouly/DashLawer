import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import api, { setCsrfToken } from "../api/axios";

export const Authcontext = createContext(null);

const AuthContextProvider = ({ children }) => {
  const [token, settoken] = useState(Cookies.get("token") || null);
  const [setting, setSetting] = useState([]);

  function insertToken(tkn) {
    settoken(tkn);
  }

  async function Logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    } finally {
      settoken(null);
      Cookies.remove("token");
      setSetting([]);
    }
  }

  async function getSetting() {
    try {
      const res = await api.get("/SettingsService/");
      setSetting(res?.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  }

  // async function getAllBooks() {
  //   const res = await api.get("/lawReminder/dropdown");
  //   return res.data;
  // }

  // const { data: AllBooks } = useQuery({
  //   queryKey: ["AllBooks", token],
  //   enabled: !!token,
  // });

 useEffect(() => {
  api
    .get("/csrf-token")
    .then((res) => {
      // console.log("csrf response:", res.data);
      setCsrfToken(res.data.csrfToken);
      console.log("CSRF initialized");
    })
    .catch((error) => {
      console.log("CSRF init error:", error?.response?.data || error.message);
    });
}, []);

  useEffect(() => {
    if (token) {
      getSetting();
    } else {
      setSetting([]);
    }
  }, [token]);

  return (
    <Authcontext.Provider
      value={{
        token,
        settoken,
        insertToken,
        Logout,
        setting,
        
      }}
    >
      {children}
    </Authcontext.Provider>
  );
};

export default AuthContextProvider;