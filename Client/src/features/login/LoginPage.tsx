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

/**
 * Login form component
 * @returns JSX.Element for the login form
 */
function LoginPage(){
    const [hasUsers, setHasUsers] = useState(true);
    const [loggedInAs, setLoggedInAs] = useState(localStorage.getItem("loggedInAs")??'');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [invalidLogin, setInvalidLogin] = useState(false);

    const navigate = useNavigate();

    //redirect effect for login or if signup is needed
    useEffect(() => {
        /**
         * Handles navigation to the signup page or the dashboard once it's determined if
         * A) There are no users on the system yet
         * B) The current user is already logged in
         */
        const handleRedirect = () => {
            if(!hasUsers){
                navigate("/signup");
            }

            if(loggedInAs.length > 0){
                navigate("/dashboard")
            }
        }

        handleRedirect();
    }, [loggedInAs, hasUsers])

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
                setInvalidLogin(true);
            }
        } catch (e) {
            console.error("Failed to login: ", e);
        }
    };
    
    return (<>
        <Paper className={styles.form_box}>
            { invalidLogin &&
                <Alert variant="danger" onClose={() => setInvalidLogin(false)} dismissible>
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    Incorrect username or password
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
    </>)
}

export default LoginPage