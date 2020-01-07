import React from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { IsValidSignature, FetchOtherParty, GetChannelDetails, ChannelFinalizeClose } from "../contract/contract_transaction";
import { FetchAccount } from "../contract/MetaMaskFetch";
import OnChainStateView from "./OnChainStateView";
import OffChainStateView from "./OffChainState";
import { FetchOffChainDetails } from "../LocalStorage/local_storage_api";
import { CheckTimeOut } from "../Utils/TimeUtils";

class FinalizeChannel extends React.Component {
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

                if (this.props.location.state.action === 'Finalize') {
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
                        console.log(err)
                    })
                }
                else {
                    toast.error("invalid Page Call")
                }
            }
        }).catch(err => {
            toast.error("check metamask connectivity")
            console.log(err)
        })
    }

    handleFinalizeChannel = async (event) => {
        event.preventDefault();
        this.setState({ 'errors': false })
        if (!this.state.offChainState || this.state.offChainState === 'No off chain state Found') {
            toast.error("Off Chain State tempered")
            toast.error("Close Channel Operation Reverted")
        }
        else if (!CheckTimeOut(this.state.onChainState.Timeout)) {
            this.setState({ 'errors': "Wait for TimeOut" })
        }
        else {
            // localStorage.setItem(sender + this.state.channelId + 'lastState', JSON.stringify(this.state.lastState));
            let TheOtherParty = await FetchOtherParty(this.state.channelId, this.state.sender)

            let sig_check = await IsValidSignature(TheOtherParty, this.state.channelId, parseInt(this.state.offChainState['count']), parseInt(this.state.offChainState['Alice Cash']),
                parseInt(this.state.offChainState['Bob Cash']), this.state.offChainState['sig'])
            console.log("sig_check", sig_check)
            if (sig_check) {
                await ChannelFinalizeClose(this.state.channelId, this.state.sender)
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
                        {this.state.formFlag &&
                            <form id="form" className="mt-2" onSubmit={this.handleFinalizeChannel}>

                                {this.state.errors && <div className="alert alert-danger">{this.state.errors}</div>}
                                <input type="submit" value="Finalize Channel" className="btn btn-primary" />
                            </form>}
                    </div>
                </div>

            </>
        );
    }
};

export default FinalizeChannel;
