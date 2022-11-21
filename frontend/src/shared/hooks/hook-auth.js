import {useState, useEffect, useCallback} from "react"

let logoutTimer;
export const useAuth = () => {
    const [token, setToken] = useState();
    const [expirationData, setExpirationData] = useState();
    const [userId, setUserId] = useState(null);

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        const tokenExpirationData =
            expirationDate ||
            new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
            setExpirationData(tokenExpirationData);
        localStorage.setItem(
            "userData",
            JSON.stringify({
                userId: uid,
                token: token,
                expiration: tokenExpirationData.toISOString(),
            })
        );
        setUserId(uid);
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setExpirationData(null);
        localStorage.removeItem("userData");
    }, []);

    useEffect(() => {
        if (token && expirationData) {
            const remainingTime = expirationData.getTime() - new Date()
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, expirationData]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(
                storedData.userId,
                storedData.token,
                new Date(storedData.expiration)
            );
        }
    }, [login]);

    return {userId, token, login, logout};
}