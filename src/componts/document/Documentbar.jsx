import React from 'react'
import { MdOutlinePictureAsPdf } from 'react-icons/md'

const Documentbar = ({ AddDocument,setFile }) => {
  return (
    <div className="bg-[#162132] p-4 rounded-xl border border-slate-700">

      <div className="flex justify-between mb-4">
        <h2 className="text-yellow-400 font-semibold">
          أرشيف المستندات
        </h2>
        <span className="text-sm">(12)</span>
      </div>

      <div className="space-y-3">

        <div className="bg-[#1d2a3b] p-3 rounded-lg flex justify-between">
          <div>
            <p className='flex items-center gap-2'> <MdOutlinePictureAsPdf className='text-red-500 text-lg' /> عقد الاتفاق.pdf </p>
            <span className="text-xs text-gray-400">
              2.4 MB - أمس
            </span>
          </div>
          <button className="text-red-400">🗑</button>
        </div>

        <div className="bg-[#1d2a3b] p-3 rounded-lg flex justify-between">
          <div>
            <p>صورة المحضر.jpg</p>
            <span className="text-xs text-gray-400">
              1 MB - منذ يوم
            </span>
          </div>
          <button className="text-yellow-400">📄</button>
        </div>

      </div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button

        onClick={AddDocument}
        className="border border-dashed border-yellow-400 mt-4 w-full py-2 rounded-lg text-yellow-400 hover:bg-amber-200 cursor-pointer"
      >
        + رفع ملف جديد
      </button>

    </div>
  )
}

export default Documentbar