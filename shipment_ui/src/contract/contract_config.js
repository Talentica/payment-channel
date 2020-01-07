module.exports.contract_address = "0x150e1C7E3D4aE73020DECE799B9a599C87b66038";

module.exports.Web3_Provider = "http://localhost:8545";

module.exports.RedisHandlerURL = 'http://localhost:5002'

module.exports.contract_abi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "channel_id",
                "type": "uint256"
            },
            {
                "name": "count",
                "type": "uint256"
            },
            {
                "name": "sender_balance",
                "type": "uint256"
            },
            {
                "name": "recipient_balance",
                "type": "uint256"
            },
            {
                "name": "signature",
                "type": "bytes"
            }
        ],
        "name": "close",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "channel_id",
                "type": "uint256"
            }
        ],
        "name": "confirm",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "libSig",
                "type": "address"
            }
        ],
        "name": "EventChannelInitializing",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "channel_id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "addressAlice",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "addressBob",
                "type": "address"
            }
        ],
        "name": "EventInitializing",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "channel_id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "addressAlice",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "addressBob",
                "type": "address"
            }
        ],
        "name": "EventInitialized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "channel_id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "addressAlice",
                "type": "address"
            }
        ],
        "name": "EventRefunded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "channel_id",
                "type": "uint256"
            }
        ],
        "name": "EventClosing",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "channel_id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "addressAlice",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "addressBob",
                "type": "address"
            }
        ],
        "name": "EventClosed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "channel_id",
                "type": "uint256"
            }
        ],
        "name": "EventNotClosed",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "channel_id",
                "type": "uint256"
            }
        ],
        "name": "finalizeClose",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "channel_id",
                "type": "uint256"
            },
            {
                "name": "_addressBob",
                "type": "address"
            }
        ],
        "name": "openChannel",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "channel_id",
                "type": "uint256"
            }
        ],
        "name": "refund",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "channel_id",
                "type": "uint256"
            }
        ],
        "name": "getChannel",
        "outputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "name": "id",
                                "type": "address"
                            },
                            {
                                "name": "cash",
                                "type": "uint256"
                            },
                            {
                                "name": "waitForInput",
                                "type": "bool"
                            }
                        ],
                        "name": "alice",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "name": "id",
                                "type": "address"
                            },
                            {
                                "name": "cash",
                                "type": "uint256"
                            },
                            {
                                "name": "waitForInput",
                                "type": "bool"
                            }
                        ],
                        "name": "bob",
                        "type": "tuple"
                    },
                    {
                        "name": "timeout",
                        "type": "uint256"
                    },
                    {
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "name": "publish_tx_count",
                        "type": "uint256"
                    },
                    {
                        "name": "money",
                        "type": "uint256"
                    }
                ],
                "name": "",
                "type": "tuple"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "addr",
                "type": "address"
            },
            {
                "name": "channel_id",
                "type": "uint256"
            },
            {
                "name": "count",
                "type": "uint256"
            },
            {
                "name": "sender_balance",
                "type": "uint256"
            },
            {
                "name": "recipient_balance",
                "type": "uint256"
            },
            {
                "name": "signature",
                "type": "bytes"
            }
        ],
        "name": "isValidSignature",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]