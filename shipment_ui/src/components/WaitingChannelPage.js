import React from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { GetChannelDetails } from "../contract/contract_transaction";
import { FetchAccount } from "../contract/MetaMaskFetch";
import OnChainStateView from "./OnChainStateView";
import OffChainStateView from "./OffChainState";
import { WaitingActionList } from "./ActionList";
import { FetchOffChainDetails } from "../LocalStorage/local_storage_api";

class WaitingChannelPage extends React.Component {
    state = {
        errors: false,
        channelId: "",
        onChainState: "",
        offChainState: "",
        sender: "",
        action: '',
    }

    componentDidMount() {
        FetchAccount().then(sender => {
            if (sender) {

                GetChannelDetails(this.props.match.params.channel_id).then(onChainState => {
                    let offChainState = FetchOffChainDetails(sender, this.props.match.params.channel_id)
                    this.setState({
                        'sender': sender,
                        'channelId': this.props.match.params.channel_id,
                        'onChainState': onChainState,
                        'offChainState': offChainState
                    })
                }).catch(err => {
                    toast.error("On Chain State Not found")
                    console.log(err)
                })

            }

        }).catch(err => {
            this.props.history.push({
                pathname: '/metamaskIssue',
            })
            toast.error("check metamask connectivity")
            console.log(err)
        })
    }

    actionHandler = async (event) => {
        event.preventDefault();
        if (this.state.sender === undefined || this.state.sender === null) {
            this.props.history.push({
                pathname: '/metamaskIssue',
            })
            toast.error("check metamask connectivity")
        }
        else {
            this.setState({ 'errors': false });
            if (this.state.action === 'select action' || this.state.action === '') {
                this.setState({ 'errors': "Please select action from drop down" })
            }
            else {

                let path = "/" + this.state.action
                this.props.history.push({
                    pathname: path,
                    state: {
                        channelId: this.state.channelId,
                        action: this.state.action
                    }
                })
            }
        }
    }

    onActionChange = async (event) => this.setState({ 'action': event.target.value });

    render() {
        return (
            <>
                <h2>Channel Id: {this.state.channelId}</h2>
                <div>
                    <div>
                        <OnChainStateView details={this.state.onChainState} />
                    </div>
                    <div>
                        <OffChainStateView details={this.state.offChainState} />
                    </div>
                    <form id="form" onSubmit={this.actionHandler}>
                        <WaitingActionList onChange={this.onActionChange} />
                        {this.state.errors && <div className="alert alert-danger">{this.state.errors}</div>}
                        <button id="button">Apply Action</button>
                    </form>
                </div>
            </>
        );
    }
};

export default WaitingChannelPage;
