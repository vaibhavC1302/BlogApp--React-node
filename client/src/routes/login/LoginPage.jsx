import React from 'react'
import { SignIn } from '@clerk/clerk-react';
import styles from "./loginPage.module.css";

const LoginPage = () => {
    return (
        <div className={styles.container}>
            <SignIn signUpUrl='/register' />

        </div>
    )
}

export default LoginPage