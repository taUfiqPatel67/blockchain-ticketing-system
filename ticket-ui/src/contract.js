export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id", "type": "uint256" },
      { "internalType": "uint256", "name": "_quantity", "type": "uint256" }
    ],
    "name": "buyTicket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "uint256", "name": "_date", "type": "uint256" },
      { "internalType": "uint256", "name": "_ticketCount", "type": "uint256" },
      { "internalType": "uint256", "name": "_ticketPrice", "type": "uint256" }
    ],
    "name": "createEvent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "events",
    "outputs": [
      { "internalType": "address", "name": "organizer", "type": "address" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "uint256", "name": "date", "type": "uint256" },
      { "internalType": "uint256", "name": "ticketPrice", "type": "uint256" },
      { "internalType": "uint256", "name": "ticketCount", "type": "uint256" },
      { "internalType": "uint256", "name": "ticketsSold", "type": "uint256" },
      { "internalType": "uint256", "name": "transferCount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextId",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "tickets",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id", "type": "uint256" },
      { "internalType": "uint256", "name": "_quantity", "type": "uint256" },
      { "internalType": "address", "name": "_to", "type": "address" }
    ],
    "name": "transferTicket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // 🔥 CORRECT HISTORY ABI
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id", "type": "uint256" }
    ],
    "name": "getTicketHistory",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "from", "type": "address" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "quantity", "type": "uint256" },
          { "internalType": "uint8", "name": "action", "type": "uint8" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct TicketingSystem.History[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];