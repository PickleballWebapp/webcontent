import NavigationBar from "./NavigationBar";
import "bootstrap/dist/css/bootstrap.css";
import { Container } from "react-bootstrap";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { API, Auth } from "aws-amplify";
import { getUser } from "./graphql/queries";
import { UserType } from "./models";
import { createUser } from "./graphql/mutations";
import PathRoutes from "./Routes";

function App({ signOut }) {
  const getUserJson = () => JSON.parse(localStorage.getItem("user"));
  const [currentUser, setCurrentUser] = useState(getUserJson());
  const [activePage, setActivePage] = useState(null);

  /**
   * Get user data from DynamoDB and store in application state.
   */
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
      setCurrentUser(userData.data.getUser || userData.data.createUser);
    }
    dynamodbUserSearch().then((response) => console.log(response));
  }, []);

  /**
   * Whenever the user data is updated in app state, update it in
   * the browser's local storage as well.
   */
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <div>
      <NavigationBar
        activeKey={activePage}
        onSelect={setActivePage}
        signOut={signOut}
        user={currentUser}
      />
      <Container fluid className="pt-3">
        <PathRoutes currentUser={currentUser} />
      </Container>
    </div>
  );
}

export default withAuthenticator(App);
