import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./Home";
import Scheduling from "./Scheduling";
import Scores from "./Scores";
import Rankings from "./Rankings";
import User from "./User";
import GameScore from "./GameScore";
import CreateGame from "./CreateGame";

export default function AppRouter({user}) {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <Navigate to="/home" />
                }/>
                <Route path="/home" element={
                    <Home user={user} />
                }/>
                <Route path="/scheduling" element={
                    <Scheduling />
                }/>
                <Route path="/scores" element={
                    <Scores />
                }/>
                <Route path="/score" element={
                    <GameScore />
                }/>
                <Route path="/rankings" element={
                    <Rankings />
                }/>
                <Route path="/user" element={
                    <User />
                }/>
                <Route path="/new" element={
                    <CreateGame />
                }/>
            </Routes>
        </BrowserRouter>
    )
}