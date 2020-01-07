import React from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ChannelList from "./ChannelList";
import { FetchAccount } from "../contract/MetaMaskFetch";
import FetchContractTxn from "../contract/FetchContractTxns";

class DashBoardView extends React.Component {

    state = {
        activeChannelIdError: false,
        activeChannelId: "",
        waitingChannelIdError: false,
        waitingChannelId: '',
        sender: "",
    }

    componentDidMount() {
        FetchAccount()
            .then(sender => {
                if (sender) {
                    this.setState({ 'sender': sender })
                }

            })
            .catch(err => {
                this.props.history.push({
                    pathname: '/metamaskIssue',
                })
                toast.error("check metamask connectivity")
            })
    }

    activeChannelIdHandler = async (event) => {
        event.preventDefault();
        if (this.state.sender === undefined || this.state.sender === null) {
            this.props.history.push({
                pathname: '/metamaskIssue',
            })
            toast.error("check metamask connectivity")
        }
        this.setState({ 'activeChannelIdError': false });
        if (Number.isNaN(parseInt(this.state.activeChannelId, 10))) {
            this.setState({ 'activeChannelIdError': "Enter Interger channel Id" })
        }
        else {
            let url = "/activeChannel/" + this.state.activeChannelId
            this.props.history.push(url);

        }
    }

    waitingChannelIdHandler = async (event) => {
        event.preventDefault();
        if (this.state.sender === undefined || this.state.sender === null) {
            this.props.history.push({
                pathname: '/metamaskIssue',
            })
            toast.error("check metamask connectivity")
        }
        this.setState({ 'waitingChannelIdError': false });
        if (Number.isNaN(parseInt(this.state.waitingChannelId, 10))) {
            this.setState({ 'waitingChannelIdError': "Enter Interger channel Id" })
        }
        else {
            let url = "/waitingChannel/" + this.state.waitingChannelId
            this.props.history.push(url);
        }
    }

    onActiveChannelIdChange = async (event) => this.setState({ 'activeChannelId': event.target.value });

    onWaitingChannelIdChange = async (event) => this.setState({ 'waitingChannelId': event.target.value });

    render() {
        return (
            <>
                <h2>DashBoard</h2>
                <FetchContractTxn />
                <div>
                    <div>
                        <h3>Active Channel Ids</h3>
                        <form id="form" onSubmit={this.activeChannelIdHandler}>
                            <ChannelList storage_key={this.state.sender + 'active_channel_ids'} onChange={this.onActiveChannelIdChange} />
                            {this.state.activeChannelIdError && <div className="alert alert-danger">{this.state.activeChannelIdError}</div>}
                            <button id="button">check Active Channel Status</button>
                        </form>
                    </div>
                    <div>
                        <h3>Waiting Channel Ids</h3>
                        <form id="form" onSubmit={this.waitingChannelIdHandler}>
                            <ChannelList storage_key={this.state.sender + 'waiting_channel_ids'} onChange={this.onWaitingChannelIdChange} />
                            {this.state.waitingChannelIdError && <div className="alert alert-danger">{this.state.waitingChannelIdError}</div>}
                            <button id="button">check Waiting Channel Status</button>
                        </form>
                    </div>
                </div>
            </>
        );
    }
};

export default DashBoardView;
