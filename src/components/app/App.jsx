import './App.scss';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import {useSelector} from 'react-redux';

import SignUpPage from '../../pages/sign-up-page/sign-up-page';
import SignInPage from '../../pages/sign-in-page/sign-in-page';
import AdminPanel from '../../pages/admin-page/admin-page';
import HelloPage from '../../pages/hello-page/hello-page';
import Page404 from '../../pages/page-404/page-404';
import Folder from '../../pages/folder/folder';
// import ProblemPage from '../../pages/problem-page/problem-page';
// import Profile from '../../pages/profile-page/profile-page';
// import EditPage from '../../pages/edit-page/edit-page';
// import Page404 from '../../pages/page-404/page-404';
import Header from '../header/header';
import PreviewPage from '../../pages/preview-page/preview-page';
import UsersInGroupPage from '../../pages/users-in-group-page/users-in-group-page';



function App() {
	const {isLogged} = useSelector(state => state);

	return (
        <Router>
            <div className="App">
                <Header />
                <div className="content-wrapper">
                    <Switch>
                        <Redirect exact from="/" to="/folder/1" />
                        <Route exact path="/folder/:id">
                            <Folder />
                        </Route>
                        <Route exact path="/groups/:id">
                            <UsersInGroupPage />
                        </Route>
                        <Route exact path="/preview/:id/:access/:rootFolderId">
                            <PreviewPage />
                        </Route>
                        <Route exact path="/">
                            <Folder />
                        </Route>
                        <Route exact path="/hello-page">
                            <HelloPage />
                        </Route>
                        <Route
                            exact
                            path="/signup"
                            render={() =>
                                isLogged ? (
                                    <Redirect to="/folder/1" />
                                ) : (
                                    <SignUpPage />
                                )
                            }
                        />
                        <Route
                            exact
                            path="/signin"
                            render={() =>
                                isLogged ? (
                                    <Redirect to="/folder/1" />
                                ) : (
                                    <SignInPage />
                                )
                            }
                        />
                        <Route exact path="/admin-panel">
                            <AdminPanel />
                        </Route>
                        <Route path="/static" />
                        <Route path="*">
                            <Page404 />
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}	

export default App;
