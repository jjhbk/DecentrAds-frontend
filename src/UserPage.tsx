import React, { useEffect, useState } from "react";
//import Header from "./Header";
import "./home.css";
import "./header.css";
//import mon from "../assets/mon.png";

//import { ethers } from "ethers";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Article {
  publicKey: string;
  cid: string;
}

interface FetchedData {
  name: string;
  cid: string;
  des: string;
  cidJ: string;
  avatar?: string;
}

const UserPage: React.FC = () => {
  //const [page, setPage] = useState<number[]>([]);
  const [data, setData] = useState<FetchedData[]>([]);

  

  let navigate = useNavigate()

  const getArticlesAPI = async (): Promise<any> => {
    try {
      const response = await axios.get(
        "http://16.170.221.43:80/getArticles?page=1&pageSize=100"
      );
      return response;
    } catch (error: any) {
      console.error("Error fetching API Key:", error);
      return error.response.data;
    }
  };

  const fetchDataForItems = async (
    outputData: Article[]
  ): Promise<FetchedData[] | undefined> => {
    try {
      const fetchPromises = outputData.map(async (item) => {
        const response = await axios.get(
          `https://gateway.lighthouse.storage/ipfs/${item.cid}`
        );
        const data: any = JSON.parse(response.data);
        return {
          name: item.publicKey,
          cid: data.cidMedia,
          des: data.contentx,
          cidJ: item.cid
        };
      });

      const results = await Promise.all(fetchPromises);
      let dat: FetchedData[] = [];
      results.forEach((item) => {
        let object: FetchedData = {
          name: item.name,
          cid: item.cid,
          des: item.des,
          cidJ: item.cidJ,
          avatar: "",
        };
        dat.push(object);
      });
      setData(dat);
      return results;
    } catch (error: any) {
      console.error("Error fetching data:", error);
    }
  };

  const getArticles = async () => {
    const output = await getArticlesAPI();
    await fetchDataForItems(output.data);
  };

  useEffect(() => {
    getArticles();
  }, []);

  // const handlePostClick = (postData: FetchedData) => {
  //   console.log(postData);
  // };

  return (
    <div style={{ backgroundColor: "black", height: "auto", width: "100%" }}>
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



      <div className="feed-page">
        {data.map((item, index) => (
          <div key={index} className="card" onClick={()=>{
            localStorage.setItem("i", item.cid)
            localStorage.setItem("loc", item.cidJ)
            console.log(localStorage.getItem("i"))
          
            navigate(`/blog/${item.name}`)}}>
            <div className="creator">{item.name.slice(0,8)} </div>
            <img src={item.cid} alt={`content-${index}`}></img>
            <div>{item.des}</div>
            
          </div>
        ))}



      </div>
    </div>
  );
};

export default UserPage;
