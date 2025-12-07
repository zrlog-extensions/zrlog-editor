import React, { useEffect, useState } from "react";
import { getEditorRes } from "./lang/editor-lang";

interface TimeAgoProps {
    timestamp: number; // 传入的毫秒时间戳
}

const updateTimeAgo = (timestamp: number) => {
    const now = new Date().getTime();
    const secondsPast = (now - timestamp) / 1000;

    if (secondsPast < 60) {
        return getEditorRes("justNow");
    } else if (secondsPast < 3600) {
        return `${Math.round(secondsPast / 60)}${getEditorRes("xMinutesAgo")}`;
    } else if (secondsPast <= 86400) {
        return `${Math.round(secondsPast / 3600)}${getEditorRes("xHourAgo")}`;
    } else {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }
};

const TimeAgo: React.FC<TimeAgoProps> = ({ timestamp }) => {
    const [timeAgo, setTimeAgo] = useState<string>(updateTimeAgo(timestamp));

    useEffect(() => {
        // 设置定时器每分钟更新时间
        const intervalId = setInterval(() => {
            setTimeAgo(updateTimeAgo(timestamp));
        }, 1000);
        // 清除定时器
        return () => clearInterval(intervalId);
    }, [timestamp]);

    return <span style={{ whiteSpace: "pre" }}>{timeAgo}</span>;
};

export default TimeAgo;
