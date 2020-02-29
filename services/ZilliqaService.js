const { Transaction } = require('@zilliqa-js/account');
const {BN,Long,bytes,units} = require('@zilliqa-js/util');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const {toBech32Address,getAddressFromPrivateKey,} = require('@zilliqa-js/crypto');
const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
const pify = require('pify');
const fs = require('fs');
const config = require('../config.json');
var localStorage = require('node-localstorage').LocalStorage,
  localStorage = new localStorage('./scratch');


// These are set by the core protocol, and may vary per-chain.
// You can manually pack the bytes according to chain id and msg version.
// For more information: https://apidocs.zilliqa.com/?shell#getnetworkid

const chainId = 333; // chainId of the developer testnet
const msgVersion = 1; // current msgVersion
const VERSION = bytes.pack(chainId, msgVersion);
const myGasPrice = units.toQa('1000', units.Units.Li); // Gas Price that will be used by all transactions


// Load contract address from config
const contractaddress = config.contractAddress;


///Class to return wrapper methods for Zilliqa API
class walletData {

  constructor() {}

  
  ///Get contract immutable data and init values by address
  async getContract() {
    const init = await zilliqa.blockchain.getSmartContractInit(contractaddress);
    return init;
  }

  ///Get contract current state and details
  async getSmartContractState() {
    // getSmartContractState currently only supports ByStr20 addresses without 0x prefix
    const state = await zilliqa.blockchain.getSmartContractState(contractaddress);

    return state;

  }

  async transaction(toAddr, amount) {

    const ftAddr = toBech32Address(contractaddress);
    
    console.log(toAddr);
    console.log(amount);

    try {
      const contract = zilliqa.contracts.at(ftAddr);
      const callTx = await contract.call(
        'Transfer',
        [
            {
                vname: 'to',
                type: 'ByStr20',
                value: `${toAddr}`,
            },
            {
                vname: 'amount',
                type: 'Uint128',
                value: `${amount}`,
            }
        ], {
          // amount, gasPrice and gasLimit must be explicitly provided
          version: VERSION,
          amount: new BN(0),
          gasPrice: myGasPrice,
          gasLimit: Long.fromNumber(10000),
        },
        33,
        100,
        false,
      );
      console.log(JSON.stringify(callTx.receipt, null, 4));
      return 1;

    } catch (err) {
      console.log(err);
      return 0;
    }
  }



///Authorizing operators
async isAuthorizedOperator(operatorAddress) {

  console.log('operator:' + operatorAddress);
  const ftAddr = toBech32Address(contractaddress);
  try {
    const contract = zilliqa.contracts.at(ftAddr);
    const callTx = await contract.call(
      'AuthorizeOperator',
      [{
        vname: 'operator',
        type: 'ByStr20',
        value: `${operatorAddress}`,
      }, ], {
        // amount, gasPrice and gasLimit must be explicitly provided
        version: VERSION,
        amount: new BN(0),
        gasPrice: myGasPrice,
        gasLimit: Long.fromNumber(10000),
      },
      33,
      100,
      false,
    );
    console.log(JSON.stringify(callTx.receipt, null, 4));

    return 1;

  } catch (err) {
    console.log(err);
    return 0;
  }

}


  async isContract() {

    const init = await zilliqa.blockchain.getSmartContractInit(contractaddress);
    const result = init.result ? true : false;
    return result;

  }

  

  async mint(recipientaddress, amount) {
    const ftAddr = toBech32Address(contractaddress);
    try {
      const contract = zilliqa.contracts.at(ftAddr);
      const callTx = await contract.call(
        'Mint',
        [{
            vname: 'recipient',
            type: 'ByStr20',
            value: `${recipientaddress}`,
          },
          {
            vname: 'amount',
            type: 'Uint128',
            value: `${amount}`,
          },
        ], {
          // amount, gasPrice and gasLimit must be explicitly provided
          version: VERSION,
          amount: new BN(0),
          gasPrice: myGasPrice,
          gasLimit: Long.fromNumber(10000),
        },
        33,
        100,
        false,
      );
      console.log(JSON.stringify(callTx.receipt, null, 4));

    } catch (err) {
      console.log(err);
    }


  }




  ///Get Transactions Hostory
  getRecentTransactions() {

  }

  async addKeystoreFile(json, passphrase) {

    const address = await zilliqa.wallet.addByKeystore(json, passphrase).catch((err) => {
      return 0;
    });

    console.log(`My account address is: ${address}`);
    // console.log(`My account bech32 address is: ${toBech32Address(address)}`);
    localStorage.setItem('txids', '');

    return address;
  }

  
  async transactionFrom(fromAdd, toAddr, amount) {

    const ftAddr = toBech32Address(contractaddress);
    try {
      const contract = zilliqa.contracts.at(ftAddr);
      const callTx = await contract.call(
        'TransferFrom',
        [{
            vname: 'from',
            type: 'ByStr20',
            value: `${fromAdd}`,
          },
          {
            vname: 'to',
            type: 'ByStr20',
            value: `${toAddr}`,
          },
          {
            vname: 'amount',
            type: 'Uint128',
            value: `${amount}`,
          }
        ], {
          // amount, gasPrice and gasLimit must be explicitly provided
          version: VERSION,
          amount: new BN(0),
          gasPrice: myGasPrice,
          gasLimit: Long.fromNumber(10000),
        },
        33,
        100,
        false,
      );
      console.log(JSON.stringify(callTx.receipt, null, 4));
      return 1;

    } catch (err) {
      console.log(err);
      return 0;
    }
  }


}


module.exports = walletData;