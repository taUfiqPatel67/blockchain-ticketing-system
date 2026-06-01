const hre = require("hardhat");

async function main() {
  const Ticket = await hre.ethers.deployContract("TicketingSystem");

  await Ticket.waitForDeployment();

  console.log("TicketingSystem deployed to:", Ticket.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});