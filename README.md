# 🎟 Blockchain-Based Ticketing System

A decentralized ticketing platform built using Ethereum, Solidity, React.js, and ethers.js that enables secure event creation, ticket purchasing, and peer-to-peer ticket transfer through smart contracts.

---

## 🚀 Features

* Smart contract–based event management
* ETH-powered ticket purchasing
* Secure ticket ownership tracking
* Ticket transfer between users
* Immutable transaction history
* Validation checks to prevent overselling

---

## 🛠 Tech Stack

* Solidity
* React.js
* ethers.js
* Hardhat
* MetaMask
* Ethereum

---

## ⚙️ Project Structure

```text
ticket-backend/
 ├── contracts/
 ├── scripts/
 └── hardhat.config.js

ticket-ui/
 ├── src/
 └── public/
```

---

## ▶️ Setup Instructions

### Backend

```bash
cd ticket-backend
npm install
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### Frontend

```bash
cd ticket-ui
npm install
npm run dev
```

---

## 🔄 Working

The system allows organizers to create events on the blockchain. Users can purchase tickets using ETH, and ownership is securely tracked through smart contracts. Tickets can also be transferred between users while maintaining immutable transaction records.

---

## 📌 Future Enhancements

* ERC-1155 NFT-based tickets
* Refund and cancellation system
* Resale marketplace
* Gas optimization using event logs
