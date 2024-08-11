import React, { createContext, useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, information } from "./APIs/AuthAPI";
import AuthContext from "./Contexts/AuthContext";
import AlertContext from "./Contexts/AlertContext";
import Alert from "./Components/Extra/Alert";
import Waiting from "./Components/Extra/Waiting";
import { useCookies } from "react-cookie";
import Error from "./Views/Error";
import LoginPage from "./Views/Login";
import AuthResult from "./Intefaces/AuthResult";
import LocalData from "./Intefaces/LocalData";
import MainAPI from "./APIs/MainAPI";
import IServerResponse from "./Intefaces/IServerResponse";
import SocketContext from "./Contexts/SocketContext";
import FieldTypes from "./Enums/FiedTypes";
import Operators from "./Enums/Operators";
import UserRoles from "./Enums/UserRoles";
import Utils from "./Models/Utils";
import SignUpPage from "./Views/SignUp";
import MiniDrawer from "./Views/TestPage";
import UserTable from "./Views/UserTable";
import Workspace from "./Views/Workspace";
import Chalenge from "./Views/Chalenge2";
import SuccessDialog from "./Components/Reusables/SucessDilog";
import OwnerTable from "./Views/OwnerTab";
import AvailableBooks from "./Views/AvalableBooks";
import AbilityContext from "./Contexts/AbilityContext";
import Authorization from "./Models/Authorization";
import MainScreen from "./Views/MainScreen";
import NewRent from "./Views/NewRent";

function App(params: any) {

    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const [loggedUser, setLoggedUser] = useState<null | AuthResult>(null);
    const [cookies, setCookie, removeCookie] = useCookies(["login_token"]);
    const [authWaiting, setAuthWaiting] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showWaiting, setWaiting] = useState<boolean>(true);
    const [alertType, setAlertType] = useState<"success" | "error" | "warning" | "info">("info");
    const [alertMessage, setMessage] = useState<string>("");
    const [menu, setMenu] = useState<boolean>(false);
    const [localData, setLocalData] = useState<LocalData>({
        Users: [],
        Services: [],
        Devices: [],
        Orders: [],
        Repairs: [],
        Technician: []
    });


    const [serverMessage, setServerMessage] = useState<any>(null);
    const [isServerReady, setIsServerReady] = useState<boolean>(false);
    const [socketServer, setSocketServer] = useState<WebSocket | null>(null);
    const [chatInfo, setChatInfo] = useState<any>(null);
    const [chatMessage, setChatMessage] = useState<string>("");
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const [unreadMessages, setUnreadMessages] = useState<any[]>([]);
    const [ability, setAbility] = useState<any>(null);

    const audio_ref = useRef<any>(null);

    useEffect(() => {

        const checkAuth = async (token: string) => {

            setTimeout(() => { setAuthWaiting(true); }, 1);
            setTimeout(() => { setWaiting(true); }, 1);
            let response = await information(token);
            setLoggedIn(response.status);
            setLoggedUser(response.data);
            setAbility(Authorization(response.data));
            await loadLocalData();
            setAuthWaiting(false);
            setTimeout(() => { setWaiting(false); }, 1);

        };

        if (cookies.login_token && cookies.login_token != "") {
            checkAuth(cookies.login_token);
            connectWithServer();
        }

    }, []);

    const setAlert = (
        message: string,
        type: "success" | "error" | "warning" | "info"
    ) => {

        setAlertType(type);
        setShowAlert(true);
        setMessage(message);

        setTimeout(() => {
            setShowAlert(false);
        }, 3000);

    }

    const loadLocalData = async () => {

        let temp_data = localData;
        temp_data.Users = (await MainAPI.forSelectBox(cookies.login_token, "user", "id", "name"));
        temp_data.Technician = (await MainAPI.getAll(cookies.login_token, "user", 1, 200, {
            role: {
                type: FieldTypes.TEXT,
                operator: Operators.IS,
                value: UserRoles.MAINTAINER
            }
        })).Items.map((usr: any) => ({ value: usr.id, label: usr.name }));
        temp_data.Repairs = (await MainAPI.getAll(cookies.login_token, "repair", 1, 200, {})).Items.map((usr: any) => ({ value: usr.id, label: `${usr.orderId} - ${Utils.convertISOToDate(usr.date)}` }));
        temp_data.Devices = (await MainAPI.forSelectBox(cookies.login_token, "device", "id", "name"));
        temp_data.Services = (await MainAPI.forSelectBox(cookies.login_token, "service", "id", "title"));
        temp_data.Orders = (await MainAPI.forSelectBox(cookies.login_token, "order", "id", "number"));
        setLocalData(temp_data);

    }

    const connectWithServer = () => {
        const socket = new WebSocket("wss://nuwamobile.com:7000");
        // const socket = new WebSocket("wss://24.144.96.108:7000");
        // const socket = new WebSocket("ws://192.168.0.101:7000")

        socket.onopen = () => {

            setIsServerReady(true);
            let send_data: any = {
                status: "online",
                token: cookies.login_token
            };

            socket.send(JSON.stringify(send_data));

        };

        socket.onclose = () => setIsServerReady(false);
        socket.onmessage = (event) => receiveServerMessage(event.data);

        setSocketServer(socket);

    }

    const sendServerRequest = (message: any) => {
        socketServer?.send(JSON.stringify(message));
    }

    const receiveServerMessage = (msg: string) => {

        // {"status":"game_start","data":{"BranchId":1,"StartDatetime":1702012764,"CompanyId":2,"IsFinished":1,"Id":381}}
        // {"status":"presence","data":{"elapsedTime":1}}

        let message: IServerResponse = JSON.parse(msg);

        if(message.status == "online") {
            setChatInfo(message.data);
            // setCookie("login_token", message.data.Id, { path: "/" });
        } else if(message.status == "user_disconnected") {
            setOnlineUsers(sou => onlineUsers.filter(ou => (ou.Id != message.data.Id)))
            setChatInfo(message.data);
        } else if(message.status == "new_user") {
            // let temp_usrs = [...onlineUsers, message.data];
            setOnlineUsers(sou => [...onlineUsers, message.data]);
        } else if(message.status == "online_users") {
            setOnlineUsers(sou => message.data)
        } else if(message.status == "incoming") {
            setChatMessage(message.data.message);
            setServerMessage(message);
            message.data.chatId = message.from;
            setUnreadMessages(umsgs => [...umsgs, message.data])
            setAlert(`incomming Message! from ${message.data.Id} content: ${message.data.message.length < 15 ? message.data.message : (message.data.message.substring(0, 15) + "...")}`, "info");
            if(audio_ref.current){
                audio_ref.current.play();
            }
        } else if(message.status == "error") {
            setAlert(message.data, "error");
        }

        // console.log(msg);

    }

    const markAsRead = (chat_id: number) => {
        setUnreadMessages(msgs => (msgs.filter(msg => parseInt(msg.chatId) != chat_id)));
    }

    return (
        <AbilityContext.Provider value={ability}>
            <AlertContext.Provider value={{ showAlert, alertType, setAlertType, setAlert, setWaiting, menu, setMenu }}>
                <AuthContext.Provider value={{
                    isLoggedIn, loggedUser, setLoggedUser, setLoggedIn, setCookie, cookies, removeCookie, authWaiting, localData
                }}>
                    <SocketContext.Provider value={{
                        isReady: isServerReady, unreadMessages, sendMessage: sendServerRequest, chatInfo, chatMessage,
                        server: socketServer, serverMessage, onlineUsers, markAsRead
                    }}>

                        <BrowserRouter>
                            {
                                !authWaiting && (
                                    !isLoggedIn ? (
                                        <Routes>
                                            <Route path="/signup" element={<SignUpPage/>}/>
                                            <Route path="/" element={<LoginPage/>}/>
                                            <Route path="*" element={<Error />} />
                                        </Routes>
                                    ) : (
                                        <Routes>
                                            <Route path="/" element={<MainScreen />}>
                                                <Route path="available_books" element={<AvailableBooks/>}/>
                                                <Route path="" element={<MiniDrawer />}/>
                                                <Route path="user" element={<UserTable />}/>
                                                <Route path="new_book" element={<Workspace />}/>
                                                <Route path="challenge" element={<Chalenge />}/>
                                                <Route path="success" element={<SuccessDialog />}/>
                                                <Route path="owner" element={<OwnerTable />}/>
                                                <Route path="new_rent" element={<NewRent />}/>
                                                <Route path="*" element={<Error />} />
                                            </Route>
                                        </Routes>
                                    )
                                )
                            }
                            {showAlert ? (<Alert message={alertMessage} color={alertType} />) : ""}
                            {showWaiting ? (<Waiting />) : ""}
                            {/* {menu ? (<SideBar />) : ""} */}
                        </BrowserRouter>
                    </SocketContext.Provider>
                </AuthContext.Provider>
            </AlertContext.Provider>
        </AbilityContext.Provider>
    );

}

export default App;