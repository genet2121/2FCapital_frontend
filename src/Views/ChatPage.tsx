import { IconButton } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import AlertContext from "../Contexts/AlertContext";
import { Menu, Person, Send, SupportAgent } from "@mui/icons-material";
import SocketContext from "../Contexts/SocketContext";
import AuthContext from "../Contexts/AuthContext";
import MainAPI from "../APIs/MainAPI";
import Operators from "../Enums/Operators";
import FieldTypes from "../Enums/FiedTypes";
import Utils from "../Models/Utils";
// import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { props } from "../APIs/api";

function ChatPage() {

    const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
    const { cookies } = useContext(AuthContext);
    const { sendMessage, onlineUsers, serverMessage, markAsRead, unreadMessages } = useContext(SocketContext);
    const [chats, setChats] = useState<any[]>([]);
    const [text, setText] = useState<string>("");
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [userOrders, setUserOrders] = useState<any[]>([]);
    const [attachedFiles, setAttachedFiels] = useState<{index: number, name: string, file: any, extension: string}[]>([]);


    useEffect(() => {
        loadMessages();
        loadOrders();
        if(currentUser) {
            markAsRead(currentUser.Id);
        }
    }, [currentUser]);

    useEffect(() => {
        console.log("user check condition ", currentUser, serverMessage);
        if(currentUser && serverMessage && currentUser.Id == serverMessage.from) {
            loadMessages();
            markAsRead(currentUser.Id);
        }
    }, [serverMessage]);

    const loadMessages = async () => {
        if(currentUser) {

            let messages = await MainAPI.getAll(cookies.login_token, "message", 1, 100, {
                chatId: {
                    operator: Operators.IS,
                    type: FieldTypes.TEXT,
                    value: `${currentUser.Id}`
                }
            });
    
            setChats(messages.Items);
            setTimeout(() => {
                scrollToBottom();
            }, 50);

        }
    }

    const loadOrders = async () => {
        if(currentUser) {

            let found_orders = await MainAPI.getAll(cookies.login_token, "order", 1, 100, {
                userId: {
                    operator: Operators.IS,
                    type: FieldTypes.NUMBER,
                    value: parseInt(currentUser.Id)
                }
            });
    
            setUserOrders(found_orders.Items);

        }
    }

    const sendMsg = () => {

        if((text != "" || attachedFiles.length > 0) && currentUser) {

            sendMessage({
                token: cookies.login_token,
                status: "incoming",
                attachments: attachedFiles,
                to: `${currentUser.Id}`,
                message: text
            });

            setChats(chts => [...chts, { message: text, attachments: attachedFiles, boat: 1, date: new Date().toISOString() }]);
            setText("");
            setAttachedFiels([]);
            setTimeout(() => {
                scrollToBottom();
            }, 10);

        }
    }

    function scrollToBottom() {
        const chatContainer = document.getElementById("chat-container");
        if(chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    const addAttachment = (event: any) => {

        let fileSize = (event.target.files[0].size / (1024 * 1024)).toFixed(2);

        if(parseInt(fileSize) > 2) {
            setAlert("No more than 2MB file is allowed!", "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event1: any) {
            let name_arr = event.target.files[0].name.split(".");
            setAttachedFiels(af => [...af, {
                index: af.length,
                name: event.target.files[0].name,
                file: event1.target.result,
                extension: name_arr[name_arr.length - 1]
            }]);
        };
        reader.readAsDataURL(event.target.files[0]);
    
    };

    const removeAttachment = (indx: number) => {
        let temp_af = attachedFiles.filter(af => (af.index != indx));
        setAttachedFiels(af => temp_af);
    };
    
    return (
        <div className="d-flex w-100 h-100" style={{position: "relative"}}>
            <div className="col-3 h-100 border-end" style={{display: "flex", flexDirection: "column"}}>
                <div className=" d-flex justify-content-start p-3 align-items-center" style={{height: "10%"}}>
                    <div className="me-3">
                        <IconButton onClick={() => { setMenu(true) }}>
                            <Menu sx={{fontSize: 30}} />
                        </IconButton>
                    </div>
                    <h5 className="card-title">All Chats</h5>
                </div>
                <div className="w-100 h-100 p-0" style={{overflow: "hidden auto"}}>

                    {
                        (onlineUsers.length > 0) ? (
                        onlineUsers.map(usr => (
                            <div className={`border-bottom w-100 ${(currentUser && usr.Id == currentUser.Id) ? "bg-secondary" : "bg-white"}`} style={{cursor: "pointer"}} onClick={() => {setCurrentUser(usr)}}>
                                <div className="px-3 py-2 d-flex align-items-center">
                                    <Person sx={{fontSize: 30}}/>
                                    <div className="d-flex w-100 ms-3">
                                        <div className="w-100">
                                            <h5 className="card-title mb-0">{usr.FullName} </h5>
                                            <span className="card-subtitle text-muted mb-0">customer</span>
                                        </div>
                                        {
                                            (unreadMessages.filter(ms => (parseInt(ms.chatId) == usr.Id)).length > 0) ? (
                                                <div>
                                                    <span className="badge text-bg-dark">{unreadMessages.filter(ms => (parseInt(ms.chatId) == usr.Id)).length}</span>
                                                </div>
                                            ) : ""
                                        }
                                    </div>
                                </div>
                            </div>
                        ))): (
                            <div className="card shadow-sm mt-4" >
                                <div className="card-body d-flex align-items-center">
                                    <div className="w-100 ms-3">
                                        <span className="card-subtitle text-muted mb-0">No online User</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                </div>

            </div>
            <div className="col h-100 chat_container border-end">
                <div className="border-bottom bg-white p-3 d-flex justify-content-start align-items-center">
                    <div className="me-3">
                        <IconButton>
                            <Person sx={{fontSize: 30}} />
                        </IconButton>
                    </div>
                    <h5 className="card-title">{currentUser ? currentUser.FullName : "No Conversation Selected"}</h5>
                </div>
                <div className="h-100 border-bottom w-100" id="chat-container" style={{ overflow: "auto", borderTop: "2px solid yellow"}}>

                    <div className="w-100 justify-content-end pt-3" style={{display: "flex", flexDirection: "column", borderTop: "5px solid green", minHeight: "100%", height: "max-content"}}>
                        {
                            chats.map(cht => (cht.boat == 0) ? (
                                <div key={cht.id} className="d-flex px-3 justify-content-start w-100 mb-3"  >
                                    <div className="rounded-circle d-flex bg-dark me-3 mt-auto" style={{width: "70px", height: "70px"}}>
                                        <Person sx={{margin: "auto", fontSize: 30, color: "white"}} />
                                    </div>
                                    <div className="chat_message_container mb-3 py-3 px-3 shadow-sm" style={{borderBottomLeftRadius: 0}}>
                                        <div>
                                            {
                                                cht.attachments.map((att: any) => (
                                                    <div className="d-flex mb-2">
                                                        <div className="me-3" style={{width: 'max-content'}}>
                                                            <a
                                                                style={{textDecoration: "none"}}
                                                                className="text-dark"
                                                                href={att.id ? `${props.baseURL}file/${att.id}` : att.file}
                                                                download={att.name}
                                                            >
                                                                <InsertDriveFileIcon sx={{fontSize: "50px"}} />
                                                            </a>
                                                        </div>
                                                        <div className="col">{att.name}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <p className="lead mb-1" style={{whiteSpace: "pre-wrap"}}>{cht.message}</p>
                                        <div className="text-muted" style={{fontSize: "13px"}}>{Utils.convertISOToDate(cht.date)}</div>
                                    </div>
                                </div>
                            ) : (
                                <div key={cht.id} className="px-3 py-3 d-flex justify-content-end w-100 mb-3" >
                                    <div className="chat_message_container py-3 px-3 mb-3 shadow-sm" style={{borderBottomRightRadius: 0}}>
                                        <div>
                                            {
                                                cht.attachments.map((att: any) => (
                                                    <div className="d-flex mb-2">
                                                        <div className="me-3" style={{width: 'max-content'}}>
                                                            <a
                                                                style={{textDecoration: "none"}}
                                                                className="text-dark"
                                                                href={att.id ? `${props.baseURL}file/${att.id}` : att.file}
                                                                download={att.name}
                                                            >
                                                                <InsertDriveFileIcon sx={{fontSize: "50px"}} />
                                                            </a>
                                                        </div>
                                                        <div className="col">{att.name}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <p className="lead mb-1" style={{whiteSpace: "pre-wrap"}}>
                                            {cht.message}
                                        </p>
                                        <div className="text-muted text-end" style={{fontSize: "13px"}}>{Utils.convertISOToDate(cht.date)}</div>
                                    </div>
                                    <div className="rounded-circle d-flex bg-dark ms-3 mt-auto" style={{width: "70px", height: "70px"}}>
                                        <SupportAgent sx={{margin: "auto", fontSize: 30, color: "white"}} />
                                    </div>
                                </div>
                            ))
                        }
                        
                    </div>

                </div>
                <div className="px-3 py-3 w-100 d-flex justify-content-end" >
                    <div className="chat_message_input_container py-3 px-4 shadow">
                        <div className="w-100" style={{overflow: "auto"}}>
                            <div style={{display: "flex", flexDirection: "row"}}>
                                {
                                    attachedFiles.map(af => (
                                        <span key={`attachment_${af.index}`} className="rounded-5 bg-white shadow-sm me-3 mb-3 px-3 py-2 d-flex">
                                            {
                                                (["png", "jpeg", "jpg", "gif"].includes(af.extension.toLowerCase())) ? (
                                                    <img src={af.file} alt={af.name} style={{width: "30px", height: "auto", marginRight: "10px"}} />
                                                ) : (<InsertDriveFileIcon sx={{ marginRight: "10px", fontSize: 30, color: "black" }} />)
                                            }
                                            {af.name.length > 20 ? af.name.substring(0, 20) : af.name}
                                            <CloseIcon sx={{ marginLeft: "10px", fontSize: 20, color: "red" }} onClick={() => {removeAttachment(af.index)}} />
                                        </span>
                                    ))
                                }
                            </div>
                        </div>
                        <input type="file" style={{display: "none"}} id="file_attachment_input" onChange={addAttachment}/>
                        <div className="d-flex">
                            <textarea
                                value={text}
                                name="message"
                                rows={1}
                                className="chat_message_input_container_textarea"
                                style={{height: (text.length < 115 ? "40px" : (text.length < 172 ? "60px" : "90px"))}}
                                onChange={(event: any) => {if(event.target.value.length < 253){setText(event.target.value);}}}
                            />
                            <AttachFileIcon
                                sx={{marginLeft: "5px", fontSize: 30, color: "black"}}
                                onClick={() => {document.getElementById("file_attachment_input")?.click()}}
                            />
                        </div>
                    </div>
                    <div className="rounded-circle d-flex bg-dark ms-3" style={{width: "80px", height: "70px"}} onClick={() => {sendMsg()}}>
                        <Send sx={{margin: "auto", fontSize: 30, color: "white"}} />
                    </div>
                </div>
            </div>
            {
                (currentUser) && (
                    <div className="col-3 h-100 p-3"  style={{display: "flex", flexDirection: "column"}}>
                        <div className="d-flex w-100 mb-3">
                            <img src="./images/user_avatar.png" alt="profile pic" className="rounded-circle mx-auto" style={{width: "50%", height: "auto"}} />
                        </div>
                        <h4 className="card-title mb-1">Name: {currentUser.FullName}</h4>
                        <h4 className="card-title mb-3">Phone: {currentUser.Phone}</h4>
                        <h4 className="card-title mb-3">Email: {currentUser.Email}</h4>
                        <h4 className="card-title">Orders</h4>
                        <hr />
                        <div className="h-100 w-100" style={{overflow: "hidden auto"}}>

                            {
                                (userOrders.length > 0) ? (
                                    userOrders.map(uord => (
                                        <div className="card mb-2">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between">
                                                    <h4 className="card-title mb-0">{uord.number}</h4>
                                                    <h5 className="card-title text-muted mb-0">{(uord.price && uord.price != "") ? `${uord.price}ETB` : "Not Set"}</h5>
                                                </div>
                                                <span className="card-subtitle">Status: {uord.state}</span><br/>
                                                <span className="card-subtitle">Request Date: {Utils.convertISOToDate(uord.date)}</span><br/>
                                                <span className="card-subtitle">Warranty Date: {Utils.convertISOToDate(uord.warrantyDate)}</span><br/>
                                                <hr/>
                                                <button
                                                    className="btn btn-sm btn-primary me-3"
                                                    onClick={() => {window.open(`${window.location.origin}/form/tbl_order/${uord.id}`);}}
                                                >
                                                    Open
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="card shadow-sm mb-4" >
                                        <div className="card-body d-flex align-items-center">
                                            <div className="w-100 ms-3">
                                                <span className="card-subtitle text-muted mb-0">No Orders Found</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default ChatPage;