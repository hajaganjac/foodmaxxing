(function () {
    var RESPONSES = {
        default: [
            "I'm your cooking assistant! Ask me about recipes, substitutions, meal prep, or cooking tips.",
            "Try asking: \"How do I substitute eggs?\" or \"What's a cheap student meal?\" or \"How long do I cook pasta?\""
        ],
        hello: [
            "Hey! I'm here to help with recipes and cooking. What would you like to know?",
            "Hi! Ask me anything about cooking, budgeting for groceries, or recipe ideas."
        ],
        recipe: [
            "Use the Generator on FoodMaxxing to get recipes based on your budget and ingredients. For quick ideas, check out the Explore pages: Under €2 Meals, 15-Minute Meals, and more!",
            "Browse the Ideas section on the home page, or go to the Generator and pick your budget and ingredients to get personalised recipe suggestions."
        ],
        substitute: [
            "Eggs: 1 egg ≈ ¼ cup yogurt or 1 tbsp ground flax + 3 tbsp water, or ½ banana (for baking).",
            "Butter: use olive oil 1:1, or mashed avocado in baking for a healthier swap.",
            "Milk: oat or soy milk work in most recipes; for buttermilk, add 1 tbsp lemon juice to 1 cup plant milk and let sit 5 min."
        ],
        budget: [
            "Set a weekly food budget and plan meals before you shop. Buy store brands, seasonal produce, and use the Under €2 Meals section for cheap recipe ideas.",
            "Stick to a list, compare unit prices, and use the Generator to find recipes that fit your budget and what you already have."
        ],
        cooking: [
            "Pasta: boil salted water, add pasta, stir, and cook until al dente (check the pack for time—usually 8–12 min).",
            "Rice: 1 cup rice to 2 cups water, bring to boil, then simmer covered ~15–18 min until water is absorbed.",
            "Chicken: cook until internal temp 75°C (165°F); no pink inside and juices run clear."
        ],
        healthy: [
            "Add more veggies to every meal, use whole grains when you can, and batch-cook so you have healthy options ready. Check the Protein Powerhouses and Comfort Food sections for balanced ideas."
        ]
    };

    function getReply(text) {
        var lower = (text || '').toLowerCase().trim();
        if (!lower) return RESPONSES.default[0];
        if (/\b(hi|hey|hello)\b/.test(lower)) return RESPONSES.hello[Math.floor(Math.random() * RESPONSES.hello.length)];
        if (/\b(recipe|recipes|meal|dish|idea)\b/.test(lower)) return RESPONSES.recipe[Math.floor(Math.random() * RESPONSES.recipe.length)];
        if (/\b(substitute|replace|instead of|swap)\b/.test(lower)) return RESPONSES.substitute[Math.floor(Math.random() * RESPONSES.substitute.length)];
        if (/\b(budget|cheap|save money|groceries)\b/.test(lower)) return RESPONSES.budget[Math.floor(Math.random() * RESPONSES.budget.length)];
        if (/\b(cook|how long|temperature|boil|fry)\b/.test(lower)) return RESPONSES.cooking[Math.floor(Math.random() * RESPONSES.cooking.length)];
        if (/\b(healthy|nutrition|calories)\b/.test(lower)) return RESPONSES.healthy[0];
        return RESPONSES.default[Math.floor(Math.random() * RESPONSES.default.length)];
    }

    function addMessage(messagesEl, text, isUser) {
        var wrap = document.createElement('div');
        wrap.className = 'chat-msg ' + (isUser ? 'chat-msg-user' : 'chat-msg-bot');
        var p = document.createElement('p');
        p.textContent = text;
        wrap.appendChild(p);
        messagesEl.appendChild(wrap);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function sendMessage() {
        var input = document.getElementById('chatInput');
        var messagesEl = document.getElementById('chatMessages');
        var text = (input.value || '').trim();
        if (!text || !messagesEl) return;
        input.value = '';
        input.style.height = 'auto';
        addMessage(messagesEl, text, true);
        var reply = getReply(text);
        setTimeout(function () {
            addMessage(messagesEl, reply, false);
        }, 400);
    }

    function init() {
        var input = document.getElementById('chatInput');
        var sendBtn = document.getElementById('chatSend');
        var messagesEl = document.getElementById('chatMessages');
        if (!input || !sendBtn || !messagesEl) return;

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        input.addEventListener('input', function () {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
