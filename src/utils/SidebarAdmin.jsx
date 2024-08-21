import React from 'react'
import { Button, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import notify from './useToastify'

const SdebarAdmin = () => {
    const navigate = useNavigate()

    const handelLogin = (e) => {
        e.preventDefault()
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        navigate('/')
        notify('Logout SuccessFully', 'success')
    }

    return (
        <>
            <Col lg={3} className='left shadow-sm rounded-4 p-3 d-flex flex-column text-center gap-3 h-100'>
                <Link to={'/admin'}><p className='border px-4 py-2 shadow'>Personal Data</p></Link>
                <Link to={'/admin/work'}><p className='border px-4 py-2 shadow'>Work Videos</p></Link>
                {/* <Link to={'/admin/diary'}><p className='border px-4 py-2 shadow'>Diary Youtube</p></Link> */}
                <Link to={'/admin/addReels'}><p className='border px-4 py-2 shadow'>Add Reels</p></Link>
                <Link to={'/admin/allWork'}><p className='border px-4 py-2 shadow'>All Work Videos</p></Link>
                <Link to={'/admin/allContact'}><p className='border px-4 py-2 shadow'>All Contacts</p></Link>
                <Link to={'/admin/reels'}><p className='border px-4 py-2 shadow'>All Reels</p></Link>
                <Button variant='danger' onClick={(e) => handelLogin(e)}>Log Out</Button>
            </Col>
        </>
    )
}

export default SdebarAdmin
