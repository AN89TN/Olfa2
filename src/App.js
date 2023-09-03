import './App.css';
import Parse from 'parse/dist/parse.min.js';
import Footer from "./pages/Footer";
import LandingPage from './pages/LandingPage';

function App() {

  // Your Parse initialization configuration goes here
  const PARSE_APPLICATION_ID = null;
  const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
  const PARSE_JAVASCRIPT_KEY = null;
  Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
  Parse.serverURL = PARSE_HOST_URL;

  return (
    <div className="App">
      <LandingPage />
      <Footer />
    </div>
  );
}

export default App;
