import React from 'react'
import { Button } from 'react-bootstrap'

const MainButton = ({ name, bg = 'main-bg', onClick, disabled }) => {
    return (
        <>
            <Button type='submit' disabled={disabled} className={`${bg} border-0 px-5 py-2 shadow fs-5 fw-bold`} onClick={onClick}>

                {
                    disabled ? 'جاري التحميل....' : name
                }

            </Button>
        </>
    )
}

export default MainButton
