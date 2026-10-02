// ===== SECTION NAVIGATION =====
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ===== GROWTH OS - CITY RANKING LOGIC =====
const cities = [
    { name: 'Jaipur', wave: 1, scores: { ev: 4, fit: 5, whitespace: 4 } },
    { name: 'Indore', wave: 1, scores: { ev: 3.5, fit: 5, whitespace: 4 } },
    { name: 'Coimbatore', wave: 1, scores: { ev: 3.5, fit: 4.5, whitespace: 4 } },
    { name: 'Lucknow', wave: 1, scores: { ev: 4.5, fit: 4, whitespace: 4 } },
    { name: 'Bhubaneswar', wave: 1, scores: { ev: 3, fit: 4, whitespace: 4.5 } },
    { name: 'Ahmedabad', wave: 2, scores: { ev: 4, fit: 4, whitespace: 3 } },
    { name: 'Kochi', wave: 2, scores: { ev: 3, fit: 3.5, whitespace: 3 } },
    { name: 'Pune', wave: 2, scores: { ev: 4.5, fit: 3.5, whitespace: 2 } },
];

function updateRanking() {
    const w1 = parseFloat(document.getElementById('w1').value);
    const w2 = parseFloat(document.getElementById('w2').value);
    const w3 = parseFloat(document.getElementById('w3').value);
    const total = w1 + w2 + w3 || 1;

    document.getElementById('w1-val').textContent = Math.round((w1 / total) * 100);
    document.getElementById('w2-val').textContent = Math.round((w2 / total) * 100);
    document.getElementById('w3-val').textContent = Math.round((w3 / total) * 100);

    const scored = cities.map((c, idx) => ({
        ...c,
        score: ((c.scores.ev * w1 + c.scores.fit * w2 + c.scores.whitespace * w3) / total) * 20
    })).sort((a, b) => b.score - a.score);

    let html = '';
    scored.forEach((c, idx) => {
        const pct = (c.score / 100) * 100;
        html += `
            <div class="city-row" style="animation: slideInLeft 0.6s ease-out ${idx * 0.1}s both;">
                <div class="city-rank">${idx + 1}</div>
                <div class="city-name">${c.name}</div>
                <div class="city-bar">
                    <div class="city-bar-fill" style="width: ${pct}%; animation: expandWidth 0.8s ease-out ${idx * 0.1}s both;"></div>
                </div>
                <div class="city-score">${c.score.toFixed(1)}</div>
            </div>
        `;
    });

    document.getElementById('ranking-list').innerHTML = html;
}

function updateGate() {
    const champions = parseInt(document.getElementById('gate-champions').value) || 0;
    const rides = parseInt(document.getElementById('gate-rides').value) || 0;
    const conversions = parseInt(document.getElementById('gate-conversions').value) || 0;
    const spend = parseFloat(document.getElementById('gate-spend').value) || 0;

    const cac = conversions > 0 ? Math.round((spend * 100000) / conversions) : 0;
    const convRate = rides > 0 ? ((conversions / rides) * 100).toFixed(1) : 0;
    const referrals = Math.round(rides * 0.2);

    let decision = 'EXPERIMENT';
    let decisionClass = '';
    if (champions >= 100 && rides >= 800 && conversions >= 80 && cac <= 9000) {
        decision = 'SCALE ✓';
        decisionClass = '';
    } else if (conversions < 40 || cac > 13500) {
        decision = 'EXIT ✗';
        decisionClass = 'negative';
    }

    document.getElementById('results-panel').innerHTML = `
        <div class="result-card" style="animation: fadeInUp 0.6s ease-out;">
            <div class="big-number">${convRate}%</div>
            <div class="desc">Test Ride to Conversion</div>
        </div>
        <div class="result-card" style="animation: fadeInUp 0.6s ease-out 0.1s both;">
            <div class="big-number">Rs ${cac.toLocaleString('en-IN')}</div>
            <div class="desc">Customer Acquisition Cost</div>
        </div>
        <div class="result-card" style="animation: fadeInUp 0.6s ease-out 0.2s both;">
            <div class="big-number">${referrals}</div>
            <div class="desc">Est. Referrals Generated</div>
        </div>
        <div class="result-card ${decisionClass}" style="animation: fadeInUp 0.6s ease-out 0.3s both;">
            <div class="big-number">${decision}</div>
            <div class="desc">100-Day Decision Gate</div>
        </div>
    `;
}

// ===== REALRANGE™ CALCULATOR =====
function calculateRange() {
    const weight = parseFloat(document.getElementById('weight').value) || 120;
    const temp = parseFloat(document.getElementById('temp').value) || 28;
    const condition = document.getElementById('condition').value;

    let baseRange = 320;
    const tempFactor = 1 - Math.abs(temp - 28) * 0.01;
    const weightFactor = 1 - (weight - 120) * 0.005;
    
    const conditionFactors = {
        highway: 1.15,
        city: 1.0,
        heavy: 0.85,
        offroad: 0.70
    };

    const range = Math.round(baseRange * tempFactor * weightFactor * conditionFactors[condition]);
    const rangeDisplay = document.getElementById('range-display');
    
    rangeDisplay.style.animation = 'none';
    setTimeout(() => {
        rangeDisplay.style.animation = 'pulse 0.6s ease-out';
        rangeDisplay.textContent = range + ' km';
    }, 10);
}

// ===== ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes expandWidth {
        from {
            width: 0 !important;
        }
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    updateRanking();
    updateGate();
    calculateRange();

    // Add event listeners
    document.getElementById('w1').addEventListener('input', updateRanking);
    document.getElementById('w2').addEventListener('input', updateRanking);
    document.getElementById('w3').addEventListener('input', updateRanking);

    document.getElementById('gate-champions').addEventListener('input', updateGate);
    document.getElementById('gate-rides').addEventListener('input', updateGate);
    document.getElementById('gate-conversions').addEventListener('input', updateGate);
    document.getElementById('gate-spend').addEventListener('input', updateGate);

    document.getElementById('weight').addEventListener('input', calculateRange);
    document.getElementById('temp').addEventListener('input', calculateRange);
    document.getElementById('condition').addEventListener('change', calculateRange);

    console.log('✅ SwadesiGo website loaded successfully!');
});
