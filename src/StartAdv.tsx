import React, { useState } from "react";
import "./home.css";
// import axios from "axios";
// import lighthouse from "@lighthouse-web3/sdk";
// import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const StartAdv: React.FC = () => {

    let navigate = useNavigate()


    return (
        <div style={{ backgroundColor: "black", height: "100vh", width: "100%" }}>
              <div className="header">
            <div style={{ width: "50%", marginLeft: "10px" }}>
              {/* <img style={{ float: "left" }} src={logo}></img> */}
            </div>
            <div style={{ width: "40%", float: "right" }}>
              <div className="button-1" style={{ width: "70%"}}>
                <span className={sessionStorage.getItem("tab")==="0"?"logo-a":"logo"} onClick = {()=>{
                    sessionStorage.setItem("tab","0");
                    navigate('/feed')
                }}>Feed</span>
                <span className={sessionStorage.getItem("tab")==="1"?"logo-a":"logo"} onClick = {()=>{
                    sessionStorage.setItem("tab","1");
                    navigate('/create')
                }}>Create</span>
                <span className={sessionStorage.getItem("tab")==="2"?"logo-a":"logo"} onClick = {()=>{
                    sessionStorage.setItem("tab","2");
                    navigate('/createAdvertisement')
                }}>Advertise</span>
                
              </div>
            </div>
          </div>
          <div className="line"></div>

          </div>)


}

export default StartAdv

