// Clean Spiritual Director Implementation
class SpiritualDirector {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        // Spiritual director button click
        document.addEventListener('click', (e) => {
            if (e.target.closest('#spiritual-director-btn')) {
                this.openSpiritualDirection();
            }
        });
    }

    openSpiritualDirection() {
        console.log('Opening Spiritual Direction...');
        this.createSpiritualDirectionModal();
    }

    createSpiritualDirectionModal() {
        // Remove existing modal
        const existingModal = document.getElementById('spiritual-direction-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
        <div id="spiritual-direction-modal" class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
            <div style="background: white; border-radius: 20px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); position: relative;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #6a4c93 0%, #c06c84 100%); padding: 30px 25px; text-align: center; border-radius: 20px 20px 0 0; position: relative;">
                    <div style="font-size: 4rem; color: white; margin-bottom: 10px;">🧭</div>
                    <h3 style="color: white; margin: 0; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">Spiritual Direction</h3>
                    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Personal guidance from saints & spiritual masters</p>
                    <button onclick="document.getElementById('spiritual-direction-modal').remove()" style="position: absolute; top: 20px; right: 25px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 28px; cursor: pointer; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
                </div>
                
                <!-- Content -->
                <div style="padding: 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h4 style="color: #2d3748; margin-bottom: 15px; font-weight: bold;">Share What's on Your Heart</h4>
                        <p style="color: #718096; font-size: 16px; line-height: 1.6;">Our AI will connect you with the perfect spiritual master whose wisdom matches your need. Whether you're struggling with doubt, seeking purpose, or needing comfort, you'll receive personalized guidance rooted in centuries of Christian wisdom.</p>
                    </div>
                    
                    <!-- Input Form -->
                    <div style="background: #f8f9fa; border-radius: 15px; padding: 25px; margin-bottom: 25px;">
                        <textarea id="spiritual-concern" placeholder="Share your spiritual concerns, questions, or struggles... (e.g., 'I'm struggling with anxiety about my future' or 'I feel distant from God lately')" style="width: 100%; min-height: 120px; border: 2px solid #e2e8f0; border-radius: 12px; padding: 15px; font-size: 16px; line-height: 1.5; resize: vertical; font-family: inherit;" maxlength="1000"></textarea>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                            <small style="color: #718096;">Be authentic - the more you share, the better guidance you'll receive</small>
                            <span id="char-count" style="color: #a0aec0; font-size: 12px;">0/1000</span>
                        </div>
                    </div>
                    
                    <!-- Saints Preview -->
                    <div style="margin-bottom: 25px;">
                        <h5 style="color: #2d3748; margin-bottom: 15px; font-weight: bold; text-align: center;">Meet Your Spiritual Directors</h5>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;">
                            <div style="text-align: center; padding: 15px; background: white; border: 2px solid #e2e8f0; border-radius: 12px;">
                                <div style="font-size: 2rem; margin-bottom: 8px;">🌹</div>
                                <small style="color: #4a5568; font-weight: 600;">St. Teresa of Avila</small>
                                <div style="font-size: 11px; color: #718096; margin-top: 4px;">Prayer & Mysticism</div>
                            </div>
                            <div style="text-align: center; padding: 15px; background: white; border: 2px solid #e2e8f0; border-radius: 12px;">
                                <div style="font-size: 2rem; margin-bottom: 8px;">✝️</div>
                                <small style="color: #4a5568; font-weight: 600;">St. John of the Cross</small>
                                <div style="font-size: 11px; color: #718096; margin-top: 4px;">Dark Night of Soul</div>
                            </div>
                            <div style="text-align: center; padding: 15px; background: white; border: 2px solid #e2e8f0; border-radius: 12px;">
                                <div style="font-size: 2rem; margin-bottom: 8px;">🕊️</div>
                                <small style="color: #4a5568; font-weight: 600;">Brother Lawrence</small>
                                <div style="font-size: 11px; color: #718096; margin-top: 4px;">Presence of God</div>
                            </div>
                            <div style="text-align: center; padding: 15px; background: white; border: 2px solid #e2e8f0; border-radius: 12px;">
                                <div style="font-size: 2rem; margin-bottom: 8px;">📖</div>
                                <small style="color: #4a5568; font-weight: 600;">St. Francis de Sales</small>
                                <div style="font-size: 11px; color: #718096; margin-top: 4px;">Gentle Devotion</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Submit Button -->
                    <div style="text-align: center;">
                        <button onclick="window.spiritualDirector.startSpiritualDirection()" style="background: linear-gradient(135deg, #6a4c93 0%, #c06c84 100%); color: white; border: none; border-radius: 25px; padding: 18px 40px; font-size: 18px; font-weight: bold; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 15px rgba(106, 76, 147, 0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(106, 76, 147, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(106, 76, 147, 0.3)'">
                            🧭 Receive Spiritual Direction
                        </button>
                        <div style="margin-top: 12px;">
                            <span style="background: #f0fff4; color: #38a169; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">+5 XP Reward</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add character counter
        const textarea = document.getElementById('spiritual-concern');
        const charCount = document.getElementById('char-count');
        if (textarea && charCount) {
            textarea.addEventListener('input', function() {
                const count = this.value.length;
                charCount.textContent = `${count}/1000`;
                if (count > 900) {
                    charCount.style.color = '#e53e3e';
                } else {
                    charCount.style.color = '#a0aec0';
                }
            });
        }
    }

    startSpiritualDirection() {
        const concern = document.getElementById('spiritual-concern')?.value?.trim();
        
        if (!concern) {
            alert('Please share what\'s on your heart before receiving spiritual direction.');
            return;
        }
        
        console.log('Starting spiritual direction session...');
        
        // Replace modal content with loading state
        const modal = document.getElementById('spiritual-direction-modal');
        if (modal) {
            modal.innerHTML = `
            <div style="background: white; border-radius: 20px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); position: relative;">
                <div style="background: linear-gradient(135deg, #6a4c93 0%, #c06c84 100%); padding: 30px 25px; text-align: center; border-radius: 20px 20px 0 0;">
                    <div style="font-size: 4rem; color: white; margin-bottom: 10px;">🧭</div>
                    <h3 style="color: white; margin: 0; font-weight: bold;">Connecting you with spiritual wisdom...</h3>
                </div>
                <div style="padding: 40px; text-align: center;">
                    <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #6a4c93; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
                    <p style="color: #718096;">Our AI is analyzing your spiritual concern and selecting the perfect spiritual master to guide you...</p>
                </div>
            </div>
            <style>
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            </style>`;
        }
        
        // Call the spiritual direction API
        this.getSpiritualDirection(concern);
    }

    async getSpiritualDirection(concern) {
        try {
            const response = await fetch('/api/spiritual_direction/assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: concern })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.displayFormattedResult(result);
                } else {
                    throw new Error(result.error || 'Failed to get spiritual direction');
                }
            } else {
                throw new Error('Failed to get spiritual direction');
            }
        } catch (error) {
            console.error('Spiritual direction error:', error);
            this.showErrorMessage();
        }
    }

    displayFormattedResult(result) {
        const modal = document.getElementById('spiritual-direction-modal');
        if (!modal) return;
        
        // Format the direction text for mobile display
        const directionText = result.direction_text || "God is with you in this moment, dear friend.";
        
        modal.innerHTML = `
        <div style="background: white; border-radius: 20px; max-width: 700px; width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); position: relative;">
            <div style="background: linear-gradient(135deg, #6a4c93 0%, #c06c84 100%); padding: 30px 25px; text-align: center; border-radius: 20px 20px 0 0; position: relative;">
                <div style="font-size: 4rem; color: white; margin-bottom: 10px;">🧭</div>
                <h3 style="color: white; margin: 0; font-weight: bold;">Spiritual Direction</h3>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">from ${result.spiritual_director || 'Your Spiritual Guide'}</p>
                <button onclick="document.getElementById('spiritual-direction-modal').remove()" style="position: absolute; top: 20px; right: 25px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 28px; cursor: pointer; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">×</button>
            </div>
            
            <div style="padding: 30px;">
                <!-- Main Spiritual Direction -->
                <div style="background: #f8f9fa; border-radius: 15px; padding: 25px; margin-bottom: 25px; border-left: 5px solid #6a4c93;">
                    <div style="color: #2d3748; font-size: 16px; line-height: 1.8; white-space: pre-line;">${directionText}</div>
                </div>
                
                <!-- XP Reward -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <button onclick="document.getElementById('spiritual-direction-modal').remove(); if(window.gameFeatures) window.gameFeatures.loadUserProgress();" style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 12px 24px; border-radius: 25px; display: inline-block; font-weight: bold; box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3); border: none; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        ✨ +${result.xp_earned || 5} XP Earned!
                    </button>
                </div>
                
                <!-- Action Buttons -->
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="window.spiritualDirector.openSpiritualDirection()" style="background: linear-gradient(135deg, #6a4c93 0%, #c06c84 100%); color: white; border: none; border-radius: 20px; padding: 12px 24px; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
                        🙏 New Direction Session
                    </button>
                    <button onclick="document.getElementById('spiritual-direction-modal').remove()" style="background: #e2e8f0; color: #4a5568; border: none; border-radius: 20px; padding: 12px 24px; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
                        ✓ Close
                    </button>
                </div>
            </div>
        </div>`;
        
        // Update user progress if provided
        if (result.current_xp !== undefined) {
            window.gameFeatures?.updateProgressDisplay({
                xp: result.current_xp,
                level: result.current_level
            });
        }
        
        // Force reload user progress to show updated XP
        if (window.gameFeatures && typeof window.gameFeatures.loadUserProgress === 'function') {
            setTimeout(() => {
                window.gameFeatures.loadUserProgress();
                
                // Also directly update the XP display if visible
                const totalXPElement = document.getElementById('totalXP');
                if (totalXPElement && result.current_xp !== undefined) {
                    totalXPElement.textContent = result.current_xp;
                    console.log('Force updated totalXP display to:', result.current_xp);
                }
            }, 1000);
        }
        
        // Also try immediate update
        const totalXPElement = document.getElementById('totalXP');
        if (totalXPElement && result.current_xp !== undefined) {
            totalXPElement.textContent = result.current_xp;
            console.log('Immediate updated totalXP display to:', result.current_xp);
        }
    }

    showErrorMessage() {
        const modal = document.getElementById('spiritual-direction-modal');
        if (!modal) return;
        
        modal.innerHTML = `
        <div style="background: white; border-radius: 20px; max-width: 500px; width: 90%; padding: 40px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
            <div style="font-size: 4rem; color: #ef4444; margin-bottom: 20px;">😔</div>
            <h3 style="color: #2d3748; margin-bottom: 15px;">Unable to Connect</h3>
            <p style="color: #718096; margin-bottom: 25px;">We're having trouble connecting to our spiritual guidance system right now. Please try again in a moment.</p>
            <button onclick="document.getElementById('spiritual-direction-modal').remove()" style="background: #6a4c93; color: white; border: none; border-radius: 25px; padding: 12px 25px; cursor: pointer;">
                Try Again Later
            </button>
        </div>`;
    }
}

// Initialize spiritual director
window.spiritualDirector = new SpiritualDirector();
