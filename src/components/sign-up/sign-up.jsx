import './sign-up.scss';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { postData, validateUsernameField, validatePasswordField, closeModal, createModalContent, setModalAndLoading } from './../../services/services';

import FormInput from './../form-input/form-input.jsx';
import CustomButton from './../button/custom-button';
import Spinner from '../spinner/Spinner';
import Modal from '../modal/modal';


const SignUp = () => {

    const [passwordShown, setPasswordShown] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [modalError, setModalError] = useState(false);
    const [modalContent, setModalContent] = useState({});

    const [errorUser, setErrorUser] = useState({errorState: false, messagge: " Musi zawierać co najmniej 4 znaków"});
    const [errorPassword, setErrorPassword] = useState({errorState: false, messagge: " Musi zawierać co najmniej 8 znaków"});


    const eye = <FontAwesomeIcon icon={faEye} />;
    const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;

    const validateFields = () => {
        let valid = true;
        if (!validatePasswordField(password)) {
            setErrorPassword({...errorPassword, errorState : true});
            valid = false;
        }
        if (!validateUsernameField(username)) {
            setErrorUser({...errorUser, errorState : true});
            valid = false;
        }

        return valid;
    }

    const clearForm = () => {
        setUsername('');
        setPassword('');
    }

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const handleChange = (event, setter) => {
        const {value} = event.target;
        setter(value);
    }

    const clearErrorAfterFocus = (value, setter) => {
        setter({...value, errorState: false});
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        const data = {
            username:username,
            password,
            role: ["user"]
        }

        if (validateFields()) {
            postData(`${process.env.REACT_APP_API_ROOT_URL}/api/auth/signup`, JSON.stringify(data))
            .then(res => {
                const {status} = res;
                if (status === 200) {
                    const messages = [];
                    messages.push("Udało się, teraz możesz zalogować się i korzystać z serwisu."); 
                    setModalContent(createModalContent("Użytkownik został zarejestrowany", messages));

                    clearForm();
                    document.getElementById("create-subscriber-form").reset();
                    setModalAndLoading(true, false, false, setIsModal, setModalError, setLoading);
                } else if (status === 400 || status === 404) {
                    const messages = []; 
                    for (const key in res) {
                        if (key !== 'status') {
                            messages.push(res[key]);
                        }
                    }
                    setModalContent(createModalContent("Błąd", messages));

                    setModalAndLoading(true, true, false, setIsModal, setModalError, setLoading);
                } else if (status === 500) {
                    const messages = [];
                    messages.push("Problem z serwerem, proszę spróbować pózniej"); 
                    setModalContent(createModalContent("Błąd", messages));

                    setModalAndLoading(true, true, false, setIsModal, setModalError, setLoading);
                }
            })
            .catch(e => console.log(e));
        } else {
            setLoading(false);
        }
    }

    const modal = isModal ? <Modal 
        modalContent = {modalContent}
        modalError={modalError}
        close={() => closeModal(setIsModal)}/> : null
    
    const lastElement = loading ?                 
        <div className="spinner-wrapper">
            <Spinner/>
        </div> :
        <CustomButton 
            type="submit"
            additionalClass="submit">
                Create account
        </CustomButton>

    return (
        <div className="sign-up-wrapper">
            <form id="create-subscriber-form" method="post" onSubmit={handleSubmit}>
                <FormInput
                    handleChange={(e) => handleChange(e, setUsername)}
                    clearError={() => clearErrorAfterFocus(errorUser , setErrorUser)}
                    error={errorUser}
                    name="username"
                    type="text"
                    label="Username"
                    value={username}
                    required
                />
                <FormInput
                    handleChange={(e) => handleChange(e, setPassword)}
                    clearError={() => clearErrorAfterFocus(errorPassword ,setErrorPassword)}
                    error={errorPassword}
                    name="password"
                    type={passwordShown ? "text" : "password"}
                    label="Password"
                    value={password}
                    i={<i onClick={togglePasswordVisiblity}>{passwordShown ? eyeSlash : eye}</i>}
                    required
                />
                {lastElement}
            </form>
            {modal}
        </div>
    );
}

export default SignUp;