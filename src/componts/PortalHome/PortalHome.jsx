import React, { useState } from 'react';
import photo1 from "../../assets/images/mainPhoto.png"
import court from "../../assets/images/6c2789f4869af593f01bba4755810d65f972e8ca.jpg"
import { MdOutlineChat, MdOutlineElectricBolt, MdOutlineLock } from 'react-icons/md'
import { PiSealCheck } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { motion } from "framer-motion";
import { LiaMedalSolid } from 'react-icons/lia'
import ReviewsSection from '../ReviewsSection/ReviewsSection';
import api from '../../api/axios';
import { useQuery } from '@tanstack/react-query';
const PortalHome = () => {

  function getData() {
    return  api.get("/SettingsService/");
  }
  
  const {data} = useQuery({
    queryKey : ["services"],
    queryFn : getData
  })
    
   
  const fadeLeft = {
    hidden: { opacity: 0, x: -80 },
    visible: { opacity: 1, x: 0 }
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0 }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  return (  
    <>
      {/* ================= ABOUT SECTION ================= */}
      <section className="bg-[#071a33] pt-30">
        <div className="lg:flex lg:items-center lg:justify-around">

          {/* Image */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-90 lg:w-[40%] mx-auto lg:ms-0 -pt-5"
          >
            <img src={data?.data?.Settings?.logo} className="w-full lg:w-full" alt="" />
          </motion.div>

          {/* Text */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className=" flex flex-col text-right  lg:w-[60%] leading-tight lg:mb-50 me-5 lg:me-25 mt-10 "
          >
            <motion.h3 variants={fadeRight} transition={{ duration: 0.6 }}
              className="text-[32px] lg:text-[85.82px] font-bold text-white">
              خبرة قانونية استثنائية
            </motion.h3>

            <motion.h3 variants={fadeRight} transition={{ duration: 0.6 }}
              className="text-[32px] lg:text-[85.82px] font-bold text-[#C9A24D]">
              لحماية حقوقك
            </motion.h3>

            <motion.h3 variants={fadeRight} transition={{ duration: 0.6 }}
              className="text-[32px] lg:text-[85.82px] font-bold text-[#C9A24D]">
              ومستقبلك
            </motion.h3>

            <motion.p variants={fadeRight}
              className="text-[#A0A0A0] my-3">
              نقدم حلولاً قانونية ذكية مدعومة بعقدين من التميز في القضايا المعقدة.
            </motion.p>

            <motion.div variants={fadeRight}>
              <Link to={"/BookingDate"}>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="cursor-pointer ms-auto mt-5 text-[#0E1A2B] p-5 font-bold bg-[#C9A24D] rounded-[2.5px]"
                >
                  احجز استشارة الآن
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row gap-5 py-10 lg:justify-around"
        >
          {[
            { number: "89%", text: "نتائج قانونية مبهرة", icon: <LiaMedalSolid /> },
            { number: "24h", text: "سرعة في التنفيذ والاستجابة", icon: <MdOutlineElectricBolt /> },
            { number: "20+", text: "عاماً من السلطة القانونية", icon: <MdOutlineChat /> }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <i className='text-[#C9A24D] text-3xl'>{item.icon}</i>
              <p className="text-[#C9A24D] text-[56px] font-bold">
                {item.number}
              </p>
              <p className="text-white text-[18px]">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= SPECIALTIES ================= */}
      <section className="bg-[#071a33] py-20 px-5">
        <div className="text-center mb-14">
          <h2 className="text-white text-4xl font-bold mb-3">
            تخصصاتنا القانونية
          </h2>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {[
            "الأحوال الشخصية",
            "قانون الشركات",
            "القانون الجنائي"
          ].map((title, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="bg-[#132C4A] p-10 rounded-lg text-right"
            >
              <h3 className="text-white text-xl font-bold mb-3">
                {title}
              </h3>
              <p className="text-gray-400">
                نقدم أفضل الحلول القانونية باحترافية عالية.
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
      <section className="bg-[#071a33] text-white py-10 px-6 md:px-12 font-sans" dir="rtl">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Image & Stats */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
              <img
                src={court}
                alt="Gavel"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Success Rate Badge */}
            <div className="absolute -bottom-6 -left-6 bg-[#c5a059] p-6 rounded-sm text-center min-w-30">
              <h3 className="text-3xl font-bold text-[#0a1120]">98%</h3>
              <p className="text-sm text-[#0a1120] font-semibold">نسبة النجاح</p>
            </div>
          </div>
          {/* Right Side: Content */}
          <div className="space-y-8">
            <h2 className="text-4xl font-bold mb-10">لماذا يختار النخبة مكتبنا؟</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature 1 */}
              <div className="flex flex-col items-start space-y-3">
                <div className="flex items-center gap-3">
                  <PiSealCheck className="text-[#c5a059]" size={28} />
                  <h4 className="text-xl font-bold">خبرة معمقة</h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  نخبة من خريجي أرقى الجامعات العالمية.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-start space-y-3">
                <div className="flex items-center gap-3">
                  <MdOutlineLock className="text-[#c5a059]" size={28} />
                  <h4 className="text-xl font-bold">سرية مطلقة</h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  حماية مشفرة لكافة بيانات الموكلين.
                </p>
              </div>
            </div>

            <div className="pt-6 border-r-2 border-[#c5a059] pr-4">
              <p className="text-gray-300 italic">
                "نحن نؤمن بأن كل قضية تستحق الاهتمام الكامل"
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Section Footer Title */}
      <ReviewsSection />
      {/* ================= CTA ================= */}
      <section className="bg-[#071a33] px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-[#14243a] max-w-6xl mx-auto border-2 border-[#c5a059] p-12 text-center"
        >
          <h2 className="text-white text-4xl font-bold mb-8">
            هل أنت جاهز للخطوة التالية؟
          </h2>

          <Link to={"/BookingDate"}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer bg-[#c5a059] text-[#0a1120] font-bold py-4 px-10"
            >
              احجز استشارتك الآن
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </>
  );
};

export default PortalHome;
