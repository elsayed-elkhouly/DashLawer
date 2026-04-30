import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import toast from 'react-hot-toast';

const Coupon = () => {
  const queryClient = useQueryClient();


  function getAllCopuns() {
    return api.get("/super-admin/getCoupons")
  }

  const { data } = useQuery({
    queryKey: ["Copuns"],
    queryFn: getAllCopuns
  })
  console.log(data?.data?.coupons);
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  async function deleteClient(id) {
    try {
      const res = await api.delete(
        `super-admin/deleteCoupon/${id}`

      );

      console.log("Delete response:", res.data);
      return res.data;
    } catch (error) {
      console.log("Delete error:", error);
      console.log("Delete error response:", error.response);
      throw error;
    }
  }

  const deleteMutation = useMutation({
    mutationFn: deleteClient,

    onSuccess: () => {
      toast.success("Client deleted successfully");

      queryClient.invalidateQueries({ queryKey: ["Copuns"] });
     
    },

    onError: (error) => {
      console.log("Delete mutation error:", error);
      toast.error("Something went wrong while deleting");
    },
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };
  return (
    <>
      <div className="w-full  px-6 py-4 rounded-xl flex items-center justify-between">
        {/* اليمين: العنوان والوصف */}
        <div className="text-right">
          <h1 className="text-white text-lg font-semibold">
            إدارة الكوبونات
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            عرض ومتابعة جميع أكواد الخصم داخل النظام
          </p>
        </div>

        {/* الشمال: زر إضافة كوبون جديد */}
        <Link to={"/Coupon/AddCopoun"}>
          <button className="flex cursor-pointer items-center gap-2 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-medium px-4 py-2 rounded-lg transition">
            <span className="flex items-center justify-center  text-lg leading-none">
              +
            </span>
            <span>إضافة كوبون جديد</span>
          </button>
        </Link>
      </div>
      <div className="px-4 py-10 text-white md:px-10" >
        <div className="overflow-hidden rounded-[20px] px-10 border border-white/5 bg-[linear-gradient(90deg,#132740_0%,#11253f_100%)] shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
          <div className="flex items-center justify-between  border-white/6 py-8">
            <h2 className="text-[20px] font-extrabold text-white/95 md:text-[22px] ">
              أحدث الاشتراكات
            </h2>

          </div>

          <div className="overflow-hidden rounded-3xl mb-5 bg-[#102743]  shadow-[0_10px_40px_rgba(0,0,0,0.18)] ring-1 ring-white/5">
            {/* Header */}
            <div className="hidden  lg:grid lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-[#0d2037] px-8 py-5 text-sm font-semibold text-white/85">
              <div className="text-right"> كود الكوبون</div>
              {/* <div className="text-right"> الوصف</div> */}
              <div className="text-right">نسبة الخصم</div>
              <div className="text-right">تاريخ البداية</div>
              <div className="text-right">تاريخ الانتهاء</div>
              <div className="text-right">الحالة</div>
              <div className="text-right">الاستخدام</div>
              <div className="text-right">الإجراءات</div>
            </div>

            {/* Body */}
            <div>
              {data?.data?.coupons.map((item, index) => (
                <div
                  key={item.id || `${item.name}-${index}`}
                  className=" border-t border-white/5 px-5 py-5
                    lg:grid lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] lg:items-center lg:px-8"
                >
                  {/* Mobile / Tablet */}
                  <div className="space-y-4 lg:hidden">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="mb-1 text-xs text-white/50">اسم العميل</p>
                        <span className="text-sm font-medium text-white/92">
                          {item.name}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${item.statusType}`}
                      >
                        <span className="h-2 w-2 rounded-full bg-current opacity-90" />
                        {item.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="min-w-0">
                        <p className="mb-1 text-xs text-white/50">البريد الإلكتروني</p>
                        <span className="block truncate text-sm font-medium text-white/92">
                          {item.email}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="mb-1 text-xs text-white/50">SUBDOMAIN</p>
                        <span className="block truncate text-sm font-medium text-white/92">
                          {item.subdomain}
                        </span>
                      </div>

                      <div>
                        <p className="mb-1 text-xs text-white/50">الباقة</p>
                        <span
                          className={`inline-flex rounded-full px-4 py-1.5 text-xs font-bold ${item.plan}`}
                        >
                          {item.plan}
                        </span>
                      </div>

                      <div>
                        <p className="mb-1 text-xs text-white/50">السعر</p>
                        <span className="text-[15px] font-bold text-[#cedaeb]">
                          {item.price}
                        </span>
                      </div>

                      <div>
                        <p className="mb-1 text-xs text-white/50">التاريخ</p>
                        <span className="text-[15px] text-white/82">{item.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden lg:block">
                    <span className="text-sm font-medium text-white/92">{item.code}</span>
                  </div>

                  <div className="hidden min-w-0 lg:block">
                    <span className="block truncate text-sm font-medium text-white/92">
                      {item.value}
                    </span>
                  </div>

                  <div className="hidden min-w-0 lg:block">
                    <span className="block truncate text-sm font-medium text-white/92">
                      {formatDate(item.validFrom)}
                    </span>
                  </div>

                  <div className="hidden lg:block">
                    <span
                      className={`inline-flex rounded-full px-4 py-1.5 text-xs font-bold`}
                    >
                      {formatDate(item.validUntil)}
                    </span>
                  </div>

                  <div className="hidden text-[15px] font-bold text-[#cedaeb] lg:block">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold `}
                    >
                      <span className="h-2 w-2 rounded-full bg-current opacity-90" />
                      {item.status}
                    </span>
                  </div>

                  <div className="hidden text-[15px] text-white/82 lg:block">
                    {item.maxUses}
                  </div>

                  <div className="hidden lg:block ">
                    <div className='flex items-center gap-2'>
                      <button className="transition hover:text-white cursor-pointer">
                        <FiEye size={14} />
                      </button>
                      <button onClick={() => handleDelete(item._id)}
                        className="transition hover:text-white" >
                        <RiDeleteBin6Line className="h-4 w-4 hover:text-red-500 duration-300 cursor-pointer" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </>)
}

export default Coupon