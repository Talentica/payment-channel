import { contract_address, contract_abi, Web3_Provider } from "./contract_config";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Web3 = require('web3')
const web3 = new Web3(new Web3(new Web3.providers.HttpProvider(Web3_Provider)))

const sideChainContract = new web3.eth.Contract(contract_abi, contract_address)

const FilterEvents = async (sender) => {
    if (sender === undefined || sender === null) {
        toast.error("Check MetaMask Connectivity")
    }
    else {
        let key = sender + '_last_fetched_block'
        let START_BLOCK = localStorage.getItem(key)
        START_BLOCK = parseInt(START_BLOCK, 10)

        if (Number.isNaN(START_BLOCK)) {
            START_BLOCK = 0
        }
        const END_BLOCK = await web3.eth.getBlockNumber()
        localStorage.setItem(key, END_BLOCK)
        console.log(START_BLOCK, END_BLOCK)
        if (START_BLOCK < END_BLOCK) {
            let events = await sideChainContract.getPastEvents("allEvents",
                {
                    fromBlock: START_BLOCK,
                    toBlock: END_BLOCK // You can also specify 'latest'
                })
            // console.log(events)
            return events
        }
        else {
            console.log("No data to fetch")
            return null
        }
    }

}

export default FilterEvents;