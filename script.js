// State
let currentMetal = 'gold';
let isMakingPercentage = true;

// DOM Elements
const body = document.body;
const metalBtns = document.querySelectorAll('.metal-btn');
const metalPriceInput = document.getElementById('metalPrice');
const netWeightInput = document.getElementById('netWeight');
const makingChargesInput = document.getElementById('makingCharges');
const makingTypeCheckbox = document.getElementById('makingType');
const vasInput = document.getElementById('vas');
const gstInput = document.getElementById('gst');
const priceHelper = document.getElementById('priceHelper');

// Display Elements
const metalCostDisplay = document.getElementById('metalCostDisplay');
const makingCostDisplay = document.getElementById('makingCostDisplay');
const vasDisplay = document.getElementById('vasDisplay');
const gstDisplay = document.getElementById('gstDisplay');
const grandTotalDisplay = document.getElementById('grandTotalDisplay');

// Constants (Mock Data for Simulation)
const MOCK_PRICES = {
    gold: { min: 6500, max: 7200 },
    silver: { min: 70, max: 90 }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    calculateTotal();
});

// Functions
function toggleMetal(metal) {
    currentMetal = metal;
    
    // Update Theme
    if (metal === 'gold') {
        body.classList.remove('theme-silver');
        body.classList.add('theme-gold');
    } else {
        body.classList.remove('theme-gold');
        body.classList.add('theme-silver');
    }

    // Update Buttons
    metalBtns.forEach(btn => {
        if (btn.dataset.metal === metal) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Reset Price or Fetch New
    metalPriceInput.value = '';
    priceHelper.textContent = 'Enter manual rate or fetch online';
    calculateTotal();
}

function toggleMakingType() {
    isMakingPercentage = !makingTypeCheckbox.checked; // Checked means Flat (based on CSS/HTML structure)
    
    if (isMakingPercentage) {
        makingChargesInput.placeholder = 'Enter percentage';
    } else {
        makingChargesInput.placeholder = 'Enter flat amount';
    }
    calculateTotal();
}

function fetchPrice() {
    const btn = document.querySelector('.fetch-btn');
    const originalText = btn.innerHTML;
    
    // Simulate Loading
    btn.innerHTML = 'Fetching...';
    btn.classList.add('fetching');
    
    setTimeout(() => {
        // Generate random price within range
        const range = MOCK_PRICES[currentMetal];
        const randomPrice = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        
        metalPriceInput.value = randomPrice;
        priceHelper.textContent = `Simulated Live Price for ${currentMetal.charAt(0).toUpperCase() + currentMetal.slice(1)}`;
        
        btn.innerHTML = originalText;
        btn.classList.remove('fetching');
        
        calculateTotal();
    }, 1500);
}

function calculateTotal() {
    // Get Values
    const price = parseFloat(metalPriceInput.value) || 0;
    const weight = parseFloat(netWeightInput.value) || 0;
    const makingInput = parseFloat(makingChargesInput.value) || 0;
    const vas = parseFloat(vasInput.value) || 0;
    const gstPercent = parseFloat(gstInput.value) || 0;

    // Calculations
    const metalCost = price * weight;
    
    let makingCost = 0;
    if (isMakingPercentage) {
        makingCost = (metalCost * makingInput) / 100;
    } else {
        makingCost = makingInput;
    }

    const subTotal = metalCost + makingCost + vas;
    const gstCost = (subTotal * gstPercent) / 100;
    const grandTotal = subTotal + gstCost;

    // Update UI
    metalCostDisplay.textContent = formatCurrency(metalCost);
    makingCostDisplay.textContent = formatCurrency(makingCost);
    vasDisplay.textContent = formatCurrency(vas);
    gstDisplay.textContent = formatCurrency(gstCost);
    grandTotalDisplay.textContent = formatCurrency(grandTotal);
}

function formatCurrency(amount) {
    return '₹ ' + amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
