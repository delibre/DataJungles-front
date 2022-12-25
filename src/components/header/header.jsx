import './header.scss';
import {useSelector, useDispatch} from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faSignInAlt, faSignOutAlt, faWrench } from "@fortawesome/free-solid-svg-icons";
import { logout } from '../../redux/user/user-action';
import { Link } from 'react-router-dom';
import logo from "./datajungles.png";

const Header = () => {
    const {isLogged} = useSelector(state => state);
    const {user} = useSelector(state => state);
    const dispatch = useDispatch();

    const signUpIcon = <FontAwesomeIcon icon={faUserPlus} />;
    const signInIcon = <FontAwesomeIcon icon={faSignInAlt} />;
    const logOutIcon = <FontAwesomeIcon icon={faSignOutAlt} />;
    const adminIcon = <FontAwesomeIcon icon={faWrench}/>;

    return (
        <div className="header">
            <Link to="/folder/1">
                <img className='logo' src={logo} alt="logo"/> 
            </Link>
            <div className='options'>
                <div className="option">
                    {
                        isLogged && user.roles.includes("ROLE_ADMIN")  ?  <Link  to="/admin-panel">
                                        Admin panel {adminIcon}
                                    </Link>
                                  : null
                    }
                </div>
                <div className="option">
                    {
                        isLogged  ?  null
                                  : <Link to="/signup">
                                        Sign up {signUpIcon}
                                    </Link>
                    }
                </div>
                <div className="option">
                    {
                        isLogged  ?  <div className="logout" onClick={() => {
                            localStorage.removeItem("user");
                            dispatch(logout());
                        }}>
                            Sing out {logOutIcon}
                        </div>
                        : <Link to="/signin">
                            Log in {signInIcon}
                        </Link>
                    }
                </div>
            </div>
        </div>

    )
}

export default Header;