import React, { PureComponent } from 'react'
import { ReactComponent as Logo } from '@oceanprotocol/art/logo/logo-white.svg'
import styles from './Header.module.scss'

export default class Header extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <header className={styles.appHeader}>
                <Logo />
                <h3 className={styles.topLinks}>Data Wallet</h3>
            </header>
        )
    }
}
