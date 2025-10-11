// Sample market data
const markets = [
  {
    id: "1",
    league: "Premier League",
    match: "Arsenal vs Liverpool",
    time: "2025-09-22 17:00",
    odds: { home: 1.85, draw: 3.6, away: 4.1 },
  },
  {
    id: "2",
    league: "ATP Tennis",
    match: "S. Williams vs A. Rogers",
    time: "2025-09-22 19:30",
    odds: { home: 1.95, away: 1.95 },
  },
  {
    id: "3",
    league: "La Liga",
    match: "Real Madrid vs Barcelona",
    time: "2025-09-23 20:00",
    odds: { home: 2.1, draw: 3.4, away: 3.0 },
  },
];

const marketList = document.getElementById("market-list");
const betSlipContainer = document.getElementById("betslip-container");
const totalStakeEl = document.getElementById("total-stake");
const potentialReturnEl = document.getElementById("potential-return");
const balanceEl = document.getElementById("balance");
const selectionCount = document.getElementById("selection-count");

let balance = 120.0;
let betSlip = [];

// Display markets
function renderMarkets() {
  marketList.innerHTML = "";
  markets.forEach(market => {
    const div = document.createElement("div");
    div.className = "market-item";
    div.innerHTML = `
      <div>
        <strong>${market.match}</strong>
        <div class="small-text">${market.league} • ${market.time}</div>
      </div>
      <div class="odds">
        ${Object.entries(market.odds)
          .map(
            ([key, value]) =>
              `<button onclick="addToBetSlip('${market.id}', '${key}', ${value})">${key.toUpperCase()} ${value.toFixed(2)}</button>`
          )
          .join("")}
      </div>
    `;
    marketList.appendChild(div);
  });
}

// Add bet to slip
function addToBetSlip(marketId, selection, price) {
  const exists = betSlip.find(b => b.marketId === marketId && b.selection === selection);
  if (exists) return;

  betSlip.push({ id: `${marketId}-${selection}`, marketId, selection, price, stake: 1 });
  renderBetSlip();
}

// Remove from slip
function removeFromSlip(id) {
  betSlip = betSlip.filter(b => b.id !== id);
  renderBetSlip();
}

// Update stake
function updateStake(id, stake) {
  betSlip = betSlip.map(b => (b.id === id ? { ...b, stake: Math.max(0, stake) } : b));
  renderBetSlip();
}

// Render bet slip
function renderBetSlip() {
  betSlipContainer.innerHTML = "";
  selectionCount.textContent = betSlip.length;

  if (betSlip.length === 0) {
    betSlipContainer.innerHTML = '<p class="empty-slip">Add selections to build your bet.</p>';
    totalStakeEl.textContent = "0.00";
    potentialReturnEl.textContent = "0.00";
    return;
  }

  let totalStake = 0;
  let potentialReturn = 0;

  betSlip.forEach(bet => {
    totalStake += bet.stake;
    potentialReturn += bet.stake * bet.price;

    const div = document.createElement("div");
    div.className = "bet";
    div.innerHTML = `
      <div>
        <strong>${bet.selection.toUpperCase()}</strong> - ${bet.price.toFixed(2)}
        <span class="remove" onclick="removeFromSlip('${bet.id}')">Remove</span>
      </div>
      <div class="stake-input">
        <input type="number" value="${bet.stake}" onchange="updateStake('${bet.id}', this.value)" />
        <span>Stake</span>
      </div>
    `;
    betSlipContainer.appendChild(div);
  });

  totalStakeEl.textContent = totalStake.toFixed(2);
  potentialReturnEl.textContent = potentialReturn.toFixed(2);
}

// Place bet
document.getElementById("place-bet").addEventListener("click", () => {
  const totalStake = parseFloat(totalStakeEl.textContent);

  if (betSlip.length === 0) {
    alert("Add selections to your bet slip first.");
    return;
  }

  if (totalStake > balance) {
    alert("Insufficient balance. Top up your wallet.");
    return;
  }

  balance -= totalStake;
  balanceEl.textContent = balance.toFixed(2);
  alert(`Bet placed! Stake: $${totalStake.toFixed(2)}`);
  betSlip = [];
  renderBetSlip();
});

// Clear slip
document.getElementById("clear-slip").addEventListener("click", () => {
  betSlip = [];
  renderBetSlip();
});

// Initialize
renderMarkets();
