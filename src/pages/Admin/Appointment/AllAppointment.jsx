import moment from 'moment';
import React, { useState } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { IoCalendarSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { DeleteData } from '../../../api/Axios/useDeleteData';
import { EditData } from '../../../api/Axios/useEditData';
import { GetData } from '../../../api/Axios/useGetData';
import { PostData } from '../../../api/Axios/usePostData';
import MainButton from '../../../components/MainButton';
import { DateFormate } from '../../../utils/DateFormate';
import notify from '../../../utils/useToastify';

const AllAppointment = ({ allUser, allAppointment, loading, getAllAppointment }) => {
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const [patientName, setPatientName] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')

  const [editdId, setEditdId] = useState(0)

  const handleShowEdit = (id) => {
    setShowEdit(true)
    setEditdId(id)

    GetData(`/api/v1/appointment/${id}`).then(res => {
      setPatientName(res.data.data.patientName)
      setDescription(res.data.data.description)
      setDate(res.data.data.date)
    }).catch(err => {
      console.log(err)
      notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
    })
  }

  const handleEditAppointment = (e) => {
    e.preventDefault()

    EditData(`/api/v1/appointment/${editdId}`, {
      patientName,
      description,
      date
    }).then(res => {
      notify('تم التعديل بنجاح', 'success')
      getAllAppointment()
      setShowEdit(false)
      setPatientName('')
      setDescription('')
      setDate('')
    }).catch(err => {
      console.log(err)
      notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
    })
  }

  const handleAddAppointment = (e) => {
    e.preventDefault()

    PostData(`/api/v1/appointment`, {
      patientName,
      description,
      date
    }).then(res => {
      notify('تمت الاضافة بنجاح', 'success')
      getAllAppointment()
      setShowAdd(false)
      setPatientName('')
      setDescription('')
      setDate('')
    }).catch(err => {
      console.log(err)
      notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
    })
  }

  const handleDeleteAppointment = (e, id) => {
    e.preventDefault()

    DeleteData(`/api/v1/appointment/${id}`).then(res => {
      notify('تم الحذف', 'warn')
      getAllAppointment()
      setShowEdit(false)
    }).catch(err => {
      console.log(err)
      notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
    })
  }

  return (
    <Col lg={8}>
      <div className="title flex-wrap gap-3 fs-1 mb-5 d-flex justify-content-between align-items-center">
        <div className="title flex-wrap gap-3 fs-1">
          <IoCalendarSharp size={50} /> المواعيد
        </div>
        <MainButton name={'اضافة ميعاد'} onClick={() => setShowAdd(!showAdd)} />
      </div>

      {/* All Medications */}
      <div className="fs-5 mb-4">
        <div className="fs-4 mb-3">
          المواعيد :
        </div>
        <div className="table-responsive">
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>اسم المريض</th>
                <th>تفاصيل الميعاد</th>
                <th>التوقيت</th>
                <th>أخري...</th>
              </tr>
            </thead>
            <tbody>
              {
                loading ?
                  allAppointment.data && allAppointment.data.length > 0 ?
                    allAppointment.data.map((data, index) => (
                      <tr key={data._id}>
                        <td>{index + 1}</td>
                        <td><Link to={`/userDetails/${allUser.data.filter((user) => user.name === data.patientName)[0]?._id}`}>
                          {data.patientName}
                        </Link></td>
                        <td>{data.description}</td>
                        <td>{DateFormate(data.date)}</td>
                        <td className='d-flex flex-wrap justify-content-center gap-3'>
                          <Button variant='success' onClick={(e) => handleShowEdit(data._id)}>تعديل</Button>
                          <Button variant='danger' onClick={(e) => handleDeleteAppointment(e, data._id)}>حذف</Button>
                        </td>
                      </tr>
                    ))
                    : <tr><td colSpan={5} className='text-center fs-5 fw-bold'>لا يوجد أي مواعيد</td></tr>
                  : <tr><td colSpan={5} className='text-center fs-5 fw-bold'>تحميل المواعيد...</td></tr>
              }
            </tbody>
          </Table>
        </div>
      </div>


      {/* Add Medications */}
      {
        showAdd && (
          <div className="fs-5 mb-4">
            <div className="fs-4 mb-3">
              اضافة ميعاد جديد :
            </div>

            <div className="form-container">
              <form className="form">
                <Row>
                  <Col className="form-group">
                    <label htmlFor="patientName">اسم المريض</label>
                    <input list="patients" id="patientName" name="patientName" placeholder='اسم المريض' />

                    <datalist id="patients">
                      {
                        loading ?
                          allUser.data && allUser.data.length > 0 ?
                            allUser.data.map((data) => (
                              <option value={data.name} key={data._id}>{data.name}</option>
                            ))
                            : <option value='0' hidden selected className='text-center fw-bold'>لا يوجد أي مريض</option>
                          : <option value='0' hidden selected className='text-center fw-bold'>تحميل المرضي...</option>
                      }
                    </datalist>
                  </Col>
                  <Col className="form-group">
                    <label htmlFor="date">
                      التوقيت
                    </label>
                    <input name="date" id="date" type="datetime-local" placeholder=' التوقيت '
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="form-group">
                    <label htmlFor="description">
                      تفاصيل الميعاد
                    </label>
                    <input name="description" id="description" type="text" placeholder=' تفاصيل الميعاد '
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Col>
                  <div className='text-start mt-3'>
                    <MainButton name={'اضافة'} onClick={(e) => handleAddAppointment(e)} />
                  </div>
                </Row>

              </form>
            </div>
          </div>
        )
      }

      {/* Edit Medications */}
      {
        showEdit && (
          <div className="fs-5 mb-4">
            <div className="fs-4 mb-3">
              تعديل {patientName} :
            </div>

            <div className="form-container">
              <form className="form">
                <Row>
                  <Col className="form-group">
                    {/* <label htmlFor="patientName-e">
                      اسم المريض
                    </label>
                    <select className="form-group-select" id="patientName-e" onChange={(e) => setPatientName(e.target.value)}>
                      <option hidden value='0'>أسماء المرضي</option>
                      {
                        loading ?
                          allUser.data && allUser.data.length > 0 ?
                            allUser.data.map((data) => (
                              <option selected={patientName === data.name} value={data.name} key={data._id}>{data.name}</option>
                            ))
                            : <option value='0' hidden selected className='text-center fw-bold'>لا يوجد أي مريض</option>
                          : <option value='0' hidden selected className='text-center fw-bold'>تحميل المرضي...</option>
                      }
                    </select> */}

                    <label htmlFor="patientName-e">اسم المريض</label>
                    <input list="patients-e" id="patientName-e" name="patientName-e" placeholder='اسم المريض' />

                    <datalist id="patients-e" onChange={(e) => setPatientName(e.target.value)}>
                      {
                        loading ?
                          allUser.data && allUser.data.length > 0 ?
                            allUser.data.map((data) => (
                              <option selected={patientName === data.name} value={data.name} key={data._id}>{data.name}</option>
                            ))
                            : <option value='0' hidden selected className='text-center fw-bold'>لا يوجد أي مريض</option>
                          : <option value='0' hidden selected className='text-center fw-bold'>تحميل المرضي...</option>
                      }
                    </datalist>
                  </Col>

                  <Col className="form-group">
                    <label htmlFor="date-e">
                      التوقيت
                    </label>
                    <input name="date-e" id="date-e" type="datetime-local" placeholder=' التوقيت '
                      value={moment(date).locale('en').format('YYYY-MM-DDTHH:mm')} onChange={(e) => setDate(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="form-group">
                    <label htmlFor="description-e">
                      تفاصيل الميعاد
                    </label>
                    <input name="description-e" id="description-e" type="text" placeholder=' تفاصيل الميعاد '
                      value={description} onChange={(e) => setDescription(e.target.value)}
                    />
                  </Col>
                  <div className='text-start mt-3'>
                    <MainButton name={'تعديل'} onClick={(e) => handleEditAppointment(e)} />
                  </div>
                </Row>
              </form>
            </div>
          </div>
        )
      }
    </Col>
  )
}

export default AllAppointment
