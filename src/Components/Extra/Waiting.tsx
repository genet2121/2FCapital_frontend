import React from "react";

function Waiting(){

    let style1 = {
        display: "flex",
        justifyContent: "center",
        background: "rgba(122,122,122,0.49)",
        width: "100vw",
        height: "100vh",
        position: "absolute",
        zIndex: "1010",
        top: 0,
        left: 0
    };

    let style2 = {
        background: "white",
        width: "max-content",
        padding: "10px",
        marginTop: "auto",
        marginBottom: "15px",
        borderRadius: "10px",
        boxShadow: "0 0 10px 1px",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translateX(-50%) translateY(-50%)"
    }
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            background: "rgba(122,122,122,0.49)",
            width: "100vw",
            height: "100vh",
            position: "absolute",
            zIndex: "1010",
            top: 0,
            left: 0
        }}>
            <div style={{
                background: "white",
                width: "max-content",
                padding: "10px",
                marginTop: "auto",
                marginBottom: "15px",
                borderRadius: "10px",
                boxShadow: "0 0 10px 1px",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translateX(-50%) translateY(-50%)"
            }}>
                {/* <img src="/images/keno_ball.png" alt="image" /> */}
                <div className="text-center mb-0 mt-2" style={{textAlign: "center", marginBottom: 0, marginTop: "10px", fontSize: "15px"}}>Processing...</div>
                {/* <div className="loading_parent">
                    <div className="loading_child"></div>
                </div> */}
            </div>
        </div>
    );
}

export default Waiting;