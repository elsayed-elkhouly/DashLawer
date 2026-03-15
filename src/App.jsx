import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './componts/Layout/Layout'
import Login from './componts/Login/Login'
import Dashbord from './componts/Dashbrd/Dashbord'
import CaseMange from './componts/CaseMahgment/CaseMange'
import Team from './componts/TeamMember/Team'
import Bills from './componts/Bills/Bills'
import Calendar from './componts/Calendar/Calendar'
import DigitalArchive from './componts/Digital Archive/DigitalArchive'
import Setting from './componts/Setting/Setting'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './componts/ProtectedRoute/ProtectedRoute'
import AddMember from './componts/AddMember/AddMember'
import AuthContextProvider from './Context/AuthContextProvider'
import Clients from './componts/Clients/Clients'
import {

  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import ClientProfile from './componts/ClientProfile/ClientProfile'
import AddNewCase from './componts/AddCase/AddNewCase'
function App() {
  const router = createBrowserRouter([{
    path: "", element: <Layout />, children: [
      { index: true, element: <ProtectedRoute><Dashbord /></ProtectedRoute> },
      { path: "/CaseMangemnt", element: <ProtectedRoute><CaseMange /></ProtectedRoute> },
      { path: "/CaseMangemnt/AddNewCase", element: <ProtectedRoute><AddNewCase /></ProtectedRoute> },
      { path: "/TeamMember", element: <ProtectedRoute><Team /></ProtectedRoute> },
      { path: "/Bills", element: <ProtectedRoute><Bills /></ProtectedRoute> },
      { path: "/Calender", element: <ProtectedRoute><Calendar /></ProtectedRoute> },
      { path: "/DigitalArchive", element: <ProtectedRoute><DigitalArchive /></ProtectedRoute> },
      { path: "/Clients", element: <ProtectedRoute><Clients /></ProtectedRoute> },
      { path: "/Setting", element: <ProtectedRoute><Setting /></ProtectedRoute> },
      { path: "/AddMember", element: <ProtectedRoute><AddMember /></ProtectedRoute> },
      { path: "/Clients/ClientProfile/:id", element: <ProtectedRoute><ClientProfile /></ProtectedRoute> },
      { path: "/Login", element: <Login /> },


    ]
  }])
  const client = new QueryClient()
  return (
    <>
      <AuthContextProvider>
        <QueryClientProvider client={client}>
          <Toaster
            position="top-center"
            containerStyle={{
              zIndex: 99999,
            }}
            toastOptions={{
              style: {
                zIndex: 99999,
              },
            }}
          />
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthContextProvider>

    </>
  )
}

export default App
