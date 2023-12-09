import React, { useContext,useState } from "react";
import "./header.css";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState('')

  async function connectToMetaMask(): Promise<void> {
    if (window.ethereum) {
      try {
        const acc: string[] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(acc);
        setAccount(acc[0]);
        sessionStorage.setItem("address", acc[0]);

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const publicKey = await window.ethereum.request({
          method: 'eth_getEncryptionPublicKey',
          params: [acc[0]],
        });

        console.log(publicKey);
        const signer = provider.getSigner();
        console.log(signer);
        // const contract = new ethers.Contract(contractAddress, abi, signer);
      
        alert("Connected to MetaMask");
      } catch (error: any) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask not found");
    }
  }

  return (
    <>
      <div className="header">
        <div style={{ width: "50%", marginLeft: "10px" }}>
          {/* <img style={{ float: "left" }} src={logo}></img> */}
        </div>
        <div style={{ width: "50%", float: "right" }}>
          <div className="button-1">
            <span className="logo">Polygon</span>
            <button className="button" onClick={connectToMetaMask}>
              Connect to a wallet
            </button>
          </div>
        </div>
      </div>
      <div className="line"></div>
    </>
  );
};

export default Header;
