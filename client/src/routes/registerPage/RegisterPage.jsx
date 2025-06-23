import React from 'react'
import { SignUp } from '@clerk/clerk-react'
import styles from "./registerPage.module.css"


const RegisterPage = () => {
    return (
        <div className={styles.container}>
            <SignUp signInUrl='/login' />
        </div>
    )
}

export default RegisterPage