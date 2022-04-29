import React from 'react';
import './App.css';
import Home from './Pages/Home/Home.js';
import Register from './containers/register';
import {Routes,Route} from 'react-router-dom';
import Login from './components/login';
import { useSelector } from 'react-redux';

function App() {
  const {logged, userName} = useSelector(state => state)

  return (
    <div className="App">
      {
        logged ? <Home userName={userName}/> : <Register/>
      }
      <Routes>
      <Route path='/signin' element={<Login/>}/>
    </Routes>
    </div>
  );
}
export default App;
