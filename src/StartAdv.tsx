import React, { useState, useEffect } from "react";
import "./home.css";
import axios from "axios";
import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const StartAdv: React.FC = () => {
  const [caption, setCaption] = useState<string>("");
  const [amount, setAmount] = useState<number>(1);
  const [selectedPublicKey, setSelectedPublicKey] = useState<string>("");
  //const [keyy, setKeyy] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);

  type Article = {
    publicKey: string;
    cid: string;
    Views: string;
    Likes: Array<string | null>;
    Dislikes: Array<string>;
    Reviews: Array<any>; // Specify a more precise type if possible
    Hover: string;
  };

  let navigate = useNavigate();

  const getArticlesAPI = async (): Promise<any> => {
    try {
      const response = await axios.get(
        "http://16.170.221.43:80/getArticles?page=1&pageSize=100"
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching API Key:", error);
      return error.response.data;
    }
  };

  const getArticles = async () => {
    const output = await getArticlesAPI();

    console.log(output);
    setArticles(output);

    //await fetchDataForItems(output.data);
  };

  useEffect(() => {
    getArticles();
  }, []);

  const getApiKey = async (): Promise<any> => {
    try {
      const response = await axios.get(
        "http://16.170.221.43:80/fetch-api-key",
        {
          params: {
            walletAddr: sessionStorage.getItem("address"),
          },
        }
      );

      console.log("API Key:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching API Key:", error);
      return error?.response?.data;
    }
  };

  const storeApiKey = async (key: string): Promise<any> => {
    const walletAddr = sessionStorage.getItem("address");

    try {
      const response = await axios.post(
        "http://16.170.221.43:80/store-api-key",
        {
          walletAddr: walletAddr,
          apiKey: key,
        }
      );

      console.log("API Key:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error storing API Key:", error);
      return error?.response?.data;
    }
  };

  const handleUpload = async (): Promise<any> => {
    const walletAddr = sessionStorage.getItem("address");

    try {
      const response = await axios.post(
        "http://16.170.221.43:80/upload-ad",
        {
          link: caption,
          apiKey: sessionStorage.getItem("api"),
          cidMedia: path,
          walletAddr: walletAddr,
          cidOfPost: selectedPublicKey,
          bid:amount
        }
      );

      let url =
        "https://gateway.lighthouse.storage/ipfs/" +
        response.data.tokenURI.data.Hash;

      const response2 = await axios.post(
        "http://16.170.221.43:80/mintAndTransfer",
        {
          transferToAddress: sessionStorage.getItem("address"),
          tokenURI: url,
        }
      );
      console.log(response2);

      console.log("Upload Response:", response.data);

      alert(
        "Minting successfull. Your tokenId is " +
          response2.data.tokenId +
          " and can be accessed at " +
          url
      );
      return response.data;
    } catch (error: any) {
      console.error("Error during upload:", error);
      return error?.response?.data;
    }
  };

  const uploadFile = async (file: FileList | null): Promise<void> => {
    if (!file || file.length === 0) return;

    let key = "";
    const walletAddress = sessionStorage.getItem("address") || "";

    if (!walletAddress) {
      console.error("No wallet address found in sessionStorage");
      return;
    }

    const output2 = await getApiKey();
    console.log(output2);

    if (output2.message !== "Success") {
      const verificationMessage = (
        await axios.get(
          `https://api.lighthouse.storage/api/auth/get_message?publicKey=${walletAddress}`
        )
      ).data;

      console.log(verificationMessage);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(verificationMessage);

      console.log(signature);

      const api = await lighthouse.getApiKey(walletAddress, signature);
      console.log("here we have", api);

      key = api.data.apiKey;
      await storeApiKey(key);
    } else {
      key = output2.apiKey;
      console.log(output2);
    }
    sessionStorage.setItem("api", key);

    console.log(key);
    const output = await lighthouse.upload(file, key, false, undefined);

    console.log("File Status:", output);

    console.log(
      "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
    );
    setPath("https://gateway.lighthouse.storage/ipfs/" + output.data.Hash);
  };

  return (
    <div style={{ backgroundColor: "black", height: "100vh", width: "100%" }}>
      <div className="header">
        <div style={{ width: "50%", marginLeft: "10px" }}>
          {/* <img style={{ float: "left" }} src={logo}></img> */}
        </div>
        <div style={{ width: "40%", float: "right" }}>
          <div className="button-1" style={{ width: "70%" }}>
            <span
              className={
                sessionStorage.getItem("tab") === "0" ? "logo-a" : "logo"
              }
              onClick={() => {
                sessionStorage.setItem("tab", "0");
                navigate("/feed");
              }}
            >
              Feed
            </span>
            <span
              className={
                sessionStorage.getItem("tab") === "1" ? "logo-a" : "logo"
              }
              onClick={() => {
                sessionStorage.setItem("tab", "1");
                navigate("/create");
              }}
            >
              Create
            </span>
            <span
              className={
                sessionStorage.getItem("tab") === "2" ? "logo-a" : "logo"
              }
              onClick={() => {
                sessionStorage.setItem("tab", "2");
                navigate("/createAdvertisement");
              }}
            >
              Advertise
            </span>
          </div>
        </div>
      </div>
      <div className="line"></div>
      <div className="inner-box-31" style={{ height: "auto" }}>
        <label>Create Advertisement</label>
        <input
          id="fileInput"
          onChange={(e) => uploadFile(e.target.files)}
          type="file"
        />

        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="description"
        />

        <select
          onChange={(e) => {
            setSelectedPublicKey(e.target.value);
          }}
          value={selectedPublicKey}
        >
          <option value="">Select an article</option>
          {articles.map((item, index) => (
            <option key={index} value={item.cid}>
              {`Views: ${item.Views || "N/A"}, CID: ${item.cid}`}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          placeholder="description"
        />

        <button
          className="button-sec"
          style={{ width: "100%" }}
          onClick={handleUpload}
        >
          Upload and Bid
        </button>
      </div>
    </div>
  );
};

export default StartAdv;
