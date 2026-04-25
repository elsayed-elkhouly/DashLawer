import React from 'react'
import { FiDownload } from 'react-icons/fi'

const InvoicesTable = ({ invoices, clientId, printAll, printSingle }) => {
  return (
    <div className="bg-[#061328] rounded-xl border border-slate-700">
      <div className="flex justify-between p-4">
        <h2>آخر الدفعات والفواتير</h2>

        <button
          type="button"
          onClick={() => printAll(clientId)}
          className="text-[#C9A24A] text-sm link cursor-pointer"
        >
          طباعة كل الفواتير
        </button>
      </div>

      <table className="w-full text-sm">
        <thead className="text-gray-400 border-t border-slate-700">
          <tr className="text-center bg-[#09172b]">
            <th className="p-3">رقم الفاتورة</th>
            <th>المبلغ</th>
            <th>المدفوع</th>
            <th>المتبقي</th>
            <th>الحالة</th>
            <th></th>
          </tr>
        </thead>

        <tbody className="text-center">
          {invoices?.map((item) => (
            <tr key={item._id} className="border-t border-slate-700">
              <td className="text-[#C9A24A] p-5">{item.invoiceNumber}</td>
              <td>{item.total}</td>
              <td className="text-green-400">{item.paidAmount}</td>
              <td>{item.remaining}</td>
              <td className="text-green-400">{item.status}</td>
              <td>
                <FiDownload
                  onClick={() => printSingle(item._id)}
                  className="text-xl cursor-pointer"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesTable