import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Gavel, LogIn } from 'lucide-react';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';

const PortalLayout = () => {
  return (
    <div className=" text-white flex flex-col font-sans " >
   
      <NavBar />
      
      {/* Main Content */}
      <main className="grow bg-[#0e1a2b]">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default PortalLayout;
