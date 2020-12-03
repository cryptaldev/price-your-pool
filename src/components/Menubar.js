import React, { useState } from 'react'
import { ReactComponent as SearchIcon } from '../assets/search.svg'
import { ReactComponent as WalletIcon } from '../assets/wallet.svg'
import { ReactComponent as SettingsIcon } from '../assets/settings.svg'
import Menu from 'cheeseburger-menu'
import MenuIcon from 'react-hamburger-menu'
import styles from './Menubar.module.scss'

export function MenuBar({ nextToDisplay }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    function handleMenuSelect(item) {
        setIsMenuOpen(false)
        nextToDisplay(item)
    }

    return (
        <>
            <Menu
                isOpen={isMenuOpen}
                topOffset="170px"
                bottomOffset="150px"
                noShadow={true}
                width="100px"
                transitionTime={0.3}
                closeCallback={() => setIsMenuOpen(false)}
                overlayClassName={styles.menubarOverlay}
                outerClassName={styles.menubarOuter}
                innerClassName={styles.menubarInner}
                className={styles.menubar}
            >
                <div className={styles.menuContainer}>
                    <ul className={styles.menuList}>
                        <li className={styles.menuItem}>
                            <SearchIcon
                                id="Explore"
                                className={styles.searchIcon}
                                onClick={() => handleMenuSelect('Explore')}
                            />
                            Explore
                        </li>
                        <li className={styles.menuItem}>
                            <WalletIcon
                                className={styles.walletIcon}
                                onClick={() => handleMenuSelect('Manage')}
                            />
                            Manage
                        </li>
                        <li className={styles.menuItem}>
                            <SettingsIcon
                                className={styles.settingsIcon}
                                onClick={() => handleMenuSelect('Settings')}
                            />
                            Settings
                        </li>
                    </ul>
                </div>
            </Menu>
            <MenuIcon
                isOpen={isMenuOpen}
                menuClicked={() => setIsMenuOpen(!isMenuOpen)}
                width={32}
                height={24}
                strokeWidth={3}
                rotate={0}
                color="black"
                borderRadius={0}
                animationDuration={0.5}
                className={styles.menuIcon}
            />
        </>
    )
}
