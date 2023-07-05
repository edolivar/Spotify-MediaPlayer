import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './login';
import '../App.css'
import SongDisplay from './SongDisplay'
function App() {

  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path='/SongDisplay' component={SongDisplay} />
      </Switch>
    </Router>

  )
}

export default App;