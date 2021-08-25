import React from 'react';
import { Fragment } from 'react';
import Header from "./common/header/Header";
import Home from "./screens/home/Home";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import BookShow from "./screens/bookshow/BookShow";
import Confirmation from "./screens/confirmation/Confirmation";
import Details from "./screens/details/Details";


function Controller() {
    const baseUrl = "/api/v1/";

    React.useEffect(() => {
        // Logo will start rotating after 8 seconds infinitely on y axis
        setInterval(() => {
            document.getElementsByClassName("logo")[0].classList.toggle("logo-animate");
        }, 8000);
    })

    return (
        <Fragment>
            <Router>
                <Switch>
                    <Route exact path="/" render={(props) => <Home {...props} baseUrl={baseUrl} />} />
                    <Route exact path="/movie/:id" render={(props) => <Details {...props} baseUrl={baseUrl} />} />
                    <Route exact path="/bookshow/:id" render={(props) => <BookShow {...props} baseUrl={baseUrl} />} />
                    <Route exact path="/confirm/:id" render={(props) => <Confirmation {...props} baseUrl={baseUrl} />} />
                </Switch>
            </Router>  
        </Fragment>
    );
}

export default Controller;