function CheckTimeOut(timeOut) {

    let current_timestamp = Date.now()
    timeOut = parseInt(timeOut) * 1000
    if (timeOut === 0) {
        return false
    }
    if (current_timestamp > timeOut) {
        return true
    }
    return false
}


export { CheckTimeOut }