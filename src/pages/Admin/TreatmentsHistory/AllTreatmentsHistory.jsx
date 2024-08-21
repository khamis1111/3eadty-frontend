import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { FaUserEdit } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import { DeleteData } from '../../../api/Axios/useDeleteData';
import { EditData } from '../../../api/Axios/useEditData';
import { GetData } from '../../../api/Axios/useGetData';
import { PostData } from '../../../api/Axios/usePostData';
import MainButton from '../../../components/MainButton';
import { DateFormate } from '../../../utils/DateFormate';
import notify from '../../../utils/useToastify';

const AllTreatmentsHistory = () => {
    const { id } = useParams()

    const [showAdd, setShowAdd] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [loading, setLoading] = useState(false)

    const [user, setUser] = useState()
    const [editdId, setEditdId] = useState(0)

    const [historyType, setHistoryType] = useState()
    const [material, setMaterial] = useState()
    const [toothNumber, setToothNumber] = useState()
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

    const handleShowEdit = (historyId) => {
        setShowEdit(true)
        setEditdId(historyId)

        const historyData = user.data.treatmentsHistory.filter((user) => user._id === historyId)
        setHistoryType(historyData[0].historyType)
        setMaterial(historyData[0].material)
        setToothNumber(historyData[0].toothNumber)
        setDate(historyData[0].date)
    }

    const handleAddHistory = (e) => {
        e.preventDefault()

        PostData(`/api/v1/treatments/history/${id}`, {
            historyType,
            material,
            toothNumber,
            date
        }).then(res => {
            notify('تمت الاضافة بنجاح', 'success')
            GetUser()
            setShowAdd(false)
            setHistoryType()
            setMaterial()
            setToothNumber()
            setDate()
        }).catch(err => {
            console.log(err)
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
        })
    }

    const handleEditHistory = (e) => {
        e.preventDefault()

        EditData(`/api/v1/treatments/history/${id}`, {
            docId: editdId,
            historyType,
            material,
            toothNumber,
            date
        }).then(res => {
            notify('تم التعديل بنجاح', 'success')
            GetUser()
            setShowEdit(false)
            setHistoryType()
            setMaterial()
            setToothNumber()
            setDate()
        }).catch(err => {
            console.log(err)
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
        })
    }

    const handleDeleteHistory = (e, historyId) => {
        e.preventDefault()

        DeleteData(`/api/v1/treatments/history/${id}`, {
            docId: historyId
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
                <MainButton name={'اضافة تاريخ مرضي'} onClick={() => setShowAdd(!showAdd)} />
            </div>

            {/* All TreatmentsHistory */}
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
                                <th>أخري...</th>
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
                                                <td className='d-flex flex-wrap justify-content-center gap-3'>
                                                    <Button variant='success' onClick={(e) => handleShowEdit(data._id)}>تعديل</Button>
                                                    <Button variant='danger' onClick={(e) => handleDeleteHistory(e, data._id)}>حذف</Button>
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

            {/* Add TreatmentsHistory */}
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
                                    <label htmlFor="historyType">
                                        نوع المرض
                                    </label>
                                    <input required name="historyType" id="historyType" type="text" placeholder=' نوع المرض '
                                        onChange={(e) => setHistoryType(e.target.value)}

                                    />
                                </Col>
                                <Col className="form-group">
                                    <label htmlFor="material">
                                        المادة
                                    </label>
                                    <input name="material" id="material" type="text" placeholder=' المادة '
                                        onChange={(e) => setMaterial(e.target.value)}

                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col className="form-group">
                                    <label htmlFor="toothNumber">
                                        رقم السنة
                                    </label>
                                    <input name="toothNumber" id="toothNumber" type="number" placeholder=' رقم السنة '
                                        onChange={(e) => setToothNumber(e.target.value)}

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
                                <MainButton name={'اضافة'} onClick={(e) => handleAddHistory(e)} />
                            </div>
                        </form>
                    </div>
                </div>
            }

            {/* Edit TreatmentsHistory */}
            {
                showEdit &&
                <div className="fs-5 mb-4">
                    <div className="fs-4 mb-3">
                        تعديل {historyType} :
                    </div>

                    <div className="form-container">
                        <form className="form">
                            <Row>
                                <Col className="form-group">
                                    <label htmlFor="historyType-e">
                                        نوع المرض
                                    </label>
                                    <input required name="historyType-e" id="historyType-e" type="text" placeholder=' نوع المرض '
                                        value={historyType} onChange={(e) => setHistoryType(e.target.value)}
                                    />
                                </Col>
                                <Col className="form-group">
                                    <label htmlFor="material-e">
                                        المادة
                                    </label>
                                    <input name="material-e" id="material-e" type="text" placeholder=' المادة '
                                        value={material} onChange={(e) => setMaterial(e.target.value)}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col className="form-group">
                                    <label htmlFor="toothNumber-e">
                                        رقم السنة
                                    </label>
                                    <input name="toothNumber-e" id="toothNumber-e" type="number" placeholder=' رقم السنة '
                                        value={toothNumber} onChange={(e) => setToothNumber(e.target.value)}
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
                                <MainButton name={'تعديل'} onClick={(e) => handleEditHistory(e)} />
                            </div>
                        </form>
                    </div>
                </div>
            }
        </Col>
    )
}

export default AllTreatmentsHistory
