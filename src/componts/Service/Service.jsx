import React, { useState } from 'react'
import lawerphoto from "../../assets/images/df9c79f70121aee15fd66c884f20ff8e825dc552.jpg"
import { BiBriefcase, BiCheckCircle, BiHome } from 'react-icons/bi';
import { BsArrowLeft } from 'react-icons/bs';
import { FaBalanceScale, FaGavel, FaLandmark, FaUsers } from 'react-icons/fa';
import { LuBadgeCheck, LuBuilding2, LuLightbulb, LuMessageSquare, LuSearch } from 'react-icons/lu';
import { MdGavel, MdOutlineChat } from 'react-icons/md';
import { PiBuildingOfficeBold } from 'react-icons/pi';
import { CiCircleCheck } from 'react-icons/ci';
import { HiLightBulb, HiOutlineChartBarSquare, HiOutlineLightBulb } from 'react-icons/hi2';
import { Link, NavLink } from 'react-router-dom';
import { motion } from "framer-motion";

const Service = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      title: "القانون الجنائي",
      desc: "تمثيل قانوني متخصص في القضايا الجنائية المعقدة، مع ضمان أعلى مستويات الدفاع.",
      icon: <MdGavel size={32} />
    },
    {
      title: "الأحوال الشخصية",
      desc: "إدارة قضايا الأسرة والتركات والطلاق بخصوصية تامة واحترافية عالية.",
      icon: <FaUsers size={32} />
    },
    {
      title: "الشركات والشركاء",
      desc: "تأسيس الشركات، صياغة الاتفاقيات التجارية، وإدارة النزاعات بين الشركاء.",
      icon: <PiBuildingOfficeBold size={32} />
    },
    {
      title: "القانون المدني",
      desc: "التعامل مع التعويضات، العقود المدنية، والمطالبات المالية بين الأفراد والكيانات.",
      icon: <FaLandmark size={32} />
    },
    {
      title: "القضايا العمالية",
      desc: "حماية حقوق الموظفين وأصحاب العمل، وفض النزاعات العمالية بما يتوافق مع الأنظمة.",
      icon: <BiBriefcase size={32} />
    },
    {
      title: "القانون العقاري",
      desc: "إتمام الصفقات العقارية، فض النزاعات على الملكية، وتوثيق العقود لضمان الاستثمار.",
      icon: <BiHome size={32} />
    }
  ];

  const steps = [
    { title: "استشارة", desc: "فهم أولي لتفاصيل القضية وتحديد المتطلبات الأساسية.", icon: <MdOutlineChat /> },
    { title: "دراسة الحالة", desc: "تحليل معمق للمستندات والبحث في السوابق القانونية.", icon: <HiOutlineChartBarSquare /> },
    { title: "استراتيجية قانونية", desc: "رسم خارطة طريق قانونية واضحة لتحقيق أفضل النتائج.", icon: <HiOutlineLightBulb /> },
    { title: "متابعة حتى النتيجة", desc: "تنفيذ الإجراءات والتمثيل أمام الجهات المختصة بفعالية.", icon: <LuBadgeCheck /> }
  ];
  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
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

      {/* ================= Services ================= */}
      <section className="bg-[#071a33] py-40 px-6 text-right" dir="rtl">
        <div className="w-full px-4 sm:px-6 md:max-w-6xl md:mx-auto">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <h2 className="text-white text-4xl font-bold mb-4">
              خدماتنا القانونية
            </h2>
            <p className="text-gray-400">
              اختر التخصص المناسب وسنقوم بمساعدتك فورًا
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="group bg-[#061328] border border-gray-800 p-8 rounded-sm hover:border-[#c5a059]"
              >
                <div className="bg-[#1a2436] w-16 h-16 rounded-full flex items-center justify-center text-[#c5a059] mb-6 group-hover:bg-[#c5a059] group-hover:text-[#0a1120] transition-colors">
                  {item.icon}
                </div>

                <h3 className="text-white text-2xl font-bold mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  {item.desc}
                </p>

                <motion.button
                  whileHover={{ x: -5 }}
                  className="flex items-center gap-2 text-[#c5a059] font-semibold text-sm hover:underline cursor-pointer"
                  onClick={() => setSelectedService(item)}
                >
                  عرض التفاصيل
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ===== Modal (واحد بس برا الـ map) ===== */}
        {selectedService && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setSelectedService(null)}   // 👈 يقفل لو ضغطت برا
          >
            <div
              className="bg-[#0d1626] p-8 rounded-lg w-[90%] md:w-125 relative border border-gray-800 shadow-2xl sm:rounded-[2.5rem]"
              onClick={(e) => e.stopPropagation()}     // 👈 يمنع القفل لو ضغطت جوه
            >

              {/* Header */}
              <div className="mb-6 sm:mb-8 mt-2 sm:mt-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                  قانون الشركات والعقود
                </h2>
                <div className="h-1 w-16 sm:w-20 bg-[#c5a059] rounded-full"></div>
              </div>

              {/* Description */}
              <p className="text-gray-300 leading-relaxed mb-8 sm:mb-10 text-sm sm:text-base">
                نقدم خدمات شاملة في صياغة ومراجعة العقود التجارية،
                وتأسيس الشركات بكافة أنواعها،
                مع ضمان الامتثال الكامل للقوانين واللوائح
                المحلية والدولية لحماية مصالح أعمالكم.
              </p>

              {/* CTA Button */}
              <NavLink to="/BookingDate">
                <button className="w-full py-3 sm:py-4 bg-[#c5a059] hover:bg-[#b38f4d] text-[#111827] font-bold rounded-xl sm:rounded-2xl transition-all transform active:scale-95 shadow-lg shadow-[#c5a059]/20">
                  احجز استشارة لهذه الخدمة
                </button>
              </NavLink>



            </div>
          </div>
        )}
      </section>

      {/* ================= Corporate Law ================= */}
      <section className="bg-[#071a33]   py-20 px-6 overflow-x-hidden" dir="rtl">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">

          {/* النص يأتي من الأعلى */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-1/2 text-right"
          >
            <h2 className="text-white text-4xl font-bold mb-6">قانون الشركات والعقود</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              نقدم حلولاً قانونية شاملة لدعم نمو أعمالكم وحمايتها من المخاطر القانونية المحتملة.
            </p>
            <ul className="space-y-4 mb-10">
              {["صياغة ومراجعة العقود التجارية الدولية والمحلية.", "تمثيل الشركات في المفاوضات وعمليات الاستحواذ.", "الاستشارات الضريبية والتنظيمية للشركات الكبرى."].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to={"/BookingDate"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#c5a059] text-[#0a1120] px-8 py-3 font-bold cursor-pointer"
              >
                احجز استشارة لهذه الخدمة
              </motion.button>
            </Link>
          </motion.div>

          {/* الصورة تأتي من اليسار */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-1/2"
          >
            <img
              src={lawerphoto}
              alt="قانون الشركات"
              className="rounded-sm shadow-2xl border border-gray-800"
            />
          </motion.div>
        </div>
      </section>

      {/* ================= Methodology ================= */}
      <section className="bg-[#071a33] py-20 px-6 text-center" dir="rtl">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-white text-3xl font-bold mb-16"
        >
          منهجية العمل
        </motion.h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              className="bg-[#061328] p-8 border border-gray-800 flex flex-col items-center"
            >
              <div className="text-2xl bg-[#c5a059] text-[#0a1120] w-12 h-12 flex items-center justify-center rounded-full mb-6">
                {step.icon}
              </div>
              <h3 className="text-white text-xl font-bold mb-4">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="bg-[#071a33] py-20 px-6 text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-white text-3xl font-bold mb-10"
        >
          الأسئلة الشائعة
        </motion.h2>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-3/4 mx-auto"
        >
        </motion.div>
      </section>

      <section className="bg-[#071a33] px-6 py-12" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-[#14243a] max-w-6xl mx-auto border-2 border-[#c5a059] p-12 text-center"
        >
          <h2 className="text-white text-4xl font-bold mb-8">
            هل تحتاج إلى محامي الآن؟
          </h2>

          <Link to={"/BookingDate"}><motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#c5a059] text-[#0a1120] font-bold py-4 px-10"
          >
            احجز استشارتك الآن
          </motion.button></Link>
        </motion.div>
      </section>
    </>

  )
}

export default Service