import React, { useEffect, useState } from 'react'
import { HiOutlineBanknotes } from 'react-icons/hi2'

const FessInfo = ({fees,onSave, isSaving}) => {
const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    totalAmount: "",
    paidAmount: "",
    remainingAmount: "",
    paymentStatus: "",
    paymentMethod: "",
  });

  useEffect(() => {
    if (fees) {
      setFormData({
        totalAmount: fees.totalAmount || "",
        paidAmount: fees.paidAmount || "",
        remainingAmount: fees.remainingAmount || "",
        paymentStatus: fees.paymentStatus || "",
        paymentMethod: fees.paymentMethod || "",
      });
    }
  }, [fees]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      const total = Number(updated.totalAmount) || 0;
      const paid = Number(updated.paidAmount) || 0;

      updated.remainingAmount = total - paid;

      return updated;
    });
  };

  const handleSave = () => {
    onSave({
      ...formData,
      totalAmount: Number(formData.totalAmount) || 0,
      paidAmount: Number(formData.paidAmount) || 0,
      remainingAmount: Number(formData.remainingAmount) || 0,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      totalAmount: fees?.totalAmount || "",
      paidAmount: fees?.paidAmount || "",
      remainingAmount: fees?.remainingAmount || "",
      paymentStatus: fees?.paymentStatus || "",
      paymentMethod: fees?.paymentMethod || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="rounded-2xl border border-[#1a2d47] bg-[#09172b] p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <HiOutlineBanknotes size={18} className="text-[#d3a53d]" />
          معلومات الأتعاب
        </h2>

        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#d3a53d] px-4 text-sm font-semibold text-[#0b1830] transition hover:opacity-90"
          >
            تعديل الأتعاب
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#d3a53d] px-4 text-sm font-semibold text-[#0b1830] transition hover:opacity-90 disabled:opacity-60"
            >
              {isSaving ? "جارٍ الحفظ..." : "حفظ"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-600 bg-transparent px-4 text-sm font-medium text-white transition hover:bg-[#12233f]"
            >
              إلغاء
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-[#13243b] pt-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#13243b] bg-[#0d1c33] px-5 py-4 text-center">
            <p className="mb-2 text-xs font-medium text-[#7f93ad]">قيمة الأتعاب</p>

            {isEditing ? (
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#1d2a3b] p-2 text-center text-white outline-none"
              />
            ) : (
              <h3 className="text-2xl font-bold text-white">{fees?.totalAmount}</h3>
            )}
          </div>

          <div className="rounded-2xl border border-[#13243b] bg-[#0d1c33] px-5 py-4 text-center">
            <p className="mb-2 text-xs font-medium text-[#7f93ad]">المبلغ المدفوع</p>

            {isEditing ? (
              <input
                type="number"
                name="paidAmount"
                value={formData.paidAmount}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#1d2a3b] p-2 text-center text-white outline-none"
              />
            ) : (
              <h3 className="text-2xl font-bold text-[#34d399]">{fees?.paidAmount}</h3>
            )}
          </div>

          <div className="rounded-2xl border border-[#13243b] bg-[#0d1c33] px-5 py-4 text-center">
            <p className="mb-2 text-xs font-medium text-[#7f93ad]">المبلغ المتبقي</p>

            {isEditing ? (
              <input
                type="number"
                name="remainingAmount"
                value={formData.remainingAmount}
                readOnly
                className="w-full cursor-not-allowed rounded-lg bg-[#172334] p-2 text-center text-white outline-none"
              />
            ) : (
              <h3 className="text-2xl font-bold text-[#ff6b88]">{fees?.remainingAmount}</h3>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[#13243b] pt-4 md:grid-cols-2">
          <div className="text-right">
            <p className="mb-2 text-xs font-medium text-[#7f93ad]">حالة الدفع</p>

            {isEditing ? (
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#1d2a3b] p-2 text-sm text-white outline-none"
              >
                <option value="">اختر حالة الدفع</option>
                <option value="مدفوع">مدفوع</option>
                <option value="مدفوع جزئيا">مدفوع جزئيا</option>
                <option value="غير مدفوع">غير مدفوع</option>
              </select>
            ) : (
              <h3 className="text-sm font-semibold text-white">{fees?.paymentStatus}</h3>
            )}
          </div>

          <div className="text-right">
            <p className="mb-2 text-xs font-medium text-[#7f93ad]">طريقة الدفع</p>

            {isEditing ? (
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#1d2a3b] p-2 text-sm text-white outline-none"
              >
                <option value="">اختر طريقة الدفع</option>
                <option value="كاش">كاش</option>
                <option value="تحويل بنكي">تحويل بنكي</option>
                <option value="بطاقة">بطاقة</option>
                <option value="آجل">آجل</option>
              </select>
            ) : (
              <h3 className="text-sm font-semibold text-[#d3a53d]">{fees?.paymentMethod}</h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FessInfo