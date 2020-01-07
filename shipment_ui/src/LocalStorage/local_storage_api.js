
function FetchOffChainDetails(sender, channelId) {
    let key = sender + channelId + '_last_signed_state'
    let value = localStorage.getItem(key)
    if (value !== null && value !== undefined) {
        let splitstate = value.split("_");
        let state_obj = {
            'Channel Id': splitstate[0],
            'count': splitstate[1],
            'Alice Cash': splitstate[2],
            'Bob Cash': splitstate[3],
            'sig': splitstate[4],
        }
        return state_obj
    }
    return "No off chain state Found"
}

function MakeStringState(channelId, count, aliceCash, bobCash, sig) {
    let stringState = channelId + '_' + count + '_' + aliceCash + '_' + bobCash + '_' + sig
    return stringState
}

export { FetchOffChainDetails, MakeStringState }