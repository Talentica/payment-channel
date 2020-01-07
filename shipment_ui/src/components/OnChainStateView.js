import React from "react"
import './ManageDetailsView.css'

const StatusEnum = {
    0: "Init",
    1: "Active",
    2: "Waiting To Close"
}

function TimeOutReadbale(input) {
    console.log("timeout", input)
    if (input === 0) {
        return "Active Channel, No TimeOut"
    }
    input = parseInt(input) * 1000
    return new Date(input).toUTCString()
}

function RenderObj(props) {
    return (
        <div>
            <table id="table" className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Address</th>
                        <th>Locked Input Money</th>
                        <th>Input Flag</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key='alice'>
                        <td>
                            <span>Alice</span>
                        </td>
                        <td >
                            <span>{props.details['Alice Id']}</span>
                        </td>
                        <td>
                            <span>{props.details['Alice Cash']}</span>
                        </td>
                        <td>
                            <span>{props.details['Alice Input Flag']}</span>
                        </td>
                    </tr>
                    <tr key='bob'>
                        <td>
                            <span>Bob</span>
                        </td>
                        <td >
                            <span>{props.details['Bob Id']}</span>
                        </td>
                        <td>
                            <span>{props.details['Bob Cash']}</span>
                        </td>
                        <td>
                            <span>{props.details['Bob Input Flag']}</span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table id="table" className="table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Status</th>
                        <th>TimeOut</th>
                        <th>Published Tx Count</th>
                        <th>Total Money</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key='details'>
                        <td>
                            <span>Value</span>
                        </td>
                        <td >
                            <span>{StatusEnum[parseInt(props.details['Status'])]}</span>
                        </td>
                        <td>
                            <span>{TimeOutReadbale(parseInt(props.details['Timeout']))}</span>
                        </td>
                        <td>
                            <span>{props.details['Published Tx Count']}</span>
                        </td>
                        <td>
                            <span>{props.details['Money']}</span>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>

    )
}

function OnChainStateView(props) {

    return (
        <div>
            <span >On Chain State</span>
            <RenderObj details={props.details} />
        </div>
    )
}

export default OnChainStateView;
