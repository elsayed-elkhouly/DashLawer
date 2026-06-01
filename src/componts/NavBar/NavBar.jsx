import React, { useEffect } from 'react'
import { useState } from "react";

import { FaBalanceScale } from 'react-icons/fa'
import { Link, NavLink } from "react-router-dom";
import api from '../../api/axios';
import { LogIn } from 'lucide-react';

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    const [settings, setSettings] = useState(null);
    async function getData() {
        try {
            const res = await api.get(
                "/SettingsService/"
            );
            console.log("API:", res.data.Settings);
            setSettings(res?.data?.Settings)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getData()


    }, [])
    return (
        <>
            <section className="relative">
                <div className="navbar bg-[#14243a] shadow-sm flex items-center justify-around lg:gap-52 fixed z-50 w-full">
                    <div className="flex gap-2 items-center">
                        {/* زر الهامبرجر */}
                        <button
                            className="btn btn-ghost bg-[#C9A24D] lg:hidden"
                            onClick={toggleMenu}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h8m-8 6h16"}
                                />
                            </svg>
                        </button>

                        <Link to="/Login">
                            <button className="flex items-center gap-2 bg-[#c59d4a] hover:bg-[#af893d] text-[#050b14] px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg shadow-[#c59d4a]/10 hover:shadow-[#c59d4a]/20">
                                <LogIn size={16} />
                                <span>بوابة النظام</span>
                            </button>
                        </Link>
                    </div>

                    {/* اللينكات لشاشة كبيرة */}
                    <div className="hidden lg:flex items-center gap-5 text-white">
                        <NavLink to="/BookingDate" className={({ isActive }) => isActive ? "text-[#C9A24D] font-bold" : "hover:text-[#C9A24D]"}>
                            <p className="px-3 py-2">حجز موعد</p>
                        </NavLink>
                        <NavLink to="/service" className={({ isActive }) => isActive ? "text-[#C9A24D] font-bold" : "hover:text-[#C9A24D]"}>
                            <p className="px-3 py-2">الخدمات</p>
                        </NavLink>
                        <NavLink to="/" className={({ isActive }) => isActive ? "text-[#C9A24D] font-bold" : "hover:text-[#C9A24D]"}>
                            <p className="px-3 py-2">الرئيسية</p>
                        </NavLink>
                    </div>

                    {/* شعار الشركة */}
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <h6 className="text-[18.3px] font-bold text-white"> {settings?.officeName} </h6>
                            <h6 className="text-[10px] text-[#A0A0A0] font-normal ms-8">   {settings?.officeName}  للخدمات القانونيه   </h6>
                        </div>
                        <FaBalanceScale className="text-3xl text-[#C9A24D]" />
                    </div>
                </div>

                {/* قائمة الموبايل */}
                {menuOpen && (
                    <div className="flex flex-col gap-2 mt-20 bg-[#14243a] p-4 lg:hidden fixed w-52 z-50 shadow rounded-3xl">
                        <NavLink to="/" onClick={closeMenu}>
                            <p className="p-3 text-[#C9A24D] hover:bg-[#28364a] rounded-2xl text-center">الرئيسية</p>
                        </NavLink>
                        <NavLink to="/service" onClick={closeMenu}>
                            <p className="p-3 text-[#C9A24D] hover:bg-[#28364a] rounded-2xl text-center">الخدمات</p>
                        </NavLink>
                        <NavLink to="/BookingDate" onClick={closeMenu}>
                            <p className="p-3 text-[#C9A24D] hover:bg-[#28364a] rounded-2xl text-center">حجز موعد</p>
                        </NavLink>
                    </div>
                )}
            </section>
        </>
    )
}

export default NavBar