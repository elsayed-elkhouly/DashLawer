import React, { useState } from 'react'
import UploadLawPdf from '../UpLoadLawodf/UpLoadLawodf'

const BookOfLaw = () => {
  const [data, setdata] = useState([])

  return (
    <>
    <UploadLawPdf data={setdata}/>
    
    </>
  )
}

export default BookOfLaw