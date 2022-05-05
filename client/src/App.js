import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import OtherPage from './OtherPage';
import Fib from './Fib';

function App() {
  return (
    <BrowserRouter>
     
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Link to="/" >Home</Link>
        <Link to= "/otherpage" >Other Page</Link> 
      </header>
      
      <div>
        <Routes>
        <Route exact path="/" element={<Fib/>}/>
        <Route path="/otherpage" element={<OtherPage/>}/>
        </Routes>
      </div>
    </div>
    </BrowserRouter>

  );
}

export default App;
