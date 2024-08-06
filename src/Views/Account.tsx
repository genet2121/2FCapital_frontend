import React, { useContext, useEffect, useState } from "react";
import BadgeIcon from '@mui/icons-material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import TopNav from "../Components/NavBars/TopNav";
import { isMobile } from "react-device-detect";
import BatterySaverIcon from '@mui/icons-material/BatterySaver';
import AuthContext from "../Contexts/AuthContext";
import ChangePassword from "../Components/ChangePassword";
import AlertContext from "../Contexts/AlertContext";
import { Phone } from "@mui/icons-material";
import SecurityIcon from '@mui/icons-material/Security';

function AccountPage() {

    const { loggedUser, authWaiting, cookies } = useContext(AuthContext);
    const { setAlert } = useContext(AlertContext);

    const [changePassword, setChangePassword] = useState<boolean>(false);

    const initiateChangePassword = () => {
        setChangePassword(!changePassword);
    }

    return (
        <div className="w-100">
            <TopNav />
            <div className="d-flex p-3">
                <div className="col"></div>
                <div className={isMobile ? "col-12" : "col-8"}>
                    <div className="d-flex justify-content-center mb-3">
                        {/* <img alt="image" className="company-logo rounded-circle" src={`${window.location.origin}/images/main_logo.svg`} /> */}
                    </div>

                    <div className="card mb-3">
                        <div className="card-body d-flex">
                            <BadgeIcon sx={{ fontSize: "40px" }} />
                            <div className="w-100 ms-3">
                                <span className="card-subtitle">Name</span>
                                <h5 className="card-title">{loggedUser.FullName}</h5>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-body d-flex">
                            <MailIcon sx={{ fontSize: "40px" }} />
                            <div className="w-100 ms-3" style={{ textOverflow: "ellipsis" }}>
                                <span className="card-subtitle">Email</span>
                                <h5 className="card-title w-100" style={{ textOverflow: "ellipsis" }}>{loggedUser.Email}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="card mb-3">
                        <div className="card-body d-flex">
                            <Phone sx={{ fontSize: "40px" }} />
                            <div className="w-100 ms-3" style={{ textOverflow: "ellipsis" }}>
                                <span className="card-subtitle">Phone</span>
                                <h5 className="card-title w-100" style={{ textOverflow: "ellipsis" }}>{loggedUser.Phone}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="card mb-3">
                        <div className="card-body d-flex">
                            <SecurityIcon sx={{ fontSize: "40px" }} />
                            <div className="w-100 ms-3" style={{ textOverflow: "ellipsis" }}>
                                <span className="card-subtitle">Role</span>
                                <h5 className="card-title w-100" style={{ textOverflow: "ellipsis" }}>{loggedUser.Roles[0]}</h5>
                            </div>
                        </div>
                    </div>

                    <button className={isMobile ? "btn btn-lg btn-primary w-100" : "btn btn-lg btn-primary"} onClick={initiateChangePassword}>Change Password</button>

                </div>
                <div className="col"></div>
            </div>
            {changePassword && (<ChangePassword closer={initiateChangePassword} />)}
        </div>
    );
}

export default AccountPage;