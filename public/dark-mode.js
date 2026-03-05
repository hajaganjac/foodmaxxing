(function () {
    var STORAGE_KEY = 'foodmaxxing-dark-mode';
    var toggle = document.getElementById('darkModeToggle');
    var root = document.documentElement;

    function isDark() {
        return localStorage.getItem(STORAGE_KEY) === '1';
    }

    function applyDark(dark) {
        if (dark) {
            document.body.classList.add('dark-mode');
            if (root) root.setAttribute('data-theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            if (root) root.removeAttribute('data-theme');
        }
    }

    function updateToggleIcon(dark) {
        if (!toggle) return;
        var sun = toggle.querySelector('.sun-icon');
        var moon = toggle.querySelector('.moon-icon');
        if (sun) sun.style.display = dark ? 'none' : '';
        if (moon) moon.style.display = dark ? '' : 'none';
    }

    function init() {
        var dark = isDark();
        applyDark(dark);
        updateToggleIcon(dark);
        if (toggle) {
            toggle.addEventListener('click', function () {
                dark = !isDark();
                localStorage.setItem(STORAGE_KEY, dark ? '1' : '0');
                applyDark(dark);
                updateToggleIcon(dark);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
