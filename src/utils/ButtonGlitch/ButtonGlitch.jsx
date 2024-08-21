import React from 'react'
import './ButtonGlitch.css'
const ButtonGlitch = ({ name, handle, loading = false, width = 'auto' }) => {
    return (
        <button disabled={loading} className='btn-glitsh' onClick={handle} style={{ width: width }}>
            {
                loading ? "جاري التحميل...." : name
            }
        </button>
    )
}

export default ButtonGlitch
