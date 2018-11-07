import { createBrowserHistory } from 'history';
import React from 'react';
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';

import EventsRouter from 'events/components/EventsRouter';
import Career from './career/';
import Core from './core';
import HttpError from './core/components/errors/HttpError';
import Frontpage from './frontpage';
import Hobbys from './hobbygroups';
import Resources from './resources';

import Spinner from 'common/components/Spinner';
import store from './authentication';

export const routes = {
  events: '/events',
  home: '/',
  career: '/career',
  hobbygroups: '/hobbygroups',
  resources: '/resources',
  wiki: '/wiki',
  webshop: '/webshop',
  profile: '/profile',
};

const LoadableProfile = Loadable({
  loader: () => import(/* webpackChunkName: "profile" */ './profile'),
  loading: () => <Spinner />,
});

const history = createBrowserHistory();

export const App = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Core>
          <Switch>
            <Route exact path={routes.home} component={Frontpage} />
            <Route path={routes.events} component={EventsRouter} />
            <Route path={routes.career} component={Career} />
            <Route path={routes.hobbygroups} component={Hobbys} />
            <Route path={routes.resources} component={Resources} />
            <Route path={routes.profile} component={LoadableProfile} />
            <Route path="*" render={() => <HttpError code={404} />} />
          </Switch>
        </Core>
      </Router>
    </Provider>
  );
};

export default App;
