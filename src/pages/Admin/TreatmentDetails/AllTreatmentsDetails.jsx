import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import MainButton from '../../../components/MainButton'
import { FaUserEdit } from 'react-icons/fa'
import { PostData } from '../../../api/Axios/usePostData'
import notify from '../../../utils/useToastify'
import { GetData } from '../../../api/Axios/useGetData'
import { useParams } from 'react-router-dom'
import { EditData } from '../../../api/Axios/useEditData'
import { DeleteData } from '../../../api/Axios/useDeleteData'
import { DateFormate } from '../../../utils/DateFormate'
import moment from 'moment'

const AllTreatmentsDetails = () => {
  const { id } = useParams()

  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [loading, setLoading] = useState(false)

  const [user, setUser] = useState()
  const [editdId, setEditdId] = useState(0)

  const [process, setProcess] = useState()
  const [processDetails, setProcessDetails] = useState()
  const [price, setPrice] = useState()
  const [date, setDate] = useState()

  const GetUser = () => {
    setLoading(false)

    GetData(`/api/v1/userInfo/${id}`).then((res) => {
      setLoading(true)
      setUser(res.data)
    }).catch((err) => {
      console.log(err)
      notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
    })
  }

  useEffect(() => {
    GetUser()
  }, [])

  const handleShowEdit = (detailsId) => {
    setShowEdit(true)
    setEditdId(detailsId)

    const detailsData = user.data.treatmentsDetails.filter((user) => user._id === detailsId)
    setProcess(detailsData[0].process)
    setProcessDetails(detailsData[0].processDetails)
    setPrice(detailsData[0].price)
    setDate(detailsData[0].date)
  }

  const handleAddDetails = (e) => {
    e.preventDefault()

    PostData(`/api/v1/treatments/details/${id}`, {
      process,
      processDetails,
      price,
      date
    }).then(res => {
      notify('تمت الاضافة بنجاح', 'success')
      GetUser()
      setShowAdd(false)
      setProcess()
      setProcessDetails()
      setPrice()
      setDate()
    }).catch(err => {
      console.log(err)
      notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
    })
  }

  const handleEditDetails = (e) => {
    e.preventDefault()

    EditData(`/api/v1/treatments/details/${id}`, {
      docId: editdId,
      process,
      processDetails,
      price,
      date
    }).then(res => {
      notify('تم التعديل بنجاح', 'success')
      GetUser()
      setShowEdit(false)
      setProcess()
      setProcessDetails()
      setPrice()
      setDate()
    }).catch(err => {
      console.log(err)
      notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
    })
  }

  const handleDeleteDetails = (e, DetailsId) => {
    e.preventDefault()

    DeleteData(`/api/v1/treatments/details/${id}`, {
      docId: DetailsId
    }).then(res => {
      notify('تم الحذف', 'warn')
      GetUser()
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
          <FaUserEdit size={50} /> {user?.data?.name}
        </div>
        <MainButton name={' اضافة تفاصيل العلاج '} onClick={() => setShowAdd(!showAdd)} />
      </div>

      {/* All TreatmentsDetails */}
      <div className="fs-5 mb-4">
        <div className="fs-4 mb-3">
          تفاصيل العلاج :
        </div>
        <div className="table-responsive">
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>العملية</th>
                <th>تفاصيل العملية</th>
                <th>السعر</th>
                <th>التاريخ</th>
                <th>أخري...</th>
              </tr>
            </thead>
            <tbody>
              {
                loading ?
                  user.data && user.data?.treatmentsDetails.length > 0 ?
                    user.data?.treatmentsDetails.map((data, index) => (
                      <tr key={data._id}>
                        <td>{index + 1}</td>
                        <td>{data.process}</td>
                        <td>{data.processDetails}</td>
                        <td>{data.price}</td>
                        <td>{DateFormate(data.date)}</td>
                        <td className='d-flex flex-wrap justify-content-center gap-3'>
                          <Button variant='success' onClick={(e) => handleShowEdit(data._id)}>تعديل</Button>
                          <Button variant='danger' onClick={(e) => handleDeleteDetails(e, data._id)}>حذف</Button>
                        </td>
                      </tr>
                    ))
                    : <tr><td colSpan={6} className='text-center fs-5 fw-bold'>لا يوجد أي تفاصيل</td></tr>
                  : <tr><td colSpan={6} className='text-center fs-5 fw-bold'>تحميل التفاصيل...</td></tr>
              }
            </tbody>
          </Table>
        </div>
      </div>

      {/* Add TreatmentsDetails */}
      {
        showAdd &&
        <div className="fs-5 mb-4">
          <div className="fs-4 mb-3">
            اضافة تفاصيل علاج جديدة :
          </div>

          <div className="form-container">
            <form className="form">
              <Row>
                <Col className="form-group">
                  <label htmlFor="process">
                    نوع العملية
                  </label>
                  <input required name="process" id="process" type="text" placeholder=' نوع العملية '
                    onChange={(e) => setProcess(e.target.value)}
                  />
                </Col>
                <Col className="form-group">
                  <label htmlFor="price">
                    سعر العملية
                  </label>
                  <input required name="price" id="price" type="number" placeholder=' سعر العملية '
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="form-group">
                  <label htmlFor="processDetails">
                    تفاصيل العملية
                  </label>
                  <input name="processDetails" id="processDetails" type="text" placeholder=' تفاصيل العملية '
                    onChange={(e) => setProcessDetails(e.target.value)}
                  />
                </Col>
                <Col className="form-group">
                  <label htmlFor="date">
                    التاريخ
                  </label>
                  <input name="date" id="date" type="datetime-local" placeholder=' التاريخ '
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Col>
              </Row>
              <div className='text-start mt-3'>
                <MainButton name={'اضافة'} onClick={(e) => handleAddDetails(e)} />
              </div>
            </form>
          </div>
        </div>
      }

      {/* Edit TreatmentsDetails */}
      {
        showEdit &&
        <div className="fs-5 mb-4">
          <div className="fs-4 mb-3">
            تعديل {process} :
          </div>

          <div className="form-container">
            <form className="form">
              <Row>
                <Col className="form-group">
                  <label htmlFor="treatmentsType-e">
                    نوع العملية
                  </label>
                  <input required name="treatmentsType-e" id="treatmentsType-e" type="text" placeholder=' نوع العملية '
                    value={process} onChange={(e) => setProcess(e.target.value)}
                  />
                </Col>
                <Col className="form-group">
                  <label htmlFor="price">
                    سعر العملية
                  </label>
                  <input required name="price" id="price" type="number" placeholder=' سعر العملية '
                    value={price} onChange={(e) => setPrice(e.target.value)}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="form-group">
                  <label htmlFor="details-e">
                    تفاصيل العملية
                  </label>
                  <input name="details-e" id="details-e" type="text" placeholder=' تفاصيل العملية '
                    value={processDetails} onChange={(e) => setProcessDetails(e.target.value)}
                  />
                </Col>
                <Col className="form-group">
                  <label htmlFor="date-e">
                    التاريخ
                  </label>
                  <input name="date-e" id="date-e" type="datetime-local" placeholder=' التاريخ '
                    value={moment(date).locale('en').format('YYYY-MM-DDTHH:mm')} onChange={(e) => setDate(e.target.value)}
                  />
                </Col>
              </Row>
              <div className='text-start mt-3'>
                <MainButton name={'تعديل'} onClick={(e) => handleEditDetails(e)} />
              </div>
            </form>
          </div>
        </div>
      }
    </Col>
  )
}

export default AllTreatmentsDetails
