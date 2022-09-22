import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./Home";
import Scheduling from "./Scheduling";
import Scores from "./Scores";
import Rankings from "./Rankings";
import MyScores from "./MyScores";
import Login from "./Login";
import User from "./User";

export default function AppRouter() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <Navigate to="/home" />
                }/>
                <Route path="/home" element={
                    <Home />
                }/>
                <Route path="/scheduling" element={
                    <Scheduling />
                }/>
                <Route path="/scores" element={
                    <Scores />
                }/>
                <Route path="/rankings" element={
                    <Rankings />
                }/>
                <Route path="/login" element={
                    <Login />
                }/>
                <Route path="/user" element={
                    <User />
                }/>
            </Routes>
        </BrowserRouter>
    )
}