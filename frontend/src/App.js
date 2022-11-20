import React, { useCallback, useState } from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from "react-router-dom";
import "./App.css";

import NewPlace from "./places/pages/NewPlace";
import UpdatePlace from "./places/pages/UpdatePlace";
import UserPlaces from "./places/pages/UserPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import Auth from "./user/pages/Auth";
import Users from "./user/pages/User";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    //useCallback is a react's hook
    const login = useCallback(() => {
        setIsLoggedIn(true);
    }, []);

    const logout = useCallback(() => {
        setIsLoggedIn(false);
    }, []);

    let routes;
    if (isLoggedIn) {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users />
                </Route>
                <Route path="/:userId/places" exact>
                    <UserPlaces />
                </Route>
                <Route path="/places/new" exact>
                    <NewPlace />
                </Route>
                <Route path="/places/:placeId" exact>
                    <UpdatePlace />
                </Route>
                <Redirect to="/" />
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users />
                </Route>
                <Route path="/:userId/places" exact>
                    <UserPlaces />
                </Route>
                <Route path="/auth" exact>
                    <Auth />
                </Route>
                <Redirect to="/auth" />
            </Switch>
        );
    }
    return (
        <AuthContext.Provider
            value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
        >
            <Router>
                <MainNavigation />
                <main>{routes}</main>
            </Router>
        </AuthContext.Provider>
    );
};

export default App;
