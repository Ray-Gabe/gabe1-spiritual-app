// Spiritual Features JavaScript Module

// Add spiritual features methods to GABE app
function addSpiritualFeatures() {
    if (!window.gabeApp) {
        console.error('GABE app not found');
        return;
    }
    
    // Request Scripture Method - Standalone functionality
    window.gabeApp.requestScripture = async function() {
        try {
            this.toggleSpiritualFeatures(); // Close panel
            
            const response = await fetch('/api/scripture_recommendation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood: 'hopeful', context: 'user requested scripture' })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.showStandaloneScripture(data.scripture);
            } else {
                this.showStandaloneScripture({
                    verse: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you.",
                    reference: "Jeremiah 29:11",
                    personal_note: "God has wonderful plans for your life."
                });
            }
        } catch (error) {
            console.error('Error getting scripture:', error);
            this.showStandaloneScripture({
                verse: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
                reference: "Psalm 34:18",
                personal_note: "God is always near when you need Him most."
            });
        }
    };
    
    // Show Scripture as standalone overlay
    window.gabeApp.showStandaloneScripture = function(scripture) {
        // Create standalone scripture display
        const overlay = document.createElement('div');
        overlay.className = 'scripture-standalone-overlay';
        overlay.innerHTML = `
            <div class="scripture-standalone-card">
                <div class="scripture-header">
                    <h3><i data-feather="book"></i> Scripture for You</h3>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i data-feather="x"></i>
                    </button>
                </div>
                <div class="scripture-verse">"${scripture.verse}"</div>
                <div class="scripture-reference">— ${scripture.reference}</div>
                <div class="scripture-note">${scripture.personal_note}</div>
                <div class="scripture-actions">
                    <button class="save-btn" onclick="gabeApp.saveToJournal('${scripture.verse}', '${scripture.reference}'); this.textContent = 'Saved!'; this.disabled = true;">
                        <i data-feather="heart"></i> Save to Journal
                    </button>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        feather.replace();
        
        // Auto-remove after 15 seconds if not manually closed
        setTimeout(() => {
            if (overlay.parentElement) {
                overlay.remove();
            }
        }, 15000);
    };
    
    // Daily Reminder Method
    window.gabeApp.getDailyReminder = async function() {
        try {
            this.toggleSpiritualFeatures(); // Close panel
            
            // Show loading message
            this.displayGabeMessage("Let me get your daily spiritual reminder...");
            
            const response = await fetch('/api/daily_reminder');
            
            if (response.ok) {
                const data = await response.json();
                
                // Replace loading message
                const messages = document.querySelectorAll('.message.gabe');
                const lastMessage = messages[messages.length - 1];
                if (lastMessage) {
                    lastMessage.remove();
                }
                
                this.displayGabeMessage(data.reminder.message);
                
                if (data.reminder.scripture) {
                    await this.delay(1500);
                    this.displayScriptureRecommendation(data.reminder.scripture);
                }
            } else {
                this.displayGabeMessage("Here's your daily reminder: God loves you and has wonderful plans for your day! 💙");
            }
        } catch (error) {
            console.error('Error getting daily reminder:', error);
            this.displayGabeMessage("Remember: 'This is the day the Lord has made; let us rejoice and be glad in it.' - Psalm 118:24");
        }
    };
    
    // Toggle Spiritual Features Panel
    window.gabeApp.toggleSpiritualFeatures = function() {
        const featuresPanel = document.getElementById('spiritual-features');
        if (featuresPanel) {
            if (featuresPanel.style.display === 'none' || !featuresPanel.style.display) {
                featuresPanel.style.display = 'block';
                feather.replace(); // Refresh icons
            } else {
                featuresPanel.style.display = 'none';
            }
        }
    };
    
    // View Prayer Journal Method - Standalone functionality
    window.gabeApp.viewPrayerJournal = async function() {
        try {
            this.toggleSpiritualFeatures(); // Close panel
            this.showStandalonePrayerJournal();
            
        } catch (error) {
            console.error('Error viewing prayer journal:', error);
            alert("I had trouble accessing your prayer journal. Please try again.");
        }
    };
    
    // Show Prayer Journal as standalone overlay
    window.gabeApp.showStandalonePrayerJournal = async function() {
        // Create standalone prayer journal display
        const overlay = document.createElement('div');
        overlay.className = 'journal-standalone-overlay';
        overlay.innerHTML = `
            <div class="journal-standalone-card">
                <div class="journal-header">
                    <h3><i data-feather="book-open"></i> Your Prayer Journal</h3>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i data-feather="x"></i>
                    </button>
                </div>
                <div class="journal-content">
                    <div class="journal-loading">
                        <i data-feather="loader"></i>
                        <p>Loading your prayer journal...</p>
                    </div>
                </div>
                <div class="journal-actions">
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        feather.replace();
        
        try {
            const response = await fetch('/api/prayer_journal');
            if (response.ok) {
                const data = await response.json();
                this.populateStandaloneJournal(overlay, data.entries);
            } else {
                throw new Error('Failed to fetch');
            }
        } catch (error) {
            const content = overlay.querySelector('.journal-content');
            content.innerHTML = `
                <div class="journal-empty">
                    <i data-feather="alert-circle"></i>
                    <h4>Unable to Load Journal</h4>
                    <p>There was an issue accessing your prayer journal. Please try again.</p>
                </div>
            `;
            feather.replace();
        }
    };
    
    // Populate standalone journal with entries
    window.gabeApp.populateStandaloneJournal = function(overlay, entries) {
        const content = overlay.querySelector('.journal-content');
        
        if (!entries || entries.length === 0) {
            content.innerHTML = `
                <div class="journal-empty">
                    <i data-feather="book-open"></i>
                    <h4>Your Prayer Journal is Empty</h4>
                    <p>When you share prayers with me or save scripture verses, they'll appear here as a beautiful record of your spiritual journey.</p>
                </div>
            `;
            feather.replace();
            return;
        }
        
        let journalHtml = `<div class="journal-summary">📖 ${entries.length} prayer entries</div>`;
        entries.reverse().forEach(entry => {
            const date = new Date(entry.date).toLocaleString();
            journalHtml += `
                <div class="journal-entry">
                    <div class="entry-date">${date}</div>
                    <div class="entry-prayer"><strong>Prayer:</strong> ${entry.prayer_request}</div>
                    ${entry.gabe_response ? `<div class="entry-response"><strong>Response:</strong> ${entry.gabe_response}</div>` : ''}
                    <div class="entry-mood">Mood: ${entry.mood}</div>
                </div>
            `;
        });
        
        content.innerHTML = journalHtml;
        feather.replace();
    };
    
    // Start New Prayer (focuses chat for new prayer)
    window.gabeApp.startNewPrayer = function() {
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.focus();
            chatInput.placeholder = "Share your prayer with me...";
        }
        this.displayGabeMessage("I'm here to pray with you. What's on your heart today?");
    };
    
    // Auto-save conversations to prayer journal when prayer keywords are detected
    window.gabeApp.autoSavePrayerEntry = function(userMessage, gabeResponse, mood) {
        const prayerKeywords = ['pray', 'prayer', 'praying', 'god', 'lord', 'jesus', 'faith', 'blessing', 'amen'];
        const containsPrayer = prayerKeywords.some(keyword => 
            userMessage.toLowerCase().includes(keyword) || gabeResponse.toLowerCase().includes(keyword)
        );
        
        if (containsPrayer) {
            fetch('/api/prayer_journal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prayer_request: userMessage,
                    gabe_response: gabeResponse,
                    mood: mood || 'peaceful'
                })
            }).catch(error => {
                console.log('Auto-save to prayer journal failed:', error);
            });
        }
    };
    
    // Send Message Helper
    if (!window.gabeApp.sendMessage) {
        window.gabeApp.sendMessage = function(message) {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) {
                chatInput.value = message;
                const chatForm = document.getElementById('chat-form');
                if (chatForm) {
                    chatForm.dispatchEvent(new Event('submit'));
                }
            }
        };
    }
    
    console.log('Spiritual features added successfully');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait for GABE app to be initialized
    setTimeout(() => {
        addSpiritualFeatures();
        
        // Add spiritual features button listener
        const spiritualFeaturesBtn = document.getElementById('spiritual-features-btn');
        if (spiritualFeaturesBtn && window.gabeApp) {
            spiritualFeaturesBtn.addEventListener('click', () => {
                window.gabeApp.toggleSpiritualFeatures();
            });
            console.log('Spiritual features button connected');
        }
    }, 500);
});
