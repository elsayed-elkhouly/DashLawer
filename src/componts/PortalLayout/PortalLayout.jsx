import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Gavel, LogIn } from 'lucide-react';
import NavBar from '../NavBar/NavBar';

const PortalLayout = () => {
  return (
    <div className=" text-white flex flex-col font-sans " >
   
      <NavBar />
      
      {/* Main Content */}
      <main className="grow bg-[#0e1a2b]">
        <Outlet />
      </main>
      
      {/* Footer */}
      {/* <footer className="bg-[#03070d] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Gavel size={24} className="text-[#c59d4a]" />
              <span className="text-lg font-bold">بوابة المنارة القانونية</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              نقدم خدمات قانونية متكاملة ومستويات عالية من المهنية لحماية حقوقكم وتحقيق التميز القانوني.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#c59d4a] mb-4">روابط سريعة</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#services" className="hover:text-white transition-colors">خدماتنا القانونية</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">عن مستشارينا</a></li>
              <li><Link to="/Login" className="hover:text-white transition-colors">بوابة نظام الإدارة</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#c59d4a] mb-4">تواصل معنا</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>المقر الرئيسي: القاهرة، جمهورية مصر العربية</li>
              <li>الهاتف: +20 100 123 4567</li>
              <li>البريد الإلكتروني: info@almanara-law.com</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} بوابة المنارة القانونية. جميع الحقوق محفوظة.</p>
        </div>
      </footer> */}
    </div>
  );
};

export default PortalLayout;
