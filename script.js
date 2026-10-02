const cityData = {
    'Pune': { market: 78, fit: 85, comp: 72, population: '6.4M', delivery: '2.3L', students: '1.8L' },
    'Jaipur': { market: 72, fit: 80, comp: 78, population: '3.2M', delivery: '1.1L', students: '0.9L' },
    'Indore': { market: 68, fit: 88, comp: 82, population: '3.3M', delivery: '1.4L', students: '0.7L' },
    'Lucknow': { market: 65, fit: 82, comp: 80, population: '2.8M', delivery: '1.2L', students: '0.6L' },
    'Bhubaneswar': { market: 60, fit: 75, comp: 85, population: '1.8M', delivery: '0.8L', students: '0.5L' },
};

function updateDashboard() {
    const wMarket = parseInt(document.getElementById('w-market')?.value || 35);
    const wFit = parseInt(document.getElementById('w-fit')?.value || 40);
    const wComp = parseInt(document.getElementById('w-comp')?.value || 25);

    const marketEl = document.getElementById('val-market');
    const fitEl = document.getElementById('val-fit');
    const compEl = document.getElementById('val-comp');

    if (marketEl) marketEl.textContent = wMarket;
    if (fitEl) fitEl.textContent = wFit;
    if (compEl) compEl.textContent = wComp;

    const scores = Object.entries(cityData).map(([city, data]) => {
        const totalWeight = wMarket + wFit + wComp;
        const score = ((data.market * wMarket + data.fit * wFit + data.comp * wComp) / (totalWeight * 100)) * 100;
        return { city, score: score.toFixed(1), data };
    });

    scores.sort((a, b) => b.score - a.score);

    const cityList = document.getElementById('city-list');
    if (cityList) {
        cityList.innerHTML = scores.map((item, idx) => `
            <div class="city-card" style="animation: slideIn 0.3s ease-out ${idx * 0.1}s both;">
                <div class="city-info">
                    <h4>#${idx + 1} ${item.city}</h4>
                    <p>📍 Population: ${item.data.population} | 🚴 Delivery Partners: ${item.data.delivery} | 🎓 Students: ${item.data.students}</p>
                </div>
                <div class="score-badge">
                    <div class="score-value">${item.score}</div>
                    <div class="score-label">R2W Score</div>
                </div>
            </div>
        `).join('');
    }
}

function initCharts() {
    if (document.getElementById('marketGrowthChart')) {
        new Chart(document.getElementById('marketGrowthChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25E', 'FY26E', 'FY27E', 'FY28E'],
                datasets: [{
                    label: 'Market Size (₹ Cr)',
                    data: [800, 1200, 2100, 4500, 8200, 12500, 18000, 25000, 33500],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } },
                    x: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } }
                }
            }
        });
    }

    if (document.getElementById('segmentChart')) {
        new Chart(document.getElementById('segmentChart').getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Commuters', 'Delivery Partners', 'Students', 'Others'],
                datasets: [{
                    data: [35, 32, 22, 11],
                    backgroundColor: ['#10b981', '#059669', '#34d399', '#d1fae5'],
                    borderColor: 'white',
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 20, font: { size: 12, weight: 'bold' }, color: '#64748b' } }
                }
            }
        });
    }

    if (document.getElementById('adoptionChart')) {
        new Chart(document.getElementById('adoptionChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Tier-1 (Metro)', 'Tier-2 (Major)', 'Tier-3 (Secondary)', 'Rural'],
                datasets: [{
                    label: 'EV Adoption %',
                    data: [42, 28, 15, 5],
                    backgroundColor: ['#10b981', '#34d399', '#d1fae5', '#ecfdf5'],
                    borderColor: '#059669',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: { x: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } } }
            }
        });
    }

    if (document.getElementById('tamChart')) {
        new Chart(document.getElementById('tamChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Delivery Partners', 'Commuters', 'Students', 'SME Owners', 'Replacement Market'],
                datasets: [{
                    label: 'TAM (₹ Cr)',
                    data: [4500, 3200, 1800, 1200, 2300],
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } },
                    x: { ticks: { color: '#64748b' }, grid: { display: false } }
                }
            }
        });
    }

    if (document.getElementById('revenueChart')) {
        new Chart(document.getElementById('revenueChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: ['M1', 'M3', 'M6', 'M9', 'M12', 'M18', 'M24'],
                datasets: [{
                    label: 'Revenue (₹ Cr)',
                    data: [2, 5, 12, 25, 50, 125, 180],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: '#10b981',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } },
                    x: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } }
                }
            }
        });
    }

    if (document.getElementById('unitEconomicsChart')) {
        new Chart(document.getElementById('unitEconomicsChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['ASP (₹K)', 'COGS (₹K)', 'Gross Margin %', 'CAC (₹K)', 'LTV (₹L)', 'LTV:CAC Ratio'],
                datasets: [
                    {
                        label: 'Year 1',
                        data: [75, 54, 28, 2.5, 2.1, 84],
                        backgroundColor: '#d1fae5',
                        borderColor: '#10b981',
                        borderWidth: 2
                    },
                    {
                        label: 'Year 2',
                        data: [80, 50, 37, 2.2, 2.4, 109],
                        backgroundColor: '#34d399',
                        borderColor: '#10b981',
                        borderWidth: 2
                    },
                    {
                        label: 'Year 3',
                        data: [85, 47, 45, 2.0, 2.8, 140],
                        backgroundColor: '#10b981',
                        borderColor: '#059669',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#64748b', font: { weight: 'bold' } } } },
                scales: {
                    y: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } },
                    x: { ticks: { color: '#64748b' }, grid: { display: false } }
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
    initCharts();
});
