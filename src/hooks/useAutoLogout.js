import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from 'react-router-dom';
import authService from '../appwrite/auth';

export default function useAutoLogout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(state => state.auth.status);

    useEffect(() => {
        if (!isLoggedIn) return;

        const checkExpiry = () => {
            const expiry = localStorage.getItem('userDataExpiry');
            if (expiry && Date.now() > new Date(expiry).getTime()) {
                authService.logout().then(() => {
                    dispatch(logout());
                    navigate("/", { replace: true });
                });
            }
        };

        checkExpiry(); // Immediate check

        const interval = setInterval(checkExpiry, 60 * 10000);

        return () => clearInterval(interval);
    }, [dispatch, navigate, isLoggedIn]);
}