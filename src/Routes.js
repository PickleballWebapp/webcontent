import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Scheduling from "./Scheduling";
import Scores from "./Scores";
import GameScore from "./GameScore";
import Rankings from "./Rankings";
import User from "./User";
import CreateGame from "./CreateGame";
import ScheduleGames from "./ScheduleGames";

export default function PathRoutes({ currentUser }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home user={currentUser} />} />
      <Route path="/scheduling" element={<Scheduling />} />
      <Route path="/scores" element={<Scores user={currentUser} />} />
      <Route path="/score/:id" element={<GameScore user={currentUser} />} />
      <Route path="/rankings" element={<Rankings />} />
      <Route path="/user/:id" element={<User user={currentUser} />} />
      <Route path="/new" element={<CreateGame user={currentUser} />} />
      <Route path="/schedule" element={<ScheduleGames user={currentUser} />} />
    </Routes>
  );
}
