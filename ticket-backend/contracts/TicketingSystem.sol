// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicketingSystem {

    struct Event {
        address organizer;
        string name;
        uint256 date;
        uint256 ticketPrice;
        uint256 ticketCount;
        uint256 ticketsSold;
        uint256 transferCount;
    }

    //Action type
    enum ActionType { BUY, TRANSFER }

    //history structure
    struct History {
        address from;
        address to;
        uint256 quantity;
        ActionType action;
        uint256 timestamp;
    }

    mapping(uint256 => Event) public events;
    mapping(address => mapping(uint256 => uint256)) public tickets;

    //structured history instead of address[]
    mapping(uint256 => History[]) public ticketHistory;

    uint256 public nextId;

    // ---------------- CREATE EVENT ----------------
    function createEvent(
        string memory _name,
        uint256 _date,
        uint256 _ticketCount,
        uint256 _ticketPrice
    ) public {

        require(_date > block.timestamp, "Event date should be in the future");
        require(_ticketCount > 0, "Tickets should be greater than zero");

        events[nextId] = Event(
            msg.sender,
            _name,
            _date,
            _ticketPrice,
            _ticketCount,
            0,
            0
        );

        nextId++;
    }

    // ---------------- BUY TICKET ----------------
    function buyTicket(uint256 _id, uint256 _quantity) public payable {

        require(_id < nextId, "Event does not exist");

        Event storage _event = events[_id];

        require(block.timestamp < _event.date, "Event already happened");
        require(_event.ticketsSold + _quantity <= _event.ticketCount, "Not enough tickets");
        require(msg.value == (_event.ticketPrice * _quantity), "Incorrect ETH sent");

        _event.ticketsSold += _quantity;
        tickets[msg.sender][_id] += _quantity;

        //STORE HISTORY
        ticketHistory[_id].push(History({
            from: address(0), // no sender (buy from system)
            to: msg.sender,
            quantity: _quantity,
            action: ActionType.BUY,
            timestamp: block.timestamp
        }));
    }

    // ---------------- TRANSFER ----------------
    function transferTicket(uint256 _id, uint256 _quantity, address _to) public {

        require(_id < nextId, "Invalid Event");
        require(tickets[msg.sender][_id] >= _quantity, "Not enough tickets");

        tickets[msg.sender][_id] -= _quantity;
        tickets[_to][_id] += _quantity;

        events[_id].transferCount += _quantity;

        //STORE HISTORY
        ticketHistory[_id].push(History({
            from: msg.sender,
            to: _to,
            quantity: _quantity,
            action: ActionType.TRANSFER,
            timestamp: block.timestamp
        }));
    }

    // ---------------- GET HISTORY ----------------
    function getTicketHistory(uint256 _id) public view returns (History[] memory) {
        return ticketHistory[_id];
    }
}