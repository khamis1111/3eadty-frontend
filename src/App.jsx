import { useEffect, useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { GetData } from "./api/Axios/useGetData"
import Sidebar from "./components/Sidebar/Sidebar"
import AllAppointment from "./pages/Admin/Appointment/AllAppointment"
import AllCurrentMedications from "./pages/Admin/CurrentMedications/AllCurrentMedications"
import AdminHome from "./pages/Admin/Home/AdminHome"
import AllRadiographs from "./pages/Admin/Radiographs/AllRadiographs"
import AllTreatmentsDetails from "./pages/Admin/TreatmentDetails/AllTreatmentsDetails"
import AllTreatmentsHistory from "./pages/Admin/TreatmentsHistory/AllTreatmentsHistory"
import AllTreatmentsPlan from "./pages/Admin/TreatmentsPlan/AllTreatmentsPlan"
import AddUser from "./pages/Admin/Users/AddUser"
import AllUsers from "./pages/Admin/Users/AllUsers"
import EditUser from "./pages/Admin/Users/EditUser"
import UserDetails from "./pages/Admin/Users/UserDetails"
import notify from "./utils/useToastify"
import { ToastContainer } from "react-toastify"

const App = () => {
  const [loading, setLoading] = useState(false)
  const [allUser, setAllUser] = useState([])
  const [allAppointment, setAllAppointment] = useState([])

  const getAllUsers = () => {
    setLoading(false)

    GetData('/api/v1/userInfo').then(res => {
      setLoading(true)
      setAllUser(res.data)
    }).catch(err => {
      console.log(err)
      notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
    })
  }

  const getAllAppointment = () => {
    setLoading(false)

    GetData('/api/v1/appointment').then(res => {
      setLoading(true)
      setAllAppointment(res.data)
    }).catch(err => {
      console.log(err)
      notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      await getAllUsers()
      await getAllAppointment()
    };
    fetchData();
  }, [])

  return (
    <>
      <BrowserRouter future={{ v7_startTransition: true }}>
        <Sidebar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<AdminHome allUser={allUser} allAppointment={allAppointment} loading={loading} />} />
            <Route path="/allUsers" element={<AllUsers allUser={allUser} loading={loading} getAllUsers={getAllUsers} setAllUser={setAllUser} />} />
            <Route path="/addUser" element={<AddUser getAllUsers={getAllUsers} />} />
            <Route path="/editUser/:id" element={<EditUser getAllUsers={getAllUsers} />} />
            <Route path="/userDetails/:id" element={<UserDetails />} />
            <Route path="/allCurrentMedications/:id" element={<AllCurrentMedications />} />
            <Route path="/allTreatmentsHistory/:id" element={<AllTreatmentsHistory />} />
            <Route path="/allTreatmentsPlan/:id" element={<AllTreatmentsPlan />} />
            <Route path="/allTreatmentsDetails/:id" element={<AllTreatmentsDetails />} />
            <Route path="/allRadiographs/:id" element={<AllRadiographs />} />
            <Route path="/allAppointment" element={<AllAppointment allUser={allUser} allAppointment={allAppointment} loading={loading} getAllAppointment={getAllAppointment} />} />
          </Routes>
        </div>
        <ToastContainer />
      </BrowserRouter>
    </>
  )
}

export default App