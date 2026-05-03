import React, { useContext, useState } from 'react'
import UploadLawPdf from '../UpLoadLawodf/UpLoadLawodf'
import api from '../../api/axios'
import Cookies from "js-cookie";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import LawsList from '../LawsList/LawsList';
import toast from 'react-hot-toast';
import { Authcontext } from '../../Context/AuthContextProvider';

const BookOfLaw = () => {
  const { AllBooks } = useContext(Authcontext)


  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      return api.delete(`/lawReminder/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["AllBokks"]);
      toast.success("تم الحذف");
    },
    onError: () => {
      toast.error("حصل خطأ أثناء الحذف");
    }
  });
  return (
    <>
      <UploadLawPdf />
      <LawsList data={AllBooks?.laws} del={(id) => deleteMutation.mutate(id)} />
    </>
  )
}



export default BookOfLaw