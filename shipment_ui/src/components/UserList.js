import React from "react";
// import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './UserList.css'


class UserList extends React.Component {

    render() {
        return (
            <div>
                <h2>User DataBase</h2>
                <Link to="/adduser">
                    <button id="AddUser">
                        <span>Add New User</span>
                    </button>
                </Link>
                <table id='table' className="table">
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(this.props.users).map(user => {
                            return (
                                <tr key={user}>
                                    <td>
                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={() => {
                                                const min = 10000000;
                                                const max = 100000000;
                                                const rand = Math.floor(min + Math.random() * (max - min));
                                                let cash = prompt("Please channel money:", '111');
                                                if (Number.isNaN(parseInt(cash, 10))) {
                                                    toast.error("Enter Interger Amount in Prompt")
                                                }
                                                else {
                                                    this.props.createNewChannel(rand, user, cash).then();
                                                }

                                            }}
                                        >
                                            CreateChannel
                                </button>
                                    </td>
                                    <td>{this.props.users[user][0]}</td>
                                    <td>{user}</td>
                                    <td>{this.props.users[user][1]}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}


export default UserList;
