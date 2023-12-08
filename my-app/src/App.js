import './App.css';
import Login from "./components/login"; 
import UpdatePass from "./components/updatePass"
import CreateAccount from "./components/createAccount"
import Home from './components/homePage'
import Account from "./components/accountSetting"
import Grant from "./components/grantAdmin"
import Verify from "./components/verifyEmail"
import Search from "./components/search"
import Custom from "./components/customList"
import Public from "./components/publicList"
import Policies from './components/policies';
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
          <Route path="/search" element = {<Search />}/>
          <Route path="/customL" element = {<Custom />}/>
          <Route path="/publicL" element = {<Public />}/>
          <Route path="/pol" element = {<Policies />}/>
          <Route path="/api/users/emailConfirmation/:email" element={<Verify />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
