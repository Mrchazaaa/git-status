import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Success from './Success';
import Failure from './Failure';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
         <Route path="/failure/:message" element={<Failure/>} />
         <Route path="/success/:message" element={<Success/>} />
       </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);