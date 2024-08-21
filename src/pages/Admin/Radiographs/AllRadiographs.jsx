import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { FaUserEdit } from 'react-icons/fa'
import ReactImageGallery from 'react-image-gallery'
import { useParams } from 'react-router-dom'
import { DeleteData } from '../../../api/Axios/useDeleteData'
import { EditData } from '../../../api/Axios/useEditData'
import { GetData } from '../../../api/Axios/useGetData'
import { PostData, PostDataImage } from '../../../api/Axios/usePostData'
import MainButton from '../../../components/MainButton'
import { DateFormate } from '../../../utils/DateFormate'
import notify from '../../../utils/useToastify'

const AllRadiographs = () => {
    const { id } = useParams()
    // For Disable Buttons
    const [loadingData, setLoadingData] = useState(false)
    // For Load Data
    const [loading, setLoading] = useState(false)
    // For Show Add & Edit
    const [showAdd, setShowAdd] = useState(false)
    const [showEdit, setShowEdit] = useState(false)

    const [user, setUser] = useState()
    const [editdId, setEditdId] = useState(0)
    // Radio Data
    const [radioType, setRadioType] = useState()
    const [scannerImg, setScannerImg] = useState([])
    const [toothNumber, setToothNumber] = useState()
    const [findings, setFindings] = useState()
    const [date, setDate] = useState()
    // Upload Imgs
    const [imgs, setImgs] = useState([]);
    const handleImg = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImgs = Array.from(e.target.files).map(file => URL.createObjectURL(file));
            setImgs(prevImgs => [...prevImgs, ...newImgs]);

            setScannerImg([...imgs, ...Array.from(e.target.files)]);
        }
    };
    // Get Info User
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
    // Add Radio
    const handleAddRadio = (e) => {
        e.preventDefault()
        setLoadingData(true)
        // Upload Multi Imges
        const uploadedUrls = [];
        Promise.all(
            scannerImg.map((imgs) => {
                const formDataImg = new FormData();
                formDataImg.append('image', imgs)
                return PostDataImage('https://api.imgbb.com/1/upload?key=4f4a682edac68442d7b34952d2d5b23c', formDataImg).then(res => {
                    console.log(res)
                    uploadedUrls.push(res.data.data.display_url);
                    setLoadingData(false)
                }).catch(err => {
                    notify(err, 'error')
                    setLoading(false)
                });
            })
        ).then(() => {
            // Add Radio
            PostData(`/api/v1/radio/${id}`, {
                radioType,
                scannerImg: uploadedUrls,
                toothNumber,
                findings,
                date
            }).then(res => {
                notify('تمت الاضافة بنجاح', 'success')
                GetUser()
                setShowAdd(false)
                setRadioType()
                setToothNumber()
                setScannerImg(null)
                setDate()
                setLoadingData(false)
            }).catch(err => {
                console.log(err)
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
            })
        })
    }
    // Edit Radio
    const handleShowEdit = (radioId) => {
        setShowEdit(true)
        setEditdId(radioId)

        const planData = user.data.radiographs.filter((user) => user._id === radioId)
        setRadioType(planData[0].radioType)
        setImgs(planData[0].scannerImg)
        setToothNumber(planData[0].toothNumber)
        setFindings(planData[0].findings)
        setDate(planData[0].date)
    }
    const handleEditRadio = (e) => {
        e.preventDefault()

        const uploadedUrls = [];
        setLoadingData(true)

        scannerImg && scannerImg.length > 0 ?
            // Upload Multi Imges
            Promise.all(
                scannerImg.map((imgs) => {
                    const formDataImg = new FormData();
                    formDataImg.append('image', imgs)
                    return PostDataImage('https://api.imgbb.com/1/upload?key=4f4a682edac68442d7b34952d2d5b23c', formDataImg).then(res => {
                        console.log(res)
                        uploadedUrls.push(res.data.data.display_url);
                        setLoadingData(false)
                    }).catch(err => {
                        notify(err, 'error')
                        setLoading(false)
                    });
                })
            ).then(() => {
                // Edit Radio
                EditData(`/api/v1/radio/${id}`, {
                    docId: editdId,
                    radioType,
                    scannerImg: uploadedUrls,
                    toothNumber,
                    findings,
                    date
                }).then(res => {
                    notify('تم التعديل بنجاح', 'success')
                    GetUser()
                    setShowEdit(false)
                    setRadioType()
                    setToothNumber()
                    setScannerImg(null)
                    setDate()
                    setLoadingData(false)
                }).catch(err => {
                    console.log(err)
                    notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
                })
            }) :
            // Edit Radio
            EditData(`/api/v1/radio/${id}`, {
                docId: editdId,
                radioType,
                scannerImg: imgs,
                toothNumber,
                findings,
                date
            }).then(res => {
                notify('تم التعديل بنجاح', 'success')
                GetUser()
                setShowEdit(false)
                setRadioType()
                setToothNumber()
                setScannerImg(null)
                setDate()
                setLoadingData(false)
            }).catch(err => {
                console.log(err)
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
            })
    }
    // DeleteRadio
    const handleDeleteRadio = (e, DetailsId) => {
        e.preventDefault()

        DeleteData(`/api/v1/radio/${id}`, {
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
                <MainButton name={'اضافة أشعة'} onClick={() => setShowAdd(!showAdd)} />
            </div>

            {/* All Radiographs */}
            <div className="fs-5 mb-4">
                <div className="fs-4 mb-3">
                    صور الأشعة السينية :
                </div>
                <div className="table-responsive">
                    <Table bordered variant="dark">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>نوع الاشعة</th>
                                <th>صور الاشعة</th>
                                <th>رقم السنة</th>
                                <th>النتائج</th>
                                <th>تاريخ الاشعة</th>
                                <th>أخري...</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ?
                                    user.data && user.data?.radiographs.length > 0 ?
                                        user.data?.radiographs.map((data, index) => (
                                            <tr key={data._id} style={{ background: '#212529' }}>
                                                <td>{index + 1}</td>
                                                <td>{data.radioType}</td>
                                                <td className='d-flex'>
                                                    {
                                                        data.scannerImg.map((imgs, index) => <ReactImageGallery
                                                            key={index}
                                                            showPlayButton={false}
                                                            items={
                                                                [{ original: imgs }]
                                                            }
                                                            lazyLoad={true}
                                                        />)
                                                    }
                                                </td>
                                                <td>{data.toothNumber}</td>
                                                <td>{data.findings}</td>
                                                <td>{DateFormate(data.date)}</td>
                                                <td className='d-flex flex-wrap justify-content-center gap-3'>
                                                    <Button variant='success' onClick={(e) => handleShowEdit(data._id)}>تعديل</Button>
                                                    <Button variant='danger' onClick={(e) => handleDeleteRadio(e, data._id)}>حذف</Button>
                                                </td>
                                            </tr>
                                        ))
                                        : <tr><td colSpan={7} className='text-center fs-5 fw-bold'>لا يوجد أي خطط</td></tr>
                                    : <tr><td colSpan={7} className='text-center fs-5 fw-bold'>تحميل الخطط...</td></tr>
                            }
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* Add Radiographs */}
            {
                showAdd &&
                <div className="fs-5 mb-4">
                    <div className="fs-4 mb-3">
                        اضافة أشعة جديدة:
                    </div>

                    <div className="form-container">
                        <form className="form">
                            <Row>
                                <Col className="form-group">
                                    <Col className="d-flex justify-content-center align-items-center">
                                        <div className="form-group">
                                            <label htmlFor="scannerImg" className='fs-5'> صور الاشعة : </label>
                                            <label htmlFor="scannerImg" className="custum-file-upload overflow-auto w-100">
                                                {
                                                    imgs.length > 0 ?
                                                        (
                                                            <div className='d-flex flex-wrap'>
                                                                {imgs.map((img, index) => (
                                                                    <img key={index} src={img} alt={`uploaded ${index}`} width={'20%'} height={'100%'} />
                                                                ))}
                                                            </div>
                                                        ) :
                                                        (
                                                            <>
                                                                <div className="icon">
                                                                    <svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" fill=""></path> </g></svg>
                                                                </div>
                                                                <div className="text">
                                                                    <span>Click to upload images</span>
                                                                </div>
                                                            </>
                                                        )
                                                }
                                                <input type="file" name="scannerImg" id="scannerImg" multiple hidden onChange={(e) => handleImg(e)} />
                                            </label>
                                        </div>
                                    </Col>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="form-group">
                                    <label htmlFor="radioType">
                                        نوع الاشعة
                                    </label>
                                    <input name="radioType" id="radioType" type="text" placeholder=' نوع الاشعة '
                                        onChange={(e) => setRadioType(e.target.value)}
                                    />
                                </Col>
                                <Col className="form-group">
                                    <label htmlFor="findings">
                                        النتائج
                                    </label>
                                    <input name="findings" id="findings" type="text" placeholder=' النتائج '
                                        onChange={(e) => setFindings(e.target.value)}
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
                                        تاريخ الاشعة
                                    </label>
                                    <input name="date" id="date" type="datetime-local" placeholder=' تاريخ الاشعة '
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </Col>
                            </Row>
                            <div className='text-start'>
                                <MainButton name={'اضافة'} onClick={(e) => handleAddRadio(e)} disabled={loadingData} />
                            </div>
                        </form>
                    </div>
                </div>
            }

            {/* Edit Radiographs */}
            {
                showEdit &&
                <div className="fs-5 mb-4">
                    <div className="fs-4 mb-3">
                        تعديل {radioType} :
                    </div>

                    <div className="form-container">
                        <form className="form">
                            <Row>
                                <Col className="form-group">
                                    <Col className="d-flex justify-content-center align-items-center">
                                        <div className="form-group">
                                            <label htmlFor="treatmentImg" className='fs-5'> صور الاشعة : </label>
                                            <label htmlFor="scannerImg" className="custum-file-upload overflow-auto w-100">
                                                {
                                                    imgs.length > 0 ?
                                                        (
                                                            <div className='d-flex flex-wrap'>
                                                                {imgs.map((img, index) => (
                                                                    <img key={index} src={img} alt={`uploaded ${index}`} width={'20%'} height={'100%'} />
                                                                ))}
                                                            </div>
                                                        ) :
                                                        (
                                                            <>
                                                                <div className="icon">
                                                                    <svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" fill=""></path> </g></svg>
                                                                </div>
                                                                <div className="text">
                                                                    <span>Click to upload images</span>
                                                                </div>
                                                            </>
                                                        )
                                                }
                                                <input type="file" name="scannerImg" id="scannerImg" multiple hidden onChange={(e) => handleImg(e)} />
                                            </label>
                                        </div>
                                    </Col>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="form-group">
                                    <label htmlFor="radioType-e">
                                        نوع الاشعة
                                    </label>
                                    <input name="radioType-e" id="radioType-e" type="text" placeholder=' نوع الاشعة '
                                        value={radioType} onChange={(e) => setRadioType(e.target.value)}
                                    />
                                </Col>
                                <Col className="form-group">
                                    <label htmlFor="findings-e">
                                        النتائج
                                    </label>
                                    <input name="findings-e" id="findings-e" type="text" placeholder=' النتائج '
                                        value={findings} onChange={(e) => setFindings(e.target.value)}
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
                                        تاريخ الاشعة
                                    </label>
                                    <input name="date-e" id="date-e" type="datetime-local" placeholder=' تاريخ الاشعة '
                                        value={moment(date).locale('en').format('YYYY-MM-DDTHH:mm')} onChange={(e) => setDate(e.target.value)}
                                    />
                                </Col>
                            </Row>
                            <div className='text-start'>
                                <MainButton name={'تعديل'} onClick={(e) => handleEditRadio(e)} disabled={loadingData} />
                            </div>
                        </form>
                    </div>
                </div>
            }
        </Col>
    )
}

export default AllRadiographs
