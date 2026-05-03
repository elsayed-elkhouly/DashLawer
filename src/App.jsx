import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./componts/Layout/Layout";
import Login from "./componts/Login/Login";
import Dashbord from "./componts/Dashbrd/Dashbord";
import CaseMange from "./componts/CaseMahgment/CaseMange";
import Team from "./componts/TeamMember/Team";
import Bills from "./componts/Bills/Bills";
import Calendar from "./componts/Calendar/Calendar";
import DigitalArchive from "./componts/Digital Archive/DigitalArchive";
import Setting from "./componts/Setting/Setting";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./componts/ProtectedRoute/ProtectedRoute";
import AddMember from "./componts/AddMember/AddMember";
import AuthContextProvider from "./Context/AuthContextProvider";
import Clients from "./componts/Clients/Clients";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import ClientProfile from "./componts/ClientProfile/ClientProfile";
import AddNewCase from "./componts/AddCase/AddNewCase";
import CaseDetails from "./componts/CaseDetails/CaseDetails";
import Eror from "./componts/Eror/Eror";
import AddNewFees from "./componts/AddNewFees/AddNewFees";
import TaskMangment from "./componts/TaskMangment/TaskMangment";
import TaskDetails from "./componts/TaskMangment/TaskDetails";
import BookMangment from "./componts/BookMangment/BookMangment";
import AddSession from "./componts/AddSession/AddSession";
import TeamProfile from "./componts/TeamProfile/TeamProfile";
import MyProfile from "./componts/MyProfile/MyProfile";
import SessionDetails from "./componts/SessionDetails/SessionDetails";
import PyrollMangment from "./componts/PyrollMangment/PyrollMangment";
import BookOfLaw from "./componts/BookofLaw/BookOfLaw";
import AllSesions from "./componts/AllSesions/AllSesions";
import AddNewCaseinvoice from "./componts/AddNewCaseinvoice/AddNewCaseinvoice";
import Dashbord2 from "./componts/Dashbord2/Dashbord2";
import { jwtDecode } from "jwt-decode";
import PackegesMangment from "./componts/PackegesMangment/PackegesMangment";
import ClientMangment from "./componts/ClientMangment/ClientMangment";
import Coupon from "./componts/Coupon/Coupon";
import OfficeProfile from "./componts/OfficeProfile/OfficeProfile";
import AddCopoun from "./componts/AddCopoun/AddCopoun";
import AllWebSite from "./componts/AllWebSite/AllWebSite";

const client = new QueryClient();
function getCookie(name) {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  if (!cookie) return null;

  return decodeURIComponent(cookie.split("=").slice(1).join("="));
}

let role = null;

try {
  const token = getCookie("token");

  // console.log("token:", token);
  // console.log("type:", typeof token);

  if (typeof token === "string" && token.trim() !== "") {
    role = jwtDecode(token).role;
  }
} catch (error) {
  console.error("Token decode error:", error);
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            {role === "SUPER_ADMIN" ? <Dashbord2 /> : <Dashbord />}
          </ProtectedRoute>
        )
      },
      { path: "/CaseMangemnt", element: <ProtectedRoute><CaseMange /></ProtectedRoute> },
      { path: "/PackegesMangment", element: <ProtectedRoute><PackegesMangment /></ProtectedRoute> },
      { path: "/ClientMangment", element: <ProtectedRoute><ClientMangment /></ProtectedRoute> },
      { path: "/CaseMangemnt/AddNewCase", element: <ProtectedRoute><AddNewCase /></ProtectedRoute> },
      { path: "/CaseMangemnt/CaseDetails/:id", element: <ProtectedRoute><CaseDetails /></ProtectedRoute> },
      { path: "/ClientMangment/OfficeProfile/:id", element: <ProtectedRoute><OfficeProfile /></ProtectedRoute> },
      { path: "/CaseMangemnt/CaseDetails/:id/SessionDetails", element: <ProtectedRoute><SessionDetails /></ProtectedRoute> },
      { path: "/CaseMangemnt/CaseDetails/:id/AddSession", element: <ProtectedRoute><AddSession /></ProtectedRoute> },
      { path: "/CaseMangemnt/CaseDetails/:id/AddNewCaseinvoice", element: <ProtectedRoute><AddNewCaseinvoice /></ProtectedRoute> },
      { path: "/TeamMember", element: <ProtectedRoute><Team /></ProtectedRoute> },
      { path: "/TeamMember/TeamProfile/:id", element: <ProtectedRoute><TeamProfile /></ProtectedRoute> },
      { path: "/BookMangment", element: <ProtectedRoute><BookMangment /></ProtectedRoute> },
      { path: "/Bills", element: <ProtectedRoute><Bills /></ProtectedRoute> },
      { path: "/Coupon", element: <ProtectedRoute><Coupon /></ProtectedRoute> },
      { path: "/Coupon/AddCopoun", element: <ProtectedRoute><AddCopoun /></ProtectedRoute> },
      { path: "/Bills/AddNewFees", element: <ProtectedRoute><AddNewFees /></ProtectedRoute> },
      { path: "/Calender", element: <ProtectedRoute><Calendar /></ProtectedRoute> },
      { path: "/DigitalArchive", element: <ProtectedRoute><DigitalArchive /></ProtectedRoute> },
      { path: "/AllWebSite", element: <ProtectedRoute><AllWebSite /></ProtectedRoute> },
      { path: "/Clients", element: <ProtectedRoute><Clients /></ProtectedRoute> },
      { path: "/TaskMangment", element: <ProtectedRoute><TaskMangment /></ProtectedRoute> },
      { path: "/TaskMangment/TaskDetails/:id", element: <ProtectedRoute><TaskDetails /></ProtectedRoute> },
      { path: "/PyrollMangment", element: <ProtectedRoute><PyrollMangment /></ProtectedRoute> },
      { path: "/Setting", element: <ProtectedRoute><Setting /></ProtectedRoute> },
      { path: "/BookOfLaw", element: <ProtectedRoute><BookOfLaw /></ProtectedRoute> },
      { path: "/MyProfile", element: <ProtectedRoute><MyProfile /></ProtectedRoute> },
      { path: "/AddMember", element: <ProtectedRoute><AddMember /></ProtectedRoute> },
      { path: "/AllSesions", element: <ProtectedRoute><AllSesions /></ProtectedRoute> },
      { path: "/Clients/ClientProfile/:id", element: <ProtectedRoute><ClientProfile /></ProtectedRoute> },
    ],
  },
  { path: "/Login", element: <Login /> },
  { path: "*", element: <Eror /> },
]);

function App() {
  return (
    <QueryClientProvider client={client}>
      <AuthContextProvider>
        <Toaster
          position="top-center"
          containerStyle={{ zIndex: 99999 }}
          toastOptions={{ style: { zIndex: 99999 } }}
        />
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;