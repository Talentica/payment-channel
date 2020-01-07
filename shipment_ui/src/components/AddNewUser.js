import React from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { web3 } from "../contract/MetaMaskFetch";

class AddNewUser extends React.Component {
    state = {
        errors: false,
        name: '',
        address: '',
        category: 'default',
    }

    componentDidMount() {
    }

    handleAddNewUser = async (event) => {
        event.preventDefault();
        this.setState({ 'errors': false })
        if (!web3.utils.checkAddressChecksum(this.state.address)) {
            this.setState({ 'errors': "provide checksum Address" })
        }
        else if (this.state.sender === '') {
            this.setState({ 'errors': "Enter user name" })
        }
        else {
            let key = 'user_accounts'
            let user_accounts = JSON.parse(localStorage.getItem(key) || "{}")
            if (this.state.address in user_accounts) {
                this.setState({ 'errors': "name already exists in database" })
                toast.error("Address Already exists")
            }
            else {
                let value = [this.state.name, this.state.category]
                user_accounts[this.state.address] = value
                toast.success("account added")
                localStorage.setItem(key, JSON.stringify(user_accounts))
            }
        }
        this.setState({
            'name': "",
            'address': "",
            'category': "default",
        })
    }

    render() {
        return (
            <>
                <div>
                    <form id="form" className="mt-2" onSubmit={this.handleAddNewUser}>
                        <div className="form-group">
                            <label htmlFor="Name">Name</label>
                            <div className="field">
                                <input
                                    id="Name"
                                    type="text"
                                    onChange={event => this.setState({ name: event.target.value })}
                                    name="Name"
                                    className="form-control"
                                    value={this.state.name}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <div className="field">
                                <input
                                    id="address"
                                    type="text"
                                    onChange={event => this.setState({ address: event.target.value })}
                                    name="address"
                                    className="form-control"
                                    value={this.state.address}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <div className="field">
                                <input
                                    id="category"
                                    type="text"
                                    onChange={event => this.setState({ category: event.target.value })}
                                    name="category"
                                    className="form-control"
                                    value={this.state.category}
                                />
                            </div>
                            {this.state.errors && <div className="alert alert-danger">{this.state.errors}</div>}
                        </div>
                        <input type="submit" value="Add User" className="btn btn-primary" />
                    </form>
                </div>

            </>
        );
    }
};

export default AddNewUser;
