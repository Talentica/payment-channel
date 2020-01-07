import React from "react";
import { FetchAccount } from "./MetaMaskFetch";
import FilterEvents from "./CreateInstance";
import { GetChannelDetails, IsMyChannelStatic } from "./contract_transaction";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class FetchContractTxn extends React.Component {
    state = {
        sender: "",
    }

    componentDidMount() {

        FetchAccount().then(sender => {
            console.log(sender)
            if (sender) {
                this.setState({ 'sender': sender })
            }
        })
            .catch(err => {
                toast.error("check metamask connectivity")
                console.log(err)
            })
    }

    handle = (promise) => {
        return promise
            .then(data => ([data, undefined]))
            .catch(error => Promise.resolve([undefined, error]));
    }

    fetchEventFilter = async (event) => {
        event.preventDefault();
        let events = await FilterEvents(this.state.sender)

        if (events === undefined || events === null) {
            return
        }
        for (let i = 0; i < events.length; i++) {
            let element = events[i]

            console.log(element.event, element.blockNumber, element.returnValues)
            // element.event = 's'
            if (element.event === 'EventChannelInitializing') {
                // trigered when smart-contract deployed
                // event EventChannelInitializing(address libSig);
                // console.log("Mutli channel contract initiaized using Signature Lib at ", element.returnValues[0])
            }
            else if (element.event === 'EventInitializing') {
                // add channel id in the waiting list
                // triggered when new channel will be initiailized
                // event EventInitializing(uint channel_id, address addressAlice, address addressBob );
                let channel_id = Number.parseInt(element.returnValues[0], 10)
                let result = IsMyChannelStatic(element.returnValues[1], element.returnValues[2], this.state.sender)
                console.log(result)
                if (result) {
                    let key = this.state.sender + 'waiting_channel_ids'
                    let waiting_channels = JSON.parse(localStorage.getItem(key) || "[]")
                    let index = waiting_channels.indexOf(channel_id);
                    if (index < 0) {
                        waiting_channels.push(channel_id)
                        localStorage.setItem(key, JSON.stringify(waiting_channels));
                    }
                    console.log('EventInitializing', channel_id)
                    console.log("waiting channels ", waiting_channels)
                }
            }
            else if (element.event === 'EventInitialized') {
                // REMOVE channel id from waiting list & add channel id in the active channel list
                // Set state if not present in local storage
                // triggered when channel confirmed by both parties.
                // event EventInitialized(uint channel_id, address addressAlice, address addressBob);
                let channel_id = Number.parseInt(element.returnValues[0], 10)
                let result = IsMyChannelStatic(element.returnValues[1], element.returnValues[2], this.state.sender)
                if (result) {
                    let key = this.state.sender + 'waiting_channel_ids'
                    let waiting_channels = JSON.parse(localStorage.getItem(key) || "[]")
                    let index = waiting_channels.indexOf(channel_id);
                    if (index > -1) {
                        waiting_channels.splice(index, 1);
                        localStorage.setItem(key, JSON.stringify(waiting_channels));

                    }
                    key = this.state.sender + 'active_channel_ids'
                    let active_channel_ids = JSON.parse(localStorage.getItem(key) || "[]")
                    index = active_channel_ids.indexOf(channel_id);
                    if (index < 0) {
                        active_channel_ids.push(channel_id)
                        localStorage.setItem(key, JSON.stringify(active_channel_ids));
                        key = this.state.sender + channel_id + '_last_signed_state'
                        let value = localStorage.getItem(key)
                        if (value == null) {
                            let [onChainState, error] = await this.handle(GetChannelDetails(channel_id))
                            if (error !== undefined) {
                                toast.error(error)
                                break
                            }
                            let count = 0
                            let alice_cash = onChainState["Alice Cash"]
                            let bob_cash = onChainState["Bob Cash"]
                            value = channel_id + '_' + count + '_' + alice_cash + '_' + bob_cash + '_default_sign'
                            localStorage.setItem(key, value)
                            console.log(onChainState)
                        }
                    }
                    console.log("EventInitialized", channel_id)
                    console.log("active_channel_ids", active_channel_ids)
                    console.log("waiting_channel_ids", waiting_channels)
                }
            }
            else if (element.event === 'EventRefunded') {
                // event EventRefunded(uint channel_id, address addressAlice);
                let channel_id = Number.parseInt(element.returnValues[0], 10)
                let key = this.state.sender + 'waiting_channel_ids'
                let waiting_channels = JSON.parse(localStorage.getItem(key) || "[]")
                let index = waiting_channels.indexOf(channel_id);
                if (index > -1) {
                    waiting_channels.splice(index, 1);
                    localStorage.setItem(key, JSON.stringify(waiting_channels));
                    console.log("waiting channels ", waiting_channels)
                    key = this.state.sender + channel_id + '_last_signed_state'
                    // TODO: update logice so that this will be independent from last blocked fetched
                    localStorage.removeItem(key)
                }
                console.log("EventRefunded", channel_id)
                console.log('element.returnValues', element.returnValues)

            }
            else if (element.event === 'EventClosing') {
                // add channel id in waiting list 
                // event EventClosing(uint channel_id);
                // this event means one party started channel closing action 
                // and the other needs to take action to make concensus
                let channel_id = Number.parseInt(element.returnValues[0], 10)

                let key = this.state.sender + 'active_channel_ids'
                let active_channel_ids = JSON.parse(localStorage.getItem(key) || "[]")
                let index = active_channel_ids.indexOf(channel_id);
                if (index > -1) {
                    key = this.state.sender + 'waiting_channel_ids'
                    let waiting_channels = JSON.parse(localStorage.getItem(key) || "[]")
                    index = waiting_channels.indexOf(channel_id);
                    if (index < 0) {
                        waiting_channels.push(channel_id)
                        localStorage.setItem(key, JSON.stringify(waiting_channels));
                    }
                    console.log("waiting_channel_ids", waiting_channels)
                }

                console.log("EventClosing", channel_id)

            }
            else if (element.event === 'EventClosed') {
                // event EventClosed(uint channel_id, address addressAlice, address addressBob);
                // triggered when both parties signed closing action or 
                // one party use finalizeClose action after timeout happened
                let channel_id = Number.parseInt(element.returnValues[0], 10)
                let result = IsMyChannelStatic(element.returnValues[1], element.returnValues[2], this.state.sender)
                if (result) {
                    let key = this.state.sender + 'active_channel_ids'
                    let active_channel_ids = JSON.parse(localStorage.getItem(key) || "[]")

                    let index = active_channel_ids.indexOf(channel_id);
                    if (index > -1) {
                        active_channel_ids.splice(index, 1)
                        localStorage.setItem(key, JSON.stringify(active_channel_ids));

                    }
                    key = this.state.sender + 'waiting_channel_ids'
                    let waiting_channels = JSON.parse(localStorage.getItem(key) || "[]")
                    index = waiting_channels.indexOf(channel_id);
                    if (index > -1) {
                        waiting_channels.splice(index, 1);
                        localStorage.setItem(key, JSON.stringify(waiting_channels));

                    }
                    key = this.state.sender + channel_id + '_last_signed_state'
                    localStorage.removeItem(key)
                    console.log("EventClosed", channel_id)
                    console.log("active_channel_ids", active_channel_ids)
                    console.log("waiting_channel_ids", waiting_channels)
                }
            }
            else if (element.event === 'EventNotClosed') {
                // event EventNotClosed(uint channel_id);
                // triggered when false EventClosing happened.
            }
        };
    }

    handlerEvents = async (event) => {
        event.preventDefault();

    }

    render() {
        return (
            <>
                <div>
                    <p><button onClick={this.fetchEventFilter}>Apply Event Filter </button></p>
                </div>
            </>
        );
    }
};

export default FetchContractTxn;
