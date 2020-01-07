# Shipment-Payment Channel-POC

### Dependency Prerequisite

- [BlockChain](https://www.trufflesuite.com/docs/ganache/quickstart)
- [MetaMask Extension](https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/)

Mac:
```
$ brew install node
$ npm install -g ganache-cli
```

Linux:

Install [Node.js](https://nodejs.org/en/download/). Then,
```
$ npm install -g ganache-cli
```

- [Python 3.5+](https://www.python.org/downloads/)

### Develop

Install requirements:
```
cd shipment_redis
pip install -r requirements.txt
```

Run Shipment Redis Server:
```
PYTHONPATH=. python  Redis/RedisServer.py
```

Run Shipment UserInterface:
```
cd ../shipment_ui
npm install
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
