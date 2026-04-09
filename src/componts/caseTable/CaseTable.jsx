import { Eye } from 'lucide-react'
import React from 'react'

const CaseTable = ({ cases }) => {
    return (
        <div className="bg-[#061328] rounded-xl border border-slate-700">

            <div className="flex justify-between p-4">
                <h2>القضايا المرتبطة</h2>
                <button className="text-[#C9A24A] text-sm cursor-pointer link">
                    عرض الكل
                </button>
            </div>

            <table className="w-full text-sm">

                <thead className="text-gray-400 border-t border-slate-700">
                    <tr className="text-center bg-[#09172b]">
                        <th className="p-3">رقم القضية</th>
                        <th>نوع القضية</th>
                        <th>الحالة</th>
                        <th>الجلسة القادمة</th>
                        <th>المحامي المسؤول</th>
                    </tr>
                </thead>

                <tbody className="text-center">

                    {cases?.map((item) => (
                        <tr key={item._id} className="border-t border-slate-700">
                            <td className="p-5 text-[#C9A24A]">
                                #{item.caseNumber}
                            </td>

                            <td>
                                {item.caseType?.name}
                            </td>

                            <td className="text-[#C9A24A]">
                                {item.status}
                            </td>

                            <td>
                                {new Date(item.openedAt).toLocaleDateString("ar-EG")}
                            </td>

                            <td>
                                {item.assignedTo?.UserName}
                            </td>

                          
                        </tr>
                    ))}



                </tbody>

            </table>

        </div>)
}

export default CaseTable