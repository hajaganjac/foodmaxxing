(function () {
    function init() {
        var root = document.getElementById('chatbotRoot');
        if (!root) return;

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
        }
    };

    function getReply(text) {
        var lower = (text || '').toLowerCase().trim();
        if (!lower) return RESPONSES.default[0];
        if (/\b(hi|hey|hello|hey)\b/.test(lower)) return RESPONSES.hello[Math.floor(Math.random() * RESPONSES.hello.length)];
        if (/\b(recipe|recipes|meal|dish|idea)\b/.test(lower)) return RESPONSES.recipe[Math.floor(Math.random() * RESPONSES.recipe.length)];
        if (/\b(substitute|replace|instead of|swap)\b/.test(lower)) return RESPONSES.substitute[Math.floor(Math.random() * RESPONSES.substitute.length)];
        if (/\b(budget|cheap|save money|groceries)\b/.test(lower)) return RESPONSES.budget[Math.floor(Math.random() * RESPONSES.budget.length)];
        if (/\b(cook|how long|temperature|boil|fry)\b/.test(lower)) return RESPONSES.cooking[Math.floor(Math.random() * RESPONSES.cooking.length)];
        if (/\b(healthy|nutrition|calories)\b/.test(lower)) return RESPONSES.healthy[0];
        return RESPONSES.default[Math.floor(Math.random() * RESPONSES.default.length)];
    }

    var isOpen = false;
    var panel = document.createElement('div');
    panel.className = 'chatbot-panel';
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML =
        '<div class="chatbot-header">' +
        '  <span class="chatbot-title">🍳 Cooking assistant</span>' +
        '  <button type="button" class="chatbot-close" aria-label="Close chat">&times;</button>' +
        '</div>' +
        '<div class="chatbot-messages"></div>' +
        '<div class="chatbot-input-wrap">' +
        '  <input type="text" class="chatbot-input" placeholder="Ask about recipes or cooking..." maxlength="500" aria-label="Chat message">' +
        '  <button type="button" class="chatbot-send" aria-label="Send">Send</button>' +
        '</div>';

    var messagesEl = panel.querySelector('.chatbot-messages');
    var inputEl = panel.querySelector('.chatbot-input');
    var sendBtn = panel.querySelector('.chatbot-send');
    var closeBtn = panel.querySelector('.chatbot-close');

    function addMessage(text, isUser) {
        var div = document.createElement('div');
        div.className = 'chatbot-msg ' + (isUser ? 'chatbot-msg-user' : 'chatbot-msg-bot');
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function sendUserMessage() {
        var text = (inputEl.value || '').trim();
        if (!text) return;
        inputEl.value = '';
        addMessage(text, true);
        setTimeout(function () {
            addMessage(getReply(text), false);
        }, 400);
    }

    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'chatbot-fab';
    fab.setAttribute('aria-label', 'Open cooking assistant');
    fab.innerHTML = '🍳';

    function openChat() {
        isOpen = true;
        panel.classList.add('chatbot-panel-open');
        panel.setAttribute('aria-hidden', 'false');
        fab.setAttribute('aria-expanded', 'true');
        inputEl.focus();
    }

    function closeChat() {
        isOpen = false;
        panel.classList.remove('chatbot-panel-open');
        panel.setAttribute('aria-hidden', 'true');
        fab.setAttribute('aria-expanded', 'false');
    }

    fab.addEventListener('click', function () {
        if (isOpen) closeChat(); else openChat();
    });
    closeBtn.addEventListener('click', closeChat);
    sendBtn.addEventListener('click', sendUserMessage);
    inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') sendUserMessage();
    });

    root.appendChild(fab);
    root.appendChild(panel);

        addMessage("Hi! I'm your cooking assistant. Ask me about recipes, substitutions, or cooking tips.", false);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
