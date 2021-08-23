import { Button } from '@material-ui/core';
import React from 'react';
import "./Header.css";
import logo from "../../assets/logo.svg";


function Header(props) {
    // State for hiding button
    // const[show, setShow] = React.useState(true); 

    React.useEffect(() => {
        // Logo will start rotating after 8 seconds infinitely on y axis
        setInterval(() => {
            document.getElementsByClassName("logo")[0].classList.toggle("logo-animate");
        }, 8000);
    })

    const showLogin = () => {
        props.showLoginDialog();
    }

    return (
        <div className="header">
            <img className="logo" src={logo} alt="logo"/>
            {/* Used inline styling because the external styling had no effect on component */}
            <Button className="header-btn" variant="contained" style={{marginLeft: 10}} onClick={showLogin}>Login</Button>
            <Button className="header-btn" variant="contained" style={{marginLeft: 10}}>Logout</Button>
            <Button className="header-btn" variant="contained" color="primary" style={{marginLeft: 10}}>Book Show</Button>
            {/* 
            Logic to hide button
            {show && <Button className="header-btn" variant="contained" color="primary" style={{marginLeft: 10}} onClick={() => setShow(!show)}>Book Show</Button>} 
            */}
        </div>
    );
}


export default Header;