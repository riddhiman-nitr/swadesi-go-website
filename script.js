const cityData = {
    'Pune': { market: 78, fit: 85, comp: 72, population: '6.4M', delivery: '2.3L', students: '1.8L' },
    'Jaipur': { market: 72, fit: 80, comp: 78, population: '3.2M', delivery: '1.1L', students: '0.9L' },
    'Indore': { market: 68, fit: 88, comp: 82, population: '3.3M', delivery: '1.4L', students: '0.7L' },
    'Lucknow': { market: 65, fit: 82, comp: 80, population: '2.8M', delivery: '1.2L', students: '0.6L' },
    'Bhubaneswar': { market: 60, fit: 75, comp: 85, population: '1.8M', delivery: '0.8L', students: '0.5L' },
};

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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
        const totalWeight = wMarket + wFit + wComp || 1;
        const score = ((data.market * wMarket + data.fit * wFit + data.comp * wComp) / (totalWeight * 100)) * 100;
        return { city, score: score.toFixed(1), data };
    });

    scores.sort((a, b) => b.score - a.score);

    const cityList = document.getElementById('city-list');
    if (cityList) {
        cityList.innerHTML = scores.map((item, idx) => `
            <div class="city-card">
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
    const chartIds = [
        ['marketGrowthChart', 'line', { labels: ['FY20','FY21','FY22','FY23','FY24','FY25E','FY26E','FY27E','FY28E'], data: [800,1200,2100,4500,8200,12500,18000,25000,33500], fill: true, borderColor: '#10b981' }],
        ['segmentChart', 'doughnut', { labels: ['Commuters','Delivery Partners','Students','Others'], data: [35,32,22,11], backgroundColor: ['#10b981','#059669','#34d399','#d1fae5'] }],
        ['adoptionChart', 'bar', { labels: ['Tier-1 (Metro)','Tier-2 (Major)','Tier-3 (Secondary)','Rural'], data: [42,28,15,5], backgroundColor: ['#10b981','#34d399','#d1fae5','#ecfdf5'] }],
        ['tamChart', 'bar', { labels: ['Delivery Partners','Commuters','Students','SME Owners','Replacement Market'], data: [4500,3200,1800,1200,2300], backgroundColor: '#10b981' }],
        ['revenueChart', 'line', { labels: ['M1','M3','M6','M9','M12','M18','M24'], data: [2,5,12,25,50,125,180], fill: true, borderColor: '#10b981' }],
        ['unitEconomicsChart', 'bar', { labels: ['ASP (₹K)','COGS (₹K)','Gross Margin %','CAC (₹K)','LTV (₹L)','LTV:CAC Ratio'], dataSets: [
            { label: 'Year 1', data: [75,54,28,2.5,2.1,84], backgroundColor: '#d1fae5', borderColor: '#10b981' },
            { label: 'Year 2', data: [80,50,37,2.2,2.4,109], backgroundColor: '#34d399', borderColor: '#10b981' },
            { label: 'Year 3', data: [85,47,45,2.0,2.8,140], backgroundColor: '#10b981', borderColor: '#059669' }
        ] }],
    ];

    chartIds.forEach(([chartId, type, config]) => {
        const canvas = document.getElementById(chartId);
        if (!canvas) return;

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: config.dataSets ? true : false } },
            scales: {
                y: { beginAtZero: true, grid: { color: '#e2e8f0' }, ticks: { color: '#64748b' } },
                x: { grid: { color: '#e2e8f0' }, ticks: { color: '#64748b' } }
            }
        };

        if (type === 'doughnut') {
            new Chart(canvas.getContext('2d'), {
                type,
                data: {
                    labels: config.labels,
                    datasets: [{ data: config.data, backgroundColor: config.backgroundColor, borderColor: '#fff', borderWidth: 3 }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { color: '#64748b' } } }
                }
            });
            return;
        }

        if (type === 'bar' && config.dataSets) {
            new Chart(canvas.getContext('2d'), {
                type,
                data: {
                    labels: config.labels,
                    datasets: config.dataSets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: '#64748b' } } },
                    scales: { y: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } }, x: { ticks: { color: '#64748b' }, grid: { display: false } } }
                }
            });
            return;
        }

        new Chart(canvas.getContext('2d'), {
            type,
            data: {
                labels: config.labels,
                datasets: [{
                    label: type === 'line' ? 'Value' : 'TAM (₹ Cr)',
                    data: config.data,
                    borderColor: config.borderColor || '#10b981',
                    backgroundColor: config.fill ? 'rgba(16,185,129,0.12)' : '#10b981',
                    fill: !!config.fill,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 5,
                    backgroundColor: config.backgroundColor || '#10b981',
                    borderColor: config.borderColor || '#10b981'
                }]
            },
            options
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
    initCharts();
});
