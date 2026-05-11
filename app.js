import {
  getCollectionData,
  addCollectionData,
  observeAuth
} from './firebase.js';

const state = {
  language: 'en',
  theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  city: 'parner',
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
    navDashboard: 'Dashboard', navMaterials: 'Materials', navUsage: 'Farm Usage', navCrops: 'Crops',
    navExpenses: 'Expenses', navWorkers: 'Workers', navWeather: 'Weather', navReports: 'Reports', navSettings: 'Settings',
    dashboardWelcome: 'Overview', dashboardHeading: 'Healthy farm decisions in one place',
    dashboardCopy: 'Track expenses, crop progress, worker salary, materials and live weather from a single responsive dashboard.',
    addExpenseBtn: 'Add Expense', addCropBtn: 'Add Crop', totalExpenses: 'Total Expenses', totalProfit: 'Crop Profit',
    materialsStock: 'Materials in Stock', workerPending: 'Pending Salary', expenseTrend: 'Expense Trend',
    currentWeather: 'Current Weather', refreshBtn: 'Refresh', dailyActivities: 'Daily Activities', recentPurchases: 'Recent Purchases',
    materialsLabel: 'Material Purchase Management', materialsTitle: 'Track purchase stock and suppliers', addMaterialBtn: 'Add Material',
    materialSearchPlaceholder: 'Search material or supplier', materialName: 'Material', quantity: 'Quantity', price: 'Price',
    supplier: 'Supplier', purchaseDate: 'Date', remainingStock: 'Remaining', usageLabel: 'Farm Usage Tracking',
    usageTitle: 'Monitor material use by crop', addUsageBtn: 'Add Usage', cropName: 'Crop', date: 'Date', notes: 'Notes',
    cropTrackingLabel: 'Crop Tracking', cropTrackingTitle: 'Manage crop lifecycle and profits', expenseLabel: 'Expense Management',
    expenseTitle: 'Record daily farming expenses', workerLabel: 'Worker Salary', workerTitle: 'Attendance and salary reports',
    addWorkerBtn: 'Add Worker', workerName: 'Worker', attendance: 'Attendance', dailySalary: 'Daily Salary',
    monthlySalary: 'Monthly Salary', advancePayment: 'Advance', remainingSalary: 'Remaining', weatherDashboardLabel: 'Weather Dashboard',
    weatherDashboardTitle: 'Forecast and farming suggestions', farmingSuggestions: 'Farming Suggestions', reportsLabel: 'Charts and Analytics',
    reportsTitle: 'Monthly reports and exports', settingsLabel: 'Settings', settingsTitle: 'Firebase and profile setup',
    firebaseConfigTitle: 'Firebase Configuration', profileSettingsTitle: 'Profile Settings', weatherCity: 'Weather City',
    searchPlaceholder: 'Search records...', saveBtn: 'Save', sowingDate: 'Sowing Date', harvestDate: 'Harvest Date',
    cropStatus: 'Status', fertilizerTracking: 'Fertilizer', pesticideTracking: 'Pesticide', waterUsage: 'Water Usage',
    cropProfit: 'Profit', cropImage: 'Crop Image URL', expenseType: 'Expense Type'
  },
  mr: {
    brandTag: 'स्मार्ट शेती', pageLabel: 'शेती नियंत्रण पॅनल', pageTitle: 'शेतकरी व्यवस्थापन डॅशबोर्ड',
    navDashboard: 'डॅशबोर्ड', navMaterials: 'साहित्य', navUsage: 'वापर नोंद', navCrops: 'पिके',
    navExpenses: 'खर्च', navWorkers: 'कामगार', navWeather: 'हवामान', navReports: 'अहवाल', navSettings: 'सेटिंग्स',
    dashboardWelcome: 'आढावा', dashboardHeading: 'संपूर्ण शेती निर्णय एका ठिकाणी',
    dashboardCopy: 'खर्च, पिकांची प्रगती, कामगार पगार, साहित्य आणि हवामान एका प्रतिसादक्षम डॅशबोर्डवर पहा.',
    addExpenseBtn: 'खर्च जोडा', addCropBtn: 'पीक जोडा', totalExpenses: 'एकूण खर्च', totalProfit: 'पीक नफा',
    materialsStock: 'शिल्लक साहित्य', workerPending: 'बाकी पगार', expenseTrend: 'खर्च ट्रेंड',
    currentWeather: 'सध्याचे हवामान', refreshBtn: 'रिफ्रेश', dailyActivities: 'दैनिक नोंदी', recentPurchases: 'अलीकडील खरेदी',
    materialsLabel: 'साहित्य खरेदी व्यवस्थापन', materialsTitle: 'साठा आणि पुरवठादार नोंदवा', addMaterialBtn: 'साहित्य जोडा',
    materialSearchPlaceholder: 'साहित्य किंवा पुरवठादार शोधा', materialName: 'साहित्य', quantity: 'प्रमाण', price: 'किंमत',
    supplier: 'पुरवठादार', purchaseDate: 'दिनांक', remainingStock: 'शिल्लक', usageLabel: 'शेती वापर नोंद',
    usageTitle: 'कोणते साहित्य कोणत्या पिकासाठी वापरले ते पाहा', addUsageBtn: 'वापर जोडा', cropName: 'पीक', date: 'दिनांक', notes: 'नोंदी',
    cropTrackingLabel: 'पीक ट्रॅकिंग', cropTrackingTitle: 'पीक जीवनचक्र आणि नफा व्यवस्थापित करा', expenseLabel: 'खर्च व्यवस्थापन',
    expenseTitle: 'दैनिक शेती खर्च नोंदवा', workerLabel: 'कामगार पगार', workerTitle: 'हजेरी आणि पगार अहवाल', addWorkerBtn: 'कामगार जोडा',
    workerName: 'कामगार', attendance: 'हजेरी', dailySalary: 'दैनिक वेतन', monthlySalary: 'मासिक वेतन', advancePayment: 'आगाऊ',
    remainingSalary: 'उर्वरित', weatherDashboardLabel: 'हवामान डॅशबोर्ड', weatherDashboardTitle: 'अंदाज आणि शेती सूचना',
    farmingSuggestions: 'शेती सूचना', reportsLabel: 'चार्ट आणि विश्लेषण', reportsTitle: 'मासिक अहवाल आणि एक्सपोर्ट',
    settingsLabel: 'सेटिंग्स', settingsTitle: 'Firebase आणि प्रोफाइल सेटअप', firebaseConfigTitle: 'Firebase कॉन्फिगरेशन',
    profileSettingsTitle: 'प्रोफाइल सेटिंग्स', weatherCity: 'हवामान शहर', searchPlaceholder: 'नोंदी शोधा...', saveBtn: 'जतन करा',
    sowingDate: 'पेरणी तारीख', harvestDate: 'कापणी तारीख', cropStatus: 'स्थिती', fertilizerTracking: 'खत',
    pesticideTracking: 'कीटकनाशक', waterUsage: 'पाणी वापर', cropProfit: 'नफा', cropImage: 'पीक फोटो URL', expenseType: 'खर्च प्रकार'
  }
};

let expenseChart;
let breakdownChart;
let profitChart;
let usageChart;

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];

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
  const safeGet = async (name) => {
    try {
      return await getCollectionData(name);
    } catch {
      return [];
    }
  };

  const [materials, usage, crops, expenses, workers, activities] = await Promise.all([
    safeGet('materials'),
    safeGet('usage'),
    safeGet('crops'),
    safeGet('expenses'),
    safeGet('workers'),
    safeGet('activities')
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
    .filter((item) => (item.name || '').toLowerCase() === materialName.toLowerCase())
    .reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const used = state.usage
    .filter((item) => (item.material || '').toLowerCase() === materialName.toLowerCase())
    .reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  return purchased - used;
}

function workerMonthlySalary(worker) {
  return Number(worker.attendance || 0) * Number(worker.dailySalary || 0);
}

function renderEmpty(targetId, text) {
  qs(targetId).innerHTML = `<div class="list-item"><p class="text-sm text-[var(--color-text-muted)]">${text}</p></div>`;
}

function renderStats() {
  const totalExpenses = state.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalProfit = state.crops.reduce((sum, item) => sum + Number(item.profit || 0), 0);
  const stock = state.materials.reduce((sum, item) => sum + Math.max(remainingStock(item.name || ''), 0), 0);
  const pending = state.workers.reduce((sum, worker) => sum + (workerMonthlySalary(worker) - Number(worker.advance || 0)), 0);

  qs('#totalExpensesValue').textContent = formatCurrency(totalExpenses);
  qs('#totalProfitValue').textContent = formatCurrency(totalProfit);
  qs('#materialsStockValue').textContent = stock;
  qs('#workerPendingValue').textContent = formatCurrency(pending);
}

function renderActivities() {
  const list = qs('#activityList');
  if (!state.activities.length) return renderEmpty('#activityList', 'No activity data yet.');
  list.innerHTML = state.activities.map((item) => `
    <li class="list-item">
      <div>
        <p class="font-bold mb-1">${item.title || '-'}</p>
        <p class="text-sm text-[var(--color-text-muted)]">${item.note || '-'}</p>
      </div>
      <span class="badge">${item.time || '-'}</span>
    </li>
  `).join('');
}

function renderRecentPurchases() {
  if (!state.materials.length) return renderEmpty('#recentPurchasesList', 'No purchase data yet.');
  qs('#recentPurchasesList').innerHTML = state.materials.slice(0, 5).map((item) => `
    <div class="list-item">
      <div>
        <p class="font-bold mb-1">${item.name || '-'}</p>
        <p class="text-sm text-[var(--color-text-muted)]">${item.supplier || '-'}</p>
      </div>
      <div class="text-right">
        <p class="font-bold">${formatCurrency(item.price)}</p>
        <p class="text-xs text-[var(--color-text-faint)]">${item.purchaseDate || '-'}</p>
      </div>
    </div>
  `).join('');
}

function renderMaterialsTable(records = state.materials) {
  const body = qs('#materialsTableBody');
  if (!records.length) {
    body.innerHTML = `<tr><td colspan="6">No material data found.</td></tr>`;
    return;
  }
  body.innerHTML = records.map((item) => `
    <tr>
      <td>${item.name || '-'}</td>
      <td>${item.quantity || 0}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>${item.supplier || '-'}</td>
      <td>${item.purchaseDate || '-'}</td>
      <td>${remainingStock(item.name || '')}</td>
    </tr>
  `).join('');
}

function renderUsageTable() {
  const body = qs('#usageTableBody');
  if (!state.usage.length) {
    body.innerHTML = `<tr><td colspan="5">No usage data found.</td></tr>`;
    return;
  }
  body.innerHTML = state.usage.map((item) => `
    <tr>
      <td>${item.material || '-'}</td>
      <td>${item.crop || '-'}</td>
      <td>${item.quantity || 0}</td>
      <td>${item.date || '-'}</td>
      <td>${item.notes || '-'}</td>
    </tr>
  `).join('');
}

function renderCropCards() {
  if (!state.crops.length) {
    qs('#cropCardGrid').innerHTML = `<div class="panel-card"><p class="text-sm text-[var(--color-text-muted)]">No crop data found.</p></div>`;
    return;
  }

  const fallback = 'https://picsum.photos/seed/farm-crop/800/500';
  qs('#cropCardGrid').innerHTML = state.crops.map((item) => `
    <article class="crop-card">
      <img src="${item.imageUrl || fallback}" alt="${item.name || 'Crop'}" width="600" height="400" loading="lazy" class="rounded-2xl mb-4 object-cover h-48 w-full" />
      <div class="flex items-center justify-between gap-3 mb-3">
        <h4 class="panel-title">${item.name || '-'}</h4>
        <span class="badge">${item.status || '-'}</span>
      </div>
      <div class="grid gap-2 text-sm text-[var(--color-text-muted)]">
        <p><strong>Sowing:</strong> ${item.sowingDate || '-'}</p>
        <p><strong>Harvest:</strong> ${item.harvestDate || '-'}</p>
        <p><strong>Fertilizer:</strong> ${item.fertilizer || '-'}</p>
        <p><strong>Pesticide:</strong> ${item.pesticide || '-'}</p>
        <p><strong>Water:</strong> ${item.waterUsage || '-'}</p>
        <p><strong>Profit:</strong> ${formatCurrency(item.profit)}</p>
      </div>
    </article>
  `).join('');
}

function renderExpenses() {
  if (!state.expenses.length) return renderEmpty('#expenseList', 'No expense data found.');
  qs('#expenseList').innerHTML = state.expenses.map((item) => `
    <div class="list-item">
      <div>
        <p class="font-bold mb-1">${item.type || '-'}</p>
        <p class="text-sm text-[var(--color-text-muted)]">${item.notes || '-'}</p>
      </div>
      <div class="text-right">
        <p class="font-bold">${formatCurrency(item.amount)}</p>
        <p class="text-xs text-[var(--color-text-faint)]">${item.date || '-'}</p>
      </div>
    </div>
  `).join('');
}

function renderWorkers() {
  const body = qs('#workersTableBody');
  if (!state.workers.length) {
    body.innerHTML = `<tr><td colspan="6">No worker data found.</td></tr>`;
    return;
  }
  body.innerHTML = state.workers.map((worker) => {
    const monthly = workerMonthlySalary(worker);
    const remaining = monthly - Number(worker.advance || 0);
    return `
      <tr>
        <td>${worker.name || '-'}</td>
        <td>${worker.attendance || 0}</td>
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
  if ((weather.weather[0].main || '').toLowerCase().includes('rain')) suggestions.push('Check drainage and delay fertilizer application today.');
  if (!suggestions.length) suggestions.push('Weather is stable. Continue planned field work with regular moisture checks.');

  qs('#suggestionsList').innerHTML = suggestions.map((item) => `<li class="list-item"><p class="text-sm">${item}</p></li>`).join('');
}

async function loadWeather() {
  const apiKey = 'YOUR_OPENWEATHER_API_KEY';
  const city = qs('#cityInput')?.value?.trim() || state.city;
  state.city = city;

  if (apiKey === 'YOUR_OPENWEATHER_API_KEY') {
    qs('#weatherWidget').innerHTML = `<p class="text-sm text-[var(--color-text-muted)]">Add OpenWeather API key in app.js</p>`;
    qs('#forecastList').innerHTML = '';
    qs('#weatherDetails').innerHTML = '';
    qs('#suggestionsList').innerHTML = `<li class="list-item"><p class="text-sm">Weather suggestions will appear after API setup.</p></li>`;
    return;
  }

  try {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

    const [currentRes, forecastRes] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)]);
    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    qs('#weatherWidget').innerHTML = `
      <div>
        <p class="text-sm text-[var(--color-text-muted)]">${current.name || city}</p>
        <h3 class="text-3xl font-black">${Math.round(current.main.temp)}°C</h3>
        <p class="text-sm text-[var(--color-text-muted)]">${current.weather?.[0]?.description || '-'}</p>
      </div>
      <div class="text-right">
        <p class="text-sm">Humidity: ${current.main.humidity}%</p>
        <p class="text-sm">Wind: ${current.wind.speed} m/s</p>
      </div>
    `;

    const forecastItems = (forecast.list || []).filter((_, index) => index % 8 === 0).slice(0, 7);
    qs('#forecastList').innerHTML = forecastItems.map((item) => `
      <div class="forecast-item">
        <p class="font-semibold">${new Date(item.dt_txt).toLocaleDateString('en-IN', { weekday: 'short' })}</p>
        <p class="text-2xl font-bold mt-2">${Math.round(item.main.temp)}°C</p>
        <p class="text-sm text-[var(--color-text-muted)] mt-1">${item.weather?.[0]?.main || '-'}</p>
      </div>
    `).join('');

    qs('#weatherDetails').innerHTML = `
      <div class="weather-tile"><p class="text-sm text-[var(--color-text-muted)]">Rain</p><h4 class="text-xl font-bold">${forecastItems.some(i => (i.weather?.[0]?.main || '').includes('Rain')) ? 'Likely' : 'Low'}</h4></div>
      <div class="weather-tile"><p class="text-sm text-[var(--color-text-muted)]">Temperature</p><h4 class="text-xl font-bold">${Math.round(current.main.temp)}°C</h4></div>
      <div class="weather-tile"><p class="text-sm text-[var(--color-text-muted)]">Humidity</p><h4 class="text-xl font-bold">${current.main.humidity}%</h4></div>
      <div class="weather-tile"><p class="text-sm text-[var(--color-text-muted)]">Wind</p><h4 class="text-xl font-bold">${current.wind.speed} m/s</h4></div>
    `;

    renderWeatherSuggestions(current);
  } catch (error) {
    qs('#weatherWidget').innerHTML = `<p class="text-sm text-red-500">Weather load failed.</p>`;
  }
}

function destroyChart(instance) {
  if (instance) instance.destroy();
}

function buildCharts() {
  destroyChart(expenseChart);
  destroyChart(breakdownChart);
  destroyChart(profitChart);
  destroyChart(usageChart);

  const expenseLabels = state.expenses.map((item) => item.date || '-').reverse();
  const expenseValues = state.expenses.map((item) => Number(item.amount || 0)).reverse();

  expenseChart = new Chart(qs('#expenseChart'), {
    type: 'line',
    data: {
      labels: expenseLabels,
      datasets: [{
        label: 'Expenses',
        data: expenseValues,
        borderColor: '#2f7f35',
        backgroundColor: 'rgba(47,127,53,0.15)',
        fill: true,
        tension: 0.35
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  const categoryMap = {};
  state.expenses.forEach((item) => {
    categoryMap[item.type || 'Other'] = (categoryMap[item.type || 'Other'] || 0) + Number(item.amount || 0);
  });

  breakdownChart = new Chart(qs('#expenseBreakdownChart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(categoryMap),
      datasets: [{
        data: Object.values(categoryMap),
        backgroundColor: ['#2f7f35', '#63bf65', '#94d793', '#c0e7bf', '#225026']
      }]
    },
    options: { responsive: true }
  });

  profitChart = new Chart(qs('#profitChart'), {
    type: 'bar',
    data: {
      labels: state.crops.map((item) => item.name || '-'),
      datasets: [{
        label: 'Profit',
        data: state.crops.map((item) => Number(item.profit || 0)),
        backgroundColor: '#63bf65'
      }]
    },
    options: { responsive: true }
  });

  const usageMap = {};
  state.usage.forEach((item) => {
    usageMap[item.material || 'Unknown'] = (usageMap[item.material || 'Unknown'] || 0) + Number(item.quantity || 0);
  });

  usageChart = new Chart(qs('#usageChart'), {
    type: 'bar',
    data: {
      labels: Object.keys(usageMap),
      datasets: [{
        label: 'Usage',
        data: Object.values(usageMap),
        backgroundColor: '#2f7f35'
      }]
    },
    options: { responsive: true }
  });
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

function openModal(id) {
  qs(`#${id}`).showModal();
}

function closeModal(id) {
  qs(`#${id}`).close();
}

function getFormObject(form) {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}

async function handleFormSubmit(event, collectionName, transform) {
  event.preventDefault();
  const form = event.currentTarget;
  const raw = getFormObject(form);
  const payload = transform(raw);

  try {
    await addCollectionData(collectionName, payload);
    form.reset();
    form.closest('dialog')?.close();
    await refreshApp();
    showToast('Saved successfully');
  } catch (error) {
    showToast('Save failed');
  }
}

function bindForms() {
  qs('#materialForm').addEventListener('submit', (e) =>
    handleFormSubmit(e, 'materials', (raw) => ({
      name: raw.name,
      quantity: Number(raw.quantity),
      price: Number(raw.price),
      supplier: raw.supplier,
      purchaseDate: raw.purchaseDate
    }))
  );

  qs('#usageForm').addEventListener('submit', (e) =>
    handleFormSubmit(e, 'usage', (raw) => ({
      material: raw.material,
      crop: raw.crop,
      quantity: Number(raw.quantity),
      date: raw.date,
      notes: raw.notes
    }))
  );

  qs('#cropForm').addEventListener('submit', (e) =>
    handleFormSubmit(e, 'crops', (raw) => ({
      name: raw.name,
      sowingDate: raw.sowingDate,
      harvestDate: raw.harvestDate,
      status: raw.status,
      fertilizer: raw.fertilizer,
      pesticide: raw.pesticide,
      waterUsage: raw.waterUsage,
      profit: Number(raw.profit || 0),
      imageUrl: raw.imageUrl
    }))
  );

  qs('#expenseForm').addEventListener('submit', (e) =>
    handleFormSubmit(e, 'expenses', (raw) => ({
      type: raw.type,
      amount: Number(raw.amount),
      date: raw.date,
      notes: raw.notes
    }))
  );

  qs('#workerForm').addEventListener('submit', (e) =>
    handleFormSubmit(e, 'workers', (raw) => ({
      name: raw.name,
      attendance: Number(raw.attendance),
      dailySalary: Number(raw.dailySalary),
      advance: Number(raw.advance)
    }))
  );
}

function bindUI() {
  qsa('.nav-link').forEach((button) => {
    button.addEventListener('click', () => switchSection(button.dataset.section));
  });

  qs('#menuToggle').addEventListener('click', () => {
    qs('#sidebar').classList.toggle('open');
  });

  qs('#themeToggle').addEventListener('click', () => {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  });

  qs('#languageToggle').addEventListener('click', () => {
    state.language = state.language === 'en' ? 'mr' : 'en';
    applyTranslations();
  });

  qsa('[data-open-modal]').forEach((button) => {
    button.addEventListener('click', () => openModal(button.dataset.openModal));
  });

  qsa('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', () => closeModal(button.dataset.closeModal));
  });

  qs('#refreshWeatherBtn').addEventListener('click', loadWeather);

  qs('#materialSearch').addEventListener('input', (event) => {
    const value = event.target.value.trim().toLowerCase();
    const filtered = state.materials.filter((item) =>
      (item.name || '').toLowerCase().includes(value) ||
      (item.supplier || '').toLowerCase().includes(value)
    );
    renderMaterialsTable(filtered);
  });
}

async function refreshApp() {
  await loadData();
  renderAll();
  await loadWeather();
}

async function init() {
  applyTheme(state.theme);
  applyTranslations();
  bindUI();
  bindForms();

  observeAuth(() => {});

  await refreshApp();
}

init();
