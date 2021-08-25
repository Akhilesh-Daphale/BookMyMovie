import { Button } from '@material-ui/core';
import React from 'react';
import "./Header.css";
import logo from "../../assets/logo.svg";
import Authenticator from "../auth/Authenticator";
import { useParams, useHistory } from "react-router-dom";


function Header(props) {
    const [showLogin, setShowLogin] = React.useState(false);
    const [showloginButton, setShowLoginButton] = React.useState(false);
    const [showLogoutButton, setShowLogoutButton] = React.useState(false);
    const [showBookShowButton, setShowBookShowButton] = React.useState(false);
    const { id } = useParams();
    const history = useHistory();

    React.useEffect(() => {
        setShowBookShowButton(props.showBookingButton);
        if(window.sessionStorage.getItem("access-token"))
            showLogoutButtonHandler();
        else
            showLoginButtonHandler();
    }, []);

    const showLoginDialogHandler = () => {
        setShowLogin(true);
    }

    const hideLoginDialogHandler = () => {
        setShowLogin(false);
    }

    const showBooking = () => {
        if(window.sessionStorage.getItem("access-token"))
            history.push("/bookshow/" + id);    
        else
            setShowLogin(true);
    }

    const showLogoutButtonHandler = () => {
        setShowLogoutButton(true);
        setShowLoginButton(false);
    }

    const showLoginButtonHandler = () => {
        setShowLogoutButton(false);
        setShowLoginButton(true);
    }

    const logoutUserHandler = async () => {
        try {
            const rawResponse = await fetch(props.baseUrl + "auth/logout", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: "Bearer " + sessionStorage.getItem("access-token")
                }
            });

            if(rawResponse.ok) {
                window.sessionStorage.removeItem("user-details");
                window.sessionStorage.removeItem("access-token");
                showLoginButtonHandler();
            } else {
                const error = new Error();
                error.message = data.message || 'Something went wrong.';
                throw error;
            }
        } catch(e) {
            alert(`Error: ${e.message}`);
        }
    }

    return (
        <div className="header">
            <img className="logo" src={logo} alt="logo"/>
            {/* Used inline styling because the external styling had no effect on component */}
            {showloginButton && <Button className="header-btn" variant="contained" style={{marginLeft: 10}} onClick={showLoginDialogHandler}>Login</Button>}
            {showLogoutButton && <Button className="header-btn" variant="contained" style={{marginLeft: 10}} onClick={logoutUserHandler}>Logout</Button>}
            {showBookShowButton && <Button className="header-btn" variant="contained" color="primary" style={{marginLeft: 10}} onClick={showBooking}>Book Show</Button>}
            <Authenticator 
                showLoginDialog={showLogin} 
                hideLoginDialog={hideLoginDialogHandler} 
                baseUrl={props.baseUrl} 
                showLogoutButton={showLogoutButtonHandler}
            />
        </div>
    );
}

export default Header;