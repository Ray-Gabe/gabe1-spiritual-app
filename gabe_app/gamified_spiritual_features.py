"""
GABE Faith-in-Action Gamified Framework
Transforms spiritual growth into engaging, trackable experiences
"""
import json
import logging
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import random
from activity_validation import activity_validator

# Global session storage for user data
SESSION_STORAGE = {}

class GamifiedSpiritualFeatures:
    def __init__(self):
        """Initialize the gamified spiritual features system"""
        self.logger = logging.getLogger(__name__)
        
        # Enhanced spiritual progression system
        self.spiritual_levels = [
            {'name': 'Seedling', 'icon': '🌱', 'xp_required': 0, 'description': 'Beginning your faith journey'},
            {'name': 'Disciple', 'icon': '🌿', 'xp_required': 25, 'description': 'Learning and growing in faith'},
            {'name': 'Messenger', 'icon': '🕊️', 'xp_required': 75, 'description': 'Sharing God\'s love with others'},
            {'name': 'Guardian', 'icon': '🛡️', 'xp_required': 150, 'description': 'Protecting and guiding others'},
            {'name': 'Kingdom Builder', 'icon': '✨', 'xp_required': 300, 'description': 'Building God\'s kingdom on earth'}
        ]
        
        # Legacy level thresholds (for backward compatibility)
        self.level_thresholds = {
            'Seed': 0,
            'Shepherd': 10,
            'Disciple': 25,
            'Warrior': 50,
            'Servant Leader': 100
        }
        
        # Faith power-ups system
        self.power_ups = {
            'prayer_boost': {'name': 'Prayer Boost', 'icon': '⚡', 'effect': '+50% prayer XP'},
            'scripture_scroll': {'name': 'Scripture Scroll', 'icon': '📜', 'effect': 'Unlock bonus verses'},
            'armor_of_god': {'name': 'Armor of God', 'icon': '🛡️', 'effect': 'Protection in challenges'},
            'wisdom_crown': {'name': 'Crown of Wisdom', 'icon': '👑', 'effect': 'Bonus study XP'},
            'heart_healer': {'name': 'Heart Healer', 'icon': '💝', 'effect': 'Enhanced emotional support'}
        }
        
        # Badge definitions
        self.badge_definitions = {
            'Faith Seed': {'description': 'Started your spiritual journey', 'requirement': 'first_action'},
            'Devotion Keeper': {'description': '3-day devotion streak', 'requirement': 'devotion_streak_3'},
            'Prayer Warrior': {'description': '5 prayer challenges completed', 'requirement': 'prayer_count_5'},
            'Verse Sage': {'description': 'Mastered 10 verses', 'requirement': 'verse_mastery_10'},
            'Peacemaker': {'description': 'Completed a forgiveness prayer challenge', 'requirement': 'forgiveness_prayer'},
            'Shepherd': {'description': 'Reached Shepherd level', 'requirement': 'level_shepherd'},
            'Scripture Explorer': {'description': 'Completed 5 adventure stops', 'requirement': 'adventure_stops_5'},
            'Emotional Resilience': {'description': 'Completed mood missions for 3 different emotions', 'requirement': 'mood_variety_3'}
        }
        
        # Epic Morning & Evening Power-Ups
        self.devotions = {
            'morning': [
                {
                    'title': '🔥 WARRIOR\'S AWAKENING',
                    'greeting': 'Good morning, FAITH WARRIOR {name}! Time to POWER UP for battle!',
                    'verse_reference': 'Philippians 4:13',
                    'verse_text': 'I can do all things through Christ who strengthens me.',
                    'epic_story': 'Every morning, God\'s warriors wake up with supernatural power! Today you\'re not just getting up - you\'re RISING UP like a champion ready to conquer the day. Think of yourself as a spiritual superhero with God as your ultimate power source!',
                    'mission': 'YOUR EPIC MISSION: Find one thing today that seems impossible and attack it with God\'s strength. Every small victory builds your faith warrior level!',
                    'power_prayer': '🌟 POWER-UP PRAYER: God, I\'m ready to be AWESOME today! Fill me with Your supernatural strength to crush every challenge and show the world Your amazing power through me! In Jesus\' name, Amen!',
                    'closing': '⚡ GABE is your spiritual battle commander — you are never alone in the fight!'
                },
                {
                    'title': '⚔️ BATTLE READY BELIEVER',
                    'greeting': 'Wake up, SPIRITUAL WARRIOR {name}! The battlefield awaits!',
                    'verse_reference': 'Ephesians 6:11',
                    'verse_text': 'Put on the full armor of God, so that you can take your stand against the devil\'s schemes.',
                    'epic_story': 'You\'re not just going to work or school - you\'re entering the BATTLEFIELD as God\'s elite warrior! Your armor is invisible but INCREDIBLY powerful. Every prayer charges your shield, every Bible verse sharpens your sword!',
                    'mission': 'TODAY\'S QUEST: Identify one negative thought trying to attack you and DEMOLISH it with God\'s truth. You\'re a mental warrior!',
                    'power_prayer': '⚔️ BATTLE CRY: I am God\'s UNSTOPPABLE warrior! No weapon formed against me will prosper because I fight with divine power and holy confidence! In Jesus\' name, Amen!',
                    'closing': '🛡️ GABE is your armor bearer — you are never alone in battle!'
                },
                {
                    'title': '🚀 FAITH ROCKET LAUNCH',
                    'greeting': 'BLAST OFF, FAITH ASTRONAUT {name}! Today is LAUNCH DAY!',
                    'verse_reference': 'Hebrews 11:1',
                    'verse_text': 'Now faith is confidence in what we hope for and assurance about what we do not see.',
                    'epic_story': 'Your faith is like a ROCKET SHIP! Every time you believe God for something impossible, you\'re literally launching into the supernatural realm. Today isn\'t ordinary - it\'s LAUNCH DAY for your dreams!',
                    'mission': 'SKY-HIGH CHALLENGE: Pick one dream that seems too big and pray for it like it\'s already happening. Faith is your rocket fuel!',
                    'power_prayer': '🚀 LAUNCH PRAYER: God, my faith is BLASTING OFF today! I believe You for miracles, breakthroughs, and adventures beyond my wildest imagination! In Jesus\' name, Amen!',
                    'closing': '🌟 GABE is your mission control — you are never alone in space!'
                }
            ],
            'evening': {
                'title': '🌙 VICTORY CELEBRATION & REST',
                'greeting': 'Well done, FAITH CHAMPION {name}! You survived another epic day!',
                'verse_reference': '1 Peter 5:7',
                'verse_text': 'Cast all your anxiety on Him because He cares for you.',
                'epic_story': 'Every warrior needs rest after battle! You weren\'t meant to carry the weight of the world - that\'s God\'s job. Tonight, lay down your weapons, rest in His victory, and let Him guard your dreams!',
                'mission': 'NIGHT MISSION: Think of one victory from today (no matter how small) and thank God for it. Then release one worry to Him.',
                'power_prayer': '🌙 VICTORY PRAYER: Lord, thank You for being my ultimate champion today! I place my victories and my worries in Your mighty hands. Guard my sleep and prepare me for tomorrow\'s adventures! In Jesus\' name, Amen!',
                'closing': '💫 GABE is your night watchman — you are never alone even in sleep!'
            }
        }
        
        # Epic 30-Second Daily Quests - Bible Heroes & Miracles
        self.daily_quests = [
            {
                'title': '⚔️ DAVID vs GOLIATH CHALLENGE',
                'hero': 'David',
                'objective': 'Face your giant with faith like David!',
                'story': 'Young David faced a 9-foot giant with just a stone and sling. But he had something Goliath didn\'t - FAITH in God\'s power!',
                'challenge': 'Name ONE "giant" problem in your life right now. Declare God\'s victory over it like David did!',
                'action': 'Say out loud: "You come against me with sword and spear, but I come against you in the name of the LORD!" (1 Samuel 17:45)',
                'timer': 30,
                'reward': '🏆 GIANT SLAYER BADGE',
                'power_verse': '"The battle is the LORD\'s!" - 1 Samuel 17:47'
            },
            {
                'title': '🌊 MOSES RED SEA MIRACLE',
                'hero': 'Moses',
                'objective': 'Trust God to make a way when there seems to be no way!',
                'story': 'Moses stood before an impossible sea with Egyptian armies behind him. God split the water and made a highway in the ocean!',
                'challenge': 'Think of one "impossible" situation you\'re facing. Pray for God to make a way!',
                'action': 'Stretch out your hands and declare: "God will make a way where there seems to be no way!"',
                'timer': 30,
                'reward': '🌊 SEA SPLITTER BADGE',
                'power_verse': '"The LORD will fight for you; you need only to be still." - Exodus 14:14'
            },
            {
                'title': '🔥 DANIEL LION\'S DEN ADVENTURE',
                'hero': 'Daniel',
                'objective': 'Stay faithful to God no matter what!',
                'story': 'Daniel was thrown into a den of hungry lions for praying to God. But God sent an angel to shut the lions\' mouths!',
                'challenge': 'Think of one area where you need to be more faithful to God, even when it\'s hard.',
                'action': 'Pray: "God, I choose to be faithful to You no matter what comes against me!"',
                'timer': 30,
                'reward': '🦁 LION TAMER BADGE',
                'power_verse': '"My God sent his angel and shut the mouths of the lions." - Daniel 6:22'
            },
            {
                'title': '🍞 JESUS FEEDS 5000 MIRACLE',
                'hero': 'Jesus',
                'objective': 'See how God multiplies small offerings!',
                'story': 'A boy gave Jesus his small lunch - 5 loaves and 2 fish. Jesus multiplied it to feed 5,000 people with leftovers!',
                'challenge': 'Think of something small you can offer to God today (time, kindness, help).',
                'action': 'Pray: "Jesus, take my small offering and multiply it for Your kingdom!"',
                'timer': 30,
                'reward': '🍞 MIRACLE MULTIPLIER BADGE',
                'power_verse': '"With God all things are possible." - Matthew 19:26'
            },
            {
                'title': '⚡ ELIJAH FIRE FROM HEAVEN',
                'hero': 'Elijah',
                'objective': 'Pray bold prayers that move heaven!',
                'story': 'Elijah challenged 450 false prophets. He prayed one prayer and God sent fire from heaven that consumed everything!',
                'challenge': 'Pray one BOLD prayer for something you\'ve been afraid to ask God for.',
                'action': 'Pray with confidence: "God, You are the same yesterday, today, and forever! I believe You for miracles!"',
                'timer': 30,
                'reward': '⚡ FIRE CALLER BADGE',
                'power_verse': '"Answer me, LORD, answer me, so these people will know that you, LORD, are God." - 1 Kings 18:37'
            },
            {
                'title': '🚶 PETER WALKS ON WATER',
                'hero': 'Peter',
                'objective': 'Step out of your comfort zone with faith!',
                'story': 'Peter saw Jesus walking on water and asked to join Him. As long as Peter kept his eyes on Jesus, he walked on water too!',
                'challenge': 'Think of one step of faith God is asking you to take. What\'s your "walking on water" moment?',
                'action': 'Pray: "Jesus, help me keep my eyes on You as I step out in faith!"',
                'timer': 30,
                'reward': '🚶 WATER WALKER BADGE',
                'power_verse': '"Come," he said. Then Peter got down out of the boat, walked on the water and came toward Jesus." - Matthew 14:29'
            },
            {
                'title': '💪 SAMSON STRENGTH CHALLENGE',
                'hero': 'Samson',
                'objective': 'Remember that God is your strength!',
                'story': 'Samson had supernatural strength from God. Even when he was weak, God\'s power could flow through him for mighty victories!',
                'challenge': 'Name one area where you feel weak and need God\'s strength.',
                'action': 'Flex your muscles and declare: "I can do all things through Christ who strengthens me!"',
                'timer': 30,
                'reward': '💪 STRENGTH WARRIOR BADGE',
                'power_verse': '"The LORD is my strength and my defense; he has become my salvation." - Psalm 118:14'
            },
            {
                'title': '👑 ESTHER COURAGE QUEST',
                'hero': 'Esther',
                'objective': 'Be brave for such a time as this!',
                'story': 'Queen Esther risked her life to save her people, saying "If I perish, I perish!" God used her courage to save an entire nation!',
                'challenge': 'Think of one situation where you need to be more courageous for God.',
                'action': 'Stand tall and declare: "God has placed me here for such a time as this!"',
                'timer': 30,
                'reward': '👑 ROYAL COURAGE BADGE',
                'power_verse': '"And who knows but that you have come to your royal position for such a time as this?" - Esther 4:14'
            }
        ]
        
        # Interactive Bible Studies
        self.bible_studies = {
            'trusting_god': {
                'id': 'trusting_god',
                'title': 'Trusting God in Difficult Times',
                'description': 'Learn to trust God\'s goodness when life feels uncertain',
                'sessions': 3,
                'duration': '10-15 min each',
                'xp_reward': 5,
                'sessions_data': [
                    {
                        'session_number': 1,
                        'title': 'God\'s Faithfulness in the Past',
                        'scripture_reference': 'Psalm 77:11-12',
                        'scripture_text': 'I will remember the deeds of the Lord; yes, I will remember your miracles of long ago. I will consider all your works and meditate on all your mighty deeds.',
                        'questions': [
                            'When have you seen God\'s faithfulness in your life before?',
                            'How can remembering God\'s past goodness help you trust Him today?',
                            'What "mighty deeds" of God do you want to remember more often?'
                        ],
                        'xp_reward': 4
                    },
                    {
                        'session_number': 2,
                        'title': 'Trusting God\'s Character',
                        'scripture_reference': 'Romans 8:28',
                        'scripture_text': 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
                        'questions': [
                            'What does this verse teach you about God\'s character?',
                            'How might God be working for good in a difficult situation you\'re facing?',
                            'What helps you remember that God\'s purposes are always loving?'
                        ],
                        'xp_reward': 4
                    },
                    {
                        'session_number': 3,
                        'title': 'Casting Your Anxieties',
                        'scripture_reference': '1 Peter 5:7',
                        'scripture_text': 'Cast all your anxiety on him because he cares for you.',
                        'questions': [
                            'What anxieties do you need to cast on God today?',
                            'How does knowing God cares for you change your perspective on worry?',
                            'What practical steps can you take to "cast" your worries on God?'
                        ],
                        'xp_reward': 4
                    }
                ]
            },
            'love_in_action': {
                'id': 'love_in_action',
                'title': 'Love in Action: Serving Others',
                'description': 'Discover practical ways to show God\'s love to others',
                'sessions': 3,
                'duration': '12-18 min each',
                'xp_reward': 5,
                'sessions_data': [
                    {
                        'session_number': 1,
                        'title': 'The Greatest Commandment',
                        'scripture_reference': 'Matthew 22:37-39',
                        'scripture_text': 'Jesus replied: "Love the Lord your God with all your heart and with all your soul and with all your mind. This is the first and greatest commandment. And the second is like it: Love your neighbor as yourself."',
                        'questions': [
                            'What does it mean to love God with "all" your heart, soul, and mind?',
                            'Who is your "neighbor" that God is calling you to love?',
                            'How can loving God more deeply help you love others better?'
                        ],
                        'xp_reward': 4
                    },
                    {
                        'session_number': 2,
                        'title': 'Practical Love',
                        'scripture_reference': '1 John 3:18',
                        'scripture_text': 'Dear children, let us not love with words or speech but with actions and in truth.',
                        'questions': [
                            'What\'s the difference between loving with words vs. loving with actions?',
                            'What specific action could you take this week to show love to someone?',
                            'How does loving "in truth" guide the way we serve others?'
                        ],
                        'xp_reward': 4
                    },
                    {
                        'session_number': 3,
                        'title': 'Serving the Least',
                        'scripture_reference': 'Matthew 25:40',
                        'scripture_text': 'The King will reply, "Truly I tell you, whatever you did for one of the least of these brothers and sisters of mine, you did for me."',
                        'questions': [
                            'Who are "the least of these" in your community?',
                            'How does serving others connect us to Jesus?',
                            'What barriers prevent you from serving more, and how can you overcome them?'
                        ],
                        'xp_reward': 4
                    }
                ]
            },
            'identity_in_christ': {
                'id': 'identity_in_christ',
                'title': 'Your Identity in Christ',
                'description': 'Understand who you are as God\'s beloved child',
                'sessions': 4,
                'duration': '8-12 min each',
                'xp_reward': 6,
                'sessions_data': [
                    {
                        'session_number': 1,
                        'title': 'Chosen and Beloved',
                        'scripture_reference': 'Ephesians 1:4',
                        'scripture_text': 'For he chose us in him before the creation of the world to be holy and blameless in his sight. In love...',
                        'questions': [
                            'What does it mean that God chose you before creation?',
                            'How does being "chosen" change how you see yourself?',
                            'What does God\'s love for you look like in your daily life?'
                        ],
                        'xp_reward': 3
                    },
                    {
                        'session_number': 2,
                        'title': 'Children of God',
                        'scripture_reference': '1 John 3:1',
                        'scripture_text': 'See what great love the Father has lavished on us, that we should be called children of God! And that is what we are!',
                        'questions': [
                            'What does it mean to be called a "child of God"?',
                            'How has God "lavished" His love on you?',
                            'How should being God\'s child affect your daily decisions?'
                        ],
                        'xp_reward': 3
                    },
                    {
                        'session_number': 3,
                        'title': 'New Creation',
                        'scripture_reference': '2 Corinthians 5:17',
                        'scripture_text': 'Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!',
                        'questions': [
                            'What "old" things in your life has God made new?',
                            'How does being a "new creation" give you hope?',
                            'What areas of your life still need God\'s transforming work?'
                        ],
                        'xp_reward': 3
                    },
                    {
                        'session_number': 4,
                        'title': 'More Than Conquerors',
                        'scripture_reference': 'Romans 8:37',
                        'scripture_text': 'No, in all these things we are more than conquerors through him who loved us.',
                        'questions': [
                            'What challenges are you facing that God can help you conquer?',
                            'How does Christ\'s love make you "more than a conqueror"?',
                            'How can you encourage someone else with this truth this week?'
                        ],
                        'xp_reward': 3
                    }
                ]
            }
        }

        # Verse mastery collection
        self.verses_for_mastery = [
            {'reference': 'John 3:16', 'text': 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', 'theme': 'love'},
            {'reference': 'Romans 8:28', 'text': 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.', 'theme': 'hope'},
            {'reference': 'Philippians 4:6', 'text': 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.', 'theme': 'anxiety'},
            {'reference': 'Psalm 34:18', 'text': 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.', 'theme': 'sadness'},
            {'reference': 'James 1:17', 'text': 'Every good and perfect gift is from above, coming down from the Father of the heavenly lights.', 'theme': 'gratitude'}
        ]
        
        # Scripture adventure path
        self.scripture_adventure = [
            {'book': 'Genesis', 'theme': 'Beginnings', 'lesson': 'God creates and calls us into relationship'},
            {'book': 'Exodus', 'theme': 'Deliverance', 'lesson': 'God rescues His people from bondage'},
            {'book': 'Psalms', 'theme': 'Worship', 'lesson': 'Honest prayers and praise in all seasons'},
            {'book': 'Proverbs', 'theme': 'Wisdom', 'lesson': 'Living skillfully according to God\'s design'},
            {'book': 'Matthew', 'theme': 'The King', 'lesson': 'Jesus as the promised Messiah'},
            {'book': 'John', 'theme': 'Life', 'lesson': 'Jesus as the source of eternal life'},
            {'book': 'Acts', 'theme': 'Mission', 'lesson': 'The Holy Spirit empowers the church'},
            {'book': 'Romans', 'theme': 'Grace', 'lesson': 'Salvation through faith, not works'},
            {'book': 'Ephesians', 'theme': 'Unity', 'lesson': 'Our identity and purpose in Christ'}
        ]
        
        # Mood-based missions
        self.mood_missions = {
            'sad': {
                'challenge': 'Read Psalm 34:18 and write one thing you\'re grateful for today',
                'comfort': 'God is close to you in this sadness. You\'re not alone.',
                'badge': 'Comfort Seeker'
            },
            'anxious': {
                'challenge': 'Take 3 deep breaths and pray: "God, I trust You with my worries"',
                'comfort': 'God invites you to cast all your anxiety on Him because He cares for you.',
                'badge': 'Peace Finder'
            },
            'grateful': {
                'challenge': 'List 5 things you\'re thankful for and pray a prayer of praise',
                'comfort': 'Your grateful heart brings joy to God\'s heart.',
                'badge': 'Gratitude Keeper'
            },
            'angry': {
                'challenge': 'Pray for someone who has made you angry and ask for a soft heart',
                'comfort': 'God sees your anger and offers His peace to calm your heart.',
                'badge': 'Peacemaker'
            },
            'tired': {
                'challenge': 'Ask God for rest and strength, then take a few minutes of quiet time',
                'comfort': 'Come to Jesus, all who are weary, and He will give you rest.',
                'badge': 'Rest Seeker'
            }
        }
        
        # Bible Trivia Questions for Daily Quest
        self.bible_trivia = [
            {
                'question': 'What is the first book of the Old Testament?',
                'options': ['Exodus', 'Genesis', 'Leviticus', 'Numbers'],
                'correct_answer': 'Genesis',
                'explanation': 'Genesis means "beginning" and tells the story of creation and God\'s covenant with humanity.'
            },
            {
                'question': 'Who was swallowed by a great fish?',
                'options': ['Jonah', 'Moses', 'David', 'Daniel'],
                'correct_answer': 'Jonah',
                'explanation': 'Jonah was swallowed by a great fish when he tried to run from God\'s call to preach to Nineveh.'
            },
            {
                'question': 'How many apostles did Jesus choose?',
                'options': ['10', '11', '12', '13'],
                'correct_answer': '12',
                'explanation': 'Jesus chose 12 apostles to be his closest followers, representing the 12 tribes of Israel.'
            },
            {
                'question': 'What did Jesus turn water into at the wedding?',
                'options': ['Wine', 'Bread', 'Fish', 'Oil'],
                'correct_answer': 'Wine',
                'explanation': 'Jesus performed his first miracle at a wedding in Cana, turning water into wine.'
            },
            {
                'question': 'Who baptized Jesus?',
                'options': ['Peter', 'Paul', 'John the Baptist', 'Andrew'],
                'correct_answer': 'John the Baptist',
                'explanation': 'John the Baptist baptized Jesus in the Jordan River, and God\'s voice spoke from heaven.'
            },
            {
                'question': 'How many days was Jesus in the tomb?',
                'options': ['1', '2', '3', '4'],
                'correct_answer': '3',
                'explanation': 'Jesus was crucified on Friday and rose from the dead on Sunday - three days total.'
            },
            {
                'question': 'What did Moses part to help the Israelites escape Egypt?',
                'options': ['Jordan River', 'Red Sea', 'Dead Sea', 'Mediterranean Sea'],
                'correct_answer': 'Red Sea',
                'explanation': 'God used Moses to part the Red Sea, allowing the Israelites to walk through on dry ground.'
            },
            {
                'question': 'Who was the strongest man in the Bible?',
                'options': ['David', 'Goliath', 'Samson', 'Joshua'],
                'correct_answer': 'Samson',
                'explanation': 'Samson was blessed by God with supernatural strength, as long as his hair remained uncut.'
            },
            {
                'question': 'What did David use to defeat Goliath?',
                'options': ['Sword', 'Spear', 'Sling and stone', 'Bow and arrow'],
                'correct_answer': 'Sling and stone',
                'explanation': 'Young David defeated the giant Goliath with just a sling and a smooth stone, trusting in God.'
            },
            {
                'question': 'How many books are in the Bible?',
                'options': ['64', '65', '66', '67'],
                'correct_answer': '66',
                'explanation': 'The Bible contains 66 books total: 39 in the Old Testament and 27 in the New Testament.'
            }
        ]
    
    def get_daily_trivia(self) -> Dict:
        """Get a random Bible trivia question for the daily quest"""
        import random
        trivia_question = random.choice(self.bible_trivia)
        
        # Shuffle the options to make it more challenging
        options = trivia_question['options'].copy()
        random.shuffle(options)
        
        return {
            'question': trivia_question['question'],
            'options': options,
            'correct_answer': trivia_question['correct_answer'],
            'explanation': trivia_question['explanation']
        }
    
    def submit_trivia_answer(self, session_id: str, answer: str, is_correct: bool) -> Dict:
        """Process trivia answer submission and award XP if correct"""
        user_data = self.get_user_data(session_id)
        
        if is_correct:
            # Award XP for correct answer
            xp_gained = 3
            user_data['xp'] += xp_gained
            user_data['total_actions'] += 1
            
            # Update level if necessary
            old_level = user_data['level']
            for level, threshold in self.level_thresholds.items():
                if user_data['xp'] >= threshold:
                    user_data['level'] = level
            level_up = user_data['level'] != old_level
            
            # Save progress
            self.save_user_data(session_id, user_data)
            
            return {
                'success': True,
                'xp_gained': xp_gained,
                'total_xp': user_data['xp'],
                'level': user_data['level'],
                'level_up': level_up,
                'message': 'Excellent Bible knowledge!'
            }
        else:
            # No XP for incorrect answers, but still encourage
            return {
                'success': True,
                'xp_gained': 0,
                'message': 'Great effort! Keep studying God\'s word!'
            }
    
    def get_user_data(self, session_id: str) -> Dict:
        """Get user's gamification data from storage"""
        global SESSION_STORAGE
        
        # Try to get from Flask session first, then from global storage
        from flask import session
        flask_session_key = f'gamified_data_{session_id}'
        
        existing_data = None
        if flask_session_key in session:
            self.logger.info(f"Loading user data from Flask session for {session_id}")
            existing_data = session[flask_session_key].copy()
        elif session_id in SESSION_STORAGE:
            self.logger.info(f"Loading user data from global storage for {session_id}")
            existing_data = SESSION_STORAGE[session_id].copy()
        
        # Ensure bible_studies field exists
        if existing_data:
            if 'bible_studies' not in existing_data:
                existing_data['bible_studies'] = {}
            if 'studies_completed' not in existing_data:
                existing_data['studies_completed'] = 0
            # Ensure daily_goals exists with all required keys (fix for XP completion errors)
            if 'daily_goals' not in existing_data:
                existing_data['daily_goals'] = {'devotion': False, 'prayer': False, 'reading': False, 'study': False}
            required_goals = ['devotion', 'prayer', 'reading', 'study']
            for goal in required_goals:
                if goal not in existing_data['daily_goals']:
                    existing_data['daily_goals'][goal] = False
            # Save updated data back
            SESSION_STORAGE[session_id] = existing_data
            session[flask_session_key] = existing_data
            return existing_data
        else:
            # Initialize with enhanced default data for new users
            default_data = {
                'xp': 0,
                'level': 'Seedling',
                'level_icon': '🌱',
                'next_level': 'Disciple',
                'progress_to_next': 0,
                'streak': {
                    'devotion': 0,
                    'prayer': 0,
                    'reading': 0,
                    'study': 0,
                    'last_devotion': None,
                    'last_prayer': None,
                    'last_reading': None,
                    'last_study': None
                },
                'badges': [],
                'power_ups': [],
                'equipped_power_ups': [],
                'completed_challenges': [],
                'scripture_adventure_position': 0,
                'verse_mastery_progress': [],
                'mood_missions_completed': [],
                'total_actions': 0,
                'bible_studies': {},  # {study_id: {'current_session': 1, 'completed_sessions': [], 'answers': {}}}
                'studies_completed': 0,
                'faith_points': 0,
                'daily_goals': {
                    'devotion': False,
                    'prayer': False,
                    'reading': False,
                    'study': False
                }
            }
            
            self.logger.info(f"Created new user data for session {session_id}")
            # Save to both storages
            SESSION_STORAGE[session_id] = default_data.copy()
            session[flask_session_key] = default_data.copy()
            return default_data.copy()
    
    def calculate_level_progress(self, user_data: Dict) -> Dict:
        """Calculate current level and progress to next level"""
        current_xp = user_data.get('xp', 0)
        
        # Find current level based on XP
        current_level_info = None
        next_level_info = None
        
        for i, level in enumerate(self.spiritual_levels):
            if current_xp >= level['xp_required']:
                current_level_info = level
                # Get next level if it exists
                if i + 1 < len(self.spiritual_levels):
                    next_level_info = self.spiritual_levels[i + 1]
            else:
                if next_level_info is None:
                    next_level_info = level
                break
        
        # Calculate progress to next level
        if current_level_info and next_level_info:
            xp_for_current = current_level_info['xp_required']
            xp_for_next = next_level_info['xp_required']
            progress_to_next = min(100, ((current_xp - xp_for_current) / (xp_for_next - xp_for_current)) * 100)
        else:
            progress_to_next = 100  # Max level reached
        
        return {
            'level': current_level_info['name'] if current_level_info else 'Seedling',
            'level_icon': current_level_info['icon'] if current_level_info else '🌱',
            'level_description': current_level_info['description'] if current_level_info else 'Beginning your faith journey',
            'next_level': next_level_info['name'] if next_level_info else 'Kingdom Builder',
            'progress_to_next': progress_to_next,
            'xp_to_next': next_level_info['xp_required'] - current_xp if next_level_info else 0
        }
    
    def award_power_up(self, session_id: str, power_up_id: str) -> Dict:
        """Award a power-up to the user"""
        user_data = self.get_user_data(session_id)
        
        if power_up_id in self.power_ups and power_up_id not in user_data.get('power_ups', []):
            user_data.setdefault('power_ups', []).append(power_up_id)
            self.save_user_data(session_id, user_data)
            
            power_up = self.power_ups[power_up_id]
            return {
                'success': True,
                'power_up': power_up,
                'message': f'New power-up unlocked: {power_up["name"]}!'
            }
        
        return {'success': False, 'message': 'Power-up already owned or invalid'}
    
    def save_user_data(self, session_id: str, data: Dict):
        """Save user's gamification data to storage"""
        global SESSION_STORAGE
        from flask import session
        
        # Update level information based on current XP
        level_info = self.calculate_level_progress(data)
        data.update(level_info)
        
        # Save to both global storage and Flask session for persistence
        SESSION_STORAGE[session_id] = data.copy()
        flask_session_key = f'gamified_data_{session_id}'
        session[flask_session_key] = data.copy()
        
        self.logger.info(f"Saved gamification data for session {session_id}: XP={data.get('xp', 0)}, Level={data.get('level', 'Seed')}")
        return True

    def complete_prayer_training(self, session_id: str, points: int) -> Dict:
        """Complete prayer training challenge and award points"""
        user_data = self.get_user_data(session_id)
        
        # Award XP for completing prayer training
        xp_gained = points
        user_data['xp'] += xp_gained
        user_data['total_actions'] += 1
        
        # Update prayer streak
        user_data['streaks']['prayer'] += 1
        user_data['streaks']['last_prayer'] = datetime.now().strftime('%Y-%m-%d')
        
        # Update level if necessary
        old_level = user_data['level']
        for level, threshold in self.level_thresholds.items():
            if user_data['xp'] >= threshold:
                user_data['level'] = level
        level_up = user_data['level'] != old_level
        
        # Check for badges
        if user_data['streaks']['prayer'] >= 5 and 'Prayer Warrior' not in user_data['badges']:
            user_data['badges'].append('Prayer Warrior')
        
        # Save progress
        self.save_user_data(session_id, user_data)
        
        return {
            'success': True,
            'xp_gained': xp_gained,
            'total_xp': user_data['xp'],
            'level': user_data['level'],
            'level_up': level_up,
            'message': f'Amazing! You earned {points} Prayer Power Points!'
        }
    
    def award_xp(self, user_data: Dict, amount: int = 1) -> Dict:
        """Award XP and check for level up"""
        user_data['xp'] += amount
        user_data['total_actions'] += 1
        
        # Check for level up
        old_level = user_data['level']
        for level, threshold in self.level_thresholds.items():
            if user_data['xp'] >= threshold:
                user_data['level'] = level
        
        # Award level badge if leveled up
        if user_data['level'] != old_level and user_data['level'] != 'Seed':
            badge_name = user_data['level']
            if badge_name not in user_data['badges']:
                user_data['badges'].append(badge_name)
        
        return user_data
    
    def check_and_award_badges(self, user_data: Dict) -> List[str]:
        """Check conditions and award new badges"""
        new_badges = []
        
        # Check each badge requirement
        if user_data['total_actions'] >= 1 and 'Faith Seed' not in user_data['badges']:
            user_data['badges'].append('Faith Seed')
            new_badges.append('Faith Seed')
        
        if user_data['streak']['devotion'] >= 3 and 'Devotion Keeper' not in user_data['badges']:
            user_data['badges'].append('Devotion Keeper')
            new_badges.append('Devotion Keeper')
        
        if len([c for c in user_data['completed_challenges'] if c.startswith('prayer')]) >= 5 and 'Prayer Warrior' not in user_data['badges']:
            user_data['badges'].append('Prayer Warrior')
            new_badges.append('Prayer Warrior')
        
        if len(user_data['verse_mastery_progress']) >= 10 and 'Verse Sage' not in user_data['badges']:
            user_data['badges'].append('Verse Sage')
            new_badges.append('Verse Sage')
        
        if user_data['scripture_adventure_position'] >= 5 and 'Scripture Explorer' not in user_data['badges']:
            user_data['badges'].append('Scripture Explorer')
            new_badges.append('Scripture Explorer')
        
        # Check for emotional resilience (3 different mood missions)
        unique_moods = set([m.split('_')[1] for m in user_data['mood_missions_completed'] if '_' in m])
        if len(unique_moods) >= 3 and 'Emotional Resilience' not in user_data['badges']:
            user_data['badges'].append('Emotional Resilience')
            new_badges.append('Emotional Resilience')
        
        return new_badges
    
    def get_daily_devotion(self, session_id: str) -> Dict:
        """Get morning or evening devotion based on time of day"""
        from flask import session as flask_session
        
        user_data = self.get_user_data(session_id)
        today = datetime.now().date().isoformat()
        current_hour = datetime.now().hour
        
        # Determine if morning (5 AM - 2 PM) or evening (2 PM - 5 AM next day)
        is_morning = 5 <= current_hour < 14
        devotion_type = 'morning' if is_morning else 'evening'
        
        # Get user's name from session if available
        user_name = flask_session.get('user_name', 'friend')
        
        # Check if already completed today
        streak_key = f'last_{devotion_type}_devotion'
        if user_data['streak'].get(streak_key) == today:
            return {
                'type': 'already_completed',
                'message': f'You\'ve already completed your {devotion_type} devotion today! Come back {"tonight" if is_morning else "tomorrow morning"} for the next one.',
                'streak': user_data['streak'].get(f'{devotion_type}_devotion', 0),
                'devotion_type': devotion_type
            }
        
        # Get the appropriate devotion and personalize it
        if devotion_type == 'morning':
            # Select random morning power-up
            devotion = random.choice(self.devotions['morning']).copy()
        else:
            devotion = self.devotions['evening'].copy()
        
        devotion['greeting'] = devotion['greeting'].format(name=user_name)
        
        return {
            'type': 'new_devotion',
            'devotion': devotion,
            'devotion_type': devotion_type,
            'current_streak': user_data['streak'].get(f'{devotion_type}_devotion', 0)
        }
    
    def complete_devotion(self, session_id: str, reflection_answer: str = "", activity_metadata=None) -> Dict:
        """Mark morning or evening devotion as complete and award XP"""
        user_data = self.get_user_data(session_id)
        today = datetime.now().date().isoformat()
        yesterday = (datetime.now().date() - timedelta(days=1)).isoformat()
        current_hour = datetime.now().hour
        
        # Determine if morning or evening devotion
        is_morning = 5 <= current_hour < 14
        devotion_type = 'morning' if is_morning else 'evening'
        
        # Update appropriate streak
        streak_key = f'{devotion_type}_devotion'
        last_key = f'last_{devotion_type}_devotion'
        
        # Initialize streak fields if they don't exist
        if streak_key not in user_data['streak']:
            user_data['streak'][streak_key] = 0
        if last_key not in user_data['streak']:
            user_data['streak'][last_key] = None
        
        # Update streak logic
        if user_data['streak'][last_key] == yesterday:
            user_data['streak'][streak_key] += 1
        else:
            user_data['streak'][streak_key] = 1
        
        user_data['streak'][last_key] = today
        
        # Also update the general devotion streak for backwards compatibility
        if user_data['streak']['last_devotion'] == yesterday:
            user_data['streak']['devotion'] += 1
        else:
            user_data['streak']['devotion'] = 1
        user_data['streak']['last_devotion'] = today
        
        # Award XP
        user_data = self.award_xp(user_data, 2)
        
        # Check for new badges
        new_badges = self.check_and_award_badges(user_data)
        
        # Save data
        self.save_user_data(session_id, user_data)
        
        return {
            'xp_earned': 2,
            'new_level': user_data['level'],
            'streak': user_data['streak']['devotion'],
            'new_badges': new_badges,
            'total_xp': user_data['xp']
        }
    
    def get_daily_quest(self, session_id: str) -> Dict:
        """Get today's daily quest (30-second Bible hero challenge)"""
        user_data = self.get_user_data(session_id)
        today = datetime.now().date().isoformat()
        
        # Initialize daily quest tracking if not exists
        if 'daily_quests' not in user_data:
            user_data['daily_quests'] = {}
        if 'last_quest_date' not in user_data:
            user_data['last_quest_date'] = None
        if 'quests_completed_today' not in user_data:
            user_data['quests_completed_today'] = 0
            
        # Reset daily progress if new day
        if user_data['last_quest_date'] != today:
            user_data['quests_completed_today'] = 0
            user_data['last_quest_date'] = today
            self.save_user_data(session_id, user_data)
        
        # Check if user has completed 5 quests today
        if user_data['quests_completed_today'] >= 5:
            return {
                'type': 'daily_complete',
                'message': 'Amazing! You\'ve completed all 5 daily quests today! 🎉 Come back tomorrow for new Bible hero adventures!',
                'completed': user_data['quests_completed_today'],
                'total_daily': 5
            }
        
        # Get today's quest set (5 different quests per day)
        import random
        random.seed(today)  # Same quests each day
        daily_quest_set = random.sample(self.daily_quests, 5)
        current_quest = daily_quest_set[user_data['quests_completed_today']]
        
        return {
            'type': 'new_quest',
            'quest': current_quest,
            'progress': {
                'completed': user_data['quests_completed_today'],
                'remaining': 5 - user_data['quests_completed_today'],
                'total': 5
            }
        }
    
    def complete_daily_quest(self, session_id: str) -> Dict:
        """Complete today's daily quest"""
        user_data = self.get_user_data(session_id)
        today = datetime.now().date().isoformat()
        
        # Increment quest completion counter
        if 'quests_completed_today' not in user_data:
            user_data['quests_completed_today'] = 0
        user_data['quests_completed_today'] += 1
        user_data['last_quest_date'] = today
        
        # Award XP (2 XP per quest)
        xp_earned = 2
        user_data = self.award_xp(user_data, xp_earned)
        
        # Bonus XP for completing all 5 daily quests
        bonus_xp = 0
        if user_data['quests_completed_today'] >= 5:
            bonus_xp = 5  # Bonus for completing all daily quests
            user_data = self.award_xp(user_data, bonus_xp)
        
        # Update quest streak
        if 'quest_streak' not in user_data['streak']:
            user_data['streak']['quest_streak'] = 0
            user_data['streak']['last_quest'] = None
            
        # Check if this maintains or breaks streak
        yesterday = (datetime.now().date() - timedelta(days=1)).isoformat()
        if user_data['streak']['last_quest'] == yesterday or user_data['streak']['last_quest'] == today:
            # Continuing streak or first quest today
            if user_data['streak']['last_quest'] != today:
                user_data['streak']['quest_streak'] += 1
        else:
            # Streak broken, restart
            user_data['streak']['quest_streak'] = 1
            
        user_data['streak']['last_quest'] = today
        
        # Check for new badges
        new_badges = self.check_and_award_badges(user_data)
        
        self.save_user_data(session_id, user_data)
        
        return {
            'xp_earned': xp_earned + bonus_xp,
            'base_xp': xp_earned,
            'bonus_xp': bonus_xp,
            'new_level': user_data['level'],
            'quest_progress': {
                'completed': user_data['quests_completed_today'],
                'remaining': 5 - user_data['quests_completed_today'],
                'total': 5
            },
            'streak': user_data['streak']['quest_streak'],
            'all_complete': user_data['quests_completed_today'] >= 5,
            'new_badges': new_badges,
            'total_xp': user_data['xp']
        }
    
    def get_verse_mastery_quiz(self, session_id: str) -> Dict:
        """Get a verse mastery quiz question"""
        # Select random verse
        verse = random.choice(self.verses_for_mastery)
        
        # Create fill-in-the-blank or multiple choice
        quiz_type = random.choice(['fill_blank', 'multiple_choice'])
        
        if quiz_type == 'fill_blank':
            words = verse['text'].split()
            blank_index = random.randint(2, len(words) - 2)  # Avoid first/last words
            blank_word = words[blank_index]
            quiz_text = ' '.join(words[:blank_index] + ['_____'] + words[blank_index + 1:])
            
            return {
                'type': 'fill_blank',
                'reference': verse['reference'],
                'quiz_text': quiz_text,
                'correct_answer': blank_word.lower().strip('.,!?'),
                'theme': verse['theme']
            }
        
        else:  # multiple choice
            # Create options
            correct_ref = verse['reference']
            wrong_refs = [v['reference'] for v in self.verses_for_mastery if v['reference'] != correct_ref]
            options = [correct_ref] + random.sample(wrong_refs, 2)
            random.shuffle(options)
            
            return {
                'type': 'multiple_choice',
                'text': verse['text'],
                'question': 'Which verse is this?',
                'options': options,
                'correct_answer': correct_ref,
                'theme': verse['theme']
            }
    
    def complete_verse_mastery(self, session_id: str, correct: bool) -> Dict:
        """Handle verse mastery completion"""
        user_data = self.get_user_data(session_id)
        
        if correct:
            # Award XP and track progress
            user_data = self.award_xp(user_data, 1)
            user_data['verse_mastery_progress'].append(datetime.now().isoformat())
            
            # Check for new badges
            new_badges = self.check_and_award_badges(user_data)
            
            self.save_user_data(session_id, user_data)
            
            return {
                'correct': True,
                'xp_earned': 1,
                'new_badges': new_badges,
                'total_xp': user_data['xp'],
                'verses_mastered': len(user_data['verse_mastery_progress'])
            }
        else:
            return {
                'correct': False,
                'encouragement': 'Keep studying! God\'s Word is worth learning.',
                'total_xp': user_data['xp']
            }
    
    def get_scripture_adventure_next(self, session_id: str) -> Dict:
        """Get next scripture adventure stop"""
        user_data = self.get_user_data(session_id)
        position = user_data['scripture_adventure_position']
        
        if position >= len(self.scripture_adventure):
            return {
                'type': 'completed',
                'message': 'Congratulations! You\'ve completed the entire Scripture Adventure journey!'
            }
        
        current_stop = self.scripture_adventure[position]
        
        return {
            'type': 'new_stop',
            'stop': current_stop,
            'position': position + 1,
            'total_stops': len(self.scripture_adventure)
        }
    
    def complete_scripture_adventure_stop(self, session_id: str) -> Dict:
        """Complete current adventure stop"""
        user_data = self.get_user_data(session_id)
        user_data['scripture_adventure_position'] += 1
        
        # Award XP
        user_data = self.award_xp(user_data, 3)  # Higher XP for adventure progress
        
        # Check for new badges
        new_badges = self.check_and_award_badges(user_data)
        
        self.save_user_data(session_id, user_data)
        
        return {
            'xp_earned': 3,
            'new_level': user_data['level'],
            'new_badges': new_badges,
            'total_xp': user_data['xp'],
            'next_available': user_data['scripture_adventure_position'] < len(self.scripture_adventure)
        }
    
    def get_mood_mission(self, mood: str) -> Dict:
        """Get mood-specific mission"""
        if mood.lower() not in self.mood_missions:
            mood = 'anxious'  # Default fallback
        
        mission = self.mood_missions[mood.lower()]
        
        return {
            'mood': mood,
            'challenge': mission['challenge'],
            'comfort': mission['comfort'],
            'badge': mission['badge']
        }
    
    def complete_mood_mission(self, session_id: str, mood: str) -> Dict:
        """Complete mood mission"""
        user_data = self.get_user_data(session_id)
        mission_id = f"mood_{mood.lower()}_{datetime.now().date().isoformat()}"
        user_data['mood_missions_completed'].append(mission_id)
        
        # Award XP
        user_data = self.award_xp(user_data, 1)
        
        # Check for new badges
        new_badges = self.check_and_award_badges(user_data)
        
        self.save_user_data(session_id, user_data)
        
        return {
            'xp_earned': 1,
            'new_badges': new_badges,
            'total_xp': user_data['xp'],
            'comfort_message': f"You\'ve taken a step toward emotional and spiritual health. God sees your heart."
        }
    
    def get_user_progress(self, session_id: str) -> Dict:
        """Get complete user progress overview"""
        user_data = self.get_user_data(session_id)
        
        # Calculate next level progress
        current_level = user_data['level']
        level_names = list(self.level_thresholds.keys())
        current_index = level_names.index(current_level)
        
        if current_index < len(level_names) - 1:
            next_level = level_names[current_index + 1]
            next_threshold = self.level_thresholds[next_level]
            progress_to_next = user_data['xp'] - self.level_thresholds[current_level]
            needed_for_next = next_threshold - self.level_thresholds[current_level]
            progress_percentage = (progress_to_next / needed_for_next) * 100
        else:
            next_level = "Max Level Reached"
            progress_percentage = 100
        
        return {
            'level': user_data['level'],
            'xp': user_data['xp'],
            'next_level': next_level,
            'progress_percentage': min(progress_percentage, 100),
            'badges': user_data['badges'],
            'streaks': user_data['streak'],
            'adventure_progress': user_data['scripture_adventure_position'],
            'verses_mastered': len(user_data['verse_mastery_progress']),
            'total_actions': user_data['total_actions'],
            'studies_completed': user_data.get('studies_completed', 0)
        }
    
    def get_bible_studies(self, session_id: str) -> Dict:
        """Get available Bible studies or current study session"""
        user_data = self.get_user_data(session_id)
        
        # Check if user has an active study session
        for study_id, progress in user_data['bible_studies'].items():
            if progress['current_session'] <= len(self.bible_studies[study_id]['sessions_data']):
                # Return current session
                study = self.bible_studies[study_id]
                session_number = progress['current_session']
                session_data = study['sessions_data'][session_number - 1]
                
                return {
                    'type': 'study_session',
                    'session': {
                        'study_id': study_id,
                        'title': study['title'],
                        'session_number': session_number,
                        'scripture_reference': session_data['scripture_reference'],
                        'scripture_text': session_data['scripture_text'],
                        'questions': session_data['questions'],
                        'xp_reward': session_data['xp_reward']
                    }
                }
        
        # No active study, return available studies
        available_studies = []
        for study_id, study in self.bible_studies.items():
            available_studies.append({
                'id': study['id'],
                'title': study['title'],
                'description': study['description'],
                'sessions': study['sessions'],
                'duration': study['duration'],
                'xp_reward': study['xp_reward']
            })
        
        return {
            'type': 'study_list',
            'studies': available_studies
        }
    
    def start_bible_study(self, session_id: str, study_id: str) -> Dict:
        """Start a new Bible study"""
        user_data = self.get_user_data(session_id)
        
        if study_id not in self.bible_studies:
            return {'success': False, 'message': 'Study not found'}
        
        # Initialize study progress
        user_data['bible_studies'][study_id] = {
            'current_session': 1,
            'completed_sessions': [],
            'answers': {}
        }
        
        self.save_user_data(session_id, user_data)
        
        return {'success': True, 'message': 'Study started successfully'}
    
    def complete_bible_study_session(self, session_id: str, study_id: str, session_number: int, answers: List[str]) -> Dict:
        """Complete a Bible study session"""
        user_data = self.get_user_data(session_id)
        
        if study_id not in self.bible_studies:
            return {'success': False, 'message': 'Study not found'}
        
        if study_id not in user_data['bible_studies']:
            return {'success': False, 'message': 'Study not started'}
        
        study = self.bible_studies[study_id]
        session_data = study['sessions_data'][session_number - 1]
        
        # Save answers
        user_data['bible_studies'][study_id]['answers'][f'session_{session_number}'] = answers
        
        # Mark session as completed
        if session_number not in user_data['bible_studies'][study_id]['completed_sessions']:
            user_data['bible_studies'][study_id]['completed_sessions'].append(session_number)
        
        # Award XP
        user_data = self.award_xp(user_data, session_data['xp_reward'])
        
        # Check if study is complete
        total_sessions = len(study['sessions_data'])
        completed_sessions = len(user_data['bible_studies'][study_id]['completed_sessions'])
        
        if completed_sessions >= total_sessions:
            # Study completed
            user_data['studies_completed'] += 1
            # Move to next session (will show study list next time)
            user_data['bible_studies'][study_id]['current_session'] = total_sessions + 1
            study_complete = True
        else:
            # Move to next session
            user_data['bible_studies'][study_id]['current_session'] = session_number + 1
            study_complete = False
        
        # Check for new badges
        new_badges = self.check_and_award_badges(user_data)
        
        self.save_user_data(session_id, user_data)
        
        return {
            'success': True,
            'xp_earned': session_data['xp_reward'],
            'new_level': user_data['level'],
            'new_badges': new_badges,
            'total_xp': user_data['xp'],
            'study_complete': study_complete,
            'message': 'Great reflection! Your insights are valuable for spiritual growth.' if not study_complete else f'Congratulations! You\'ve completed the "{study["title"]}" study!'
        }
