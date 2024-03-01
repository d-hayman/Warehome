/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { Alert, Button, Form, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from '../../assets/styles/LoginSignup.module.css';
import { signup } from "../../shared/services/auth.service";
import { useNavigate } from "react-router-dom";
import { listifyErrors } from "../../shared/utils/responseHelpers";
import { hasUsers } from "../../shared/services/utils.service";

/**
 * 
 * @returns 
 */
function SignupPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorAlertBody, setErrorAlertBody] = useState<any>({});

    const navigate = useNavigate();

    //redirect effect
    useEffect(() => {
        /**
         * Handles navigation back to the login page once it's
         * determined that a user already exists
         */
        const checkUsers = async () => {
            try{
                let _hasUsers = await hasUsers();
                if(_hasUsers){
                    navigate("/");
                }
            } catch(e){
                setErrorAlertBody({error: `${e}`});
                setShowErrorAlert(true);
            }
        }

        checkUsers();
    }, [])

    /**
     * Handles the signup action
     * @param e form submission event
     * @returns void
     */
    const doSignup = async (e:any) => {
        e.preventDefault();
        if (!username || !password)
            return;
        try {
            const response = await signup(username, password, confirmPassword);
            if (response.ok) {
                navigate("/");
            } else {
                const json = await response.json();
                setErrorAlertBody(json);
                setShowErrorAlert(true);
            }
        } catch (e) {
            setErrorAlertBody({error: `${e}`});
            setShowErrorAlert(true);
            console.error("Failed to create user: ", e);
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
            <Form onSubmit={doSignup}>
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
                <Form.Group className="mb-3" controlId="passwordInput">
                    <Form.Label>Confirm Password:</Form.Label>
                    <InputGroup>
                        <Form.Control 
                            type={showPassword ? "text" : "password"} 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                        <Button onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash/> : <FaEye/>}
                        </Button>
                    </InputGroup>
                </Form.Group>
                <Button type="submit" className={styles.submit_button}>
                    Sign Up
                </Button>
            </Form>
        </Paper>
    </div>)
}

export default SignupPage;