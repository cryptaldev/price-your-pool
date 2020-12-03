import React from 'react'
import Input from './Form/Input'
import styles from './NetworkSelector.module.scss'

const networks = [
    { label: 'Main Network', value: 'mainnet' },
    { label: 'Rinkeby Network', value: 'rinkeby' }
]

export function NetworkSelector(props) {
    return (
        <div className={styles.container}>
            <Input
                tag="select"
                options={networks.slice()}
                name="network"
                onChange={e => props.setNetwork(e.target.value)}
            />
        </div>
    )
}
