import React from 'react'
import Button from './Button'
import styles from './Navbar.module.scss'

export function Navbar(props) {
    return (
        <div className={styles.container}>
            <a
                href="#"
                primary={props.selected == 'publish'}
                onClick={props.nextDisplay.bind(this, 'publish')}
            >
                Publish
            </a>
            <Button
                primary={props.selected == 'search'}
                onClick={props.nextDisplay.bind(this, 'search')}
            >
                Search
            </Button>

            <Button
                primary={props.selected == 'wallet'}
                onClick={props.nextDisplay.bind(this, 'wallet')}
            >
                Wallet
            </Button>
        </div>
    )
}
