import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./componts/Layout/Layout";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./componts/ProtectedRoute/ProtectedRoute";
import AuthContextProvider from "./Context/AuthContextProvider";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

const Login = lazy(() => import("./componts/Login/Login"));
const Dashbord = lazy(() => import("./componts/Dashbrd/Dashbord"));
const CaseMange = lazy(() => import("./componts/CaseMahgment/CaseMange"));
const Team = lazy(() => import("./componts/TeamMember/Team"));
const Bills = lazy(() => import("./componts/Bills/Bills"));
const Calendar = lazy(() => import("./componts/Calendar/Calendar"));
const DigitalArchive = lazy(() => import("./componts/Digital Archive/DigitalArchive"));
const Setting = lazy(() => import("./componts/Setting/Setting"));
const AddMember = lazy(() => import("./componts/AddMember/AddMember"));
const Clients = lazy(() => import("./componts/Clients/Clients"));
const ClientProfile = lazy(() => import("./componts/ClientProfile/ClientProfile"));
const AddNewCase = lazy(() => import("./componts/AddCase/AddNewCase"));
const CaseDetails = lazy(() => import("./componts/CaseDetails/CaseDetails"));
const Eror = lazy(() => import("./componts/Eror/Eror"));
const AddNewFees = lazy(() => import("./componts/AddNewFees/AddNewFees"));
const TaskMangment = lazy(() => import("./componts/TaskMangment/TaskMangment"));
const TaskDetails = lazy(() => import("./componts/TaskMangment/TaskDetails"));
const BookMangment = lazy(() => import("./componts/BookMangment/BookMangment"));
const AddSession = lazy(() => import("./componts/AddSession/AddSession"));
const TeamProfile = lazy(() => import("./componts/TeamProfile/TeamProfile"));
const MyProfile = lazy(() => import("./componts/MyProfile/MyProfile"));
const SessionDetails = lazy(() => import("./componts/SessionDetails/SessionDetails"));
const PyrollMangment = lazy(() => import("./componts/PyrollMangment/PyrollMangment"));
const BookOfLaw = lazy(() => import("./componts/BookofLaw/BookOfLaw"));
const AllSesions = lazy(() => import("./componts/AllSesions/AllSesions"));
const AddNewCaseinvoice = lazy(() => import("./componts/AddNewCaseinvoice/AddNewCaseinvoice"));
const Dashbord2 = lazy(() => import("./componts/Dashbord2/Dashbord2"));
const PackegesMangment = lazy(() => import("./componts/PackegesMangment/PackegesMangment"));
const ClientMangment = lazy(() => import("./componts/ClientMangment/ClientMangment"));
const Coupon = lazy(() => import("./componts/Coupon/Coupon"));
const OfficeProfile = lazy(() => import("./componts/OfficeProfile/OfficeProfile"));
const AddCopoun = lazy(() => import("./componts/AddCopoun/AddCopoun"));
const AllWebSite = lazy(() => import("./componts/AllWebSite/AllWebSite"));

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
        <Suspense fallback={
          <div className="flex h-screen items-center justify-center bg-[#061224] text-white">
            <span className="loading loading-infinity loading-xl text-[#c59d4a]"></span>
          </div>
        }>
          <RouterProvider router={router} />
        </Suspense>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;