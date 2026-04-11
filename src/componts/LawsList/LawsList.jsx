import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function LawsList({ data , del }) {
    const laws = data || [];
    const [selectedLaw, setSelectedLaw] = useState(null); // 👈 هنا الحل

    return (
        <>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mr-2">
                {laws.map((law) => (
                    <div
                        key={law._id}
                        onClick={() => setSelectedLaw(law.fileUrl)}
                        className="relative cursor-pointer rounded-2xl bg-[#102445] p-5 text-white shadow-lg transition hover:scale-105 hover:bg-[#16325c]"
                    >

                        {/* 🗑️ أيقونة الحذف */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();     
                                del(law._id)  
                            }}
                              className="cursor-pointer text-lg text-red-400 hover:text-red-600"
                        >
                              <RiDeleteBin6Line />
                        </button>

                        <h2 className="text-xl font-bold">{law.title}</h2>
                        <p className="mt-2 text-sm text-gray-300">{law.category}</p>

                        <button className="mt-4 w-full rounded-xl bg-[#c9a24a] py-2 text-white font-semibold">
                            فتح الكتاب
                        </button>
                    </div>
                ))}
            </div>
            {selectedLaw && (
                <iframe
                    src={`https://docs.google.com/gview?url=${selectedLaw}&embedded=true`}
                    className="w-full min-h-screen my-5"
                />
            )}
        </>

    );
}