import Web3 from 'web3'
import { Web3_Provider } from "./contract_config";
const web3 = new Web3(Web3.givenProvider || Web3_Provider)

const FetchAccount = async () => {
    // console.log(await window.ethereum.enable())
    let accounts = await web3.eth.getAccounts()
    const account = accounts[0]
    if (web3.utils.toChecksumAddress(account)) {
        return account
    }
    else {
        this.props.history.push({
            pathname: '/metamaskIssue',
        })
        return null
    }
}

export { web3, FetchAccount };