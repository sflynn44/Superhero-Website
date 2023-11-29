import './App.css';
import Login from "./components/login"; 
import UpdatePass from "./components/updatePass"
import CreateAccount from "./components/createAccount"
import Home from './components/homePage'
import Account from "./components/accountSetting"
import Grant from "./components/grantAdmin"
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element = {<Login />}/>
          <Route path="/updateP" element={<UpdatePass />}/>
          <Route path="/createA" element={<CreateAccount />}/>
          <Route path="/accountS" element={<Account />}/>
          <Route path="/grantA" element = {<Grant />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
