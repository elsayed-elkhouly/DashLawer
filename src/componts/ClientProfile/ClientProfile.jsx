import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie';
import { FiFolder, FiFileText, FiDollarSign } from "react-icons/fi";
// import Documentbar from '../document/Documentbar';
import PersonalInfp from '../personalInfo/PersonalInfp';
import CaseTable from '../caseTable/CaseTable';
import InvoicesTable from '../InvoicesTable/InvoicesTable';
import { CiFolderOn } from "react-icons/ci";
import { LuClipboardPenLine } from "react-icons/lu";
import { FaMoneyBills } from "react-icons/fa6";
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { RiDeleteBin6Line } from "react-icons/ri";

import toast from 'react-hot-toast';
const ClientProfile = () => {
  const { id } = useParams()
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  function getClientProfile() {
    return axios.get(`https://lawersystem-production.up.railway.app/Client/${id}`, {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      }
    })
  }
  const { data } = useQuery({
    queryKey: ["ClientProfile", id],
    queryFn: getClientProfile,
  });
  console.log(data?.data?.client?.documents);

  const updateMutation = useMutation({
    mutationFn: updateData,
    onSuccess: (res) => {
      queryClient.setQueryData(["ClientProfile", id], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            client: res?.data?.client
              ? res.data.client
              : oldData.data.client,
          },
        };
      });
    },
  });
  function updateData(updatedClient) {
    return axios.put(
      `https://lawersystem-production.up.railway.app/Client/${id}`,
      updatedClient,
      {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,

        },
      }
    );
  }

  // console.log(data?.data?.invoices);




  async function AddDocument() {
    if (!file) {
      alert("اختر ملف أولا");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `https://lawersystem-production.up.railway.app/Client/${id}/documents`,
        formData, {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        }
      }
      );

      console.log(res.data);
      toast.success("تم رفع الملف بنجاح");
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("حصل خطأ أثناء رفع الملف");
    }
  }
  const documents = data?.data?.client?.documents || [];



  const downloadFile = async (doc) => {
    try {
      const response = await fetch(doc.url);
      const blob = await response.blob();

      const fileURL = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = doc.name || "document.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  async function DeleteDoc(publicId) {
    try {
      const res = await axios.delete(
        `https://lawersystem-production.up.railway.app/Client/${id}/deleteDocuments`,
        {
          data: {
            publicId: publicId
          },
          headers: {
            authorization: `Bearer ${Cookies.get("token")}`,
          }
        }
      );

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  function Card({ icon, title, value, color }) {
    return (
      <div className="bg-[#162132] border border-gray-700 rounded-xl p-4 h-25.25 flex items-center justify-between">
        <div className="">
          <p className="text-gray-400 text-sm">{title}</p>
          <p className={`text-xl font-bold ${color || "text-white"}`}>
            {value}
          </p>
        </div>

        <div className={`text-xl  ${color || "text-yellow-400"}`}>
          {icon}
        </div>



      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div dir="rtl" className="bg-[#0b1b2b] text-white p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{data?.data?.client?.fullName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-[#f5c35c] text-black px-4 py-2 rounded-lg flex items-center gap-2">
              إضافة قضية جديدة +
            </button>
          </div>
        </div>



        {/* Cards */}
        <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">

          <Card
            icon={<CiFolderOn />}
            title="عدد القضايا"
            value={data?.data?.summary?.casesCount}
          />

          <Card
            icon={<LuClipboardPenLine />}
            title="القضايا النشطة"
            value={data?.data?.summary?.activeCasesCount}
          />

          <Card
            icon={<FaMoneyBills />}
            title="إجمالي الفواتير"
            value={data?.data?.summary?.grandTotalPaid}
          />

          <Card
            icon={<MdOutlineAccountBalanceWallet />}
            title="الرصيد المتبقي"
            value={data?.data?.summary?.totalDue
            }
            color="text-red-500"
          />

        </div>
      </div>
      {/* all about client  */}
      <section>
        <div dir="rtl" className="bg-[#0b1b2b] min-h-screen p-6 text-white">
          <div className="grid grid-cols-12 gap-6">
            {/* Content */}
            <div className="col-span-9 space-y-6">
              <PersonalInfp
                client={data?.data?.client}
                onSave={(formData) => updateMutation.mutate(formData)}
                isSaving={updateMutation.isPending}
              />
              <CaseTable cases={data?.data?.cases} />
              <InvoicesTable invoices={data?.data?.invoices} />
            </div>
            {/* Sidebar */}
            <div className="col-span-3">
              <div className="bg-[#162132] p-4 rounded-xl border border-slate-700">

                <div className="flex justify-between mb-4">
                  <h2 className="text-yellow-400 font-semibold">
                    أرشيف المستندات
                  </h2>
                  <span className="text-sm">(12)</span>
                </div>

                <div className="space-y-3">

                  {documents?.map((doc, index) => (
                    <div
                      key={doc.publicId || index}
                      className="bg-[#1d2a3b] p-3 rounded-lg mt-3 hover:bg-[#24364d] flex justify-between items-center cursor-pointer"
                      onClick={() => downloadFile(doc)}
                    >
                      <div>
                        <p className="text-white">{doc.name}</p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); // يمنع تشغيل التحميل عند الضغط على الحذف
                          DeleteDoc(doc.publicId);
                        }}
                        className="text-red-400 hover:text-red-600 text-lg cursor-pointer"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                  ))}


                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="border border-dashed border-yellow-400 mt-4 w-full py-2 rounded-lg text-yellow-400 hover:bg-amber-200 cursor-pointer"
                >
                  {file ? file.name : "+ رفع ملف جديد"}
                </button>

                {file && (
                  <button
                    type="button"
                    onClick={AddDocument}
                    className="mt-3 w-full py-2 rounded-lg bg-yellow-400 text-black font-semibold cursor-pointer"
                  >
                    رفع الملف
                  </button>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  )
}

export default ClientProfile