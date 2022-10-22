import NavigationBar from "./NavigationBar";
import "bootstrap/dist/css/bootstrap.css";
import { Container } from "react-bootstrap";

import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Scheduling from "./Scheduling";
import Scores from "./Scores";
import GameScore from "./GameScore";
import Rankings from "./Rankings";
import User from "./User";
import CreateGame from "./CreateGame";
import { useEffect, useState } from "react";
import { API, Auth } from "aws-amplify";
import { getUser } from "./graphql/queries";
import { UserType } from "./models";
import { createUser } from "./graphql/mutations";

function App({ signOut }) {
  const getUserJson = () => JSON.parse(localStorage.getItem("user"));
  const [currentUser, setCurrentUser] = useState(getUserJson());

  useEffect(() => {
    async function dynamodbUserSearch() {
      const user = await Auth.currentAuthenticatedUser();
      let userData = await API.graphql({
        query: getUser,
        variables: { id: user.username },
      });
      if (!userData?.data.getUser) {
        const userDetails = {
          id: user.username,
          name: user.attributes.name,
          email: user.attributes.email,
          wins: 0,
          losses: 0,
          type: UserType.PLAYER,
        };
        userData = await API.graphql({
          query: createUser,
          variables: { input: userDetails },
        });
      }
      setCurrentUser(userData.data.getUser);
    }
    dynamodbUserSearch();
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <BrowserRouter>
      <NavigationBar signOut={signOut} />
      <Container fluid className="pt-3">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home user={currentUser} />} />
          <Route path="/scheduling" element={<Scheduling />} />
          <Route path="/scores" element={<Scores user={currentUser} />} />
          <Route path="/score" element={<GameScore user={currentUser}/>} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/user" element={<User />} />
          <Route path="/new" element={<CreateGame />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default withAuthenticator(App);
