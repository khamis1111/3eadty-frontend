import React, { useState } from 'react'
import { Button, Col, NavDropdown, Row, Table } from 'react-bootstrap'
import { FaFilter } from "react-icons/fa"
import { FaUserInjured } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { DeleteData } from '../../../api/Axios/useDeleteData'
import { GetData } from '../../../api/Axios/useGetData'
import MainButton from '../../../components/MainButton'
import notify from '../../../utils/useToastify'

const AllUsers = ({ allUser, loading, getAllUsers, setAllUser }) => {
  const [IsFilter, setIsFilter] = useState('all')

  const handleDeleteUser = (e, id) => {
    e.preventDefault()

    DeleteData(`/api/v1/userInfo/${id}`).then(res => {
      notify('تم الحذف', 'warn')
      getAllUsers()
    }).catch(err => {
      console.log(err)
      notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
    })
  }

  const handlSearch = (e) => {
    GetData(`/api/v1/userInfo?keyword=${e.target.value}`).then(res => {
      setAllUser(res.data)
    }).catch(err => {
      console.log(err)
      notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
    })
  }

  return (
    <Col lg={8}>
      <div className="title flex-wrap gap-3 fs-1 mb-5 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div> <FaUserInjured size={50} /> تفاصيل كل المرضي</div>
        <Link to={'/addUser'}>
          <MainButton name={'اضافة مريض'} />
        </Link>
      </div>

      <div className="form-container mb-4">
        <form className="form">
          <Row className='align-items-center filter'>
            <Col md={11} className="form-group">
              <input required name="search" id="search" type="search" placeholder=' البحث عن طريق الاسم '
                onChange={(e) => handlSearch(e)}
              />
            </Col>
            <Col md={1}>
              <NavDropdown title={<FaFilter size={25} />} id="basic-nav-dropdown" data-bs-theme="dark">
                <NavDropdown.Item onClick={() => setIsFilter('paid')} className='text-center'>تم الدفع</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => setIsFilter('notPaid')} className='text-center'>
                  لم يتم الدفع
                </NavDropdown.Item>
              </NavDropdown>
            </Col>
          </Row>

        </form>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover variant="dark" className="tables">
          <thead>
            <tr>
              <th>#</th>
              <th>اسم المريض</th>
              <th>السعر</th>
              <th>حالة الدفع</th>
              <th>أخري...</th>
            </tr>
          </thead>
          <tbody>
            {
              loading ?
                allUser.data && allUser.data.length > 0 ?
                  allUser.data.map((data, index) => (
                    IsFilter === 'paid' ?
                      <tr key={data._id}>
                        {
                          data.isPaid && <>
                            <td>{index + 1}</td>
                            <td>{data.name}</td>
                            <td>{data.price}</td>
                            {
                              data.isPaid ?
                                <td className="text-success"> تم الدفع</td>
                                : <td className="text-danger">لم يتم الدفع</td>
                            }
                            <td className="d-flex flex-wrap justify-content-center gap-3">
                              <Link to={`/userDetails/${data._id}`}><Button variant="dark">تفاصيل المريض</Button></Link>
                              <Link to={`/editUser/${data._id}`}><Button variant="success">تعديل</Button></Link>
                              <Button variant="danger" onClick={(e) => handleDeleteUser(e, data._id)}>حذف</Button>
                            </td>
                          </>
                        }
                      </tr>
                      : IsFilter === 'notPaid' ?
                        <tr key={data._id}>
                          {
                            !data.isPaid && <>
                              <td>{index + 1}</td>
                              <td>{data.name}</td>
                              <td>{data.price}</td>
                              {
                                data.isPaid ?
                                  <td className="text-success"> تم الدفع</td>
                                  : <td className="text-danger">لم يتم الدفع</td>
                              }
                              <td className="d-flex flex-wrap justify-content-center gap-3">
                                <Link to={`/userDetails/${data._id}`}><Button variant="dark">تفاصيل المريض</Button></Link>
                                <Link to={`/editUser/${data._id}`}><Button variant="success">تعديل</Button></Link>
                                <Button variant="danger" onClick={(e) => handleDeleteUser(e, data._id)}>حذف</Button>
                              </td>
                            </>
                          }
                        </tr>
                        : <tr key={data._id}>
                          <td>{index + 1}</td>
                          <td>{data.name}</td>
                          <td>{data.price}</td>
                          {
                            data.isPaid ?
                              <td className="text-success"> تم الدفع</td>
                              : <td className="text-danger">لم يتم الدفع</td>
                          }

                          <td className="d-flex flex-wrap justify-content-center gap-3">
                            <Link to={`/userDetails/${data._id}`}><Button variant="dark">تفاصيل المريض</Button></Link>
                            <Link to={`/editUser/${data._id}`}><Button variant="success">تعديل</Button></Link>
                            <Button variant="danger" onClick={(e) => handleDeleteUser(e, data._id)}>حذف</Button>
                          </td>
                        </tr>
                  ))
                  : <tr><td colSpan={5} className='text-center fs-5 fw-bold'>لا يوجد أي مرضي</td></tr>
                : <tr><td colSpan={5} className='text-center fs-5 fw-bold'>تحميل المرضي...</td></tr>
            }
          </tbody>
        </Table>
      </div>

    </Col>
  )
}

export default AllUsers
