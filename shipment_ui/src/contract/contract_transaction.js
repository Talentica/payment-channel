import { contract_address, contract_abi, Web3_Provider } from "./contract_config";
import { FetchAccount } from './MetaMaskFetch';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Web3 = require('web3')
const web3 = new Web3(Web3.givenProvider || Web3_Provider)
const sideChainContract = new web3.eth.Contract(contract_abi, contract_address)

const GetChannelDetails = async (channelId) => {
    try {
        var details = await sideChainContract.methods.getChannel(channelId).call()
        let details_div = {
            'Alice Id': details['alice']['id'],
            'Alice Cash': details['alice']['cash'],
            'Alice Input Flag': String(details['alice']['waitForInput']),
            'Bob Id': details['bob']['id'],
            'Bob Cash': details['bob']['cash'],
            'Bob Input Flag': String(details['bob']['waitForInput']),
            'Timeout': details['timeout'],
            'Status': details['status'],
            'Published Tx Count': details['publish_tx_count'],
            'Money': details['money']
        }
        return details_div;
    } catch (error) {
        toast.error("contract details are tempered or connectivity issue")
        console.log(error)
    }
}

const FetchOtherParty = async (channelId, ownAddress) => {
    try {
        var details = await sideChainContract.methods.getChannel(channelId).call()
        // console.log(details)
        if (web3.utils.toChecksumAddress(ownAddress) === web3.utils.toChecksumAddress(details['alice']['id'])) {
            return web3.utils.toChecksumAddress(details['bob']['id'])
        }
        else {
            return web3.utils.toChecksumAddress(details['alice']['id'])
        }
    } catch (error) {
        toast.error("contract details are tempered or connectivity issue")
        console.log(error)
    }
}

const ChannelExists = async (channelId) => {
    let details = await GetChannelDetails(channelId)
    return /^0x0+$/.test(details['Alice Id']);
}

const CreateNewChannel = async (channelId, theOtherParty, cash) => {
    const sender = await FetchAccount()
    console.log(sender, web3.utils.checkAddressChecksum(sender))
    try {
        var txHash = await sideChainContract.methods.openChannel(channelId, web3.utils.toChecksumAddress(theOtherParty))
            .send({ from: web3.utils.toChecksumAddress(sender), value: web3.utils.toHex(web3.utils.toWei(cash, 'wei')), gas: 200000 })
        toast.success("New Channel Created - " + channelId)
        console.log('new channel created, txHash->', txHash.transactionHash);
    } catch (error) {
        toast.error("Channel open request reverted")
        console.log(error)
    }
}

const ChannelConfirm = async (channelId, cash) => {
    try {
        const sender = await FetchAccount()
        let flag = await ChannelExists(channelId)
        if (flag) {
            toast.error(`Channel with ${channelId} doesn't exists`)
        } else {
            var txHash = await sideChainContract.methods.confirm(channelId)
                .send({ from: web3.utils.toChecksumAddress(sender), value: web3.utils.toHex(web3.utils.toWei(cash, 'wei')), gas: 200000 })
            console.log('Channel Deposit Confirmed. txHash-> ', txHash.transactionHash);
            toast.success("Deposit confirmed")
        }
    } catch (error) {
        console.log(error)
        toast.error(`Deposit Declined for Channel Id ${channelId}`)
    }
}

const ChannelRefund = async (channelId, self) => {
    try {
        var txHash = await sideChainContract.methods.refund(channelId)
            .send({ from: web3.utils.toChecksumAddress(self), gas: 200000 })
        toast.success('Channel Refund Confirmed')
        console.log('Channel Refund Confirmed. txHash-> ', txHash.transactionHash);
    } catch (error) {
        toast.error("Channel Refund request reverted")
        console.log(error)
    }
}

const IsValidSignature = async (addr, channel_id, count, sender_balance, recipient_balance, signature) => {
    try {
        addr = web3.utils.toChecksumAddress(addr)
        var flag = await sideChainContract.methods.isValidSignature(addr, channel_id, count, sender_balance, recipient_balance, signature).call()
        return flag
    } catch (error) {
        toast.error("contract details are tempered or connectivity issue or invalid arguments passed")
        console.log(error)
    }
}

const ChannelFinalizeClose = async (channelId, self) => {
    try {
        var txHash = await sideChainContract.methods.finalizeClose(channelId)
            .send({ from: web3.utils.toChecksumAddress(self), gas: 200000 })
        toast.success('Channel Closed.')
        console.log('Channel Closed. txHash-> ', txHash.transactionHash);
    } catch (error) {
        toast.error("Channel Close request reverted")
        console.log(error)
    }
}

const ChannelClose = async (channel_id, count, sender_balance, recipient_balance, signature, self) => {
    try {
        var txHash = await sideChainContract.methods.close(channel_id, count, sender_balance, recipient_balance, signature)
            .send({ from: web3.utils.toChecksumAddress(self), gas: 200000 })
        toast.success('Channel Closed.')
        console.log('Channel Close request proceed. txHash-> ', txHash.transactionHash);
    } catch (error) {
        toast.error("Channel Closed request reverted")
        console.log(error)
    }
}

const GetReceipt = async () => {
    console.log(await web3.eth.getTransactionReceipt("0xd67d8714e4998cce8d9f17a98d06e3f3adb268c3010dbb4c2e2dbe17015c9918"))
}

async function IsMyChannel(channelId, sender) {
    try {
        var details = await sideChainContract.methods.getChannel(channelId).call()
        if (sender === details['alice']['id'] || sender === details['bob']['id']) {
            return true
        } else {
            return false
        }
    } catch (error) {
        toast.error("contract details are tempered or connectivity issue")
        console.log(error)
    }
}


function IsMyChannelStatic(alice, bob, sender) {
    try {
        sender = web3.utils.toChecksumAddress(sender)
        if (sender === web3.utils.toChecksumAddress(alice) || sender === web3.utils.toChecksumAddress(bob))
            return true
        else
            return false
    } catch (error) {
        console.log("web3 provider issue")
        console.log(error)
    }
}

export {
    GetChannelDetails, FetchOtherParty, ChannelExists, CreateNewChannel, ChannelConfirm, ChannelRefund, IsValidSignature,
    ChannelFinalizeClose, ChannelClose, GetReceipt, IsMyChannel, IsMyChannelStatic
}