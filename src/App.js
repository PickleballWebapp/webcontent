import NavigationBar from './NavigationBar';
import 'bootstrap/dist/css/bootstrap.css';
import AppRouter from "./AppRouter";
import {Container} from "react-bootstrap";

function App() {
  return (
      //put everything inside of div because you can only render one top level thing at a time
    <div>
        <NavigationBar />
        <Container fluid className="pt-3">
            <AppRouter />
        </Container>
    </div>
  );
}

export default App;
