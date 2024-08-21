import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
import { FaUserInjured } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import { IoCalendarSharp } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="title flex-wrap gap-3 fs-5 text-effect light-effect mb-5">
        <p>مرحبا بعودتك , خميس</p>
        <span>مرحبا</span>
      </div>
      <div className="items d-flex flex-column gap-4 mb-5">
        <Link to={'/'} className="item second-bg py-3 rounded-4 shadow">
          <p>لوحة التحكم</p>
          <span><MdSpaceDashboard size={30} /></span>
        </Link>
        <Link to={'/allUsers'} className="item second-bg py-3 rounded-4 shadow">
          <p>تفاصيل كل المرضي</p>
          <span><FaUserInjured size={30} /></span>
        </Link>
        <Link to={'/allAppointment'} className="item second-bg py-3 rounded-4 shadow">
          <p>المواعيد</p>
          <span><IoCalendarSharp size={30} /></span>
        </Link>
      </div>
      <div className="line mb-5"></div>
      <div className="item second-bg py-3 rounded-4 shadow">
        <p>تسجيل خروج</p>
        <span><IoLogOut size={30} /></span>
      </div>
    </div>
  )
}

export default Sidebar
