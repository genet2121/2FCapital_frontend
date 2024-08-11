import React, { useState } from "react";

function SidebarItem({Icon, text, open, method}: {Icon: any, text: string, open: boolean, method: any}) {

    // icon.sx = ();
    // icon.onClick = method;

    const [style, setStyle] = useState({
        background: "transparent",
        display: "flex",
        alignItems: "center",
        width: "max-width",
        height: "max-height",
        borderRadius: "5px",
        padding: "8px",
        marginBottom: "5px",
        transitionDuration: "0.5s",
        cursor: "pointer"
    });

    const onHover = () => {
        setStyle({...style, background: "#00ABFF"});
    }

    const onBlur = () => {
        setStyle({...style, background: "transparent"});
    }

    return (
        <div style={style} onMouseEnter={onHover} onMouseLeave={onBlur} onClick={method}>
            <Icon 
                sx={open ? { marginRight: "10px", fontSize: "17px" } : { marginLeft: "-3px", fontSize: "17px" }}
            />
            <h6 style={{display: (open ? "" : "none"), fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", fontWeight: "normal", fontSize: "14px", margin: 0}}>{text}</h6>
        </div>
    );
}

export default SidebarItem;