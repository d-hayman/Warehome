/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { Alert, Button, Form, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from '../../assets/styles/LoginSignup.module.css';
import { login } from "../../shared/services/auth.service";
import { useNavigate } from "react-router-dom";
import { hasUsers } from "../../shared/services/utils.service";
import { listifyErrors } from "../../shared/utils/responseHelpers";

/**
 * Login form component
 * @returns JSX.Element for the login form
 */
function LoginPage(){
    const [loggedInAs, setLoggedInAs] = useState(localStorage.getItem("loggedInAs")??'');

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorAlertBody, setErrorAlertBody] = useState<any>({});

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    //redirect effect for setup
    useEffect(() => {
        /**
         * Handles navigation to the signup page once it's
         * determined that the first user needs to be created
         */
        const checkUsers = async () => {
            try{
                let _hasUsers = await hasUsers();
                if(!_hasUsers){
                    navigate("/signup");
                }
            } catch(e){
                setErrorAlertBody({error: `${e}`});
                setShowErrorAlert(true);
            }
        }

        checkUsers();
    }, [])

    //redirect effect for login
    useEffect(() => {
        /**
         * Handles navigation to the dashboard once it's 
         * determined if a user is already logged in
         */
        const handleRedirect = () => {
            if(loggedInAs.length > 0){
                navigate("/dashboard")
            }
        }

        handleRedirect();
    }, [loggedInAs])

    /**
     * handles the login action
     * @param e form submission event
     * @returns void
     */
    const doLogin = async (e:any) => {
        e.preventDefault();
        if (!username || !password)
            return;
        try {
            const success = await login(username, password);
            if (success) {
                setLoggedInAs(username);
            } else {
                setErrorAlertBody({error:"Incorrect username or password"});
                setShowErrorAlert(true);
            }
        } catch (e) {
            console.error("Failed to login: ", e);
        }
    };
    
    return (
    <div className={styles.form_outer}>
        <Paper className={styles.form_box}>
            { showErrorAlert &&
                <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    <ul>{listifyErrors(errorAlertBody)}</ul>
                </Alert>}
            <h1 className={styles.form_title}>WAREHOME</h1>
            <Form onSubmit={doLogin}>
                <Form.Group className="mb-3" controlId="usernameInput">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="passwordInput">
                    <Form.Label>Password:</Form.Label>
                    <InputGroup>
                        <Form.Control 
                            type={showPassword ? "text" : "password"} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <Button onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash/> : <FaEye/>}
                        </Button>
                    </InputGroup>
                </Form.Group>
                <Button type="submit" className={styles.submit_button}>
                    Login
                </Button>
            </Form>
        </Paper>
    </div>)
}

export default LoginPage