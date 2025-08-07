// Simple GABE App - Clean Initialization
console.log('Simple GABE app loading...');

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready, initializing GABE...');
    
    // Initialize icons
    if (typeof feather !== 'undefined') {
        feather.replace();
        console.log('Feather icons initialized');
    }
    
    // Simple chat functionality
    window.sendMessage = function() {
        const input = document.getElementById('message-input');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        input.value = '';
        
        // Simple GABE response
        setTimeout(() => {
            addMessage("Hello! I'm GABE, your spiritual companion. How can I help you today?", 'gabe');
        }, 1000);
    };
    
    // Add message to chat
    function addMessage(text, sender) {
        const container = document.getElementById('messages-container');
        if (!container) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        messageDiv.innerHTML = `
            <div class="message-bubble">
                ${text}
            </div>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }
    
    // Handle enter key
    window.handleKeyPress = function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };
    
    // Show chat function
    window.showChat = function() {
        const landing = document.getElementById('landing-page');
        const chat = document.getElementById('chat-container');
        
        if (landing) landing.style.display = 'none';
        if (chat) {
            chat.style.display = 'flex';
            // Show spiritual features
            const features = document.getElementById('spiritual-features');
            if (features) {
                features.style.display = 'block';
            }
            // Show user progress
            const progress = document.getElementById('user-progress');
            if (progress) {
                progress.style.display = 'block';
            }
        }
        
        // Focus on input
        const input = document.getElementById('message-input');
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
        
        // Welcome message
        setTimeout(() => {
            addMessage("Hello! I'm GABE, your spiritual companion. I'm here to provide guidance, prayer support, and help you grow in your faith. What's on your heart today?", 'gabe');
        }, 500);
    };
    
    // Basic spiritual features
    window.openDevotion = function() {
        addMessage("Let's start with a morning devotion! 🌅\n\nToday's verse: 'This is the day the Lord has made; let us rejoice and be glad in it.' - Psalm 118:24\n\nTake a moment to reflect on God's blessings in your life today.", 'gabe');
    };
    
    window.openPrayerManager = function() {
        addMessage("Welcome to the Prayer Center! 🙏\n\nHere you can:\n• Share prayer requests\n• Pray for others\n• Track answered prayers\n\nWhat would you like to pray about today?", 'gabe');
    };
    
    window.openBibleReading = function() {
        addMessage("Time for Bible reading! 📖\n\nToday's suggested reading: Psalm 23\n\n'The Lord is my shepherd; I shall not want. He makes me lie down in green pastures...'\n\nWhat verse speaks to your heart today?", 'gabe');
    };
    
    window.loadUserProgress = function() {
        const xp = localStorage.getItem('gabeXP') || '0';
        addMessage(`Your spiritual journey progress:\n\n⭐ XP: ${xp}\n🌱 Level: Seedling\n📈 Next Level: Disciple (50 XP needed)\n\nKeep growing in faith!`, 'gabe');
    };
    
    window.openGamifiedFeatures = function() {
        addMessage("Welcome to GABEFYED Games! 🎮\n\nSix fun spiritual growth activities:\n• Who's in Charge?\n• Broken Compass\n• Holy Spirit\n• Rescue Mission\n• God Promised Me\n• How to Pray\n\nThese games help you grow in faith while having fun!", 'gabe');
    };
    
    window.openPrayerArena = function() {
        addMessage("Welcome to Prayer Arena! 🎯\n\nInteractive prayer training with:\n• Scripture + Prayer prompts\n• Reflection journaling\n• Speak aloud feature\n• Pray for others cards\n\nReady to strengthen your prayer life?", 'gabe');
    };
    
    console.log('Simple GABE app initialized successfully');
});
