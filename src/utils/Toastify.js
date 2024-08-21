import React, { useState } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'

const Toastify = ({ title, desc, delay }) => {
    const [show, setShow] = useState()
    return (
        <ToastContainer position='top-end' className='mt-5'>
            <Toast onClose={() => setShow(false)} show={show} delay={delay} autohide data-bs-theme="dark">
                <Toast.Header>
                    <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                    />
                    <strong className="me-auto">{title}</strong>
                    <small>Now</small>
                </Toast.Header>
                <Toast.Body>{desc}</Toast.Body>
            </Toast>
        </ToastContainer>
    )
}

export default Toastify
