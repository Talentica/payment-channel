import React from 'react';

class ChannelList extends React.Component {

    render() {
        let key = this.props.storage_key
        const list_obj = JSON.parse(localStorage.getItem(key) || "[]")
        list_obj.push("select Id")
        let countriesList = list_obj.length > 0
            && list_obj.map((item) => {
                return (
                    <option key={item} value={item}>{item}</option>
                )
            }, this);

        return (
            <div>
                <select id="channelId" value={this.props.value} onChange={this.props.onChange}>
                    {countriesList}
                </select>
            </div>
        );
    }
}

export default ChannelList;