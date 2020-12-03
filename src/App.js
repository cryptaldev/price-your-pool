import React, { useState, useEffect } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import dataTokenABI from "./abi/dataTokenABI";
import poolABI from "./abi/poolABI";
import "./App.css";

function App() {
  const [tokensToMint, setTokensToMint] = useState(0);
  const [expectedPrice, setExpectedPrice] = useState(1);
  const [chainId, setChainId] = useState(4);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    /* async function injectProvider() {
      const provider = await detectEthereumProvider();
      if (provider) {
        console.log("provider");
        console.log(provider);
        setWeb3(new Web3(provider));
      } else {
        alert("Please install Metamask");
      }
      console.log("web3");
      console.log(web3);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });

      //set current chainId
      setChainId(window.ethereum.chainId);

      //set current account
      setAccount(accounts[0]);

      //handle Network changed
      window.ethereum.on("chainChanged", handleNetworkChanged);

      //handle Account changed
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    //inject Metamask
    injectProvider(); */

    async function loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await window.web3.eth.getAccounts();
        console.log(accounts);
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

  function handleNetworkChanged() {
    window.location.reload();
    setChainId(window.ethereum.chainId);
    alert("Chain Id - ", window.ethereum.chainId);
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      alert("Please connect to MetaMask.");
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      alert("Account - ", accounts[0]);
    }
  }

  async function mintDatatokens(dtAddress, poolAddress, expectedSpotprice) {
    //calculate pricing
    //let price = web3.utils.toWei(newPrice, "ether")
    const dtInstance = new web3.eth.Contract(dataTokenABI, dtAddress);

    const poolInstance = new web3.eth.Contract(poolABI, poolAddress);
    let oceanInPoolInWei = await poolInstance.methods
      .getBalance(process.env.REACT_APP_OCEAN_ADDRESS)
      .call();
    let oceanInPoolInETH = web3.utils.fromWei(oceanInPoolInWei, "ether");
    let weightOfOceanInWei = await poolInstance.methods
      .getNormalizedWeight(process.env.REACT_APP_OCEAN_ADDRESS)
      .call();
    let weightOfOceanInETH = web3.utils.fromWei(weightOfOceanInWei, "ether");

    let weightOfDatatokenInWei = await poolInstance.methods
      .getNormalizedWeight(dtAddress)
      .call();
    let weightOfDatatokenInETH = web3.utils.fromWei(
      weightOfDatatokenInWei,
      "ether"
    );

    let swapFeeInWei = await poolInstance.methods.getSwapFee().call();
    let swapFeeInETH = web3.utils.fromWei(swapFeeInWei, "ether");

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
    const datatokensToMintInWei = web3.utils.toWei(
      String(datatokensToMintInETH),
      "ether"
    );

    alert("dt to mint - ", datatokensToMintInETH);
    setTokensToMint(datatokensToMintInETH);
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    let gas = await dtInstance.methods
      .mint(poolAddress, datatokensToMintInWei)
      .estimateGas();

    const result = await dtInstance.methods
      .mint(poolAddress, datatokensToMintInWei)
      .send({
        from: account,
        gas
      });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setExpectedPrice(e.target.value);

    /*mintDatatokens(
      "0xC1e2dcCC25ed82AcF79e233780c0f613B1229F82",
      "0x58d65bB61BDD4df764A4Fba87d23D628a8a79b89",
      expectedPrice
    );*/
  }
  return (
    <div className="App">
      <header className="App-header">
        <form>
          <p>Set Expected Price to rebase the Pool</p>
          <input
            type="text"
            value={expectedPrice}
            onChange={e => setExpectedPrice(e.target.value)}
            placeholder="expected Spot Price"
          />
          <br />
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </header>
    </div>
  );
}

export default App;
