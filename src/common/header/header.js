import { Button } from '@material-ui/core';
import React from 'react';
import "./Header.css";
import logo from "../../assets/logo.svg";
import Authenticator from "../auth/Authenticator";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

// JSS style for button component
const useStyles = makeStyles({
    root: {
        marginLeft: "10px",
        float: "right"
    }
});


function Header(props) {
    // States
    const [showLogin, setShowLogin] = React.useState(false);
    const [showloginButton, setShowLoginButton] = React.useState(false);
    const [showLogoutButton, setShowLogoutButton] = React.useState(false);
    const [showBookShowButton, setShowBookShowButton] = React.useState(false);
    const { id } = useParams();
    const history = useHistory();
    const classes = useStyles();

    React.useEffect(() => {
        // Hide or show bookSho button depending upon the prop value
        setShowBookShowButton(props.showBookingButton);
        // Depending upon the access-token key the login or logout button should be displayed
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
        // If user has logged in go to the bookshow page else open the login dialog
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
        // Logout the user, if successful logout remove the user-details and access-token keys from session storage.
        try {
            const rawResponse = await fetch(props.baseUrl + "auth/logout", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${window.sessionStorage.getItem("access-token")}`
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
            {/* Used JSS styling because the margin style had no effect on the buttons*/}
            {showloginButton && <Button variant="contained" className={classes.root} onClick={showLoginDialogHandler}>Login</Button>}
            {showLogoutButton && <Button variant="contained" className={classes.root} onClick={logoutUserHandler}>Logout</Button>}
            {showBookShowButton && <Button variant="contained" color="primary" className={classes.root} onClick={showBooking}>Book Show</Button>}
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