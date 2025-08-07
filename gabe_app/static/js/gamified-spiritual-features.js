/**
 * GABE Faith-in-Action Gamified Framework - Frontend Implementation
 * Transforms spiritual growth into engaging, trackable experiences
 */

class GamifiedSpiritualFeatures {
    constructor() {
        this.currentUserData = null;
        this.lastCelebrationTime = null; // Prevent duplicate voice celebrations
        this.initializeGameInterface();
    }

    initializeGameInterface() {
        // Create main gamified features modal
        this.createGamifiedModal();
        
        // Load user progress
        this.loadUserProgress();
        
        // Bind events
        this.bindEvents();
    }

    createGamifiedModal() {
        const modalHTML = `
        <div class="modal fade" id="gamifiedModal" tabindex="-1" aria-labelledby="gamifiedModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content" style="background: #FFFFFF; border: 1px solid #1E3A8A; border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
                    <div class="modal-header" style="background: #FFFFFF; border: none; border-bottom: 1px solid #1E3A8A; padding: 24px; border-radius: 20px 20px 0 0;">
                        <h4 class="modal-title" id="gamifiedModalLabel" style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin: 0; font-size: 24px;">
                            ⚡ FAITH WARRIOR ARENA ⚡
                        </h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" style="color: #6B7280; font-size: 24px; font-weight: bold;">×</button>
                    </div>
                    <div class="modal-body">
                        <!-- Epic Progress Dashboard -->
                        <div class="row mb-4">
                            <div class="col-12">
                                <div class="card" style="background: #FFFFFF; border: 1px solid #1E3A8A; border-radius: 16px; box-shadow: none; overflow: hidden;">
                                    <!-- Modern Header -->
                                    <div style="background: #F9FAFB; padding: 24px 20px; text-align: center; border-bottom: 1px solid #E5E7EB;">
                                        <div style="font-size: 3rem; color: #1E3A8A; margin-bottom: 8px;">⚡</div>
                                        <h5 style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin: 0; font-size: 18px;">POWER POINTS DASHBOARD</h5>
                                    </div>
                                    <!-- Content -->
                                    <div class="card-body" style="padding: 24px;">
                                        <div class="row align-items-center">
                                            <div class="col-md-8">
                                                <h5 class="mb-2" style="font-family: Inter, sans-serif; color: #111827; font-weight: bold; font-size: 16px;">⚡ Faith Warrior Level: <span id="currentLevel" style="color: #1E3A8A; font-weight: bold;">Seed</span></h5>
                                                <div class="progress mb-2" style="height: 8px; border-radius: 8px; background: #E5E7EB;">
                                                    <div class="progress-bar" id="levelProgress" style="width: 0%; background: #1E3A8A; border-radius: 8px;"></div>
                                                </div>
                                                <small id="progressText" style="font-family: Inter, sans-serif; color: #6B7280; font-size: 12px;">0 XP - Next Level Up: Shepherd (10 XP needed)</small>
                                            </div>
                                            <div class="col-md-4 text-center">
                                                <h1 class="mb-0" id="totalXP" style="font-family: Inter, sans-serif; font-size: 3rem; color: #1E3A8A; font-weight: bold;">0</h1>
                                                <small style="font-family: Inter, sans-serif; color: #6B7280; font-weight: 600; font-size: 12px;">POWER POINTS</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Faith Modules Grid -->
                        <div class="row g-3">
                            <!-- Morning Power-Up -->
                            <div class="col-md-6 col-lg-4">
                                <div class="card h-100 faith-module" data-module="devotion" style="background: #FFFFFF; border: 1px solid #1E3A8A; border-radius: 16px; box-shadow: none; transition: all 0.3s ease; overflow: hidden;" onmouseover="this.style.boxShadow='0 4px 8px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow='none'">
                                    <!-- Modern Header -->
                                    <div style="background: #F9FAFB; padding: 20px; text-align: center; border-bottom: 1px solid #E5E7EB;">
                                        <div style="font-size: 2.5rem; color: #F97316; margin-bottom: 8px;">☀️</div>
                                        <h6 style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin: 0; font-size: 14px;">MORNING POWER-UP</h6>
                                    </div>
                                    <!-- Content -->
                                    <div class="card-body" style="padding: 20px;">
                                        <h5 class="card-title" style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin-bottom: 8px; font-size: 16px;">Morning Power-Up!</h5>
                                        <p class="card-text" style="font-family: Inter, sans-serif; color: #6B7280; font-size: 13px; margin-bottom: 15px; line-height: 1.4;">Fuel your soul for the day ahead</p>
                                        <div style="margin-bottom: 20px;">
                                            <span style="background: #F3F4F6; color: #374151; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 600;">🔥 <span id="devotionStreak">0</span> Day Streak</span>
                                        </div>
                                        <button class="btn w-100" onclick="gameFeatures.openDevotion()" style="background: #1E3A8A; color: white; border: none; border-radius: 12px; padding: 12px; font-family: Inter, sans-serif; font-weight: 600; font-size: 13px; cursor: pointer;">
                                            START NOW
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Daily Quest -->
                            <div class="col-md-6 col-lg-4">
                                <div class="card h-100 faith-module" data-module="prayer" style="background: #FFFFFF; border: 1px solid #1E3A8A; border-radius: 16px; box-shadow: none; transition: all 0.3s ease; overflow: hidden;" onmouseover="this.style.boxShadow='0 4px 8px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow='none'">
                                    <!-- Modern Header -->
                                    <div style="background: #F9FAFB; padding: 20px; text-align: center; border-bottom: 1px solid #E5E7EB;">
                                        <div style="font-size: 2.5rem; color: #3B82F6; margin-bottom: 8px;">⚔️</div>
                                        <h6 style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin: 0; font-size: 14px;">DAILY QUEST</h6>
                                    </div>
                                    <!-- Content -->
                                    <div class="card-body" style="padding: 20px;">
                                        <h5 class="card-title" style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin-bottom: 8px; font-size: 16px;">Daily Quest!</h5>
                                        <p class="card-text" style="font-family: Inter, sans-serif; color: #6B7280; font-size: 13px; margin-bottom: 15px; line-height: 1.4;">30-second Bible trivia game</p>
                                        <div style="margin-bottom: 20px;">
                                            <span style="background: #F3F4F6; color: #374151; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 600;">⚔️ <span id="prayerStreak">0</span> Quests</span>
                                        </div>
                                        <button class="btn w-100" onclick="gameFeatures.openPrayerChallenge()" style="background: #1E3A8A; color: white; border: none; border-radius: 12px; padding: 12px; font-family: Inter, sans-serif; font-weight: 600; font-size: 13px; cursor: pointer;">
                                            🧠 BIBLE TRIVIA 🧠
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Scripture Warrior -->
                            <div class="col-md-6 col-lg-4">
                                <div class="card h-100 faith-module" data-module="verses" style="background: #FFFFFF; border: 1px solid #1E3A8A; border-radius: 16px; box-shadow: none; transition: all 0.3s ease; overflow: hidden;" onmouseover="this.style.boxShadow='0 4px 8px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow='none'">
                                    <!-- Modern Header -->
                                    <div style="background: #F9FAFB; padding: 20px; text-align: center; border-bottom: 1px solid #E5E7EB;">
                                        <div style="font-size: 2.5rem; color: #6366F1; margin-bottom: 8px;">📖</div>
                                        <h6 style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin: 0; font-size: 14px;">SCRIPTURE WARRIOR</h6>
                                    </div>
                                    <!-- Content -->
                                    <div class="card-body" style="padding: 20px;">
                                        <h5 class="card-title" style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin-bottom: 8px; font-size: 16px;">Scripture Warrior!</h5>
                                        <p class="card-text" style="font-family: Inter, sans-serif; color: #6B7280; font-size: 13px; margin-bottom: 15px; line-height: 1.4;">Battle with the Sword of the Spirit</p>
                                        <div style="margin-bottom: 20px;">
                                            <span style="background: #F3F4F6; color: #374151; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 600;">🏆 <span id="versesMastered">0</span> Verses</span>
                                        </div>
                                        <button class="btn w-100" onclick="gameFeatures.openBibleReading()" style="background: #1E3A8A; color: white; border: none; border-radius: 12px; padding: 12px; font-family: Inter, sans-serif; font-weight: 600; font-size: 13px; cursor: pointer;">
                                            📖 BIBLE STUDY 📖
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Spiritual Direction Card -->
                            <div class="col-md-6 col-lg-4">
                                <div class="card h-100 faith-module" data-module="spiritual-direction" style="background: #FFFFFF; border: 1px solid #1E3A8A; border-radius: 16px; box-shadow: none; transition: all 0.3s ease; overflow: hidden;" onmouseover="this.style.boxShadow='0 4px 8px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow='none'">
                                    <!-- Modern Header -->
                                    <div style="background: #F9FAFB; padding: 20px; text-align: center; border-bottom: 1px solid #E5E7EB;">
                                        <div style="font-size: 2.5rem; color: #9333EA; margin-bottom: 8px;">🧭</div>
                                        <h6 style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin: 0; font-size: 14px;">SPIRITUAL DIRECTION</h6>
                                    </div>
                                    <!-- Content -->
                                    <div class="card-body" style="padding: 20px;">
                                        <h5 class="card-title" style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin-bottom: 8px; font-size: 16px;">Spiritual Direction!</h5>
                                        <p class="card-text" style="font-family: Inter, sans-serif; color: #6B7280; font-size: 13px; margin-bottom: 15px; line-height: 1.4;">Personal guidance from saints</p>
                                        <div style="margin-bottom: 20px;">
                                            <span style="background: #F3F4F6; color: #374151; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 600;">🧭 +5 XP</span>
                                        </div>
                                        <button class="btn w-100" id="spiritual-director-btn" onclick="window.spiritualDirector.openSpiritualDirection()" style="background: #1E3A8A; color: white; border: none; border-radius: 12px; padding: 12px; font-family: Inter, sans-serif; font-weight: 600; font-size: 13px; cursor: pointer;">
                                            🧭 GET GUIDANCE 🧭
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Prayer Arena Card -->
                            <div class="col-md-6 col-lg-4">
                                <div class="card h-100 faith-module" data-module="prayer-arena" style="background: #FFFFFF; border: 1px solid #1E3A8A; border-radius: 16px; box-shadow: none; transition: all 0.3s ease; overflow: hidden;" onmouseover="this.style.boxShadow='0 4px 8px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow='none'">
                                    <!-- Modern Header -->
                                    <div style="background: #F9FAFB; padding: 20px; text-align: center; border-bottom: 1px solid #E5E7EB;">
                                        <div style="font-size: 2.5rem; color: #EC4899; margin-bottom: 8px;">🙏</div>
                                        <h6 style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin: 0; font-size: 14px;">PRAYER ARENA</h6>
                                    </div>
                                    <!-- Content -->
                                    <div class="card-body" style="padding: 20px;">
                                        <h5 class="card-title" style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin-bottom: 8px; font-size: 16px;">Prayer Arena!</h5>
                                        <p class="card-text" style="font-family: Inter, sans-serif; color: #6B7280; font-size: 13px; margin-bottom: 15px; line-height: 1.4;">Scripture + Prayer + Reflection</p>
                                        <div style="margin-bottom: 20px;">
                                            <span style="background: #F3F4F6; color: #374151; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 600;">🙏 +3 XP</span>
                                        </div>
                                        <button class="btn w-100" onclick="gameFeatures.openVerseMastery()" style="background: #1E3A8A; color: white; border: none; border-radius: 12px; padding: 12px; font-family: Inter, sans-serif; font-weight: 600; font-size: 13px; cursor: pointer;">
                                            BATTLE NOW
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Treasure Hunt -->
                            <div class="col-md-6 col-lg-4">
                                <div class="card h-100 faith-module" data-module="biblestudy" style="background: #FFFFFF; border: 1px solid #1E3A8A; border-radius: 16px; box-shadow: none; transition: all 0.3s ease; overflow: hidden;" onmouseover="this.style.boxShadow='0 4px 8px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow='none'">
                                    <!-- Modern Header -->
                                    <div style="background: #F9FAFB; padding: 20px; text-align: center; border-bottom: 1px solid #E5E7EB;">
                                        <div style="font-size: 2.5rem; color: #10B981; margin-bottom: 8px;">💎</div>
                                        <h6 style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin: 0; font-size: 14px;">BIBLE TREASURE HUNT</h6>
                                    </div>
                                    <!-- Content -->
                                    <div class="card-body" style="padding: 20px;">
                                        <h5 class="card-title" style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin-bottom: 8px; font-size: 16px;">Bible Treasure Hunt!</h5>
                                        <p class="card-text" style="font-family: Inter, sans-serif; color: #6B7280; font-size: 13px; margin-bottom: 15px; line-height: 1.4;">Discover hidden gems in God's Word</p>
                                        <div style="margin-bottom: 20px;">
                                            <span style="background: #F3F4F6; color: #374151; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 600;">💎 <span id="studiesCompleted">0</span> Treasures</span>
                                        </div>
                                        <button class="btn w-100" onclick="gameFeatures.openBibleStudy()" style="background: #1E3A8A; color: white; border: none; border-radius: 12px; padding: 12px; font-family: Inter, sans-serif; font-weight: 600; font-size: 13px; cursor: pointer;">
                                            HUNT TREASURE
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Prayer Training Camp -->
                            <div class="col-md-6 col-lg-4">
                                <div class="card h-100 faith-module" data-module="prayer" style="background: #FFFFFF; border: 1px solid #1E3A8A; border-radius: 16px; box-shadow: none; transition: all 0.3s ease; overflow: hidden;" onmouseover="this.style.boxShadow='0 4px 8px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow='none'">
                                    <!-- Modern Header -->
                                    <div style="background: #F9FAFB; padding: 20px; text-align: center; border-bottom: 1px solid #E5E7EB;">
                                        <div style="font-size: 2.5rem; color: #F59E0B; margin-bottom: 8px;">⚡</div>
                                        <h6 style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin: 0; font-size: 14px;">PRAYER TRAINING CAMP</h6>
                                    </div>
                                    <!-- Content -->
                                    <div class="card-body" style="padding: 20px;">
                                        <h5 class="card-title" style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin-bottom: 8px; font-size: 16px;">Prayer Training Camp!</h5>
                                        <p class="card-text" style="font-family: Inter, sans-serif; color: #6B7280; font-size: 13px; margin-bottom: 15px; line-height: 1.4;">Learn prayer power-moves & get points!</p>
                                        <div style="margin-bottom: 20px;">
                                            <span style="background: #F3F4F6; color: #374151; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 600;">⚡ <span id="prayerPoints">0</span> Points</span>
                                        </div>
                                        <button class="btn w-100" onclick="gameFeatures.openPrayerTraining()" style="background: #1E3A8A; color: white; border: none; border-radius: 12px; padding: 12px; font-family: Inter, sans-serif; font-weight: 600; font-size: 13px; cursor: pointer;">
                                            🎯 START TRAINING
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Trophy Room -->
                            <div class="col-md-6 col-lg-4">
                                <div class="card h-100 faith-module" data-module="badges" style="background: #FFFFFF; border: 1px solid #1E3A8A; border-radius: 16px; box-shadow: none; transition: all 0.3s ease; overflow: hidden;" onmouseover="this.style.boxShadow='0 4px 8px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow='none'">
                                    <!-- Modern Header -->
                                    <div style="background: #F9FAFB; padding: 20px; text-align: center; border-bottom: 1px solid #E5E7EB;">
                                        <div style="font-size: 2.5rem; color: #F59E0B; margin-bottom: 8px;">🏆</div>
                                        <h6 style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin: 0; font-size: 14px;">TROPHY ROOM</h6>
                                    </div>
                                    <!-- Content -->
                                    <div class="card-body" style="padding: 20px;">
                                        <h5 class="card-title" style="font-family: Inter, sans-serif; font-weight: bold; color: #111827; margin-bottom: 8px; font-size: 16px;">Trophy Room!</h5>
                                        <p class="card-text" style="font-family: Inter, sans-serif; color: #6B7280; font-size: 13px; margin-bottom: 15px; line-height: 1.4;">Show off your epic achievements</p>
                                        <div style="margin-bottom: 20px;">
                                            <span style="background: #F3F4F6; color: #374151; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 600;">🏆 <span id="badgeCount">0</span> Trophies</span>
                                        </div>
                                        <button class="btn w-100" onclick="gameFeatures.openBadges()" style="background: #1E3A8A; color: white; border: none; border-radius: 12px; padding: 12px; font-family: Inter, sans-serif; font-weight: 600; font-size: 13px; cursor: pointer;">
                                            VIEW TROPHIES
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Epic Recent Rewards Display -->
                        <div class="row mt-4" id="recentBadgesSection" style="display: none;">
                            <div class="col-12">
                                <div class="card text-white" style="background: linear-gradient(135deg, #ffd700 0%, #ff6b6b 100%); border: none; box-shadow: 0 8px 25px rgba(255,215,0,0.3); animation: pulse 2s infinite;">
                                    <div class="card-body text-center">
                                        <h4 class="card-title" style="font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🎉 EPIC VICTORY! 🎉</h4>
                                        <div id="recentBadges" class="d-flex flex-wrap gap-2 justify-content-center"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <style>
                        @keyframes pulse {
                            0% { transform: scale(1); }
                            50% { transform: scale(1.02); }
                            100% { transform: scale(1); }
                        }
                        </style>
                    </div>
                </div>
            </div>
        </div>


        `;

        // Append to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    bindEvents() {
        // Keep the existing spiritual features panel toggle but update the content
        // The button will use the existing gabeApp.toggleSpiritualFeatures() method
        console.log('Faith in Action bound to existing spiritual features panel');
        
        // Update devotion button on page load
        this.updateDevotionButton();
    }

    async loadUserProgress() {
        try {
            console.log('Loading user progress from localStorage...');
            
            // Get XP from localStorage (same system as Faith Cards)
            const currentXP = parseInt(localStorage.getItem('gabeXP') || '0');
            console.log('Current XP from localStorage:', currentXP);
            
            // Create user data based on localStorage XP
            this.currentUserData = this.createUserDataFromXP(currentXP);
            
            console.log('User progress loaded from localStorage:', this.currentUserData);
            this.updateProgressDisplay();
            
            // Also update the specific elements directly if they exist
            this.updateXPDisplayElements(currentXP);
        } catch (error) {
            console.error('Failed to load user progress:', error);
        }
    }

    updateXPDisplayElements(xp) {
        console.log('Updating XP display elements with XP:', xp);
        console.log('Current user data:', this.currentUserData);
        
        // Update the correct elements based on the actual HTML structure
        const userXPElement = document.getElementById('user-xp');
        if (userXPElement) {
            userXPElement.textContent = xp;
            console.log('Updated user-xp element to:', xp);
        } else {
            console.log('user-xp element not found');
        }
        
        // Update current level display
        const userLevelElement = document.getElementById('user-level');
        if (userLevelElement && this.currentUserData) {
            userLevelElement.textContent = this.currentUserData.level;
            console.log('Updated user-level element to:', this.currentUserData.level);
        } else {
            console.log('user-level element not found or no currentUserData');
        }
        
        // Update level icon
        const levelIconElement = document.getElementById('level-icon');
        if (levelIconElement && this.currentUserData) {
            levelIconElement.textContent = this.currentUserData.level_icon;
            console.log('Updated level-icon element to:', this.currentUserData.level_icon);
        } else {
            console.log('level-icon element not found or no currentUserData');
        }
        
        // Update progress bar
        const levelProgressBarElement = document.getElementById('level-progress-bar');
        if (levelProgressBarElement && this.currentUserData) {
            levelProgressBarElement.style.width = this.currentUserData.progress_to_next + '%';
            console.log('Updated level-progress-bar to:', this.currentUserData.progress_to_next + '%');
        } else {
            console.log('level-progress-bar element not found or no currentUserData');
        }
        
        // Update progress percentage text
        const progressPercentageElement = document.getElementById('progress-percentage');
        if (progressPercentageElement && this.currentUserData) {
            progressPercentageElement.textContent = Math.round(this.currentUserData.progress_to_next);
            console.log('Updated progress-percentage to:', Math.round(this.currentUserData.progress_to_next));
        } else {
            console.log('progress-percentage element not found or no currentUserData');
        }
        
        // Update next level text
        const nextLevelElement = document.getElementById('next-level');
        if (nextLevelElement && this.currentUserData) {
            nextLevelElement.textContent = this.currentUserData.next_level;
            console.log('Updated next-level to:', this.currentUserData.next_level);
        } else {
            console.log('next-level element not found or no currentUserData');
        }
    }

    createUserDataFromXP(xp) {
        let level, level_icon, level_description, next_level, xp_to_next;
        
        if (xp < 50) {
            level = 'Seedling';
            level_icon = '🌱';
            level_description = 'Beginning your faith journey';
            next_level = 'Disciple';
            xp_to_next = 50 - xp;
        } else if (xp < 150) {
            level = 'Disciple';
            level_icon = '📚';
            level_description = 'Learning and growing';
            next_level = 'Messenger';
            xp_to_next = 150 - xp;
        } else if (xp < 300) {
            level = 'Messenger';
            level_icon = '📢';
            level_description = 'Sharing God\'s love';
            next_level = 'Guardian';
            xp_to_next = 300 - xp;
        } else if (xp < 500) {
            level = 'Guardian';
            level_icon = '🛡️';
            level_description = 'Protecting and guiding';
            next_level = 'Kingdom Builder';
            xp_to_next = 500 - xp;
        } else {
            level = 'Kingdom Builder';
            level_icon = '👑';
            level_description = 'Building God\'s kingdom';
            next_level = 'Master Builder';
            xp_to_next = 0;
        }
        
        // Calculate progress percentage
        const level_ranges = { 'Seedling': 50, 'Disciple': 100, 'Messenger': 150, 'Guardian': 200, 'Kingdom Builder': 0 };
        const current_range = level_ranges[level] || 100;
        const progress_to_next = current_range > 0 ? Math.min(100, ((current_range - xp_to_next) / current_range) * 100) : 100;
        
        return {
            xp: xp,
            level: level,
            level_icon: level_icon,
            level_description: level_description,
            next_level: next_level,
            xp_to_next: xp_to_next,
            progress_to_next: progress_to_next,
            daily_goals: {}
        };
    }

    updateProgressDisplay() {
        if (!this.currentUserData) {
            console.log('No user data available for progress update');
            return;
        }

        const data = this.currentUserData;
        console.log('Updating progress with data:', data);
        
        // Update enhanced spiritual level display
        const levelElement = document.getElementById('user-level');
        const levelIconElement = document.getElementById('level-icon');
        const levelDescriptionElement = document.getElementById('level-description');
        const nextLevelElement = document.getElementById('next-level');
        const xpElement = document.getElementById('user-xp');
        const progressBar = document.getElementById('level-progress-bar');
        const progressPercentage = document.getElementById('progress-percentage');
        
        if (levelElement) {
            levelElement.textContent = data.level || 'Seedling';
            console.log('Updated level to:', data.level);
        }
        
        if (levelIconElement) {
            levelIconElement.textContent = data.level_icon || '🌱';
        }
        
        if (levelDescriptionElement) {
            levelDescriptionElement.textContent = data.level_description || 'Beginning your faith journey';
        }
        
        if (nextLevelElement) {
            nextLevelElement.textContent = data.next_level || 'Disciple';
        }
        
        if (xpElement) {
            xpElement.textContent = data.xp || 0;
            console.log('Updated XP to:', data.xp);
        }
        
        // Update progress bar
        if (progressBar && data.progress_to_next !== undefined) {
            progressBar.style.width = data.progress_to_next + '%';
        }
        
        if (progressPercentage && data.progress_to_next !== undefined) {
            progressPercentage.textContent = Math.round(data.progress_to_next);
        }
        
        // Update daily goals indicators
        this.updateDailyGoals(data.daily_goals || {});
        
        // Update legacy inline progress indicators (for backward compatibility)
        const inlineLevel = document.getElementById('inline-level');
        const inlineXP = document.getElementById('inline-xp');
        
        if (inlineLevel) {
            inlineLevel.textContent = data.level || 'Seedling';
        }
        
        if (inlineXP) {
            inlineXP.textContent = data.xp || 0;
        }
        
        // Update streak displays
        const devotionStreak = document.getElementById('devotion-streak');
        const prayerStreak = document.getElementById('prayer-streak');
        const versesLearned = document.getElementById('verses-learned');
        const adventureProgress = document.getElementById('adventure-progress');
        const badgeCount = document.getElementById('badge-count');
        const moodMissions = document.getElementById('mood-missions');
        
        if (devotionStreak) devotionStreak.textContent = data.streak?.devotion || 0;
        if (prayerStreak) prayerStreak.textContent = data.streak?.prayer || 0;
        if (versesLearned) versesLearned.textContent = data.verses_mastered || 0;
        if (document.getElementById('studiesCompleted')) document.getElementById('studiesCompleted').textContent = data.studies_completed || 0;
        if (document.getElementById('versesMastered')) document.getElementById('versesMastered').textContent = data.verses_mastered || 0;
        if (document.getElementById('prayerPoints')) document.getElementById('prayerPoints').textContent = data.faith_points || 0;
        if (badgeCount) badgeCount.textContent = data.badges?.length || 0;
        if (document.getElementById('badgeCount')) document.getElementById('badgeCount').textContent = data.badges?.length || 0;
        if (moodMissions) moodMissions.textContent = data.total_actions || 0;
        
        // Update modal progress if it exists
        const currentLevel = document.getElementById('currentLevel');
        const totalXP = document.getElementById('totalXP');
        const levelProgress = document.getElementById('levelProgress');
        
        if (currentLevel) currentLevel.textContent = data.level || 'Seedling';
        if (totalXP) totalXP.textContent = data.xp || 0;
        if (levelProgress) levelProgress.style.width = `${data.progress_percentage || 0}%`;
        
        // Update devotion button text and icon based on time of day
        this.updateDevotionButton();
        
        // Update level badges highlighting
        this.updateLevelBadges(data.xp, data.level);
    }
    
    updateDailyGoals(goals) {
        const goalElements = {
            'devotion': document.getElementById('daily-devotion'),
            'prayer': document.getElementById('daily-prayer'),
            'reading': document.getElementById('daily-reading'),
            'study': document.getElementById('daily-study')
        };
        
        Object.keys(goalElements).forEach(goal => {
            const element = goalElements[goal];
            if (element) {
                if (goals[goal]) {
                    element.style.background = '#10B981';
                    element.style.boxShadow = '0 0 8px rgba(16, 185, 129, 0.6)';
                } else {
                    element.style.background = 'rgba(255,255,255,0.3)';
                    element.style.boxShadow = 'none';
                }
            }
        });
    }

    updateDevotionButton() {
        const currentHour = new Date().getHours();
        const isMorning = currentHour >= 5 && currentHour < 14;
        
        const devotionButtonText = document.getElementById('devotion-button-text');
        const devotionButton = document.querySelector('.devotion-btn .feature-icon');
        
        if (devotionButtonText) {
            devotionButtonText.textContent = isMorning ? 'Morning Devotion' : 'Evening Devotion';
        }
        
        if (devotionButton) {
            devotionButton.textContent = isMorning ? '🌅' : '🌙';
        }
    }

    openGamifiedFeatures() {
        this.loadUserProgress();
        
        // Ensure modal exists and is properly initialized
        let gamifiedModal = document.getElementById('gamifiedModal');
        if (!gamifiedModal) {
            this.createGamifiedModal();
            gamifiedModal = document.getElementById('gamifiedModal');
        }
        
        // Initialize and show modal with proper options
        const modal = new bootstrap.Modal(gamifiedModal, {
            backdrop: true,
            keyboard: true,
            focus: true
        });
        
        // Add proper event handlers to ensure modal closes correctly
        gamifiedModal.addEventListener('hidden.bs.modal', function () {
            // Clean up any lingering backdrop
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
        });
        
        modal.show();
    }

    async openDevotion() {
        // Start activity tracking for validation
        if (window.activityTracker) {
            window.activityTracker.startTracking('devotion');
        }
        
        // Remove any existing simple modals first
        document.querySelectorAll('.simple-modal').forEach(el => el.remove());
        
        // Determine the devotion type for header display
        const currentHour = new Date().getHours();
        const isMorning = currentHour >= 5 && currentHour < 14;
        const devotionIcon = isMorning ? '🌅' : '🌙';
        const devotionTitle = isMorning ? 'Morning Devotion' : 'Evening Devotion';
        
        const modalHTML = `
        <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; border-radius: 8px; max-width: 600px; width: 90%; max-height: 80%; overflow-y: auto; position: relative;">
                <div style="padding: 20px; border-bottom: 1px solid #ddd; background: #007bff; color: white; display: flex; justify-content: space-between; align-items: center;">
                    <h5 style="margin: 0;">${devotionIcon} ${devotionTitle}</h5>
                    <button onclick="this.closest('.simple-modal').remove()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
                </div>
                <div style="padding: 20px;" id="simple-devotion-content">
                    <div style="text-align: center;">
                        <div style="display: inline-block; width: 20px; height: 20px; border: 2px solid #007bff; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite;"></div>
                        <p style="margin-top: 10px;">Loading...</p>
                    </div>
                </div>
            </div>
        </div>
        <style>
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        </style>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Load content
        try {
            const response = await fetch('/api/gamified/daily_devotion');
            const data = await response.json();

            if (data.type === 'already_completed') {
                const devotionIcon = data.devotion_type === 'morning' ? '🌅' : '🌙';
                document.getElementById('simple-devotion-content').innerHTML = `
                    <div style="text-align: center;">
                        <div style="font-size: 48px; color: #28a745; margin-bottom: 15px;">${devotionIcon}</div>
                        <h5>Devotion Complete!</h5>
                        <p>${data.message}</p>
                        <p style="color: #6c757d;">Current streak: ${data.streak} days</p>
                        <button onclick="this.closest('.simple-modal').remove()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                    </div>
                `;
            } else {
                const devotion = data.devotion;
                document.getElementById('simple-devotion-content').innerHTML = `
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h4 style="color: #007bff; margin-bottom: 10px;">${devotion.title || 'Daily Devotion'}</h4>
                        <p style="font-style: italic; color: #6c757d; margin-bottom: 20px;">${devotion.greeting || ''}</p>
                    </div>
                    
                    <div style="background: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 15px 0; border-radius: 4px;">
                        <h6 style="color: #007bff; margin-bottom: 10px;">📖 Bible Verse</h6>
                        <blockquote style="margin: 0; font-style: italic; font-size: 16px; line-height: 1.6;">
                            "${devotion.verse_text || 'Be strong and courageous! Do not be afraid or discouraged. For the LORD your God is with you wherever you go.'}"
                        </blockquote>
                        <p style="text-align: right; margin: 10px 0 0 0; font-weight: bold; color: #007bff;">— ${devotion.verse_reference || 'Joshua 1:9'}</p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h6 style="color: #007bff; margin-bottom: 10px;">🕊️ Epic Story</h6>
                        <p style="line-height: 1.6;">${devotion.epic_story || devotion.word || 'God has an amazing plan for your life today.'}</p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h6 style="color: #007bff; margin-bottom: 10px;">💡 Mission</h6>
                        <p style="line-height: 1.6; font-style: italic;">${devotion.mission || devotion.application || 'Live with faith and trust in God today.'}</p>
                    </div>
                    
                    <div style="background: #e8f4f8; border: 1px solid #bee5eb; padding: 15px; border-radius: 4px; margin: 20px 0;">
                        <h6 style="color: #0c5460; margin-bottom: 10px;">🙏 Power Prayer</h6>
                        <p style="line-height: 1.6; font-style: italic; color: #0c5460;">${devotion.power_prayer || devotion.prayer || 'Lord, guide me through this day with Your love and wisdom. In Jesus name, Amen.'}</p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <label style="font-weight: bold; color: #007bff; margin-bottom: 10px; display: block;">✏️ Your Reflection</label>
                        <textarea id="simple-devotion-reflection" placeholder="How did this devotion speak to your heart today?" style="width: 100%; height: 80px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin: 10px 0; resize: vertical;"></textarea>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <button onclick="gameFeatures.completeSimpleDevotion()" style="padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px; font-weight: bold;">Complete Devotion (+2 XP)</button>
                        <button onclick="this.closest('.simple-modal').remove()" style="padding: 12px 24px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                    </div>
                    
                    <div style="text-align: center; margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
                        <p style="margin: 0; color: #6c757d; font-size: 14px;">${devotion.closing || '✨ GABE is always by your side — you are never alone!'}</p>
                    </div>
                `;
            }
        } catch (error) {
            document.getElementById('simple-devotion-content').innerHTML = `
                <div style="text-align: center; color: #dc3545;">
                    <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
                    <h5>Failed to load devotion</h5>
                    <p>Please try again later.</p>
                    <button onclick="this.closest('.simple-modal').remove()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                </div>
            `;
        }
        
        // Re-render feather icons
        if (window.feather) {
            window.feather.replace();
        }
    }

    async completeDevotion() {
        const reflection = document.getElementById('devotionReflection')?.value || '';
        
        try {
            const response = await fetch('/api/gamified/complete_devotion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reflection })
            });

            if (response.ok) {
                const result = await response.json();
                result.activityType = 'devotion';
                this.showReward(result);
                this.closeModal('devotionModal');
                this.loadUserProgress();
            }
        } catch (error) {
            console.error('Failed to complete devotion:', error);
        }
    }

    async completeSimpleDevotion() {
        const reflection = document.getElementById('simple-devotion-reflection')?.value || '';
        
        // Stop activity tracking and get metadata
        let activityMetadata = {};
        if (window.activityTracker) {
            activityMetadata = window.activityTracker.stopTracking();
        }

        try {
            const payload = {
                reflection: reflection,
                metadata: activityMetadata
            };
            
            const response = await fetch('/api/gamified/complete_devotion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.showReward(result);
                    document.querySelector('.simple-modal')?.remove();
                    this.loadUserProgress();
                } else {
                    this.showValidationFailure(result.message, result.suggestions);
                }
            }
        } catch (error) {
            alert('Failed to complete devotion. Please try again.');
        }
    }
    
    showValidationFailure(message, suggestions) {
        const alertHTML = `
        <div class="validation-alert" style="position: fixed; top: 20px; right: 20px; background: #fff3cd; border: 2px solid #ffeaa7; border-radius: 12px; padding: 20px; max-width: 400px; z-index: 10001; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 24px; margin-right: 12px;">⏰</span>
                <h4 style="margin: 0; color: #856404; font-size: 16px;">Spiritual Growth Opportunity</h4>
            </div>
            <p style="margin: 0 0 12px 0; color: #856404; font-size: 14px; line-height: 1.4;">${message}</p>
            ${suggestions ? `<p style="margin: 0; color: #6c757d; font-size: 13px; font-style: italic;">${suggestions}</p>` : ''}
            <button onclick="this.closest('.validation-alert').remove()" style="margin-top: 12px; padding: 8px 16px; background: #ffc107; border: none; border-radius: 6px; color: #212529; font-weight: 500; cursor: pointer;">
                Try Again
            </button>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', alertHTML);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            document.querySelector('.validation-alert')?.remove();
        }, 8000);
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
            
            // Force cleanup
            setTimeout(() => {
                document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                document.body.classList.remove('modal-open');
                document.body.style.removeProperty('padding-right');
                modal.style.display = 'none';
                modal.classList.remove('show');
            }, 100);
        }
    }

    createDevotionModal() {
        // Generate epic morning devotion content
        const devotions = [
            {
                title: "🔥 WARRIOR'S AWAKENING",
                verse: "\"I can do all things through Christ who strengthens me.\" - Philippians 4:13",
                story: "Every morning, God's warriors wake up with supernatural power! Today you're not just getting up - you're RISING UP like a champion ready to conquer the day. Think of yourself as a spiritual superhero with God as your ultimate power source!",
                mission: "YOUR EPIC MISSION: Find one thing today that seems impossible and attack it with God's strength. Every small victory builds your faith warrior level!",
                powerUp: "🌟 POWER-UP PRAYER: 'God, I'm ready to be AWESOME today! Fill me with Your supernatural strength to crush every challenge and show the world Your amazing power through me!'"
            },
            {
                title: "⚔️ BATTLE READY BELIEVER",
                verse: "\"Put on the full armor of God, so that you can take your stand against the devil's schemes.\" - Ephesians 6:11",
                story: "You're not just going to work or school - you're entering the BATTLEFIELD as God's elite warrior! Your armor is invisible but INCREDIBLY powerful. Every prayer charges your shield, every Bible verse sharpens your sword!",
                mission: "TODAY'S QUEST: Identify one negative thought trying to attack you and DEMOLISH it with God's truth. You're a mental warrior!",
                powerUp: "⚔️ BATTLE CRY: 'I am God's UNSTOPPABLE warrior! No weapon formed against me will prosper because I fight with divine power and holy confidence!'"
            },
            {
                title: "🚀 FAITH ROCKET LAUNCH",
                verse: "\"Now faith is confidence in what we hope for and assurance about what we do not see.\" - Hebrews 11:1",
                story: "Your faith is like a ROCKET SHIP! Every time you believe God for something impossible, you're literally launching into the supernatural realm. Today isn't ordinary - it's LAUNCH DAY for your dreams!",
                mission: "SKY-HIGH CHALLENGE: Pick one dream that seems too big and pray for it like it's already happening. Faith is your rocket fuel!",
                powerUp: "🚀 LAUNCH PRAYER: 'God, my faith is BLASTING OFF today! I believe You for miracles, breakthroughs, and adventures beyond my wildest imagination!'"
            }
        ];
        
        const randomDevotion = devotions[Math.floor(Math.random() * devotions.length)];
        
        const modalHTML = `
        <div class="modal fade" id="devotionModal" tabindex="-1" aria-labelledby="devotionModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content" style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); border: none; box-shadow: 0 20px 60px rgba(255,154,158,0.4);">
                    <div class="modal-header text-white" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none;">
                        <h4 class="modal-title" style="font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                            🌅 MORNING POWER-UP STATION
                        </h4>
                        <button type="button" class="btn-close btn-close-white" onclick="gameFeatures.closeModal('devotionModal')" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-white" style="padding: 30px;">
                        <div class="text-center mb-4">
                            <h2 style="font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); margin-bottom: 20px;">${randomDevotion.title}</h2>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.2); border-radius: 15px; padding: 25px; margin-bottom: 20px; backdrop-filter: blur(10px);">
                            <h5 style="color: #ffd700; font-weight: bold; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">⚡ POWER VERSE</h5>
                            <p style="font-size: 18px; font-weight: 500; font-style: italic; margin: 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">${randomDevotion.verse}</p>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.2); border-radius: 15px; padding: 25px; margin-bottom: 20px; backdrop-filter: blur(10px);">
                            <h5 style="color: #ffd700; font-weight: bold; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🎮 EPIC STORY</h5>
                            <p style="font-size: 16px; line-height: 1.6; margin: 0;">${randomDevotion.story}</p>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.2); border-radius: 15px; padding: 25px; margin-bottom: 20px; backdrop-filter: blur(10px);">
                            <h5 style="color: #ffd700; font-weight: bold; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🎯 TODAY'S MISSION</h5>
                            <p style="font-size: 16px; line-height: 1.6; margin: 0; font-weight: 500;">${randomDevotion.mission}</p>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.2); border-radius: 15px; padding: 25px; margin-bottom: 25px; backdrop-filter: blur(10px);">
                            <h5 style="color: #ffd700; font-weight: bold; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🙏 POWER-UP PRAYER</h5>
                            <p style="font-size: 16px; line-height: 1.6; margin: 0; font-weight: 500;">${randomDevotion.powerUp}</p>
                        </div>
                        
                        <div class="text-center">
                            <button onclick="gameFeatures.completeDevotion()" style="padding: 15px 40px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 25px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 8px 25px rgba(0,0,0,0.2); text-transform: uppercase; transition: all 0.3s ease;">
                                ⚡ MISSION COMPLETE ⚡
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    async openPrayerManager() {
        // Remove any existing simple modals first
        document.querySelectorAll('.simple-modal').forEach(el => el.remove());

        try {
            const response = await fetch('/api/gamified/prayer_manager');
            const data = await response.json();

            const modalHTML = `
            <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; border-radius: 12px; max-width: 700px; width: 90%; max-height: 85%; overflow-y: auto; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                    <div style="padding: 25px; border-bottom: 2px solid #ddd; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; justify-content: space-between; align-items: center; border-radius: 12px 12px 0 0;">
                        <h4 style="margin: 0; display: flex; align-items: center; font-weight: 600;"><span style="margin-right: 10px;">🙏</span>Prayer Manager</h4>
                        <button onclick="this.closest('.simple-modal').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 24px; cursor: pointer; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;">&times;</button>
                    </div>
                    <div style="padding: 25px;">
                        <!-- Prayer Categories -->
                        <div style="margin-bottom: 25px;">
                            <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
                                <button onclick="gameFeatures.filterPrayers('all')" class="prayer-filter active" data-filter="all" style="padding: 8px 16px; border: 2px solid #667eea; background: #667eea; color: white; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 500;">All Prayers</button>
                                <button onclick="gameFeatures.filterPrayers('personal')" class="prayer-filter" data-filter="personal" style="padding: 8px 16px; border: 2px solid #667eea; background: white; color: #667eea; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 500;">Personal</button>
                                <button onclick="gameFeatures.filterPrayers('family')" class="prayer-filter" data-filter="family" style="padding: 8px 16px; border: 2px solid #667eea; background: white; color: #667eea; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 500;">Family</button>
                                <button onclick="gameFeatures.filterPrayers('healing')" class="prayer-filter" data-filter="healing" style="padding: 8px 16px; border: 2px solid #667eea; background: white; color: #667eea; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 500;">Healing</button>
                                <button onclick="gameFeatures.filterPrayers('answered')" class="prayer-filter" data-filter="answered" style="padding: 8px 16px; border: 2px solid #28a745; background: white; color: #28a745; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 500;">Answered</button>
                            </div>
                        </div>

                        <!-- Add New Prayer -->
                        <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 25px; border: 2px dashed #dee2e6;">
                            <h6 style="margin: 0 0 15px 0; color: #495057; font-weight: 600;">Add New Prayer Request</h6>
                            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                                <input type="text" id="prayer-title" placeholder="Prayer title (e.g., Mom's health)" style="flex: 2; padding: 12px; border: 1px solid #dee2e6; border-radius: 8px; font-size: 14px;">
                                <select id="prayer-category" style="flex: 1; padding: 12px; border: 1px solid #dee2e6; border-radius: 8px; font-size: 14px;">
                                    <option value="personal">Personal</option>
                                    <option value="family">Family</option>
                                    <option value="healing">Healing</option>
                                    <option value="guidance">Guidance</option>
                                    <option value="gratitude">Gratitude</option>
                                </select>
                            </div>
                            <textarea id="prayer-details" placeholder="Prayer details (optional)" style="width: 100%; padding: 12px; border: 1px solid #dee2e6; border-radius: 8px; min-height: 80px; resize: vertical; font-size: 14px; font-family: inherit;"></textarea>
                            <button onclick="gameFeatures.addPrayerRequest()" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">Add to Prayer List</button>
                        </div>

                        <!-- Prayer List -->
                        <div id="prayer-list" style="max-height: 300px; overflow-y: auto;">
                            ${data.prayers && data.prayers.length > 0 ? 
                                data.prayers.map(prayer => `
                                <div class="prayer-item" data-category="${prayer.category}" style="background: white; border: 1px solid #e9ecef; border-radius: 10px; padding: 18px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                        <div>
                                            <h6 style="margin: 0 0 5px 0; color: #495057; font-weight: 600;">${prayer.title}</h6>
                                            <small style="color: #6c757d; background: #f8f9fa; padding: 3px 8px; border-radius: 12px; font-size: 11px; text-transform: uppercase; font-weight: 500;">${prayer.category}</small>
                                        </div>
                                        <div style="display: flex; gap: 8px;">
                                            ${prayer.answered ? 
                                                `<span style="background: #d4edda; color: #155724; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">✓ Answered</span>` : 
                                                `<button onclick="gameFeatures.markPrayerAnswered('${prayer.id}')" style="background: #28a745; color: white; border: none; padding: 4px 8px; border-radius: 12px; font-size: 11px; cursor: pointer;">Mark Answered</button>`
                                            }
                                            <button onclick="gameFeatures.deletePrayer('${prayer.id}')" style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 12px; font-size: 11px; cursor: pointer;">Delete</button>
                                            <button onclick="gameFeatures.sharePrayer('${prayer.id}')" style="background: #6f42c1; color: white; border: none; padding: 4px 8px; border-radius: 12px; font-size: 11px; cursor: pointer;">Share</button>
                                        </div>
                                    </div>
                                    ${prayer.details ? `<p style="margin: 10px 0 0 0; color: #6c757d; font-size: 14px; line-height: 1.5;">${prayer.details}</p>` : ''}
                                    <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                                        <small style="color: #adb5bd;">Added ${prayer.date_added}</small>
                                        ${prayer.answered ? `<small style="color: #28a745;">Answered ${prayer.date_answered}</small>` : ''}
                                    </div>
                                </div>
                                `).join('') : 
                                '<div style="text-align: center; color: #6c757d; padding: 40px;"><div style="font-size: 48px; margin-bottom: 15px;">🙏</div><p style="margin: 0;">No prayer requests yet. Add your first prayer above!</p></div>'
                            }
                        </div>

                        <!-- Prayer Stats -->
                        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 10px; padding: 20px; margin-top: 25px;">
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 20px; text-align: center;">
                                <div>
                                    <div style="font-size: 24px; font-weight: bold; color: #667eea;">${data.stats?.total || 0}</div>
                                    <small style="color: #6c757d; font-weight: 500;">Total Prayers</small>
                                </div>
                                <div>
                                    <div style="font-size: 24px; font-weight: bold; color: #28a745;">${data.stats?.answered || 0}</div>
                                    <small style="color: #6c757d; font-weight: 500;">Answered</small>
                                </div>
                                <div>
                                    <div style="font-size: 24px; font-weight: bold; color: #ffc107;">${data.stats?.active || 0}</div>
                                    <small style="color: #6c757d; font-weight: 500;">Active</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
        } catch (error) {
            console.error('Failed to load prayer manager:', error);
            const fallbackHTML = `
            <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; border-radius: 12px; max-width: 500px; width: 90%; padding: 30px; text-align: center;">
                    <h4 style="color: #667eea; margin-bottom: 15px;">🙏 Prayer Manager</h4>
                    <p style="color: #6c757d; margin-bottom: 20px;">Starting your prayer journey...</p>
                    <button onclick="this.closest('.simple-modal').remove()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">Close</button>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', fallbackHTML);
        }
    }

    async openPrayerChallenge() {
        // Remove any existing simple modals first
        document.querySelectorAll('.simple-modal').forEach(el => el.remove());
        
        try {
            const response = await fetch('/api/gamified/daily_trivia');
            const data = await response.json();
            
            if (data.success) {
                const trivia = data.trivia;
                
                const modalHTML = `
                <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                    <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 15px; max-width: 450px; width: 90%; max-height: 80%; overflow-y: auto; position: relative; color: white; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
                        <!-- Header -->
                        <div style="padding: 20px; border-bottom: 2px solid #ffd700; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); display: flex; justify-content: space-between; align-items: center; border-radius: 15px 15px 0 0;">
                            <h5 style="margin: 0; font-weight: bold;">⚔️ Daily Bible Quest</h5>
                            <button onclick="this.closest('.simple-modal').remove()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; opacity: 0.8; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'">&times;</button>
                        </div>
                        
                        <!-- Question Section -->
                        <div style="padding: 25px 20px;">
                            <div style="text-align: center; margin-bottom: 20px;">
                                <div style="background: white; color: #2d3748; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                    🏆 Bible Trivia #1
                                </div>
                                <h4 style="margin: 0; line-height: 1.4; color: #fff; font-size: 18px;">${trivia.question}</h4>
                            </div>
                            
                            <!-- Answer Options -->
                            <div style="margin-bottom: 25px;">
                                ${trivia.options.map((option, index) => `
                                    <button onclick="gameFeatures.submitTriviaAnswer('${option}')" 
                                            style="display: block; width: 100%; margin: 10px 0; padding: 15px; background: #2d3748; color: white; border: 2px solid #4a5568; border-radius: 10px; cursor: pointer; font-size: 16px; text-align: left; transition: all 0.3s; position: relative;" 
                                            onmouseover="this.style.background='#4a5568'; this.style.borderColor='#ffd700'; this.style.transform='translateX(5px)'" 
                                            onmouseout="this.style.background='#2d3748'; this.style.borderColor='#4a5568'; this.style.transform='translateX(0)'">
                                        <span style="background: #ffd700; color: #1a1a2e; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-weight: bold;">${String.fromCharCode(65 + index)}</span>
                                        ${option}
                                    </button>
                                `).join('')}
                            </div>
                            
                            <!-- Timer -->
                            <div style="text-align: center; margin-bottom: 15px;">
                                <div style="background: rgba(255,215,0,0.2); border: 2px solid #ffd700; border-radius: 10px; padding: 10px; display: inline-block;">
                                    <span style="font-size: 14px; color: #ffd700; font-weight: bold;">⏱️ Time Remaining: </span>
                                    <span id="trivia-timer" style="font-size: 18px; color: #fff; font-weight: bold;">30</span>
                                    <span style="font-size: 14px; color: #ffd700;"> seconds</span>
                                </div>
                            </div>
                            
                            <!-- Hidden data -->
                            <input type="hidden" id="correct-answer" value="${trivia.correct_answer}">
                            <input type="hidden" id="trivia-explanation" value="${trivia.explanation}">
                        </div>
                    </div>
                </div>`;
                
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                
                // Start 30-second timer
                this.startTriviaTimer();
            }
        } catch (error) {
            console.error('Failed to load daily trivia:', error);
            alert('Failed to load Bible trivia. Please try again.');
        }
    }

    startTriviaTimer() {
        let timeLeft = 30;
        const timerElement = document.getElementById('trivia-timer');
        
        const countdown = setInterval(() => {
            timeLeft--;
            if (timerElement) {
                timerElement.textContent = timeLeft;
                
                // Change color as time runs out
                if (timeLeft <= 10) {
                    timerElement.style.color = '#ff6b6b';
                } else if (timeLeft <= 20) {
                    timerElement.style.color = '#ffc107';
                }
            }
            
            if (timeLeft <= 0) {
                clearInterval(countdown);
                this.handleTriviaTimeout();
            }
        }, 1000);
        
        // Store interval ID for cleanup
        window.triviaTimer = countdown;
    }

    handleTriviaTimeout() {
        const correctAnswer = document.getElementById('correct-answer')?.value || 'Unknown';
        const explanation = document.getElementById('trivia-explanation')?.value || 'Time\'s up!';
        
        this.showTriviaResult(false, correctAnswer, explanation, 'Time\'s up! But don\'t worry - every attempt makes you stronger in faith!');
    }

    async submitTriviaAnswer(selectedAnswer) {
        // Clear the timer
        if (window.triviaTimer) {
            clearInterval(window.triviaTimer);
        }
        
        const correctAnswer = document.getElementById('correct-answer')?.value || '';
        const explanation = document.getElementById('trivia-explanation')?.value || '';
        
        const isCorrect = selectedAnswer.trim() === correctAnswer.trim();
        
        try {
            // Submit the answer to backend
            const response = await fetch('/api/gamified/submit_trivia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    answer: selectedAnswer,
                    correct: isCorrect
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                const encouragement = isCorrect ? 
                    'Outstanding! You\'re a Bible knowledge champion!' : 
                    'Great effort! Every question teaches us something new about God\'s word.';
                
                this.showTriviaResult(isCorrect, correctAnswer, explanation, encouragement);
                
                if (isCorrect && result.xp_gained) {
                    // Show XP reward
                    setTimeout(() => {
                        result.activityType = 'trivia';
                        this.showReward(result);
                        this.loadUserProgress();
                    }, 2000);
                }
            }
        } catch (error) {
            console.error('Failed to submit trivia answer:', error);
            this.showTriviaResult(isCorrect, correctAnswer, explanation, 'Answer submitted! Keep growing in Bible knowledge!');
        }
    }

    showTriviaResult(isCorrect, correctAnswer, explanation, encouragement) {
        const modal = document.querySelector('.simple-modal');
        if (!modal) return;
        
        const resultHTML = `
        <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 15px; max-width: 450px; width: 90%; max-height: 80%; overflow-y: auto; position: relative; color: white; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
            <!-- Header -->
            <div style="padding: 20px; border-bottom: 2px solid #ffd700; background: ${isCorrect ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)'}; display: flex; justify-content: space-between; align-items: center; border-radius: 15px 15px 0 0;">
                <h5 style="margin: 0; font-weight: bold;">${isCorrect ? '🎉 Correct!' : '📚 Learn & Grow'}</h5>
                <button onclick="this.closest('.simple-modal').remove()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; opacity: 0.8; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'">&times;</button>
            </div>
            
            <!-- Result Section -->
            <div style="padding: 25px 20px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 20px;">
                    ${isCorrect ? '🏆' : '📖'}
                </div>
                
                <h4 style="margin-bottom: 15px; color: ${isCorrect ? '#28a745' : '#ffc107'};">
                    ${isCorrect ? 'Bible Champion!' : 'Keep Learning!'}
                </h4>
                
                <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.5;">
                    ${encouragement}
                </p>
                
                ${!isCorrect ? `
                <div style="background: rgba(255,215,0,0.2); border: 2px solid #ffd700; border-radius: 10px; padding: 15px; margin-bottom: 20px; text-align: left;">
                    <h6 style="color: #ffd700; margin-bottom: 10px; font-weight: bold;">📝 Correct Answer:</h6>
                    <p style="margin: 0 0 10px 0; font-size: 16px;">${correctAnswer}</p>
                    <h6 style="color: #ffd700; margin: 10px 0; font-weight: bold;">💡 Learn More:</h6>
                    <p style="margin: 0; font-size: 14px; line-height: 1.4;">${explanation}</p>
                </div>
                ` : `
                <div style="background: rgba(40,167,69,0.2); border: 2px solid #28a745; border-radius: 10px; padding: 15px; margin-bottom: 20px;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.4;">${explanation}</p>
                </div>
                `}
                
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="gameFeatures.openPrayerChallenge()" style="padding: 12px 20px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: bold;">
                        🎯 Try Another
                    </button>
                    <button onclick="this.closest('.simple-modal').remove()" style="padding: 12px 20px; background: #6c757d; color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: bold;">
                        Done
                    </button>
                </div>
            </div>
        </div>`;
        
        modal.innerHTML = resultHTML;
    }

    async completePrayerChallenge() {
        try {
            const response = await fetch('/api/gamified/complete_prayer_challenge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const result = await response.json();
                result.activityType = 'prayer';
                this.showReward(result);
                this.closeModal('prayerChallengeModal');
                this.loadUserProgress();
            }
        } catch (error) {
            console.error('Failed to complete prayer challenge:', error);
        }
    }

    async completeSimplePrayer() {
        try {
            const response = await fetch('/api/gamified/complete_prayer_challenge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const result = await response.json();
                result.activityType = 'prayer';
                this.showReward(result);
                document.querySelector('.simple-modal')?.remove();
                this.loadUserProgress();
            }
        } catch (error) {
            alert('Failed to complete prayer challenge. Please try again.');
        }
    }

    createPrayerChallengeModal() {
        // Generate epic prayer quest content
        const prayerQuests = [
            {
                title: "🎯 MIRACLE MAGNET MISSION",
                objective: "Become a supernatural magnet for God's miracles!",
                challenge: "Today's challenge: Pray for 3 IMPOSSIBLE things like you already have them! Act like a miracle magnet - God loves bold faith that expects the extraordinary!",
                quest: "YOUR EPIC QUEST: \n1. Find someone who needs a breakthrough \n2. Pray WITH them (not just for them) \n3. Expect God to blow your minds! \n\nYou're not just asking - you're COMMANDING miracles in Jesus' name!",
                reward: "🏆 MIRACLE WARRIOR BADGE unlocked when completed!",
                powerPrayer: "🚀 QUEST PRAYER: 'God, I'm activating MIRACLE MODE today! I believe for impossible breakthroughs, supernatural provision, and mind-blowing answers to prayer. Let's shock the world with Your power!'"
            },
            {
                title: "⚔️ STRONGHOLD CRUSHER QUEST",
                objective: "Demolish the enemy's plans with powerful warfare prayers!",
                challenge: "Time for SPIRITUAL WARFARE! You're going into battle mode to destroy every lie, fear, and attack trying to mess with you or your loved ones. This isn't just prayer - this is WAR!",
                quest: "BATTLE STRATEGY: \n1. Identify one fear or worry attacking your mind \n2. DECLARE God's truth over it 5 times \n3. Pray protection over your family \n4. Bind every evil plan in Jesus' name! \n\nYou have the authority - USE IT!",
                reward: "⚔️ STRONGHOLD DESTROYER BADGE - You're a certified spiritual warrior!",
                powerPrayer: "⚔️ WARFARE PRAYER: 'In Jesus' mighty name, I DEMOLISH every stronghold! I bind fear, anxiety, and every demonic attack. God's power flows through me like lightning - the enemy has NO POWER here!'"
            },
            {
                title: "🌟 BLESSING BOMBER ADVENTURE",
                objective: "Carpet bomb your world with God's blessings!",
                challenge: "You're on a BLESSING BOMBING MISSION! Instead of just asking for stuff, you're going to EXPLODE blessings everywhere you go. Make people's day with supernatural favor!",
                quest: "BOMBING STRATEGY: \n1. Pick 5 people to bless today \n2. Pray for their dreams to come true \n3. Speak words of life over them \n4. Watch God use you as His blessing delivery system! \n\nYou're a walking miracle zone!",
                reward: "🌟 BLESSING BOMBER BADGE - You spread God's favor everywhere!",
                powerPrayer: "🌟 BOMBER PRAYER: 'God, load me up with blessings to drop on everyone I meet! Make me a supernatural blessing bomber who leaves trails of Your favor, joy, and breakthrough wherever I go!'"
            }
        ];
        
        const randomQuest = prayerQuests[Math.floor(Math.random() * prayerQuests.length)];
        
        const modalHTML = `
        <div class="modal fade" id="prayerChallengeModal" tabindex="-1" aria-labelledby="prayerChallengeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); border: none; box-shadow: 0 20px 60px rgba(255,107,107,0.4);">
                    <div class="modal-header text-white" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none;">
                        <h4 class="modal-title" style="font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                            🎯 PRAYER QUEST HEADQUARTERS
                        </h4>
                        <button type="button" class="btn-close btn-close-white" onclick="gameFeatures.closeModal('prayerChallengeModal')" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-white" style="padding: 30px;">
                        <div class="text-center mb-4">
                            <h2 style="font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); margin-bottom: 10px;">${randomQuest.title}</h2>
                            <p style="font-size: 18px; font-weight: 500; margin: 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">${randomQuest.objective}</p>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.2); border-radius: 15px; padding: 25px; margin-bottom: 20px; backdrop-filter: blur(10px);">
                            <h5 style="color: #ffd700; font-weight: bold; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">💥 CHALLENGE BRIEFING</h5>
                            <p style="font-size: 16px; line-height: 1.6; margin: 0;">${randomQuest.challenge}</p>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.2); border-radius: 15px; padding: 25px; margin-bottom: 20px; backdrop-filter: blur(10px);">
                            <h5 style="color: #ffd700; font-weight: bold; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🗺️ QUEST MAP</h5>
                            <p style="font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-line; font-weight: 500;">${randomQuest.quest}</p>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.2); border-radius: 15px; padding: 25px; margin-bottom: 20px; backdrop-filter: blur(10px);">
                            <h5 style="color: #ffd700; font-weight: bold; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🏆 EPIC REWARD</h5>
                            <p style="font-size: 16px; line-height: 1.6; margin: 0; font-weight: 500;">${randomQuest.reward}</p>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.2); border-radius: 15px; padding: 25px; margin-bottom: 25px; backdrop-filter: blur(10px);">
                            <h5 style="color: #ffd700; font-weight: bold; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🙏 POWER PRAYER</h5>
                            <p style="font-size: 16px; line-height: 1.6; margin: 0; font-weight: 500;">${randomQuest.powerPrayer}</p>
                        </div>
                        
                        <div class="text-center">
                            <button onclick="gameFeatures.completePrayerChallenge()" style="padding: 15px 40px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 25px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 8px 25px rgba(0,0,0,0.2); text-transform: uppercase; transition: all 0.3s ease;">
                                🎯 QUEST COMPLETE 🎯
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Prayer Manager Helper Functions
    filterPrayers(category) {
        const filters = document.querySelectorAll('.prayer-filter');
        const prayers = document.querySelectorAll('.prayer-item');
        
        // Update filter buttons
        filters.forEach(btn => {
            if (btn.dataset.filter === category) {
                btn.style.background = '#667eea';
                btn.style.color = 'white';
                btn.classList.add('active');
            } else {
                btn.style.background = 'white';
                btn.style.color = '#667eea';
                btn.classList.remove('active');
            }
        });
        
        // Filter prayers
        prayers.forEach(prayer => {
            if (category === 'all' || prayer.dataset.category === category) {
                prayer.style.display = 'block';
            } else {
                prayer.style.display = 'none';
            }
        });
    }

    async addPrayerRequest() {
        const title = document.getElementById('prayer-title').value.trim();
        const category = document.getElementById('prayer-category').value;
        const details = document.getElementById('prayer-details').value.trim();
        
        if (!title) {
            alert('Please enter a prayer title');
            return;
        }
        
        try {
            const response = await fetch('/api/gamified/add_prayer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, category, details })
            });
            
            if (response.ok) {
                // Clear form
                document.getElementById('prayer-title').value = '';
                document.getElementById('prayer-details').value = '';
                
                // Refresh prayer manager
                document.querySelector('.simple-modal').remove();
                this.openPrayerManager();
                
                // Show success
                this.showReward({ xp_earned: 1, message: 'Prayer added to your list!' });
            }
        } catch (error) {
            console.error('Failed to add prayer:', error);
        }
    }

    async markPrayerAnswered(prayerId) {
        try {
            const response = await fetch('/api/gamified/answer_prayer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prayer_id: prayerId })
            });
            
            if (response.ok) {
                // Refresh prayer manager
                document.querySelector('.simple-modal').remove();
                this.openPrayerManager();
                
                // Show celebration
                this.showReward({ xp_earned: 2, message: 'Praise God! Prayer marked as answered!' });
            }
        } catch (error) {
            console.error('Failed to mark prayer as answered:', error);
        }
    }

    async deletePrayer(prayerId) {
        if (confirm('Are you sure you want to delete this prayer?')) {
            try {
                const response = await fetch('/api/gamified/delete_prayer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prayer_id: prayerId })
                });
                
                if (response.ok) {
                    // Refresh prayer manager
                    document.querySelector('.simple-modal').remove();
                    this.openPrayerManager();
                }
            } catch (error) {
                console.error('Failed to delete prayer:', error);
            }
        }
    }

    sharePrayer(prayerId) {
        // Simple sharing - can be enhanced with actual sharing APIs
        const shareText = "Please pray with me about this request 🙏";
        if (navigator.share) {
            navigator.share({
                title: 'Prayer Request',
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText);
            alert('Prayer sharing text copied to clipboard!');
        }
    }

    async openPrayerTraining() {
        try {
            console.log('Opening Prayer Arena...');
            
            // Remove any existing modals
            document.querySelectorAll('.simple-modal').forEach(el => el.remove());
            
            // Start activity tracking
            if (window.activityTracker) {
                window.activityTracker.startTracking('prayer');
            }
            
            // Get prayer card from server
            const response = await fetch('/api/gamified/prayer_card');
            const cardData = await response.json();
            
            this.displayPrayerCard(cardData);
            
        } catch (error) {
            console.error('Failed to open Prayer Arena:', error);
        }
    }
    
    displayPrayerCard(cardData) {
        const card = cardData.card;
        
        const modalHTML = `
        <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
            <div style="background: white; border-radius: 20px; max-width: 500px; width: 90%; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, ${card.color}, ${card.color}dd); color: white; padding: 25px; text-align: center; position: relative;">
                    <button onclick="this.closest('.simple-modal').remove()" style="position: absolute; top: 15px; right: 20px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 24px; cursor: pointer; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;">&times;</button>
                    <div style="font-size: 2.5rem; margin-bottom: 10px;">${card.icon}</div>
                    <h3 style="margin: 0; font-weight: bold;">${card.title}</h3>
                </div>
                
                <!-- Scripture Section -->
                <div style="padding: 25px 30px 20px; background: #f8fafc;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h6 style="color: ${card.color}; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">📖 Scripture</h6>
                        <p style="font-style: italic; font-size: 16px; line-height: 1.6; color: #374151; margin: 0;">"${card.scripture_text}"</p>
                        <p style="color: #6b7280; font-size: 14px; font-weight: 500; margin-top: 8px;">- ${card.scripture_reference}</p>
                    </div>
                </div>
                
                <!-- Prayer Section -->
                <div style="padding: 20px 30px 30px; background: white;">
                    <h6 style="color: ${card.color}; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; text-align: center;">🙏 Prayer Prompt</h6>
                    <div style="background: #f9fafb; border-left: 4px solid ${card.color}; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                        <p style="color: #374151; line-height: 1.7; margin: 0; font-size: 15px;">${card.prayer_prompt}</p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                        <button onclick="gameFeatures.speakPrayerAloud('${card.id}')" style="flex: 1; padding: 12px 16px; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 10px; font-weight: 500; cursor: pointer; font-size: 14px;">
                            🔊 Speak Aloud
                        </button>
                        <button onclick="gameFeatures.openJournalReflection('${card.id}')" style="flex: 1; padding: 12px 16px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; border-radius: 10px; font-weight: 500; cursor: pointer; font-size: 14px;">
                            📝 Journal It
                        </button>
                    </div>
                    
                    <!-- Complete Button -->
                    <button onclick="gameFeatures.completePrayerCard('${card.id}')" style="width: 100%; padding: 15px; background: linear-gradient(135deg, ${card.color}, ${card.color}dd); color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                        ✨ Complete Prayer (+3 XP)
                    </button>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    async speakPrayerAloud(cardId) {
        // Find the prayer text and speak it
        const prayerText = document.querySelector('.simple-modal p').textContent;
        
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(prayerText);
            utterance.rate = 0.8;
            utterance.volume = 0.7;
            utterance.pitch = 1.0;
            
            const voices = speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => 
                voice.name.includes('Google') || 
                voice.name.includes('Microsoft') ||
                voice.lang.includes('en')
            );
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            
            speechSynthesis.speak(utterance);
            
            // Visual feedback
            const button = event.target;
            button.textContent = '🔊 Speaking...';
            button.style.background = 'linear-gradient(135deg, #059669, #047857)';
            
            utterance.onend = () => {
                button.textContent = '🔊 Speak Aloud';
                button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            };
        } else {
            alert('Speech synthesis not supported in this browser.');
        }
    }
    
    openJournalReflection(cardId) {
        // Find the current modal content and add journal section
        const modal = document.querySelector('.simple-modal');
        const modalContent = modal.querySelector('div[style*="background: white"]');
        
        const journalHTML = `
        <div style="margin-top: 20px; padding: 20px; background: #fef3c7; border-radius: 12px; border: 2px solid #f59e0b;">
            <h6 style="color: #d97706; font-weight: bold; margin-bottom: 12px;">📝 Journal Your Prayer</h6>
            <textarea id="prayer-journal-${cardId}" placeholder="Write your personal prayer or reflection..." style="width: 100%; min-height: 100px; padding: 12px; border: 1px solid #fbbf24; border-radius: 8px; font-family: inherit; font-size: 14px; line-height: 1.5; resize: vertical;"></textarea>
            <button onclick="gameFeatures.savePrayerJournal('${cardId}')" style="margin-top: 10px; padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">
                💾 Save to Journal
            </button>
        </div>`;
        
        // Insert before the complete button
        const completeButton = modalContent.querySelector('button[onclick*="completePrayerCard"]');
        completeButton.insertAdjacentHTML('beforebegin', journalHTML);
        
        // Scroll to journal area
        document.getElementById(`prayer-journal-${cardId}`).scrollIntoView({ behavior: 'smooth' });
        document.getElementById(`prayer-journal-${cardId}`).focus();
    }
    
    savePrayerJournal(cardId) {
        const journalText = document.getElementById(`prayer-journal-${cardId}`).value;
        
        if (journalText.trim()) {
            // Save to localStorage as a simple journal system
            const journalEntries = JSON.parse(localStorage.getItem('prayerJournal') || '[]');
            journalEntries.push({
                id: Date.now(),
                cardId: cardId,
                text: journalText,
                date: new Date().toLocaleDateString()
            });
            localStorage.setItem('prayerJournal', JSON.stringify(journalEntries));
            
            // Visual feedback
            const button = event.target;
            button.textContent = '✅ Saved!';
            button.style.background = '#10b981';
            
            setTimeout(() => {
                button.textContent = '💾 Save to Journal';
                button.style.background = '#f59e0b';
            }, 2000);
        } else {
            alert('Please write something in your journal first.');
        }
    }
    
    async completePrayerCard(cardId) {
        // Stop activity tracking and get metadata
        let activityMetadata = {};
        if (window.activityTracker) {
            activityMetadata = window.activityTracker.stopTracking();
        }
        
        try {
            const response = await fetch('/api/gamified/complete_prayer_card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    card_id: cardId,
                    metadata: activityMetadata
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                
                if (result.success) {
                    // Show animated progress ring
                    this.showPrayerCompletionReward(result);
                    
                    // Close current modal
                    document.querySelector('.simple-modal')?.remove();
                    
                    // Show mirror card option after short delay
                    setTimeout(() => {
                        this.showMirrorCardOption();
                    }, 2000);
                    
                    // Update progress
                    this.loadUserProgress();
                }
            }
        } catch (error) {
            console.error('Failed to complete prayer card:', error);
        }
    }
    
    showPrayerCompletionReward(result) {
        const rewardHTML = `
        <div class="prayer-reward" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 40px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); z-index: 10002; text-align: center; max-width: 400px;">
            <div class="progress-ring" style="position: relative; width: 120px; height: 120px; margin: 0 auto 20px;">
                <svg width="120" height="120" style="transform: rotate(-90deg);">
                    <circle cx="60" cy="60" r="50" fill="transparent" stroke="#e5e7eb" stroke-width="8"/>
                    <circle cx="60" cy="60" r="50" fill="transparent" stroke="#10b981" stroke-width="8" 
                            stroke-dasharray="314" stroke-dashoffset="0" 
                            style="animation: progressRing 2s ease-out;">
                    </circle>
                </svg>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2rem;">
                    ${result.badge_icon}
                </div>
            </div>
            <h4 style="color: #10b981; margin-bottom: 10px;">Prayer Complete!</h4>
            <p style="color: #6b7280; margin-bottom: 15px;">${result.message}</p>
            <div style="background: #f0fdf4; border: 2px solid #10b981; border-radius: 10px; padding: 15px; margin-bottom: 20px;">
                <p style="color: #15803d; font-weight: bold; margin: 0;">+${result.xp_earned} XP earned</p>
                ${result.engagement_bonus > 0 ? `<p style="color: #059669; font-size: 14px; margin: 5px 0 0 0;">+${result.engagement_bonus} bonus for authentic engagement!</p>` : ''}
            </div>
        </div>
        <style>
        @keyframes progressRing {
            from { stroke-dashoffset: 314; }
            to { stroke-dashoffset: 0; }
        }
        </style>`;
        
        document.body.insertAdjacentHTML('beforeend', rewardHTML);
        
        // Remove after 3 seconds
        setTimeout(() => {
            document.querySelector('.prayer-reward')?.remove();
        }, 3000);
    }
    
    showMirrorCardOption() {
        const mirrorHTML = `
        <div class="mirror-card-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; border-radius: 20px; max-width: 450px; width: 90%; padding: 30px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <div style="font-size: 3rem; margin-bottom: 15px;">🤲</div>
                <h4 style="color: #374151; margin-bottom: 15px;">Pray for Someone Else?</h4>
                <p style="color: #6b7280; margin-bottom: 25px; line-height: 1.6;">You've just experienced God's presence in prayer. Would you like to extend that blessing to someone else?</p>
                
                <div style="display: flex; gap: 12px;">
                    <button onclick="gameFeatures.openMirrorPrayer()" style="flex: 1; padding: 12px 20px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; border: none; border-radius: 10px; font-weight: 500; cursor: pointer;">
                        🙏 Yes, Pray for Others
                    </button>
                    <button onclick="this.closest('.mirror-card-modal').remove()" style="flex: 1; padding: 12px 20px; background: #6b7280; color: white; border: none; border-radius: 10px; font-weight: 500; cursor: pointer;">
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', mirrorHTML);
    }
    
    async openMirrorPrayer() {
        // Close mirror card modal
        document.querySelector('.mirror-card-modal')?.remove();
        
        try {
            const response = await fetch('/api/gamified/mirror_card');
            const mirrorData = await response.json();
            
            this.displayMirrorCard(mirrorData.card);
        } catch (error) {
            console.error('Failed to load mirror card:', error);
        }
    }
    
    displayMirrorCard(card) {
        const modalHTML = `
        <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; border-radius: 20px; max-width: 450px; width: 90%; padding: 30px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <button onclick="this.closest('.simple-modal').remove()" style="position: absolute; top: 15px; right: 20px; background: rgba(0,0,0,0.1); border: none; color: #6b7280; font-size: 24px; cursor: pointer; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;">&times;</button>
                
                <div style="font-size: 3rem; margin-bottom: 15px; color: ${card.color};">${card.icon}</div>
                <h4 style="color: #374151; margin-bottom: 15px;">${card.title}</h4>
                <p style="color: #6b7280; margin-bottom: 25px; line-height: 1.6;">${card.prompt}</p>
                
                <textarea id="mirror-prayer-text" placeholder="Write a prayer for someone special..." style="width: 100%; min-height: 100px; padding: 15px; border: 2px solid #e5e7eb; border-radius: 10px; font-family: inherit; font-size: 14px; line-height: 1.5; margin-bottom: 20px; resize: vertical;"></textarea>
                
                <button onclick="gameFeatures.completeMirrorPrayer()" style="width: 100%; padding: 15px; background: linear-gradient(135deg, ${card.color}, ${card.color}dd); color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 16px;">
                    🤲 Send This Prayer (+2 XP)
                </button>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById('mirror-prayer-text').focus();
    }
    
    async completeMirrorPrayer() {
        const prayerText = document.getElementById('mirror-prayer-text').value.trim();
        
        if (!prayerText) {
            alert('Please write a prayer first.');
            return;
        }
        
        try {
            const response = await fetch('/api/gamified/complete_mirror_prayer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prayer_text: prayerText })
            });
            
            if (response.ok) {
                const result = await response.json();
                this.showReward(result);
                document.querySelector('.simple-modal')?.remove();
                this.loadUserProgress();
            }
        } catch (error) {
            console.error('Failed to complete mirror prayer:', error);
        }
    }

    async openPrayerArena() {
        // Legacy function - redirect to new prayer training
        return this.openPrayerTraining();
    }

    async oldOpenPrayerTraining() {
        try {
            console.log('Opening Prayer Training Camp...');
            
            // Prayer challenges that teach HOW to pray
            const prayerChallenges = [
                {
                    title: "⚡ SAVAGE FORGIVENESS",
                    challenge: "Level Up Your Heart Game",
                    description: "Forgiveness isn't weakness - it's your superpower unlocking!",
                    instruction: "1. Think of someone who's been on your mind (not in a good way)\n2. Pray: 'God, I choose to release [their name]'\n3. Ask God to bless them in a way that would actually make them happy\n4. Notice how much lighter you feel",
                    points: 3,
                    difficulty: "Heart Warrior",
                    icon: "⚡"
                },
                {
                    title: "💫 GRATITUDE GAME-CHANGER",
                    challenge: "Find the Hidden Blessings",
                    description: "Turn your perspective upside down with gratitude that hits different!",
                    instruction: "1. Think of something that stressed you out this week\n2. Find ONE thing you can be grateful for about it\n3. Thank God for using even tough stuff for good\n4. Say 'Thank You' for 3 more random things you see right now",
                    points: 2,
                    difficulty: "Mindset Shifter", 
                    icon: "💫"
                },
                {
                    title: "🚀 DREAM BIG PRAYER",
                    challenge: "Manifest Your God-Given Vision",
                    description: "God wants to do something incredible through you - let's unlock it!",
                    instruction: "1. Close your eyes and imagine your life 5 years from now\n2. What impact are you making? What's different?\n3. Pray: 'God, this vision feels huge but I trust You'\n4. Ask Him to show you the first step today",
                    points: 4,
                    difficulty: "Visionary",
                    icon: "🚀"
                },
                {
                    title: "🛡️ PROTECTION MODE ACTIVATED",
                    challenge: "Cover Your People",
                    description: "Be the spiritual bodyguard your loved ones need!",
                    instruction: "1. Pick someone you'd take a bullet for\n2. Pray: 'God, put a supernatural hedge around [name]'\n3. Ask for wisdom in their decisions today\n4. Speak peace over their mind and energy over their body",
                    points: 3,
                    difficulty: "Guardian",
                    icon: "🛡️"
                },
                {
                    title: "🔥 BREAKTHROUGH ACTIVATOR",
                    challenge: "Unlock Someone's Next Level",
                    description: "Your prayers can literally shift someone's reality!",
                    instruction: "1. Think of someone stuck in a situation\n2. Pray: 'God, I see [name] breaking through this'\n3. Declare: 'Every door they need WILL open'\n4. Thank God for the victory that's already coming",
                    points: 4,
                    difficulty: "Reality Shifter",
                    icon: "🔥"
                },
                {
                    title: "💝 SELF-LOVE ACTIVATION",
                    challenge: "Pray For Yourself Like You Matter",
                    description: "Stop neglecting the person God loves most - YOU!",
                    instruction: "1. Look in a mirror and say 'God loves this person'\n2. Pray: 'God, help me see myself through Your eyes'\n3. Ask for confidence to walk in your purpose\n4. Thank Him for making you exactly who you are",
                    points: 2,
                    difficulty: "Self-Care Warrior",
                    icon: "💝"
                }
            ];
            
            const randomChallenge = prayerChallenges[Math.floor(Math.random() * prayerChallenges.length)];
            
            const modalHTML = `
            <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; border-radius: 20px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 25px 20px; text-align: center; position: relative; border-radius: 20px 20px 0 0;">
                        <div style="font-size: 3.5rem; color: white; margin-bottom: 5px;">⚡</div>
                        <h4 style="color: white; margin: 0; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">Prayer Training Camp</h4>
                        <p style="color: rgba(255,255,255,0.95); margin: 5px 0 0 0; font-size: 14px;">Level up your prayer game!</p>
                        <button onclick="this.closest('.simple-modal').remove()" style="position: absolute; top: 15px; right: 20px; background: none; border: none; color: white; font-size: 24px; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='none'">×</button>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 30px;">
                        <!-- Today's Challenge -->
                        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 15px; padding: 25px; margin-bottom: 25px; border: 2px solid #667eea;">
                            <div style="text-align: center; margin-bottom: 20px;">
                                <div style="font-size: 4rem; margin-bottom: 10px;">${randomChallenge.icon}</div>
                                <h4 style="color: #2d3748; margin: 0; font-weight: bold;">${randomChallenge.title}</h4>
                                <div style="background: #667eea; color: white; padding: 4px 12px; border-radius: 15px; display: inline-block; font-size: 12px; font-weight: bold; margin-top: 8px;">
                                    ${randomChallenge.difficulty} • +${randomChallenge.points} Points
                                </div>
                            </div>
                            
                            <h5 style="color: #2d3748; margin-bottom: 10px; font-weight: bold;">🎯 ${randomChallenge.challenge}</h5>
                            <p style="color: #4a5568; margin-bottom: 20px; font-size: 16px; line-height: 1.5;">${randomChallenge.description}</p>
                            
                            <div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
                                <h6 style="color: #667eea; margin-bottom: 15px; font-weight: bold;">📋 Step-by-Step Instructions:</h6>
                                <pre style="color: #2d3748; font-family: inherit; margin: 0; white-space: pre-wrap; line-height: 1.6; font-size: 14px;">${randomChallenge.instruction}</pre>
                            </div>
                            
                            <div style="text-align: center;">
                                <button onclick="gameFeatures.completePrayerTraining(${randomChallenge.points})" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 25px; padding: 15px 30px; font-weight: bold; cursor: pointer; font-size: 16px; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                                    ⚡ I COMPLETED THIS CHALLENGE! ⚡
                                </button>
                            </div>
                        </div>
                        
                        <!-- Quick Stats -->
                        <div style="text-align: center; background: white; border-radius: 15px; padding: 20px; border: 2px solid #e2e8f0;">
                            <h6 style="color: #2d3748; margin-bottom: 15px; font-weight: bold;">🏆 Your Prayer Power Stats</h6>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 15px;">
                                <div>
                                    <div style="font-size: 20px; font-weight: bold; color: #667eea;">0</div>
                                    <small style="color: #718096;">Challenges</small>
                                </div>
                                <div>
                                    <div style="font-size: 20px; font-weight: bold; color: #28a745;">0</div>
                                    <small style="color: #718096;">Points</small>
                                </div>
                                <div>
                                    <div style="font-size: 20px; font-weight: bold; color: #ffc107;">0</div>
                                    <small style="color: #718096;">Streak</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
        } catch (error) {
            console.error('Failed to open Prayer Training Camp:', error);
        }
    }
    
    async completePrayerTraining(points) {
        try {
            const response = await fetch('/api/gamified/complete_prayer_training', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ points: points })
            });
            
            if (response.ok) {
                const result = await response.json();
                
                // Close modal
                document.querySelector('.simple-modal').remove();
                
                // Show celebration
                this.showReward({ 
                    xp_earned: points, 
                    message: `Amazing! You earned ${points} Prayer Power Points! 🔥`,
                    activityType: 'prayer'
                });
                
                // Reload progress
                this.loadUserProgress();
            }
        } catch (error) {
            console.error('Failed to complete prayer training:', error);
        }
    }
    
    async loadPrayerRequests() {
        try {
            const response = await fetch('/api/gamified/prayer_manager');
            if (response.ok) {
                const data = await response.json();
                this.displayPrayerRequests(data.prayers || []);
            }
        } catch (error) {
            console.error('Failed to load prayer requests:', error);
        }
    }
    
    displayPrayerRequests(prayers) {
        const prayerList = document.getElementById('prayer-list');
        if (!prayerList) return;
        
        if (prayers.length === 0) {
            prayerList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #718096;">
                    <div style="font-size: 48px; margin-bottom: 15px;">🙏</div>
                    <p>Your prayer requests will appear here</p>
                    <p style="font-size: 14px;">Start by submitting your first prayer above</p>
                </div>`;
            return;
        }
        
        const prayerHTML = prayers.map(prayer => `
            <div class="prayer-item" data-category="${prayer.category}" style="background: white; border: 2px solid #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 15px; transition: all 0.3s;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                    <div>
                        <h6 style="color: #2d3748; margin: 0 0 5px 0; font-weight: bold;">${prayer.title}</h6>
                        <span style="background: #667eea; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; text-transform: uppercase; font-weight: bold;">${prayer.category}</span>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        ${!prayer.answered ? `
                            <button onclick="gameFeatures.markPrayerAnswered('${prayer.id}')" style="background: #28a745; color: white; border: none; padding: 6px 12px; border-radius: 15px; font-size: 12px; font-weight: bold; cursor: pointer;">
                                ✓ Answered
                            </button>
                        ` : `
                            <span style="background: #28a745; color: white; padding: 6px 12px; border-radius: 15px; font-size: 12px; font-weight: bold;">
                                ✓ Answered
                            </span>
                        `}
                        <button onclick="gameFeatures.deletePrayer('${prayer.id}')" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 15px; font-size: 12px; font-weight: bold; cursor: pointer;">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
                ${prayer.details ? `<p style="color: #718096; margin: 10px 0 0 0; font-size: 14px; line-height: 1.4;">${prayer.details}</p>` : ''}
                <small style="color: #a0aec0; font-size: 12px;">${prayer.date_added}</small>
            </div>
        `).join('');
        
        prayerList.innerHTML = prayerHTML;
    }

    async openPrayerQuest() {
        // Remove any existing simple modals first
        document.querySelectorAll('.simple-modal').forEach(el => el.remove());

        const modalHTML = `
        <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; border-radius: 8px; max-width: 600px; width: 90%; max-height: 80%; overflow-y: auto; position: relative;">
                <div style="padding: 20px; border-bottom: 1px solid #ddd; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; display: flex; justify-content: space-between; align-items: center;">
                    <h5 style="margin: 0; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🎯 Prayer Quest!</h5>
                    <button onclick="this.closest('.simple-modal').remove()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
                </div>
                <div style="padding: 20px;" id="prayer-quest-content">
                    <div style="text-align: center;">
                        <div style="display: inline-block; width: 20px; height: 20px; border: 2px solid #ff6b6b; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite;"></div>
                        <p style="margin-top: 10px;">Loading your epic prayer quest...</p>
                    </div>
                </div>
            </div>
        </div>
        <style>
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        </style>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Load content
        try {
            const response = await fetch('/api/gamified/prayer_challenge');
            const data = await response.json();

            if (data.type === 'already_completed') {
                document.getElementById('prayer-quest-content').innerHTML = `
                    <div style="text-align: center;">
                        <div style="font-size: 48px; color: #28a745; margin-bottom: 15px;">🎯</div>
                        <h5>Quest Complete!</h5>
                        <p>${data.message}</p>
                        <p style="color: #6c757d;">Current streak: ${data.streak} days</p>
                        <button onclick="this.closest('.simple-modal').remove()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                    </div>
                `;
            } else if (data.type === 'daily_complete') {
                document.getElementById('prayer-quest-content').innerHTML = `
                    <div style="text-align: center;">
                        <div style="font-size: 48px; color: #28a745; margin-bottom: 15px;">🏆</div>
                        <h5>All Daily Quests Complete!</h5>
                        <p>${data.message}</p>
                        <p style="color: #6c757d;">Completed: ${data.completed}/${data.total_daily} quests</p>
                        <button onclick="this.closest('.simple-modal').remove()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                    </div>
                `;
            } else {
                const quest = data.quest;
                document.getElementById('prayer-quest-content').innerHTML = `
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h3 style="color: #ff6b6b; margin-bottom: 10px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">${quest.title}</h3>
                        <div style="font-size: 3rem; margin: 15px 0;">⚔️</div>
                        <p style="font-style: italic; color: #6c757d; font-size: 1.1rem; margin-bottom: 15px;"><strong>Hero:</strong> ${quest.hero}</p>
                        <p style="color: #495057; font-size: 1rem; margin-bottom: 20px;">${quest.objective}</p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%); border: 2px solid #ff6b6b; padding: 20px; margin: 15px 0; border-radius: 12px;">
                        <h6 style="color: #ff6b6b; margin-bottom: 15px; font-weight: bold;">📖 Bible Story</h6>
                        <div style="line-height: 1.8; color: #495057; margin-bottom: 15px; font-style: italic;">
                            ${quest.story}
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; border: 2px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 8px;">
                        <h6 style="color: #e67e22; margin-bottom: 10px; font-weight: bold;">🎯 Your Challenge</h6>
                        <div style="line-height: 1.6; color: #495057; margin-bottom: 15px;">
                            ${quest.challenge}
                        </div>
                        <div style="background: rgba(255,193,7,0.2); padding: 10px; border-radius: 6px;">
                            <strong style="color: #e67e22;">Action:</strong> ${quest.action}
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #e8f5e8 0%, #f0fdf0 100%); border: 2px solid #28a745; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h6 style="color: #28a745; margin-bottom: 10px; font-weight: bold;">✝️ Power Verse</h6>
                        <p style="line-height: 1.6; font-style: italic; color: #155724; font-weight: bold;">${quest.power_verse}</p>
                    </div>
                    
                    <div style="text-align: center; margin: 20px 0;">
                        <div id="quest-timer" style="font-size: 2rem; color: #ff6b6b; font-weight: bold; margin-bottom: 15px;">00:30</div>
                        <button id="start-quest-btn" onclick="gameFeatures.startQuestTimer()" style="padding: 15px 30px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; border: none; border-radius: 25px; cursor: pointer; margin-right: 10px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(40,167,69,0.3);">🚀 START 30-SECOND QUEST</button>
                        <button id="complete-quest-btn" onclick="gameFeatures.completePrayerQuest()" style="padding: 15px 30px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; border: none; border-radius: 25px; cursor: pointer; margin-right: 10px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(255,107,107,0.3); display: none;">🏆 QUEST COMPLETE (+2 XP)</button>
                        <button onclick="this.closest('.simple-modal').remove()" style="padding: 15px 30px; background: #6c757d; color: white; border: none; border-radius: 25px; cursor: pointer;">Cancel</button>
                    </div>
                    
                    <div style="text-align: center; margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
                        <p style="margin: 0; color: #6c757d; font-size: 14px;">Quest Progress: ${data.progress.completed}/${data.progress.total} completed today</p>
                        <small style="color: #adb5bd;">Reward: ${quest.reward}</small>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Failed to load prayer quest:', error);
            document.getElementById('prayer-quest-content').innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 48px; color: #dc3545; margin-bottom: 15px;">❌</div>
                    <h5>Quest Unavailable</h5>
                    <p>Unable to load your prayer quest. Please try again later.</p>
                    <button onclick="this.closest('.simple-modal').remove()" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                </div>
            `;
        }
    }

    startQuestTimer() {
        const timerDisplay = document.getElementById('quest-timer');
        const startBtn = document.getElementById('start-quest-btn');
        const completeBtn = document.getElementById('complete-quest-btn');
        
        let timeLeft = 30; // 30 seconds
        startBtn.style.display = 'none';
        
        const timer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                timerDisplay.textContent = "TIME'S UP!";
                timerDisplay.style.color = '#28a745';
                completeBtn.style.display = 'inline-block';
                
                // Add some celebration effects
                timerDisplay.innerHTML = "🎉 QUEST COMPLETE! 🎉";
                timerDisplay.style.animation = 'bounce 0.5s ease-in-out 3';
            } else {
                timeLeft--;
            }
        }, 1000);
    }

    async completePrayerQuest() {
        try {
            const response = await fetch('/api/gamified/complete_daily_quest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            
            // Close prayer quest modal
            document.querySelector('.simple-modal').remove();
            
            // Show reward with progress info
            let rewardMessage = `🏆 QUEST COMPLETE! +${data.xp_earned} XP`;
            if (data.bonus_xp > 0) {
                rewardMessage += ` (Bonus: +${data.bonus_xp} XP for completing all 5!)`;
            }
            
            this.showReward(rewardMessage, data.new_level, data.streak);
            
            // Show progress message
            if (data.all_complete) {
                setTimeout(() => {
                    this.showReward('🎉 ALL 5 DAILY QUESTS COMPLETE! See you tomorrow for new adventures!', data.new_level, data.streak);
                }, 2000);
            } else {
                setTimeout(() => {
                    this.showReward(`📊 Quest Progress: ${data.quest_progress.completed}/${data.quest_progress.total} completed today`, data.new_level, data.streak);
                }, 2000);
            }
            
            // Update progress display
            this.loadUserProgress();
            
        } catch (error) {
            console.error('Failed to complete daily quest:', error);
        }
    }

    async openBibleQuest() {
        // Combined Bible Study and Scripture Reading experience
        try {
            console.log('Opening Soul Quest - Combined Bible Experience...');
            
            // Remove any existing modals
            document.querySelectorAll('.simple-modal').forEach(el => el.remove());
            
            // Start activity tracking
            if (window.activityTracker) {
                window.activityTracker.startTracking('bible_quest');
            }
            
            this.displayBibleQuestModal();
            
        } catch (error) {
            console.error('Failed to open Soul Quest:', error);
        }
    }
    
    displayBibleQuestModal() {
        const modalHTML = `
        <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
            <div style="background: white; border-radius: 20px; max-width: 700px; width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #34D399 0%, #1E3A8A 100%); padding: 30px 25px; text-align: center; border-radius: 20px 20px 0 0; position: relative;">
                    <div style="font-size: 4rem; color: white; margin-bottom: 10px;">📖</div>
                    <h3 style="color: white; margin: 0; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">Soul Quest</h3>
                    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Bible Study & Scripture Mastery Adventures</p>
                    <button onclick="this.closest('.simple-modal').remove()" style="position: absolute; top: 20px; right: 25px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 28px; cursor: pointer; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
                </div>
                
                <!-- Content -->
                <div style="padding: 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h4 style="color: #2d3748; margin-bottom: 15px; font-weight: bold;">Choose Your Bible Adventure</h4>
                        <p style="color: #718096; font-size: 16px; line-height: 1.6;">Discover God's Word through interactive study and scripture mastery challenges</p>
                    </div>
                    
                    <!-- Two Options -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <!-- Bible Study -->
                        <div onclick="gameFeatures.openBibleStudy()" style="background: linear-gradient(135deg, #34D399 0%, #10B981 100%); border-radius: 15px; padding: 25px; text-align: center; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div style="font-size: 3rem; color: white; margin-bottom: 15px;">💎</div>
                            <h5 style="color: white; margin-bottom: 10px; font-weight: bold;">Bible Study</h5>
                            <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin-bottom: 15px;">Deep dive into scripture passages with guided questions and reflection</p>
                            <div style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; font-size: 12px; color: white; font-weight: 600;">+3 XP per study</div>
                        </div>
                        
                        <!-- Scripture Mastery -->
                        <div onclick="gameFeatures.openVerseMastery()" style="background: linear-gradient(135deg, #1E3A8A 0%, #3730A3 100%); border-radius: 15px; padding: 25px; text-align: center; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div style="font-size: 3rem; color: white; margin-bottom: 15px;">⚔️</div>
                            <h5 style="color: white; margin-bottom: 10px; font-weight: bold;">Scripture Mastery</h5>
                            <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin-bottom: 15px;">Memorize and master key Bible verses through interactive challenges</p>
                            <div style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; font-size: 12px; color: white; font-weight: 600;">+2 XP per verse</div>
                        </div>
                    </div>
                    
                    <!-- Progress Stats -->
                    <div style="background: #f8f9fa; border-radius: 15px; padding: 20px; text-align: center;">
                        <h6 style="color: #2d3748; margin-bottom: 15px; font-weight: bold;">Your Bible Quest Progress</h6>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                            <div>
                                <div style="font-size: 24px; font-weight: bold; color: #34D399;">0</div>
                                <small style="color: #718096;">Studies Completed</small>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: bold; color: #1E3A8A;">0</div>
                                <small style="color: #718096;">Verses Mastered</small>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: bold; color: #F59E0B;">0</div>
                                <small style="color: #718096;">Total XP Earned</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    async openBibleReading() {
        // Remove any existing simple modals first
        document.querySelectorAll('.simple-modal').forEach(el => el.remove());

        try {
            const response = await fetch('/api/gamified/bible_reading');
            const data = await response.json();

            const modalHTML = `
            <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; border-radius: 12px; max-width: 800px; width: 90%; max-height: 85%; overflow-y: auto; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                    <div style="padding: 25px; border-bottom: 2px solid #ddd; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; display: flex; justify-content: space-between; align-items: center; border-radius: 12px 12px 0 0;">
                        <h4 style="margin: 0; display: flex; align-items: center; font-weight: 600;"><span style="margin-right: 10px;">📖</span>Bible Reading Plans</h4>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <button id="audio-toggle" onclick="window.gameFeatures.toggleAudio()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 12px; border-radius: 20px; cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 5px;">
                                <span>🔊</span> Audio
                            </button>
                            <button onclick="this.closest('.simple-modal').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 24px; cursor: pointer; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;">&times;</button>
                        </div>
                    </div>
                    <div style="padding: 25px;">
                        <!-- Reading Plan Selection -->
                        <div style="margin-bottom: 25px;">
                            <h6 style="margin-bottom: 15px; color: #495057; font-weight: 600;">Choose Your Reading Plan</h6>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                                ${data.plans ? data.plans.map(plan => `
                                <div class="reading-plan" onclick="window.gameFeatures.selectReadingPlan('${plan.id}')" style="border: 2px solid #e9ecef; border-radius: 10px; padding: 15px; cursor: pointer; transition: all 0.3s ease; ${data.current_plan === plan.id ? 'border-color: #28a745; background: #f8fff9;' : ''}">
                                    <h6 style="margin: 0 0 8px 0; color: #28a745; font-size: 14px; font-weight: 600;">${plan.name}</h6>
                                    <p style="margin: 0 0 10px 0; font-size: 12px; color: #6c757d; line-height: 1.4;">${plan.description}</p>
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <small style="color: #adb5bd;">${plan.duration}</small>
                                        <span style="background: #28a745; color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px;">+${plan.xp_daily} XP/day</span>
                                    </div>
                                </div>
                                `).join('') : 
                                `<div class="reading-plan" onclick="window.gameFeatures.selectReadingPlan('basic')" style="border: 2px solid #28a745; border-radius: 10px; padding: 15px; cursor: pointer; background: #f8fff9;">
                                    <h6 style="margin: 0 0 8px 0; color: #28a745; font-size: 14px; font-weight: 600;">Daily Bible Reading</h6>
                                    <p style="margin: 0 0 10px 0; font-size: 12px; color: #6c757d; line-height: 1.4;">Read through the Bible with daily passages</p>
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <small style="color: #adb5bd;">365 days</small>
                                        <span style="background: #28a745; color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px;">+2 XP/day</span>
                                    </div>
                                </div>`
                            }
                            </div>
                        </div>

                        <!-- Today's Reading -->
                        <div style="background: #f8fff9; border: 2px solid #28a745; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                <h6 style="margin: 0; color: #28a745; font-weight: 600;">Today's Reading</h6>
                                <div style="display: flex; gap: 10px;">
                                    <button onclick="window.gameFeatures.shareReading()" style="background: #6f42c1; color: white; border: none; padding: 6px 12px; border-radius: 15px; font-size: 11px; cursor: pointer;">Share</button>
                                    <button onclick="window.gameFeatures.markReadingComplete()" style="background: #28a745; color: white; border: none; padding: 6px 12px; border-radius: 15px; font-size: 11px; cursor: pointer;">Mark Complete</button>
                                </div>
                            </div>
                            
                            <div class="today-reading-content">
                                ${data.today_reading ? `
                                <div style="background: white; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                                    <h6 style="margin: 0 0 10px 0; color: #495057; font-size: 14px;">${data.today_reading.reference}</h6>
                                    <div style="font-style: italic; line-height: 1.6; color: #495057; font-size: 14px; max-height: 200px; overflow-y: auto;">
                                        ${data.today_reading.text}
                                    </div>
                                </div>
                                <div style="background: rgba(40, 167, 69, 0.1); border-left: 4px solid #28a745; padding: 15px; border-radius: 4px;">
                                    <h6 style="margin: 0 0 8px 0; color: #28a745; font-size: 13px;">Reflection Question</h6>
                                    <p style="margin: 0; color: #495057; font-size: 13px; line-height: 1.5;">${data.today_reading.reflection}</p>
                                </div>
                                ` : 
                                `<div style="text-align: center; padding: 20px; color: #6c757d;">
                                    <div style="font-size: 48px; margin-bottom: 15px;">📖</div>
                                    <p style="margin: 0;">Select a reading plan above to get started!</p>
                                </div>`}
                            </div>
                        </div>

                        <!-- Reading Progress -->
                        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 10px; padding: 20px;">
                            <h6 style="margin: 0 0 15px 0; color: #495057; font-weight: 600;">Your Progress</h6>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 15px; text-align: center;">
                                <div>
                                    <div style="font-size: 20px; font-weight: bold; color: #28a745;">${data.progress?.days_completed || 0}</div>
                                    <small style="color: #6c757d; font-weight: 500;">Days Read</small>
                                </div>
                                <div>
                                    <div style="font-size: 20px; font-weight: bold; color: #ffc107;">${data.progress?.current_streak || 0}</div>
                                    <small style="color: #6c757d; font-weight: 500;">Day Streak</small>
                                </div>
                                <div>
                                    <div style="font-size: 20px; font-weight: bold; color: #667eea;">${data.progress?.completion_percentage || 0}%</div>
                                    <small style="color: #6c757d; font-weight: 500;">Complete</small>
                                </div>
                            </div>
                            <div style="background: #dee2e6; border-radius: 10px; height: 8px; margin-top: 15px; overflow: hidden;">
                                <div style="background: #28a745; height: 100%; width: ${data.progress?.completion_percentage || 0}%; transition: width 0.3s ease;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
        } catch (error) {
            console.error('Failed to load Bible reading:', error);
            const fallbackHTML = `
            <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; border-radius: 12px; max-width: 500px; width: 90%; padding: 30px; text-align: center;">
                    <h4 style="color: #28a745; margin-bottom: 15px;">📖 Bible Reading</h4>
                    <p style="color: #6c757d; margin-bottom: 20px;">Loading your reading plan...</p>
                    <button onclick="this.closest('.simple-modal').remove()" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer;">Close</button>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', fallbackHTML);
        }
    }

    // Bible Reading Helper Methods
    selectReadingPlan(planId) {
        console.log('Reading plan selected:', planId);
        
        // Visual feedback for plan selection - find all reading plan elements
        document.querySelectorAll('.reading-plan').forEach(plan => {
            plan.style.borderColor = '#e9ecef';
            plan.style.background = 'white';
            plan.style.boxShadow = 'none';
        });
        
        // Find and highlight the selected plan using a more reliable method
        const allPlans = document.querySelectorAll('.reading-plan');
        allPlans.forEach(plan => {
            if (plan.onclick && plan.onclick.toString().includes(planId)) {
                plan.style.borderColor = '#28a745';
                plan.style.background = '#f8fff9';
                plan.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.15)';
                plan.style.transform = 'scale(1.02)';
                
                // Reset transform after animation
                setTimeout(() => {
                    plan.style.transform = 'scale(1)';
                }, 200);
            }
        });
        
        // Update the today's reading content based on selected plan
        this.updateTodaysReading(planId);
        
        // If audio is enabled, read the new content
        setTimeout(() => {
            const audioButton = document.getElementById('audio-toggle');
            if (audioButton && audioButton.textContent.includes('🔊') && audioButton.textContent.includes('ON')) {
                const scriptureText = document.querySelector('.today-reading-content');
                if (scriptureText) {
                    const verseElement = scriptureText.querySelector('div[style*="font-style: italic"]');
                    if (verseElement && 'speechSynthesis' in window) {
                        const textToRead = verseElement.textContent;
                        
                        const utterance = new SpeechSynthesisUtterance(textToRead);
                        utterance.rate = 0.9;
                        utterance.pitch = 1.0;
                        utterance.volume = 0.8;
                        
                        const voices = speechSynthesis.getVoices();
                        const readingVoice = voices.find(voice => 
                            voice.name.includes('Google') && voice.lang.includes('en') ||
                            voice.name.includes('Alex') ||
                            voice.name.includes('Daniel')
                        );
                        if (readingVoice) {
                            utterance.voice = readingVoice;
                        }
                        
                        speechSynthesis.speak(utterance);
                    }
                }
            }
        }, 300);
        
        console.log('Selected reading plan:', planId);
    }
    
    updateTodaysReading(planId) {
        const readingContent = document.querySelector('.today-reading-content');
        if (!readingContent) return;
        
        // Define different content for each reading plan
        const readings = {
            basic: {
                reference: "Genesis 1:1-5",
                text: "In the beginning God created the heavens and the earth. Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters. And God said, 'Let there be light,' and there was light. God saw that the light was good, and he separated the light from the darkness. God called the light 'day,' and the darkness he called 'night.' And there was evening, and there was morning—the first day.",
                reflection: "How does God's creative power in bringing light from darkness speak to areas of your life that need His illumination today?"
            },
            psalms: {
                reference: "Psalm 23:1-6",
                text: "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul. He guides me along the right paths for his name's sake. Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me. You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows. Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.",
                reflection: "In what ways have you experienced God as your shepherd, providing, protecting, and guiding you through difficult times?"
            },
            gospels: {
                reference: "John 3:16-17",
                text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. For God did not send his Son into the world to condemn the world, but to save the world through him.",
                reflection: "How does the depth of God's love, demonstrated through Jesus, change the way you view yourself and others today?"
            }
        };
        
        const selectedReading = readings[planId] || readings.basic;
        
        // Update the content
        readingContent.innerHTML = `
            <div style="background: white; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <h6 style="margin: 0 0 10px 0; color: #495057; font-size: 14px;">${selectedReading.reference}</h6>
                <div style="font-style: italic; line-height: 1.6; color: #495057; font-size: 14px; max-height: 200px; overflow-y: auto;">
                    ${selectedReading.text}
                </div>
            </div>
            <div style="background: rgba(40, 167, 69, 0.1); border-left: 4px solid #28a745; padding: 15px; border-radius: 4px;">
                <h6 style="margin: 0 0 8px 0; color: #28a745; font-size: 13px;">Reflection Question</h6>
                <p style="margin: 0; color: #495057; font-size: 13px; line-height: 1.5;">${selectedReading.reflection}</p>
            </div>
        `;
        
        // Just log the change, no reward for switching plans
        const planName = planId.charAt(0).toUpperCase() + planId.slice(1);
        console.log(`${planName} reading plan loaded! Today's passage updated.`);
    }

    toggleAudio() {
        console.log('Audio toggle clicked');
        
        const audioButton = document.getElementById('audio-toggle');
        if (audioButton) {
            const isEnabled = audioButton.textContent.includes('🔊');
            
            // Update button appearance
            audioButton.innerHTML = isEnabled ? 
                '<span>🔇</span> Audio OFF' : 
                '<span>🔊</span> Audio ON';
            
            // Update button styling
            audioButton.style.background = isEnabled ? 
                'rgba(220, 53, 69, 0.2)' : 
                'rgba(40, 167, 69, 0.2)';
            
            // Visual feedback animation
            audioButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                audioButton.style.transform = 'scale(1)';
            }, 150);
            
            // If enabling audio, read the current Bible passage
            if (!isEnabled) {
                const scriptureText = document.querySelector('.today-reading-content');
                if (scriptureText) {
                    // Find the Bible verse text
                    const verseElement = scriptureText.querySelector('div[style*="font-style: italic"]');
                    if (verseElement) {
                        const textToRead = verseElement.textContent;
                        
                        // Voice announcement and then read the scripture
                        setTimeout(() => {
                            if ('speechSynthesis' in window) {
                                const utterance = new SpeechSynthesisUtterance(textToRead);
                                utterance.rate = 0.9; // Slower for scripture reading
                                utterance.pitch = 1.0; // Normal pitch for reading
                                utterance.volume = 0.8;
                                
                                // Use a clear reading voice
                                const voices = speechSynthesis.getVoices();
                                const readingVoice = voices.find(voice => 
                                    voice.name.includes('Google') && voice.lang.includes('en') ||
                                    voice.name.includes('Alex') ||
                                    voice.name.includes('Daniel')
                                );
                                if (readingVoice) {
                                    utterance.voice = readingVoice;
                                }
                                
                                speechSynthesis.speak(utterance);
                            }
                        }, 500);
                    } else {
                        // Fallback announcement
                        const utterance = new SpeechSynthesisUtterance('Audio enabled. Select a reading plan to hear scripture.');
                        utterance.rate = 0.9;
                        utterance.volume = 0.7;
                        speechSynthesis.speak(utterance);
                    }
                }
            }
            
            console.log('Audio', isEnabled ? 'disabled' : 'enabled');
        }
    }

    markReadingComplete() {
        console.log('Marking reading as complete');
        
        // Visual feedback on button
        const completeBtn = document.querySelector('[onclick*="markReadingComplete"]');
        if (completeBtn) {
            completeBtn.textContent = '✓ Completed!';
            completeBtn.style.background = '#28a745';
            completeBtn.style.transform = 'scale(1.05)';
            completeBtn.disabled = true;
            
            // Reset after delay
            setTimeout(() => {
                completeBtn.textContent = 'Mark Complete';
                completeBtn.style.transform = 'scale(1)';
                completeBtn.disabled = false;
            }, 3000);
        }
        
        // Award XP and show success - THIS IS WHERE REWARDS SHOULD APPEAR
        this.showReward({
            xp_earned: 2,
            activityType: 'scripture',
            message: 'Bible reading completed! +2 XP earned'
        });
        
        // Voice celebration for completion
        this.speakCelebration('scripture');
        
        // Update progress
        this.loadUserProgress();
    }

    shareReading() {
        console.log('Sharing reading');
        
        // Visual feedback on share button
        const shareBtn = document.querySelector('[onclick*="shareReading"]');
        if (shareBtn) {
            shareBtn.style.transform = 'scale(0.95)';
            shareBtn.style.background = '#5a6268';
            setTimeout(() => {
                shareBtn.style.transform = 'scale(1)';
                shareBtn.style.background = '#6f42c1';
            }, 200);
        }
        
        const shareText = "Check out today's Bible reading! 📖 Growing my faith with GABE";
        
        if (navigator.share) {
            navigator.share({
                title: 'Bible Reading - GABE',
                text: shareText,
                url: window.location.href
            }).then(() => {
                // Small reward for sharing
                this.showReward({
                    xp_earned: 1,
                    message: 'Bible reading shared! Thanks for spreading the Word!'
                });
            }).catch(err => {
                console.log('Share cancelled');
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showReward({
                    xp_earned: 1,
                    message: 'Share text copied to clipboard!'
                });
            }).catch(() => {
                // Final fallback
                const textArea = document.createElement('textarea');
                textArea.value = shareText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                this.showReward({
                    xp_earned: 1,
                    message: 'Share text copied!'
                });
            });
        }
    }

    async openVerseMastery() {
        // Remove any existing simple modals first
        document.querySelectorAll('.simple-modal').forEach(el => el.remove());
        
        const modalHTML = `
        <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; border-radius: 8px; max-width: 600px; width: 90%; max-height: 80%; overflow-y: auto; position: relative;">
                <div style="padding: 20px; border-bottom: 1px solid #ddd; background: #28a745; color: white; display: flex; justify-content: space-between; align-items: center;">
                    <h5 style="margin: 0;"><i class="feather-book" style="margin-right: 8px;"></i>Verse Mastery</h5>
                    <button onclick="this.closest('.simple-modal').remove()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
                </div>
                <div style="padding: 20px;" id="simple-verse-content">
                    <div style="text-align: center;">
                        <div style="display: inline-block; width: 20px; height: 20px; border: 2px solid #28a745; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite;"></div>
                        <p style="margin-top: 10px;">Loading...</p>
                    </div>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        try {
            const response = await fetch('/api/gamified/verse_mastery_quiz');
            const quiz = await response.json();

            if (quiz.type === 'fill_blank') {
                document.getElementById('simple-verse-content').innerHTML = `
                    <div style="margin-bottom: 20px;">
                        <h6 style="color: #28a745; margin-bottom: 15px;">${quiz.reference}</h6>
                        <p style="font-size: 18px; line-height: 1.6; margin: 15px 0;">${quiz.quiz_text}</p>
                    </div>
                    <div style="margin: 20px 0;">
                        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Fill in the blank:</label>
                        <input type="text" id="simple-verse-answer" placeholder="Enter the missing word" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin: 10px 0; font-size: 16px;">
                        <input type="hidden" id="simple-correct-answer" value="${quiz.correct_answer}">
                        <input type="hidden" id="simple-quiz-type" value="fill_blank">
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <button onclick="gameFeatures.submitSimpleVerseQuiz()" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Submit Answer</button>
                        <button onclick="this.closest('.simple-modal').remove()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                    </div>
                `;
            } else {
                const optionsHTML = quiz.options.map((option, index) => 
                    `<div style="margin: 8px 0;">
                        <label style="display: flex; align-items: center; cursor: pointer; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa;">
                            <input type="radio" name="simple-verse-option" value="${option}" style="margin-right: 10px;">
                            <span>${option}</span>
                        </label>
                    </div>`
                ).join('');

                document.getElementById('simple-verse-content').innerHTML = `
                    <div style="margin-bottom: 20px;">
                        <p style="font-size: 18px; line-height: 1.6; font-style: italic; background: #f8f9fa; padding: 15px; border-radius: 4px;">"${quiz.text}"</p>
                    </div>
                    <div style="margin: 20px 0;">
                        <label style="display: block; margin-bottom: 10px; font-weight: bold;">${quiz.question}</label>
                        ${optionsHTML}
                        <input type="hidden" id="simple-correct-answer" value="${quiz.correct_answer}">
                        <input type="hidden" id="simple-quiz-type" value="multiple_choice">
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <button onclick="gameFeatures.submitSimpleVerseQuiz()" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Submit Answer</button>
                        <button onclick="this.closest('.simple-modal').remove()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                    </div>
                `;
            }
        } catch (error) {
            document.getElementById('simple-verse-content').innerHTML = `
                <div style="text-align: center; color: #dc3545;">
                    <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
                    <h5>Failed to load verse quiz</h5>
                    <p>Please try again later.</p>
                    <button onclick="this.closest('.simple-modal').remove()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                </div>
            `;
        }
        
        if (window.feather) {
            window.feather.replace();
        }
    }

    async submitVerseQuiz() {
        const quizType = document.getElementById('quizType').value;
        const correctAnswer = document.getElementById('correctAnswer').value;
        let userAnswer;

        if (quizType === 'fill_blank') {
            userAnswer = document.getElementById('verseAnswer').value.trim();
        } else {
            const selectedOption = document.querySelector('input[name="verseOption"]:checked');
            userAnswer = selectedOption ? selectedOption.value : '';
        }

        try {
            const response = await fetch('/api/gamified/complete_verse_quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answer: userAnswer,
                    correct_answer: correctAnswer,
                    quiz_type: quizType
                })
            });

            if (response.ok) {
                const result = await response.json();
                
                if (result.correct) {
                    document.getElementById('verseMasteryContent').innerHTML = `
                        <div class="text-center">
                            <i class="feather-check-circle text-success" style="font-size: 3rem;"></i>
                            <h5 class="mt-3 text-success">Correct!</h5>
                            <p>You earned +${result.xp_earned} XP</p>
                            ${result.new_badges.length > 0 ? 
                                `<div class="alert alert-warning">🏆 New Badge: ${result.new_badges.join(', ')}</div>` : 
                                ''
                            }
                            <button class="btn btn-success me-2" onclick="gameFeatures.openVerseMastery()">Try Another</button>
                            <button class="btn btn-secondary" onclick="gameFeatures.closeModal('verseMasteryModal')">Done</button>
                        </div>
                    `;
                    this.loadUserProgress();
                } else {
                    document.getElementById('verseMasteryContent').innerHTML = `
                        <div class="text-center">
                            <i class="feather-x-circle text-danger" style="font-size: 3rem;"></i>
                            <h5 class="mt-3 text-danger">Not quite right</h5>
                            <p>${result.encouragement}</p>
                            <button class="btn btn-primary me-2" onclick="gameFeatures.openVerseMastery()">Try Again</button>
                            <button class="btn btn-secondary" onclick="gameFeatures.closeModal('verseMasteryModal')">Done</button>
                        </div>
                    `;
                }
            }
        } catch (error) {
            console.error('Failed to submit verse quiz:', error);
        }
    }

    async submitSimpleVerseQuiz() {
        const quizType = document.getElementById('simple-quiz-type').value;
        const correctAnswer = document.getElementById('simple-correct-answer').value;
        let userAnswer;

        if (quizType === 'fill_blank') {
            userAnswer = document.getElementById('simple-verse-answer').value.trim();
        } else {
            const selectedOption = document.querySelector('input[name="simple-verse-option"]:checked');
            userAnswer = selectedOption ? selectedOption.value : '';
        }

        if (!userAnswer) {
            alert('Please provide an answer before submitting.');
            return;
        }

        try {
            const response = await fetch('/api/gamified/complete_verse_quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answer: userAnswer,
                    correct_answer: correctAnswer,
                    quiz_type: quizType
                })
            });

            if (response.ok) {
                const result = await response.json();
                
                if (result.correct) {
                    result.activityType = 'scripture';
                    this.showReward(result);
                    document.querySelector('.simple-modal')?.remove();
                    // Force progress reload with delay to ensure UI updates
                    setTimeout(() => {
                        this.loadUserProgress();
                    }, 500);
                    
                    // Show beautiful notification instead of ugly confirm
                    setTimeout(() => {
                        const continueHTML = `
                        <div class="continue-notification" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 25px; border-radius: 12px; box-shadow: 0 6px 24px rgba(0,0,0,0.3); z-index: 10000; max-width: 350px; animation: popIn 0.5s ease-out;">
                            <div style="text-align: center;">
                                <div style="font-size: 2.5rem; margin-bottom: 12px;">✅</div>
                                <h6 style="margin: 0 0 12px 0; color: white;">Correct!</h6>
                                <p style="margin: 8px 0; font-size: 14px;">Great job! Try another verse quiz?</p>
                                <div style="margin-top: 15px;">
                                    <button onclick="gameFeatures.openVerseMastery(); this.closest('.continue-notification').remove();" style="padding: 8px 16px; background: rgba(255,255,255,0.9); color: #28a745; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; margin-right: 8px;">Try Another</button>
                                    <button onclick="this.closest('.continue-notification').remove()" style="padding: 8px 16px; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4); border-radius: 6px; cursor: pointer; font-size: 13px;">Done</button>
                                </div>
                            </div>
                        </div>`;
                        
                        document.body.insertAdjacentHTML('beforeend', continueHTML);
                        
                        setTimeout(() => {
                            document.querySelector('.continue-notification')?.remove();
                        }, 8000);
                    }, 1500);
                } else {
                    document.getElementById('simple-verse-content').innerHTML = `
                        <div style="text-align: center; color: #dc3545;">
                            <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
                            <h5>Not quite right</h5>
                            <p style="margin: 15px 0;">${result.encouragement}</p>
                            <button onclick="gameFeatures.openVerseMastery()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Try Again</button>
                            <button onclick="this.closest('.simple-modal').remove()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Done</button>
                        </div>
                    `;
                }
            }
        } catch (error) {
            alert('Failed to submit quiz. Please try again.');
        }
    }

    createVerseMasteryModal() {
        const modalHTML = `
        <div class="modal fade" id="verseMasteryModal" tabindex="-1" aria-labelledby="verseMasteryModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title" id="verseMasteryModalLabel">
                            <i class="feather-book me-2"></i>Verse Mastery
                        </h5>
                        <button type="button" class="btn-close btn-close-white" onclick="gameFeatures.closeModal('verseMasteryModal')" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="verseMasteryContent">
                        <div class="text-center">
                            <div class="spinner-border text-success" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        if (window.feather) {
            window.feather.replace();
        }
    }

    async openBibleStudy() {
        // Remove any existing simple modals first
        document.querySelectorAll('.simple-modal').forEach(el => el.remove());

        try {
            const response = await fetch('/api/gamified/bible_study');
            const data = await response.json();

            if (data.type === 'study_list') {
                // Show available studies
                const studiesHTML = data.studies.map(study => `
                    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 10px 0; cursor: pointer; transition: all 0.2s;" onclick="gameFeatures.startBibleStudy('${study.id}')">
                        <h6 style="color: #f0ad4e; margin-bottom: 8px;">${study.title}</h6>
                        <p style="margin: 5px 0; font-size: 14px; color: #666;">${study.description}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                            <small style="color: #888;">${study.sessions} sessions • ${study.duration}</small>
                            <span style="background: #f0ad4e; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">+${study.xp_reward} XP</span>
                        </div>
                    </div>
                `).join('');

                const modalHTML = `
                <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                    <div style="background: white; border-radius: 8px; max-width: 600px; width: 90%; max-height: 80%; overflow-y: auto; position: relative;">
                        <div style="padding: 20px; border-bottom: 1px solid #ddd; background: #f0ad4e; color: white; display: flex; justify-content: space-between; align-items: center;">
                            <h5 style="margin: 0;">📖 Interactive Bible Study</h5>
                            <button onclick="this.closest('.simple-modal').remove()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
                        </div>
                        <div style="padding: 20px;">
                            <h6 style="margin-bottom: 15px; color: #333;">Choose a study to begin:</h6>
                            ${studiesHTML}
                        </div>
                    </div>
                </div>`;
                
                document.body.insertAdjacentHTML('beforeend', modalHTML);
            } else if (data.type === 'study_session') {
                // Show current study session
                const session = data.session;
                const modalHTML = `
                <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                    <div style="background: white; border-radius: 8px; max-width: 700px; width: 90%; max-height: 80%; overflow-y: auto; position: relative;">
                        <div style="padding: 20px; border-bottom: 1px solid #ddd; background: #f0ad4e; color: white; display: flex; justify-content: space-between; align-items: center;">
                            <h5 style="margin: 0;">📖 ${session.title} - Session ${session.session_number}</h5>
                            <button onclick="this.closest('.simple-modal').remove()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
                        </div>
                        <div style="padding: 20px;">
                            <div style="background: #f8f9fa; border-left: 4px solid #f0ad4e; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                                <h6 style="color: #f0ad4e; margin-bottom: 10px;">📜 Scripture Reading</h6>
                                <p style="margin: 0; line-height: 1.6; font-style: italic;">"${session.scripture_text}"</p>
                                <small style="color: #666; margin-top: 8px; display: block;">- ${session.scripture_reference}</small>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <h6 style="color: #333; margin-bottom: 10px;">💭 Reflection Questions</h6>
                                ${session.questions.map((q, index) => `
                                    <div style="margin-bottom: 15px;">
                                        <p style="margin-bottom: 8px; font-weight: 500;">${index + 1}. ${q}</p>
                                        <textarea id="answer_${index}" placeholder="Your reflection..." style="width: 100%; min-height: 60px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"></textarea>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div style="text-align: center; margin-top: 20px;">
                                <button onclick="gameFeatures.completeBibleStudySession('${session.study_id}', ${session.session_number})" style="padding: 12px 24px; background: #f0ad4e; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px; font-weight: 500;">Complete Session (+${session.xp_reward} XP)</button>
                                <button onclick="this.closest('.simple-modal').remove()" style="padding: 12px 24px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Save & Continue Later</button>
                            </div>
                        </div>
                    </div>
                </div>`;
                
                document.body.insertAdjacentHTML('beforeend', modalHTML);
            }
        } catch (error) {
            const modalHTML = `
            <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; border-radius: 8px; max-width: 400px; width: 90%; max-height: 80%; overflow-y: auto; position: relative;">
                    <div style="padding: 20px; border-bottom: 1px solid #ddd; background: #dc3545; color: white; display: flex; justify-content: space-between; align-items: center;">
                        <h5 style="margin: 0;">Error</h5>
                        <button onclick="this.closest('.simple-modal').remove()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
                    </div>
                    <div style="padding: 20px; text-align: center;">
                        <div style="font-size: 48px; color: #dc3545; margin-bottom: 15px;">❌</div>
                        <h5>Failed to load Bible study</h5>
                        <p>Please try again later.</p>
                        <button onclick="this.closest('.simple-modal').remove()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                    </div>
                </div>
            </div>`;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
    }

    async startBibleStudy(studyId) {
        try {
            const response = await fetch('/api/gamified/start_bible_study', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ study_id: studyId })
            });
            
            if (response.ok) {
                // Close current modal and reopen with study session
                document.querySelector('.simple-modal')?.remove();
                this.openBibleStudy();
            }
        } catch (error) {
            alert('Failed to start Bible study. Please try again.');
        }
    }

    async completeBibleStudySession(studyId, sessionNumber) {
        // Collect answers
        const answers = [];
        let answerIndex = 0;
        while (document.getElementById(`answer_${answerIndex}`)) {
            answers.push(document.getElementById(`answer_${answerIndex}`).value);
            answerIndex++;
        }

        try {
            const response = await fetch('/api/gamified/complete_bible_study_session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    study_id: studyId, 
                    session_number: sessionNumber,
                    answers: answers
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                result.activityType = 'devotion';
                this.showReward(result);
                document.querySelector('.simple-modal')?.remove();
                // Force progress reload with delay to ensure UI updates
                setTimeout(() => {
                    this.loadUserProgress();
                }, 500);
            }
        } catch (error) {
            alert('Failed to complete session. Please try again.');
        }
    }

    // Removed old Scripture Adventure methods - replaced with Bible Study

    openMoodMission() {
        // Remove any existing simple modals first
        document.querySelectorAll('.simple-modal').forEach(el => el.remove());
        
        const moods = [
            { value: 'sad', emoji: '😢', color: '#6c757d' },
            { value: 'anxious', emoji: '😰', color: '#fd7e14' },
            { value: 'grateful', emoji: '🙏', color: '#20c997' },
            { value: 'angry', emoji: '😠', color: '#dc3545' },
            { value: 'tired', emoji: '😴', color: '#6f42c1' }
        ];
        
        const moodButtonsHTML = moods.map(mood => 
            `<button onclick="gameFeatures.startSimpleMoodMission('${mood.value}')" 
                     style="display: block; width: 100%; margin: 8px 0; padding: 12px; background: ${mood.color}; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; text-align: center; transition: all 0.3s;">
                ${mood.emoji} ${mood.value.charAt(0).toUpperCase() + mood.value.slice(1)}
            </button>`
        ).join('');
        
        const modalHTML = `
        <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; border-radius: 8px; max-width: 400px; width: 90%; max-height: 80%; overflow-y: auto; position: relative;">
                <div style="padding: 20px; border-bottom: 1px solid #ddd; background: #6f42c1; color: white; display: flex; justify-content: space-between; align-items: center;">
                    <h5 style="margin: 0;"><i class="feather-target" style="margin-right: 8px;"></i>Mood Mission</h5>
                    <button onclick="this.closest('.simple-modal').remove()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
                </div>
                <div style="padding: 20px;">
                    <h6 style="text-align: center; margin-bottom: 20px; color: #6f42c1;">How are you feeling today?</h6>
                    ${moodButtonsHTML}
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        if (window.feather) {
            window.feather.replace();
        }
    }

    async startMoodMission(mood) {
        try {
            const response = await fetch('/api/gamified/mood_mission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood })
            });

            if (response.ok) {
                const mission = await response.json();
                const completed = confirm(`💝 ${mission.comfort}\n\n🎯 Mission: ${mission.challenge}\n\nComplete this mission?`);
                
                if (completed) {
                    await this.completeMoodMission(mood);
                }
            }
        } catch (error) {
            alert('Failed to load mood mission. Please try again.');
        }
    }

    async startSimpleMoodMission(mood) {
        // Close mood selection modal
        document.querySelector('.simple-modal')?.remove();
        
        try {
            const response = await fetch('/api/gamified/mood_mission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood })
            });

            if (response.ok) {
                const mission = await response.json();
                
                const modalHTML = `
                <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                    <div style="background: white; border-radius: 8px; max-width: 500px; width: 90%; max-height: 80%; overflow-y: auto; position: relative;">
                        <div style="padding: 20px; border-bottom: 1px solid #ddd; background: #6f42c1; color: white; display: flex; justify-content: space-between; align-items: center;">
                            <h5 style="margin: 0;">💝 Your Mission</h5>
                            <button onclick="this.closest('.simple-modal').remove()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
                        </div>
                        <div style="padding: 20px;">
                            <div style="background: #f8f9fa; border-left: 4px solid #6f42c1; padding: 15px; border-radius: 4px; margin: 15px 0;">
                                <p style="margin: 0; font-style: italic; line-height: 1.6;">${mission.comfort}</p>
                            </div>
                            <div style="margin: 20px 0;">
                                <h6 style="color: #6f42c1; margin-bottom: 10px;">🎯 Mission:</h6>
                                <p style="margin: 0; line-height: 1.6;">${mission.challenge}</p>
                            </div>
                            <div style="text-align: center; margin-top: 20px;">
                                <button onclick="gameFeatures.completeSimpleMoodMission('${mood}')" style="padding: 10px 20px; background: #6f42c1; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Complete Mission (+2 XP)</button>
                                <button onclick="this.closest('.simple-modal').remove()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Later</button>
                            </div>
                        </div>
                    </div>
                </div>`;
                
                document.body.insertAdjacentHTML('beforeend', modalHTML);
            }
        } catch (error) {
            console.error('Failed to load mood mission:', error);
        }
    }

    async completeMoodMission(mood) {
        try {
            const response = await fetch('/api/gamified/complete_mood_mission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood })
            });

            if (response.ok) {
                const result = await response.json();
                this.showReward(result);
                // Show comfort message in beautiful notification instead of ugly alert
                setTimeout(() => {
                    const comfortHTML = `
                    <div class="comfort-notification" style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #6f42c1, #9b59b6); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 10000; max-width: 400px; animation: slideDown 0.5s ease-out;">
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; margin-bottom: 10px;">💙</div>
                            <h6 style="margin: 0 0 10px 0; color: white;">God's Comfort</h6>
                            <p style="margin: 0; font-size: 14px; line-height: 1.5;">${result.comfort_message}</p>
                            <button onclick="this.closest('.comfort-notification').remove()" style="margin-top: 10px; padding: 5px 15px; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 5px; cursor: pointer; font-size: 12px;">Amen</button>
                        </div>
                    </div>
                    <style>
                    @keyframes slideDown {
                        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                        to { transform: translateX(-50%) translateY(0); opacity: 1; }
                    }
                    </style>`;
                    
                    document.body.insertAdjacentHTML('beforeend', comfortHTML);
                    
                    setTimeout(() => {
                        document.querySelector('.comfort-notification')?.remove();
                    }, 5000);
                }, 1000);
                this.loadUserProgress();
            }
        } catch (error) {
            console.error('Failed to complete mood mission:', error);
        }
    }

    async completeSimpleMoodMission(mood) {
        try {
            const response = await fetch('/api/gamified/complete_mood_mission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood })
            });

            if (response.ok) {
                const result = await response.json();
                this.showReward(result);
                document.querySelector('.simple-modal')?.remove();
                this.loadUserProgress();
                
                // Show comfort message in a beautiful notification
                setTimeout(() => {
                    const comfortHTML = `
                    <div class="comfort-notification" style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #6f42c1, #9b59b6); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 10000; max-width: 400px; animation: slideDown 0.5s ease-out;">
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; margin-bottom: 10px;">💙</div>
                            <h6 style="margin: 0 0 10px 0; color: white;">God's Comfort</h6>
                            <p style="margin: 0; font-size: 14px; line-height: 1.5;">${result.comfort_message}</p>
                            <button onclick="this.closest('.comfort-notification').remove()" style="margin-top: 10px; padding: 5px 15px; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 5px; cursor: pointer; font-size: 12px;">Amen</button>
                        </div>
                    </div>
                    <style>
                    @keyframes slideDown {
                        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                        to { transform: translateX(-50%) translateY(0); opacity: 1; }
                    }
                    </style>`;
                    
                    document.body.insertAdjacentHTML('beforeend', comfortHTML);
                    
                    setTimeout(() => {
                        document.querySelector('.comfort-notification')?.remove();
                    }, 5000);
                }, 1000);
            }
        } catch (error) {
            console.error('Failed to complete mood mission:', error);
        }
    }

    openBadges() {
        // Remove any existing simple modals first
        document.querySelectorAll('.simple-modal').forEach(el => el.remove());

        if (!this.currentUserData) {
            console.log('Loading your achievements...');
            return;
        }
        
        const badgesList = this.currentUserData.badges.length > 0 
            ? this.currentUserData.badges.map(badge => `<div style="display: flex; align-items: center; padding: 8px; background: #f8f9fa; margin: 5px 0; border-radius: 5px; border-left: 3px solid #ffc107;"><span style="margin-right: 8px;">🏆</span>${badge}</div>`).join('')
            : '<div style="text-align: center; color: #6c757d; padding: 20px;">No badges earned yet - start your faith journey!</div>';

        const modalHTML = `
        <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; border-radius: 8px; max-width: 500px; width: 90%; max-height: 80%; overflow-y: auto; position: relative;">
                <div style="padding: 20px; border-bottom: 1px solid #ddd; background: #ffc107; color: white; display: flex; justify-content: space-between; align-items: center;">
                    <h5 style="margin: 0;"><i class="feather-award" style="margin-right: 8px;"></i>Your Achievements</h5>
                    <button onclick="this.closest('.simple-modal').remove()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
                </div>
                <div style="padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="display: inline-block; background: linear-gradient(135deg, #ffc107, #fd7e14); color: white; padding: 15px 25px; border-radius: 50px; margin: 10px;">
                            <strong>Level ${this.currentUserData.level}</strong>
                        </div>
                        <div style="display: inline-block; background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 15px 25px; border-radius: 50px; margin: 10px;">
                            <strong>${this.currentUserData.xp} XP</strong>
                        </div>
                    </div>
                    <h6 style="color: #ffc107; margin-bottom: 15px;">🏆 Badges Earned (${this.currentUserData.badges.length}):</h6>
                    <div style="max-height: 300px; overflow-y: auto;">
                        ${badgesList}
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <button onclick="this.closest('.simple-modal').remove()" style="padding: 10px 20px; background: #ffc107; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                    </div>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        if (window.feather) {
            window.feather.replace();
        }
    }

    // Voice celebration feature
    showRecentRewards() {
        console.log('Showing recent rewards');
        // Remove any existing modals first
        document.querySelectorAll('.simple-modal').forEach(el => el.remove());
        
        // Simple rewards display
        const rewardsHTML = `
        <div class="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; border-radius: 12px; max-width: 400px; width: 90%; padding: 30px; text-align: center;">
                <h4 style="color: #28a745; margin-bottom: 20px;">🎁 Recent Rewards</h4>
                <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #6c757d;">You've earned rewards for:</p>
                    <ul style="list-style: none; padding: 0; margin: 10px 0;">
                        <li style="margin: 5px 0;">📖 Bible Reading: +2 XP</li>
                        <li style="margin: 5px 0;">🙏 Daily Prayer: +2 XP</li>
                        <li style="margin: 5px 0;">🌅 Morning Devotion: +2 XP</li>
                    </ul>
                </div>
                <button onclick="this.closest('.simple-modal').remove()" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer;">Close</button>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', rewardsHTML);
    }

    speakCelebration(activityType = 'general') {
        // Prevent duplicate celebrations within 2 seconds
        const now = Date.now();
        if (this.lastCelebrationTime && (now - this.lastCelebrationTime) < 2000) {
            console.log('Skipping duplicate celebration');
            return;
        }
        this.lastCelebrationTime = now;
        
        if ('speechSynthesis' in window) {
            const celebrations = {
                prayer: ['Amen, God bless you', 'Beautiful prayer', 'God hears you', 'Well done'],
                devotion: ['God is pleased', 'Keep growing in faith', 'God loves your dedication', 'Well done'],
                scripture: ['Good reading', 'Keep studying God\'s Word', 'The Bible transforms hearts', 'God bless you'],
                general: ['God is pleased', 'Keep growing in faith', 'Well done', 'God bless you']
            };
            
            const phrases = celebrations[activityType] || celebrations.general;
            const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            
            const utterance = new SpeechSynthesisUtterance(randomPhrase);
            utterance.rate = 0.8; // Gentle and calm
            utterance.pitch = 1.0; // Natural, not overly excited
            utterance.volume = 0.6; // Softer volume, not overwhelming
            
            // Try to find a warm, clear voice
            const voices = speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => 
                (voice.name.includes('Microsoft') && voice.name.includes('Natural') && voice.lang.includes('en')) ||
                voice.name.includes('Samantha') ||
                voice.name.includes('Karen') ||
                (voice.name.includes('Google') && voice.lang.includes('en'))
            );
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            
            speechSynthesis.speak(utterance);
        }
    }

    showReward(result) {
        // Voice celebration removed per user request
        
        // Remove any existing reward notifications
        document.querySelectorAll('.reward-notification').forEach(el => el.remove());
        
        const notificationHTML = `
        <div class="reward-notification" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #ff6b6b, #ffd700, #4ecdc4); color: white; padding: 35px; border-radius: 20px; box-shadow: 0 15px 50px rgba(255,107,107,0.4); z-index: 10000; max-width: 400px; min-width: 350px; animation: epicPopIn 0.8s ease-out; border: 3px solid rgba(255,255,255,0.3);">
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 15px; animation: bounce 1s infinite;">⚡</div>
                <h3 style="margin: 0 0 15px 0; color: white; font-weight: bold; text-shadow: 3px 3px 6px rgba(0,0,0,0.5); font-size: 1.8rem;">EPIC VICTORY!</h3>
                <p style="margin: 12px 0; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">+${result.xp_earned || 2} POWER POINTS!</p>
                ${result.new_badges && result.new_badges.length > 0 ? 
                    `<p style="margin: 12px 0; font-size: 18px; font-weight: bold;">🏆 NEW TROPHY: ${result.new_badges.join(', ')}</p>` : 
                    ''
                }
                ${result.streak ? 
                    `<p style="margin: 12px 0; font-size: 18px; font-weight: bold;">🔥 ${result.streak} DAY STREAK!</p>` : 
                    ''
                }
                <button onclick="gameFeatures.fadeOutReward()" style="margin-top: 20px; padding: 12px 30px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 16px; font-weight: bold; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.2); text-transform: uppercase;">AWESOME!</button>
            </div>
        </div>
        <style>
        @keyframes epicPopIn {
            0% { transform: translate(-50%, -50%) scale(0.3) rotate(-10deg); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.1) rotate(5deg); opacity: 0.9; }
            100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        @keyframes fadeOut {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
        }
        .reward-notification button:hover {
            background: linear-gradient(135deg, #764ba2, #667eea) !important;
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important;
        }
        </style>`;
        
        document.body.insertAdjacentHTML('beforeend', notificationHTML);
        
        // Auto-fade after 3.5 seconds
        setTimeout(() => {
            this.fadeOutReward();
        }, 3500);
    }

    fadeOutReward() {
        const notification = document.querySelector('.reward-notification');
        if (notification) {
            notification.style.animation = 'fadeOut 0.5s ease-out forwards';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }
    }
    
    updateLevelBadges(xp, currentLevel) {
        const levels = [
            { name: 'Seedling', id: 'badge-seedling', icon: '🌱', minXP: 0 },
            { name: 'Disciple', id: 'badge-disciple', icon: '🌿', minXP: 25 },
            { name: 'Messenger', id: 'badge-messenger', icon: '🕊️', minXP: 75 },
            { name: 'Guardian', id: 'badge-guardian', icon: '🛡️', minXP: 150 },
            { name: 'Kingdom Builder', id: 'badge-kingdom-builder', icon: '✨', minXP: 300 }
        ];
        
        levels.forEach(level => {
            const badgeElement = document.getElementById(level.id);
            if (badgeElement) {
                const circle = badgeElement.querySelector('div:first-child');
                const textElements = badgeElement.querySelectorAll('div:last-child > div');
                
                if (level.name === currentLevel) {
                    // Only highlight the current level
                    badgeElement.style.opacity = '1';
                    if (circle) {
                        circle.style.borderColor = '#3B82F6';
                        circle.style.background = '#EBF8FF';
                    }
                    textElements.forEach(textEl => {
                        if (textEl.textContent === level.name) {
                            textEl.style.color = '#1F2937';
                        } else {
                            textEl.style.color = '#6B7280';
                        }
                    });
                } else {
                    // Gray out all other levels (both achieved and unachieved)
                    badgeElement.style.opacity = '0.5';
                    if (circle) {
                        circle.style.borderColor = '#D1D5DB';
                        circle.style.background = 'white';
                    }
                    textElements.forEach(textEl => {
                        textEl.style.color = '#9CA3AF';
                    });
                }
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Re-initialize to ensure DOM-dependent features work
    if (!window.gameFeatures) {
        window.gameFeatures = new GamifiedSpiritualFeatures();
    }
    console.log('Gamified Faith in Action features loaded');
    
    // Also bind to the existing spiritual features panel for compatibility
    setTimeout(() => {
        const spiritualFeaturesPanel = document.getElementById('spiritual-features');
        if (spiritualFeaturesPanel) {
            console.log('Faith in Action bound to existing spiritual features panel');
        }
    }, 50);
});

// Initialize early to ensure functions are available for inline onclick handlers
window.gameFeatures = new GamifiedSpiritualFeatures();
console.log('Global gameFeatures initialized:', window.gameFeatures);
console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.gameFeatures)));

// Ensure all methods are properly bound to the global object
if (typeof window.gameFeatures.openPrayerManager === 'function') {
    window.gameFeatures.openPrayerManager = window.gameFeatures.openPrayerManager.bind(window.gameFeatures);
    console.log('openPrayerManager bound successfully');
} else {
    console.error('openPrayerManager method not found');
}

if (typeof window.gameFeatures.openBibleReading === 'function') {
    window.gameFeatures.openBibleReading = window.gameFeatures.openBibleReading.bind(window.gameFeatures);
    console.log('openBibleReading bound successfully');
} else {
    console.error('openBibleReading method not found');
}

if (typeof window.gameFeatures.openVerseMastery === 'function') {
    window.gameFeatures.openVerseMastery = window.gameFeatures.openVerseMastery.bind(window.gameFeatures);
}

if (typeof window.gameFeatures.openMoodMission === 'function') {
    window.gameFeatures.openMoodMission = window.gameFeatures.openMoodMission.bind(window.gameFeatures);
}

if (typeof window.gameFeatures.openBadges === 'function') {
    window.gameFeatures.openBadges = window.gameFeatures.openBadges.bind(window.gameFeatures);
}

// Bind additional helper methods
if (typeof window.gameFeatures.selectReadingPlan === 'function') {
    window.gameFeatures.selectReadingPlan = window.gameFeatures.selectReadingPlan.bind(window.gameFeatures);
}

if (typeof window.gameFeatures.toggleAudio === 'function') {
    window.gameFeatures.toggleAudio = window.gameFeatures.toggleAudio.bind(window.gameFeatures);
}

if (typeof window.gameFeatures.markReadingComplete === 'function') {
    window.gameFeatures.markReadingComplete = window.gameFeatures.markReadingComplete.bind(window.gameFeatures);
}

if (typeof window.gameFeatures.shareReading === 'function') {
    window.gameFeatures.shareReading = window.gameFeatures.shareReading.bind(window.gameFeatures);
}

if (typeof window.gameFeatures.showRecentRewards === 'function') {
    window.gameFeatures.showRecentRewards = window.gameFeatures.showRecentRewards.bind(window.gameFeatures);
}

// Add spiritual direction completion method to gameFeatures
if (typeof window.gameFeatures === 'object') {
    window.gameFeatures.completeSpiritualDirection = async function() {
        try {
            const response = await fetch('/api/gamified/complete_spiritual_direction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ xp_earned: 5 })
            });
            
            if (response.ok) {
                const result = await response.json();
                
                // Close spiritual direction modal
                const modal = document.getElementById('spiritual-direction-modal');
                if (modal) modal.remove();
                
                // Show XP reward
                this.showReward({ 
                    xp_earned: 5, 
                    message: 'Spiritual Direction completed! You\'ve received divine guidance! 🧭',
                    activityType: 'spiritual_direction'
                });
                
                // Reload progress
                this.loadUserProgress();
            }
        } catch (error) {
            console.error('Failed to complete spiritual direction:', error);
        }
    }.bind(window.gameFeatures);
}

// Bind loadUserProgress method
if (typeof window.gameFeatures.loadUserProgress === 'function') {
    window.gameFeatures.loadUserProgress = window.gameFeatures.loadUserProgress.bind(window.gameFeatures);
    console.log('loadUserProgress bound successfully');
} else {
    console.error('loadUserProgress method not found');
}

// Add spiritual direction completion method directly to the instance
window.gameFeatures.completeSpiritualDirection = async function() {
    try {
        const response = await fetch('/api/gamified/complete_spiritual_direction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ xp_earned: 5 })
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Close spiritual direction modal
            const modal = document.getElementById('spiritual-direction-modal');
            if (modal) modal.remove();
            
            // Show XP reward
            this.showReward({ 
                xp_earned: 5, 
                message: 'Spiritual Direction completed! You\'ve received divine guidance! 🧭',
                activityType: 'spiritual_direction'
            });
            
            // Reload progress
            this.loadUserProgress();
        }
    } catch (error) {
        console.error('Failed to complete spiritual direction:', error);
    }
};
