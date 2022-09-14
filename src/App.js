import NavigationBar from './NavigationBar';
import 'bootstrap/dist/css/bootstrap.css';
import AppRouter from "./AppRouter";
import {Container} from "react-bootstrap";

function App() {
  return (
    <div>
        <NavigationBar />
        <Container fluid className="pt-3">
            <AppRouter />
        </Container>
    </div>
  );
}

export default App;