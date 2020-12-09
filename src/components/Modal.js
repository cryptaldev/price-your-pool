import React from 'react'
import Modal from 'react-modal'
import Row from './Form/Row'
import Label from "./Form/Label"
import Button from "./Form/Button"
import styles from './Modal.module.scss'



export default function HowItWorks({open, setClose, className}){
    return (
        <Modal 
        className={className}
        isOpen={open}
        contentLabel="onRequestClose Example"
        onRequestClose={setClose}
        shouldCloseOnOverlayClick={false}
     >
        <div className={styles.howContent}>
       <h2>This is how it works</h2>
       <br />
       <Row>
           <h3>Step 1 -  Mint and Airdrop XX tokens Datatokens to Pool contract </h3>
       </Row>
       <Row>
           <h3>Step 2 -  Gulp newly airdropped datatokens into the Pool</h3>
       </Row>
       <br />
       <br />
       <Button onClick={setClose}>I Got It</Button>
       </div>
     </Modal>
    )
}