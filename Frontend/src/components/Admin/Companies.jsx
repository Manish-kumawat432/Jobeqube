import React, { useState ,useEffect} from 'react'
import Navbar from '../Navbar'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompany from '../../hooks/useGetAllCompany'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '../../redux/companySlice'

const Companies = () => {
  useGetAllCompany()
  const navigate = useNavigate()
  const [input,setInput]=useState("");
const dispatch=useDispatch();
  useEffect(()=>{
dispatch(setSearchCompanyByText(input))
  },[input,dispatch])
  return (
    <div>
      <Navbar />
      <div className=' max-w-6xl mx-auto my-9'>
        <div className='flex items-center justify-between'>

          <input className='w-fit h-9 border border-gray-300 rounded hover:bg-gray-100 shadow-lg' placeholder='  Filter by name .....' onChange={(e)=>setInput(e.target.value)} />
          <button className=' bg-orange-600 hover:bg-green-500 p-2 text-white rounded cursor-pointer' onClick={() => navigate('/admin/companies/create')}>
            New Company
          </button>
        </div>
        <CompaniesTable />
      </div>
    </div>
  )
}
export default Companies
