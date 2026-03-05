// ============================================
// FOODMAXXING - AUTH (localStorage, no backend)
// ============================================

const AUTH_STORAGE = 'foodmaxxing_users';
const CURRENT_USER_KEY = 'foodmaxxing_currentUser';
const COOKED_LOG_KEY = 'foodmaxxing_cooked';
const PROFILE_KEY = 'foodmaxxing_profile';
const DAILY_CALORIE_GOAL = 2000;

function getUsers() {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveUsers(users) {
    localStorage.setItem(AUTH_STORAGE, JSON.stringify(users));
}

function getCurrentUser() {
    return localStorage.getItem(CURRENT_USER_KEY) || null;
}

function setCurrentUser(username) {
    if (username) localStorage.setItem(CURRENT_USER_KEY, username);
    else localStorage.removeItem(CURRENT_USER_KEY);
}

function register(username, password) {
    const users = getUsers();
    if (users[username]) return { ok: false, error: 'Username already exists' };
    users[username] = { password, createdAt: new Date().toISOString() };
    saveUsers(users);
    setCurrentUser(username);
    return { ok: true };
}

function login(username, password) {
    const users = getUsers();
    const user = users[username];
    if (!user || user.password !== password) return { ok: false, error: 'Invalid username or password' };
    setCurrentUser(username);
    return { ok: true };
}

function logout() {
    setCurrentUser(null);
    window.location.href = 'login.html';
}

// Cooked meals log (per user)
function getCookedLog(username) {
    try {
        const raw = localStorage.getItem(COOKED_LOG_KEY);
        const all = raw ? JSON.parse(raw) : {};
        return all[username] || [];
    } catch {
        return [];
    }
}

function addCookedLog(username, entry) {
    const raw = localStorage.getItem(COOKED_LOG_KEY);
    const all = raw ? JSON.parse(raw) : {};
    if (!all[username]) all[username] = [];
    all[username].push(entry);
    localStorage.setItem(COOKED_LOG_KEY, JSON.stringify(all));
}

function getTodayCooked(username) {
    const log = getCookedLog(username);
    const today = new Date().toDateString();
    return log.filter(function (e) {
        return new Date(e.date).toDateString() === today;
    });
}

function getTodayCalories(username) {
    return getTodayCooked(username).reduce(function (sum, e) {
        return sum + (e.calories || 0);
    }, 0);
}

function getProfile(username) {
    try {
        var raw = localStorage.getItem(PROFILE_KEY);
        var all = raw ? JSON.parse(raw) : {};
        return all[username] || { groceryNotes: '', avatar: null };
    } catch (e) {
        return { groceryNotes: '', avatar: null };
    }
}

function saveProfile(username, data) {
    try {
        var raw = localStorage.getItem(PROFILE_KEY);
        var all = raw ? JSON.parse(raw) : {};
        all[username] = Object.assign(getProfile(username), data);
        localStorage.setItem(PROFILE_KEY, JSON.stringify(all));
    } catch (e) {}
}

function refreshMyDay() {
    var user = getCurrentUser();
    var statsEl = document.getElementById('mydayStats');
    var mealsEl = document.getElementById('mydayMeals');
    var progressEl = document.getElementById('mydayProgress');
    if (!user || !statsEl || !mealsEl) return;
    var today = getTodayCooked(user);
    var totalCal = getTodayCalories(user);
    var goal = typeof DAILY_CALORIE_GOAL !== 'undefined' ? DAILY_CALORIE_GOAL : 2000;
    var healthMsg = totalCal < 1200 ? 'Light day — consider a balanced meal.' : totalCal > 2500 ? 'Heavy day — maybe lighter tomorrow.' : 'Looking balanced today.';
    if (progressEl) {
        var pct = Math.min(100, Math.round((totalCal / goal) * 100));
        progressEl.innerHTML = '<div class="myday-progress-head"><span>Daily calories</span><span>' + totalCal + ' / ' + goal + ' kcal</span></div>' +
            '<div class="myday-progress-track"><div class="myday-progress-fill" style="width:' + pct + '%"></div></div>';
    }
    statsEl.innerHTML = '<div class="myday-stat"><strong>Meals today:</strong> ' + today.length + '</div>' +
        '<div class="myday-stat"><strong>Calories:</strong> ' + totalCal + ' kcal</div>' +
        '<div class="myday-stat">' + healthMsg + '</div>';
    if (today.length === 0) {
        mealsEl.innerHTML = '<p class="myday-empty">No meals logged yet. Cook something and mark it here!</p>';
    } else {
        mealsEl.innerHTML = today.map(function (m) {
            return '<div class="myday-meal"><span>' + m.recipeName + '</span><span>' + (m.calories || 0) + ' kcal</span></div>';
        }).join('');
    }
}
