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
import CaseDetails from './componts/CaseDetails/CaseDetails'
import Eror from './componts/Eror/Eror'
import AddNewFees from './componts/AddNewFees/AddNewFees'
import TaskMangment from './componts/TaskMangment/TaskMangment'
import BookMangment from './componts/BookMangment/BookMangment'
import AddSession from './componts/AddSession/AddSession'
import TeamProfile from './componts/TeamProfile/TeamProfile'
import MyProfile from './componts/MyProfile/MyProfile'
import SessionDetails from './componts/SessionDetails/SessionDetails'
import PyrollMangment from './componts/PyrollMangment/PyrollMangment'
import BookOfLaw from './componts/BookofLaw/BookOfLaw'
import AllSesions from './componts/AllSesions/AllSesions'
import AddNewCaseinvoice from './componts/AddNewCaseinvoice/AddNewCaseinvoice'
function App() {
  const router = createBrowserRouter([{
    path: "", element: <Layout />, children: [
      { index: true, element: <ProtectedRoute><Dashbord /></ProtectedRoute> },
      { path: "/CaseMangemnt", element: <ProtectedRoute><CaseMange /></ProtectedRoute> },
      { path: "/CaseMangemnt/AddNewCase", element: <ProtectedRoute><AddNewCase /></ProtectedRoute> },
      { path: "/CaseMangemnt/CaseDetails/:id", element: <ProtectedRoute><CaseDetails /></ProtectedRoute> },
      { path: "/CaseMangemnt/CaseDetails/:id/SessionDetails", element: <ProtectedRoute><SessionDetails /></ProtectedRoute> },
      { path: "/CaseMangemnt/CaseDetails/:id/AddSession", element: <ProtectedRoute><AddSession /></ProtectedRoute> },
      { path: "/CaseMangemnt/CaseDetails/:id/AddNewCaseinvoice", element: <ProtectedRoute><AddNewCaseinvoice /></ProtectedRoute> },
      { path: "/TeamMember", element: <ProtectedRoute><Team /></ProtectedRoute> },
      { path: "/TeamMember/TeamProfile/:id", element: <ProtectedRoute><TeamProfile /></ProtectedRoute> },
      { path: "/BookMangment", element: <ProtectedRoute><BookMangment /></ProtectedRoute> },
      { path: "/Bills", element: <ProtectedRoute><Bills /></ProtectedRoute> },
      { path: "/Bills/AddNewFees", element: <ProtectedRoute><AddNewFees /></ProtectedRoute> },
      { path: "/Calender", element: <ProtectedRoute><Calendar /></ProtectedRoute> },
      { path: "/DigitalArchive", element: <ProtectedRoute><DigitalArchive /></ProtectedRoute> },
      { path: "/Clients", element: <ProtectedRoute><Clients /></ProtectedRoute> },
      { path: "/TaskMangment", element: <ProtectedRoute><TaskMangment/></ProtectedRoute> },
      { path: "/PyrollMangment", element: <ProtectedRoute><PyrollMangment/></ProtectedRoute> },
      { path: "/Setting", element: <ProtectedRoute><Setting /></ProtectedRoute> },
      { path: "/BookOfLaw", element: <ProtectedRoute>< BookOfLaw /></ProtectedRoute> },
      { path: "/MyProfile", element: <ProtectedRoute><MyProfile /></ProtectedRoute> },
      { path: "/AddMember", element: <ProtectedRoute><AddMember /></ProtectedRoute> },
      { path: "/AllSesions", element: <ProtectedRoute><AllSesions /></ProtectedRoute> },
      { path: "/Clients/ClientProfile/:id", element: <ProtectedRoute><ClientProfile /></ProtectedRoute> },
      { path: "/Login", element: <Login /> },
      { path: "*", element: <Eror /> },


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
