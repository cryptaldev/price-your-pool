import React, { useState, useEffect, useContext } from 'react'
import Input from '../components/Form/Input'
import Button from '../components/Button'
import Form from '../components/Form/Form'
import styles from './Wallet.module.scss'
import Correct from './Correct'
import { generateWallet } from '../myWeb3'
import { WalletContext } from './WalletContext'

export default function Wallet() {
    const [mnemonic, setMnemonic] = useState('')
    const [showMnemonic, setShowmnemonic] = useState('none')
    const [showPrivateKey, setShowPrivateKey] = useState('none')
    const [showNewUser, setShowNewUser] = useState(false)
    const [showLoader, setShowLoader] = useState(true)
    const [wallet, setWallet] = useState(useContext(WalletContext).wallet)

    const [showMnemonicForm, setShowMnemonicForm] = useState(false)

    const [showResults, setShowResults] = useState(false)

    const oldWallet = useContext(WalletContext).wallet
    console.log('wallet ', oldWallet)
    useEffect(() => {
        console.log('inside effect')
        console.log('old - ', oldWallet)
        console.log('current - ', wallet)

        if (!wallet) {
            if (oldWallet) {
                setWallet(oldWallet)
            } else {
                console.log("No wallet found. It's a new user")
                setShowNewUser(true)
            }
        } else {
            console.log('Wallet Found - ', wallet.address)
        }

        setShowLoader(false)
    }, [oldWallet])

    function copyToClipboard(e) {
        e.target.select()
        document.execCommand('copy')
        alert(`copied ${e.target.name}`)
    }

    function createWallet() {
        try {
            let wallet = generateWallet(mnemonic)
            if (wallet == null) {
                console.error("Wallet couldn't be generated. Please try again")
            } else {
                if (!mnemonic) {
                    localStorage.setItem('mnemonic', wallet.mnemonic.phrase)
                    setMnemonic(wallet.mnemonic.phrase)
                } else {
                    localStorage.setItem('mnemonic', mnemonic)
                }

                setWallet(wallet)
                setShowMnemonicForm(false)
                setShowResults(true)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    function renderResults() {
        return (
            <>
                <Correct loadComplete={true} />
                <p> Wallet created successfully </p>
                <h4
                    style={{
                        marginTop: '-3.5rem',
                        maxWidth: 'inherit',
                        wordBreak: 'break-all'
                    }}
                >
                    {wallet.address}
                </h4>
                <div style={{ textAlign: 'center' }}>
                    <Button
                        primary
                        type="submit"
                        onClick={() => setShowResults(false)}
                    >
                        Got it!
                    </Button>
                </div>
            </>
        )
    }

    function renderButtonsForNewUser() {
        return (
            <div className={styles.container}>
                <Form
                    title="Get Started"
                    description="Create a new wallet or import existing"
                >
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            primary
                            type="submit"
                            onClick={createWallet.bind(this)}
                        >
                            Create New Wallet
                        </Button>
                    </div>
                    <div style={{ marginTop: 10 }} />
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            primary
                            type="submit"
                            onClick={() => setShowMnemonicForm(true)}
                        >
                            Import Existing Wallet
                        </Button>
                    </div>
                </Form>
            </div>
        )
    }

    function renderButtonsForExistingUser() {
        return (
            <div className={styles.container}>
                <Form>
                    <div>
                        <Input
                            name="address"
                            tag="textarea"
                            label="My Wallet Address"
                            rows="2"
                            cols="100"
                            value={wallet.address}
                            readOnly={true}
                            onClick={e => copyToClipboard(e)}
                        />
                    </div>
                    <div style={{ marginTop: 10 }} />
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            primary
                            type="submit"
                            onClick={e => {
                                e.preventDefault()
                                setShowPrivateKey('block')
                            }}
                        >
                            Show Private Keys
                        </Button>
                    </div>

                    <div style={{ display: showPrivateKey }}>
                        <Input
                            name="privateKey"
                            tag="textarea"
                            rows="3"
                            cols="50"
                            value={wallet.privateKey}
                            readOnly={true}
                            onClick={e => copyToClipboard(e)}
                        />
                    </div>

                    <div style={{ marginTop: 10 }} />
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            primary
                            onClick={e => {
                                e.preventDefault()
                                setShowmnemonic('block')
                            }}
                        >
                            Show Seed Phrase
                        </Button>
                    </div>
                    <div style={{ display: showMnemonic }}>
                        <Input
                            name="seedphrase"
                            tag="textarea"
                            rows="4"
                            cols="50"
                            value={wallet.mnemonic.phrase}
                            readOnly={true}
                            onClick={e => copyToClipboard(e)}
                        />
                    </div>
                    <div style={{ marginTop: 50 }} />
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            primary
                            type="submit"
                            onClick={() => setShowMnemonicForm(true)}
                        >
                            Import Using Seed Phrase
                        </Button>
                    </div>
                </Form>
            </div>
        )
    }
    function renderMnemonicForm() {
        return (
            <div className={styles.container}>
                <Form
                    title="Import Existing Wallet"
                    description="Enter your 12 or 24 worded Seed Phrase"
                >
                    <div className={styles.searchbar}>
                        <Input
                            name="mnuemonic"
                            tag="textarea"
                            placeholder="block apple thing tree rumour steel cozy coin phone surprise pill people sad"
                            rows="4"
                            cols="50"
                            value={mnemonic}
                            onChange={e => setMnemonic(e.target.value)}
                        />
                        <div style={{ textAlign: 'center' }}>
                            <Button
                                primary
                                type="submit"
                                onClick={createWallet.bind(this)}
                            >
                                Generate Wallet
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        )
    }

    function renderNewUser() {
        return renderButtonsForNewUser()
    }

    function renderExistingUser() {
        return renderButtonsForExistingUser()
    }

    function renderLoader() {
        return (
            <div>
                <Correct loadComplete={false} />
            </div>
        )
    }
    return showMnemonicForm
        ? renderMnemonicForm()
        : showResults
        ? renderResults()
        : showLoader
        ? renderLoader()
        : !showNewUser && wallet
        ? renderExistingUser()
        : renderNewUser()
}
