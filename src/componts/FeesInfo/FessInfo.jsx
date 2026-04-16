import React, { useEffect, useState } from 'react'
import { HiOutlineBanknotes } from 'react-icons/hi2'

const FessInfo = ({fees}) => {


  return (
    <div className="rounded-2xl border border-[#1a2d47] bg-[#09172b] p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <HiOutlineBanknotes size={18} className="text-[#d3a53d]" />
          معلومات الأتعاب
        </h2>     
      </div>

      <div className="border-t border-[#13243b] pt-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#13243b] bg-[#0d1c33] px-5 py-4 text-center">
            <p className="mb-2 text-xs font-medium text-[#7f93ad]">قيمة الأتعاب</p>

           
        
              <h3 className="text-2xl font-bold text-white">{fees?.totalAmount}</h3>
      
          </div>

          <div className="rounded-2xl border border-[#13243b] bg-[#0d1c33] px-5 py-4 text-center">
            <p className="mb-2 text-xs font-medium text-[#7f93ad]">المبلغ المدفوع</p>

        
            
           
              <h3 className="text-2xl font-bold text-[#34d399]">{fees?.paidAmount}</h3>
       
          </div>

          <div className="rounded-2xl border border-[#13243b] bg-[#0d1c33] px-5 py-4 text-center">
            <p className="mb-2 text-xs font-medium text-[#7f93ad]">المبلغ المتبقي</p>

          
           
           
              <h3 className="text-2xl font-bold text-[#ff6b88]">{fees?.remainingAmount}</h3>
            
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[#13243b] pt-4 md:grid-cols-2">
          <div className="text-right">
            <p className="mb-2 text-xs font-medium text-[#7f93ad]">حالة الدفع</p>

      
             
      
              <h3 className="text-sm font-semibold text-white">{fees?.paymentStatus}</h3>
     
          </div>

          <div className="text-right">
            <p className="mb-2 text-xs font-medium text-[#7f93ad]">طريقة الدفع</p>

      
         
              <h3 className="text-sm font-semibold text-[#d3a53d]">{fees?.paymentMethod}</h3>
         
          </div>
        </div>
      </div>
    </div>
  );
};

export default FessInfo