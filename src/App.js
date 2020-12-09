import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Form from "./components/Form/Form";
import Input from "./components/Form/Input";
import SmartInput from "./components/SmartInput";
import Button from "./components/Form/Button";
import Header from "./components/Header";
import Label from "./components/Form/Label";
import dataTokenABI from "./abi/dataTokenABI";
import poolABI from "./abi/poolABI";
import { waitTransaction, isSuccessfulTransaction } from "./ethereum";
import styles from "./App.module.scss";

function App() {
  const [tokensToMint, setTokensToMint] = useState(0);
  const [error, setError] = useState({});
  const [datatokenInfo, setDatatokenInfo] = useState(null);
  const [poolInfo, setPoolInfo] = useState(null);
  const [datatokenAddress, setDatatokenAddress] = useState(
    "0x1f685116a42f392f291a78eD6175B41B7E326843"
  );
  const [poolAddress, setPoolAddress] = useState(
    "0x0da1004CE58464c9a62bEEa4CE4F2951A2103cB2"
  );
  const [expectedPrice, setExpectedPrice] = useState(1);
  const [chainId, setChainId] = useState(0);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await window.web3.eth.getAccounts();

        //set Account
        setAccount(accounts[0]);
        //set chainId
        setChainId(window.web3.utils.hexToNumber(window.ethereum.chainId));

        // event handler
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleNetworkChanged);
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    }

    loadWeb3();
  }, []);

  function handleNetworkChanged(id) {
    setChainId(window.web3.utils.hexToNumber(id));
    console.log("Chain Id changed to - ", chainId);
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      alert("Please connect to MetaMask.");
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      console.log("Account Changed to - ", account);
    }
  }

  async function getDatatokenInfo(dtAddress) {
    try {
      const dtInstance = new window.web3.eth.Contract(dataTokenABI, dtAddress);
      console.log(dtInstance);
      let symbol = await dtInstance.methods.symbol().call();
      let name = await dtInstance.methods.name().call();
      let cap = window.web3.utils.fromWei(
        await dtInstance.methods.cap().call(),
        "ether"
      );
      let minter = await dtInstance.methods.minter().call();
      console.log({ name, symbol, cap, minter });
      return { name, symbol, cap, minter };
    } catch (err) {
      console.error(err.message);
      return err;
    }
  }

  async function getPoolInfo(poolAddress, dtAddress) {
    const poolInstance = new window.web3.eth.Contract(poolABI, poolAddress);
    const oceanInWei = await poolInstance.methods
      .getBalance(process.env.REACT_APP_OCEAN_ADDRESS)
      .call();
    const oceanInETH = window.web3.utils.fromWei(oceanInWei, "ether");
    const OCEAN = Number(oceanInETH).toFixed(2);
    const datatokenInWei = await poolInstance.methods
      .getBalance(dtAddress)
      .call();
    const datatokenInETH = window.web3.utils.fromWei(datatokenInWei, "ether");
    const Datatoken = Number(datatokenInETH).toFixed(2);
    const priceInWei = await poolInstance.methods
      .getSpotPrice(process.env.REACT_APP_OCEAN_ADDRESS, dtAddress)
      .call();
    const priceInETH = window.web3.utils.fromWei(priceInWei, "ether");
    const Price = Number(priceInETH).toFixed(2);
    return { OCEAN, Datatoken, Price };
  }

  async function calculateDatatokensToMint(
    dtAddress,
    poolAddress,
    expectedSpotprice
  ) {
    console.log("OCEAN address - ", process.env.REACT_APP_OCEAN_ADDRESS);
    const poolInstance = new window.web3.eth.Contract(poolABI, poolAddress);
    let oceanInPoolInWei = await poolInstance.methods
      .getBalance(process.env.REACT_APP_OCEAN_ADDRESS)
      .call();
    let oceanInPoolInETH = window.web3.utils.fromWei(oceanInPoolInWei, "ether");
    let weightOfOceanInWei = await poolInstance.methods
      .getNormalizedWeight(process.env.REACT_APP_OCEAN_ADDRESS)
      .call();
    let weightOfOceanInETH = window.web3.utils.fromWei(
      weightOfOceanInWei,
      "ether"
    );

    let weightOfDatatokenInWei = await poolInstance.methods
      .getNormalizedWeight(dtAddress)
      .call();
    let weightOfDatatokenInETH = window.web3.utils.fromWei(
      weightOfDatatokenInWei,
      "ether"
    );

    let swapFeeInWei = await poolInstance.methods.getSwapFee().call();
    let swapFeeInETH = window.web3.utils.fromWei(swapFeeInWei, "ether");

    //calculations

    const swapFeeRatio = 1 / (1 - swapFeeInETH);
    const oceanTokenRatio = oceanInPoolInETH / weightOfOceanInETH;
    const datatokenRatio = weightOfDatatokenInETH / expectedSpotprice;

    console.log("SwapFeeinETH - ", swapFeeInETH);
    console.log("weightOfDTInETH - ", weightOfDatatokenInETH);
    console.log("weightOfOceanInETH - ", weightOfOceanInETH);
    console.log("Ocean Balance - ", oceanInPoolInETH);

    console.log("-----------------------");

    console.log("Swap Fee Ratio - ", swapFeeRatio);
    console.log("Ocean Token Ratio - ", oceanTokenRatio);
    console.log("Data Token Ratio - ", datatokenRatio);

    console.log(
      "Data Token To Mint - ",
      swapFeeRatio * oceanTokenRatio * datatokenRatio
    );
    const datatokensToMintInETH =
      swapFeeRatio * oceanTokenRatio * datatokenRatio;

    console.log("dt to mint - ", datatokensToMintInETH);
    setTokensToMint(datatokensToMintInETH);
    return datatokensToMintInETH;
  }

  async function mintDatatokens(dtAddress, poolAddress, datatokensToMintInETH) {
    console.log("minterAccount - " + account);
    const datatokensToMintInWei = window.web3.utils.toWei(
      String(datatokensToMintInETH),
      "ether"
    );

    const dtInstance = new window.web3.eth.Contract(dataTokenABI, dtAddress);

    /*let gas = await dtInstance.methods
      .mint(poolAddress, datatokensToMintInWei)
      .estimateGas(); */

    const data = await dtInstance.methods
      .mint(poolAddress, datatokensToMintInWei)
      .encodeABI();

    const transactionParameters = {
      gas: window.web3.utils.numberToHex("100000"), // customizable by user during MetaMask confirmation.
      to: datatokenAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: "0x00", // Only required to send ether to the recipient from the initiating external account.
      data, // Optional, but used for defining smart contract creation and interaction.
      chainId
    };

    // txHash is a hex string
    // As with any RPC call, it may throw an error
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters]
    });

    console.log("Txhash - " + txHash);
    return txHash;
  }

  async function gulpDatatokensIntoPool(dtAddress, poolAddress) {
    const poolInstance = new window.web3.eth.Contract(poolABI, poolAddress);
    const data = await poolInstance.methods.gulp(dtAddress).encodeABI();

    const transactionParameters = {
      gas: window.web3.utils.numberToHex("100000"), // customizable by user during MetaMask confirmation.
      to: poolAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: "0x00", // Only required to send ether to the recipient from the initiating external account.
      data, // Optional, but used for defining smart contract creation and interaction.
      chainId
    };

    // txHash is a hex string
    // As with any RPC call, it may throw an error
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters]
    });

    console.log("Txhash - " + txHash);
    return txHash;
  }

  async function handleCalculations(value) {
    try {
    } catch (err) {
      console.error(err);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Pool - ", poolAddress);
    console.log("Datatoken - ", datatokenAddress);
    setError({ calculations: "" });
    try {
      //calculate datatokens needed to minted
      let tokensToMint = await calculateDatatokensToMint(
        datatokenAddress,
        poolAddress,
        expectedPrice
      );
      console.log(
        ` >> We need to mint ${tokensToMint} datatokens to bring price of datatoken to ${expectedPrice} <<`
      );
      setTokensToMint(tokensToMint);

      if (tokensToMint) {
        if (tokensToMint > datatokenInfo.cap - poolInfo.Datatoken) {
          setError({
            calculations: `Tokens needed to mint (${tokensToMint}) exceeds max mintable datatokens (${datatokenInfo.cap -
              poolInfo.Datatoken})`
          });
          return;
        }
      }
      //mint datatokens
      alert(`Going to mint ${tokensToMint}`);
      let mintTxHash = await mintDatatokens(
        datatokenAddress,
        poolAddress,
        tokensToMint
      );

      let mintReceipt = await waitTransaction(window.web3, mintTxHash, null);
      console.log("mint Receipt - " + mintReceipt);
      if (isSuccessfulTransaction(mintReceipt)) {
        alert("Mint tx successfully minted");
      }

      //gulp minted tokens
      alert("Going to send gulp tx");
      let gulpTxHash = await gulpDatatokensIntoPool(
        datatokenAddress,
        poolAddress
      );
      let gulpReceipt = await waitTransaction(window.web3, gulpTxHash, null);
      console.log("gulp Receipt - " + gulpReceipt);
      if (isSuccessfulTransaction(gulpReceipt)) {
        alert("Gulp tx successfully minted");
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async function handleDatatokenAddressChange(value) {
    setDatatokenAddress(value);
    setDatatokenInfo(null);
    if (window.web3.utils.isAddress(value)) {
      let info = await getDatatokenInfo(value);
      console.log();
      setDatatokenInfo(info);
      if (!info) {
        setError({ datatoken: "Datatoken not found" });
      } else {
        setError({ datatoken: "" });
      }
    }
  }

  async function handlePoolAddressChange(value) {
    setPoolAddress(value);
    if (window.web3.utils.isAddress(value)) {
      console.log("Pool address - ", value);
      setPoolInfo(await getPoolInfo(value, datatokenAddress));
    }
    if (!poolInfo) {
      setError({ pool: "Pool not found" });
    } else {
      setError({ pool: "" });
    }
  }

  return (
    <div className={styles.app}>
      <Header account={account} />
      <div className={styles.appContainer}>
        <Form>
          <p>Set Expected Price to rebase the Pool</p>
          <SmartInput
            label="Datatoken Address"
            value={datatokenAddress}
            setValue={handleDatatokenAddressChange}
            placeholder="0x......"
            infoKeypair={datatokenInfo}
            error={datatokenInfo ? "" : error.datatoken}
          />
          <SmartInput
            label="Pool Address"
            value={poolAddress}
            setValue={handlePoolAddressChange}
            placeholder="0x......"
            infoKeypair={poolInfo}
            error={poolInfo ? "" : error.pool}
          />
          <SmartInput
            label="Expected price (in OCEAN)"
            value={expectedPrice}
            setValue={setExpectedPrice}
            placeholder="10"
            error={error.calculations}
          />
          <br />
          <Button onClick={handleSubmit}>Rebase Pool</Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
