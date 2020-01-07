import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
    const activeStyle = { color: "grey" };
    return (
        <h2>
            <nav>
                <NavLink activeStyle={activeStyle} exact to="/">
                    Home
                </NavLink>
                {" | "}
                <NavLink activeStyle={activeStyle} to="/dashboard">
                    DashBoard
                </NavLink>
                {" | "}
                <NavLink activeStyle={activeStyle} to="/pendingstates">
                    Pending States
                </NavLink>
                {" | "}
                <NavLink activeStyle={activeStyle} to="/about">
                    About
                </NavLink>
            </nav>
        </h2>
    );
}

export default Header;
