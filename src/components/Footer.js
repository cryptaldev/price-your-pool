import React from 'react'
import styles from './Footer.module.scss'
import { social } from '../config'

const Footer = () => (
    <footer className={styles.footer}>
        <small>
            &copy; {new Date().getFullYear()} <a href={social.site}>DKDEV14</a>{' '}
            &mdash; All Rights Reserved
        </small>
    </footer>
)

export default Footer
