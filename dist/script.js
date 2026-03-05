// ============================================
// FOODMAXXING - ENHANCED INTERACTIVE FUNCTIONALITY
// ============================================

// State Management
const appState = {
    budget: 5,
    preferences: [],
    ingredients: [],
    currentStep: 1,
    isAnimating: false
};

// Enhanced Animation Helper
function animate(element, keyframes, duration = 0.3) {
    return new Promise(resolve => {
        element.animate(keyframes, {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            fill: 'forwards'
        });
        setTimeout(resolve, duration * 1000);
    });
}

// Recipe list: loaded from TheMealDB API (see DOMContentLoaded)
let recipeDatabase = [];
let recipeListReady = getRecipeList().then(function (list) {
    recipeDatabase = list || [];
    return recipeDatabase;
});

// ============================================
// BUDGET SLIDER
// ============================================

const budgetSlider = document.getElementById('budgetSlider');
const budgetValue = document.getElementById('budgetValue');

if (budgetSlider) {
    const budgetDisplay = document.querySelector('.budget-display');
    budgetSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        appState.budget = value;
        budgetValue.textContent = value.toFixed(2);
        if (budgetDisplay) {
            budgetDisplay.classList.add('budget-display-pulse');
            budgetDisplay.dataset.budget = value;
            clearTimeout(budgetDisplay._pulseTimeout);
            budgetDisplay._pulseTimeout = setTimeout(() => {
                budgetDisplay.classList.remove('budget-display-pulse');
            }, 150);
        }
    });
}

// ============================================
// PREFERENCE TOGGLE
// ============================================

function togglePreference(element) {
    if (appState.isAnimating) return;
    
    element.classList.toggle('active');
    
    const preference = element.dataset.preference;
    if (element.classList.contains('active')) {
        if (!appState.preferences.includes(preference)) {
            appState.preferences.push(preference);
        }
    } else {
        appState.preferences = appState.preferences.filter(p => p !== preference);
    }
    
    // Visual feedback with ripple effect
    createRipple(element);
    animateElement(element);
}

// ============================================
// INGREDIENT TOGGLE
// ============================================

function toggleIngredient(element) {
    if (appState.isAnimating) return;
    
    element.classList.toggle('active');
    
    const ingredient = element.dataset.ingredient;
    if (element.classList.contains('active')) {
        if (!appState.ingredients.includes(ingredient)) {
            appState.ingredients.push(ingredient);
        }
    } else {
        appState.ingredients = appState.ingredients.filter(i => i !== ingredient);
    }
    
    // Visual feedback with ripple effect
    createRipple(element);
    animateElement(element);
}

// ============================================
// STEP NAVIGATION
// ============================================

function goToStep(stepNumber) {
    if (appState.isAnimating) return;
    appState.isAnimating = true;
    
    const stepsInner = document.getElementById('generatorStepsInner');
    const targetStep = document.querySelector(`[data-step="${stepNumber}"]`);
    if (stepsInner && targetStep) {
        // Slide to step: translateX(-(stepNumber - 1) * 100%)
        const offset = (stepNumber - 1) * -100;
        stepsInner.style.transform = `translateX(${offset}%)`;
        appState.currentStep = stepNumber;
        
        // Mark active step for any legacy styling
        document.querySelectorAll('.generator-step').forEach(s => s.classList.remove('step-active'));
        targetStep.classList.add('step-active');
        
        // Staggered fade-in for step content
        const stepElements = targetStep.querySelectorAll('.step-header, .budget-container, .preferences-grid, .ingredients-grid, .step-navigation, .generator-step .step-next-btn');
        stepElements.forEach((el, index) => {
            el.style.animation = `fadeIn 0.5s ease forwards`;
            el.style.animationDelay = `${index * 0.08}s`;
        });
        
        const generatorWrapper = document.querySelector('.generator-wrapper');
        generatorWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
            appState.isAnimating = false;
        }, 500);
    }
}

// ============================================
// RECIPE GENERATION
// ============================================

function generateRecipes() {
    if (appState.isAnimating) return;
    var resultsSection = document.getElementById('results');
    var container = document.getElementById('recipesContainer');
    if (!resultsSection || !container) return;
    appState.isAnimating = true;
    var generateBtn = document.querySelector('.generate-btn');
    var originalText = generateBtn ? generateBtn.innerHTML : '';
    if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.style.transform = 'scale(0.95)';
        generateBtn.innerHTML = '<span class="loading-animation"></span> Generating...';
    }
    setTimeout(function () { if (generateBtn) generateBtn.style.transform = 'scale(1)'; }, 100);
    recipeListReady.then(function () {
        setTimeout(function () {
            var filteredRecipes = filterRecipes();
            if (filteredRecipes.length === 0) {
                container.innerHTML = '<div class="recipes-empty-message">' +
                    '<p class="recipes-empty-title">No recipes match yet</p>' +
                    '<p class="recipes-empty-desc">Try a higher budget (slide right) or clear some dietary preferences. You can also click "Start Over" and pick different options.</p>' +
                    '</div>';
            } else {
                displayRecipes(filteredRecipes);
            }
            resultsSection.style.display = 'block';
            var resultsHeader = resultsSection.querySelector('.results-header');
            if (resultsHeader) resultsHeader.style.animation = 'fadeIn 0.6s ease forwards';
            if (generateBtn) {
                generateBtn.innerHTML = '<span class="generate-success-icon">✓</span> Done!';
                generateBtn.classList.add('generate-btn-success');
            }
            setTimeout(function () { resultsSection.scrollIntoView({ behavior: 'smooth' }); }, 200);
            var genSection = document.querySelector('.generator-section');
            if (genSection) genSection.style.opacity = '0.6';
            setTimeout(function () {
                if (generateBtn) {
                    generateBtn.disabled = false;
                    generateBtn.classList.remove('generate-btn-success');
                    generateBtn.innerHTML = originalText;
                }
                appState.isAnimating = false;
            }, 1200);
        }, 800);
    }).catch(function () {
        container.innerHTML = '<div class="recipes-empty-message">' +
            '<p class="recipes-empty-title">Couldn’t load recipes</p>' +
            '<p class="recipes-empty-desc">Check your internet connection and try again.</p>' +
            '</div>';
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.innerHTML = originalText;
        }
        appState.isAnimating = false;
    });
}

function filterRecipes() {
    var byBudget = recipeDatabase.filter(function (recipe) {
        return recipe.price <= appState.budget + 2;
    });
    if (appState.preferences.length === 0) {
        return byBudget.slice(0, 12);
    }
    var byPrefs = byBudget.filter(function (recipe) {
        return appState.preferences.some(function (pref) {
            return (recipe.preferences || []).indexOf(pref) !== -1;
        });
    });
    if (byPrefs.length > 0) return byPrefs.slice(0, 12);
    return byBudget.slice(0, 12);
}

function displayRecipes(recipes) {
    const container = document.getElementById('recipesContainer');
    if (!container) return;
    container.innerHTML = '';

    recipes.forEach(function (recipe, index) {
        var card = createRecipeCard(recipe, index);
        container.appendChild(card);
        card.style.animation = 'popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
        card.style.animationDelay = (index * 0.08) + 's';
        card.style.opacity = '0';
    });
}

function createRecipeCard(recipe, index) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    const tags = Array.isArray(recipe.tags) ? recipe.tags : [];
    const prefs = Array.isArray(recipe.preferences) ? recipe.preferences : [];
    const tagsHTML = tags.map(tag =>
        `<span class="recipe-tag ${prefs.includes(tag) ? 'diet' : ''}">${tag}</span>`
    ).join('');
    const imageContent = recipe.image
        ? `<img src="${recipe.image}" alt="${recipe.name}" class="recipe-card-img" loading="lazy">`
        : `<span>${recipe.emoji || '🍽️'}</span>`;
    var calories = Number(recipe.calories) || 350;
    card.innerHTML = `
        <div class="recipe-image">
            ${imageContent}
        </div>
        <div class="recipe-content">
            <div class="recipe-header">
                <div>
                    <div class="recipe-title">${recipe.name}</div>
                    <span class="recipe-supermarket">${recipe.supermarket || 'Albert Heijn'}</span>
                </div>
                <div class="recipe-price">€${Number(recipe.price).toFixed(2)}</div>
            </div>
            <div class="recipe-meta">
                <div class="recipe-meta-item">
                    <span class="recipe-meta-icon">⏱️</span>
                    <span>${Number(recipe.time) || 25} min</span>
                </div>
                <div class="recipe-meta-item">
                    <span class="recipe-meta-icon">🔥</span>
                    <span>~${calories} kcal</span>
                </div>
            </div>
            <div class="recipe-tags">
                ${tagsHTML}
            </div>
        </div>
    `;
    card.addEventListener('mouseenter', function () {
        card.style.animation = 'none';
        card.style.opacity = '1';
    });
    card.addEventListener('mouseleave', function () {
        card.classList.remove('recipe-card-pop');
        card.style.transform = '';
    });
    card.addEventListener('click', () => {
        createRipple(card);
        card.classList.remove('recipe-card-pop');
        void card.offsetWidth;
        card.classList.add('recipe-card-pop');
        setTimeout(() => card.classList.remove('recipe-card-pop'), 400);
        openRecipeDetail(recipe);
    });
    return card;
}

function openRecipeDetail(recipe) {
    const modal = document.getElementById('recipeModal');
    const body = document.getElementById('modalBody');
    if (!modal || !body) return;
    body.innerHTML = '<p class="modal-loading">Loading recipe…</p>';
    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');
    getRecipeById(recipe.id).then(function (full) {
        if (!full) {
            body.innerHTML = '<p>Could not load recipe.</p>';
            return;
        }
        renderRecipeModal(body, full);
    }).catch(function () {
        body.innerHTML = '<p>Could not load recipe.</p>';
    });
}

function renderRecipeModal(container, recipe) {
    const ingList = (recipe.ingredients || []).map(function (i) {
        return '<li>' + (i.measure ? i.measure + ' ' : '') + i.name + '</li>';
    }).join('');
    var instructions = (recipe.instructions || '').trim();
    var instructionsEscaped = instructions
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>');
    var calVal = Number(recipe.calories) || 350;
    container.innerHTML = [
        recipe.image ? '<img src="' + recipe.image + '" alt="" class="modal-recipe-image">' : '',
        '<h2 class="modal-recipe-title" id="modalTitle">' + recipe.name + '</h2>',
        '<div class="modal-recipe-meta">',
        '<span>€' + Number(recipe.price).toFixed(2) + '</span>',
        '<span>' + (Number(recipe.time) || 25) + ' min</span>',
        '<span>~' + calVal + ' kcal</span>',
        '</div>',
        ingList ? '<div class="modal-recipe-section"><h4>Ingredients</h4><ul>' + ingList + '</ul></div>' : '',
        instructions ? '<div class="modal-recipe-section"><h4>Instructions</h4><p class="modal-instructions">' + instructionsEscaped + '</p></div>' : '',
        '<div class="modal-cooked-row">',
        '<label for="modalCalories">Calories logged:</label>',
        '<input type="number" id="modalCalories" min="0" step="10" value="' + calVal + '">',
        '<button type="button" class="btn-cooked" id="btnMarkCooked">I cooked this</button>',
        '</div>'
    ].join('');
    document.getElementById('btnMarkCooked').addEventListener('click', function () {
        const cal = parseInt(document.getElementById('modalCalories').value, 10);
        const user = getCurrentUser();
        if (!user) return;
        addCookedLog(user, {
            date: new Date().toISOString(),
            recipeId: recipe.id,
            recipeName: recipe.name,
            calories: isNaN(cal) ? (recipe.calories || 350) : cal
        });
        closeRecipeModal();
        refreshMyDay();
    });
}

function closeRecipeModal() {
    const modal = document.getElementById('recipeModal');
    if (modal) {
        modal.classList.remove('visible');
        modal.setAttribute('aria-hidden', 'true');
    }
}

// refreshMyDay() lives in auth.js and is used on index (after marking cooked) and on profile.html

// ============================================
// START OVER
// ============================================

function startOver() {
    // Reset state
    appState.budget = 5;
    appState.preferences = [];
    appState.ingredients = [];
    appState.currentStep = 1;
    
    // Reset UI
    budgetSlider.value = 5;
    budgetValue.textContent = '5.00';
    
    document.querySelectorAll('.preference-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    
    document.querySelectorAll('.ingredient-bubble').forEach(bubble => {
        bubble.classList.remove('active');
    });
    
    // Hide results and show generator
    document.getElementById('results').style.display = 'none';
    document.querySelector('.generator-section').style.opacity = '1';
    
    // Go back to step 1
    goToStep(1);
}

// ============================================
// DISCOVERY FILTERS
// ============================================

function setDiscoveryButtonLoading(btn, loading) {
    if (!btn || !btn.classList.contains('discovery-action')) return;
    if (loading) {
        btn.disabled = true;
        btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = '<span class="discovery-loading-spinner"></span> Loading...';
        btn.classList.add('discovery-action-loading');
    } else {
        btn.disabled = false;
        btn.innerHTML = btn.dataset.originalText || 'Explore';
        btn.classList.remove('discovery-action-loading');
    }
}

function runDiscoveryFilter(fn) {
    var resultsSection = document.getElementById('results');
    if (!resultsSection) return;
    var filtered = fn();
    displayRecipes(filtered);
    resultsSection.style.display = 'block';
    resultsSection.style.animation = 'fadeIn 0.5s ease forwards';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function filterByBudget(maxBudget, actionButton) {
    setDiscoveryButtonLoading(actionButton, true);
    recipeListReady.then(function () {
        setTimeout(function () {
            runDiscoveryFilter(function () { return recipeDatabase.filter(function (r) { return r.price <= maxBudget; }); });
            setDiscoveryButtonLoading(actionButton, false);
        }, 400);
    });
}

function filterByTime(maxTime, actionButton) {
    setDiscoveryButtonLoading(actionButton, true);
    recipeListReady.then(function () {
        setTimeout(function () {
            runDiscoveryFilter(function () { return recipeDatabase.filter(function (r) { return r.time <= maxTime; }); });
            setDiscoveryButtonLoading(actionButton, false);
        }, 400);
    });
}

function filterByPreference(preference, actionButton) {
    setDiscoveryButtonLoading(actionButton, true);
    recipeListReady.then(function () {
        setTimeout(function () {
            runDiscoveryFilter(function () { return recipeDatabase.filter(function (r) { return r.preferences && r.preferences.indexOf(preference) !== -1; }); });
            setDiscoveryButtonLoading(actionButton, false);
        }, 400);
    });
}

function filterByMood(mood, actionButton) {
    setDiscoveryButtonLoading(actionButton, true);
    recipeListReady.then(function () {
        setTimeout(function () {
            var filtered = recipeDatabase.filter(function (r) {
                return (r.tags && (r.tags.indexOf('healthy') !== -1 || r.tags.indexOf('quick') !== -1)) || (r.category === 'Vegetarian');
            });
            runDiscoveryFilter(function () { return filtered.length ? filtered.slice(0, 6) : recipeDatabase.slice(0, 6); });
            setDiscoveryButtonLoading(actionButton, false);
        }, 400);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function animateElement(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 100);
}

// Create ripple effect on click
function createRipple(element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'radial-gradient(circle, rgba(255, 90, 82, 0.6), transparent)';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.pointerEvents = 'none';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    const animation = ripple.animate([
        { transform: 'scale(0)', opacity: 1 },
        { transform: 'scale(4)', opacity: 0 }
    ], {
        duration: 600,
        easing: 'ease-out'
    });
    
    animation.onfinish = () => {
        ripple.remove();
    };
}

// ============================================
// SMOOTH TRANSITIONS
// ============================================

document.querySelectorAll('.step-next-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// ============================================
// RESPONSIVE TOUCH SUPPORT
// ============================================

document.querySelectorAll('.preference-chip, .ingredient-bubble').forEach(element => {
    element.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    element.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    });
});

// ============================================
// LOAD INITIAL STATE
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    if (budgetValue) budgetValue.textContent = appState.budget.toFixed(2);
    var heroContent = document.querySelector('.hero-content');
    if (heroContent) heroContent.style.animation = 'fadeIn 0.8s ease forwards';
    var heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.style.animation = 'fadeIn 0.8s ease 0.2s forwards';
        heroVisual.style.opacity = '0';
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
    var logoutBtn = document.getElementById('navLogout');
    if (logoutBtn) logoutBtn.addEventListener('click', function () { logout(); });
    var modal = document.getElementById('recipeModal');
    var modalClose = document.getElementById('modalClose');
    if (modalClose) modalClose.addEventListener('click', closeRecipeModal);
    if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) closeRecipeModal(); });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeRecipeModal();
    });
    refreshMyDay();

    // Article and discovery accordions are handled by React + Framer Motion (see src/ArticleCards.jsx, src/DiscoveryCards.jsx)
});

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const activeButton = document.activeElement;
        if (activeButton.classList.contains('step-next-btn')) {
            activeButton.click();
        }
    }
});
