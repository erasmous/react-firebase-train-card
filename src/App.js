import React, { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router-dom';

import NavigationBar from './presentationals/NavBar/navBar';
import CreateCard from './components/CreateCard/createCard';
import RegisterCard from './components/RegisterCard/registerCard';
import ReloadCard from './components/ReloadCard/reloadCard';
import UseCard from './components/UseCard/useCard';

const App = () => {
  return(<Fragment>
    <BrowserRouter>
      <NavigationBar />
      <Switch>
        <div className="container-fluid">
          <Route path="/registerCard" component={RegisterCard} />
          <Route path="/createCard" component={CreateCard} />
          <Route path="/reloadCard" component={ReloadCard} />
          <Route path="/useCard" component={UseCard} />
          <Route exact path="/" component={CreateCard} />
        </div>
      </Switch>
    </BrowserRouter>
  </Fragment>);
}

export default App;
