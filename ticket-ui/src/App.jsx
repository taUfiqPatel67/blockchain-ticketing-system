import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract";
import "./App.css";

export default function App() {
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState(null);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState("home");

  const [form, setForm] = useState({
  name: "",
  date: "",
  time: "",
  count: "",
  price: ""
});
if (!window.ethereum) {
  return <p>Please install MetaMask</p>;
}

const [error, setError] = useState("");
const [success, setSuccess] = useState("");

  const short = (a) =>
    !a
      ? "UNKNOWN"
      : a === "0x0000000000000000000000000000000000000000"
      ? "SYSTEM"
      : `${a.slice(0, 6)}...${a.slice(-4)}`;

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // ================= LOAD EVENTS =================
  const loadEvents = async (acc = account) => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const total = Number(await contract.nextId());

    const data = await Promise.all(
      [...Array(total)].map(async (_, i) => {
        const e = await contract.events(i);
        return {
  id: i,
  name: e.name,
  organizer: e.organizer, // ✅ ADD THIS
  date: Number(e.date),
  price: e.ticketPrice,
  count: Number(e.ticketCount),
  sold: Number(e.ticketsSold),
  transfers: Number(e.transferCount),
  history: await contract.getTicketHistory(i),
  mine: acc ? Number(await contract.tickets(acc, i)) : 0
};
      })
    );

    setEvents(data);
  };

  // ================= CONNECT =================
  const connectWallet = async () => {
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    const acc = await window.ethereum.request({ method: "eth_requestAccounts" });
    const s = await browserProvider.getSigner();

    setAccount(acc[0]);
    setSigner(s);
    setPage("home");
    loadEvents(acc[0]);
  };

  // ================= CREATE =================
  const createEvent = async () => {
  setError("");
  setSuccess("");

  // 🔴 VALIDATION
  if (!form.name || !form.date || !form.time || !form.count || !form.price) {
    setError("All fields are required");
    return;
  }

  if (Number(form.count) <= 0) {
    setError("Ticket count must be greater than 0");
    return;
  }

  if (Number(form.price) <= 0) {
    setError("Price must be greater than 0");
    return;
  }

  try {
    const c = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // 🔥 Combine date + time
    const dateTime = new Date(`${form.date}T${form.time}`);
    const unix = Math.floor(dateTime.getTime() / 1000);

    const tx = await c.createEvent(
      form.name,
      unix,
      Number(form.count),
      ethers.parseEther(form.price)
    );

    await tx.wait();

    setSuccess("Event created successfully!");

    setForm({
      name: "",
      date: "",
      time: "",
      count: "",
      price: ""
    });

    loadEvents();

  } catch (err) {
    setError(err.reason || err.message);
  }
};

  // ================= BUY =================
  const buy = async (id) => {
    const c = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const ev = await c.events(id);

    await (await c.buyTicket(id, 1, { value: ev.ticketPrice })).wait();
    loadEvents();
  };

  // ================= TRANSFER =================
  const transfer = async (id) => {
    const to = prompt("Recipient address");
    if (!to) return;

    const c = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    await (await c.transferTicket(id, 1, to)).wait();
    loadEvents();
  };

  useEffect(() => {
    loadEvents();
  }, []);
  const userEventCount = events.filter(e => e.mine > 0).length;

const userTicketsTotal = events.reduce((sum, e) => sum + e.mine, 0);

const myEvents = events.filter(
  e => e.organizer.toLowerCase() === account.toLowerCase()
);

const myEventCount = myEvents.length;

const myTicketsSold = myEvents.reduce(
  (sum, e) => sum + e.sold,
  0
);
const myEarnings = myEvents.reduce((sum, e) => {
  const price = Number(ethers.formatEther(e.price));
  return sum + (price * e.sold);
}, 0);

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <h1>Ticketing System</h1>

        {account && (
          <div>
            {account && (
              <button className="btn secondary" onClick={() => setPage("home")}>
                Home
              </button>
            )}
          </div>
        )}

        {account && <span className="wallet">{short(account)}</span>}
      </header>

      <main className="container">

        {/* CONNECT PAGE */}
        {!account ? (
          <div className="connect-box">

  <h2>Ticketing System</h2>

  <p className="connect-desc">
    A decentralized platform to create, buy, and transfer event tickets.
  </p>

  {/* FEATURES */}
  <div className="connect-features">
    <div className="feature">🎟 Create and manage events</div>
    <div className="feature">💳 Buy tickets using ETH</div>
    <div className="feature">🔄 Transfer tickets securely</div>
  </div>

  {/* INFO */}
  <p className="connect-note">
    Connect your wallet to continue
  </p>

  <button className="btn primary big" onClick={connectWallet}>
    🔐 Connect Wallet
  </button>

</div>

        ) : page === "home" ? (

          /* HOME PAGE */
<div className="home-box">

  <h2>Organizer Dashboard</h2>

  <p className="home-desc">
    Manage your events and track ticket sales.
  </p>

  {/* WALLET */}
  <p className="home-user">
    Connected as {short(account)}
  </p>

  {/* STATS */}
  <div className="home-stats">
  <div className="stat">
    <h3>{myEventCount}</h3>
    <p>Your Events</p>
  </div>

  <div className="stat">
    <h3>{myTicketsSold}</h3>
    <p>Tickets Sold</p>
  </div>

  <div className="stat">
    <h3>{myEarnings.toFixed(2)} ETH</h3>
    <p>Total Earnings</p>
  </div>
</div>
  


  {/* HOW IT WORKS */}
  <div className="home-steps">
    <h4>How it works</h4>

    <div className="step">1. Create an event</div>
    <div className="step">2. Users buy tickets</div>
    <div className="step">3. Tickets can be transferred</div>
  </div>

  {/* ACTION BUTTONS */}
  <div className="home-actions">
    <button className="btn primary big" onClick={() => setPage("create")}>
      ➕ Create Event
    </button>

    <button className="btn secondary big" onClick={() => setPage("events")}>
      🎟 View Events
    </button>
  </div>

</div>

        ) : page === "create" ? (

          /* CREATE PAGE */
          <div className="card form-card">
  <h2>Create Event</h2>

  {/* ERROR */}
  {error && <p className="error">{error}</p>}

  {/* SUCCESS */}
  {success && <p className="success-msg">{success}</p>}

  {/* EVENT DETAILS */}
  <div className="form-section">
    <h4>Event Details</h4>

    <label>Event Name</label>
    <input
      type="text"
      placeholder="Enter event name"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
    />

    <label>Date</label>
    <input
      type="date"
      value={form.date}
      onChange={(e) => setForm({ ...form, date: e.target.value })}
    />

    <label>Time</label>
    <input
      type="time"
      value={form.time}
      onChange={(e) => setForm({ ...form, time: e.target.value })}
    />
  </div>

  {/* TICKET INFO */}
  <div className="form-section">
    <h4>Ticket Information</h4>

    <label>Number of Tickets</label>
    <input
      type="number"
      placeholder="Total tickets"
      value={form.count}
      onChange={(e) => setForm({ ...form, count: e.target.value })}
    />

    <label>Ticket Price (ETH)</label>
    <input
      type="text"
      placeholder="e.g. 0.01"
      value={form.price}
      onChange={(e) => setForm({ ...form, price: e.target.value })}
    />
  </div>

  <button className="btn primary full" onClick={createEvent}>
    Create Event
  </button>
</div>

        ) : (

          /* EVENTS PAGE */
          <div className="event-grid">
            {events.map((ev) => {
              const soldOut = ev.sold >= ev.count;
              const expired = Date.now() > ev.date * 1000;

              return (
                <div key={ev.id} className="event-card">

                  <div className="event-header">
                    <h3>{ev.name}</h3>
                    <span className="ownership">You: {ev.mine}</span>
                  </div>

                  <div className="event-details">
                    <p>{new Date(ev.date * 1000).toLocaleString()}</p>
                    <p>₹{(Number(ethers.formatEther(ev.price)) * 250000).toFixed(0)}</p>
                    <p>{ev.sold}/{ev.count} sold</p>
                  </div>

                  <div className="event-status">
                    {expired && <span className="badge danger">Expired</span>}
                    {!expired && soldOut && <span className="badge">Sold Out</span>}
                    <span className="badge">Transfers: {ev.transfers}</span>
                  </div>

                  <div className="history-box">
                    {ev.history.length === 0 ? (
                      <p className="empty">No activity</p>
                    ) : (
                      ev.history.map((h, i) => (
                        <div key={i} className="history-item">
                          {Number(h.action) === 0
                            ? `🟢 Bought by ${short(h.to)}`
                            : `🔵 ${short(h.from)} → ${short(h.to)}`
                          }
                        </div>
                      ))
                    )}
                  </div>

                  <div className="actions">
                    <button
                      className="btn success"
                      disabled={soldOut || expired}
                      onClick={() => buy(ev.id)}
                    >
                      {expired ? "Expired" : soldOut ? "Sold Out" : "Buy"}
                    </button>

                    <button
                      className="btn secondary"
                      disabled={ev.mine === 0}
                      onClick={() => transfer(ev.id)}
                    >
                      Transfer
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        )}

      </main>
    </div>
  );
}