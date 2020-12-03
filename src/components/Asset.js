import React from 'react'
import { ReactComponent as Jellyfish } from '@oceanprotocol/art/jellyfish/jellyfish-full.svg'
import Dotdotdot from 'react-dotdotdot'
import styles from './Asset.module.scss'

function parseData(raw) {
    let data = raw.service[0].attributes.main
    if (raw.service[0].attributes.additionalInformation) {
        data.description =
            raw.service[0].attributes.additionalInformation.description
    }
    data.id = raw.id
    data.title = raw.service[0].attributes.main.name
    return data
}

const Asset = props => {
    let { data } = props
    let _data = parseData(data)
    let title = _data.title
    return (
        <>
            <div className={styles.container}>
                <div className={styles.textContainer}>
                    <div className={styles.titleContainer}>
                        {' '}
                        <a
                            className={styles.title}
                            target="_blank"
                            href={`https://market.oceanprotocol.com/asset/${_data.id}`}
                        >
                            {title}
                        </a>{' '}
                    </div>
                    <hr />
                    <div className={styles.metadata}>type : {_data.type}</div>
                    <Dotdotdot clamp={1}>
                        <div className={styles.metadata}>
                            author : {_data.author}
                        </div>
                    </Dotdotdot>
                    <div className={styles.metadata}>price : {_data.price}</div>
                    <div className={styles.metadata}>
                        total files : {_data.files.length}
                    </div>
                    <br />
                    <a
                        className="link"
                        target="_blank"
                        href={`https://market.oceanprotocol.com/asset/${_data.id}`}
                    >
                        See More Details{' '}
                    </a>
                </div>
            </div>
            <hr />
        </>
    )
}

export default Asset
