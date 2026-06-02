import React, { useContext, useState } from 'react'
import { BiLock, BiLogIn } from 'react-icons/bi';
import { BsEye, BsMailbox } from 'react-icons/bs';
import { FiEyeOff } from 'react-icons/fi';
import { MdGavel, MdMailOutline } from "react-icons/md";
import scaleImage from "../../assets/images/scale.png"
import { useForm } from 'react-hook-form'
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { CiLogin } from "react-icons/ci";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Authcontext } from '../../Context/AuthContextProvider';
import Cookies from "js-cookie";
import logo from "../../assets/images/LEX LOGO.png"
import api, { setCsrfToken } from '../../api/axios';
import LexoraHero from '../LexoraHero/LexoraHero';

const Login = () => {

  const { insertToken } = useContext(Authcontext)
  const [showPassword, setShowPassword] = useState(false);
  const [isLoding, setisLoding] = useState(false)
  const navigate = useNavigate()
  const schame = z.object({

    email: z.email("email not found"),
    password: z.string("password is incorrect")

  })
  const { handleSubmit, register, formState: { errors } } = useForm({
    defaultValues: {
      email: "admin@test.com",
      password: "Abc123@@"
    },
    resolver: zodResolver(schame)

  })
async function Signin(values) {
  setisLoding(true);

  try {
    const { data } = await api.post("/auth/authSignin", values);

    // 1. حط الـ token الأول
    Cookies.set("token", data.access_token, { expires: 1 });
    insertToken(data.access_token);

    // 2. جيب CSRF بعد الـ login ✅
    const csrf = await api.get("/csrf-token");
    setCsrfToken(csrf.data.csrfToken);  
    toast.success(data.message);
    // navigate("/");
    window.location.href = "/dashboard";
  } catch (error) {
    toast.error(error.response?.data?.message);
  } finally {
    setisLoding(false);
  }
}
  return (
    <> 
    <div className='fixed top-4 left-4 z-50'>
      <button onClick={() => navigate("/")} className='text-white cursor-pointer bg-[#C9A14A] px-4 py-2 rounded-lg shadow-lg hover:bg-[#C9A14A]/90 transition-all duration-200 '>
        Back to Home
      </button>
    </div>
      <div className="bg1 min-h-screen flex items-stretch relative">

        {/* الجزء الأيمن - فورم تسجيل الدخول */}
        <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center bg-[#0f1a2b] p-8">
          <div className="bg-[#0F1B2EF2] border border-[#C9A14A] p-8 rounded-2xl shadow-2xl backdrop-blur-md w-full max-w-md">

            <div className="w-32 sm:w-40 md:w-40 mx-auto flex justify-center">
              <img src={logo} className="w-full object-contain" alt="" />
            </div>

            <h2 className="text-white text-2xl font-bold text-center mb-2">تسجيل الدخول</h2>
            <p className="text-slate-400 text-lg text-center mb-8 flex items-center justify-center gap-2">
              <span className="text-[#c9a14a] font-bold text-xl">Lexora</span>
              مرحبا بك مجددا في
            </p>

            <form onSubmit={handleSubmit(Signin)} className="space-y-6" dir="rtl">
              {/* Email Field */}
              <div>
                <label className="block text-slate-300 mb-2 text-sm font-bold">البريد الإلكتروني</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="example@email.com"
                    className="w-full bg-slate-950 border border-[#C9A24A33] rounded-lg py-3 px-10 text-white focus:ring-2 focus:ring-[#C9A14A] outline-none transition-all"
                    {...register("email")}
                  />
                  <MdMailOutline className="absolute left-3 top-3.5 text-[#C9A14A] w-5 h-5" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-slate-300 mb-2 text-sm font-bold">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-slate-950 border border-[#C9A24A33] rounded-lg py-3 px-10 text-white focus:ring-2 focus:ring-[#C9A14A] outline-none transition-all"
                    {...register("password")}
                  />
                  <BiLock className="absolute left-3 top-3.5 text-[#C9A14A] w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-500"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <BsEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button className="w-full bg-[#C9A14A] hover:bg-amber-600 text-slate-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                {isLoding ? <span className="loading loading-infinity loading-xl"></span> : <div className='items-center flex justify-center gap-2'><CiLogin className='text-2xl' /> تسجيل الدخول</div>}
              </button>
            </form>
          </div>
        </div>                        

        {/* الجزء الأيسر - LexoraHero */}
        <div className="w-1/2 min-h-screen hidden md:flex items-center justify-center">
          <LexoraHero />
        </div>

      </div>
    </>
  )
}

export default Login