pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;
import "./ILibSignatures.sol";

contract MultiChannel {
    event EventChannelInitializing(address libSig);
    event EventInitializing(uint channel_id, address addressAlice, address addressBob );
    event EventInitialized(uint channel_id, address addressAlice, address addressBob);
    event EventRefunded(uint channel_id, address addressAlice);
    event EventClosing(uint channel_id);
    event EventClosed(uint channel_id, address addressAlice, address addressBob);
    event EventNotClosed(uint channel_id);

    modifier AliceOrBob(uint channel_id) { require(msg.sender == Channels[channel_id].alice.id || msg.sender == Channels[channel_id].bob.id); _;}

    //Data type for Internal Contract
    struct Party {
        address id;
        uint cash;
        bool waitForInput;
    }
    
    struct Channel {
        Party  alice;
        Party  bob;
        uint  timeout;
        ChannelStatus  status;
        uint  publish_tx_count;
        uint money;
        
    }
    // State options
    enum ChannelStatus {Init, Open, WaitingToClose}

    // channel_id => channel_objects
    mapping (uint => Channel) Channels;
    ILibSignatures libSig;

    /*
    * Constructor for setting initial variables takes as input
    * addresses of the parties of the basic channel
    */
    constructor() public {
        libSig = ILibSignatures(0x0662B997813b9e35dFCC0bBf65C42729c5AD5770);
        emit EventChannelInitializing(libSig);
    }
    
    
    function openChannel(uint channel_id, address _addressBob) public payable {
        require( Channels[channel_id].alice.id == address(0));
        require( Channels[channel_id].bob.id == address(0));
        require( _addressBob != msg.sender);
        Channel memory newChannel;
        newChannel.alice.id = msg.sender;
        newChannel.bob.id = _addressBob;

        // set limit until which Alice and Bob need to respond
        newChannel.timeout = now + 30 minutes;
        newChannel.alice.waitForInput = false;
        newChannel.alice.cash = msg.value;
        newChannel.bob.waitForInput = true;
        // set other initial values
        newChannel.status = ChannelStatus.Init;
        newChannel.publish_tx_count = 0;
        newChannel.money = msg.value;
        Channels[channel_id] = newChannel;
        
        emit EventInitializing(channel_id, msg.sender, _addressBob);
    }
    
    /*
    * This functionality is used to send funds to the contract during 100 minutes after channel creation
    */
    function confirm(uint channel_id) public AliceOrBob(channel_id) payable {
        require(Channels[channel_id].status == ChannelStatus.Init && now < Channels[channel_id].timeout);
        
        require( msg.sender == Channels[channel_id].bob.id && Channels[channel_id].bob.waitForInput);
        
        Channels[channel_id].bob.cash = msg.value;
        Channels[channel_id].money += msg.value;
        Channels[channel_id].bob.waitForInput = false;
        Channels[channel_id].status = ChannelStatus.Open;
        Channels[channel_id].timeout = 0;
        emit EventInitialized(channel_id, Channels[channel_id].alice.id, Channels[channel_id].bob.id);

    }

    /*
    * This function is used in case one of the players did not confirm the MSContract in time
    */
    function refund(uint channel_id) public AliceOrBob(channel_id) {
        require(Channels[channel_id].status == ChannelStatus.Init && now > Channels[channel_id].timeout);

        // refund money
        if (!Channels[channel_id].alice.waitForInput && Channels[channel_id].alice.cash > 0) {
            require(Channels[channel_id].alice.id.send(Channels[channel_id].alice.cash));
        }
        if (!Channels[channel_id].bob.waitForInput && Channels[channel_id].bob.cash > 0) {
            require(Channels[channel_id].bob.id.send(Channels[channel_id].bob.cash));
        }
        emit EventRefunded(channel_id, msg.sender);
        delete Channels[channel_id];
    }
    
    
    function isValidSignature(address addr, uint channel_id, uint count, uint sender_balance, uint recipient_balance, bytes signature)
        public view returns (bool)  
    {
        // bytes32 message = keccak256(abi.encodePacked(count, sender_balance, recipient_balance));
        bytes32 msgHash = keccak256(channel_id, count, sender_balance, recipient_balance);
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(prefix, msgHash);
        return libSig.verify(addr, prefixedHash, signature);
    }
    
    
    function close(uint channel_id, uint count, uint sender_balance, uint recipient_balance, bytes signature) public AliceOrBob(channel_id) {
        if (Channels[channel_id].status == ChannelStatus.Open) {
            if ( msg.sender == Channels[channel_id].alice.id)
                require(isValidSignature(Channels[channel_id].bob.id, channel_id, count, sender_balance, recipient_balance, signature));
            else
                require(isValidSignature(Channels[channel_id].alice.id, channel_id, count, sender_balance, recipient_balance, signature));
            // if _balance > address(this).balance, send address(this).balance to recipient
            require(sender_balance + recipient_balance == Channels[channel_id].money);
            require(count >= Channels[channel_id].publish_tx_count);
            
            Channels[channel_id].publish_tx_count = count;
            Channels[channel_id].bob.cash = recipient_balance;
            Channels[channel_id].alice.cash = sender_balance;
            Channels[channel_id].status = ChannelStatus.WaitingToClose;
            Channels[channel_id].timeout = now + 30 minutes;
            Channels[channel_id].alice.waitForInput = true;
            Channels[channel_id].bob.waitForInput = true;
            emit EventClosing(channel_id);
        }

        if (Channels[channel_id].status != ChannelStatus.WaitingToClose) return;

        // Response (in time) from Player A
        if (Channels[channel_id].alice.waitForInput && msg.sender == Channels[channel_id].alice.id)
            Channels[channel_id].alice.waitForInput = false;

        // Response (in time) from Player B
        if (Channels[channel_id].bob.waitForInput && msg.sender == Channels[channel_id].bob.id)
            Channels[channel_id].bob.waitForInput = false;

        if (!Channels[channel_id].alice.waitForInput && !Channels[channel_id].bob.waitForInput) {
            // send funds to A and B
            if (Channels[channel_id].bob.id.send(Channels[channel_id].bob.cash)) Channels[channel_id].bob.cash = 0;
            if (Channels[channel_id].alice.id.send(Channels[channel_id].alice.cash)) Channels[channel_id].alice.cash = 0;
            // terminate channel
            if (Channels[channel_id].bob.cash == 0 && Channels[channel_id].alice.cash == 0) {
                emit EventClosed(channel_id, Channels[channel_id].alice.id, Channels[channel_id].bob.id);
                delete Channels[channel_id];
                
            }
        }
    }

    function finalizeClose(uint channel_id) public AliceOrBob(channel_id) {
        if (Channels[channel_id].status != ChannelStatus.WaitingToClose) {
            emit EventNotClosed(channel_id);
            return;
        }

        // execute if timeout passed
        require(now > Channels[channel_id].timeout);
        
        // send funds to A and B
        if (Channels[channel_id].alice.id.send(Channels[channel_id].alice.cash)) Channels[channel_id].alice.cash = 0;
        if (Channels[channel_id].bob.id.send(Channels[channel_id].bob.cash)) Channels[channel_id].bob.cash = 0;

        // terminate channel
        if (Channels[channel_id].alice.cash == 0 && Channels[channel_id].bob.cash == 0) {
            emit EventClosed(channel_id, Channels[channel_id].alice.id, Channels[channel_id].bob.id);
            delete Channels[channel_id];
        }
    }
    
    function getChannel(uint channel_id) public view returns(Channel){
        return Channels[channel_id];
    }
}