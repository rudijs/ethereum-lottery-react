import Web3 from "web3";

// inject the provider from metamask global web3
// metamask uses the older web3 using callbacks
// we want web3 v1 with async/await syntax
const web3 = new Web3(window.web3.currentProvider);

export default web3;
