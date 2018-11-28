import * as React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CreateAccount from './containers/createAccount';
import resetPassword from './containers/resetPassword';
import HomeComponent from './components/HomeComponent';
import LoginContainer from 'src/containers/login';

class App extends React.Component {
    
    public render() {
      return (
        <BrowserRouter>
          <Switch>
            <Route exact={true} path="/" component={HomeComponent}/>
            <Route path="/createAccount/" component={CreateAccount}/>
            <Route path="/resetPassword/" component={resetPassword} />
            <Route path='/login' component={LoginContainer} />
          </Switch>
        </BrowserRouter>
      );
      
    }
  

}

export default App;
