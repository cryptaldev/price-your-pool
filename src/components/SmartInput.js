import React from "react";
import Input from "./Form/Input";
import styles from "./SmartInput.module.scss";

export default function SmartInput({
  label,
  value,
  setValue,
  placeholder,
  infoKeypair,
  error
}) {
  return (
    <div className={styles.smartContainer}>
      <div className={styles.smartInputContainer}>
        <h5 className={styles.smartLabel}>{label}</h5>
        <div className={styles.smartInput}>
          <Input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={placeholder}
          />
          {error ? <p className={styles.error}>{error}</p> : ""}
        </div>
        <div className={styles.info}>
          {infoKeypair && Object.keys(infoKeypair).length ? (
            <table className={styles.table}>
              <tbody>
                {Object.keys(infoKeypair).map(key => (
                  <tr>
                    <td>
                      {key}
                      {"  "}:
                    </td>
                    <td>{infoKeypair[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
