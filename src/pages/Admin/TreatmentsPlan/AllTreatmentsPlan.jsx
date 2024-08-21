import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { FaUserEdit } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import { DeleteData } from '../../../api/Axios/useDeleteData';
import { EditData } from '../../../api/Axios/useEditData';
import { GetData } from '../../../api/Axios/useGetData';
import { PostData, PostDataImage } from '../../../api/Axios/usePostData';
import MainButton from '../../../components/MainButton';
import { DateFormate } from '../../../utils/DateFormate';
import UploadImg from '../../../utils/UploadImg/UploadImg';
import notify from '../../../utils/useToastify';
import ImageGallery from "react-image-gallery";

const AllTreatmentsPlan = () => {
    const { id } = useParams()

    const [loadingData, setLoadingData] = useState(false)

    const [showAdd, setShowAdd] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [loading, setLoading] = useState(false)

    const [user, setUser] = useState()
    const [editdId, setEditdId] = useState(0)

    const [treatments, setTreatments] = useState()
    const [dentist, setDentist] = useState()
    const [imgSelector, setImgSelector] = useState(null)
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

    const handleShowEdit = (planId) => {
        setShowEdit(true)
        setEditdId(planId)

        const planData = user.data.treatmentsPlan.filter((user) => user._id === planId)
        setTreatments(planData[0].treatments)
        setDentist(planData[0].dentist)
        setImgSelector(planData[0].image)
        setDate(planData[0].date)
    }

    const handleAddPlan = (e) => {
        e.preventDefault()
        setLoadingData(true)
        const formDataImg = new FormData();
        formDataImg.append('image', imgSelector);
        PostDataImage('https://api.imgbb.com/1/upload?key=4f4a682edac68442d7b34952d2d5b23c', formDataImg).then(res => {
            PostData(`/api/v1/treatments/plan/${id}`, {
                treatments,
                dentist,
                image: res.data.data.display_url,
                date
            }).then(res => {
                notify('تمت الاضافة بنجاح', 'success')
                GetUser()
                setShowAdd(false)
                setTreatments()
                setDentist()
                setImgSelector(null)
                setDate()
                setLoadingData(false)
            }).catch(err => {
                console.log(err)
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
            })
        }).catch(err => {
            notify(err, 'error')
            setLoading(false)
        });
    }

    const handleEditPlan = (e) => {
        e.preventDefault()
        setLoadingData(true)
        const formDataImg = new FormData();
        formDataImg.append('image', imgSelector);
        PostDataImage('https://api.imgbb.com/1/upload?key=4f4a682edac68442d7b34952d2d5b23c', formDataImg).then(res => {
            EditData(`/api/v1/treatments/plan/${id}`, {
                docId: editdId,
                treatments,
                dentist,
                image: res.data.data.display_url,
                date
            }).then(res => {
                notify('تم التعديل بنجاح', 'success')
                GetUser()
                setShowEdit(false)
                setTreatments()
                setDentist()
                setImgSelector(null)
                setDate()
                setLoadingData(false)
            }).catch(err => {
                console.log(err)
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
            })
        }).catch(err => {
            notify(err, 'error')
            setLoading(false)
        });
    }

    const handleDeletePlan = (e, DetailsId) => {
        e.preventDefault()

        DeleteData(`/api/v1/treatments/plan/${id}`, {
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
                <MainButton name={'اضافة خطة العلاج'} onClick={() => setShowAdd(!showAdd)} />
            </div>

            {/* All TreatmentsPlan */}
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
                                <th>التاريخ</th>
                                <th>أخري...</th>
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
                                                    <ImageGallery
                                                        showPlayButton={false}
                                                        items={[{ original: data.image }]}
                                                        lazyLoad={true}
                                                    />
                                                </td>
                                                <td>{DateFormate(data.date)}</td>
                                                <td className='d-flex flex-wrap justify-content-center gap-3'>
                                                    <Button variant='success' onClick={(e) => handleShowEdit(data._id)}>تعديل</Button>
                                                    <Button variant='danger' onClick={(e) => handleDeletePlan(e, data._id)}>حذف</Button>
                                                </td>
                                            </tr>
                                        ))
                                        : <tr><td colSpan={6} className='text-center fs-5 fw-bold'>لا يوجد أي خطط</td></tr>
                                    : <tr><td colSpan={6} className='text-center fs-5 fw-bold'>تحميل الخطط...</td></tr>
                            }
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* Add TreatmentsPlan */}
            {
                showAdd &&
                <div className="fs-5 mb-4">
                    <div className="fs-4 mb-3">
                        اضافة تاريخ مرضي جديد :
                    </div>

                    <div className="form-container">
                        <form className="form">
                            <Row>
                                <Col className="form-group">
                                    <Col className="d-flex justify-content-center align-items-center">
                                        <div className="form-group">
                                            <label htmlFor="treatmentImg" className='fs-5'>صورة العلاج : </label>
                                            <UploadImg type={'img'} setImgSelector={setImgSelector} imgSelector={imgSelector} />
                                        </div>
                                    </Col>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="form-group">
                                    <label htmlFor="treatments">
                                        اسم العلاج
                                    </label>
                                    <input name="treatments" id="treatments" type="text" placeholder=' اسم العلاج '
                                        onChange={(e) => setTreatments(e.target.value)}
                                    />
                                </Col>
                                <Col className="form-group">
                                    <label htmlFor="dentist">
                                        طبيب الاسنان
                                    </label>
                                    <input name="dentist" id="dentist" type="text" placeholder=' طبيب الاسنان '
                                        onChange={(e) => setDentist(e.target.value)}
                                    />
                                </Col>
                            </Row>
                            <Col className="form-group">
                                <label htmlFor="date">
                                    التاريخ
                                </label>
                                <input name="date" id="date" type="datetime-local" placeholder=' التاريخ '
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </Col>
                            <div className='text-start'>
                                <MainButton name={'اضافة'} onClick={(e) => handleAddPlan(e)} disabled={loadingData} />
                            </div>
                        </form>
                    </div>
                </div>
            }

            {/* Edit TreatmentsPlan */}
            {
                showEdit &&
                <div className="fs-5 mb-4">
                    <div className="fs-4 mb-3">
                        تعديل {treatments} :
                    </div>

                    <div className="form-container">
                        <form className="form">
                            <Row>
                                <Col className="form-group">
                                    <Col className="d-flex justify-content-center align-items-center">
                                        <div className="form-group">
                                            <label htmlFor="treatmentImg" className='fs-5'>صورة العلاج : </label>
                                            <UploadImg type={'img'} setImgSelector={setImgSelector} imgSelector={imgSelector} />
                                        </div>
                                    </Col>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="form-group">
                                    <label htmlFor="treatments">
                                        اسم العلاج
                                    </label>
                                    <input name="treatments" id="treatments" type="text" placeholder=' اسم العلاج '
                                        value={treatments} onChange={(e) => setTreatments(e.target.value)}
                                    />
                                </Col>
                                <Col className="form-group">
                                    <label htmlFor="dentist">
                                        طبيب الاسنان
                                    </label>
                                    <input name="dentist" id="dentist" type="text" placeholder=' طبيب الاسنان '
                                        value={dentist} onChange={(e) => setDentist(e.target.value)}
                                    />
                                </Col>
                            </Row>
                            <Col className="form-group">
                                <label htmlFor="date">
                                    التاريخ
                                </label>
                                <input name="date" id="date" type="datetime-local" placeholder=' التاريخ '
                                    value={moment(date).locale('en').format('YYYY-MM-DDTHH:mm')} onChange={(e) => setDate(e.target.value)}
                                />
                            </Col>
                            <div className='text-start'>
                                <MainButton name={'تعديل'} onClick={(e) => handleEditPlan(e)} disabled={loadingData} />
                            </div>
                        </form>
                    </div>
                </div>
            }
        </Col>
    )
}

export default AllTreatmentsPlan
