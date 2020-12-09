import React, { PureComponent } from "react";
import styles from "./Header.module.scss";
import Button from "./Form/Button";

export default function Header({ account }) {
  return (
    <header className={styles.appHeader}>
      <div className={styles.logoContainer}>
        <img src={process.env.PUBLIC_URL + "/favicon.ico"} />
        <h3 className={styles.topLinks}>Stable Price</h3>
      </div>
      <div className={styles.walletContainer}>
        {account ? <p>{account}</p> : <Button>Connect</Button>}
      </div>
    </header>
  );
}
