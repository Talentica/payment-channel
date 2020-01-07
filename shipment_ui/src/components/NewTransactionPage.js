import React from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { IsValidSignature, FetchOtherParty, GetChannelDetails } from "../contract/contract_transaction";
import { FetchAccount } from "../contract/MetaMaskFetch";
import OnChainStateView from "./OnChainStateView";
import OffChainStateView from "./OffChainState";
import { FetchOffChainDetails, MakeStringState } from "../LocalStorage/local_storage_api";
import GenerateSignatures from "../contract/CreateSignature";
import { SetRequest } from "../redisApi/GetSetData";
import STATE_TYPE from "../RequestType";

class NewTransaction extends React.Component {
    state = {
        errors: false,
        channelId: "",
        onChainState: false,
        offChainState: false,
        formFlag: false,
        sender: "",
        action: '',
        aliceCash: '',
        bobCash: '',
    }

    componentDidMount() {
        FetchAccount().then(sender => {
            if (sender) {

                // let key = this.state.sender + 'active_channel_ids'
                if (this.props.location.state.action === 'Transaction') {
                    GetChannelDetails(this.props.location.state.channelId).then(onChainState => {
                        let offChainState = FetchOffChainDetails(sender, this.props.location.state.channelId)
                        this.setState({
                            'sender': sender,
                            'channelId': this.props.location.state.channelId,
                            'offChainState': offChainState,
                            'onChainState': onChainState,
                            'formFlag': true,
                        })
                    }).catch(err => {
                        toast.error("on chain state issue")
                    })
                }
                else {
                    this.props.history.push({
                        pathname: '/NaN',
                    })
                }
            }
        }).catch(err => {
            this.props.history.push({
                pathname: '/metamaskIssue',
            })
            toast.error("check metamask connectivity")
        })
    }

    onActionChange = async (event) => this.setState({ 'action': event.target.value });

    actionHandler = async (event) => {
        event.preventDefault();
        if (this.state.sender === undefined || this.state.sender === null) {
            this.props.history.push({
                pathname: '/metamaskIssue',
            })
            toast.error("check metamask connectivity")
        }
        this.setState({ 'errors': false });
        if (this.state.action === 'select action' || this.state.action === '') {
            this.setState({ 'errors': "Please select action from drop down" })
        }
        else {
            let url = "/waitingChannel/" + this.state.waitingChannelId
            this.props.history.push(url);
            this.props.history.push({
                pathname: '/actionconfirmation',
                search: '?query=' + this.state.channelId,
                state: {
                    channelId: this.state.channelId,
                    action: this.state.action
                }
            })
        }
    }

    handleNewTransaction = async (event) => {
        event.preventDefault();
        this.setState({ 'errors': false })
        if (Number.isNaN(parseInt(this.state.aliceCash, 10))) {
            this.setState({ 'errors': "Enter Integer amount(in wei unit)" })
        }
        else if (Number.isNaN(parseInt(this.state.bobCash, 10))) {
            this.setState({ 'errors': "Enter Integer amount(in wei unit)" })
        }
        else {
            let total_money = parseInt(this.state.offChainState['Alice Cash']) + parseInt(this.state.offChainState['Bob Cash'])
            if (total_money === (parseInt(this.state.aliceCash) + parseInt(this.state.bobCash))) {
                let sig = await GenerateSignatures(this.state.channelId, parseInt(this.state.offChainState['count']) + 1, parseInt(this.state.aliceCash), parseInt(this.state.bobCash))
                await IsValidSignature(this.state.sender, this.state.channelId, parseInt(this.state.offChainState['count']) + 1, parseInt(this.state.aliceCash), parseInt(this.state.bobCash), sig)

                // localStorage.setItem(sender + this.state.channelId + 'lastState', JSON.stringify(this.state.lastState));
                let TheOtherParty = await FetchOtherParty(this.state.channelId, this.state.sender)
                let stringifyState = MakeStringState(this.state.channelId, parseInt(this.state.offChainState['count']) + 1, this.state.aliceCash, this.state.bobCash, sig)
                // eslint-disable-next-line no-unused-vars
                let [status, response] = await SetRequest(TheOtherParty, STATE_TYPE.Request, stringifyState)
                if (status === 200) {
                    toast.success("Transaction Success");
                }
                else {
                    toast.error("Transaction Failed ");
                }

            }
            else {
                this.setState({ 'errors': "total money is not equals to channel locked money" })
            }
        }
        this.setState({ 'aliceCash': "" })
        this.setState({ 'bobCash': "" })


    }

    render() {
        return (
            <>
                <h2>Channel Id: {this.state.channelId}</h2>
                <div>
                    <div>
                        {this.state.onChainState && <OnChainStateView details={this.state.onChainState} />}
                    </div>
                    <div>
                        {this.state.offChainState && <OffChainStateView details={this.state.offChainState} />}
                    </div>
                    <div>
                        {this.state.formFlag &&
                            <form id="form" className="mt-2" onSubmit={this.handleNewTransaction}>
                                <div className="form-group">
                                    <label htmlFor="Count">Count</label>
                                    <div className="field">
                                        <input
                                            id="Count"
                                            readOnly
                                            type="text"
                                            name="Count"
                                            className="form-control"
                                            value={parseInt(this.state.offChainState['count']) + 1}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="aliceCash">Alice Cash</label>
                                    <div className="field">
                                        <input
                                            id="aliceCash"
                                            type="text"
                                            onChange={event => this.setState({ aliceCash: event.target.value })}
                                            name="aliceCash"
                                            className="form-control"
                                            value={this.state.aliceCash}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="bobCash">Bob Cash</label>
                                    <div className="field">
                                        <input
                                            id="bobCash"
                                            type="text"
                                            onChange={event => this.setState({ bobCash: event.target.value })}
                                            name="bobCash"
                                            className="form-control"
                                            value={this.state.bobCash}
                                        />
                                    </div>
                                    {this.state.errors && <div className="alert alert-danger">{this.state.errors}</div>}
                                </div>
                                <input type="submit" value="Submit Transaction" className="btn btn-primary" />
                            </form>}
                    </div>
                </div>

            </>
        );
    }
};

export default NewTransaction;
