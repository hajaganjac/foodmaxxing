// ============================================
// FOODMAXXING - TheMealDB API (free, no key)
// ============================================

var MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';

var CATEGORY_ESTIMATES = {
    Beef:       { price: 5.5,  time: 40, calories: 450 },
    Chicken:    { price: 4.5,  time: 35, calories: 350 },
    Dessert:    { price: 3,   time: 30, calories: 280 },
    Lamb:       { price: 6,   time: 45, calories: 400 },
    Pasta:      { price: 4,   time: 25, calories: 380 },
    Pork:       { price: 5,   time: 40, calories: 400 },
    Seafood:    { price: 6,   time: 30, calories: 320 },
    Vegetarian: { price: 3.5, time: 30, calories: 320 },
    Vegan:      { price: 3.5, time: 30, calories: 300 },
    Breakfast:  { price: 3.5, time: 20, calories: 350 },
    Side:       { price: 2.5, time: 20, calories: 200 },
    Starter:    { price: 3,   time: 25, calories: 250 },
    Miscellaneous: { price: 4, time: 30, calories: 350 },
    Goat:       { price: 5,   time: 40, calories: 380 }
};

var PREFERENCE_MAP = {
    Vegetarian: ['vegetarian'],
    Vegan:      ['vegan', 'vegetarian']
};

function categoryToTags(category) {
    var c = (category || '').toLowerCase();
    var tags = [];
    if (c === 'vegetarian' || c === 'vegan') tags.push('healthy');
    if (c === 'chicken' || c === 'beef' || c === 'seafood') tags.push('protein-rich');
    if (c === 'pasta' || c === 'breakfast') tags.push('quick');
    if (c === 'dessert') tags.push('sweet');
    if (c === 'side') tags.push('light');
    return tags.length ? tags : ['tasty'];
}

function normalizeMealListItem(m, category) {
    var est = CATEGORY_ESTIMATES[category] || CATEGORY_ESTIMATES.Miscellaneous;
    var prefs = PREFERENCE_MAP[category] || [];
    return {
        id: m.idMeal,
        name: m.strMeal,
        image: m.strMealThumb || null,
        category: category,
        price: est.price,
        time: est.time,
        calories: est.calories,
        supermarket: 'Albert Heijn',
        tags: categoryToTags(category),
        preferences: prefs
    };
}

function fetchJson(url) {
    return fetch(url).then(function (r) { return r.json(); });
}

var cachedList = null;

function getRecipeList() {
    if (cachedList) return Promise.resolve(cachedList);
    var categories = ['Chicken', 'Beef', 'Pasta', 'Vegetarian', 'Vegan', 'Seafood', 'Breakfast', 'Side'];
    var promises = categories.map(function (c) {
        return fetchJson(MEALDB_BASE + '/filter.php?c=' + encodeURIComponent(c))
            .then(function (data) {
                if (!data.meals) return [];
                return data.meals.map(function (m) { return normalizeMealListItem(m, c); });
            });
    });
    return Promise.all(promises).then(function (arrays) {
        var seen = {};
        var merged = [];
        arrays.forEach(function (arr) {
            (arr || []).forEach(function (r) {
                if (r && !seen[r.id]) {
                    seen[r.id] = true;
                    merged.push(r);
                }
            });
        });
        cachedList = merged;
        return merged;
    }).catch(function (err) {
        console.warn('Recipe list failed to load:', err);
        cachedList = [];
        return [];
    });
}

function getRecipeById(id) {
    return fetchJson(MEALDB_BASE + '/lookup.php?i=' + id).then(function (data) {
        if (!data.meals || !data.meals[0]) return null;
        var m = data.meals[0];
        var category = m.strCategory || 'Miscellaneous';
        var est = CATEGORY_ESTIMATES[category] || CATEGORY_ESTIMATES.Miscellaneous;
        var prefs = PREFERENCE_MAP[category] || [];
        var ingredients = [];
        for (var i = 1; i <= 20; i++) {
            var ing = m['strIngredient' + i];
            var measure = m['strMeasure' + i];
            if (ing && ing.trim()) {
                ingredients.push({ name: ing.trim(), measure: (measure || '').trim() });
            }
        }
        return {
            id: m.idMeal,
            name: m.strMeal,
            image: m.strMealThumb || null,
            category: category,
            price: est.price,
            time: est.time,
            calories: est.calories,
            supermarket: 'Albert Heijn',
            tags: categoryToTags(category),
            preferences: prefs,
            instructions: m.strInstructions || '',
            ingredients: ingredients
        };
    });
}
