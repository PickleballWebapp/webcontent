import NavigationBar from "./NavigationBar";
import "bootstrap/dist/css/bootstrap.css";
import AppRouter from "./AppRouter";
import { Container } from "react-bootstrap";

import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator } from "@aws-amplify/ui-react";

function App({ signOut, user }) {
  return (
    <div>
      <NavigationBar signOut={signOut} />
      <Container fluid className="pt-3">
        <AppRouter user={user} />
      </Container>
    </div>
  );
}

export default withAuthenticator(App);
