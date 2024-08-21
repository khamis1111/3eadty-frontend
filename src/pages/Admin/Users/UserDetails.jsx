import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, Row, Table } from 'react-bootstrap'
import { FaClipboardUser } from "react-icons/fa6";
import { Link, useParams } from 'react-router-dom';
import MainButton from '../../../components/MainButton';
import { RiFileEditFill } from "react-icons/ri";
import { MdDeleteSweep } from "react-icons/md";
import { GetData } from '../../../api/Axios/useGetData';
import notify from '../../../utils/useToastify';
import { DateFormate } from '../../../utils/DateFormate';
import { PostData } from '../../../api/Axios/usePostData';
import { DeleteData } from '../../../api/Axios/useDeleteData';
import { EditData } from '../../../api/Axios/useEditData';
import ReactImageGallery from 'react-image-gallery';

const UserDetails = () => {
  const { id } = useParams() /* User ID */
  // Model Add
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Model Edit
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = (notes) => {
    setShowEdit(true)
    setNoteName(notes)
  };
  // Model Img
  // const [showImg, setShowImg] = useState(false);
  // const handleCloseImg = () => setShowImg(false);
  // const handleShowImg = () => setShowImg(true);

  const [loading, setLoading] = useState(false)

  const [user, setUser] = useState('')
  const [isPaid, setIsPaid] = useState(false)
  const [noteName, setNoteName] = useState()

  const GetUser = () => {
    setLoading(false)

    GetData(`/api/v1/userInfo/${id}`).then((res) => {
      setUser(res.data)
      setIsPaid(res.data.data.isPaid)
      setLoading(true)
    }).catch((err) => {
      console.log(err)
      notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
    })
  }

  useEffect(() => {
    GetUser()
  }, [])

  const handleUpdateIsPaidOrNot = (e) => {
    e.preventDefault()
    if (isPaid === 'true') {
      PostData(`/api/v1/userInfo/paid/${id}`).then((res) => {
        console.log(res)
        notify('تم الدفع بنجاح', 'success')
        GetUser()
      }).catch((err) => {
        console.log(err)
        notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
      })
    } else {
      PostData(`/api/v1/userInfo/notPaid/${id}`).then((res) => {
        console.log(res)
        notify('تم الغاء الدفع', 'warn')
        GetUser()
      }).catch((err) => {
        console.log(err)
        notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
      })
    }
  }

  const handleAddNotes = (e) => {
    e.preventDefault()

    PostData(`api/v1/examination/${id}`, {
      notes: noteName
    }).then((res) => {
      notify('تمت الاضافة بنجاح', 'success')
      GetUser()
      handleClose()
    }).catch((err) => {
      console.log(err)
      notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
    })
  }

  const handleEditNotes = (e, noteId) => {
    e.preventDefault()

    EditData(`api/v1/examination/${id}`, {
      docId: noteId,
      notes: noteName
    }).then((res) => {
      notify('تم التعديل بنجاح', 'success')
      GetUser()
      handleCloseEdit()
    }).catch((err) => {
      console.log(err)
      notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
    })
  }

  const handleDeleteNotes = (e, noteId) => {
    e.preventDefault()

    DeleteData(`api/v1/examination/${id}`, {
      docId: noteId
    }).then((res) => {
      notify('تم الحذف', 'warn')
      GetUser()
    }).catch((err) => {
      console.log(err)
      notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
    })
  }

  return (
    <Row>
      <div className="title flex-wrap gap-3 fs-1 mb-5">
        <FaClipboardUser size={50} /> {user.data?.name}
      </div>
      <Col md={6}>
        <div className='d-flex justify-content-center flex-wrap gap-2 text-center mb-3'>
          <Link to={`/allCurrentMedications/${id}`} className='shadow rounded-4 p-3 px-4 main-bg user-details' >الادوية الحالية</Link>
          <Link to={`/allRadiographs/${id}`} className='shadow rounded-4 p-3 px-4 main-bg user-details' >صور الأشعة</Link>
          <Link to={`/allTreatmentsHistory/${id}`} className='shadow rounded-4 p-3 px-4 main-bg user-details' >التاريخ المرضي</Link>
          <Link to={`/allTreatmentsPlan/${id}`} className='shadow rounded-4 p-3 px-4 main-bg user-details' >خطة العلاج</Link>
          <Link to={`/allTreatmentsDetails/${id}`} className='shadow rounded-4 p-3 px-4 main-bg user-details' >تفاصيل العلاج</Link>
        </div>

        <div className="main-bg p-4 rounded-4 shadow fs-5 mb-4">
          <div className="d-flex justify-content-between">
            <p>الاسم: {user.data?.name}</p>
            <Link to={`/editUser/${id}`}><Button variant='success' className='fs-6 shadow fw-bold'>تعديل</Button></Link>
          </div>
          <p>النوع: {user.data?.gender || 'لا يوجد'}</p>
          <p>السن: {user.data?.age || 'لا يوجد'}</p>
          <p>الهاتف: {user.data?.phone || 'لا يوجد'}</p>
          <Row className='my-3'>
            <Col md={4}><p>السعر: {user.data?.price || 0}</p></Col>
            <Col md={4}><p>المدفوع: {user.data?.paid || 0}</p></Col>
            {
              user.data?.paidAt ?
                <Col md={12}><p className='mt-2'>تم الدفع: {DateFormate(user.data?.paidAt)}</p></Col>
                : <Col md={4}><p>المتبقي: {user.data?.restOfPrice || 0}</p></Col>
            }
          </Row>
          <div className="form-container">
            <form className="form">
              <Col className="form-group">
                <select className="form-group-select" value={isPaid} id="isPaid" onChange={(e) => setIsPaid(e.target.value)}>
                  <option selected hidden>حالة الدفع</option>
                  <option value={true}>تم الدفع</option>
                  <option value={false}>لم يتم الدفع</option>
                </select>
              </Col>
              <Col className="form-group">
                <MainButton name={'تطبيق'} bg='second-bg' onClick={(e) => handleUpdateIsPaidOrNot(e)} />
              </Col>
            </form>
          </div>
        </div>

        <div className="main-bg p-4 rounded-4 shadow fs-5 mb-4">
          <div className="fs-4 mb-3">
            معلومات اضافية :
          </div>
          <div className="more-details d-flex flex-column gap-2">
            <p> الحالات الطبية:  <span className='shadow rounded-4 px-2 second-bg'>{user.data?.medicalConditions || 'لا يوجد'}</span> </p>
            <p> الحساسية: <span className='shadow rounded-4 px-2 second-bg'>{user.data?.allergies || 'لا يوجد'}</span></p>
            <p> الشكاوي الحالية: <span className='shadow rounded-4 px-2 second-bg'>{user.data?.currentComplaints || 'لا يوجد'}</span></p>
            <p> توصيات الدكتور: <span className='shadow rounded-4 px-2 second-bg'>{user.data?.recommendations || 'لا يوجد'}</span></p>
          </div>
        </div>


        <div className="main-bg p-4 rounded-4 shadow fs-5 mb-4">
          <div className='d-flex flex-wrap align-items-center justify-content-between'>
            <div className="fs-4 mb-3">
              ملاحظات عن المريض :
            </div>
            <Button variant='dark' className='fs-6 shadow fw-bold' onClick={handleShow}>{'اضافة ملاحظة'}</Button>
            {/* Add Notes */}
            <Modal show={show} onHide={handleClose} data-bs-theme={'dark'}>
              <Modal.Header>
                <Modal.Title>اضافة الملاحظات</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-container">
                  <form className="form">
                    <Col className="form-group">
                      <input name="notes" id="notes" type="text" placeholder=' اضافة ملاحطة ' onChange={(e) => setNoteName(e.target.value)} />
                    </Col>
                  </form>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger border shadow" onClick={handleClose}>
                  اغلاق
                </Button>
                <Button variant="dark border shadow" onClick={(e) => handleAddNotes(e)}>
                  اضافة
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
          <div className="d-flex flex-column gap-2">
            <p>  الملاحطات: </p>
            {
              user.data?.clinicalExamination.length > 0 ?
                user.data?.clinicalExamination.map((data) => (
                  <div key={data._id} className="d-flex flex-wrap align-items-center justify-content-between second-bg shadow rounded-4 p-2 fs-6">

                    <p>
                      {data.notes}
                    </p>

                    <div className='text-center'>
                      <span onClick={(e) => handleShowEdit(data.notes)} role="button"><RiFileEditFill size={25} /></span> {" "}
                      <span role="button" onClick={(e) => handleDeleteNotes(e, data._id)}><MdDeleteSweep size={30} /></span>

                      {/* Update Notes */}
                      <Modal show={showEdit} onHide={handleCloseEdit} data-bs-theme={'dark'}>
                        <Modal.Header>
                          <Modal.Title>تعديل الملاحظات</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="form-container">
                            <form className="form">
                              <Col className="form-group">
                                <input name="notes" id="notes" type="text" placeholder=' تعديل ملاحطة ' value={noteName}
                                  onChange={(e) => setNoteName(e.target.value)}
                                />
                              </Col>
                            </form>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="danger border shadow" onClick={handleCloseEdit}>
                            اغلاق
                          </Button>
                          <Button variant="dark border shadow" onClick={(e) => handleEditNotes(e, data._id)}>
                            حفظ التعديلات
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                )) : <p className='text-center text-effect'>لا يوجد اي ملاحظات حتي الان !</p>
            }
          </div>

        </div>


      </Col>
      <Col md={6}>
        {/* All treatmentsDetails */}
        {
          user.data && user.data?.treatmentsDetails.length > 0 &&
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
                          </tr>
                        ))
                        : <tr><td colSpan={5} className='text-center fs-5 fw-bold'>لا يوجد أي تفاصيل</td></tr>
                      : <tr><td colSpan={5} className='text-center fs-5 fw-bold'>تحميل التفاصيل...</td></tr>
                  }
                </tbody>
              </Table>
            </div>
          </div>
        }

        {/* All TreatmentsPlan */}
        {
          user.data && user.data?.treatmentsPlan.length > 0 &&
          <div className="fs-5 mb-4">
            <div className="fs-4 mb-3">
              خطط العلاج :
            </div>
            <div className="table-responsive">
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>اسم العلاج</th>
                    <th>طبيب الاسنان</th>
                    <th>صورة العلاج</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    loading ?
                      user.data && user.data?.treatmentsPlan.length > 0 ?
                        user.data?.treatmentsPlan.map((data, index) => (
                          <tr key={data._id}>
                            <td>{index + 1}</td>
                            <td>{data.treatments}</td>
                            <td>{data.dentist}</td>
                            <td>
                              <ReactImageGallery
                                showPlayButton={false}
                                items={[{ original: data.image }]}
                                lazyLoad={true}
                              /></td>
                          </tr>
                        ))
                        : <tr><td colSpan={4} className='text-center fs-5 fw-bold'>لا يوجد أي خطط</td></tr>
                      : <tr><td colSpan={4} className='text-center fs-5 fw-bold'>تحميل الخطط...</td></tr>
                  }
                </tbody>
              </Table>
            </div>
          </div>
        }

        {/* All currentMedications */}
        {
          user.data && user.data?.currentMedications.length > 0 &&
          <div className="fs-5 mb-4">
            <div className="fs-4 mb-3">
              الأدوية الحالية :
            </div>
            <div className="table-responsive">
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>اسم الدواء</th>
                    <th>الجرعة</th>
                    <th>عدد التكرار</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    loading ?
                      user.data && user.data?.currentMedications.length > 0 ?
                        user.data?.currentMedications.map((data, index) => (
                          <tr key={data._id}>
                            <td>{index + 1}</td>
                            <td>{data.name}</td>
                            <td>{data.dose}</td>
                            <td>{data.frequency}</td>
                          </tr>
                        ))
                        : <tr><td colSpan={4} className='text-center fs-5 fw-bold'>لا يوجد أي أدوية</td></tr>
                      : <tr><td colSpan={4} className='text-center fs-5 fw-bold'>تحميل الأدوية...</td></tr>
                  }
                </tbody>
              </Table>
            </div>
          </div>

        }

        {/* All treatmentsHistory */}
        {
          user.data && user.data?.treatmentsHistory.length > 0 &&
          <div className="fs-5 mb-4">
            <div className="fs-4 mb-3">
              التاريخ المرضي :
            </div>
            <div className="table-responsive">
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>النوع</th>
                    <th>المادة المستخدمة</th>
                    <th>رقم السنة</th>
                    <th>التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    loading ?
                      user.data && user.data?.treatmentsHistory.length > 0 ?
                        user.data?.treatmentsHistory.map((data, index) => (
                          <tr key={data._id}>
                            <td>{index + 1}</td>
                            <td>{data.historyType}</td>
                            <td>{data.material}</td>
                            <td>{data.toothNumber}</td>
                            <td>{DateFormate(data.date)}</td>
                          </tr>
                        ))
                        : <tr><td colSpan={5} className='text-center fs-5 fw-bold'>لا يوجد أي تاريخ مرضي</td></tr>
                      : <tr><td colSpan={5} className='text-center fs-5 fw-bold'>تحميل التاريخ المرضي...</td></tr>
                  }
                </tbody>
              </Table>
            </div>
          </div>
        }
      </Col>
    </Row>
  )
}

export default UserDetails
