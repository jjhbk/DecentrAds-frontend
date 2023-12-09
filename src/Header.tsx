import React, { useContext,useState } from "react";
import "./header.css";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import configFile from "./config.json";

const config: any = configFile;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState('')

  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();


  

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

  if (wallet) {

    let acc = wallet.accounts[0]
    console.log(acc.address)
    sessionStorage.setItem("address", acc.address)
    


  }

  return (
    <>
      <div className="header">
       
        <div style={{ width: "100%" }}>
          <div className="button-1" >
            {/* <span className="logo">Polygon</span> */}
            <div>
            {!wallet && <button className="button"
                onClick={() =>
                    connect()
                }
            >
                {connecting ? "connecting" : "Connect a Wallet"}
            </button>}
            {wallet && (
                <div style ={{display:"flex", gap:"10px"}}>
                    {/* <label>Switch Chain</label> */}
                    {settingChain ? (
                        // <span>Switching chain...</span>
                        <></>
                    ) : (
                        <select style = {{borderRadius:"10px"}}
                            onChange={({ target: { value } }) => {
                                if (config[value] !== undefined) {
                                    setChain({ chainId: value })
                                } else {
                                    alert("No deploy on this chain")
                                }
                                }
                            }
                            value={connectedChain?.id}
                        >
                            {chains.map(({ id, label }) => {
                                return (
                                    <option key={id} value={id}>
                                        {label}
                                    </option>
                                );
                            })}
                        </select>
                    )}
                    <button className="button" onClick={() => disconnect(wallet)}>
                        Disconnect Wallet
                    </button>
                </div>
            )}
        </div>
          </div>
        </div>
      </div>
      <div className="line"></div>
    </>
  );
};

export default Header;
