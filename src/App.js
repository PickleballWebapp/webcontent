import NavigationBar from "./NavigationBar";
import "bootstrap/dist/css/bootstrap.css";
import { Container } from "react-bootstrap";

import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator } from "@aws-amplify/ui-react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./Home";
import Scheduling from "./Scheduling";
import Scores from "./Scores";
import GameScore from "./GameScore";
import Rankings from "./Rankings";
import User from "./User";
import CreateGame from "./CreateGame";

function App({ signOut, user }) {
  return (
      <BrowserRouter>
          <NavigationBar signOut={signOut} />
          <Container fluid className="pt-3">
              <Routes>
                  <Route path="/" element={<Navigate to="/home" />} />
                  <Route path="/home" element={<Home user={user} />} />
                  <Route path="/scheduling" element={<Scheduling />} />
                  <Route path="/scores" element={<Scores />} />
                  <Route path="/score" element={<GameScore />} />
                  <Route path="/rankings" element={<Rankings />} />
                  <Route path="/user" element={<User />} />
                  <Route path="/new" element={<CreateGame />} />
              </Routes>
          </Container>
      </BrowserRouter>
  );
}

export default withAuthenticator(App);
