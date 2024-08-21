import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { FaUserEdit } from "react-icons/fa";
import MainButton from '../../../components/MainButton';
import notify from '../../../utils/useToastify';
import { useNavigate, useParams } from 'react-router-dom';
import { GetData } from '../../../api/Axios/useGetData';
import { EditData } from '../../../api/Axios/useEditData';

const EditUser = ({ getAllUsers }) => {
    const navigate = useNavigate()
    const { id } = useParams()

    const [name, setName] = useState()
    const [gender, setGender] = useState()
    const [age, setAge] = useState()
    const [phone, setPhone] = useState()
    const [price, setPrice] = useState(0)
    const [paid, setPaid] = useState(0)
    const [medicalConditions, setMedicalConditions] = useState()
    const [allergies, setAllergies] = useState()
    const [currentComplaints, setCurrentComplaints] = useState()
    const [recommendations, setRecommendations] = useState()

    const GetUser = () => {
        GetData(`/api/v1/userInfo/${id}`).then((res) => {
            const data = res.data.data
            setName(data.name)
            setGender(data.gender)
            setAge(data.age)
            setPhone(data.phone)
            setPrice(data.price)
            setPaid(data.paid)
            setMedicalConditions(data.medicalConditions)
            setAllergies(data.allergies)
            setCurrentComplaints(data.currentComplaints)
            setRecommendations(data.recommendations)
        }).catch((err) => {
            console.log(err)
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
        })
    }

    useEffect(() => {
        GetUser()
    }, [])

    const handleUpdateUser = (e) => {
        e.preventDefault()

        EditData(`/api/v1/userInfo/${id}`, {
            name,
            gender,
            age,
            phone,
            price,
            paid,
            medicalConditions,
            allergies,
            currentComplaints,
            recommendations
        }).then((res) => {
            console.log(res)
            notify('تم التعديل بنجاح', 'success')
            navigate(`/userDetails/${id}`)
            getAllUsers()
        }).catch((err) => {
            console.log(err)
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
        })
    }

    return (
        <Col lg={6}>
            <div className="mb-5">
                <div className="title flex-wrap gap-3 fs-1 mb-5">
                    <FaUserEdit size={50} /> تعديل بيانات: {name?.split(' ')[0]}
                </div>

                <div className="form-container">
                    <form className="form">
                        <Row>
                            <Col className="form-group">
                                <label htmlFor="name">
                                    اسم المريض
                                </label>
                                <input name="name" id="name" type="text" placeholder=' اسم المريض '
                                    value={name} onChange={(e) => setName(e.target.value)}
                                />
                            </Col>
                            <Col className="form-group">
                                <label htmlFor="gender">
                                    نوع المريض
                                </label>
                                <select className="form-group-select" id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                                    <option selected hidden>النوع</option>
                                    <option value="male">ذكر</option>
                                    <option value="female">انثي</option>
                                </select>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="form-group">
                                <label htmlFor="age">
                                    السن
                                </label>
                                <input name="age" id="age" type="number" placeholder=' السن '
                                    value={age} onChange={(e) => setAge(e.target.value)}
                                />
                            </Col>
                            <Col className="form-group">
                                <label htmlFor="phone">
                                    رقم الهاتف
                                </label>
                                <input name="phone" id="phone" type="number" placeholder=' رقم الهاتف '
                                    value={phone} onChange={(e) => setPhone(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="form-group">
                                <label htmlFor="price">
                                    السعر
                                </label>
                                <input name="price" id="price" type="number" placeholder=' السعر '
                                    value={price} onChange={(e) => setPrice(e.target.value)}
                                />
                            </Col>
                            <Col className="form-group">
                                <label htmlFor="paid">
                                    المدفوع حاليا
                                </label>
                                <input name="paid" id="paid" type="number" placeholder=' المدفوع حاليا '
                                    value={paid} onChange={(e) => setPaid(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="form-group">
                                <label htmlFor="medicalConditions">
                                    الحالات الطبية
                                </label>
                                <input name="medicalConditions" id="medicalConditions" type="text" placeholder=' الحالات الطبية '
                                    value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)}
                                />
                            </Col>
                            <Col className="form-group">
                                <label htmlFor="allergies">
                                    الحساسية
                                </label>
                                <input name="allergies" id="allergies" type="text" placeholder=' الحساسية '
                                    value={allergies} onChange={(e) => setAllergies(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Col className="form-group">
                            <label htmlFor="currentComplaints">
                                الشكاوى الحالية
                            </label>
                            <input name="currentComplaints" id="currentComplaints" type="text" placeholder=' الشكاوى الحالية '
                                value={currentComplaints} onChange={(e) => setCurrentComplaints(e.target.value)}
                            />
                        </Col>
                        <Col className="form-group">
                            <label htmlFor="recommendations">
                                توصيات الدكتور للمريض
                            </label>
                            <input name="recommendations" id="recommendations" type="text" placeholder=' توصيات الدكتور للمريض '
                                value={recommendations} onChange={(e) => setRecommendations(e.target.value)}
                            />
                        </Col>
                        <div className='text-start'>
                            <MainButton name={'تعديل'} onClick={(e) => handleUpdateUser(e)} />
                        </div>
                    </form>
                </div>
            </div>
        </Col>
    )
}

export default EditUser
