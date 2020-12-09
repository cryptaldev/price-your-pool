import React, { useState } from "react";
import styles from "./Header.module.scss";
import Button from "./Form/Button";
import Modal from "./Modal"

export default function Header({ account, modal }) {
  const [showModal, setShowModal] = useState(false)
  return (
    <header className={styles.appHeader}>
      <div className={styles.logoContainer}>
        <img src={process.env.PUBLIC_URL + "/favicon.ico"} />
        <h2 className={styles.topLinks}>Price Your Pool</h2>
      </div>
      <div className={styles.logoContainer}>
        <h3 className={styles.how} onClick={() => modal(true)}>How It Works?</h3>
      </div>
      <div className={styles.walletContainer}>
        {account ? <p>{account}</p> : <Button>Connect</Button>}
      </div>
    </header>
  );
}
