// Constants
const CHRISTMAS_2024 = new Date(2024, 11, 25); // Month is 0-based

// DOM Elements
const countdownEl = document.getElementById('countdown');
const winnersGrid = document.getElementById('winners-grid');
const searchInput = document.getElementById('winner-search');
const modal = document.getElementById('claim-modal');
const modalConfirm = modal.querySelector('.confirm');
const modalCancel = modal.querySelector('.cancel');

// State
let winners = [];
let currentWinner = null;

// Update countdown
function updateCountdown() {
    const now = new Date();
    const diffTime = CHRISTMAS_2024 - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    countdownEl.textContent = `${diffDays} days until Christmas!`;
}

// Create winner card
function createWinnerCard(winner) {
    const card = document.createElement('div');
    card.className = 'winner-card';
    
    const isAvailable = new Date() >= new Date(winner.giftRevealDate);
    
    card.innerHTML = `
        <div class="winner-header">
            <img src="${winner.profileImage}" alt="${winner.username}'s profile">
            <h3>@${winner.username}</h3>
        </div>
        <div class="gift-container" ${isAvailable && !winner.claimed ? 'onclick="handleClaimAttempt(' + winner.id + ')"' : ''}>
            <div class="gift-icon">🎁</div>
            ${winner.claimed ? '<div class="claimed-overlay">Claimed!</div>' : ''}
            ${!isAvailable ? '<div class="claimed-overlay">Coming Soon!</div>' : ''}
        </div>
        <div class="winner-date">
            ${winner.date}
        </div>
    `;
    
    return card;
}

// Initialize winners data
async function initializeWinners() {
    // Simulate API call
    const mockWinners = Array.from({ length: 25 }, (_, i) => ({
        date: `Dec ${i + 1}, 2024`,
        username: `winner${i + 1}`,
        profileImage: "placeholder-image.png",
        claimed: false,
        id: i + 1,
        giftRevealDate: new Date(2024, 11, i + 1)
    }));

    winners = mockWinners;
    renderWinners(winners);
}

// Render winners
function renderWinners(winnersToRender) {
    winnersGrid.innerHTML = '';
    winnersToRender.forEach(winner => {
        winnersGrid.appendChild(createWinnerCard(winner));
    });
}

// Handle claim attempt
function handleClaimAttempt(winnerId) {
    currentWinner = winners.find(w => w.id === winnerId);
    if (currentWinner) {
        modal.classList.add('active');
    }
}

// Handle claim confirmation
function handleClaimConfirm() {
    if (currentWinner) {
        winners = winners.map(w => 
            w.id === currentWinner.id ? { ...w, claimed: true } : w
        );
        renderWinners(winners);
        closeModal();
    }
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    currentWinner = null;
}

// Search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredWinners = winners.filter(winner => 
        winner.username.toLowerCase().includes(searchTerm)
    );
    renderWinners(filteredWinners);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeWinners();
    updateCountdown();
    setInterval(updateCountdown, 1000 * 60 * 60); // Update every hour
});

searchInput.addEventListener('input', handleSearch);
modalConfirm.addEventListener('click', handleClaimConfirm);
modalCancel.addEventListener('click', closeModal);

// Close modal if clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});