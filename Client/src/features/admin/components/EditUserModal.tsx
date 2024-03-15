/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import { FaEdit, FaEye, FaEyeSlash, FaPlusCircle } from 'react-icons/fa';
import { createUser, updateUser } from '../../../shared/services/users.service';
import { Alert, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { listifyErrors } from '../../../shared/utils/responseHelpers';
import { UserModel } from '../../../shared/models/user.model';

/**
 * User creation modal
 * @param param0 
 * @returns 
 */
function EditUserModal({callback, user = undefined}: {callback: Function, user?:UserModel}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [visible, setVisible] = useState(false);

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorAlertBody, setErrorAlertBody] = useState<any>({});

    /**
     * Handler to display the modal
     * @param e 
     */
    const handleShow = (e: any) => {
        e.preventDefault();
        setUsername(user? user.username : '');
        setPassword('');
        setConfirmPassword('');
        setShowErrorAlert(false);
        setVisible(true);
    };

    /**
     * Handler to dismiss the modal
     */
    const handleCancel = () => {
        setVisible(false);
    };

    /**
     * Handler to save the user
     * @returns 
     */
    const handleConfirm = async () => {
        if (!username)
            return;
        try {
            const response = await (user?updateUser(user.id, username, password, confirmPassword) : createUser(username, password, confirmPassword));
            if(response === undefined) {
                setErrorAlertBody({error: "Malformed Data?"});
                setShowErrorAlert(true);
            } else {
                if (response.ok) {
                    setVisible(false);
                    callback();
                } else {
                    const json = await response.json();
                    setErrorAlertBody(json);
                    setShowErrorAlert(true);
                }
            }
        } catch (e) {
            setErrorAlertBody({error: `${e}`});
            setShowErrorAlert(true);
            console.error(`Failed to ${user?"update":"create"} user: `, e);
        }
    };

    return (
        <>
        <Button variant="outline-secondary" size='sm' onClick={handleShow}>{user? <FaEdit/> :<FaPlusCircle/>}</Button>

        <Modal
            show={visible}
            onHide={handleCancel}
            backdrop="static"
            centered>
            <Modal.Header closeButton>
                <Modal.Title>{user?"Edit":"Create"} User</Modal.Title>
            </Modal.Header>
            <Modal.Body 
                onKeyDown={(e) => {
                    if (e.code === "Enter") {
                    e.preventDefault();
                    handleConfirm();
                    }
                }}>
            { showErrorAlert &&
            <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <ul>{listifyErrors(errorAlertBody)}</ul>
            </Alert>}
            <Form>
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
            </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default EditUserModal;