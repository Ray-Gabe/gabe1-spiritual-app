/**
 * Activity Tracker - Monitors user engagement for validation
 * Tracks genuine interaction patterns to prevent gaming the system
 */

class ActivityTracker {
    constructor() {
        this.currentActivity = null;
        this.activityStartTime = null;
        this.mouseMovements = 0;
        this.keyPresses = 0;
        this.pageBlurCount = 0;
        this.focusTime = 0;
        this.lastFocusTime = null;
        this.pasteEvents = 0;
        
        this.bindEvents();
    }
    
    startTracking(activityType) {
        console.log(`Starting activity tracking for: ${activityType}`);
        this.currentActivity = activityType;
        this.activityStartTime = Date.now();
        this.mouseMovements = 0;
        this.keyPresses = 0;
        this.pageBlurCount = 0;
        this.focusTime = 0;
        this.lastFocusTime = Date.now();
        this.pasteEvents = 0;
    }
    
    stopTracking() {
        if (!this.currentActivity) return null;
        
        const endTime = Date.now();
        const totalTime = endTime - this.activityStartTime;
        
        // Calculate focus time
        if (this.lastFocusTime && document.hasFocus()) {
            this.focusTime += endTime - this.lastFocusTime;
        }
        
        const metadata = {
            activity_type: this.currentActivity,
            start_time: this.activityStartTime / 1000,
            end_time: endTime / 1000,
            total_time: totalTime / 1000,
            mouse_movements: this.mouseMovements,
            key_presses: this.keyPresses,
            page_focus_time: this.focusTime / 1000,
            page_blur_count: this.pageBlurCount,
            paste_events: this.pasteEvents,
            engagement_score: this.calculateEngagementScore(totalTime)
        };
        
        console.log('Activity tracking completed:', metadata);
        
        // Reset tracking
        this.currentActivity = null;
        this.activityStartTime = null;
        
        return metadata;
    }
    
    calculateEngagementScore(totalTime) {
        let score = 0.5; // Base score
        
        // Time factor (appropriate time spent)
        if (totalTime > 30000) score += 0.2; // More than 30 seconds
        if (totalTime > 120000) score += 0.2; // More than 2 minutes
        
        // Interaction factors
        if (this.mouseMovements > 10) score += 0.1;
        if (this.keyPresses > 20) score += 0.1;
        
        // Focus factor
        const focusRatio = this.focusTime / totalTime;
        if (focusRatio > 0.8) score += 0.2; // Good focus
        else if (focusRatio < 0.5) score -= 0.2; // Poor focus
        
        // Penalty for suspicious behavior
        if (this.pasteEvents > 2) score -= 0.3; // Too much pasting
        if (totalTime < 10000) score -= 0.4; // Too quick completion
        
        return Math.max(0, Math.min(1, score));
    }
    
    bindEvents() {
        // Track mouse movements
        document.addEventListener('mousemove', (e) => {
            if (this.currentActivity) {
                this.mouseMovements++;
            }
        });
        
        // Track keyboard activity
        document.addEventListener('keydown', (e) => {
            if (this.currentActivity) {
                this.keyPresses++;
            }
        });
        
        // Track paste events (potentially suspicious)
        document.addEventListener('paste', (e) => {
            if (this.currentActivity) {
                this.pasteEvents++;
                console.log('Paste event detected during activity tracking');
            }
        });
        
        // Track window focus/blur for engagement
        window.addEventListener('focus', () => {
            if (this.currentActivity) {
                this.lastFocusTime = Date.now();
            }
        });
        
        window.addEventListener('blur', () => {
            if (this.currentActivity) {
                if (this.lastFocusTime) {
                    this.focusTime += Date.now() - this.lastFocusTime;
                    this.lastFocusTime = null;
                }
                this.pageBlurCount++;
            }
        });
    }
    
    // Generate validation challenges for enhanced verification
    generateChallenge(activityType) {
        const challenges = {
            devotion: [
                {
                    type: 'reflection',
                    question: 'What specific emotion did you feel during this devotion?',
                    placeholder: 'Be specific about your emotional response...'
                },
                {
                    type: 'application',
                    question: 'Name one concrete action you will take today based on this devotion.',
                    placeholder: 'What will you actually do differently?'
                },
                {
                    type: 'personal_connection',
                    question: 'How does this devotion relate to something happening in your life right now?',
                    placeholder: 'Connect this to your current situation...'
                }
            ],
            prayer: [
                {
                    type: 'gratitude',
                    question: 'What are you most grateful for in this moment?',
                    placeholder: 'Be specific about your gratitude...'
                },
                {
                    type: 'intention',
                    question: 'What did you specifically pray about?',
                    placeholder: 'Share what was on your heart...'
                }
            ],
            reading: [
                {
                    type: 'understanding',
                    question: 'What was the main message of what you read?',
                    placeholder: 'Summarize the key point in your own words...'
                },
                {
                    type: 'personal_insight',
                    question: 'What new insight did you gain from this reading?',
                    placeholder: 'What stood out to you personally?'
                }
            ]
        };
        
        const activityChallenges = challenges[activityType] || challenges.devotion;
        return activityChallenges[Math.floor(Math.random() * activityChallenges.length)];
    }
    
    // Display validation challenge modal
    showValidationChallenge(activityType, onComplete) {
        const challenge = this.generateChallenge(activityType);
        
        const modalHTML = `
        <div class="validation-challenge-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; border-radius: 12px; max-width: 500px; width: 90%; padding: 0; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px 12px 0 0;">
                    <h4 style="margin: 0; font-weight: 600;">✨ Reflection Checkpoint</h4>
                    <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">To ensure genuine spiritual growth, please share your authentic experience:</p>
                </div>
                <div style="padding: 24px;">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px;">${challenge.question}</label>
                        <textarea 
                            id="validation-response" 
                            placeholder="${challenge.placeholder}"
                            style="width: 100%; height: 100px; padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; font-family: inherit; resize: vertical; transition: border-color 0.3s;"
                            oninput="this.style.borderColor = this.value.length > 15 ? '#10B981' : '#e1e5e9'"
                        ></textarea>
                        <div style="font-size: 12px; color: #666; margin-top: 4px;">Minimum 15 characters for authentic reflection</div>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button 
                            onclick="document.querySelector('.validation-challenge-modal').remove()" 
                            style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;"
                        >
                            Skip
                        </button>
                        <button 
                            id="submit-validation" 
                            onclick="activityTracker.submitValidationChallenge('${activityType}', '${challenge.type}')"
                            style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; opacity: 0.5;" 
                            disabled
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Enable submit button when response is adequate
        const textarea = document.getElementById('validation-response');
        const submitBtn = document.getElementById('submit-validation');
        
        textarea.addEventListener('input', () => {
            if (textarea.value.trim().length >= 15) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            } else {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.5';
            }
        });
        
        // Store completion callback
        this.validationCallback = onComplete;
    }
    
    submitValidationChallenge(activityType, challengeType) {
        const response = document.getElementById('validation-response').value.trim();
        
        if (response.length < 15) {
            alert('Please provide a more detailed reflection for authentic spiritual growth.');
            return;
        }
        
        // Close modal
        document.querySelector('.validation-challenge-modal').remove();
        
        // Call completion callback with validation data
        if (this.validationCallback) {
            this.validationCallback({
                challenge_type: challengeType,
                challenge_response: response,
                response_length: response.length,
                authentic_engagement: true
            });
        }
    }
}

// Global activity tracker instance
window.activityTracker = new ActivityTracker();
