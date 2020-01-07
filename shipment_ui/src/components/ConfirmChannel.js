import React from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { GetChannelDetails, ChannelConfirm } from "../contract/contract_transaction";
import { FetchAccount } from "../contract/MetaMaskFetch";
import OnChainStateView from "./OnChainStateView";

class ConfirmChannel extends React.Component {
    state = {
        errors: false,
        channelId: "",
        onChainState: false,
        formFlag: false,
        sender: "",
        cash: '',
    }

    componentDidMount() {
        FetchAccount().then(sender => {
            if (sender) {

                if (this.props.location.state.action === 'Confirm') {
                    GetChannelDetails(this.props.location.state.channelId).then(onChainState => {
                        this.setState({
                            'sender': sender,
                            'channelId': this.props.location.state.channelId,
                            'onChainState': onChainState,
                            'formFlag': true,
                        })
                    }).catch(err => {
                        toast.error("On Chain State Not found")
                        console.log(err)
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

    handleConfirmChannel = async (event) => {
        event.preventDefault();
        this.setState({ 'errors': false })
        if (Number.isNaN(parseInt(this.state.cash, 10))) {
            this.setState({ 'errors': "Enter Integer amount(in wei unit)" })
        }
        else {
            console.log(this.state.cash, this.state.channelId)
            ChannelConfirm(this.state.channelId, this.state.cash)
        }
        this.setState({ 'cash': "" })
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
                        {this.state.formFlag &&
                            <form id="form" className="mt-2" onSubmit={this.handleConfirmChannel}>
                                <div className="form-group">
                                    <label htmlFor="cash">Input Cash</label>
                                    <div className="field">
                                        <input
                                            id="cash"
                                            type="text"
                                            onChange={event => this.setState({ cash: event.target.value })}
                                            name="cash"
                                            className="form-control"
                                            value={this.state.cash}
                                        />
                                    </div>
                                    {this.state.errors && <div className="alert alert-danger">{this.state.errors}</div>}
                                </div>
                                <input type="submit" value="Confirm Channel" className="btn btn-primary" />
                            </form>}
                    </div>
                </div>

            </>
        );
    }
};

export default ConfirmChannel;
