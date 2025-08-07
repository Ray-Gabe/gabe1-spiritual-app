class FaithCardsSystem {
    constructor() {
        this.currentUserData = null;
        this.dailyProgress = {};
        this.myGarden = [];
        this.tooltip = null;
        this.initializeSystem();
    }

    initializeSystem() {
        console.log('Faith Cards System initializing...');
        this.loadDailyProgress();
        this.bindCardEvents();
        this.createModernTooltipSystem();
    }
    
    createModernTooltipSystem() {
        // Create modern tooltip container
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'modern-tooltip';
        this.tooltip.style.cssText = `
            position: absolute;
            background: #f8f9fa;
            color: #212529;
            padding: 12px 16px;
            border-radius: 8px;
            font-family: Inter, sans-serif;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.4;
            max-width: 280px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: none;
            border: 1px solid #e9ecef;
        `;
        
        // Add arrow
        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position: absolute;
            top: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 12px;
            height: 12px;
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-bottom: none;
            border-right: none;
            transform: translateX(-50%) rotate(45deg);
        `;
        this.tooltip.appendChild(arrow);
        
        document.body.appendChild(this.tooltip);
    }
    
    showModernTooltip(element, text, event) {
        if (!this.tooltip) return;
        
        this.tooltip.innerHTML = text + `
            <div style="position: absolute; top: -6px; left: 50%; transform: translateX(-50%) rotate(45deg); width: 12px; height: 12px; background: #f8f9fa; border: 1px solid #e9ecef; border-bottom: none; border-right: none;"></div>
        `;
        
        // Position tooltip above the element
        const rect = element.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 12;
        
        // Keep tooltip in viewport
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 12;
        }
        
        this.tooltip.style.left = left + 'px';
        this.tooltip.style.top = top + 'px';
        this.tooltip.style.opacity = '1';
        this.tooltip.style.transform = 'translateY(0)';
    }
    
    hideModernTooltip() {
        if (!this.tooltip) return;
        
        this.tooltip.style.opacity = '0';
        this.tooltip.style.transform = 'translateY(10px)';
    }

    createFaithCardsModal() {
        // Remove existing modal if it exists
        const existingModal = document.getElementById('faith-cards-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
        <!-- Faith Cards Modal -->
        <div class="modal fade" id="faith-cards-modal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 20px;">
                    <div class="modal-header" style="border: none; padding: 30px 30px 0;">
                        <div style="width: 100%;">
                            <h3 style="color: white; font-family: Inter, sans-serif; font-weight: bold; text-align: center; margin: 0;">
                                🌟 GABEFYED 🌟
                            </h3>
                            <p style="color: rgba(255,255,255,0.9); text-align: center; margin: 10px 0 0; font-size: 16px;">
                                "Sundays just became everyday fun"
                            </p>
                        </div>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" style="padding: 20px 30px 30px;">
                        
                        <!-- Cards Grid -->
                        <div class="row g-3" id="faith-cards-grid">
                            
                            <!-- Card 1: Who's in Charge? -->
                            <div class="col-md-6 col-lg-4">
                                <div class="faith-card" data-card="whos-in-charge" onclick="faithCards.openCard('whos-in-charge')" style="background: white; border-radius: 16px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'">
                                    <div style="width: 60px; height: 60px; background: #FFF2E5; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 28px;">
                                        🤔
                                    </div>
                                    <h5 style="color: #2D3748; font-family: Inter, sans-serif; font-weight: bold; margin-bottom: 8px;">Who's in Charge?</h5>
                                    <p style="color: #718096; font-size: 14px; margin-bottom: 15px;">Who's leading you today?</p>
                                    <div class="daily-status" id="status-whos-in-charge" style="background: #E2E8F0; color: #4A5568; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                                        🌱 Ready to Play
                                    </div>
                                </div>
                            </div>

                            <!-- Card 2: Broken Compass -->
                            <div class="col-md-6 col-lg-4">
                                <div class="faith-card" data-card="broken-compass" onclick="faithCards.openCard('broken-compass')" style="background: white; border-radius: 16px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'">
                                    <div style="width: 60px; height: 60px; background: #E6F3FF; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 28px;">
                                        🧭
                                    </div>
                                    <h5 style="color: #2D3748; font-family: Inter, sans-serif; font-weight: bold; margin-bottom: 8px;">Broken Compass</h5>
                                    <p style="color: #718096; font-size: 14px; margin-bottom: 15px;">Find what's true</p>
                                    <div class="daily-status" id="status-broken-compass" style="background: #E2E8F0; color: #4A5568; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                                        🎯 Ready to Quiz
                                    </div>
                                </div>
                            </div>

                            <!-- Card 3: Unlocked: The Holy Spirit -->
                            <div class="col-md-6 col-lg-4">
                                <div class="faith-card" data-card="holy-spirit" onclick="faithCards.openCard('holy-spirit')" style="background: white; border-radius: 16px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'">
                                    <div style="width: 60px; height: 60px; background: #E8F5E8; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 28px;">
                                        🔓
                                    </div>
                                    <h5 style="color: #2D3748; font-family: Inter, sans-serif; font-weight: bold; margin-bottom: 8px;">Unlocked: The Holy Spirit</h5>
                                    <p style="color: #718096; font-size: 14px; margin-bottom: 15px;">Receive the Helper</p>
                                    <div class="daily-status" id="status-holy-spirit" style="background: #E2E8F0; color: #4A5568; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                                        🍇 Grow Fruit
                                    </div>
                                </div>
                            </div>

                            <!-- Card 4: The Rescue Mission -->
                            <div class="col-md-6 col-lg-4">
                                <div class="faith-card" data-card="rescue-mission" onclick="faithCards.openCard('rescue-mission')" style="background: white; border-radius: 16px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'">
                                    <div style="width: 60px; height: 60px; background: #FFF8E1; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 28px;">
                                        ☁️
                                    </div>
                                    <h5 style="color: #2D3748; font-family: Inter, sans-serif; font-weight: bold; margin-bottom: 8px;">The Rescue Mission</h5>
                                    <p style="color: #718096; font-size: 14px; margin-bottom: 15px;">Understand salvation</p>
                                    <div class="daily-status" id="status-rescue-mission" style="background: #E2E8F0; color: #4A5568; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                                        🐑 Begin Journey
                                    </div>
                                </div>
                            </div>

                            <!-- Card 5: God Promised Me -->
                            <div class="col-md-6 col-lg-4">
                                <div class="faith-card" data-card="god-promised" onclick="faithCards.openCard('god-promised')" style="background: white; border-radius: 16px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'">
                                    <div style="width: 60px; height: 60px; background: #F0FFF4; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 28px;">
                                        🐑
                                    </div>
                                    <h5 style="color: #2D3748; font-family: Inter, sans-serif; font-weight: bold; margin-bottom: 8px;">God Promised Me</h5>
                                    <p style="color: #718096; font-size: 14px; margin-bottom: 15px;">See God's promises</p>
                                    <div class="daily-status" id="status-god-promised" style="background: #E2E8F0; color: #4A5568; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                                        💝 Find Promise
                                    </div>
                                </div>
                            </div>

                            <!-- Card 6: Ask Me Anything -->
                            <div class="col-md-6 col-lg-4">
                                <div class="faith-card" data-card="ask-anything" onclick="faithCards.openCard('ask-anything')" style="background: white; border-radius: 16px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'">
                                    <div style="width: 60px; height: 60px; background: #F0F4FF; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 28px;">
                                        😇
                                    </div>
                                    <h5 style="color: #2D3748; font-family: Inter, sans-serif; font-weight: bold; margin-bottom: 8px;">Ask Me Anything</h5>
                                    <p style="color: #718096; font-size: 14px; margin-bottom: 15px;">Let's talk about life</p>
                                    <div class="daily-status" id="status-ask-anything" style="background: #E2E8F0; color: #4A5568; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                                        💬 Always Open
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- My Garden Progress -->
                        <div class="row mt-4">
                            <div class="col-12">
                                <div style="background: rgba(255,255,255,0.2); border-radius: 15px; padding: 20px; text-align: center;">
                                    <h5 style="color: white; font-family: Inter, sans-serif; font-weight: bold; margin-bottom: 15px;">🌱 My Garden</h5>
                                    <div class="row">
                                        <div class="col-4">
                                            <div style="color: white; font-size: 24px; font-weight: bold;"><span id="garden-seeds">0</span></div>
                                            <div style="color: rgba(255,255,255,0.8); font-size: 12px;">Seeds Planted</div>
                                        </div>
                                        <div class="col-4">
                                            <div style="color: white; font-size: 24px; font-weight: bold;"><span id="garden-growth">0</span></div>
                                            <div style="color: rgba(255,255,255,0.8); font-size: 12px;">Days Growing</div>
                                        </div>
                                        <div class="col-4">
                                            <div style="color: white; font-size: 24px; font-weight: bold;"><span id="garden-fruit">0</span></div>
                                            <div style="color: rgba(255,255,255,0.8); font-size: 12px;">Fruit Gathered</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    bindCardEvents() {
        console.log('Faith cards system ready to replace cards in original panel');
        
        // Find the spiritual features button and add event listener
        const spiritualFeaturesBtn = document.getElementById('spiritual-features-btn');
        if (spiritualFeaturesBtn) {
            console.log('Spiritual features button found, adding event listener');
            
            // Remove any existing listeners to avoid duplicates
            const newBtn = spiritualFeaturesBtn.cloneNode(true);
            spiritualFeaturesBtn.parentNode.replaceChild(newBtn, spiritualFeaturesBtn);
            
            // Add our custom event listener
            newBtn.addEventListener('click', (e) => {
                console.log('Spiritual features button clicked');
                e.preventDefault();
                e.stopPropagation();
                
                // Don't show separate banner - integrate into the spiritual features panel
                
                // Let the original toggle happen first, then replace cards
                if (window.gabeApp && window.gabeApp.toggleSpiritualFeatures) {
                    window.gabeApp.toggleSpiritualFeatures();
                }
                
                setTimeout(() => {
                    this.toggleFaithCards();
                    this.updateCardStatuses();
                }, 200);
            });
        }
    }
    
    replaceOriginalCards() {
        // Replace the old cards in the existing features grid with new Faith in Action cards
        const featuresGrid = document.getElementById('faith-cards-container');
        if (featuresGrid) {
            featuresGrid.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; width: 100%;">
                    <!-- Who's in Charge Card -->
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div onclick="faithCards.openCard('whos-in-charge')" class="modern-card" style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 20px; cursor: pointer; transition: all 0.3s ease; width: 100%; height: 240px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: relative; overflow: hidden;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'; this.style.transform='translateY(0)'">
                            <!-- Status indicator -->
                            <div id="status-whos-in-charge" style="position: absolute; top: 12px; right: 12px; background: #E2E8F0; color: #4A5568; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">🌱 Ready to Play</div>
                            <div style="padding: 24px; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                                <div style="width: 80px; height: 80px; margin: 0 auto 16px; border-radius: 50%; background: linear-gradient(135deg, #FFA726 0%, #FF7043 100%); display: flex; align-items: center; justify-content: center;" onmouseover="faithCards.showModernTooltip(this, 'Jesus is the true leader of your life — this card shows why letting Him lead changes peace.', event)" onmouseout="faithCards.hideModernTooltip()">
                                    <div style="font-size: 36px;">😤</div>
                                </div>
                                <h4 style="font-family: Inter, sans-serif; font-weight: bold; font-size: 18px; color: #111827; margin: 0 0 8px 0;">Who's in Charge?</h4>
                                <p style="font-family: Inter, sans-serif; font-size: 14px; color: #6B7280; margin: 0; line-height: 1.4;">Who's leading you today?</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Broken Compass Card -->
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div onclick="faithCards.openCard('broken-compass')" class="modern-card" style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 20px; cursor: pointer; transition: all 0.3s ease; width: 100%; height: 240px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: relative; overflow: hidden;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'; this.style.transform='translateY(0)'">
                            <!-- Status indicator -->
                            <div id="status-broken-compass" style="position: absolute; top: 12px; right: 12px; background: #E2E8F0; color: #4A5568; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">🎯 Ready to Quiz</div>
                            <div style="padding: 24px; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                                <div style="width: 80px; height: 80px; margin: 0 auto 16px; border-radius: 50%; background: linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%); display: flex; align-items: center; justify-content: center;" onmouseover="faithCards.showModernTooltip(this, 'Not all truth is true. Learn to spot fake teachings and follow what God actually says.', event)" onmouseout="faithCards.hideModernTooltip()">
                                    <div style="font-size: 36px;">🧭</div>
                                </div>
                                <h4 style="font-family: Inter, sans-serif; font-weight: bold; font-size: 18px; color: #111827; margin: 0 0 8px 0;">Broken Compass</h4>
                                <p style="font-family: Inter, sans-serif; font-size: 14px; color: #6B7280; margin: 0; line-height: 1.4;">Find what's true</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Unlocked: The Holy Spirit Card -->
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div onclick="faithCards.openCard('holy-spirit')" class="modern-card" style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 20px; cursor: pointer; transition: all 0.3s ease; width: 100%; height: 240px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: relative; overflow: hidden;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'; this.style.transform='translateY(0)'">
                            <!-- Status indicator -->
                            <div id="status-holy-spirit" style="position: absolute; top: 12px; right: 12px; background: #E2E8F0; color: #4A5568; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">🔓 Ready to Grow</div>
                            <div style="padding: 24px; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                                <div style="width: 80px; height: 80px; margin: 0 auto 16px; border-radius: 50%; background: linear-gradient(135deg, #FFD54F 0%, #FFC107 100%); display: flex; align-items: center; justify-content: center;" onmouseover="faithCards.showModernTooltip(this, 'The Holy Spirit is your Helper — discover who He is and how He strengthens your walk.', event)" onmouseout="faithCards.hideModernTooltip()">
                                    <div style="font-size: 36px;">🔓</div>
                                </div>
                                <h4 style="font-family: Inter, sans-serif; font-weight: bold; font-size: 16px; color: #111827; margin: 0 0 8px 0;">Unlocked: The Holy Spirit</h4>
                                <p style="font-family: Inter, sans-serif; font-size: 14px; color: #6B7280; margin: 0; line-height: 1.4;">Receive the Helper</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- The Rescue Mission Card -->
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div onclick="faithCards.openCard('rescue-mission')" class="modern-card" style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 20px; cursor: pointer; transition: all 0.3s ease; width: 100%; height: 240px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: relative; overflow: hidden;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'; this.style.transform='translateY(0)'">
                            <!-- Status indicator -->
                            <div id="status-rescue-mission" style="position: absolute; top: 12px; right: 12px; background: #E2E8F0; color: #4A5568; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">🚁 Ready to Start</div>
                            <div style="padding: 24px; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                                <div style="width: 80px; height: 80px; margin: 0 auto 16px; border-radius: 50%; background: linear-gradient(135deg, #66BB6A 0%, #43A047 100%); display: flex; align-items: center; justify-content: center;" onmouseover="faithCards.showModernTooltip(this, 'You are the lost sheep — and Jesus came to find you. This is what salvation really means.', event)" onmouseout="faithCards.hideModernTooltip()">
                                    <div style="font-size: 36px; color: white;">🚁</div>
                                </div>
                                <h4 style="font-family: Inter, sans-serif; font-weight: bold; font-size: 18px; color: #111827; margin: 0 0 8px 0;">The Rescue Mission</h4>
                                <p style="font-family: Inter, sans-serif; font-size: 14px; color: #6B7280; margin: 0; line-height: 1.4;">Understand salvation</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- God Promised Me Card -->
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div onclick="faithCards.openCard('god-promised')" class="modern-card" style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 20px; cursor: pointer; transition: all 0.3s ease; width: 100%; height: 240px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: relative; overflow: hidden;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'; this.style.transform='translateY(0)'">
                            <!-- Status indicator with count -->
                            <div id="status-god-promised-me" style="position: absolute; top: 12px; right: 12px; background: #E2E8F0; color: #4A5568; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">📜 Ready to Claim</div>
                            <div style="padding: 24px; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                                <div style="width: 80px; height: 80px; margin: 0 auto 16px; border-radius: 50%; background: linear-gradient(135deg, #AB47BC 0%, #8E24AA 100%); display: flex; align-items: center; justify-content: center;" onmouseover="faithCards.showModernTooltip(this, 'God\\'s Word holds promises for your every mood. Feel lonely, afraid, confused? He speaks.', event)" onmouseout="faithCards.hideModernTooltip()">
                                    <div style="font-size: 36px; color: white;">📜</div>
                                </div>
                                <h4 style="font-family: Inter, sans-serif; font-weight: bold; font-size: 18px; color: #111827; margin: 0 0 8px 0;">God Promised Me</h4>
                                <p style="font-family: Inter, sans-serif; font-size: 14px; color: #6B7280; margin: 0; line-height: 1.4;">Claim divine promises</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- How to Pray Card -->
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div onclick="faithCards.openCard('how-to-pray')" class="modern-card" style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 20px; cursor: pointer; transition: all 0.3s ease; width: 100%; height: 240px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: relative; overflow: hidden;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'; this.style.transform='translateY(0)'">
                            <!-- Status indicator -->
                            <div id="status-how-to-pray" style="position: absolute; top: 12px; right: 12px; background: #E2E8F0; color: #4A5568; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">🙏 Ready to Learn</div>
                            <div style="padding: 24px; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                                <div style="width: 80px; height: 80px; margin: 0 auto 16px; border-radius: 50%; background: linear-gradient(135deg, #EC407A 0%, #E91E63 100%); display: flex; align-items: center; justify-content: center;" onmouseover="faithCards.showModernTooltip(this, 'Prayer isn\\'t fancy — it\\'s talking to God like a friend. Learn how to start simply.', event)" onmouseout="faithCards.hideModernTooltip()">
                                    <div style="font-size: 36px; color: white;">🙏</div>
                                </div>
                                <h4 style="font-family: Inter, sans-serif; font-weight: bold; font-size: 18px; color: #111827; margin: 0 0 8px 0;">How to Pray</h4>
                                <p style="font-family: Inter, sans-serif; font-size: 14px; color: #6B7280; margin: 0; line-height: 1.4;">Learn simple prayer</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Update card statuses after replacement
            setTimeout(() => {
                this.updateCardStatuses();
            }, 100);
        }
    }

    openFaithCards() {
        // Don't show separate banner - just open the integrated spiritual features panel
        if (window.gabeApp && window.gabeApp.toggleSpiritualFeatures) {
            window.gabeApp.toggleSpiritualFeatures();
        }
    }

    openCard(cardType) {
        console.log(`Opening card: ${cardType}`);
        
        switch(cardType) {
            case 'whos-in-charge':
                this.openWhosInCharge();
                break;
            case 'broken-compass':
                this.openBrokenCompass();
                break;
            case 'holy-spirit':
                this.openHolySpirit();
                break;
            case 'rescue-mission':
                this.openRescueMission();
                break;
            case 'god-promised':
                this.openGodPromised();
                break;
            case 'how-to-pray':
                this.openHowToPray();
                break;
        }
    }

    openWhosInCharge() {
        const scenarios = [
            {
                situation: "Your friend just said something that really hurt your feelings. What do you do?",
                options: [
                    { text: "Snap back with something even meaner", outcome: "flesh", result: "You felt powerful for a moment, but now there's distance between you two.", lesson: "When flesh leads, relationships suffer." },
                    { text: "Walk away and cool down first", outcome: "spirit", result: "Taking space helped you think clearly about how to respond with love.", lesson: "The Spirit gives wisdom to handle hurt with grace." },
                    { text: "Pretend it didn't hurt", outcome: "flesh", result: "Bottling it up didn't make the hurt go away, and now you're carrying resentment.", lesson: "Denial is flesh trying to protect itself." }
                ],
                verse: "In your anger do not sin; when you are on your beds, search your hearts and be silent. - Psalm 4:4",
                truth: "God wants to lead your emotions, not the other way around."
            },
            {
                situation: "You're stressed about money and bills are piling up. Your first instinct is to...",
                options: [
                    { text: "Panic and lose sleep worrying about it", outcome: "flesh", result: "The worry consumed your peace but didn't solve anything.", lesson: "Fear shows the flesh is in control." },
                    { text: "Pray about it and make a practical plan", outcome: "spirit", result: "You found peace in God's provision and wisdom in taking action.", lesson: "The Spirit brings peace AND practical wisdom." },
                    { text: "Ignore it and hope it goes away", outcome: "flesh", result: "Avoiding the problem only made it bigger and more stressful.", lesson: "Avoidance is flesh refusing to trust God with reality." }
                ],
                verse: "Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own. - Matthew 6:34",
                truth: "God's peace guides better than panic or denial."
            },
            {
                situation: "Someone cuts you off in traffic and you're already running late. You...",
                options: [
                    { text: "Honk aggressively and tailgate them", outcome: "flesh", result: "Your anger escalated the situation and ruined your mood for hours.", lesson: "Flesh reacts with immediate anger." },
                    { text: "Take a deep breath and pray for patience", outcome: "spirit", result: "You arrived calmer and handled your day much better.", lesson: "The Spirit transforms our reactions into responses." },
                    { text: "Curse them out (even if windows are up)", outcome: "flesh", result: "The anger poisoned your heart even though they never heard you.", lesson: "Flesh poisons us from the inside." }
                ],
                verse: "Be slow to anger, for the anger of man does not produce the righteousness of God. - James 1:19-20",
                truth: "Spirit-led responses bring peace; flesh-led reactions bring chaos."
            }
        ];

        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        let currentScenario = randomScenario;
        let gameState = 'scenario';
        
        const modalHTML = `
        <div id="modal-backdrop" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 999;" onclick="window.closeGameModal()"></div>
        <div id="whos-in-charge-modal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: calc(100% - 20px); max-width: 500px; min-height: 300px; max-height: 90vh; overflow-y: auto; background: linear-gradient(135deg, #FFA726 0%, #FF7043 100%); color: white; border-radius: 18px; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3); padding: 20px; z-index: 1000; box-sizing: border-box; margin: 10px;">
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; align-items: center; margin-bottom: 20px;">
                😤 Who's in Charge?
                <div onclick="window.closeGameModal()" style="cursor: pointer; font-size: 22px; background: rgba(255,255,255,0.2); border-radius: 50%; width: 28px; height: 28px; line-height: 28px; text-align: center;">✖</div>
            </div>
            
            <div style="background: white; border-radius: 15px; padding: 25px; margin-bottom: 20px;">
                <h5 style="color: #2D3748; font-weight: bold; margin-bottom: 15px;">Today's Choice:</h5>
                <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">${randomScenario.situation}</p>
            </div>

            <div id="choice-options">
                <div class="choice-btn" onclick="window.gameChoice(0)" style="background: rgba(255,255,255,0.9); border-radius: 12px; padding: 20px; margin-bottom: 15px; cursor: pointer; transition: all 0.3s ease; color: #2D3748; font-weight: 600;" onmouseover="this.style.background='white'" onmouseout="this.style.background='rgba(255,255,255,0.9)'">
                    ${randomScenario.options[0].text}
                </div>
                <div class="choice-btn" onclick="window.gameChoice(1)" style="background: rgba(255,255,255,0.9); border-radius: 12px; padding: 20px; margin-bottom: 15px; cursor: pointer; transition: all 0.3s ease; color: #2D3748; font-weight: 600;" onmouseover="this.style.background='white'" onmouseout="this.style.background='rgba(255,255,255,0.9)'">
                    ${randomScenario.options[1].text}
                </div>
                <div class="choice-btn" onclick="window.gameChoice(2)" style="background: rgba(255,255,255,0.9); border-radius: 12px; padding: 20px; margin-bottom: 15px; cursor: pointer; transition: all 0.3s ease; color: #2D3748; font-weight: 600;" onmouseover="this.style.background='white'" onmouseout="this.style.background='rgba(255,255,255,0.9)'">
                    ${randomScenario.options[2].text}
                </div>
            </div>
            
            <div id="choice-result" style="display: none;">
                <div style="background: rgba(255,255,255,0.1); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                    <h6 style="color: white; font-weight: bold; margin-bottom: 15px;">What Happened:</h6>
                    <p id="result-text" style="color: rgba(255,255,255,0.9); line-height: 1.6; margin-bottom: 15px;"></p>
                    <p id="lesson-text" style="color: rgba(255,255,255,0.8); font-weight: 600; font-style: italic;"></p>
                </div>
                
                <div style="background: rgba(255,255,255,0.1); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                    <h6 style="color: white; font-weight: bold; margin-bottom: 15px;">📖 Today's Truth:</h6>
                    <p id="verse-text" style="color: rgba(255,255,255,0.9); font-style: italic; line-height: 1.6; margin-bottom: 15px;"></p>
                    <p id="truth-text" style="color: rgba(255,255,255,0.8); font-weight: 600;"></p>
                </div>

                <div style="text-align: center;">
                    <button onclick="window.completeGame()" style="background: #48BB78; color: white; border: none; padding: 15px 30px; border-radius: 25px; font-weight: bold; cursor: pointer; transition: all 0.2s; font-size: 16px;" onmouseover="this.style.background='#38A169'" onmouseout="this.style.background='#48BB78'">
                        🌱 Plant This Seed (+10 XP)
                    </button>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Store scenario data for the choice handler
        this.currentScenario = randomScenario;
        
        // Create global functions for onclick handlers (following working example pattern)
        const gameInstance = this;
        
        window.gameChoice = function(choiceIndex) {
            console.log('Choice clicked:', choiceIndex);
            const scenario = gameInstance.currentScenario;
            const selectedOption = scenario.options[choiceIndex];
            
            // Populate the result elements
            document.getElementById('result-text').textContent = selectedOption.result;
            document.getElementById('lesson-text').textContent = selectedOption.lesson;
            document.getElementById('verse-text').textContent = '"' + scenario.verse + '"';
            document.getElementById('truth-text').textContent = scenario.truth;
            
            // Hide choice options and show result
            document.getElementById('choice-options').style.display = 'none';
            document.getElementById('choice-result').style.display = 'block';
        };
        
        window.completeGame = function() {
            console.log('Complete game clicked - awarding XP');
            if (gameInstance && gameInstance.completeChoice) {
                gameInstance.completeChoice();
            }
            window.closeGameModal();
        };
        
        window.closeGameModal = function() {
            console.log('Close button clicked');
            document.getElementById('whos-in-charge-modal').style.display = 'none';
            document.getElementById('modal-backdrop').style.display = 'none';
        };
        
        // Show the modal and backdrop using simple CSS
        document.getElementById('modal-backdrop').style.display = 'block';
        document.getElementById('whos-in-charge-modal').style.display = 'block';
    }

    handleChoice(choiceIndex) {
        console.log('handleChoice called with index:', choiceIndex);
        this.makeChoice(choiceIndex);
    }
    
    completeChoice() {
        console.log('completeChoice called');
        this.completeCard('whos-in-charge', 10);
    }

    makeChoice(choiceIndex) {
        const choice = this.currentScenario.options[choiceIndex];
        
        // Hide options
        document.getElementById('choice-options').style.display = 'none';
        
        // Show result
        document.getElementById('choice-result').style.display = 'block';
        document.getElementById('result-text').textContent = choice.result;
    }

    openBrokenCompass() {
        const questions = [
            {
                question: "True or False: All roads lead to God, so it doesn't matter what you believe.",
                correct: false,
                explanation: "Jesus said 'I am the way, the truth, and the life. No one comes to the Father except through me.' (John 14:6)",
                truth: "There is one way to God - through Jesus Christ."
            },
            {
                question: "True or False: God helps those who help themselves.",
                correct: false,
                explanation: "This popular saying isn't in the Bible! God actually helps those who can't help themselves.",
                truth: "God's grace comes to the helpless, not the self-sufficient."
            },
            {
                question: "True or False: Prayer changes things because God changes His mind when we ask.",
                correct: false,
                explanation: "Prayer doesn't change God's mind - it changes our hearts and aligns us with His will.",
                truth: "Prayer transforms us, not God."
            }
        ];

        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        this.currentQuestion = randomQuestion;
        
        const modalHTML = `
        <div id="compass-backdrop" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 999;" onclick="window.closeCompassModal()"></div>
        <div id="broken-compass-modal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: calc(100% - 20px); max-width: 500px; min-height: 300px; max-height: 90vh; overflow-y: auto; background: linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%); color: white; border-radius: 18px; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3); padding: 20px; z-index: 1000; box-sizing: border-box; margin: 10px;">
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; align-items: center; margin-bottom: 20px;">
                🧭 Broken Compass
                <div onclick="window.closeCompassModal()" style="cursor: pointer; font-size: 22px; background: rgba(255,255,255,0.2); border-radius: 50%; width: 28px; height: 28px; line-height: 28px; text-align: center;">✖</div>
            </div>
            
            <div style="background: white; border-radius: 15px; padding: 25px; margin-bottom: 20px;">
                <h5 style="color: #2D3748; font-weight: bold; margin-bottom: 15px;">Truth Check:</h5>
                <p style="color: #4A5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">${randomQuestion.question}</p>
                
                <div id="compass-answer-options">
                    <div onclick="window.compassAnswer(true)" style="background: #E6FFFA; border: 2px solid #4FD1C7; border-radius: 12px; padding: 20px; margin-bottom: 15px; cursor: pointer; transition: all 0.3s ease; text-align: center;">
                        <p style="color: #234E52; font-weight: 600; margin: 0; font-size: 18px;">✓ TRUE</p>
                    </div>
                    <div onclick="window.compassAnswer(false)" style="background: #FED7D7; border: 2px solid #FC8181; border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.3s ease; text-align: center;">
                        <p style="color: #742A2A; font-weight: 600; margin: 0; font-size: 18px;">✗ FALSE</p>
                    </div>
                </div>

                <div id="compass-question-result" style="display: none;">
                    <div style="background: rgba(72, 187, 120, 0.1); border-radius: 15px; padding: 25px; margin-bottom: 20px;">
                        <h6 id="compass-result-status" style="color: #2F855A; font-weight: bold; margin-bottom: 15px;"></h6>
                        <p id="compass-explanation" style="color: #2D3748; line-height: 1.6; margin-bottom: 15px;"></p>
                        <p id="compass-truth" style="color: #2F855A; font-weight: 600; font-style: italic;"></p>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="window.completeCompass()" style="background: #4299E1; color: white; border: none; padding: 15px 30px; border-radius: 25px; font-weight: bold; cursor: pointer; font-size: 16px;">
                            🧭 Truth Discovered (+15 XP)
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Create global functions for onclick handlers
        const gameInstance = this;
        
        window.compassAnswer = function(answer) {
            const question = gameInstance.currentQuestion;
            const isCorrect = answer === question.correct;
            
            // Hide options and show result
            document.getElementById('compass-answer-options').style.display = 'none';
            document.getElementById('compass-question-result').style.display = 'block';
            
            // Populate result
            document.getElementById('compass-result-status').textContent = isCorrect ? '✅ Correct!' : '❌ Not quite right, but great try!';
            document.getElementById('compass-explanation').textContent = question.explanation;
            document.getElementById('compass-truth').textContent = `"${question.truth}"`;
        };
        
        window.completeCompass = function() {
            if (gameInstance && gameInstance.completeCard) {
                gameInstance.completeCard('broken-compass', 15);
            }
            window.closeCompassModal();
        };
        
        window.closeCompassModal = function() {
            document.getElementById('broken-compass-modal').style.display = 'none';
            document.getElementById('compass-backdrop').style.display = 'none';
        };
        
        // Show the modal and backdrop
        document.getElementById('compass-backdrop').style.display = 'block';
        document.getElementById('broken-compass-modal').style.display = 'block';
    }

    openHolySpirit() {
        const fruits = [
            { 
                name: 'Joy', 
                description: 'Deep contentment regardless of circumstances — not based on how you feel, but on who God is',
                challenge: 'Find joy in a difficult situation today',
                example: 'Smile through a tough moment, encourage someone when you feel low, or thank God when things go wrong',
                scripture: 'Galatians 5:22',
                verse: 'But the fruit of the Spirit is... joy',
                celebration: 'You chose joy today! That means the Spirit is growing in you. Joy isn\'t fake — it\'s faith. Keep walking!'
            },
            { 
                name: 'Peace', 
                description: 'Calm assurance in God\'s control — trusting Him when everything feels uncertain',
                challenge: 'Choose peace over worry in one situation',
                example: 'Take a deep breath instead of panicking, pray instead of stressing, or trust God with something you can\'t control',
                scripture: 'Galatians 5:22',
                verse: 'But the fruit of the Spirit is... peace',
                celebration: 'You chose peace today! The Spirit is calming your heart. Peace comes from trusting God, not controlling everything.'
            },
            { 
                name: 'Patience', 
                description: 'Waiting on God\'s timing with trust — not rushing ahead but letting Him lead',
                challenge: 'Be patient with someone who frustrates you',
                example: 'Listen without interrupting, wait without complaining, or give someone grace when they mess up',
                scripture: 'Galatians 5:22',
                verse: 'But the fruit of the Spirit is... patience',
                celebration: 'You showed patience today! The Spirit is teaching you God\'s timing. Patience shows love in action.'
            }
        ];

        const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
        this.currentFruit = randomFruit;
        
        const modalHTML = `
        <div id="spirit-backdrop" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 999;" onclick="window.closeSpiritModal()"></div>
        <div id="holy-spirit-modal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: calc(100% - 20px); max-width: 500px; background: linear-gradient(135deg, #FFD54F 0%, #FFC107 100%); color: white; border-radius: 18px; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3); padding: 20px; z-index: 1000; box-sizing: border-box; margin: 10px; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; align-items: center; margin-bottom: 20px;">
                Holy Spirit: ${randomFruit.name}
                <div onclick="window.closeSpiritModal()" style="cursor: pointer; font-size: 22px; background: rgba(255,255,255,0.2); border-radius: 50%; width: 28px; height: 28px; line-height: 28px; text-align: center;">✖</div>
            </div>
            
            <div style="background: white; border-radius: 15px; padding: 25px;">
                <!-- Step 1: Introduce the Fruit -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <h4 style="color: #2D3748; font-weight: bold; margin-bottom: 10px;">Today you're unlocking a Fruit of the Spirit:</h4>
                    <h3 style="color: #D69E2E; font-weight: bold; margin: 0; font-size: 28px;">${randomFruit.name}</h3>
                </div>
                
                <!-- Step 2: Define What It Means -->
                <div style="background: #F7FAFC; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <h6 style="color: #2D3748; font-weight: bold; margin-bottom: 10px;">What this means:</h6>
                    <p style="color: #4A5568; line-height: 1.6; margin: 0;">${randomFruit.description}</p>
                </div>
                
                <!-- Step 3: Give a Challenge -->
                <div style="background: #FFF5F5; border: 2px solid #FEB2B2; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <h6 style="color: #C53030; font-weight: bold; margin-bottom: 10px;">Growth Challenge:</h6>
                    <p style="color: #742A2A; font-weight: 600; margin-bottom: 10px;">${randomFruit.challenge}</p>
                    <p style="color: #742A2A; font-size: 14px; font-style: italic; margin: 0;">Example: ${randomFruit.example}</p>
                </div>
                
                <!-- Step 4: Link to Scripture -->
                <div style="background: #E6FFFA; border: 2px solid #4FD1C7; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <p style="color: #234E52; font-style: italic; font-size: 16px; line-height: 1.6; margin-bottom: 10px;">"${randomFruit.verse}"</p>
                    <p style="color: #2F855A; font-weight: 600; margin: 0; text-align: right;">- ${randomFruit.scripture}</p>
                </div>
                
                <!-- Step 5: Invite Reflection (Optional) -->
                <div style="background: #F8F9FA; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <h6 style="color: #495057; font-weight: bold; margin-bottom: 10px;">Reflection (Optional):</h6>
                    <p style="color: #6C757D; font-size: 14px; margin-bottom: 15px;">Write or think about a time today when you chose ${randomFruit.name.toLowerCase()} even though it was hard.</p>
                    <textarea id="spirit-reflection-text" placeholder="What did you do differently? How did God help you?" style="width: 100%; height: 60px; border: 1px solid #CED4DA; border-radius: 8px; padding: 12px; font-family: Inter, sans-serif; font-size: 14px; resize: vertical; box-sizing: border-box;" maxlength="150"></textarea>
                </div>
                
                <div style="text-align: center;">
                    <button onclick="window.acceptSpiritChallenge()" style="background: #28A745; color: white; border: none; padding: 15px 30px; border-radius: 25px; font-weight: bold; cursor: pointer; font-size: 16px;">
                        Accept Challenge (+20 XP)
                    </button>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Create global functions
        const gameInstance = this;
        
        window.acceptSpiritChallenge = function() {
            if (gameInstance && gameInstance.completeCard) {
                gameInstance.completeCard('holy-spirit', 20);
            }
            
            // Step 6 & 7: Celebrate and Award XP
            setTimeout(() => {
                gameInstance.showCustomAlert(`✅ ${gameInstance.currentFruit.celebration}`);
            }, 100);
            
            window.closeSpiritModal();
        };
        
        window.closeSpiritModal = function() {
            document.getElementById('holy-spirit-modal').style.display = 'none';
            document.getElementById('spirit-backdrop').style.display = 'none';
        };
        
        // Show modal
        document.getElementById('spirit-backdrop').style.display = 'block';
        document.getElementById('holy-spirit-modal').style.display = 'block';
    }

    openRescueMission() {
        const stories = [
            {
                title: "The Lost Sheep",
                scenario: "You've wandered far from the Good Shepherd. You're lost, scared, and darkness is falling. Suddenly, you hear a familiar voice calling your name...",
                choices: [
                    { text: "Run toward the voice immediately", outcome: "faith", result: "You ran straight into the Shepherd's arms. He carried you home safely." },
                    { text: "Hide because you're ashamed", outcome: "shame", result: "The Shepherd found you anyway and gently said 'I've been looking for you.'" },
                    { text: "Try to find your own way back first", outcome: "pride", result: "You got more lost, but the Shepherd never stopped calling until you answered." }
                ],
                truth: "God never stops pursuing you, no matter how far you've wandered.",
                verse: "I am the good shepherd. The good shepherd lays down his life for the sheep. - John 10:11"
            }
        ];

        const story = stories[0];
        this.currentStory = story;
        
        const modalHTML = `
        <div id="rescue-backdrop" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 999;" onclick="window.closeRescueModal()"></div>
        <div id="rescue-mission-modal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: calc(100% - 20px); max-width: 500px; background: linear-gradient(135deg, #66BB6A 0%, #43A047 100%); color: white; border-radius: 18px; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3); padding: 20px; z-index: 1000; box-sizing: border-box; margin: 10px; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; align-items: center; margin-bottom: 20px;">
                🚁 The Rescue Mission
                <div onclick="window.closeRescueModal()" style="cursor: pointer; font-size: 22px; background: rgba(255,255,255,0.2); border-radius: 50%; width: 28px; height: 28px; line-height: 28px; text-align: center;">✖</div>
            </div>
            
            <div style="background: white; border-radius: 15px; padding: 25px;">
                <h5 style="color: #2D3748; font-weight: bold; margin-bottom: 15px;">${story.title}</h5>
                <p style="color: #4A5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">${story.scenario}</p>
                
                <h6 style="color: #2D3748; font-weight: bold; margin-bottom: 15px;">What do you do?</h6>
                
                <div id="rescue-story-choices">
                    ${story.choices.map((choice, index) => `
                        <div onclick="window.makeRescueChoice(${index})" style="background: #F7FAFC; border: 2px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 15px; cursor: pointer; transition: all 0.3s ease;">
                            <p style="color: #2D3748; font-weight: 600; margin: 0;">${choice.text}</p>
                        </div>
                    `).join('')}
                </div>

                <div id="rescue-story-result" style="display: none;">
                    <div style="background: rgba(72, 187, 120, 0.1); border-radius: 15px; padding: 25px; margin-bottom: 20px;">
                        <h6 style="color: #2F855A; font-weight: bold; margin-bottom: 15px;">What Happened:</h6>
                        <p id="rescue-story-outcome" style="color: #2D3748; line-height: 1.6; margin-bottom: 15px;"></p>
                        <p style="color: #2F855A; font-weight: 600; font-style: italic;">"${story.verse}"</p>
                        <p style="color: #1A202C; font-weight: 600; margin-top: 15px;">${story.truth}</p>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="window.completeRescue()" style="background: #48BB78; color: white; border: none; padding: 15px 30px; border-radius: 25px; font-weight: bold; cursor: pointer; font-size: 16px;">
                            🚁 Mission Complete (+25 XP)
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Create global functions
        const gameInstance = this;
        
        window.makeRescueChoice = function(choiceIndex) {
            const choice = gameInstance.currentStory.choices[choiceIndex];
            
            document.getElementById('rescue-story-choices').style.display = 'none';
            document.getElementById('rescue-story-result').style.display = 'block';
            document.getElementById('rescue-story-outcome').textContent = choice.result;
        };
        
        window.completeRescue = function() {
            if (gameInstance && gameInstance.completeCard) {
                gameInstance.completeCard('rescue-mission', 25);
            }
            window.closeRescueModal();
        };
        
        window.closeRescueModal = function() {
            document.getElementById('rescue-mission-modal').style.display = 'none';
            document.getElementById('rescue-backdrop').style.display = 'none';
        };
        
        // Show modal
        document.getElementById('rescue-backdrop').style.display = 'block';
        document.getElementById('rescue-mission-modal').style.display = 'block';
    }

    openGodPromised() {
        const promises = [
            {
                mood: "Anxious",
                promise: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
                reference: "John 14:27",
                prayer: "Lord, replace my anxiety with Your perfect peace. Help me trust in Your control over every situation."
            },
            {
                mood: "Lonely",
                promise: "Never will I leave you; never will I forsake you.",
                reference: "Hebrews 13:5",
                prayer: "Father, remind me that I'm never truly alone. You are always with me, even when I can't feel Your presence."
            },
            {
                mood: "Discouraged",
                promise: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
                reference: "Jeremiah 29:11",
                prayer: "God, help me see beyond my current struggles to the hope and future You have planned for me."
            }
        ];

        const randomPromise = promises[Math.floor(Math.random() * promises.length)];
        this.currentPromise = randomPromise;
        
        const modalHTML = `
        <div id="promise-backdrop" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 999;" onclick="window.closePromiseModal()"></div>
        <div id="god-promised-modal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: calc(100% - 20px); max-width: 500px; background: linear-gradient(135deg, #AB47BC 0%, #8E24AA 100%); color: white; border-radius: 18px; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3); padding: 20px; z-index: 1000; box-sizing: border-box; margin: 10px; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; align-items: center; margin-bottom: 20px;">
                📜 God Promised Me
                <div onclick="window.closePromiseModal()" style="cursor: pointer; font-size: 22px; background: rgba(255,255,255,0.2); border-radius: 50%; width: 28px; height: 28px; line-height: 28px; text-align: center;">✖</div>
            </div>
            
            <div style="background: white; border-radius: 15px; padding: 25px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h5 style="color: #2D3748; font-weight: bold;">When you feel ${randomPromise.mood.toLowerCase()}...</h5>
                </div>
                
                <div style="background: #F7FAFC; border-left: 4px solid #9F7AEA; border-radius: 0 12px 12px 0; padding: 20px; margin-bottom: 20px;">
                    <p style="color: #2D3748; font-size: 16px; line-height: 1.6; margin-bottom: 10px; font-style: italic;">"${randomPromise.promise}"</p>
                    <p style="color: #6B46C1; font-weight: 600; margin: 0; text-align: right;">- ${randomPromise.reference}</p>
                </div>
                
                <div style="background: #EDF2F7; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <h6 style="color: #2D3748; font-weight: bold; margin-bottom: 10px;">💬 Prayer for Today:</h6>
                    <p style="color: #4A5568; line-height: 1.6; margin: 0; font-style: italic;">${randomPromise.prayer}</p>
                </div>
                
                <div style="text-align: center;">
                    <button onclick="window.claimPromise()" style="background: #9F7AEA; color: white; border: none; padding: 15px 30px; border-radius: 25px; font-weight: bold; cursor: pointer; font-size: 16px;">
                        📜 Claim This Promise (+30 XP)
                    </button>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Create global functions
        const gameInstance = this;
        
        window.claimPromise = function() {
            if (gameInstance && gameInstance.completeCard) {
                gameInstance.completeCard('god-promised', 30);
            }
            window.closePromiseModal();
        };
        
        window.closePromiseModal = function() {
            document.getElementById('god-promised-modal').style.display = 'none';
            document.getElementById('promise-backdrop').style.display = 'none';
        };
        
        // Show modal
        document.getElementById('promise-backdrop').style.display = 'block';
        document.getElementById('god-promised-modal').style.display = 'block';
    }

    // Helper functions - these are now replaced by global window functions in each game

    openHowToPray() {
        const prayerMethods = [
            {
                title: "Simple Bible Prayer",
                description: "Easy 4-step prayer anyone can do",
                steps: [
                    "Find a Verse - Choose one verse from the Bible",
                    "Read it Slowly - Read it out loud or in your heart. Let the words sink in. Pause. Breathe.",
                    "Turn It into a Prayer - Say something personal to God about that verse",
                    "Ask God to Help You Believe It - Pray for God to make it real in your life"
                ],
                example: "Using Psalm 23:1 'The Lord is my shepherd' → 'Lord, be my Shepherd today. I feel lost — guide me please. Help me really believe that You're taking care of me.'"
            }
        ];

        const randomMethod = prayerMethods[Math.floor(Math.random() * prayerMethods.length)];
        
        const modalHTML = `
        <div id="prayer-backdrop" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 999;" onclick="window.closePrayerModal()"></div>
        <div id="how-to-pray-modal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: calc(100% - 20px); max-width: 500px; background: linear-gradient(135deg, #EC407A 0%, #E91E63 100%); color: white; border-radius: 18px; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3); padding: 20px; z-index: 1000; box-sizing: border-box; margin: 10px; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; align-items: center; margin-bottom: 20px;">
                🙏 How to Pray
                <div onclick="window.closePrayerModal()" style="cursor: pointer; font-size: 22px; background: rgba(255,255,255,0.2); border-radius: 50%; width: 28px; height: 28px; line-height: 28px; text-align: center;">✖</div>
            </div>
            
            <div style="background: white; border-radius: 15px; padding: 25px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h4 style="color: #2D3748; font-weight: bold; margin-bottom: 10px;">${randomMethod.title}</h4>
                    <p style="color: #6B7280; font-size: 14px; margin: 0;">${randomMethod.description}</p>
                </div>
                
                <div style="background: #F7FAFC; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <h6 style="color: #2D3748; font-weight: bold; margin-bottom: 15px;">Steps:</h6>
                    <div style="color: #4A5568;">
                        ${randomMethod.steps.map((step, index) => `
                            <div style="display: flex; margin-bottom: 10px;">
                                <span style="background: #E91E63; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; font-weight: bold; display: flex; align-items: center; justify-content: center; margin-right: 10px; flex-shrink: 0;">${index + 1}</span>
                                <span style="font-size: 14px; line-height: 1.4;">${step}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="background: #FFF5F5; border: 2px solid #FEB2B2; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <h6 style="color: #C53030; font-weight: bold; margin-bottom: 10px;">Example Prayer:</h6>
                    <p style="color: #742A2A; font-style: italic; font-size: 14px; line-height: 1.5; margin: 0;">"${randomMethod.example}"</p>
                </div>
                
                <div style="text-align: center; margin-bottom: 20px;">
                    <button onclick="window.completePrayerLesson()" style="background: #28A745; color: white; border: none; padding: 15px 30px; border-radius: 25px; font-weight: bold; cursor: pointer; font-size: 16px;">
                        ✅ I Prayed This (+10 XP)
                    </button>
                </div>
                
                <div style="background: #F8F9FA; border-radius: 12px; padding: 20px; border: 1px solid #DEE2E6;">
                    <h6 style="color: #495057; font-weight: bold; margin-bottom: 10px;">(Optional)</h6>
                    <p style="color: #6C757D; font-size: 14px; margin-bottom: 15px;">📝 Want to write your own version?</p>
                    <textarea id="personal-prayer-text" placeholder="Jesus, today I need you to..." style="width: 100%; height: 80px; border: 1px solid #CED4DA; border-radius: 8px; padding: 12px; font-family: Inter, sans-serif; font-size: 14px; resize: vertical; box-sizing: border-box;" maxlength="200"></textarea>
                    <p style="color: #6C757D; font-size: 12px; margin: 8px 0 0 0; text-align: center;">(Simple textbox with no pressure)</p>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.currentPrayerMethod = randomMethod;
        
        // Create global functions
        const gameInstance = this;
        
        window.completePrayerLesson = function() {
            // Get optional prayer text if provided
            const personalPrayer = document.getElementById('personal-prayer-text')?.value.trim();
            
            if (gameInstance && gameInstance.completeCard) {
                gameInstance.completeCard('how-to-pray', 10);
            }
            
            // Show encouraging message after completion
            setTimeout(() => {
                gameInstance.showCustomAlert('🌟 Well done! Every prayer grows your spirit 🌱 Keep going — God hears you.');
            }, 100);
            
            window.closePrayerModal();
        };
        
        window.closePrayerModal = function() {
            document.getElementById('how-to-pray-modal').style.display = 'none';
            document.getElementById('prayer-backdrop').style.display = 'none';
        };
        
        // Show modal
        document.getElementById('prayer-backdrop').style.display = 'block';
        document.getElementById('how-to-pray-modal').style.display = 'block';
    }

    completeCard(cardType, xpReward) {
        // Award XP and mark card as complete (with daily limit)
        if (window.gabeApp && window.gabeApp.awardXP) {
            const actualXP = window.gabeApp.awardXP(xpReward, cardType);
            
            // Check if XP was actually awarded (not already completed today)
            if (window.gabeApp.isGameCompletedToday(cardType)) {
                // Show different message for already completed games
                setTimeout(() => {
                    this.showCustomAlert(`🎯 You've already completed "${this.getCardDisplayName(cardType)}" today! Come back tomorrow for more XP.`);
                }, 500);
                return; // Exit early, don't show XP reward or mark as newly completed
            }
        }
        
        // Show completion message with custom modal instead of browser alert
        setTimeout(() => {
            this.showCustomAlert(`✨ Well done, Ray! You've earned ${xpReward} XP. Your faith journey continues to flourish!`);
        }, 500);
        
        // Update daily progress
        this.dailyProgress[cardType] = {
            completed: true,
            xpEarned: xpReward,
            completedAt: new Date().toISOString()
        };

        // Save progress
        this.saveDailyProgress();

        // Show XP reward
        this.showXPReward(xpReward);
    }

    getCardDisplayName(cardType) {
        const cardNames = {
            'whos-in-charge': 'Who\'s in Charge?',
            'broken-compass': 'Broken Compass',
            'holy-spirit': 'Holy Spirit',
            'rescue-mission': 'Rescue Mission',
            'god-promised-me': 'God Promised Me',
            'how-to-pray': 'How to Pray'
        };
        return cardNames[cardType] || cardType;
    }

    updateCardStatuses() {
        // Map of game IDs to their status element IDs
        const gameMapping = {
            'whos-in-charge': 'status-whos-in-charge',
            'broken-compass': 'status-broken-compass', 
            'holy-spirit': 'status-holy-spirit',
            'rescue-mission': 'status-rescue-mission',
            'god-promised': 'status-god-promised-me',  // Fix ID mismatch
            'how-to-pray': 'status-how-to-pray'
        };
        
        Object.keys(gameMapping).forEach(gameId => {
            const statusElement = document.getElementById(gameMapping[gameId]);
            if (statusElement) {
                if (window.gabeApp && window.gabeApp.isGameCompletedToday(gameId)) {
                    statusElement.innerHTML = '✓';
                    statusElement.style.background = 'transparent';
                    statusElement.style.border = 'none';
                    statusElement.style.color = '#10B981';
                    statusElement.style.fontSize = '20px';
                    statusElement.style.fontWeight = 'bold';
                    statusElement.style.width = 'auto';
                    statusElement.style.height = 'auto';
                    statusElement.style.borderRadius = '0';
                    statusElement.style.padding = '4px 8px';
                    statusElement.style.display = 'inline-block';
                    statusElement.title = 'Completed Today - Come back tomorrow for more XP!';
                } else {
                    // Reset to original styling for incomplete games
                    const originalTexts = {
                        'status-whos-in-charge': '🌱 Ready to Play',
                        'status-broken-compass': '🎯 Ready to Quiz',
                        'status-holy-spirit': '🔓 Ready to Grow',
                        'status-rescue-mission': '🚁 Ready to Start',
                        'status-god-promised-me': '📜 Ready to Claim',
                        'status-how-to-pray': '🙏 Ready to Learn'
                    };
                    
                    statusElement.textContent = originalTexts[gameMapping[gameId]];
                    statusElement.style.background = '#E2E8F0';
                    statusElement.style.color = '#4A5568';
                    statusElement.style.fontSize = '12px';
                    statusElement.style.width = 'auto';
                    statusElement.style.height = 'auto';
                    statusElement.style.borderRadius = '20px';
                    statusElement.style.padding = '6px 12px';
                    statusElement.style.display = 'inline-block';
                    statusElement.title = 'Ready to earn XP!';
                }
            }
        });
    }

    showXPReward(xp) {
        const rewardHTML = `
        <div id="xp-reward-popup" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999; background: linear-gradient(135deg, #48BB78 0%, #38A169 100%); color: white; padding: 30px; border-radius: 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: bounceIn 0.6s;">
            <div style="font-size: 48px; margin-bottom: 15px;">🌱</div>
            <h4 style="margin-bottom: 10px; font-weight: bold;">Seed Planted!</h4>
            <p style="margin: 0; font-size: 18px;">+${xp} XP Earned</p>
        </div>
        <style>
        @keyframes bounceIn {
            0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.05); }
            70% { transform: translate(-50%, -50%) scale(0.9); }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        </style>
        `;

        document.body.insertAdjacentHTML('beforeend', rewardHTML);

        setTimeout(() => {
            const popup = document.getElementById('xp-reward-popup');
            if (popup) popup.remove();
        }, 2000);
    }

    showCustomAlert(message) {
        // Create clean alert modal without browser URL bar
        const alertModal = document.createElement('div');
        alertModal.id = 'custom-alert-modal';
        alertModal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; border-radius: 20px; padding: 30px; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);">
                <div style="font-size: 18px; color: #2D3748; line-height: 1.5; margin-bottom: 25px;">
                    ${message}
                </div>
                <button id="custom-alert-ok" style="background: #4299E1; color: white; border: none; padding: 12px 30px; border-radius: 25px; font-weight: bold; cursor: pointer; font-size: 16px;">
                    OK
                </button>
            </div>
        </div>
        `;
        document.body.appendChild(alertModal);
        
        // Add click event listener
        document.getElementById('custom-alert-ok').addEventListener('click', function() {
            document.body.removeChild(alertModal);
        });
    }

    updateDailyStatus() {
        // Update card statuses based on daily progress
        Object.keys(this.dailyProgress).forEach(cardType => {
            const statusElement = document.getElementById(`status-${cardType}`);
            if (statusElement && this.dailyProgress[cardType]?.completed) {
                statusElement.innerHTML = '✅ Completed Today';
                statusElement.style.background = '#C6F6D5';
                statusElement.style.color = '#22543D';
            }
        });
    }

    updateGardenProgress() {
        // Calculate garden stats
        const completedCards = Object.values(this.dailyProgress).filter(p => p.completed).length;
        const totalXP = Object.values(this.dailyProgress).reduce((sum, p) => sum + (p.xpEarned || 0), 0);
        
        document.getElementById('garden-seeds').textContent = completedCards;
        document.getElementById('garden-growth').textContent = Math.floor(totalXP / 10);
        document.getElementById('garden-fruit').textContent = Math.floor(totalXP / 50);
    }

    loadDailyProgress() {
        // Load from localStorage or start fresh daily
        const today = new Date().toDateString();
        const savedProgress = localStorage.getItem('faithCards_daily');
        
        if (savedProgress) {
            const parsed = JSON.parse(savedProgress);
            if (parsed.date === today) {
                this.dailyProgress = parsed.progress;
                return;
            }
        }
        
        // New day, reset progress
        this.dailyProgress = {};
    }

    saveDailyProgress() {
        const today = new Date().toDateString();
        localStorage.setItem('faithCards_daily', JSON.stringify({
            date: today,
            progress: this.dailyProgress
        }));
    }

    // Simple wrapper function for template compatibility
    showFaithCards() {
        this.openFaithCards();
    }
}

// Initialize the faith cards system
const faithCards = new FaithCardsSystem();
window.faithCards = faithCards;

console.log('Faith Cards System loaded successfully');
