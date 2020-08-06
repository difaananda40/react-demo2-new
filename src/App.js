import React, { Suspense, lazy} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

// Pages
const Home = lazy(() => import('./pages/Home'));
const Worksheet = lazy(() => import('./pages/Worksheet'));

function App() {
  return (
    <React.Fragment>
      <Router>
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/worksheet" component={Worksheet} />
          </Switch>
        </Suspense>
      </Router>
    </React.Fragment>
  );
}

export default App;
