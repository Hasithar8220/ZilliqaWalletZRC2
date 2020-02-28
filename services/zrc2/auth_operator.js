const {BN, Long, bytes, units} = require('@zilliqa-js/util');
const {Zilliqa} = require('@zilliqa-js/zilliqa');
const {
    toBech32Address,
    getAddressFromPrivateKey,
} = require('@zilliqa-js/crypto');

const contractaddress =
  'f2aea17a2009e18fe5933f5cfd8f3d366ea566ef';

 const operatorAddress='0xAA2bA71856725cD9853B210EAa5E99F29a28C300'; 

  


async function main() {
    const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
    const CHAIN_ID = 333;
    const MSG_VERSION = 1;
    const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION);
    privkey = '3de3a69c4b38ecb9a9d308924f7654251a7dc2c1faf79706f9894c069153249d';
    zilliqa.wallet.addByPrivateKey(
        privkey
    );
    const address = getAddressFromPrivateKey(privkey);
    console.log("Your account address is:");
    console.log(`${address}`);
    const myGasPrice = units.toQa('1000', units.Units.Li); // Gas Price that will be used by all transactions


    const ftAddr = toBech32Address(contractaddress);
    try {
        const contract = zilliqa.contracts.at(ftAddr);
        const callTx = await contract.call(
            'AuthorizeOperator',
            [
                {
                    vname: 'operator',
                    type: 'ByStr20',
                    value: `${operatorAddress}`,
                },
            ],
            {
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

main();
