import {
  getCollectionData,
  addCollectionData,
  observeAuth,
  firebaseReady
} from './firebase.js';

const state = {
  language: 'en',
  theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  city: 'Pune',
  materials: [],
  usage: [],
  crops: [],
  expenses: [],
  workers: [],
  activities: []
};

const translations = {
  en: {
    brandTag: 'Smart Farming', pageLabel: 'Farm Control Panel', pageTitle: 'Farmer Management Dashboard',
    profileRole: 'Field Admin', sidebarTips: 'Today Tips', tipTitle: 'Protect soil moisture',
    tipText: 'Irrigate early morning and avoid spraying before strong wind.', navDashboard: 'Dashboard',
    navMaterials: 'Materials', navUsage: 'Farm Usage', navCrops: 'Crops', navExpenses: 'Expenses',
    navWorkers: 'Workers', navWeather: 'Weather', navReports: 'Reports', navSettings: 'Settings',
    dashboardWelcome: 'Overview', dashboardHeading: 'Healthy farm decisions in one place',
    dashboardCopy: 'Track expenses, crop progress, worker salary, materials and live weather from a single responsive dashboard.',
    addExpenseBtn: 'Add Expense', addCropBtn: 'Add Crop', totalExpenses: 'Total Expenses', totalProfit: 'Crop Profit',
    materialsStock: 'Materials in Stock', workerPending: 'Pending Salary', monthSpend: 'This month spending',
    profitMeta: 'Net expected return', stockMeta: 'Available purchase items', salaryMeta: 'Current balance due',
    analyticsLabel: 'Analytics', expenseTrend: 'Expense Trend', weatherLabel: 'Weather', currentWeather: 'Current Weather',
    refreshBtn: 'Refresh', activityLabel: 'Daily Work', dailyActivities: 'Daily Activities', purchaseLabel: 'Purchases',
    recentPurchases: 'Recent Purchases', materialsLabel: 'Material Purchase Management', materialsTitle: 'Track purchase stock and suppliers',
    addMaterialBtn: 'Add Material', materialSearchPlaceholder: 'Search material or supplier', materialName: 'Material', quantity: 'Quantity',
    price: 'Price', supplier: 'Supplier', purchaseDate: 'Date', remainingStock: 'Remaining', usageLabel: 'Farm Usage Tracking',
    usageTitle: 'Monitor material use by crop', addUsageBtn: 'Add Usage', cropName: 'Crop', date: 'Date', notes: 'Notes',
    cropTrackingLabel: 'Crop Tracking', cropTrackingTitle: 'Manage crop lifecycle and profits', expenseLabel: 'Expense Management',
    expenseTitle: 'Record daily farming expenses', workerLabel: 'Worker Salary', workerTitle: 'Attendance and salary reports',
    addWorkerBtn: 'Add Worker', workerName: 'Worker', attendance: 'Attendance', dailySalary: 'Daily Salary',
    monthlySalary: 'Monthly Salary', advancePayment: 'Advance', remainingSalary: 'Remaining', weatherDashboardLabel: 'Weather Dashboard',
    weatherDashboardTitle: 'Forecast and farming suggestions', farmingSuggestions: 'Farming Suggestions', reportsLabel: 'Charts and Analytics',
    reportsTitle: 'Monthly reports and exports', exportExcel: 'Export Excel/JSON', exportPdf: 'Export PDF', settingsLabel: 'Settings',
    settingsTitle: 'Firebase and profile setup', firebaseConfigTitle: 'Firebase Configuration', firebaseConfigText: 'Add your Firebase project keys in firebase.js and enable Email/Password authentication and Firestore.',
    profileSettingsTitle: 'Profile Settings', fullName: 'Full Name', farmLocation: 'Farm Location', languagePreference: 'Language Preference',
    weatherCity: 'Weather City', searchPlaceholder: 'Search records...', saveBtn: 'Save', sowingDate: 'Sowing Date', harvestDate: 'Harvest Date',
    cropStatus: 'Status', fertilizerTracking: 'Fertilizer', pesticideTracking: 'Pesticide', waterUsage: 'Water Usage', cropProfit: 'Profit', cropImage: 'Crop Image',
    expenseType: 'Expense Type'
  },
  mr: {
    brandTag: 'स्मार्ट शेती', pageLabel: 'शेती नियंत्रण पॅनल', pageTitle: 'शेतकरी व्यवस्थापन डॅशबोर्ड',
    profileRole: 'फिल्ड अॅडमिन', sidebarTips: 'आजचा सल्ला', tipTitle: 'मातीतील ओलावा जपा',
    tipText: 'लवकर सकाळी पाणी द्या आणि जोरदार वाऱ्यापूर्वी फवारणी टाळा.', navDashboard: 'डॅशबोर्ड',
    navMaterials: 'साहित्य', navUsage: 'वापर नोंद', navCrops: 'पिके', navExpenses: 'खर्च', navWorkers: 'कामगार',
    navWeather: 'हवामान', navReports: 'अहवाल', navSettings: 'सेटिंग्स', dashboardWelcome: 'आढावा',
    dashboardHeading: 'संपूर्ण शेती निर्णय एका ठिकाणी', dashboardCopy: 'खर्च, पिकांची प्रगती, कामगार पगार, साहित्य आणि हवामान एका प्रतिसादक्षम डॅशबोर्डवर पहा.',
    addExpenseBtn: 'खर्च जोडा', addCropBtn: 'पीक जोडा', totalExpenses: 'एकूण खर्च', totalProfit: 'पीक नफा',
    materialsStock: 'शिल्लक साहित्य', workerPending: 'बाकी पगार', monthSpend: 'या महिन्याचा खर्च', profitMeta: 'अपेक्षित निव्वळ परतावा',
    stockMeta: 'खरेदीतील उपलब्ध साहित्य', salaryMeta: 'सध्या देय रक्कम', analyticsLabel: 'विश्लेषण', expenseTrend: 'खर्च ट्रेंड',
    weatherLabel: 'हवामान', currentWeather: 'सध्याचे हवामान', refreshBtn: 'रिफ्रेश', activityLabel: 'दैनिक काम', dailyActivities: 'दैनिक नोंदी',
    purchaseLabel: 'खरेदी', recentPurchases: 'अलीकडील खरेदी', materialsLabel: 'साहित्य खरेदी व्यवस्थापन', materialsTitle: 'साठा आणि पुरवठादार नोंदवा',
    addMaterialBtn: 'साहित्य जोडा', materialSearchPlaceholder: 'साहित्य किंवा पुरवठादार शोधा', materialName: 'साहित्य', quantity: 'प्रमाण',
    price: 'किंमत', supplier: 'पुरवठादार', purchaseDate: 'दिनांक', remainingStock: 'शिल्लक', usageLabel: 'शेती वापर नोंद',
    usageTitle: 'कोणते साहित्य कोणत्या पिकासाठी वापरले ते पाहा', addUsageBtn: 'वापर जोडा', cropName: 'पीक', date: 'दिनांक', notes: 'नोंदी',
    cropTrackingLabel: 'पीक ट्रॅकिंग', cropTrackingTitle: 'पीक जीवनचक्र आणि नफा व्यवस्थापित करा', expenseLabel: 'खर्च व्यवस्थापन',
    expenseTitle: 'दैनिक शेती खर्च नोंदवा', workerLabel: 'कामगार पगार', workerTitle: 'हजेरी आणि पगार अहवाल', addWorkerBtn: 'कामगार जोडा',
    workerName: 'कामगार', attendance: 'हजेरी', dailySalary: 'दैनिक वेतन', monthlySalary: 'मासिक वेतन', advancePayment: 'आगाऊ',
    remainingSalary: 'उर्वरित', weatherDashboardLabel: 'हवामान डॅशबोर्ड', weatherDashboardTitle: 'अंदाज आणि शेती सूचना', farmingSuggestions: 'शेती सूचना',
    reportsLabel: 'चार्ट आणि विश्लेषण', reportsTitle: 'मासिक अहवाल आणि एक्सपोर्ट', exportExcel: 'Excel/JSON एक्सपोर्ट', exportPdf: 'PDF एक्सपोर्ट',
    settingsLabel: 'सेटिंग्स', settingsTitle: 'Firebase आणि प्रोफाइल सेटअप', firebaseConfigTitle: 'Firebase कॉन्फिगरेशन', firebaseConfigText: 'firebase.js मध्ये तुमचे Firebase keys जोडा आणि Email/Password authentication व Firestore सुरू करा.',
    profileSettingsTitle: 'प्रोफाइल सेटिंग्स', fullName: 'पूर्ण नाव', farmLocation: 'शेती ठिकाण', languagePreference: 'भाषा पसंती', weatherCity: 'हवामान शहर',
    searchPlaceholder: 'नोंदी शोधा...', saveBtn: 'जतन करा', sowingDate: 'पेरणी तारीख', harvestDate: 'कापणी तारीख', cropStatus: 'स्थिती',
    fertilizerTracking: 'खत', pesticideTracking: 'कीटकनाशक', waterUsage: 'पाणी वापर', cropProfit: 'नफा', cropImage: 'पीक फोटो', expenseType: 'खर्च प्रकार'
  }
};

let expenseChart;
let breakdownChart;
let profitChart;
let usageChart;

function qs(selector) { return document.querySelector(selector); }
function qsa(selector) { return [...document.querySelectorAll(selector)]; }

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
}

function showToast(message) {
  const toast = qs('#toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2200);
}

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  const icon = theme === 'dark'
    ? '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
    : '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  qs('#themeToggle').innerHTML = icon;
}

function applyTranslations() {
  const dict = translations[state.language];
  qsa('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (dict[key]) node.textContent = dict[key];
  });
  qsa('[data-i18n-placeholder]').forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    if (dict[key]) node.setAttribute('placeholder', dict[key]);
  });
  qs('#languageToggle').textContent = state.language === 'en' ? 'मराठी' : 'English';
}

function switchSection(sectionId) {
  qsa('.page-section').forEach((section) => section.classList.add('hidden'));
  qsa('.nav-link').forEach((button) => button.classList.remove('active'));
  qs(`#${sectionId}`).classList.remove('hidden');
  document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');
}

async function loadData() {
  const [materials, usage, crops, expenses, workers, activities] = await Promise.all([
    getCollectionData('materials'),
    getCollectionData('usage'),
    getCollectionData('crops'),
    getCollectionData('expenses'),
    getCollectionData('workers'),
    getCollectionData('activities')
  ]);

  state.materials = materials;
  state.usage = usage;
  state.crops = crops;
  state.expenses = expenses;
  state.workers = workers;
  state.activities = activities;
}

function remainingStock(materialName) {
  const purchased = state.materials
    .filter((item) => item.name.toLowerCase() === materialName.toLowerCase())
    .reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const used = state.usage
    .filter((item) => item.material.toLowerCase() === materialName.toLowerCase())
    .reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  return purchased - used;
}

function workerMonthlySalary(worker) {
  return Number(worker.attendance || 0) * Number(worker.dailySalary || 0);
}

function renderStats() {
  const totalExpenses = state.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalProfit = state.crops.reduce((sum, item) => sum + Number(item.profit || 0), 0);
  const stock = state.materials.reduce((sum, item) => sum + remainingStock(item.name), 0);
  const pending = state.workers.reduce((sum, worker) => sum + (workerMonthlySalary(worker) - Number(worker.advance || 0)), 0);

  qs('#totalExpensesValue').textContent = formatCurrency(totalExpenses);
  qs('#totalProfitValue').textContent = formatCurrency(totalProfit);
  qs('#materialsStockValue').textContent = stock;
  qs('#workerPendingValue').textContent = formatCurrency(pending);
}

function renderActivities() {
  const list = qs('#activityList');
  list.innerHTML = state.activities.map((item) => `
    <li class="list-item">
      <div>
        <p class="font-bold mb-1">${item.title}</p>
        <p class="text-sm text-[var(--color-text-muted)]">${item.note}</p>
      </div>
      <span class="badge">${item.time}</span>
    </li>
  `).join('');
}

function renderRecentPurchases() {
  qs('#recentPurchasesList').innerHTML = state.materials.slice(0, 5).map((item) => `
    <div class="list-item">
      <div>
        <p class="font-bold mb-1">${item.name}</p>
        <p class="text-sm text-[var(--color-text-muted)]">${item.supplier}</p>
      </div>
      <div class="text-right">
        <p class="font-bold">${formatCurrency(item.price)}</p>
        <p class="text-xs text-[var(--color-text-faint)]">${item.purchaseDate}</p>
      </div>
    </div>
  `).join('');
}

function renderMaterialsTable(records = state.materials) {
  qs('#materialsTableBody').innerHTML = records.map((item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>${item.supplier}</td>
      <td>${item.purchaseDate}</td>
      <td>${remainingStock(item.name)}</td>
    </tr>
  `).join('');
}

function renderUsageTable() {
  qs('#usageTableBody').innerHTML = state.usage.map((item) => `
    <tr>
      <td>${item.material}</td>
      <td>${item.crop}</td>
      <td>${item.quantity}</td>
      <td>${item.date}</td>
      <td>${item.notes || '-'}</td>
    </tr>
  `).join('');
}

function renderCropCards() {
  const fallback = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80';
  qs('#cropCardGrid').innerHTML = state.crops.map((item) => `
    <article class="crop-card">
      <img src="${item.imageUrl || fallback}" alt="${item.name}" width="600" height="400" loading="lazy" />
      <div class="flex items-center justify-between gap-3 mb-3">
        <h4 class="panel-title">${item.name}</h4>
        <span class="badge">${item.status}</span>
      </div>
      <div class="grid gap-2 text-sm text-[var(--color-text-muted)]">
        <p><strong>Sowing:</strong> ${item.sowingDate}</p>
        <p><strong>Harvest:</strong> ${item.harvestDate}</p>
        <p><strong>Fertilizer:</strong> ${item.fertilizer || '-'}</p>
        <p><strong>Pesticide:</strong> ${item.pesticide || '-'}</p>
        <p><strong>Water:</strong> ${item.waterUsage || '-'}</p>
        <p><strong>Profit:</strong> ${formatCurrency(item.profit)}</p>
      </div>
    </article>
  `).join('');
}

function renderExpenses() {
  qs('#expenseList').innerHTML = state.expenses.map((item) => `
    <div class="list-item">
      <div>
        <p class="font-bold mb-1">${item.type}</p>
        <p class="text-sm text-[var(--color-text-muted)]">${item.notes || '-'}</p>
      </div>
      <div class="text-right">
        <p class="font-bold">${formatCurrency(item.amount)}</p>
        <p class="text-xs text-[var(--color-text-faint)]">${item.date}</p>
      </div>
    </div>
  `).join('');
}

function renderWorkers() {
  qs('#workersTableBody').innerHTML = state.workers.map((worker) => {
    const monthly = workerMonthlySalary(worker);
    const remaining = monthly - Number(worker.advance || 0);
    return `
      <tr>
        <td>${worker.name}</td>
        <td>${worker.attendance}</td>
        <td>${formatCurrency(worker.dailySalary)}</td>
        <td>${formatCurrency(monthly)}</td>
        <td>${formatCurrency(worker.advance || 0)}</td>
        <td>${formatCurrency(remaining)}</td>
      </tr>
    `;
  }).join('');
}

function renderWeatherSuggestions(weather) {
  const suggestions = [];
  if (weather.main.temp > 32) suggestions.push('Use early morning irrigation to reduce evaporation.');
  if (weather.wind.speed > 7) suggestions.push('Avoid pesticide spray in strong wind conditions.');
  if (weather.main.humidity > 75) suggestions.push('Inspect crops for fungal disease after humid hours.');
  if (weather.weather[0].main.toLowerCase().includes('rain')) suggestions.push('Check drainage and delay fertilizer application today.');
  if (!suggestions.length) suggestions.push('Weather is stable. Continue planned field work with regular moisture checks.');

  qs('#suggestionsList').innerHTML = suggestions.map((item) => `<li class="list-item"><p class="text-sm">${item}</p></li>`).join('');
}

async function loadWeather() {
  const apiKey = 'YOUR_OPENWEATHER_API_KEY';
  const city = qs('#cityInput')?.value?.trim() || state.city;
  state.city = city;

  if (apiKey === 'YOUR_OPENWEATHER_API_KEY') {
    const demoWeather = {
      name: city,
      main: { temp: 29, humidity: 66 },
      wind: { speed: 4.1 },
      weather: [{ main: 'Clouds', description: 'broken clouds', icon: '04d' }]
    };
    renderWeather(demoWeather, [
      { day: 'Mon', temp: 29, rain: '10%' },
      { day: 'Tue', temp: 31, rain: '20%' },
      { day: 'Wed', temp: 30, rain: '15%' },
      { day: 'Thu', temp: 28, rain: '55%' },
      { day: 'Fri', temp: 27, rain: '65%' },
      { day: 'Sat', temp: 29, rain: '30%' },
      { day: 'Sun', temp: 30, rain: '18%' }
    ]);
    renderWeatherSuggestions(demoWeather);
    return;
  }

  try {
    const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
    const current = await currentRes.json();
    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
    const forecastJson = await forecastRes.json();
    const forecast = forecastJson.list.filter((_, index) => index % 8 === 0).slice(0, 7).map((item) => ({
      day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      temp: Math.round(item.main.temp),
      rain: `${Math.round((item.pop || 0) * 100)}%`
    }));
    renderWeather(current, forecast);
    renderWeatherSuggestions(current);
  } catch (error) {
    console.error(error);
    showToast('Weather fetch failed.');
  }
}

function renderWeather(current, forecast) {
  qs('#weatherWidget').innerHTML = `
    <div>
      <p class="text-sm text-[var(--color-text-muted)]">${current.name}</p>
      <h3 class="text-4xl font-black mt-1">${Math.round(current.main.temp)}°C</h3>
      <p class="text-sm text-[var(--color-text-muted)] capitalize">${current.weather[0].description}</p>
    </div>
    <div class="grid gap-2 text-right text-sm">
      <p><strong>Humidity:</strong> ${current.main.humidity}%</p>
      <p><strong>Wind:</strong> ${current.wind.speed} m/s</p>
      <p><strong>Rain chance:</strong> ${forecast[0]?.rain || 'N/A'}</p>
    </div>
  `;

  qs('#forecastList').innerHTML = forecast.map((item) => `
    <div class="forecast-item">
      <p class="font-bold">${item.day}</p>
      <p class="text-sm text-[var(--color-text-muted)] mt-1">${item.temp}°C</p>
      <p class="text-xs text-[var(--color-text-faint)] mt-1">Rain ${item.rain}</p>
    </div>
  `).join('');

  qs('#weatherDetails').innerHTML = `
    <div class="weather-tile"><p class="text-xs text-[var(--color-text-muted)]">Temperature</p><h4 class="panel-title mt-1">${Math.round(current.main.temp)}°C</h4></div>
    <div class="weather-tile"><p class="text-xs text-[var(--color-text-muted)]">Humidity</p><h4 class="panel-title mt-1">${current.main.humidity}%</h4></div>
    <div class="weather-tile"><p class="text-xs text-[var(--color-text-muted)]">Wind Speed</p><h4 class="panel-title mt-1">${current.wind.speed} m/s</h4></div>
    <div class="weather-tile"><p class="text-xs text-[var(--color-text-muted)]">Condition</p><h4 class="panel-title mt-1">${current.weather[0].main}</h4></div>
  `;
}

function chartColors() {
  const style = getComputedStyle(document.documentElement);
  return {
    primary: style.getPropertyValue('--color-primary').trim(),
    muted: style.getPropertyValue('--color-text-muted').trim(),
    grid: style.getPropertyValue('--color-border').trim(),
    success: style.getPropertyValue('--color-success').trim(),
    warning: style.getPropertyValue('--color-warning').trim()
  };
}

function buildCharts() {
  const colors = chartColors();
  expenseChart?.destroy();
  breakdownChart?.destroy();
  profitChart?.destroy();
  usageChart?.destroy();

  const expenseMap = {};
  state.expenses.forEach((item) => {
    const key = item.date?.slice(5) || 'Unknown';
    expenseMap[key] = (expenseMap[key] || 0) + Number(item.amount || 0);
  });

  expenseChart = new Chart(qs('#expenseChart'), {
    type: 'line',
    data: {
      labels: Object.keys(expenseMap),
      datasets: [{ label: 'Expenses', data: Object.values(expenseMap), borderColor: colors.primary, backgroundColor: 'rgba(47,127,53,0.12)', tension: 0.35, fill: true }]
    },
    options: chartOptions(colors)
  });

  const expenseTypeMap = {};
  state.expenses.forEach((item) => { expenseTypeMap[item.type] = (expenseTypeMap[item.type] || 0) + Number(item.amount || 0); });
  breakdownChart = new Chart(qs('#expenseBreakdownChart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(expenseTypeMap),
      datasets: [{ data: Object.values(expenseTypeMap), backgroundColor: [colors.primary, colors.success, colors.warning, '#7fbf7f', '#adcfa9'] }]
    },
    options: { plugins: { legend: { labels: { color: colors.muted } } } }
  });

  profitChart = new Chart(qs('#profitChart'), {
    type: 'bar',
    data: {
      labels: state.crops.map((item) => item.name),
      datasets: [{ label: 'Profit', data: state.crops.map((item) => item.profit), backgroundColor: colors.success, borderRadius: 10 }]
    },
    options: chartOptions(colors)
  });

  const usageMap = {};
  state.usage.forEach((item) => { usageMap[item.material] = (usageMap[item.material] || 0) + Number(item.quantity || 0); });
  usageChart = new Chart(qs('#usageChart'), {
    type: 'bar',
    data: {
      labels: Object.keys(usageMap),
      datasets: [{ label: 'Material Usage', data: Object.values(usageMap), backgroundColor: colors.primary, borderRadius: 10 }]
    },
    options: chartOptions(colors)
  });
}

function chartOptions(colors) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: colors.muted } } },
    scales: {
      x: { ticks: { color: colors.muted }, grid: { color: colors.grid } },
      y: { ticks: { color: colors.muted }, grid: { color: colors.grid } }
    }
  };
}

function renderAll() {
  renderStats();
  renderActivities();
  renderRecentPurchases();
  renderMaterialsTable();
  renderUsageTable();
  renderCropCards();
  renderExpenses();
  renderWorkers();
  buildCharts();
}

function serializeForm(form) {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

async function submitHandlers() {
  qs('#materialForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = serializeForm(event.target);
    values.quantity = Number(values.quantity);
    values.price = Number(values.price);
    await addCollectionData('materials', values);
    await refreshData('Material saved');
    qs('#materialModal').close();
    event.target.reset();
  });

  qs('#usageForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = serializeForm(event.target);
    values.quantity = Number(values.quantity);
    await addCollectionData('usage', values);
    await refreshData('Usage saved');
    qs('#usageModal').close();
    event.target.reset();
  });

  qs('#cropForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const file = formData.get('image');
    const values = Object.fromEntries(formData.entries());
    values.profit = Number(values.profit || 0);
    values.imageUrl = file && file.size ? URL.createObjectURL(file) : '';
    await addCollectionData('crops', values);
    await refreshData('Crop saved');
    qs('#cropModal').close();
    event.target.reset();
  });

  qs('#expenseForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = serializeForm(event.target);
    values.amount = Number(values.amount);
    await addCollectionData('expenses', values);
    await refreshData('Expense saved');
    qs('#expenseModal').close();
    event.target.reset();
  });

  qs('#workerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = serializeForm(event.target);
    values.attendance = Number(values.attendance);
    values.dailySalary = Number(values.dailySalary);
    values.advance = Number(values.advance);
    await addCollectionData('workers', values);
    await refreshData('Worker saved');
    qs('#workerModal').close();
    event.target.reset();
  });
}

async function refreshData(message) {
  await loadData();
  renderAll();
  if (message) showToast(message);
}

function setupFilters() {
  qs('#materialSearch').addEventListener('input', (event) => {
    const term = event.target.value.toLowerCase();
    const filter = qs('#materialFilter').value;
    let records = state.materials.filter((item) => item.name.toLowerCase().includes(term) || item.supplier.toLowerCase().includes(term));
    if (filter === 'low') records = records.filter((item) => remainingStock(item.name) <= 10);
    if (filter === 'recent') records = records.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
    renderMaterialsTable(records);
  });
  qs('#materialFilter').addEventListener('change', () => qs('#materialSearch').dispatchEvent(new Event('input')));
}

function setupNavigation() {
  qsa('.nav-link').forEach((button) => {
    button.addEventListener('click', () => {
      switchSection(button.dataset.section);
      qs('#sidebar').classList.remove('open');
    });
  });
  qs('#menuToggle').addEventListener('click', () => qs('#sidebar').classList.toggle('open'));
}

function setupModals() {
  qsa('[data-open-modal]').forEach((button) => button.addEventListener('click', () => qs(`#${button.dataset.openModal}`).showModal()));
  qsa('[data-close-modal]').forEach((button) => button.addEventListener('click', () => qs(`#${button.dataset.closeModal}`).close()));
}

function setupActions() {
  qs('#languageToggle').addEventListener('click', () => {
    state.language = state.language === 'en' ? 'mr' : 'en';
    applyTranslations();
  });
  qs('#themeToggle').addEventListener('click', () => {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    buildCharts();
  });
  qs('#refreshWeatherBtn').addEventListener('click', loadWeather);
  qs('#exportJsonBtn').addEventListener('click', exportData);
  qs('#exportPdfBtn').addEventListener('click', window.print);
}

function exportData() {
  const payload = JSON.stringify({
    materials: state.materials,
    usage: state.usage,
    crops: state.crops,
    expenses: state.expenses,
    workers: state.workers
  }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'farmer-management-report.json';
  link.click();
  URL.revokeObjectURL(url);
}

function setupAuthNotice() {
  observeAuth((user) => {
    const message = firebaseReady
      ? `Logged in as ${user?.email || 'user'}`
      : 'Demo mode active. Add Firebase config for live database.';
    showToast(message);
  });
}

async function init() {
  applyTheme(state.theme);
  applyTranslations();
  setupNavigation();
  setupModals();
  setupActions();
  setupFilters();
  await submitHandlers();
  await refreshData();
  await loadWeather();
  setupAuthNotice();
}

init();
