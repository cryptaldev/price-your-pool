import React, { useContext, useState, useEffect } from 'react'
import * as ethereumAddress from 'ethereum-address'
import { FormErrors } from './FormErrors'
import Button from './Button'
import Form from './Form/Form'
import Input from './Form/Input'
import Correct from './Correct'
import Incorrect from './Incorrect'
import { WalletContext } from './WalletContext'

export default function CreateDataToken() {

    const [title, setTitle] = useState(localStorage.getItem('title'))
    const [description, setDescription] = useState(localStorage.getItem('description'))
    const [dataurl, setDataurl] = useState(localStorage.getItem('dataurl'))
    const [author, setAuthor] = useState("anonymous")
    const [copyright, setCopyright] =useState("None")
    const wallet = useContext(WalletContext)
    const [showCreateForm, setShowCreateForm] =useState(true)
    const [did, setDid] = useState(undefined)

    const [showLoader, setShowLoader] = useState(false)

    console.log("address - ", wallet)

    useEffect(() => {
        console.log("Wallet Address - ", wallet.address)
        let lastPublish = localStorage.getItem("lastPublish")
        if (lastPublish && lastPublish.length) {
            clearLocalStorage();
            setTitle("")
            setDescription("")
            setDataurl("")
        }
    })

    function handleUserInput(e){
        const { name, value } = e.target
        localStorage.setItem(name, value)
    }

    function processPublishData(){
        
        return {
            "publisher": "",
            "metadata": {
                "main": {
                    "name": title,
                    "dateCreated": new Date().toISOString().substring(0, 19) + 'Z',
                    "author": author,
                    "license": "Apache 2.0",
                    "price": "0",
                    "files": [
                        {
                            "index": 0,
                            "contentType": "application/file",
                            "checksum": "2bf9d229d110d1976cdf85e9f3256c7f",
                            "checksumType": "MD5",
                            "contentLength": "15357507",
                            "compression": "pdf",
                            "encoding": "UTF-8",
                            "url": dataurl
                        }
                    ],

                    "type": "dataset"
                },
                "additionalInformation": {
                    "publishedBy": wallet.address,
                    "checksum": "",
                    "categories": [],
                    "tags": [
                        "jellyfish"
                    ],
                    "description": description,
                    "copyrightHolder": copyright,
                    "workExample": "image path, id, label",
                    "links": [],
                    "inLanguage": "en"
                }
            }
        }
    }

    function clearLocalStorage(){
        localStorage.removeItem('title')
        localStorage.removeItem('description')
        localStorage.removeItem('dataurl')
        localStorage.removeItem('author')
        localStorage.removeItem('copyright')
    }

    function startAgain (){
        //update states
        setTitle("")
        setDescription("")
        setDataurl("")
        setAuthor("")
        setCopyright("")
        
    }

    async function publishToOcean(e){
        e.preventDefault()
        e.stopPropagation()


        setShowLoader(true)
        setShowCreateForm(false)
        
        let publishData = processPublishData();
        console.log(JSON.stringify(publishData));
        try {
            const url = `https://agent.oceanprotocol.com/api/general/publishddo`

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(publishData)
            })
            const data = await response.json()

            if (response.status !== 200) {
                localStorage.removeItem("lastPublish")
                setShowLoader(false)
                return
            } else {
                localStorage.setItem("lastPublish", true)
                setShowLoader(false)
                setDid(data)
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    function renderCreateSuccess() {
        return (
            <div>
                <Correct loadComplete={true} />
                <p>{`Publish successful 🎉🎉`}
                    <br />
                    <a
                        target="_blank"
                        href={`https://commons.oceanprotocol.com/asset/did:op:${did}`}
                    >View in Ocean Commons
                 </a></p>


                <div style={{ textAlign: "center" }}>
                    <Button
                        primary
                        onClick={startAgain.bind(this, false)}
                    >
                        Close
             </Button>
                </div>
            </div >
        )
    }

    function renderCreateFailure(){
        return (
            <>
                <Incorrect />
                <p style={{ color: "#D06079" }}>Oops! some error occured while publishing</p>
                <Button
                    primary
                    onClick={startAgain.bind(this, true)}
                >
                    Try Again
             </Button>
            </>
        )
    }

    function renderCreateInProgress() {
        return (
            <div>
                <Correct loadComplete={false} />
                <p>Creating Data token 🦑🦑 ...</p>
            </div>
        )
    }

    function renderCreateForm() {
        return (
            <Form
                title="Create Data Tokens"
            >
                <Input
                    type="text"
                    name="title"
                    label="Title"
                    placeholder="Weather of Mumbai"
                    value={title}
                    required
                    help="Enter the title of your dataset"
                    onChange={e => { setTitle(e.target.value); localStorage.setItem('title', e.target.value) }}
                />

                <Input
                    type="text"
                    name="description"
                    label="Description"
                    placeholder="Collection of annual weather report of Mumbai for the year 2019."
                    value={description}
                    required
                    help="Enter the short description of this data asset"
                    onChange={e => { setDescription(e.target.value); localStorage.setItem('description', e.target.value) }}
                />

                <Input
                    type="text"
                    name="dataurl"
                    label="Data Url"
                    placeholder="https://example.com/publicdata.csv"
                    value={dataurl}
                    required
                    help="Enter url where data can be downloaded from"
                    onChange={e => { setDataurl(e.target.value); localStorage.setItem('dataurl', e.target.value) }}
                />

                <Input
                    type="text"
                    name="author"
                    label="Author"
                    placeholder="Satoshi Nakamoto"
                    value={dataurl}
                    required
                    help="Enter Author name"
                    onChange={e => { setAuthor(e.target.value); localStorage.setItem('author', e.target.value) }}
                />

                <Input
                    type="text"
                    name="copyright"
                    label="Copyright"
                    placeholder="Digital Media Inc"
                    value={dataurl}
                    required
                    help="Enter Copyright holder name"
                    onChange={e => { setCopyright(e.target.value); localStorage.setItem('copyright', e.target.value) }}
                />

                <div style={{ textAlign: "center" }}>
                    <Button
                        primary
                        type="submit"
                        disabled={false}
                        onClick={publishToOcean.bind(this)}
                    >
                        Create Datatoken 
                 </Button>
                </div>
            </Form>
        )
    }

    return (
        <>

            {
                showCreateForm ?
                    renderCreateForm() :
                    (
                        //is publish in progress
                        showLoader ?
                            renderCreateInProgress() :
                            (
                                //is asset published
                                did ?
                                    // show success
                                    renderCreateSuccess() :
                                    //show error
                                    renderCreateFailure()
                            )

                    )
            }
        </>
    )

}
