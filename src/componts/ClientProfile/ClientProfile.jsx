import { QueryClient, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie';

const ClientProfile = () => {
  const { id } = useParams()
  function getClientProfile() {
    return axios.get(`https://lawersystem-production.up.railway.app/Client/${id}`, {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      }
    })
  }
  const { data } = useQuery({
    queryKey: ["ClientProfle"],
    queryFn:getClientProfile
  })
  console.log(data?.data?.client);
  
  return (
    <div>ClientProfile</div>
  )
}

export default ClientProfile