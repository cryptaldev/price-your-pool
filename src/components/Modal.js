import React from "react";
import Modal from "react-modal";
import Row from "./Form/Row";
import Label from "./Form/Label";
import Button from "./Form/Button";
import styles from "./Modal.module.scss";

export default function HowItWorks({ open, setClose, className }) {
  return (
    <Modal
      className={className}
      isOpen={open}
      contentLabel="onRequestClose Example"
      onRequestClose={setClose}
      shouldCloseOnOverlayClick={false}
    >
      <div className={styles.howContent}>
        <h2>This is a 2 step process</h2>
        <br />
        <div>
          <h3>Step 1</h3>
          <span>
            This app will Mint calculated Datatokens from datatoken's contract
            and airdrop it to the Pool contract. You will be asked to sign a
            transaction for this.
          </span>
        </div>
        <div>
          <h3>Step 2</h3>{" "}
          <span>
            {" "}
            Next, this airdropped datatokens will be 'Gulpped' into the Pool
            without diluting pool shares of LPs. You will sign another
            transaction for this.
          </span>
        </div>
        <br />
        <br />
        <Button onClick={setClose}>I Got It</Button>
      </div>
    </Modal>
  );
}
