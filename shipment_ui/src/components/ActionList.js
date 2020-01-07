import React from 'react';

class ActiveActionList extends React.Component {
    state = {
        actions: [
            'select action',
            'Transaction',
            'Close',
            'Finalize',
        ],
        value: "",
        operation: "",
        sender: "",
        channels: [],

    }

    render() {
        let actionList = this.state.actions.length > 0
            && this.state.actions.map((item) => {
                return (
                    <option key={item} value={item}>{item}</option>
                )
            }, this);

        return (
            <div>
                <select id="channelId" value={this.props.value} onChange={this.props.onChange}>
                    {actionList}
                </select>
            </div>
        );
    }
}

class WaitingActionList extends React.Component {
    state = {
        actions: [
            'select action',
            'Confirm',
            'Refund',
            'Close',
            'Finalize',
        ],
        value: "",
        operation: "",
        sender: "",
        channels: [],

    }

    render() {
        let actionList = this.state.actions.length > 0
            && this.state.actions.map((item) => {
                return (
                    <option key={item} value={item}>{item}</option>
                )
            }, this);

        return (
            <div>
                <select id="channelId" value={this.props.value} onChange={this.props.onChange}>
                    {actionList}
                </select>
            </div>
        );
    }
}

export { ActiveActionList, WaitingActionList };