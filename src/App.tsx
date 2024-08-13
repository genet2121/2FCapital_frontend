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
import SignUpPage from "./Views/SignUp";
import MiniDrawer from "./Views/Dashboard";
import UserTable from "./Views/UserTable";
import Workspace from "./Views/Workspace";
import SuccessDialog from "./Components/Reusables/SucessDilog";
import OwnerTable from "./Views/OwnerTab";
import AvailableBooks from "./Views/AvalableBooks";
import AbilityContext from "./Contexts/AbilityContext";
import Authorization from "./Models/Authorization";
import MainScreen from "./Views/MainScreen";
import NewRent from "./Views/NewRent";
import BookTable from "./Views/BookTable";
import RentTable from "./Views/RentTable";

function App(params: any) {

    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const [loggedUser, setLoggedUser] = useState<null | AuthResult>(null);
    const [cookies, setCookie, removeCookie] = useCookies(["login_token"]);
    const [authWaiting, setAuthWaiting] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showWaiting, setWaiting] = useState<boolean>(false);
    const [alertType, setAlertType] = useState<"success" | "error" | "warning" | "info">("info");
    const [alertMessage, setMessage] = useState<string>("");
    const [menu, setMenu] = useState<boolean>(true);


    const [ability, setAbility] = useState<any>(null);

    useEffect(() => {

        const checkAuth = async (token: string) => {

            setTimeout(() => { setAuthWaiting(true); }, 1);
            setTimeout(() => { setWaiting(true); }, 1);
            let response = await information(token);
            setLoggedIn(response.status);
            setLoggedUser(response.data);
            setAbility(Authorization(response.data));
            // await loadLocalData();
            setTimeout(() => { setAuthWaiting(false); }, 10);
            setTimeout(() => { setWaiting(false); }, 10);

        };

        if (cookies.login_token && cookies.login_token != "") {
            checkAuth(cookies.login_token);
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

    return (
        <AbilityContext.Provider value={ability}>
            <AlertContext.Provider value={{ showAlert, alertType, setAlertType, setAlert, setWaiting, menu, setMenu }}>
                <AuthContext.Provider value={{
                    isLoggedIn, loggedUser, setLoggedUser, setLoggedIn, setCookie, cookies, removeCookie, authWaiting, setAbility
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
                                            <Route path="success" element={<SuccessDialog />}/>
                                            <Route path="owner" element={<OwnerTable />}/>
                                            <Route path="new_rent" element={<NewRent />}/>
                                            <Route path="book" element={<BookTable />}/>
                                            <Route path="rents" element={<RentTable />}/>
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
                </AuthContext.Provider>
            </AlertContext.Provider>
        </AbilityContext.Provider>
    );

}

export default App;