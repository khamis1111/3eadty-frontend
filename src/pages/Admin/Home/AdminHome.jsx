import { Col, Table } from 'react-bootstrap';
import { FaUserInjured } from "react-icons/fa6";
import { IoCalendarSharp } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
import { Link } from 'react-router-dom';
import { DateFormate } from '../../../utils/DateFormate';
import './AdminHome.css';

const AdminHome = ({ allUser, allAppointment, loading }) => {

    return (
        <Col lg={7} className='dashboard'>
            <div className="mb-5">
                <div className="title flex-wrap gap-3 fs-1 mb-5">
                    <MdSpaceDashboard size={50} /> لوحة التحكم
                </div>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Col md={5} className="home-card p-4 main-bg rounded-3 shadow text-center">
                        <FaUserInjured size={70} />
                        <h2 className='mb-3'>مجموع المرضي</h2>
                        <h3 className='m-0'>{loading && allUser.results}</h3>
                    </Col>
                    <Col md={5} className="home-card p-4 main-bg rounded-3 shadow text-center">
                        <IoCalendarSharp size={70} />
                        <h2 className='mb-3'>مجموع المواعيد</h2>
                        <h3 className='m-0'>{loading && allAppointment.results}</h3>
                    </Col>
                </div>
            </div>

            <div className="title flex-wrap gap-3 fs-1 mb-5">
                <IoCalendarSharp size={50} /> المواعيد
            </div>
            <div className="table-responsive">
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>اسم المريض</th>
                            <th>تفاصيل الميعاد</th>
                            <th>التوقيت</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loading ?
                                allAppointment.data && allAppointment.data.length > 0 ?
                                    allAppointment.data.map((data, index) => (
                                        <tr key={data._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {/* Return user => name === name in table */}
                                                <Link to={`/userDetails/${allUser.data && allUser.data?.filter((user) => user.name === data.patientName)[0]?._id}`}>
                                                    {data.patientName}
                                                </Link>
                                            </td>
                                            <td>{data.description}</td>
                                            <td>{DateFormate(data.date)}</td>
                                        </tr>
                                    ))
                                    : <tr><td colSpan={4} className='text-center fs-5 fw-bold'>لا يوجد أي مواعيد</td></tr>
                                : <tr><td colSpan={4} className='text-center fs-5 fw-bold'>تحميل المواعيد...</td></tr>
                        }
                    </tbody>
                </Table>
            </div>
        </Col>
    )
}

export default AdminHome
