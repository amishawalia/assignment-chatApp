import React from 'react';
import './App.css';
import Home from './Pages/Home/Home.js';

import Register from './containers/register';

function App() {
  var login = false  

  return (
    <div className="App">
      {
        login ? <Home/> : <Register/>
      }

     
    </div>
  );
}
export default App;
