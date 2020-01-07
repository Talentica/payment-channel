import React from "react"
import './ManageDetailsView.css'

function RenderObj(props) {
    return (
        <div>
            <table id="table" className="table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Tx Count</th>
                        <th>Alice Cash</th>
                        <th>Bob Cash</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key='offChainState'>
                        <td>
                            <span>Value</span>
                        </td>
                        <td >
                            <span>{props.details['count']}</span>
                        </td>
                        <td>
                            <span>{props.details['Alice Cash']}</span>
                        </td>
                        <td>
                            <span>{props.details['Bob Cash']}</span>
                        </td>
                    </tr>
                </tbody>
            </table>


        </div>

    )
}

function OffChainStateView(props) {

    return (
        <div>
            <span>Off Chain State</span>
            {(typeof props.details === 'string') && <p>{props.details}</p>}
            {(typeof props.details !== 'string') && <RenderObj details={props.details} />}

        </div>
    )
}

export default OffChainStateView;
