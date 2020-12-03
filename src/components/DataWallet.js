import React, { Component } from 'react'
import AssetList from './AssetList'
import Correct from './Correct'
import Incorrect from './Incorrect'
import Button from './Button'
import Input from '../components/Form/Input'
import Form from '../components/Form/Form'
import { ReactComponent as Settings } from '../assets/settings.svg'
import * as ethereumAddress from 'ethereum-address'
import styles from './DataWallet.module.scss'
import { WalletContext } from './WalletContext'

export default class DataWallet extends Component {
    static contextType = WalletContext

    constructor(props) {
        super(props)
        this.state = {
            inProgress: false,
            showData: false,
            showFailure: false,
            showSuccess: false,
            hideWalletForm: false,
            addressValid: false,
            address: localStorage.getItem('address') || '',
            data: [],
            formValid: true,
            formErrors: {
                address: ''
            }
        }
    }

    async componentDidMount() {
        if (ethereumAddress.isAddress(this.context.wallet.address)) {
            this.fetchDataAssets()
        }
    }

    showResults() {
        alert('showing data')
        this.setState({
            showData: true
        })
    }

    async fetchDataAssets() {
        this.setState({
            inProgress: true
        })

        try {
            const url = `https://aquarius.${this.context.network}.oceanprotocol.com/api/v1/aquarius/assets/ddo/query?text=${this.context.wallet.address}&offset=500`

            let encodedUrl = encodeURI(url)
            const response = await fetch(encodedUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            const { results } = await response.json()

            if (response.status !== 200) {
                this.setState({
                    inProgress: false,
                    showFailure: true,
                    showSuccess: false
                })
            } else {
                this.setState({
                    inProgress: false,
                    data: results.slice(),
                    showSuccess: true,
                    showFailure: false
                })
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    renderSearchSuccess() {
        return (
            <div>
                <Correct loadComplete={true} />
                <p>{`Found ${this.state.data.length} assets 🎉🎉`}</p>
                <div style={{ textAlign: 'center' }}>
                    <Button primary onClick={this.showResults.bind(this)}>
                        View Results
                    </Button>
                </div>
            </div>
        )
    }

    renderSearchFailure() {
        return (
            <>
                <Incorrect />
                <p style={{ color: '#D06079' }}>
                    Oops! some error occured while getting data assets for
                    <br />
                    {`${this.state.address}`}
                </p>
                <Button primary onClick={this.fetchDataAssets.bind(this)}>
                    Search Again
                </Button>
            </>
        )
    }
    renderSearchInProgress() {
        return (
            <div>
                <Correct loadComplete={false} />
                <p>Getting your data assets ✨✨</p>
            </div>
        )
    }

    renderDataAssets() {
        alert('rendering - ' + this.state.data.length)
        return (
            <div>
                <h3>Total {this.state.data.length} assets 🚀</h3>
                <hr />
                {this.state.data.length ? (
                    <AssetList data={this.state.data} />
                ) : (
                    <p>Try publishing some data assets...</p>
                )}
            </div>
        )
    }
    render() {
        return ethereumAddress.isAddress(this.context.wallet.address) &&
            this.state.showData
            ? this.renderDataAssets()
            : this.state.inProgress
            ? this.renderSearchInProgress()
            : this.state.showSuccess
            ? this.renderSearchSuccess()
            : this.renderSearchFailure()
    }
}
