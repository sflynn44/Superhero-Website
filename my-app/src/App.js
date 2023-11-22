import './App.css';
import Base from "./components/basePage";
import Login from "./components/login"; 
import UpdatePass from "./components/updatePass"
import CreateAccount from "./components/createAccount"
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Base />}/>
          <Route path="/login" element = {<Login />}/>
          <Route path="/updateP" element={<UpdatePass />}/>
          <Route path="/createA" element={<CreateAccount />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
