import React from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { IsValidSignature, FetchOtherParty, GetChannelDetails, ChannelClose } from "../contract/contract_transaction";
import { FetchAccount } from "../contract/MetaMaskFetch";
import OnChainStateView from "./OnChainStateView";
import OffChainStateView from "./OffChainState";
import { FetchOffChainDetails } from "../LocalStorage/local_storage_api";

class CloseChannel extends React.Component {
    state = {
        errors: false,
        channelId: "",
        onChainState: false,
        offChainState: false,
        formFlag: false,
        sender: "",
    }

    componentDidMount() {
        FetchAccount().then(sender => {
            if (sender) {

                if (this.props.location.state.action === 'Close') {
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

    handleCloseChannel = async (event) => {
        event.preventDefault();
        this.setState({ 'errors': false })
        if (!this.state.offChainState || this.state.offChainState === 'No off chain state Found') {
            toast.error("Off Chain State tempered")
            toast.error("Close Channel Operation Reverted")
        }
        else {
            console.log(this.state.channelId, parseInt(this.state.offChainState['count']), parseInt(this.state.offChainState['Alice Cash']), parseInt(this.state.offChainState['Bob Cash']),
                this.state.offChainState['sig'])

            let TheOtherParty = await FetchOtherParty(this.state.channelId, this.state.sender)
            let sig_check = await IsValidSignature(TheOtherParty, this.state.channelId, parseInt(this.state.offChainState['count']), parseInt(this.state.offChainState['Alice Cash']),
                parseInt(this.state.offChainState['Bob Cash']), this.state.offChainState['sig'])
            if (sig_check) {
                console.log(this.state.offChainState['sig'])
                await ChannelClose(this.state.channelId, parseInt(this.state.offChainState['count']), parseInt(this.state.offChainState['Alice Cash']),
                    parseInt(this.state.offChainState['Bob Cash']), this.state.offChainState['sig'], this.state.sender)
            }
            else {
                toast.error("Off Chain State Signature broken")
            }
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
                        {this.state.offChainState && <OffChainStateView details={this.state.offChainState} />}
                    </div>
                    <div>
                        {
                            this.state.formFlag &&
                            <form id="form" className="mt-2" onSubmit={this.handleCloseChannel}>
                                {this.state.errors && <div className="alert alert-danger">{this.state.errors}</div>}
                                <input type="submit" value="Close Channel" className="btn btn-primary" />
                            </form>
                        }
                    </div>
                </div>

            </>
        );
    }
};

export default CloseChannel;
