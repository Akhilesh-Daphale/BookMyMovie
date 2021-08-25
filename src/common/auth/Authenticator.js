import React from "react";
import ReactModal from "react-modal";
import {Tabs, Tab, FormControl, InputLabel, Input, Button, FormHelperText} from "@material-ui/core";
import "./Authenticator.css";


function TabPanel(props) {
    const {children, value, index} = props;

    return (
        <React.Fragment>
            {value === index && children}
        </React.Fragment>
    );
}


function Authenticator(props) {

    ReactModal.setAppElement('#root');
    // For tab index
    const [value, setValue] = React.useState(0);
    // For input field values
    const [loginUserName, setLoginUserName] = React.useState("");
    const [loginPassword, setLoginPassword] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [contactNum, setContactNum] = React.useState("");
    // For error message of input fields
    const [reqLoginUsername, setReqLoginUsername] = React.useState("dispNone");
    const [reqLoginPassword, setReqLoginPassword] = React.useState("dispNone");
    const [reqRegisterFirstName, setReqRegisterFirstName] = React.useState("dispNone");
    const [reqRegisterLastName, setReqRegisterLastName] = React.useState("dispNone");
    const [reqRegisterEmail, setReqRegisterEmail] = React.useState("dispNone");
    const [reqRegisterPassword, setReqRegisterPassword] = React.useState("dispNone");
    const [reqRegisterContactNum, setReqRegisterContactNum] = React.useState("dispNone");
    const [successRegisterText, setSuccessRegisterText] = React.useState("dispNone");
    

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const hideLoginDialog = () => {
        clearFields();
        clearErrorMessages();
        setSuccessRegisterText("dispNone");
        props.hideLoginDialog();
    }

    const clearFields = () => {
        setLoginUserName("");
        setLoginPassword("");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setContactNum("");
    }

    const clearErrorMessages = () => {
        setReqLoginUsername("dispNone");
        setReqLoginPassword("dispNone");
        setReqRegisterFirstName("dispNone");
        setReqRegisterLastName("dispNone");
        setReqRegisterEmail("dispNone");
        setReqRegisterPassword("dispNone");
        setReqRegisterContactNum("dispNone");
    }

    const loginUserHandler = async () => {
        loginUserName === "" ? setReqLoginUsername("dispBlock") : setReqLoginUsername("dispNone");
        loginPassword === "" ? setReqLoginPassword("dispBlock") : setReqLoginPassword("dispNone");

        if (loginUserName === "" || loginUserName === "") {
            return;
        }

        // login user
        const param = window.btoa(`${loginUserName}:${loginPassword}`);
        try {
            const rawResponse = await fetch(props.baseUrl + "auth/login", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    authorization: `Basic ${param}`
                }
            });

            const data = await rawResponse.json();
            if(rawResponse.ok) {
                window.sessionStorage.setItem('user-details', JSON.stringify(data));
                window.sessionStorage.setItem('access-token', rawResponse.headers.get('access-token'));
                hideLoginDialog();
                props.showLogoutButton();
            } else {
                const error = new Error();
                error.message = data.message || 'Something went wrong.';
                throw error;
            }
        } catch(e) {
            alert(`Error: ${e.message}`);
        }
    }

    const registerUserHandler = async () => {
        firstName === "" ? setReqRegisterFirstName("dispBlock") : setReqRegisterFirstName("dispNone");
        lastName === "" ? setReqRegisterLastName("dispBlock") : setReqRegisterLastName("dispNone");
        email === "" ? setReqRegisterEmail("dispBlock") : setReqRegisterEmail("dispNone");
        password === "" ? setReqRegisterPassword("dispBlock") : setReqRegisterPassword("dispNone");
        contactNum === "" ? setReqRegisterContactNum("dispBlock") : setReqRegisterContactNum("dispNone");

        if (firstName === "" || lastName === "" || email === "" || password === "" || contactNum === "") {
            return;
        }

        // Register User
        const params = {
            email_address: email,
            first_name: firstName,
            last_name: lastName,
            mobile_number: contactNum,
            password: password
        }

        try {
            const rawResponse = await fetch(props.baseUrl + "signup", {
                body: JSON.stringify(params),
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                }
            });

            const data = await rawResponse.json();
            console.log("did execute");

            if(rawResponse.ok) {
                setSuccessRegisterText("dispBlock");
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
        <ReactModal isOpen={props.showLoginDialog} onRequestClose={hideLoginDialog} className="login-modal">
            <Tabs value={value} onChange={handleChange}>
                <Tab label="Login"/>
                <Tab label="Register"/>
            </Tabs>
            {/* Login */}
            <TabPanel value={value} index={0}>
                <br />
                <FormControl required className="form-control">
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <Input id="username" type="email" value={loginUserName} onChange={(event) => {setLoginUserName(event.target.value)}}></Input>
                    <FormHelperText className={reqLoginUsername}>
                        <span className="red">Required</span>
                    </FormHelperText>
                </FormControl>
                <br />
                <FormControl required className="form-control">
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input id="password" type="password" value={loginPassword} onChange={(event) => {setLoginPassword(event.target.value)}}></Input>
                    <FormHelperText className={reqLoginPassword}>
                        <span className="red">Required</span>
                    </FormHelperText>
                </FormControl>
                <br /><br />
                <Button variant="contained" color="primary" onClick={loginUserHandler}>Login</Button>
                <br />
            </TabPanel>
            {/* Register */}
            <TabPanel value={value} index={1}>
                <br />
                <FormControl required className="form-control">
                    <InputLabel htmlFor="firstname">First Name</InputLabel>
                    <Input id="firstname" type="text" value={firstName} onChange={(event) => {setFirstName(event.target.value)}}></Input>
                    <FormHelperText className={reqRegisterFirstName}>
                        <span className="red">Required</span>
                    </FormHelperText>
                </FormControl>
                <br />
                <FormControl required className="form-control">
                    <InputLabel htmlFor="lastname">Last name</InputLabel>
                    <Input id="lastname" type="text" value={lastName} onChange={(event) => {setLastName(event.target.value)}}></Input>
                    <FormHelperText className={reqRegisterLastName}>
                        <span className="red">Required</span>
                    </FormHelperText>
                </FormControl>
                <br />
                <FormControl required className="form-control">
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <Input id="email" type="email" value={email} onChange={(event) => {setEmail(event.target.value)}}></Input>
                    <FormHelperText className={reqRegisterEmail}>
                        <span className="red">Required</span>
                    </FormHelperText>
                </FormControl>
                <br />
                <FormControl required className="form-control">
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input id="password" type="password" value={password} onChange={(event) => {setPassword(event.target.value)}}></Input>
                    <FormHelperText className={reqRegisterPassword}>
                        <span className="red">Required</span>
                    </FormHelperText>
                </FormControl>
                <br />
                <FormControl required className="form-control">
                    <InputLabel htmlFor="contactnumber">Contact No.</InputLabel>
                    <Input id="contactnumber" type="text" value={contactNum} onChange={(event) => {setContactNum(event.target.value)}}></Input>
                    <FormHelperText className={reqRegisterContactNum}>
                        <span className="red">Required</span>
                    </FormHelperText>
                </FormControl>
                <br />
                <p className={`${successRegisterText} register-text`}>Registration Successful. Please Login!</p>
                <br />
                <Button variant="contained" color="primary" onClick={registerUserHandler}>Register</Button>
                <br />
            </TabPanel>
        </ReactModal>
    );
}

export default Authenticator;