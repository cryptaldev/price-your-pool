export default [
  {
    constant: true,
    inputs: [],
    name: "getTokenTemplate",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getCurrentTokenCount",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "blob", type: "string" },
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "cap", type: "uint256" }
    ],
    name: "createToken",
    outputs: [{ name: "token", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "_template", type: "address" },
      { name: "_collector", type: "address" }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "newTokenAddress", type: "address" },
      { indexed: true, name: "templateAddress", type: "address" },
      { indexed: true, name: "tokenName", type: "string" }
    ],
    name: "TokenCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "tokenAddress", type: "address" },
      { indexed: false, name: "tokenName", type: "string" },
      { indexed: false, name: "tokenSymbol", type: "string" },
      { indexed: false, name: "tokenCap", type: "uint256" },
      { indexed: true, name: "registeredBy", type: "address" },
      { indexed: true, name: "blob", type: "string" }
    ],
    name: "TokenRegistered",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "instance", type: "address" }],
    name: "InstanceDeployed",
    type: "event"
  }
];
