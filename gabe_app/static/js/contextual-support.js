// Contextual Spiritual Support System
class ContextualSupport {
    constructor() {
        this.isActive = true; // Enable by default
        this.currentMood = null;
        this.conversationContext = [];
        this.lastSuggestionTime = 0;
        this.minSuggestionInterval = 30000; // 30 seconds between suggestions
        this.messageCount = 0; // Track message count for showing B-S-A buttons
        console.log('ContextualSupport initialized with message count tracking');
        
        this.moodPatterns = {
            sad: {
                keywords: ['sad', 'down', 'depressed', 'hurt', 'cry', 'tears', 'pain', 'heartbroken', 'lonely', 'mean', 'upset'],
                suggestions: [
                    {
                        type: 'prayer',
                        title: 'Prayer for Comfort',
                        content: 'Dear God, wrap your loving arms around me right now. Help me feel your peace in this difficult moment. You see my pain and you care. In Jesus name, Amen.',
                        verse: 'Psalm 34:18 - The Lord is close to the brokenhearted'
                    },
                    {
                        type: 'story',
                        title: 'Jesus Understands',
                        content: 'Even Jesus wept when He saw pain. At Lazarus\' tomb, Jesus didn\'t hold back His tears. He felt deeply, just like you do now. Your sadness is valid, and God is with you in it.',
                        verse: 'John 11:35 - Jesus wept'
                    },
                    {
                        type: 'verse',
                        title: 'God\'s Healing Promise',
                        content: 'He heals the brokenhearted and binds up their wounds.',
                        reference: 'Psalm 147:3'
                    }
                ]
            },
            anxious: {
                keywords: ['anxious', 'worried', 'nervous', 'scared', 'afraid', 'panic', 'stress', 'overwhelmed', 'fear'],
                suggestions: [
                    {
                        type: 'prayer',
                        title: 'Prayer for Peace',
                        content: 'Lord, calm my racing thoughts. Replace my worry with your peace. Help me trust that you have everything under control. Thank you for caring about every detail of my life. Amen.',
                        verse: 'Philippians 4:6-7 - Do not be anxious about anything'
                    },
                    {
                        type: 'story',
                        title: 'Jesus Calms the Storm',
                        content: 'When the disciples were terrified in the storm, Jesus simply said "Peace, be still" and the winds obeyed. That same Jesus speaks peace over your anxious heart today.',
                        verse: 'Mark 4:39 - Peace, be still'
                    },
                    {
                        type: 'verse',
                        title: 'Cast Your Cares',
                        content: 'Cast all your anxiety on him because he cares for you.',
                        reference: '1 Peter 5:7'
                    }
                ]
            },
            angry: {
                keywords: ['angry', 'mad', 'furious', 'rage', 'hate', 'annoyed', 'frustrated', 'irritated'],
                suggestions: [
                    {
                        type: 'prayer',
                        title: 'Prayer for Calm',
                        content: 'God, this anger is burning inside me. Help me channel it in healthy ways. Give me wisdom to respond, not react. Cool my heart with your love. In Jesus name, Amen.',
                        verse: 'Ephesians 4:26 - In your anger do not sin'
                    },
                    {
                        type: 'story',
                        title: 'Jesus and Righteous Anger',
                        content: 'Jesus felt angry when He saw injustice in the temple. But His anger was focused on what was wrong, not on hurting people. God can use your passion for good too.',
                        verse: 'Matthew 21:12 - Jesus overturned the tables'
                    },
                    {
                        type: 'verse',
                        title: 'Slow to Anger',
                        content: 'Everyone should be quick to listen, slow to speak and slow to become angry.',
                        reference: 'James 1:19'
                    }
                ]
            },
            hopeful: {
                keywords: ['hope', 'hopeful', 'optimistic', 'positive', 'excited', 'grateful', 'blessed', 'thankful'],
                suggestions: [
                    {
                        type: 'prayer',
                        title: 'Prayer of Gratitude',
                        content: 'Thank you God for this hope in my heart. Help me share this joy with others. Use me to be a light in someone else\'s darkness today. In Jesus name, Amen.',
                        verse: 'Romans 15:13 - May the God of hope fill you with joy'
                    },
                    {
                        type: 'story',
                        title: 'Mary\'s Song of Joy',
                        content: 'When Mary learned she would carry Jesus, she sang with pure joy: "My soul glorifies the Lord!" Even in uncertainty, she chose to celebrate God\'s goodness.',
                        verse: 'Luke 1:46 - My soul glorifies the Lord'
                    },
                    {
                        type: 'verse',
                        title: 'Rejoice Always',
                        content: 'Rejoice in the Lord always. I will say it again: Rejoice!',
                        reference: 'Philippians 4:4'
                    }
                ]
            }
        };
        
        this.createPopupHTML();
        this.bindEvents();
    }
    
    createPopupHTML() {
        const popupHTML = `
            <div id="contextual-support-popup" class="contextual-popup" style="display: none;">
                <div class="contextual-popup-content">
                    <div class="contextual-popup-header">
                        <div class="support-icon">✨</div>
                        <h4 id="popup-title">Spiritual Support</h4>
                        <button class="popup-close" onclick="window.contextualSupport.hidePopup()">&times;</button>
                    </div>
                    <div class="contextual-popup-body">
                        <p id="popup-message">I noticed you might need some spiritual encouragement. Would you like:</p>
                        <div class="support-options">
                            <button class="support-option-btn prayer-option" onclick="window.contextualSupport.showSuggestion('prayer')">
                                <div class="option-icon">🙏</div>
                                <span>A Prayer</span>
                            </button>
                            <button class="support-option-btn story-option" onclick="window.contextualSupport.showSuggestion('story')">
                                <div class="option-icon">📖</div>
                                <span>A Bible Story</span>
                            </button>
                            <button class="support-option-btn verse-option" onclick="window.contextualSupport.showSuggestion('verse')">
                                <div class="option-icon">✝️</div>
                                <span>A Bible Verse</span>
                            </button>
                        </div>
                        <div id="suggestion-content" class="suggestion-content" style="display: none;">
                            <h5 id="suggestion-title"></h5>
                            <div id="suggestion-body"></div>
                            <div id="suggestion-verse" class="suggestion-verse"></div>
                            <div class="suggestion-actions">
                                <button class="primary-btn" onclick="window.contextualSupport.saveSuggestion()">Save to Journal</button>
                                <button class="secondary-btn" onclick="window.contextualSupport.showOptions()">Back to Options</button>
                            </div>
                        </div>
                    </div>
                    <div class="contextual-popup-footer">
                        <button class="secondary-btn" onclick="window.contextualSupport.hidePopup()">Not right now</button>
                        <button class="secondary-btn" onclick="window.contextualSupport.disableForSession()">Disable for this session</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', popupHTML);
    }
    
    bindEvents() {
        // Enable contextual support by default
        this.isActive = true;
    }
    
    analyzeMood(message) {
        const lowerMessage = message.toLowerCase();
        let detectedMood = null;
        let maxMatches = 0;
        
        for (const [mood, data] of Object.entries(this.moodPatterns)) {
            const matches = data.keywords.filter(keyword => 
                lowerMessage.includes(keyword)
            ).length;
            
            if (matches > maxMatches) {
                maxMatches = matches;
                detectedMood = mood;
            }
        }
        
        return maxMatches > 0 ? detectedMood : null;
    }
    
    detectMoodFromConversation() {
        // Analyze the entire conversation context
        const conversationText = this.conversationContext.join(' ');
        return this.detectMood(conversationText) || 'general';
    }
    
    processMessage(message) {
        if (!this.isActive) return;
        
        const now = Date.now();
        this.messageCount = (this.messageCount || 0) + 1;
        console.log(`Contextual Support - Processing message #${this.messageCount}:`, message);
        
        // Store conversation context for contextual responses
        this.conversationContext.push(message.toLowerCase());
        if (this.conversationContext.length > 5) {
            this.conversationContext.shift(); // Keep only last 5 messages
        }
        
        // Detect current mood based on recent messages
        this.currentMood = this.analyzeMood(this.conversationContext.join(' '));
        console.log('Detected conversation mood:', this.currentMood);
        
        // Show professional B-S-A buttons in chat input after 2 conversations
        if (this.messageCount === 2) {
            console.log('Showing professional contextual buttons after 2 messages');
            this.showProfessionalContextualButtons();
        }
        
        // Don't show suggestions too frequently
        if (now - this.lastSuggestionTime < this.minSuggestionInterval) return;
        
        const detectedMood = this.analyzeMood(message);
        
        // Still provide immediate emotional support for strong emotional signals
        if (detectedMood && detectedMood !== this.currentMood && this.isStrongEmotionalSignal(message)) {
            this.currentMood = detectedMood;
            this.conversationContext.push({ message, mood: detectedMood, timestamp: now });
            
            // Show inline support after a brief delay to let the AI respond first
            setTimeout(() => {
                this.showInChatSupport(detectedMood);
            }, 3000);
        }
    }
    
    showInChatSupport(mood) {
        if (!this.isActive) return;
        
        const messagesContainer = document.getElementById('chat-messages');
        
        // Create inline support buttons
        const supportDiv = document.createElement('div');
        supportDiv.className = 'contextual-support-inline';
        supportDiv.id = 'contextual-support-inline';
        
        let supportMessage = 'I sense you might need some spiritual support:';
        
        switch (mood) {
            case 'sad':
                supportMessage = 'I can feel your sadness. Let me offer comfort:';
                break;
            case 'anxious':
                supportMessage = 'Those worried thoughts can be overwhelming. Here\'s help:';
                break;
            case 'angry':
                supportMessage = 'I sense some frustration. Let me bring you peace:';
                break;
            case 'hopeful':
                supportMessage = 'Your hope is beautiful! Let\'s celebrate:';
                break;
        }
        
        supportDiv.innerHTML = `
            <div class="support-message">${supportMessage}</div>
            <div class="support-buttons">
                <button class="support-quick-btn verse-btn" onclick="window.contextualSupport.showInlineContent('verse', '${mood}')">
                    <span class="btn-letter">B</span>
                    <span class="btn-label">Bible Verse</span>
                </button>
                <button class="support-quick-btn story-btn" onclick="window.contextualSupport.showInlineContent('story', '${mood}')">
                    <span class="btn-letter">S</span>
                    <span class="btn-label">Story</span>
                </button>
                <button class="support-quick-btn analogy-btn" onclick="window.contextualSupport.showInlineContent('analogy', '${mood}')">
                    <span class="btn-letter">A</span>
                    <span class="btn-label">Analogy</span>
                </button>
            </div>
        `;
        
        messagesContainer.appendChild(supportDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.lastSuggestionTime = Date.now();
        
        // Auto-hide after 20 seconds if no interaction
        setTimeout(() => {
            if (document.getElementById('contextual-support-inline')) {
                supportDiv.remove();
            }
        }, 20000);
    }
    
    showInlineContent(type, mood) {
        console.log(`Showing ${type} content for mood: ${mood}`);
        
        // Remove any existing support div
        const existingDiv = document.getElementById('contextual-support-inline');
        if (existingDiv) existingDiv.remove();
        
        let suggestion;
        
        // Use current conversation mood instead of passed mood for context
        const contextualMood = this.currentMood || mood;
        
        // Handle general mood (for gentle check-ins)
        if (contextualMood === 'general') {
            suggestion = this.getGeneralContent(type);
        } else if (this.moodPatterns[contextualMood]) {
            const suggestions = this.moodPatterns[contextualMood].suggestions;
            suggestion = suggestions.find(s => s.type === type);
            
            // If asking for analogy but we don't have one, create one based on mood
            if (type === 'analogy' && !suggestion) {
                suggestion = this.createAnalogy(contextualMood);
            } else if (!suggestion) {
                suggestion = suggestions[0]; // fallback
            }
        } else {
            // Fallback for unknown moods
            suggestion = this.getGeneralContent(type);
        }
        
        if (!suggestion) {
            console.error('No suggestion found for type:', type, 'mood:', mood);
            return;
        }
        
        // Display the content as a GABE message with personal introduction
        const messagesContainer = document.getElementById('chat-messages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message gabe';
        
        // Add GABE's personal introduction based on content type
        let gabeIntro = '';
        if (type === 'prayer') {
            gabeIntro = 'Hey friend, let me pray with you right now. ';
        } else if (type === 'story') {
            gabeIntro = 'You know what? This reminds me of a Bible story. ';
        } else if (type === 'analogy') {
            gabeIntro = 'Here\'s how I see your situation - ';
        }
        
        let content = `${gabeIntro}**${suggestion.title}**\n\n${suggestion.content}`;
        if (suggestion.verse || suggestion.reference) {
            content += `\n\n*${suggestion.verse || suggestion.reference}*`;
        }
        
        // Add GABE's friendship reminder
        const friendshipReminders = [
            '\n\nRemember, I\'m your best friend and I\'m always here for you. 💙',
            '\n\nYou\'ve got a friend in me - I\'m not going anywhere. 💙',
            '\n\nI\'m here with you, friend. You\'re never walking this alone. 💙',
            '\n\nYou matter so much to me. I\'m your friend through all of this. 💙'
        ];
        content += friendshipReminders[Math.floor(Math.random() * friendshipReminders.length)];
        
        messageDiv.innerHTML = `
            <div class="message-avatar">G</div>
            <div class="message-content">${content.replace(/\n/g, '<br>')}</div>
            <button class="speaker-btn" onclick="window.gabeApp && window.gabeApp.speakResponse(\`${content.replace(/[`"']/g, '')}\`)">
                <i data-feather="volume-2"></i>
            </button>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Initialize feather icons for the new speaker button
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        this.currentSuggestion = suggestion;
        
        // Add GABE's follow-up message after a brief pause
        setTimeout(() => {
            this.addFollowUpMessage(type);
        }, 2000);
    }
    
    showGentleCheckIn() {
        if (!this.isActive) return;
        
        const messagesContainer = document.getElementById('chat-messages');
        
        // Get user's name from window.authenticatedUser or gabeApp if available
        let userName = 'friend';
        if (window.authenticatedUser && window.authenticatedUser.name) {
            userName = window.authenticatedUser.name;
        } else if (window.gabeApp && window.gabeApp.userName) {
            userName = window.gabeApp.userName;
        }
        
        // Create gentle check-in message
        const checkInDiv = document.createElement('div');
        checkInDiv.className = 'contextual-support-inline gentle-checkin';
        checkInDiv.id = 'contextual-support-inline';
        
        checkInDiv.innerHTML = `
            <div class="gabe-checkin-header">👋 GABE:</div>
            <div class="support-message">Hey ${userName}, if you're not sure what to say right now, I'm still here.<br>Would you like one of these to guide you?</div>
            <div class="support-buttons gentle-buttons">
                <button class="support-quick-btn prayer-btn" onclick="window.contextualSupport.showInlineContent('prayer', 'general')">
                    <span class="btn-emoji">🙏</span>
                    <span class="btn-label">Prayer</span>
                </button>
                <button class="support-quick-btn verse-btn" onclick="window.contextualSupport.showInlineContent('verse', 'general')">
                    <span class="btn-emoji">📖</span>
                    <span class="btn-label">Bible Verse</span>
                </button>
                <button class="support-quick-btn story-btn" onclick="window.contextualSupport.showInlineContent('story', 'general')">
                    <span class="btn-emoji">📚</span>
                    <span class="btn-label">Bible Story</span>
                </button>
            </div>
        `;
        
        messagesContainer.appendChild(checkInDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.lastSuggestionTime = Date.now();
        this.messageCount = 0; // Reset counter after check-in
        
        // Auto-hide after 25 seconds if no interaction
        setTimeout(() => {
            if (document.getElementById('contextual-support-inline')) {
                checkInDiv.remove();
            }
        }, 25000);
    }
    
    createAnalogy(mood) {
        const analogies = {
            sad: {
                title: 'Like a Diamond Under Pressure',
                content: 'When people are mean to you, it\'s like you\'re a diamond being pressured by rough stones. The stones think they can break you, but diamonds are formed under pressure. Their meanness can\'t change your value - it only reveals how precious you really are.',
                verse: 'Matthew 5:11 - Blessed are you when people insult you and persecute you because of me'
            },
            anxious: {
                title: 'Like a Ship in a Storm',
                content: 'Your anxiety is like being on a ship in rough seas. The waves feel overwhelming and you can\'t see the shore. But remember - the anchor holds firm beneath the surface, and every storm eventually passes. You have an anchor in God\'s love.',
                verse: 'Hebrews 6:19 - We have this hope as an anchor for the soul, firm and secure.'
            },
            angry: {
                title: 'Like Fire That Can Build or Burn',
                content: 'Your anger is like fire in your hands. Fire can destroy everything it touches, or it can warm a home and forge something new. The choice is yours - let it consume you, or channel it into passion for justice and positive change.',
                verse: 'Ephesians 4:26 - In your anger do not sin. Do not let the sun go down while you are still angry.'
            },
            hopeful: {
                title: 'Like Dawn Breaking Over Mountains',
                content: 'Your hope is like the first light of dawn breaking over mountain peaks. After the long night, light spills across the valleys, bringing warmth and new possibilities. Your hope illuminates not just your path, but lights the way for others too.',
                verse: 'Romans 15:13 - May the God of hope fill you with all joy and peace as you trust in him.'
            }
        };
        
        return analogies[mood] || analogies['hopeful'];
    }
    
    getGeneralContent(type) {
        const generalContent = {
            prayer: {
                title: 'A Prayer for Your Heart',
                content: 'Dear Heavenly Father, thank You for this moment we have together. Whatever is on my heart right now - spoken or unspoken - You already know. Please bring peace to my mind, comfort to my soul, and guidance for my next steps. Help me feel Your presence and know that I am deeply loved.',
                verse: 'Philippians 4:6-7 - Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.'
            },
            verse: {
                title: 'God\'s Encouragement for You',
                content: 'God wants you to know that He is with you in this moment. His love for you never changes, and His plans for your life are good.',
                verse: 'Jeremiah 29:11 - "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future."'
            },
            story: {
                title: 'Jesus and the Quiet Moments',
                content: 'Even Jesus needed quiet moments. The Bible tells us that Jesus often withdrew to lonely places to pray and spend time with His Father. Sometimes the most important conversations happen in the silence, when we simply rest in God\'s presence.',
                verse: 'Luke 5:16 - But Jesus often withdrew to lonely places and prayed.'
            },
            analogy: {
                title: 'Like a Tree by the River',
                content: 'You\'re like a tree planted by a flowing river. The water doesn\'t make noise about how much it gives - it just keeps flowing, providing life. In the same way, God\'s love for you flows quietly but constantly, giving you strength even when you don\'t notice it.',
                verse: 'Psalm 1:3 - That person is like a tree planted by streams of water'
            }
        };
        
        return generalContent[type] || generalContent['prayer'];
    }
    
    showProfessionalContextualButtons() {
        const contextBar = document.getElementById('contextual-support-bar');
        console.log('Looking for contextual support bar:', contextBar);
        if (contextBar) {
            contextBar.style.display = 'flex';
            this.lastSuggestionTime = Date.now();
            console.log('Professional contextual buttons now visible');
        } else {
            console.error('Contextual support bar not found in DOM');
        }
    }
    

    
    addFollowUpMessage(type) {
        const messagesContainer = document.getElementById('chat-messages');
        const followUpDiv = document.createElement('div');
        followUpDiv.className = 'message gabe';
        
        let followUpContent = '';
        if (type === 'prayer') {
            followUpContent = 'I hope that prayer speaks to your heart. How are you feeling right now? I\'m here if you want to talk more about what\'s going on. 💙';
        } else if (type === 'story') {
            followUpContent = 'That story always reminds me how much God understands what we go through. Does it connect with what you\'re experiencing? I\'m listening, friend. 💙';
        } else if (type === 'analogy') {
            followUpContent = 'Sometimes seeing our situation from a different angle helps. What do you think about that perspective? I\'m here to work through this with you. 💙';
        }
        
        followUpDiv.innerHTML = `
            <div class="message-avatar">G</div>
            <div class="message-content">${followUpContent}</div>
            <button class="speaker-btn" onclick="window.gabeApp && window.gabeApp.speakResponse(\`${followUpContent.replace(/[`"'💙]/g, '')}\`)">
                <i data-feather="volume-2"></i>
            </button>
        `;
        
        messagesContainer.appendChild(followUpDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
    
    isStrongEmotionalSignal(message) {
        const strongSignals = [
            'feel like giving up', 'want to die', 'can\'t take it anymore', 'everything is falling apart',
            'nobody cares', 'hate my life', 'completely lost', 'breaking down', 'can\'t breathe',
            'panic attack', 'terrified', 'scared to death', 'furious', 'so angry', 'rage'
        ];
        
        const lowerMessage = message.toLowerCase();
        return strongSignals.some(signal => lowerMessage.includes(signal));
    }
    
    showOptions() {
        const optionsDiv = document.querySelector('.support-options');
        const contentDiv = document.getElementById('suggestion-content');
        
        optionsDiv.style.display = 'flex';
        contentDiv.style.display = 'none';
    }
    
    saveSuggestion() {
        if (!this.currentSuggestion) return;
        
        // Create journal entry
        const journalEntry = {
            type: 'spiritual_support',
            title: this.currentSuggestion.title,
            content: this.currentSuggestion.content,
            verse: this.currentSuggestion.verse || this.currentSuggestion.reference,
            mood: this.currentMood,
            timestamp: new Date().toISOString()
        };
        
        // Save to local storage (in a real app, this would go to the backend)
        let savedSuggestions = JSON.parse(localStorage.getItem('gabe_spiritual_support') || '[]');
        savedSuggestions.unshift(journalEntry);
        savedSuggestions = savedSuggestions.slice(0, 50); // Keep last 50
        localStorage.setItem('gabe_spiritual_support', JSON.stringify(savedSuggestions));
        
        // Show success message
        this.showSuccessMessage('Saved to your spiritual journal! ✨');
        this.hidePopup();
    }
    
    showSuccessMessage(message) {
        // Create temporary success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10001;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    hidePopup() {
        const popup = document.getElementById('contextual-support-popup');
        popup.style.display = 'none';
        this.showOptions(); // Reset to options view
    }
    
    disableForSession() {
        this.isActive = false;
        this.hidePopup();
        console.log('Contextual support disabled for this session');
    }
    
    enable() {
        this.isActive = true;
        console.log('Contextual support enabled');
    }
}

// ContextualSupport class is initialized by app.js to avoid duplicates
