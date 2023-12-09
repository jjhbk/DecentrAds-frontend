import React, { useEffect, useState, useRef } from "react";

import "./home.css";
import "./header.css";
//import { useNavigate } from "react-router-dom";

const IndPage: React.FC = () => {
    const [startTime] = useState(Date.now());
    //const navigate = useNavigate();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const sendAnalyticsUpdate = (updateType: string, additionalData: Record<string, any> = {}) => {
      
      
        console.log(updateType)
        console.log(additionalData)
        // Replace with your analytics endpoint and correct payload structure
        // fetch('http://yourserver.com/updateAnalytics', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         page: 'IndPage',
        //         updateType,
        //         ...additionalData
        //     })
       // });
    };

    const trackTotalTime = () => {
        const totalTime = Date.now() - startTime;
        sendAnalyticsUpdate('totalTime', { totalTime });
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
        sendAnalyticsUpdate('hoverOnAdvert');
    };

    const handleLike = () => {
        sendAnalyticsUpdate('like');
    };

    const handleDislike = () => {
        sendAnalyticsUpdate('dislike');
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
