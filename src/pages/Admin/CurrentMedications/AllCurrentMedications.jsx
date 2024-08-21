import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { FaUserEdit } from "react-icons/fa";
import { useParams } from 'react-router-dom'
import MainButton from '../../../components/MainButton';
import { GetData } from '../../../api/Axios/useGetData';
import notify from '../../../utils/useToastify';
import { DeleteData } from '../../../api/Axios/useDeleteData';
import { PostData } from '../../../api/Axios/usePostData';
import { EditData } from '../../../api/Axios/useEditData';

const AllCurrentMedications = () => {
    const { id } = useParams()
    const [showAdd, setShowAdd] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [loading, setLoading] = useState(false)

    const [user, setUser] = useState()
    const [editdId, setEditdId] = useState(0)

    const [name, setName] = useState()
    const [dose, setDose] = useState()
    const [frequency, setFrequency] = useState()

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

    const handleShowEdit = (medicationId) => {
        setShowEdit(true)
        setEditdId(medicationId)

        const medicationData = user.data.currentMedications.filter((user) => user._id === medicationId)
        setName(medicationData[0].name)
        setDose(medicationData[0].dose)
        setFrequency(medicationData[0].frequency)
    }

    const handleAddMedications = (e) => {
        e.preventDefault()

        PostData(`/api/v1/medication/${id}`, {
            name,
            dose,
            frequency
        }).then(res => {
            notify('تمت الاضافة بنجاح', 'success')
            GetUser()
            setShowAdd(false)
            setName()
            setDose()
            setFrequency()
        }).catch(err => {
            console.log(err)
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
        })
    }

    const handleEditMedications = (e) => {
        e.preventDefault()

        EditData(`/api/v1/medication/${id}`, {
            docId: editdId,
            name,
            dose,
            frequency
        }).then(res => {
            notify('تم التعديل بنجاح', 'success')
            GetUser()
            setShowEdit(false)
            setName()
            setDose()
            setFrequency()
        }).catch(err => {
            console.log(err)
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
        })
    }

    const handleDeleteMedications = (e, medicationId) => {
        e.preventDefault()

        DeleteData(`/api/v1/medication/${id}`, {
            docId: medicationId
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
                <MainButton name={'اضافة دواء'} onClick={() => setShowAdd(!showAdd)} />
            </div>

            {/* All Medications */}
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
                                <th>أخري...</th>
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
                                                <td className='d-flex flex-wrap justify-content-center gap-3'>
                                                    <Button variant='success' onClick={(e) => handleShowEdit(data._id)}>تعديل</Button>
                                                    <Button variant='danger' onClick={(e) => handleDeleteMedications(e, data._id)}>حذف</Button>
                                                </td>
                                            </tr>
                                        ))
                                        : <tr><td colSpan={5} className='text-center fs-5 fw-bold'>لا يوجد أي أدوية</td></tr>
                                    : <tr><td colSpan={5} className='text-center fs-5 fw-bold'>تحميل الأدوية...</td></tr>
                            }
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* Add Medications */}
            {
                showAdd &&
                <div className="fs-5 mb-4">
                    <div className="fs-4 mb-3">
                        اضافة دواء جديد :
                    </div>

                    <div className="form-container">
                        <form className="form">
                            <Row>
                                <Col className="form-group">
                                    <label htmlFor="name">
                                        اسم الدواء
                                    </label>
                                    <input required name="name" id="name" type="text" placeholder=' اسم الدواء '
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Col>
                                <Col className="form-group">
                                    <label htmlFor="dose">
                                        الجرعة
                                    </label>
                                    <input name="dose" id="dose" type="text" placeholder='الجرعة '
                                        onChange={(e) => setDose(e.target.value)}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col className="form-group">
                                    <label htmlFor="frequency">
                                        عدد التكرار
                                    </label>
                                    <input name="frequency" id="frequency" type="text" placeholder=' عدد التكرار '
                                        onChange={(e) => setFrequency(e.target.value)}
                                    />
                                </Col>
                                <div className='text-start mt-3'>
                                    <MainButton name={'اضافة'} onClick={(e) => handleAddMedications(e)} />
                                </div>
                            </Row>

                        </form>
                    </div>
                </div>
            }

            {/* Edit Medications */}
            {
                showEdit &&
                <div className="fs-5 mb-4">
                    <div className="fs-4 mb-3">
                        تعديل {name} :
                    </div>

                    <div className="form-container">
                        <form className="form">
                            <Row>
                                <Col className="form-group">
                                    <label htmlFor="name-e">
                                        اسم الدواء
                                    </label>
                                    <input required name="name-e" id="name-e" type="text" placeholder=' اسم الدواء '
                                        value={name} onChange={(e) => setName(e.target.value)}
                                    />
                                </Col>
                                <Col className="form-group">
                                    <label htmlFor="dose-e">
                                        الجرعة
                                    </label>
                                    <input name="dose-e" id="dose-e" type="text" placeholder='الجرعة '
                                        value={dose} onChange={(e) => setDose(e.target.value)}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col className="form-group">
                                    <label htmlFor="frequency-e">
                                        عدد التكرار
                                    </label>
                                    <input name="frequency-e" id="frequency-e" type="text" placeholder=' عدد التكرار '
                                        value={frequency} onChange={(e) => setFrequency(e.target.value)}
                                    />
                                </Col>
                                <div className='text-start mt-3'>
                                    <MainButton name={'تعديل'} onClick={(e) => handleEditMedications(e)} />
                                </div>
                            </Row>

                        </form>
                    </div>
                </div>
            }
        </Col>
    )
}

export default AllCurrentMedications
