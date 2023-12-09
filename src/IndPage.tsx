import React, { useEffect, useState, useRef } from "react";

import "./home.css";
import "./header.css";
//import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

const IndPage: React.FC = () => {
    const [startTime] = useState(Date.now());
    //const navigate = useNavigate();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    let param = useParams()

    const sendAnalyticsUpdate = (updateType: string, message: string, additionalData: Record<string, any> = {}) => {
      
      
        console.log(updateType)

        let obj = {
            Type: updateType,
            Message: message
        }
        console.log(additionalData)
        console.log(param.id)
        fetch('http://16.170.221.43:80/updateAnalytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                walletAddr: param.id, // ID of the content
                cid: localStorage.getItem("loc"), // Assuming CID is the same as contentId
                viewerAddr: sessionStorage.getItem("address"), // User's wallet address
                update:JSON.stringify(obj) // Type of update (like, dislike, view, totalTime)
            })
        });
    };

    const trackTotalTime = () => {
        const totalTime = Date.now() - startTime;
        sendAnalyticsUpdate('view', '',{ totalTime });
    };

    useEffect(() => {
        intervalRef.current = setInterval(trackTotalTime,  60 * 1000); // 5 minutes

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            trackTotalTime();
        };
    }, []);

    useEffect(() => {
        const handleUnload = () => trackTotalTime();
        window.addEventListener('beforeunload', handleUnload);

        return () => window.removeEventListener('beforeunload', handleUnload);
    }, []);

    const handleHoverOnAdvert = () => {
        sendAnalyticsUpdate('hover','');
    };



    // const handleUpload = async (): Promise<any> => {
    //     const walletAddr = sessionStorage.getItem("address");
    
    //     try {
    //       const response = await axios.post(
    //         "http://16.170.221.43:80/updateAnalytics",
    //         {
    //           contentx: caption,
    //           apiKey: sessionStorage.getItem("api"),
    //           cidMedia: path,
    //           walletAddr: walletAddr,
    //         }
    //       );
    
    //       console.log("Upload Response:", response.data);
    
    //       alert(response.data.message)
    //       return response.data;
    //     } catch (error: any) {
    //       console.error("Error during upload:", error);
    //       return error?.response?.data;
    //     }
    //   };





    const handleLike = () => {
        sendAnalyticsUpdate('like','');
        
    };

    const handleDislike = () => {
        sendAnalyticsUpdate('dislike','');
    };

    return (
        <div style={{ backgroundColor: "black", height: "auto", width: "100%" }}>
            {/* Header and Navigation Code */}
            <div className="feed-page">
                <div className="advert" onMouseEnter={handleHoverOnAdvert}>
                    <img src={localStorage.getItem("i") ?? ""} alt="advert" />
                </div>
                <div className="my-image">
                    <img src={localStorage.getItem("i") ?? ""} alt="content" />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <div className="button-12" onClick={handleLike}>Like</div>
                    <div className="button-12" onClick={handleDislike}>DisLike</div>
                </div>
            </div>
        </div>
    );
};

export default IndPage;
