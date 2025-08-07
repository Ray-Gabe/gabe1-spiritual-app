// GABE - Progressive Web App JavaScript
class GabeApp {
    constructor() {
        this.userName = '';
        this.userAgeRange = '';
        this.collectingUserInfo = false;
        this.userInfoStep = null; // 'name' or 'age'
        this.isTyping = false;
        this.installPrompt = null;
        this.dropOfHopeInterval = null;
        
        // Chunked conversation state
        this.waitingForChunkedResponse = false;
        this.currentContinueKey = null;
        
        // GABE Dialogue Management System - Gemini AI Friendly Version
        this.userState = {
            name: null,
            ageGroup: null,
            mood: null,
            lastInputTime: null,
            lastMessage: null,
            lastGabeMessage: null, // Track GABE's last message
            conversationStage: "awaiting_name", // ["awaiting_name", "awaiting_age", "chat"]
            conversationStarted: false // Prevent duplicate initialization
        };
        
        this.moodKeywords = {
            sad: ["sad", "down", "cry", "hurt", "depressed", "upset"],
            anxious: ["anxious", "nervous", "worried", "scared", "afraid"],
            lonely: ["lonely", "alone", "abandoned", "isolated"],
            grateful: ["grateful", "thankful", "blessed", "appreciate"],
            angry: ["angry", "mad", "furious", "annoyed"],
            hopeful: ["hope", "hopeful", "optimistic", "positive"]
        };
        
        // Multi-level inactivity timers
        this.autoFollowupTimer = null;
        this.inactivityTimers = null;
        
        this.initializeApp();
        this.setupEventListeners();
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.initializeContextualSupport();
    }

    initializeApp() {
        // Initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }

        // Initialize XP display
        this.initializeXPDisplay();

        // Always show welcome screen - authentication is handled by modal
        this.showWelcome();
    }

    initializeXPDisplay() {
        const currentXP = parseInt(localStorage.getItem('gabeXP') || '0');
        
        // Update XP display
        const xpDisplay = document.getElementById('user-xp');
        if (xpDisplay) {
            xpDisplay.textContent = currentXP;
        }
        
        // Update spiritual level
        this.updateSpiritualLevel(currentXP);
    }

    setupEventListeners() {
        // Welcome screen events
        const startChatBtn = document.getElementById('start-chat-btn');
        
        if (startChatBtn) {
            startChatBtn.addEventListener('click', () => {
                this.startChat();
            });
        }

        // Chat events
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('message-input');
        const resetBtn = document.getElementById('reset-btn');
        
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            // Auto-resize textarea
            chatInput.addEventListener('input', () => {
                chatInput.style.height = 'auto';
                chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetConversation());
        }

        // Voice input button
        const voiceBtn = document.getElementById('voice-btn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => this.toggleVoiceInput());
        }

        // Spiritual features button - try multiple approaches
        this.setupSpiritualFeaturesButton();

        // Quick action buttons
        this.setupQuickActions();
        
        // Initialize voice recognition and text-to-speech
        this.initVoiceRecognition();
        this.initTextToSpeech();
    }

    setupQuickActions() {
        const quickActions = document.querySelectorAll('.quick-action-btn');
        quickActions.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    handleQuickAction(action) {
        const actions = {
            'pray': "Can you help me with a prayer?",
            'scripture': "Can you explain a Bible verse for me?",
            'encourage': "I could use some encouragement today.",
            'guidance': "I need some spiritual guidance.",
            'thanks': "I want to express gratitude for something.",
            'journal': this.getJournalEntries.bind(this),
            'save_journal': this.showJournalPrompt.bind(this)
        };
        
        if (typeof actions[action] === 'function') {
            actions[action]();
        } else if (actions[action]) {
            const input = document.getElementById('message-input');
            if (input) {
                input.value = actions[action];
            }
            this.sendMessage();
        }
    }

    showWelcome() {
        const welcomeContainer = document.getElementById('landing-page');
        const chatContainer = document.getElementById('chat-container');
        
        if (welcomeContainer) {
            welcomeContainer.style.display = 'flex';
            welcomeContainer.classList.remove('fade-out');
        }
        if (chatContainer) {
            chatContainer.style.display = 'none';
        }
    }

    showChat() {
        const welcomeContainer = document.getElementById('landing-page');
        const chatContainer = document.getElementById('chat-container');
        
        if (welcomeContainer) {
            // Start fade out animation for welcome screen
            welcomeContainer.classList.add('fade-out');
        }
        
        // After fade out completes, show chat interface
        setTimeout(() => {
            if (welcomeContainer) {
                welcomeContainer.style.display = 'none';
            }
            if (chatContainer) {
                chatContainer.style.display = 'flex';
            }
            
            // Trigger fade in for chat
            setTimeout(() => {
                if (chatContainer) {
                    chatContainer.classList.add('fade-in');
                }
            }, 50);
            
            // Focus on input
            const chatInput = document.getElementById('message-input');
            if (chatInput) {
                setTimeout(() => chatInput.focus(), 100);
            }
        }, 500); // Wait for fade out animation to complete
    }

    startChat() {
        // Check authentication first
        if (window.authenticatedUser) {
            // User is authenticated, proceed with chat
            this.showChat();
            this.startGabeConversation();
        } else {
            // User is not authenticated, show auth modal
            this.showAuthModal();
        }
    }

    showAuthModal() {
        if (window.authenticatedUser) {
            // User is already authenticated, start chat directly
            this.userName = window.authenticatedUser.name;
            this.userAgeRange = window.authenticatedUser.age_range;
            this.userState.name = window.authenticatedUser.name;
            this.userState.ageGroup = window.authenticatedUser.age_range;
            this.userState.conversationStage = "chat";
            this.showChat();
        } else {
            // Show login modal
            document.getElementById('auth-modal').style.display = 'flex';
            this.showLoginForm();
        }
    }

    showLoginForm() {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('auth-modal-title').textContent = 'Welcome Back';
        this.clearAuthError();
    }

    showRegisterForm() {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
        document.getElementById('auth-modal-title').textContent = 'Join GABE';
        this.clearAuthError();
    }

    closeAuthModal() {
        document.getElementById('auth-modal').style.display = 'none';
        this.clearAuthError();
    }

    clearAuthError() {
        const errorElement = document.getElementById('auth-error');
        if (errorElement) {
            errorElement.style.display = 'none';
            errorElement.textContent = '';
        }
    }

    showAuthError(message) {
        const errorElement = document.getElementById('auth-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    startGabeConversation() {
        // Prevent duplicate initialization
        if (this.userState.conversationStarted) {
            console.log('Conversation already started, skipping duplicate initialization');
            return;
        }
        
        this.userState.conversationStarted = true;
        console.log('Starting GABE conversation for authenticated user:', !!window.authenticatedUser);
        
        // Delay to ensure UI transition is complete
        setTimeout(() => {
            // For authenticated users, skip to chat
            if (window.authenticatedUser) {
                this.userName = window.authenticatedUser.name;
                this.userAgeRange = window.authenticatedUser.age_range;
                this.userState.name = this.userName;
                this.userState.ageGroup = this.userAgeRange;
                this.userState.conversationStage = "chat";
                
                const greeting = this.getGreetingBasedOnTime();
                this.displayGabeMessage(`${greeting} ${this.userName}! Great to see you again. How can I walk alongside you today? 💙`);
            } else {
                // For non-authenticated users, start name collection
                this.userState.conversationStage = "awaiting_name";
                this.displayGabeMessage("Hey 👋 I'm GABE — your spiritual bestie. What's your name?");
            }
        }, 1000);
    }
    
    getGreetingBasedOnTime() {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    }

    async sendMessage() {
        const input = document.getElementById('message-input');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Clear any existing auto-followup timer when user sends message
        this.clearAutoFollowupTimer();
        
        // Update last input time when user actually sends a message
        this.userState.lastInputTime = Date.now();
        
        // Display user message
        this.displayUserMessage(message);
        input.value = '';
        input.style.height = 'auto';
        
        // Process message through contextual support system
        if (window.contextualSupport && typeof window.contextualSupport.processMessage === 'function') {
            window.contextualSupport.processMessage(message);
        } else if (typeof ContextualSupport !== 'undefined') {
            // Initialize if not already done
            if (!window.contextualSupport) {
                window.contextualSupport = new ContextualSupport();
                console.log('Contextual support initialized during message processing');
            }
            window.contextualSupport.processMessage(message);
        }
        
        // Process message through new dialogue management system
        this.receiveUserInput(message);
    }
    
    receiveUserInput(input) {
        const trimmed = input.trim();
        if (!trimmed) return;

        // Skip name/age collection for authenticated users
        if (window.authenticatedUser && this.userState.conversationStage !== "chat") {
            this.userState.conversationStage = "chat";
            this.processRegularMessage(trimmed);
            return;
        }
        
        if (this.userState.conversationStage === "awaiting_name") {
            this.userState.name = trimmed;
            this.userName = trimmed; // Keep compatibility
            this.userState.conversationStage = "awaiting_age";
            this.displayGabeMessage(`Nice to meet you, ${this.userState.name}! Which age group are you in? Click one of the buttons below:`);
            this.showAgeSelectionButtons();
            // Don't start auto-followup timer during age selection
            return;
        }

        if (this.userState.conversationStage === "awaiting_age") {
            // User typed instead of clicking - remind them to use buttons
            this.displayGabeMessage("Please click one of the age group buttons above to continue! 😊");
            return;
        }

        if (this.userState.conversationStage === "chat") {
            // Check if user is asking for a Bible story
            const storyKeywords = ['story', 'tell me a story', 'bible story', 'share a story', 'david and goliath', 'moses', 'daniel', 'noah', 'jesus', 'parable', 'tell a story'];
            const isStoryRequest = storyKeywords.some(keyword => trimmed.toLowerCase().includes(keyword));
            
            if (isStoryRequest) {
                console.log('Story request detected, calling tellBibleStory()');
                // Tell a Bible story instead of calling the AI API
                this.tellBibleStory();
            } else {
                this.sendToGeminiAI(trimmed);
            }
        }
    }
    
    async sendToGeminiAI(userInput) {
        // Don't update lastInputTime here - it's already set in sendMessage()
        this.userState.lastMessage = userInput;
        this.userState.mood = this.detectMood(userInput);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userInput,
                    name: this.userState.name,
                    age_range: this.userState.ageGroup
                })
            });

            const data = await response.json();
            this.hideTypingIndicator();

            if (data.error) {
                await this.displayGabeMessage(data.response || data.error);
            } else {
                await this.displayGabeMessage(data.response, data.is_crisis);
                
                // Display mood indicator if detected
                if (data.mood && data.mood !== 'neutral') {
                    this.displayMoodIndicator(data.mood);
                }
                
                // Start 8-second auto-followup timer after GABE responds
                this.startAutoFollowupTimer();
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            await this.displayGabeMessage("I'm experiencing some technical difficulties right now. Please try again in a moment. 💙");
        }
    }
    
    detectMood(message) {
        const lower = message.toLowerCase();
        for (let [mood, keywords] of Object.entries(this.moodKeywords)) {
            if (keywords.some(word => lower.includes(word))) return mood;
        }
        return null;
    }
    
    // Auto-follow-up logic if no response in 8 seconds
    startAutoFollowupTimer() {
        // Only start timer during actual chat stage
        if (this.userState.conversationStage !== "chat") {
            return;
        }
        
        this.clearAutoFollowupTimer();
        
        // Don't set lastInputTime here - it should only be set when user actually sends a message
        // The timer should wait 8 seconds from the last user message, not from when GABE responds
        
        // Multi-level inactivity system with longer, more respectful timing
        this.inactivityTimers = {
            first: setTimeout(async () => {
                if (this.userState.conversationStage === "chat") {
                    const lastMessage = this.userState.lastGabeMessage;
                    if (lastMessage && (lastMessage.includes('?') || lastMessage.toLowerCase().includes('what') || lastMessage.toLowerCase().includes('how') || lastMessage.toLowerCase().includes('why'))) {
                        return;
                    }
                    
                    this.showTypingIndicator();
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    this.hideTypingIndicator();
                    
                    this.displayGabeMessage("Still here? I'm just a whisper away.");
                    this.provideBibleEncouragement();
                }
            }, 90000), // 90 seconds (1.5 minutes) for first check-in
            
            second: setTimeout(async () => {
                if (this.userState.conversationStage === "chat") {
                    const lastMessage = this.userState.lastGabeMessage;
                    if (lastMessage && (lastMessage.includes('?') || lastMessage.toLowerCase().includes('what') || lastMessage.toLowerCase().includes('how') || lastMessage.toLowerCase().includes('why'))) {
                        return;
                    }
                    
                    this.showTypingIndicator();
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    this.hideTypingIndicator();
                    
                    this.displayGabeMessage("Take your time. I'm still here whenever you're ready.");
                    this.provideBibleEncouragement();
                }
            }, 300000), // 5 minutes for second check-in
            
            final: setTimeout(async () => {
                if (this.userState.conversationStage === "chat") {
                    const lastMessage = this.userState.lastGabeMessage;
                    if (lastMessage && (lastMessage.includes('?') || lastMessage.toLowerCase().includes('what') || lastMessage.toLowerCase().includes('how') || lastMessage.toLowerCase().includes('why'))) {
                        return;
                    }
                    
                    this.showTypingIndicator();
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    this.hideTypingIndicator();
                    
                    this.displayGabeMessage("I'll go quiet for now... but I'm still right here when you need me.");
                    this.provideBibleEncouragement();
                }
            }, 600000) // 10 minutes for final check-in
        };
    }
    
    clearAutoFollowupTimer() {
        // Clear all inactivity timers
        if (this.inactivityTimers) {
            clearTimeout(this.inactivityTimers.first);
            clearTimeout(this.inactivityTimers.second);
            clearTimeout(this.inactivityTimers.final);
            this.inactivityTimers = null;
        }
        
        // Legacy support
        if (this.autoFollowupTimer) {
            clearTimeout(this.autoFollowupTimer);
            this.autoFollowupTimer = null;
        }
    }
    
    provideBibleEncouragement() {
        const bibleEncouragements = [
            "Isaiah 41:10 — 'Fear not, for I am with you.'",
            "Philippians 4:6-7 — 'Do not be anxious about anything...'",
            "Luke 15:11-32 — The Prodigal Son returns.",
            "Mark 4:35–41 — Jesus calms the storm.",
            "Proverbs 3:5-6 — 'Trust in the Lord with all your heart.'",
            "Psalm 23:4 — 'Even though I walk through the valley...'",
            "Matthew 11:28 — 'Come to me, all you who are weary...'"
        ];
        
        const randomEncouragement = bibleEncouragements[Math.floor(Math.random() * bibleEncouragements.length)];
        setTimeout(() => {
            this.displayGabeMessage(randomEncouragement);
        }, 1000);
    }

    async tellBibleStory() {
        console.log('tellBibleStory() called');
        const stories = [
            {
                part1: "David was just a young shepherd boy, yet he stood face to face with the giant Goliath — a warrior who had terrified the entire Israelite army.",
                part2: "Even though David had no armor or battle experience, he trusted God completely. With just a slingshot and a stone, he brought the giant down.",
                part3: "This story reminds us that with faith, even the smallest person can overcome great challenges when God is on their side. Would you like to hear another story or a prayer?"
            },
            {
                part1: "Moses stood before the Red Sea with the Egyptian army closing in behind him. The Israelites were trapped with nowhere to go.",
                part2: "But Moses stretched out his hand over the sea, and God parted the waters, creating a dry path through the middle of the ocean.",
                part3: "Sometimes God makes a way when there seems to be no way at all. He sees our impossible situations and provides miraculous solutions. Would you like to hear another story or a prayer?"
            },
            {
                part1: "Daniel was thrown into a den of hungry lions because he refused to stop praying to God, even when the king made it illegal.",
                part2: "God sent an angel to shut the lions' mouths, and Daniel spent the entire night safely among them without a single scratch.",
                part3: "When we stay faithful to God, He protects us even in the most dangerous situations. His love is our shield. Would you like to hear another story or a prayer?"
            },
            {
                part1: "Shadrach, Meshach, and Abednego were thrown into a blazing furnace because they refused to bow down to the king's golden statue.",
                part2: "The fire was so hot it killed the soldiers who threw them in, but the three friends walked around unharmed in the flames with a fourth figure.",
                part3: "God was right there with them in their trial, and He walks with us through our fiery trials too. We're never alone. Would you like to hear another story or a prayer?"
            },
            {
                part1: "Elijah felt so discouraged and alone that he wanted to give up on life. He sat under a tree and asked God to let him die.",
                part2: "But God sent an angel with food and water, then spoke to Elijah in a gentle whisper, reminding him he wasn't alone after all.",
                part3: "Even when we feel hopeless, God sees our pain and provides exactly what we need to keep going. His voice brings peace. Would you like to hear another story or a prayer?"
            }
        ];

        const randomStory = stories[Math.floor(Math.random() * stories.length)];
        
        // Collect all parts for the complete story text for speech (without part labels)
        const completeStory = `${randomStory.part1} ${randomStory.part2} ${randomStory.part3}`;
        
        // Part 1 - display without part labels and auto-speech
        this.showTypingIndicator();
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.hideTypingIndicator();
        this.displayGabeMessage(randomStory.part1, false, false);
        
        // Part 2 - display without part labels and auto-speech
        await new Promise(resolve => setTimeout(resolve, 3000));
        this.showTypingIndicator();
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.hideTypingIndicator();
        this.displayGabeMessage(randomStory.part2, false, false);
        
        // Part 3 - display without part labels and auto-speech
        await new Promise(resolve => setTimeout(resolve, 3000));
        this.showTypingIndicator();
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.hideTypingIndicator();
        this.displayGabeMessage(randomStory.part3, false, false);
        
        // Now speak the complete story after all parts are displayed (without part labels)
        if (this.speechSynthesis && this.speechEnabled) {
            // Wait a moment for the last part to be fully displayed
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.speakResponse(completeStory);
        }
    }

    async handleUserInfoCollection(message) {
        if (this.userInfoStep === 'name') {
            // Store the name
            this.userName = message;
            sessionStorage.setItem('userName', this.userName);
            
            // Now ask for age group with clickable options
            this.userInfoStep = 'age';
            
            const ageMessage = `Nice to meet you, ${this.userName}! Now, which age group are you in? This helps me connect with you better:`;
            
            await this.displayGabeMessage(ageMessage);
            this.showAgeSelectionButtons();
            
        } else if (this.userInfoStep === 'age') {
            // Age selection is now handled by buttons, not text input
            // This fallback handles if someone types instead of clicking
            await this.displayGabeMessage("Please click one of the age group buttons above to continue! 😊");
        }
    }

    showAgeSelectionButtons() {
        const messagesContainer = document.getElementById('chat-messages');
        
        // Create age selection container
        const selectionDiv = document.createElement('div');
        selectionDiv.className = 'age-selection-container';
        selectionDiv.id = 'age-selection-container';
        
        const ageOptions = [
            { range: '10-17', label: '10–17 (Teen years)' },
            { range: '18-30', label: '18–30 (Young adult)' },
            { range: '31-50', label: '31–50 (Adult)' },
            { range: '51+', label: '51+ (Mature adult)' }
        ];
        
        ageOptions.forEach(option => {
            const button = document.createElement('button');
            button.className = 'age-selection-btn';
            button.textContent = option.label;
            button.onclick = () => this.selectAgeRange(option.range);
            selectionDiv.appendChild(button);
        });
        
        messagesContainer.appendChild(selectionDiv);
        this.scrollToBottom();
    }

    selectAgeRange(ageRange) {
        // Remove the selection buttons
        const selectionContainer = document.getElementById('age-selection-container');
        if (selectionContainer) {
            selectionContainer.remove();
        }
        
        // Store the selected age range in both state systems
        this.userState.ageGroup = ageRange;
        this.userAgeRange = ageRange; // Keep compatibility
        sessionStorage.setItem('userAgeRange', this.userAgeRange);
        
        // Show user's selection as a message
        const selectedLabel = {
            '10-17': '10–17 (Teen years)',
            '18-30': '18–30 (Young adult)',
            '31-50': '31–50 (Adult)',
            '51+': '51+ (Mature adult)'
        }[ageRange];
        
        this.displayUserMessage(selectedLabel);
        
        // Move to chat stage
        this.userState.conversationStage = "chat";
        
        const finalMessage = `Thanks for sharing, ${this.userState.name}. Just so you know, whatever you're feeling — joy, sadness, confusion — God understands and so do I. You can ask me for a Bible verse, a short story, a prayer, or just to talk.`;
        
        this.displayGabeMessage(finalMessage);
        this.startAutoFollowupTimer();
    }

    displayUserMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = this.createMessageElement('user', message);
        messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    displayGabeMessage(message, isCrisis = false, autoSpeak = true) {
        // Store GABE's last message for question detection
        this.userState.lastGabeMessage = message;
        
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = this.createMessageElement('gabe', message, isCrisis);
        messagesContainer.appendChild(messageElement);
        
        // Add speaker button for GABE messages
        if (this.speechSynthesis) {
            this.addSpeakerButtonToElement(messageElement, message);
            
            // Auto-play speech if voice is enabled and autoSpeak is true
            if (this.speechEnabled && autoSpeak) {
                this.speakResponse(message);
            }
        }
        
        this.scrollToBottom();
    }

    createMessageElement(sender, content, isCrisis = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        if (isCrisis) messageDiv.classList.add('crisis');
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        if (sender === 'gabe') {
            avatar.textContent = 'G';
        } else {
            // Use first letter of user's name, or 'U' if no name
            const initial = this.userName ? this.userName.charAt(0).toUpperCase() : 'U';
            avatar.textContent = initial;
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Convert line breaks to HTML and handle basic formatting
        const formattedContent = content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        contentDiv.innerHTML = formattedContent;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);
        
        return messageDiv;
    }

    showTypingIndicator() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const messagesContainer = document.getElementById('chat-messages');
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <span>GABE is typing</span>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    initializeContextualSupport() {
        // Initialize contextual support when DOM is ready
        if (typeof ContextualSupport !== 'undefined') {
            window.contextualSupport = new ContextualSupport();
            console.log('Contextual support initialized');
        } else {
            // Retry after a short delay if not loaded yet
            setTimeout(() => {
                if (typeof ContextualSupport !== 'undefined') {
                    window.contextualSupport = new ContextualSupport();
                    console.log('Contextual support initialized (delayed)');
                }
            }, 500);
        }
    }

    async resetConversation() {
        // Create custom confirmation modal instead of browser confirm
        const shouldReset = await this.showCustomConfirmation(
            'Start New Conversation?', 
            'This will clear your chat history and reset your conversation with GABE.'
        );
        
        if (shouldReset) {
            try {
                await fetch('/api/clear_session', {
                    method: 'POST'
                });
                
                // Clear local state
                this.userName = '';
                this.userAgeRange = '';
                this.userState.name = null;
                this.userState.ageGroup = null;
                this.userState.conversationStage = "awaiting_name";
                
                // Clear session storage
                sessionStorage.removeItem('userName');
                sessionStorage.removeItem('userAgeRange');
                
                // Clear messages
                document.getElementById('chat-messages').innerHTML = '';
                
                // Reset to initial state - start with name collection
                this.collectingUserInfo = true;
                this.userInfoStep = 'name';
                
                // Show initial GABE greeting
                await this.displayGabeMessage("Hey 👋 I'm GABE — your spiritual bestie. What's your name?");
                
                // Restart Drop of Hope rotation
                this.stopDropOfHope();
                this.startDropOfHope();
                
                console.log('Session and user data cleared successfully');
                
            } catch (error) {
                console.error('Error resetting session:', error);
                this.displayGabeMessage("I had trouble resetting our conversation, but we can keep going! What's on your heart?");
            }
        }
    }

    showCustomConfirmation(title, message) {
        return new Promise((resolve) => {
            // Create modal overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(4px);
            `;

            // Create modal content
            const modal = document.createElement('div');
            modal.style.cssText = `
                background: white;
                padding: 30px;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                max-width: 400px;
                width: 90%;
                text-align: center;
                font-family: 'Inter', sans-serif;
            `;

            modal.innerHTML = `
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 20px; font-weight: 600;">${title}</h3>
                <p style="margin: 0 0 25px 0; color: #666; line-height: 1.5; font-size: 16px;">${message}</p>
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button id="confirm-cancel" style="
                        padding: 12px 24px;
                        border: 2px solid #ddd;
                        background: white;
                        color: #666;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">Cancel</button>
                    <button id="confirm-ok" style="
                        padding: 12px 24px;
                        border: none;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">Start New Chat</button>
                </div>
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Handle button clicks
            document.getElementById('confirm-cancel').onclick = () => {
                document.body.removeChild(overlay);
                resolve(false);
            };

            document.getElementById('confirm-ok').onclick = () => {
                document.body.removeChild(overlay);
                resolve(true);
            };

            // Handle overlay click
            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                    resolve(false);
                }
            };
        });
    }

    showJournalPrompt() {
        const journalText = prompt("What would you like to write in your journal today?");
        if (journalText && journalText.trim()) {
            this.saveJournalEntry(journalText.trim());
        }
    }

    async saveJournalEntry(content) {
        try {
            this.displayUserMessage(`Save to journal: "${content}"`);
            
            const response = await fetch('/api/save_journal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.displayGabeMessage(data.message || 'Your journal entry has been saved! 📔✨');
            } else {
                this.displayGabeMessage(data.message || 'I had trouble saving that journal entry, but your thoughts still matter! 💙');
            }
            
        } catch (error) {
            console.error('Error saving journal entry:', error);
            this.displayGabeMessage("I had trouble saving your journal entry, but your thoughts are precious to me! 💙");
        }
    }

    async getJournalEntries() {
        try {
            this.displayUserMessage("Open my journal");
            
            const response = await fetch('/api/get_journal');
            const data = await response.json();
            
            if (response.ok && data.entries && data.entries.length > 0) {
                let journalMessage = `📔 **Your Journal Entries:**\n\n`;
                
                data.entries.forEach((entry, index) => {
                    journalMessage += `**${entry.date}**\n`;
                    journalMessage += `${entry.content}\n`;
                    if (entry.mood && entry.mood !== 'neutral') {
                        journalMessage += `*Mood: ${entry.mood}*\n`;
                    }
                    journalMessage += `\n`;
                });
                
                this.displayGabeMessage(journalMessage);
            } else {
                this.displayGabeMessage(data.message || "Your journal is empty so far. Want to write your first entry? 📔✨");
            }
            
        } catch (error) {
            console.error('Error getting journal entries:', error);
            this.displayGabeMessage("I had trouble finding your journal entries. Try again in a moment! 📔");
        }
    }

    // Chunked Conversation Methods
    async handleChunkedConversation(data) {
        // Start with the first chunk
        const firstChunk = data.chunks[0];
        await this.displayChunkedMessages(firstChunk);
        
        // Display mood indicator if provided
        if (data.mood && data.mood !== 'neutral') {
            this.displayMoodIndicator(data.mood);
        }
        
        // Start adaptive background music based on emotion
        if (data.mood && this.audioManager) {
            this.audioManager.playEmotionalMusic(data.mood);
        }
    }

    async displayChunkedMessages(chunk) {
        // Display each message with speech completion timing
        for (let i = 0; i < chunk.messages.length; i++) {
            await this.displayGabeMessageWithDelay(chunk.messages[i]);
            
            // Short pause between messages (1 second) since speech already provides timing
            if (i < chunk.messages.length - 1) {
                await this.delay(1000);
            }
        }
        
        // If there's a question, ask it and wait for response
        if (chunk.question) {
            await this.delay(1500); // Brief pause before question
            await this.askChunkedQuestion(chunk.question, chunk.continue_key);
        } else if (chunk.final_message) {
            await this.delay(1500);
            await this.displayGabeMessageWithDelay(chunk.final_message);
        }
    }

    async displayGabeMessageWithDelay(message) {
        // Create message element
        const messageElement = this.createMessageElement('gabe', message, false);
        
        // Add to chat
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.appendChild(messageElement);
        
        // Add speaker button
        this.addSpeakerButtonToElement(messageElement, message);
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Speak the message and wait for it to finish
        await this.speakResponseAsync(message);
    }

    async askChunkedQuestion(question, continueKey) {
        // Display the question
        await this.displayGabeMessageWithDelay(question);
        
        // Wait for user input
        this.waitingForChunkedResponse = true;
        this.currentContinueKey = continueKey;
        
        // Enable input and focus
        const chatInput = document.getElementById('message-input');
        chatInput.placeholder = "Type 'yes' to continue or 'no' to stop...";
        chatInput.focus();
    }

    async continueChunkedConversation(userResponse) {
        try {
            const response = await fetch('/api/continue_conversation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    continue_key: this.currentContinueKey,
                    user_response: userResponse
                })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            if (data.conversation_ended) {
                if (data.response) {
                    await this.displayGabeMessageWithDelay(data.response);
                } else if (data.chunk) {
                    // Final chunk with conversation_ended = true
                    await this.delay(1000);
                    await this.displayChunkedMessages(data.chunk);
                }
                this.resetChunkedConversation();
            } else if (data.chunk) {
                await this.delay(1000); // Brief pause before continuing
                await this.displayChunkedMessages(data.chunk);
                // Don't reset here - let the chunk handling decide when to reset
            }
            
        } catch (error) {
            console.error('Error continuing conversation:', error);
            await this.displayGabeMessageWithDelay("I'm having trouble continuing our conversation. Let's start fresh. 💙");
            this.resetChunkedConversation();
        }
    }

    resetChunkedConversation() {
        this.waitingForChunkedResponse = false;
        this.currentContinueKey = null;
        const chatInput = document.getElementById('message-input');
        chatInput.placeholder = "Type your message...";
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    

    
    async playWelcomeSound() {
        // Wait a bit for page to fully load
        setTimeout(() => {
            if (this.audioManager && this.audioManager.musicEnabled) {
                this.createAngelicWelcomeSound();
            }
        }, 1000);
    }
    
    // Method to play angel sound when clicked
    playAngelSound() {
        console.log('Angel clicked - attempting to play blessing sound');
        
        try {
            // Initialize audio context if needed
            if (!this.audioManager) {
                this.audioManager = {
                    audioContext: new (window.AudioContext || window.webkitAudioContext)(),
                    musicEnabled: true
                };
            }
            
            // Resume audio context if suspended (required by browsers)
            if (this.audioManager.audioContext.state === 'suspended') {
                this.audioManager.audioContext.resume().then(() => {
                    this.createAngelicWelcomeSound();
                });
            } else {
                this.createAngelicWelcomeSound();
            }
            
            // Add visual feedback - make angel glow briefly
            const angelFigure = document.querySelector('.angel-figure');
            if (angelFigure) {
                angelFigure.style.filter = 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))';
                angelFigure.style.transform = 'scale(1.05)';
                angelFigure.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    angelFigure.style.filter = '';
                    angelFigure.style.transform = '';
                }, 2000);
            }
            
            console.log('Angel blessing sound initiated successfully');
            
        } catch (error) {
            console.log('Angel sound creation failed:', error);
            
            // Still provide visual feedback even if sound fails
            const angelFigure = document.querySelector('.angel-figure');
            if (angelFigure) {
                angelFigure.style.transform = 'scale(1.02)';
                angelFigure.style.transition = 'transform 0.2s ease';
                
                setTimeout(() => {
                    angelFigure.style.transform = '';
                }, 300);
            }
        }
    }
    
    createAngelicWelcomeSound() {
        if (!this.audioManager || !this.audioManager.audioContext) {
            console.log('No audio context available for angel sound');
            return;
        }
        
        try {
            const audioContext = this.audioManager.audioContext;
            console.log('Creating angelic blessing sound with audio context state:', audioContext.state);
            
            // Create ethereal angelic chord progression
            const angelicFrequencies = [
                { freq: 261.63, delay: 0 },     // C4
                { freq: 329.63, delay: 200 },   // E4  
                { freq: 392.00, delay: 400 },   // G4
                { freq: 523.25, delay: 600 },   // C5
                { freq: 659.25, delay: 800 },   // E5
                { freq: 783.99, delay: 1000 }   // G5
            ];
            
            angelicFrequencies.forEach(({freq, delay}) => {
                setTimeout(() => {
                    this.createEtherealTone(freq, 3000, 0.08);
                }, delay);
            });
            
            // Add gentle reverb-like echo
            setTimeout(() => {
                angelicFrequencies.slice(0, 3).forEach(({freq, delay}) => {
                    setTimeout(() => {
                        this.createEtherealTone(freq * 0.5, 2000, 0.04); // Lower octave echo
                    }, delay + 1500);
                });
            }, 0);
            
        } catch (error) {
            console.log('Angel sound creation skipped:', error);
        }
    }
    
    createEtherealTone(frequency, duration, volume) {
        if (!this.audioManager || !this.audioManager.audioContext) return;
        
        const audioContext = this.audioManager.audioContext;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Set frequency and waveform
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine'; // Pure, ethereal sine wave
        
        // Create gentle envelope (fade in and out)
        const now = audioContext.currentTime;
        const fadeIn = 0.5;
        const fadeOut = 1.0;
        const sustainTime = (duration / 1000) - fadeIn - fadeOut;
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + fadeIn);
        gainNode.gain.setValueAtTime(volume, now + fadeIn + sustainTime);
        gainNode.gain.linearRampToValueAtTime(0, now + fadeIn + sustainTime + fadeOut);
        
        // Start and stop
        oscillator.start(now);
        oscillator.stop(now + (duration / 1000));
    }
    
    // Spiritual Features Methods
    // displayScriptureRecommendation removed - scripture now only appears via standalone spiritual features
    
    async saveToJournal(verse, reference) {
        try {
            const response = await fetch('/api/prayer_journal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prayer_request: `Scripture meditation: ${verse}`,
                    gabe_response: `Received scripture: ${reference}`,
                    mood: 'hopeful'
                })
            });
            
            if (response.ok) {
                this.displayGabeMessage("🙏 I've saved that beautiful scripture to your prayer journal!");
            } else {
                this.displayGabeMessage("I had trouble saving to your journal, but God's word is always in your heart. 💙");
            }
        } catch (error) {
            console.error('Error saving to journal:', error);
            this.displayGabeMessage("I had trouble saving to your journal, but God's word is always in your heart. 💙");
        }
    }
    
    // getScriptureRecommendation removed - scripture now only available via standalone spiritual features
    
    async viewPrayerJournal() {
        try {
            const response = await fetch('/api/prayer_journal');
            
            if (!response.ok) {
                throw new Error('Failed to fetch prayer journal');
            }
            
            const data = await response.json();
            this.displayPrayerJournal(data.entries);
            
        } catch (error) {
            console.error('Error getting prayer journal:', error);
            this.displayGabeMessage("I had trouble accessing your prayer journal. Let's continue our conversation instead! 💙");
        }
    }
    
    displayPrayerJournal(entries) {
        if (entries.length === 0) {
            this.displayGabeMessage("Your prayer journal is ready for your first entry! Share something you'd like to pray about.");
            return;
        }
        
        const messagesContainer = document.getElementById('chat-messages');
        
        // Create journal container
        const journalDiv = document.createElement('div');
        journalDiv.className = 'prayer-journal-display';
        
        let journalHtml = `
            <div class="journal-header">
                <div class="journal-title">
                    <i data-feather="book"></i>
                    <span>Your Prayer Journal (${entries.length} entries)</span>
                </div>
                <button class="journal-close-btn" onclick="this.closest('.prayer-journal-display').remove()">
                    <i data-feather="x"></i>
                </button>
            </div>
        `;
        
        // Show last 3 entries
        const recentEntries = entries.slice(-3).reverse();
        
        recentEntries.forEach(entry => {
            const date = new Date(entry.date).toLocaleDateString();
            journalHtml += `
                <div class="journal-entry">
                    <div class="journal-date">${date}</div>
                    <div class="journal-prayer">${entry.prayer_request}</div>
                    <div class="journal-mood">Mood: ${entry.mood}</div>
                </div>
            `;
        });
        
        if (entries.length > 3) {
            journalHtml += `<div class="journal-more">And ${entries.length - 3} more entries...</div>`;
        }
        
        journalDiv.innerHTML = journalHtml;
        messagesContainer.appendChild(journalDiv);
        this.scrollToBottom();
        
        // Initialize feather icons
        feather.replace();
    }

    initVoiceRecognition() {
        // Check for Web Speech API support
        this.recognition = null;
        this.isRecording = false;

        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            this.recognition = new SpeechRecognition();
        }

        if (!this.recognition) {
            // Hide voice button if not supported
            const voiceBtn = document.getElementById('voice-btn');
            if (voiceBtn) {
                voiceBtn.style.display = 'none';
            }
            console.log('Speech recognition not supported in this browser');
            return;
        }

        // Configure speech recognition
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        // Event handlers
        this.recognition.onstart = () => {
            this.isRecording = true;
            this.updateVoiceButton();
            console.log('Voice recognition started');
        };

        this.recognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            const chatInput = document.getElementById('message-input');
            if (chatInput) {
                chatInput.value = result;
                // Trigger input event for auto-resize
                chatInput.dispatchEvent(new Event('input'));
                // Focus on input for editing if needed
                chatInput.focus();
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isRecording = false;
            this.updateVoiceButton();
            
            // Show user-friendly error messages
            let errorMessage = "Voice input had an issue. Please try again.";
            if (event.error === 'not-allowed') {
                errorMessage = "Please allow microphone access to use voice input.";
            } else if (event.error === 'no-speech') {
                errorMessage = "No speech detected. Please try speaking again.";
            }
            
            this.displayGabeMessage(errorMessage);
        };

        this.recognition.onend = () => {
            this.isRecording = false;
            this.updateVoiceButton();
            console.log('Voice recognition ended');
        };
    }

    toggleVoiceInput() {
        if (!this.recognition) {
            this.displayGabeMessage("Voice input isn't supported in your browser. You can still type your message! 💙");
            return;
        }

        if (this.isRecording) {
            this.recognition.stop();
        } else {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting voice recognition:', error);
                this.displayGabeMessage("Had trouble starting voice input. Please try again or type your message! 💙");
            }
        }
    }

    updateVoiceButton() {
        const voiceBtn = document.getElementById('voice-btn');
        const micIcon = document.getElementById('mic-icon');
        
        if (!voiceBtn || !micIcon) return;

        if (this.isRecording) {
            voiceBtn.classList.add('recording');
            voiceBtn.title = 'Stop Recording';
            micIcon.setAttribute('data-feather', 'mic-off');
        } else {
            voiceBtn.classList.remove('recording');
            voiceBtn.title = 'Voice Input';
            micIcon.setAttribute('data-feather', 'mic');
        }
        
        // Update Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    initTextToSpeech() {
        // Check for Web Speech API text-to-speech support
        this.speechSynthesis = window.speechSynthesis;
        this.voices = [];
        this.speechEnabled = localStorage.getItem('speechEnabled') !== 'false'; // Default to true
        
        console.log('Initializing text-to-speech. Speech synthesis available:', !!this.speechSynthesis);
        console.log('Speech enabled:', this.speechEnabled);
        
        if (this.speechSynthesis) {
            // Load voices immediately
            this.loadVoices();
            
            // Set up voice loading when voices change (may happen async)
            this.speechSynthesis.onvoiceschanged = () => {
                console.log('Voices changed, reloading...');
                this.loadVoices();
            };
            
            // Also try loading voices after a short delay (browser compatibility)
            setTimeout(() => {
                if (this.voices.length === 0) {
                    console.log('Retrying voice loading...');
                    this.loadVoices();
                }
            }, 1000);
        } else {
            console.log('Speech synthesis not supported in this browser');
        }
        
        // Set up voice toggle
        this.setupVoiceToggle();
        
        // Audio manager removed - background music system disabled
        
        // Welcome sound will now play when angel is clicked instead of automatically
    }
    
    setupVoiceToggle() {
        const voiceToggle = document.getElementById('voice-toggle');
        if (voiceToggle) {
            voiceToggle.checked = this.speechEnabled;
            voiceToggle.addEventListener('change', (e) => {
                this.speechEnabled = e.target.checked;
                localStorage.setItem('speechEnabled', this.speechEnabled);
                
                console.log('Voice toggle changed:', this.speechEnabled);
                
                // Stop current speech if disabled
                if (!this.speechEnabled && this.speechSynthesis) {
                    this.speechSynthesis.cancel();
                }
                
                // Show feedback to user
                if (this.speechEnabled) {
                    this.speakResponse("Voice mode enabled!");
                }
            });
        } else {
            console.log('Voice toggle element not found');
        }
    }
    
    setupSpiritualFeaturesButton() {
        const setupButton = () => {
            const spiritualFeaturesBtn = document.getElementById('spiritual-features-btn');
            if (spiritualFeaturesBtn) {
                console.log('Spiritual features button found, adding event listener');
                
                // Remove any existing event listeners by cloning the element
                const newBtn = spiritualFeaturesBtn.cloneNode(true);
                spiritualFeaturesBtn.parentNode.replaceChild(newBtn, spiritualFeaturesBtn);
                
                // Add single event listener
                newBtn.addEventListener('click', (e) => {
                    console.log('Spiritual features button clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                        this.toggleSpiritualFeatures();
                    } catch (error) {
                        console.error('Error in toggleSpiritualFeatures:', error);
                    }
                });
                return true;
            } else {
                console.log('Spiritual features button NOT found');
                return false;
            }
        };

        // Try immediately
        if (!setupButton()) {
            // If not found, try again after DOM is fully loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', setupButton);
            } else {
                // Try again with a slight delay
                setTimeout(setupButton, 100);
            }
        }
    }

    // Music toggle removed with background music system
    
    toggleSpiritualFeatures() {
        console.log('toggleSpiritualFeatures called');
        const featuresPanel = document.getElementById('spiritual-features');
        if (!featuresPanel) return;
        console.log('Features panel element:', featuresPanel);
        
        if (featuresPanel) {
            const isVisible = featuresPanel.style.display !== 'none';
            console.log('Panel is currently visible:', isVisible);
            featuresPanel.style.display = isVisible ? 'none' : 'block';
            console.log('Panel display now set to:', featuresPanel.style.display);
            
            if (isVisible) {
                // Show the main GABE header when closing GABEFYED
                const chatHeader = document.querySelector('.chat-header');
                if (chatHeader) {
                    chatHeader.style.display = 'flex';
                }
                
                // Hide banner when closing spiritual features
                this.hideBannerIfNeeded();
            } else {
                // Hide the main GABE header when opening GABEFYED
                const chatHeader = document.querySelector('.chat-header');
                if (chatHeader) {
                    chatHeader.style.display = 'none';
                }
                
                // Replace cards with new faith cards when opening
                if (window.faithCards) {
                    console.log('Replacing old cards with new GABEFYED games');
                    window.faithCards.replaceOriginalCards();
                }
                
                // Refresh spiritual features XP display when opening
                if (window.gameFeatures && window.gameFeatures.loadUserProgress) {
                    console.log('Calling gameFeatures.loadUserProgress()');
                    setTimeout(() => {
                        console.log('Executing delayed loadUserProgress call');
                        window.gameFeatures.loadUserProgress();
                    }, 100); // Small delay to ensure DOM is ready
                } else {
                    console.log('gameFeatures not available:', {
                        gameFeatures: !!window.gameFeatures,
                        loadUserProgress: !!(window.gameFeatures && window.gameFeatures.loadUserProgress)
                    });
                }
            }
        } else {
            console.log('Features panel element not found!');
        }
    }

    loadVoices() {
        this.voices = this.speechSynthesis.getVoices();
        console.log('Available voices:', this.voices.length);
        
        // Detect mobile device
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Mobile-optimized voice selection
            this.selectedVoice = this.voices.find(voice => 
                voice.lang.startsWith('en') && 
                (voice.name.includes('Samantha') || // iOS default
                 voice.name.includes('Google') ||
                 voice.name.includes('Female') ||
                 voice.localService) // Prefer local voices on mobile
            ) || this.voices.find(voice => 
                voice.lang.startsWith('en') && voice.localService
            ) || this.voices.find(voice => voice.lang.startsWith('en')) || this.voices[0];
        } else {
            // Desktop voice selection
            this.selectedVoice = this.voices.find(voice => 
                voice.lang.startsWith('en') && 
                (voice.name.includes('Natural') || 
                 voice.name.includes('Microsoft') ||
                 voice.name.includes('Google'))
            ) || this.voices.find(voice => voice.lang.startsWith('en')) || this.voices[0];
        }
        
        console.log('Selected voice:', this.selectedVoice ? this.selectedVoice.name : 'None available');
        console.log('Mobile device detected:', isMobile);
    }

    speakResponse(text) {
        if (!this.speechSynthesis || !text || !this.speechEnabled) {
            console.log('Speech not available:', {
                synthesis: !!this.speechSynthesis,
                text: !!text,
                enabled: this.speechEnabled
            });
            return;
        }

        // Reload voices if none are available
        if (!this.selectedVoice || this.voices.length === 0) {
            this.loadVoices();
        }

        // Cancel any ongoing speech
        this.speechSynthesis.cancel();

        // Clean text for speech (remove markdown and special characters)
        let cleanText = text
            .replace(/\*\*(.*?)\*\*/g, '$1') // Bold markdown
            .replace(/\*(.*?)\*/g, '$1')     // Italic markdown
            .replace(/`(.*?)`/g, '$1')       // Code markdown
            .replace(/#{1,6}\s/g, '')        // Headers
            .replace(/[📔✨💙🙏📖💫🌟✍️]/g, '') // Emojis
            .replace(/\n+/g, '. ')           // Line breaks to pauses
            .trim();

        // Mobile devices often have issues with long text, so chunk it
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile && cleanText.length > 200) {
            // Split into smaller chunks for mobile
            cleanText = cleanText.substring(0, 200) + '...';
        }

        if (!cleanText) {
            console.log('No clean text to speak');
            return;
        }

        try {
            const utterance = new SpeechSynthesisUtterance(cleanText);
            
            // Set voice if available
            if (this.selectedVoice) {
                utterance.voice = this.selectedVoice;
            }
            
            if (isMobile) {
                // Mobile devices need slower, clearer speech
                utterance.rate = 0.8;   // Slower for mobile clarity
                utterance.pitch = 1.0;  // Natural pitch
                utterance.volume = 1.0; // Full volume for mobile speakers
            } else {
                // Desktop settings
                utterance.rate = 0.9;   // Slightly slower for spiritual content
                utterance.pitch = 1.0;  // Natural pitch
                utterance.volume = 0.8; // Comfortable desktop volume
            }

            // Add error handling
            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
            };

            utterance.onend = () => {
                console.log('Speech completed');
            };

            console.log('Speaking text:', cleanText.substring(0, 50) + '...');
            console.log('Using voice:', this.selectedVoice ? this.selectedVoice.name : 'Default');
            console.log('Mobile device detected:', isMobile);
            
            this.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Error creating speech utterance:', error);
        }
    }

    speakResponseAsync(text) {
        return new Promise((resolve) => {
            if (!this.speechSynthesis || !text || !this.speechEnabled) {
                resolve();
                return;
            }

            // Cancel any ongoing speech
            this.speechSynthesis.cancel();

            // Clean text for speech (remove markdown and special characters)
            let cleanText = text
                .replace(/\*\*(.*?)\*\*/g, '$1') // Bold markdown
                .replace(/\*(.*?)\*/g, '$1')     // Italic markdown
                .replace(/`(.*?)`/g, '$1')       // Code markdown
                .replace(/#{1,6}\s/g, '')        // Headers
                .replace(/[📔✨💙🙏📖💫🌟✍️💔]/g, '') // Emojis
                .replace(/\n+/g, '. ')           // Line breaks to pauses
                .trim();

            // Mobile devices often have issues with long text, so chunk it
            const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (isMobile && cleanText.length > 200) {
                // Split into smaller chunks for mobile
                cleanText = cleanText.substring(0, 200) + '...';
            }

            if (!cleanText) {
                resolve();
                return;
            }

            const utterance = new SpeechSynthesisUtterance(cleanText);
            
            // Set voice if available
            if (this.selectedVoice) {
                utterance.voice = this.selectedVoice;
            }
            
            if (isMobile) {
                // Mobile devices need slower, clearer speech
                utterance.rate = 0.8;   // Slower for mobile clarity
                utterance.pitch = 1.0;  // Natural pitch
                utterance.volume = 1.0; // Full volume for mobile speakers
            } else {
                // Desktop settings
                utterance.rate = 0.9;   // Slightly slower for spiritual content
                utterance.pitch = 1.0;  // Natural pitch
                utterance.volume = 0.8; // Comfortable desktop volume
            }

            // Wait for speech to complete
            utterance.onend = () => {
                resolve();
            };

            utterance.onerror = () => {
                resolve(); // Continue even if speech fails
            };

            this.speechSynthesis.speak(utterance);
        });
    }

    addSpeakerButtonToElement(messageElement, originalText) {
        if (!messageElement || messageElement.querySelector('.speaker-btn')) return;
        
        const speakerBtn = document.createElement('button');
        speakerBtn.className = 'speaker-btn';
        speakerBtn.innerHTML = '<i data-feather="volume-2"></i>';
        speakerBtn.title = 'Listen to response';
        speakerBtn.onclick = () => this.speakResponse(originalText);
        
        const messageContent = messageElement.querySelector('.message-content');
        if (messageContent) {
            messageContent.appendChild(speakerBtn);
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }
    }

    addSpeakerButton(originalText) {
        // Find the last GABE message and add speaker button
        const messages = document.querySelectorAll('.message.gabe');
        const lastMessage = messages[messages.length - 1];
        
        if (lastMessage) {
            this.addSpeakerButtonToElement(lastMessage, originalText);
        }
    }

    displayMoodIndicator(mood) {
        // Find the last user message and add mood indicator
        const userMessages = document.querySelectorAll('.message.user');
        const lastUserMessage = userMessages[userMessages.length - 1];
        
        if (lastUserMessage && mood && mood !== 'neutral') {
            const avatar = lastUserMessage.querySelector('.message-avatar');
            if (avatar && !avatar.querySelector('.mood-indicator')) {
                const moodIndicator = document.createElement('div');
                moodIndicator.className = `mood-indicator mood-${mood}`;
                moodIndicator.title = `Mood: ${mood}`;
                avatar.appendChild(moodIndicator);
            }
        }
    }

    // Drop of Hope Functions
    async startDropOfHope() {
        // Load initial verse
        await this.updateDropOfHope();
        
        // Set up rotation every 45 seconds
        this.dropOfHopeInterval = setInterval(() => {
            this.updateDropOfHope();
        }, 45000);
    }

    async updateDropOfHope() {
        try {
            const response = await fetch('/api/drop_of_hope');
            if (!response.ok) throw new Error('Failed to fetch verse');
            
            const data = await response.json();
            
            // Fade out current content
            const dropVerse = document.getElementById('drop-verse');
            const dropReference = document.getElementById('drop-reference');
            
            if (dropVerse && dropReference) {
                dropVerse.classList.add('fade-out');
                dropReference.classList.add('fade-out');
                
                // Wait for fade out, then update content and fade in
                setTimeout(() => {
                    dropVerse.textContent = `"${data.verse}"`;
                    dropReference.textContent = `— ${data.reference}`;
                    
                    // Remove fade-out classes to fade back in
                    dropVerse.classList.remove('fade-out');
                    dropReference.classList.remove('fade-out');
                }, 500);
            }
        } catch (error) {
            console.error('Drop of Hope update failed:', error);
            // Fallback verse on error
            const dropVerse = document.getElementById('drop-verse');
            const dropReference = document.getElementById('drop-reference');
            if (dropVerse && dropReference) {
                dropVerse.textContent = '"The Lord is close to the brokenhearted and saves those who are crushed in spirit."';
                dropReference.textContent = '— Psalm 34:18';
            }
        }
    }

    stopDropOfHope() {
        if (this.dropOfHopeInterval) {
            clearInterval(this.dropOfHopeInterval);
            this.dropOfHopeInterval = null;
        }
    }

    // PWA Functions
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/static/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            this.installPrompt = e;
            this.showInstallPrompt();
        });

        window.addEventListener('appinstalled', () => {
            console.log('GABE PWA was installed');
            this.hideInstallPrompt();
        });
    }

    showInstallPrompt() {
        const installPrompt = document.getElementById('install-prompt');
        if (installPrompt) {
            installPrompt.classList.add('show');
            
            const installBtn = document.getElementById('install-btn');
            const dismissBtn = document.getElementById('dismiss-install');
            
            if (installBtn) {
                installBtn.addEventListener('click', () => this.installApp());
            }
            
            if (dismissBtn) {
                dismissBtn.addEventListener('click', () => this.hideInstallPrompt());
            }
        }
    }

    hideInstallPrompt() {
        const installPrompt = document.getElementById('install-prompt');
        if (installPrompt) {
            installPrompt.classList.remove('show');
        }
    }

    async installApp() {
        if (this.installPrompt) {
            this.installPrompt.prompt();
            const result = await this.installPrompt.userChoice;
            
            if (result.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            
            this.installPrompt = null;
            this.hideInstallPrompt();
        }
    }

    // GABEFYED Banner Management
    showGabefyedBanner() {
        const banner = document.getElementById('gabefyed-banner');
        if (banner) {
            banner.style.display = 'block';
            // Add padding to body to account for fixed banner
            document.body.style.paddingTop = '68px';
            // Update banner with current XP and level
            this.updateBannerStatus();
        }
    }

    hideBannerIfNeeded() {
        const banner = document.getElementById('gabefyed-banner');
        const welcomeContainer = document.getElementById('welcome-container');
        const spiritualFeatures = document.getElementById('spiritual-features');
        if (!spiritualFeatures) return;
        
        // Hide banner when returning to welcome screen OR when spiritual features are closed
        if (banner && ((welcomeContainer && welcomeContainer.style.display !== 'none') || 
                      (spiritualFeatures && spiritualFeatures.style.display === 'none'))) {
            banner.style.display = 'none';
            document.body.style.paddingTop = '0';
        }
    }

    updateBannerStatus() {
        const levelEl = document.getElementById('spiritual-level');
        const xpEl = document.getElementById('xp-display');
        
        if (levelEl && xpEl) {
            // Get current XP from localStorage or default to 0
            const currentXP = parseInt(localStorage.getItem('gabeXP') || '0');
            
            // Update XP display
            xpEl.textContent = `${currentXP} XP`;
            
            // Determine spiritual level based on XP
            let level, emoji, description;
            if (currentXP < 50) {
                level = 'Seedling';
                emoji = '🌱';
                description = 'Beginning your faith journey';
            } else if (currentXP < 150) {
                level = 'Disciple';
                emoji = '🙏';
                description = 'Growing in faith and wisdom';
            } else if (currentXP < 300) {
                level = 'Messenger';
                emoji = '📖';
                description = 'Spreading God\'s love';
            } else if (currentXP < 500) {
                level = 'Guardian';
                emoji = '🛡️';
                description = 'Protecting and guiding others';
            } else {
                level = 'Kingdom Builder';
                emoji = '👑';
                description = 'Building God\'s kingdom on earth';
            }
            
            levelEl.textContent = `${emoji} ${level}`;
            levelEl.nextElementSibling.textContent = description;
        }
    }

    awardXP(amount, gameId = null) {
        // Check if XP can be awarded today for this game
        if (gameId && !this.canAwardXPToday(gameId)) {
            console.log(`XP already awarded today for ${gameId}. No additional XP given.`);
            return parseInt(localStorage.getItem('gabeXP') || '0'); // Return current XP without change
        }
        
        const currentXP = parseInt(localStorage.getItem('gabeXP') || '0');
        const newXP = currentXP + amount;
        localStorage.setItem('gabeXP', newXP.toString());
        
        // Mark this game as completed today
        if (gameId) {
            this.markGameCompletedToday(gameId);
        }
        
        // Update XP display in banner
        const xpDisplay = document.getElementById('xp-display');
        if (xpDisplay) {
            xpDisplay.textContent = `${newXP} XP`;
        }
        
        // Update spiritual level based on XP
        this.updateSpiritualLevel(newXP);
        
        // Update spiritual features panel if it exists
        if (window.gameFeatures && window.gameFeatures.loadUserProgress) {
            console.log('Updating spiritual features panel after XP award');
            window.gameFeatures.loadUserProgress();
        }
        
        // Update banner if visible
        this.updateBannerStatus();
        
        console.log(`XP awarded: +${amount}. Total XP: ${newXP}`);
        return newXP;
    }

    canAwardXPToday(gameId) {
        const today = new Date().toDateString();
        const dailyCompletions = JSON.parse(localStorage.getItem('gabeDailyCompletions') || '{}');
        
        return !(dailyCompletions[gameId] === today);
    }

    markGameCompletedToday(gameId) {
        const today = new Date().toDateString();
        const dailyCompletions = JSON.parse(localStorage.getItem('gabeDailyCompletions') || '{}');
        
        dailyCompletions[gameId] = today;
        localStorage.setItem('gabeDailyCompletions', JSON.stringify(dailyCompletions));
        
        console.log(`Marked ${gameId} as completed today`);
    }

    isGameCompletedToday(gameId) {
        const today = new Date().toDateString();
        const dailyCompletions = JSON.parse(localStorage.getItem('gabeDailyCompletions') || '{}');
        
        return dailyCompletions[gameId] === today;
    }

    updateSpiritualLevel(xp) {
        const levelDisplay = document.getElementById('spiritual-level');
        if (!levelDisplay) return;
        
        let level, icon, description;
        
        if (xp < 50) {
            level = 'Seedling';
            icon = '🌱';
            description = 'Beginning your faith journey';
        } else if (xp < 150) {
            level = 'Disciple';
            icon = '📚';
            description = 'Learning and growing';
        } else if (xp < 300) {
            level = 'Messenger';
            icon = '📢';
            description = 'Sharing God\'s love';
        } else if (xp < 500) {
            level = 'Guardian';
            icon = '🛡️';
            description = 'Protecting and guiding';
        } else {
            level = 'Kingdom Builder';
            icon = '👑';
            description = 'Building God\'s kingdom';
        }
        
        levelDisplay.textContent = `${icon} ${level}`;
        
        // Update description if element exists
        const levelDesc = levelDisplay.nextElementSibling;
        if (levelDesc && levelDesc.style.fontSize === '10px') {
            levelDesc.textContent = description;
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gabeApp = new GabeApp();
    
    // Export authentication functions to global scope for HTML template
    window.showAuthModal = () => window.gabeApp.showAuthModal();
    window.closeAuthModal = () => window.gabeApp.closeAuthModal();
    window.showLoginForm = () => window.gabeApp.showLoginForm();
    window.showRegisterForm = () => window.gabeApp.showRegisterForm();
    window.showAuthError = (message) => window.gabeApp.showAuthError(message);
    window.clearAuthError = () => window.gabeApp.clearAuthError();
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('Back online');
    // Could show a toast notification here
});

window.addEventListener('offline', () => {
    console.log('Gone offline');
    // Could show a toast notification here
});
