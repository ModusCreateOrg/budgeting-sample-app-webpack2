// @flow
import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import ErrorBoundary from 'components/ErrorBoundary';
import AppError from 'components/AppError';
import Header from 'components/Header';
import ItemDetails from 'routes/ItemDetails';
import Budget from 'routes/Budget';
import Reports from 'routes/Reports';
import './style.scss';

const App = () => (
  <ErrorBoundary fallbackComponent={AppError}>
    <main>
      <Header />

      <Switch>
        <Route path="/budget" component={Budget} />
        <Route path="/reports" component={Reports} />
        <Route path="/items/:id" component={ItemDetails}/>
        <Redirect to="/budget" />
      </Switch>
    </main>
  </ErrorBoundary>
);

export default App;
