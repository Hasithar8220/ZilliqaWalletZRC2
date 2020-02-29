const {BN, Long, bytes, units} = require('@zilliqa-js/util');
const {Zilliqa} = require('@zilliqa-js/zilliqa');
const {
    toBech32Address,
    getAddressFromPrivateKey,
} = require('@zilliqa-js/crypto');

// const contractaddress =
//   'f2aea17a2009e18fe5933f5cfd8f3d366ea566ef';

  const contractaddress =
  'de1c34d86e7c0c609302f94dc5275d8e4fb3f0ac';

  //const toAddr='0xc3D900b37f0B72667B55a82acaD457eC54C6B2fd';
  const toAddr='0x09E5a1D215A9ec8eBf31828e5264D9d1cA879b11';
  const amount='5000000';

  //"200000000",

async function main() {
    const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
    const CHAIN_ID = 333;
    const MSG_VERSION = 1;
    const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION);
    //privkey = '3de3a69c4b38ecb9a9d308924f7654251a7dc2c1faf79706f9894c069153249d';
    privkey = '20a403dbbd33bbec8350bf7ad456d0d60e95d9cb6ef7ac741c60b4fb21b4c718';

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
