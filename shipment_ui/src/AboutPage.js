import React from "react";

class AboutPage extends React.Component {

  // componentDidMount() {
  // }

  render() {
    return (
      <>
        <h2>This is a payment channel proof of concept DApp.</h2>
        <div>
          <p>
            <ul>
              <li>Alice can establish open a duplex channel on-chain with Bob by using <b><i>Create Channel</i></b>.</li>
              <li>Bob can join a channel established by Alice by using <b><i>Confirm Channel</i></b> (bob needs to act before timeout).</li>
              <li>After channel confirmation, Alice and Bob can pay each other off chain.</li>
              <li>Fund state is secured by smart contract.</li>
              <li>In Case of conflict or withdrawal,  Users can <b><i>Close Channel</i></b> at any time.</li>
              <li>In case of no coordination with the other party, after finalization period users can safely withdraw using <b><i>Finalize Close</i></b>.</li>
            </ul>
          </p>
        </div>

      </>
    );
  }
}

export default AboutPage;

/*
local storage management

last fetched block(on chain ethereum block) ->
    let key = this.state.sender + '_last_fetched_block'

active channel id ->
    let key = this.state.sender + 'active_channel_ids'

waiting channel id ->
    let key = this.state.sender + 'waiting_channel_ids'

last signed state ->
    let key = this.state.sender + <channel_id> + '_last_signed_state'

    add contract_address when possible
    because it can be exploitted between different instance of this contract
    state structure -> Channel_id(number), Count(number), Alice_Cash(number), Bob_Cash(number), Signature(string wiht 0x)
    local storage -> all values will be concat using '_'
User dataBase ->
  let key = user_accounts

All latest update made by the application list
  all event by handler, state requested and state response are  added by all respective actions
  and can be deleted by the <sender> only in local storage
  just for information kind of list
    let key = this.state.sender + '_updates'
    */
