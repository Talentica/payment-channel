import React from 'react';
import './App.css';
import './components/Form.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import AboutPage from './AboutPage';
import HomePage from './HomePage';
import { NotFoundPage, MetaMaskIssue } from './NotFoundPage';
import FetchContractTxn from './contract/FetchContractTxns';
import DashBoardView from './components/DashBoard';
import ActiveChannelPage from './components/ActiveChannelPage';
import WaitingChannelPage from './components/WaitingChannelPage';
import NewTransaction from './components/NewTransactionPage';
import ConfirmChannel from './components/ConfirmChannel';
import RefundChannel from './components/RefundChannel';
import CloseChannel from './components/CloseChannel';
import FinalizeChannel from './components/FinalizeChannel';
import AddNewUser from './components/AddNewUser';
import PendingStates from './components/PendingStates';

const App = () => {

  return (
    <div className="container-fluid" >
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />

      <Router>
        <Header />
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Redirect from="/about-page" to="about" />
          <Route path="/about" component={AboutPage} />
          <Route path="/dashboard" component={DashBoardView} />
          <Route path="/fetchContract" component={FetchContractTxn} />
          <Route path="/activeChannel/:channel_id" component={ActiveChannelPage} />
          <Route path="/waitingChannel/:channel_id" component={WaitingChannelPage} />
          <Route path="/Transaction" component={NewTransaction} />
          <Route path="/Confirm" component={ConfirmChannel} />
          <Route path="/Refund" component={RefundChannel} />
          <Route path="/Close" component={CloseChannel} />
          <Route path="/Finalize" component={FinalizeChannel} />
          <Route path="/adduser" component={AddNewUser} />
          <Route path="/pendingstates" component={PendingStates} />
          <Route path="/metamaskIssue" component={MetaMaskIssue} />
          <Route component={NotFoundPage} />
        </Switch>

      </Router>

    </div>
  );

};

export default App;