import React, { } from "react";
import Header from "./Header";
import "./home.css";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
    
    let navigate = useNavigate()

    const signin = async () => {
        console.log("entered");

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        provider.listAccounts().then((accounts: string[]) => {
            if (accounts.length === 0) {
                alert("Please connect Metamask first");
                return;
            }
            console.log(accounts[0]);
            
            
        });
    };

    return (
        <div style={{ backgroundColor: "black", height: "100vh", width: "100%" }}>
            <Header />
            <div className="inner-box">
                <div className="inner-box-w">
                    <div className="inner-box-2">
                        <div className="inner-box-3">
                            <br />
                            <h1>EXPLORE</h1>
                            <div className="button-sec" onClick={()=>{
                            sessionStorage.setItem("tab","2")
                            signin()
                            navigate('/feed')}}> Get Started </div>
                        </div>
                        <div className="inner-box-3">
                            {/* Additional content */}
                            <br />
                            <h1>CREATE</h1>
                            <div className="button-sec" onClick={()=>{
                                sessionStorage.setItem("tab","1")
                                signin()
                                navigate('/create')}}> Get Started </div>
                        </div>
                        <div className="inner-box-3"
                        onClick={()=>{
                            sessionStorage.setItem("tab","2")
                            signin()
                            navigate('/createAdvertisement')}}>
                            {/* Additional content */}
                            <br />
                            <h1>ADVERTISE</h1>
                            <div className="button-sec" onClick={signin}> Get Started </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
