import Alert from "@mui/material/Alert";
import React from "react";

export default function (props: {
    message: string,
    color: "success"|"error"|"warning"|"info"
}){
    return (
        <div style={{
            background: "transparent",
            maxWidth: "100%",
            width: "max-content",
            height: "max-content",
            zIndex: 1020,
            padding: 0,
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)"
        }}>
            <Alert variant="filled" severity={props.color}>
                {props.message}
            </Alert>
        </div>
    );

}