import "./sign-in.scss";

import { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Redirect } from "react-router-dom";

import CustomButton from './../button/custom-button';
import Spinner from '../spinner/Spinner';
import Modal from '../modal/modal';
import FormInput from './../form-input/form-input.jsx';
import { postData, closeModal, createModalContent, setModalAndLoading } from './../../services/services';
import { setUser } from "./../../redux/user/user-action";


const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {user, isLogged} = useSelector(state => state);
    const dispatch = useDispatch();

    const [error] = useState({errorState: false, messagge: ""});

    const [loading, setLoading] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [modalError, setModalError] = useState(false);
    const [modalContent, setModalContent] = useState({});

    const handleChange = (event, setter) => {
        const {value} = event.target;
        setter(value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        const data = {
            username,
            password,
        }
        
        postData(`https://datajungles.herokuapp.com/http://datajungles-env.eba-henczmrr.us-east-1.elasticbeanstalk.com//api/auth/signin`, JSON.stringify(data))
        .then(res => {
            const {status} = res;
            if (status === 401) {
                const messages = [];
                messages.push("There is no auch user in the database, try again or create a new account"); 
                setModalContent(createModalContent("Error", messages));

                setModalAndLoading(true, true, false, setIsModal, setModalError, setLoading);
            } else {
                if (!user && !isLogged) {
                    dispatch(setUser(res))
                    localStorage.setItem("user", JSON.stringify(res));
                    setLoading(false);
                }
            }
        })
        .catch(e => console.log(e));
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
            Sign In
    </CustomButton>

    return (
        <div className="sign-in-wrapper">
            <form id="login-subscriber-form" method="post" onSubmit={handleSubmit}>
            <FormInput
                    handleChange={(e) => handleChange(e, setUsername)}
                    error={error}
                    name="username"
                    type="text"
                    label="Username"
                    value={username}
                    required
                />
                <FormInput
                    handleChange={(e) => handleChange(e, setPassword)}
                    error={error}
                    name="password"
                    type="password"
                    label="Password"
                    value={password}
                    required
                    autoComplete="on"
                />
                {lastElement}
            </form>
            {modal}
            {isLogged ? <Redirect to="/folder/1"/> : null}
        </div>
    )
}

export default SignIn;