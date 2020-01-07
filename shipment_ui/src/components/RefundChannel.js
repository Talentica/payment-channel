import React from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { GetChannelDetails, ChannelRefund } from "../contract/contract_transaction";
import { FetchAccount } from "../contract/MetaMaskFetch";
import OnChainStateView from "./OnChainStateView";
import { CheckTimeOut } from "../Utils/TimeUtils";

class RefundChannel extends React.Component {
    state = {
        errors: false,
        channelId: "",
        onChainState: false,
        formFlag: false,
        sender: "",
    }

    componentDidMount() {
        FetchAccount().then(sender => {
            if (sender) {
                if (this.props.location.state.action === 'Refund') {
                    GetChannelDetails(this.props.location.state.channelId).then(onChainState => {
                        this.setState({
                            'sender': sender,
                            'channelId': this.props.location.state.channelId,
                            'onChainState': onChainState,
                            'formFlag': true,
                        })
                        console.log(this.state.onChainState)
                    }).catch(err => {
                        toast.error("on chain state issue")
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
            toast.error("check metamask connectivity")
            console.log(err)
        })
    }

    handleRefund = async (event) => {
        event.preventDefault();
        this.setState({ 'errors': false })
        if (!CheckTimeOut(this.state.onChainState.Timeout)) {
            this.setState({ 'errors': "Wait for TimeOut" })
        }
        // TODO: apply id check and input flag otherwise it will be waste of resources.
        else {
            ChannelRefund(this.state.channelId, this.state.sender)
        }
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
                        {
                            this.state.formFlag &&
                            <form id="form" className="mt-2" onSubmit={this.handleRefund}>
                                {this.state.errors && <div className="alert alert-danger">{this.state.errors}</div>}
                                <input type="submit" value="Refund Channel" className="btn btn-primary" />
                            </form>
                        }
                    </div>
                </div>

            </>
        );
    }
};

export default RefundChannel;
