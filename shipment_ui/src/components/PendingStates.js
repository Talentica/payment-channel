import React from "react";
import { toast } from "react-toastify";
import './UserList.css'
import { FetchRequests, DeleteRequest, SetRequest } from "../redisApi/GetSetData";
import { FetchAccount } from "../contract/MetaMaskFetch";
import { FetchOtherParty, IsValidSignature } from "../contract/contract_transaction";
import STATE_TYPE from "../RequestType";
import GenerateSignatures from "../contract/CreateSignature";
import { MakeStringState } from "../LocalStorage/local_storage_api";
import 'react-toastify/dist/ReactToastify.css';

async function onDeleteClick(sender, index, request_type) {
    // eslint-disable-next-line no-unused-vars
    let [status, response] = await DeleteRequest(sender, request_type, index)
    if (status === 200) {
        toast.success(request_type + "Delete Operation Done");
    }
    else {
        toast.error(request_type + "Delete Operation Failed ");
    }
}

async function onShowLastState(sender, request) {
    let channel_id = request.split('_')[0]
    let key = sender + channel_id + "_last_signed_state"
    alert(localStorage.getItem(key) || "No Signed State Defined")
}

async function onAcceptClick(sender, request, index, request_type) {
    let splitstate = request.split("_");
    let state_obj = {
        'channel_id': Number.parseInt(splitstate[0]),
        'count': Number.parseInt(splitstate[1]),
        'alice_cash': Number.parseInt(splitstate[2]),
        'bob_cash': Number.parseInt(splitstate[3]),
        'sig': splitstate[4],
    }
    console.log(state_obj.channel_id, state_obj.count, state_obj.alice_cash, state_obj.bob_cash, state_obj.sig)
    const TheOtherParty = await FetchOtherParty(state_obj.channel_id, sender)
    let checkSig = await IsValidSignature(TheOtherParty, state_obj.channel_id, state_obj.count, state_obj.alice_cash, state_obj.bob_cash, state_obj.sig)

    if (checkSig === true) {
        let signature = await GenerateSignatures(state_obj.channel_id, state_obj.count, state_obj.alice_cash, state_obj.bob_cash)
        let key = sender + state_obj.channel_id + "_last_signed_state"
        request = request.replace('"', '')
        localStorage.setItem(key, request);
        let lastState = MakeStringState(state_obj.channel_id, state_obj.count, state_obj.alice_cash, state_obj.bob_cash, signature)

        // eslint-disable-next-line no-unused-vars
        let [status, response] = await SetRequest(TheOtherParty, request_type, lastState)
        if (status === 200) {
            toast.success("Transaction Accepted");
            onDeleteClick(sender, index, STATE_TYPE.Request)
        }
        else {
            toast.error("Transaction Failed ");
        }
    }
    else {
        toast.error("invalid signature")
    }
}

async function onAcceptClickResponse(sender, request, index) {
    let splitstate = request.split("_");
    let state_obj = {
        'channel_id': Number.parseInt(splitstate[0]),
        'count': Number.parseInt(splitstate[1]),
        'alice_cash': Number.parseInt(splitstate[2]),
        'bob_cash': Number.parseInt(splitstate[3]),
        'sig': splitstate[4],
    }
    console.log(state_obj.channel_id, state_obj.count, state_obj.alice_cash, state_obj.bob_cash, state_obj.sig)
    const TheOtherParty = await FetchOtherParty(state_obj.channel_id, sender)
    let checkSig = await IsValidSignature(TheOtherParty, state_obj.channel_id, state_obj.count, state_obj.alice_cash, state_obj.bob_cash, state_obj.sig)

    if (checkSig === true) {
        let key = sender + state_obj.channel_id + "_last_signed_state"
        request = request.replace('"', '')
        localStorage.setItem(key, request);
        onDeleteClick(sender, index, STATE_TYPE.Response)
    }
    else {
        toast.error("invalid signature")
    }
}

class PendingStates extends React.Component {
    state = {
        pendingStateRequests: false,
        pendingStateResponse: false,
        sender: false,
    };

    componentDidMount() {
        FetchAccount()
            .then(sender => {
                if (sender) {
                    this.setState({ 'sender': sender })
                    FetchRequests(this.state.sender, STATE_TYPE.Request)
                        .then(request => {
                            if (request !== undefined && request !== null) {
                                this.setState({ pendingStateRequests: request })
                            }
                        })
                        .catch(err => {
                            toast.error("check Redis connectivity")
                        })
                    FetchRequests(this.state.sender, STATE_TYPE.Response)
                        .then(response => {
                            if (response !== undefined && response !== null) {
                                this.setState({ pendingStateResponse: response })
                            }
                        })
                        .catch(err => {
                            toast.error("check Redis connectivity")
                        })
                }

            })
            .catch(err => {
                this.props.history.push({
                    pathname: '/metamaskIssue',
                })
                toast.error("check metamask connectivity")
            })
    }

    render() {
        return (
            <div>
                <h2>New State Requests</h2>
                <div>
                    <table id="table" className="table">
                        <thead>
                            <tr>
                                <th>Decline State</th>
                                <th>Accept State</th>
                                <th>State Type</th>
                                <th>Channel Id</th>
                                <th>Count</th>
                                <th>Alice Cash</th>
                                <th>Bob Cash</th>
                                <th>Last Signed State</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.pendingStateRequests && Object.keys(this.state.pendingStateRequests).map(request => {
                                    return (
                                        <tr key={request}>
                                            <td>
                                                <button className="btn btn-outline-danger" onClick={() => onDeleteClick(this.state.sender, request, STATE_TYPE.Request)} >
                                                    Delete Request
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn btn-outline-danger" onClick={() => onAcceptClick(this.state.sender, this.state.pendingStateRequests[request], request, STATE_TYPE.Response)} >
                                                    Accept Request
                                                </button>
                                            </td>
                                            <td><span>{STATE_TYPE.Request}</span></td>
                                            <td><span>{this.state.pendingStateRequests[request].split('_')[0]}</span></td>
                                            <td><span>{this.state.pendingStateRequests[request].split('_')[1]}</span></td>
                                            <td><span>{this.state.pendingStateRequests[request].split('_')[2]}</span></td>
                                            <td><span>{this.state.pendingStateRequests[request].split('_')[3]}</span></td>
                                            <td>
                                                <button className="btn btn-outline-danger" onClick={() => onShowLastState(this.state.sender, this.state.pendingStateRequests[request])} >
                                                    Show Last Signed State
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }
                                )
                            }
                            {
                                this.state.pendingStateResponse && Object.keys(this.state.pendingStateResponse).map(request => {
                                    return (
                                        <tr key={request}>
                                            <td>
                                                <button className="btn btn-outline-danger" onClick={() => onDeleteClick(this.state.sender, request, STATE_TYPE.Response)} >
                                                    Delete Request
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn btn-outline-danger" onClick={() => onAcceptClickResponse(this.state.sender, this.state.pendingStateResponse[request], request)} >
                                                    Accept Request
                                                </button>
                                            </td>
                                            <td><span>{STATE_TYPE.Response}</span></td>
                                            <td><span>{this.state.pendingStateResponse[request].split('_')[0]}</span></td>
                                            <td><span>{this.state.pendingStateResponse[request].split('_')[1]}</span></td>
                                            <td><span>{this.state.pendingStateResponse[request].split('_')[2]}</span></td>
                                            <td><span>{this.state.pendingStateResponse[request].split('_')[3]}</span></td>
                                            <td>
                                                <button className="btn btn-outline-danger" onClick={() => onShowLastState(this.state.sender, this.state.pendingStateResponse[request])} >
                                                    Show Last Signed State
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
};
export default PendingStates;
