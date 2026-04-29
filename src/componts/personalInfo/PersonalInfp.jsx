import React, { useEffect, useState } from 'react'
import { MdOutlinePerson } from "react-icons/md";

const PersonalInfp = ({ client, onSave, isSaving }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    crNumber: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    if (client) {
      setFormData({
        fullName: client.fullName || "",
        crNumber: client.crNumber || "",
        phone: client.phone || "",
        email: client.email || "",
        address: client.address || "",
        notes: client.notes || "",
      });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  return (
    <div className="bg-[#061328] rounded-xl border border-slate-700 p-4 sm:p-6 overflow-hidden">
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MdOutlinePerson className="text-[#C9A24A] text-2xl" />
          المعلومات الشخصية
        </h2>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-yellow-400 cursor-pointer hover:text-amber-200 self-start sm:self-auto"
          >
            تعديل ✏
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-yellow-400 text-black px-4 py-1 rounded-lg self-start sm:self-auto"
          >
            {isSaving ? "جارٍ الحفظ..." : "حفظ"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

        <div className="text-right space-y-8 min-w-0">
          <div>
            <p className="text-[#64748B] text-sm">الاسم الكامل</p>

            {isEditing ? (
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-[#1d2a3b] p-2 rounded mt-2"
              />
            ) : (
              <p className="text-lg sm:text-xl font-semibold break-words">
                {client?.fullName}
              </p>
            )}
          </div>

          <div>
            <p className="text-[#64748B] text-sm">رقم الهاتف</p>

            {isEditing ? (
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#1d2a3b] p-2 rounded mt-2"
              />
            ) : (
              <p className="text-lg sm:text-xl font-semibold break-all">
                {client?.phone}
              </p>
            )}
          </div>

          <div>
            <p className="text-gray-500 text-sm">العنوان</p>

            {isEditing ? (
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-[#1d2a3b] p-2 rounded mt-2"
              />
            ) : (
              <p className="text-base sm:text-lg font-bold break-words">
                {client?.address}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-8 min-w-0">
          <div>
            <p className="text-[#64748B] text-sm">رقم الهوية</p>

            {isEditing ? (
              <input
                name="crNumber"
                value={formData.crNumber}
                onChange={handleChange}
                className="w-full bg-[#1d2a3b] p-2 rounded mt-2"
              />
            ) : (
              <p className="text-lg sm:text-xl font-semibold break-all">
                {client?.crNumber}
              </p>
            )}
          </div>

          <div>
            <p className="text-[#64748B] text-sm">البريد الإلكتروني</p>

            {isEditing ? (
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#1d2a3b] p-2 rounded mt-2"
              />
            ) : (
              <p className="text-lg sm:text-xl font-semibold break-all">
                {client?.email}
              </p>
            )}
          </div>
        </div>

      </div>

      <div className="mt-6">
        <p className="text-[#64748B] text-sm mb-2">
          الملاحظات
        </p>

        {isEditing ? (
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full bg-[#1d2a3b] p-2 rounded"
          />
        ) : (
          <div className="bg-[#061328] p-4 mt-6 rounded-lg text-sm text-gray-300 break-words">
            {client?.notes}
          </div>
        )}
      </div>

    </div>
  );
};

export default PersonalInfp