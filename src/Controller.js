import React from 'react';
import { Fragment } from 'react';
import Header from "./common/header/Header";
import Authenticator from "./common/auth/Authenticator";


function Controller() {
    const [showLogin, setShowLogin] = React.useState(false);

    const showLoginDialogHandler = () => {
        setShowLogin(true);
    }

    const hideLoginDialogHandler = () => {
        setShowLogin(false);
    }

    return (
        <Fragment>
            <Header showLoginDialog={showLoginDialogHandler}></Header>
            <Authenticator show={showLogin} hideLoginDialog={hideLoginDialogHandler}></Authenticator>
        </Fragment>
    );
}

export default Controller;