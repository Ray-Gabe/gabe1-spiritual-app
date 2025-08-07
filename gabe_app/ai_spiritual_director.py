"""
AI Spiritual Director - Advanced Personal Spiritual Direction System
Combines wisdom from saints, spiritual masters, and biblical principles for deep spiritual guidance
"""

import json
import logging
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import os
from google import genai
from google.genai import types

class SpiritualDirector:
    """AI-powered spiritual director with wisdom from saints and spiritual masters"""
    
    def __init__(self):
        self.client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        
        # Spiritual masters and their specialties
        self.spiritual_masters = {
            'st_john_of_the_cross': {
                'specialty': 'Dark night of the soul, mystical union, purification',
                'approach': 'Deep contemplative prayer, detachment from worldly things',
                'famous_quotes': [
                    "In the evening of life, we will be judged on love alone.",
                    "The soul that is attached to anything however much good there may be in it, will not arrive at the liberty of divine union."
                ]
            },
            'st_teresa_of_avila': {
                'specialty': 'Interior castle, stages of prayer, mystical experiences',
                'approach': 'Practical mysticism, self-knowledge, perseverance in prayer',
                'famous_quotes': [
                    "Let nothing disturb you. All things pass. God does not change.",
                    "Prayer is nothing else than being on terms of friendship with God."
                ]
            },
            'thomas_a_kempis': {
                'specialty': 'Imitation of Christ, humility, self-denial',
                'approach': 'Simple devotion, following Christ\'s example, inner peace',
                'famous_quotes': [
                    "Man proposes, but God disposes.",
                    "Be not angry that you cannot make others as you wish them to be, since you cannot make yourself as you wish to be."
                ]
            },
            'st_ignatius_loyola': {
                'specialty': 'Spiritual exercises, discernment, finding God in all things',
                'approach': 'Ignatian spirituality, examination of conscience, spiritual discernment',
                'famous_quotes': [
                    "Go forth and set the world on fire.",
                    "Teach us to give and not to count the cost."
                ]
            },
            'brother_lawrence': {
                'specialty': 'Practice of the presence of God, working prayer',
                'approach': 'Simple, continuous conversation with God in daily tasks',
                'famous_quotes': [
                    "We ought not to be weary of doing little things for the love of God.",
                    "The time of business does not with me differ from the time of prayer."
                ]
            },
            'st_francis_de_sales': {
                'specialty': 'Gentle spirituality, devotion for laypeople, spiritual friendship',
                'approach': 'Kind, patient guidance; spirituality integrated with daily life',
                'famous_quotes': [
                    "Have patience with all things, but chiefly have patience with yourself.",
                    "Be at peace with your own soul, then heaven and earth will be at peace with you."
                ]
            },
            'julian_of_norwich': {
                'specialty': 'Divine love, trust in God\'s goodness, hope in suffering',
                'approach': 'Contemplative trust, seeing God\'s love in all circumstances',
                'famous_quotes': [
                    "All shall be well, and all shall be well, and all manner of thing shall be well.",
                    "Prayer unites the soul to God."
                ]
            },
            'st_thérèse_of_lisieux': {
                'specialty': 'Little Way, spiritual childhood, trust and abandonment',
                'approach': 'Simple trust, small acts of love, spiritual childhood',
                'famous_quotes': [
                    "I will spend my heaven doing good on earth.",
                    "Miss no single opportunity of making some small sacrifice."
                ]
            }
        }
        
        # Spiritual direction session types
        self.session_types = {
            'discernment': 'Help with major life decisions and God\'s will',
            'prayer_life': 'Developing and deepening prayer practices',
            'spiritual_dryness': 'Guidance through periods of spiritual dryness',
            'sin_patterns': 'Breaking free from recurring sin patterns',
            'vocation': 'Understanding God\'s calling and purpose',
            'relationship_with_god': 'Deepening intimacy with God',
            'suffering': 'Finding meaning and growth in suffering',
            'spiritual_growth': 'General spiritual development and maturity'
        }
        
        # Biblical wisdom categories
        self.biblical_wisdom = {
            'trust': ['Proverbs 3:5-6', 'Isaiah 41:10', 'Jeremiah 29:11'],
            'patience': ['James 1:2-4', 'Romans 5:3-5', 'Ecclesiastes 3:1'],
            'prayer': ['Matthew 6:6', '1 Thessalonians 5:17', 'Philippians 4:6-7'],
            'love': ['1 Corinthians 13:4-7', 'John 15:12', '1 John 4:19'],
            'wisdom': ['Proverbs 9:10', 'James 1:5', '1 Corinthians 1:25'],
            'peace': ['John 14:27', 'Philippians 4:7', 'Isaiah 26:3'],
            'strength': ['Isaiah 40:31', 'Philippians 4:13', '2 Corinthians 12:9']
        }
    
    def assess_spiritual_need(self, user_message: str, conversation_history: List[Dict]) -> Dict:
        """Assess the user's spiritual need and recommend appropriate direction"""
        
        prompt = f"""
        As an AI spiritual director trained in the wisdom of Christian saints and spiritual masters, 
        analyze this person's spiritual need and provide guidance.
        
        User's message: "{user_message}"
        
        Recent conversation context: {json.dumps(conversation_history[-3:] if conversation_history else [])}
        
        Please assess:
        1. Primary spiritual need (discernment, prayer_life, spiritual_dryness, sin_patterns, vocation, relationship_with_god, suffering, spiritual_growth)
        2. Emotional state and spiritual maturity level
        3. Which spiritual master's wisdom would be most helpful
        4. Specific biblical wisdom needed
        
        Respond in JSON format:
        {{
            "spiritual_need": "category",
            "emotional_state": "description",
            "maturity_level": "beginner/intermediate/advanced",
            "recommended_master": "saint_name",
            "biblical_theme": "theme",
            "urgency": "low/medium/high",
            "session_focus": "specific area to focus on"
        }}
        """
        
        try:
            # Try Gemini with shorter timeout
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",  # Use faster model
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            
            assessment = json.loads(response.text)
            logging.info("Gemini assessment successful")
            return assessment
            
        except Exception as e:
            logging.error(f"Gemini assessment failed, using fallback: {e}")
            # Use smart fallback based on user message keywords
            if any(word in user_message.lower() for word in ['sad', 'depression', 'lonely', 'hurt']):
                return {
                    "spiritual_need": "suffering",
                    "emotional_state": "experiencing sadness",
                    "maturity_level": "intermediate",
                    "recommended_master": "st_francis_de_sales",
                    "biblical_theme": "peace",
                    "urgency": "medium",
                    "session_focus": "comfort in sadness"
                }
            else:
                return {
                    "spiritual_need": "spiritual_growth",
                    "emotional_state": "seeking guidance",
                    "maturity_level": "intermediate",
                    "recommended_master": "st_francis_de_sales",
                    "biblical_theme": "trust",
                    "urgency": "medium",
                    "session_focus": "general spiritual encouragement"
                }
    
    def create_spiritual_direction_session(self, assessment: Dict, user_message: str, user_name: str = "friend") -> Dict:
        """Create a personalized spiritual direction session"""
        
        master_key = assessment.get('recommended_master', 'st_francis_de_sales')
        master_info = self.spiritual_masters.get(master_key, self.spiritual_masters['st_francis_de_sales'])
        
        biblical_theme = assessment.get('biblical_theme', 'trust')
        relevant_verses = self.biblical_wisdom.get(biblical_theme, self.biblical_wisdom['trust'])
        
        session_prompt = f"""
        You are {master_key.replace('_', ' ').title()}. Give very short spiritual guidance (MAX 80 words total).

        Person said: "{user_message}"

        Response format (be extremely brief):
        • Acknowledge: [1 sentence]
        • Insight: [1 sentence about {master_info['specialty']}]  
        • Scripture: "{relevant_verses[0]}"
        • Practice: [1 simple action for today]
        • Prayer: [2 short lines only]

        Be loving but extremely concise. No long paragraphs. Mobile-friendly format.
        """
        
        try:
            # Try Gemini with faster model
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",  # Faster model
                contents=session_prompt
            )
            
            raw_text = response.text or "The Lord is with you in this moment, dear friend."
            logging.info("Gemini direction successful")
            
        except Exception as e:
            logging.error(f"Gemini direction failed, using template: {e}")
            raw_text = "The Lord is with you in this moment, dear friend."
        
        # Force template format for all responses to ensure mobile-friendly length
        direction_text = self.create_short_template(master_key, master_info, relevant_verses[0], assessment, user_message, user_name)
        
        # Create follow-up recommendations
        follow_up = self.create_follow_up_plan(assessment, master_key)
        
        return {
            'success': True,
            'spiritual_director': master_key.replace('_', ' ').title(),
            'direction_text': direction_text,
            'bible_verses': relevant_verses[:2],
            'spiritual_practice': follow_up['practice'],
            'follow_up_in_days': follow_up['days'],
            'master_quote': random.choice(master_info['famous_quotes']),
            'session_type': assessment['spiritual_need'],
            'xp_earned': 5  # Spiritual direction earns significant XP
        }
    
    def create_short_template(self, master_key: str, master_info: Dict, bible_verse: str, assessment: Dict, user_message: str, user_name: str) -> str:
        """Create a short template response when AI generates too much text"""
        master_name = master_key.replace('_', ' ').title()
        
        # Check if user is dealing with sadness specifically
        is_sad = any(word in user_message.lower() for word in ['sad', 'depression', 'lonely', 'hurt', 'down', 'hopeless'])
        
        if is_sad and master_key == 'st_francis_de_sales':
            return f"Dear {user_name}, I hear the sadness in your heart, and I want you to know that you are not alone.\n\nWhat you're feeling right now matters deeply to God. He sees every tear, every struggle, every moment when hope feels distant.\n\nSadness is not a sin - even Jesus wept. Allow yourself to feel, but remember God's tender love for you in this season of your life.\n\n📖 {bible_verse}\n\n✨ Practice: When sadness comes, whisper 'Jesus, I trust in Your love for me.'\n\n🙏 Prayer:\nCompassionate Father, hold my heavy heart.\nLet Your peace fill these empty spaces. Amen.\n\n— St. Francis de Sales"
        
        templates = {
            'st_teresa_of_avila': f"Dear {user_name}, I understand the weight of what you're carrying, and I want you to know that your concerns are valid.\n\nGod invites you into deeper relationship through these very struggles you're experiencing. He is not distant, but intimately present with you.\n\nRemember that prayer is friendship with God. In times of uncertainty, turn to interior prayer where His love can truly reach your heart.\n\n📖 {bible_verse}\n\n✨ Practice: Spend 10 minutes in quiet prayer today, simply talking to God as a friend.\n\n🙏 Prayer:\nLord, grant me peace in this moment.\nLet nothing disturb my trust in You. Amen.\n\n— St. Teresa of Avila",
            
            'st_francis_de_sales': f"Dear {user_name}, I hear your heart's concern, and I want you to know that what you're feeling is important.\n\nGod sees exactly where you are right now, and He meets you there with infinite gentleness. You don't have to have it all figured out.\n\nBe patient with yourself as God works in your life. His timing is perfect, and His love surrounds you even when you can't feel it.\n\n📖 {bible_verse}\n\n✨ Practice: Take three deep breaths today and remind yourself 'God loves me as I am.'\n\n🙏 Prayer:\nGentle Jesus, calm my anxious heart.\nFill me with Your perfect peace. Amen.\n\n— St. Francis de Sales",
            
            'thomas_a_kempis': f"Dear {user_name}, I see the burden you're carrying, and I want you to know that Christ understands your struggle intimately.\n\nHe too walked through difficult seasons and knows the weight of human suffering. You are not walking this path alone.\n\nFollow His example of humble trust. In surrender, find peace that the world cannot give but only Christ can provide.\n\n📖 {bible_verse}\n\n✨ Practice: Ask yourself 'What would Jesus do?' before each decision today.\n\n🙏 Prayer:\nJesus, help me follow Your example.\nTeach me true humility. Amen.\n\n— Thomas à Kempis"
        }
        
        return templates.get(master_key, templates['st_francis_de_sales'])
    
    def create_follow_up_plan(self, assessment: Dict, master_key: str) -> Dict:
        """Create a personalized follow-up spiritual practice plan"""
        
        practices_by_master = {
            'st_john_of_the_cross': {
                'practice': 'Spend 10 minutes in silent contemplation daily',
                'days': 7
            },
            'st_teresa_of_avila': {
                'practice': 'Practice the prayer of recollection for 15 minutes',
                'days': 5
            },
            'thomas_a_kempis': {
                'practice': 'Read one chapter of The Imitation of Christ and reflect',
                'days': 3
            },
            'st_ignatius_loyola': {
                'practice': 'Perform a daily examen each evening',
                'days': 7
            },
            'brother_lawrence': {
                'practice': 'Practice the presence of God during daily tasks',
                'days': 5
            },
            'st_francis_de_sales': {
                'practice': 'Spend time in gentle conversation with God',
                'days': 4
            },
            'julian_of_norwich': {
                'practice': 'Meditate on God\'s goodness for 10 minutes daily',
                'days': 6
            },
            'st_thérèse_of_lisieux': {
                'practice': 'Perform small acts of love throughout the day',
                'days': 5
            }
        }
        
        return practices_by_master.get(master_key, {
            'practice': 'Spend time in prayer and scripture reading',
            'days': 5
        })
    
    def track_spiritual_direction_progress(self, session_id: str, completed_practice: bool, reflection: str = "") -> Dict:
        """Track progress on spiritual direction recommendations"""
        
        # In a full implementation, this would store progress in database
        xp_bonus = 3 if completed_practice else 0
        
        if completed_practice and len(reflection) > 50:
            xp_bonus += 2  # Bonus for thoughtful reflection
        
        return {
            'success': True,
            'xp_earned': xp_bonus,
            'message': 'Your faithfulness in following spiritual direction is bearing fruit!' if completed_practice else 'Keep growing at your own pace - God is patient with you.',
            'next_session_available': True
        }
    
    def get_daily_spiritual_direction_prompt(self) -> Dict:
        """Get a daily prompt for spiritual growth"""
        
        daily_prompts = [
            {
                'master': 'St. Francis de Sales',
                'prompt': 'How can I show gentleness to myself and others today?',
                'reflection': 'Practice patience with your imperfections'
            },
            {
                'master': 'Brother Lawrence',
                'prompt': 'In what ordinary task can I practice the presence of God?',
                'reflection': 'Turn routine activities into prayer'
            },
            {
                'master': 'St. Thérèse of Lisieux',
                'prompt': 'What small act of love can I offer today?',
                'reflection': 'Look for hidden opportunities to serve'
            },
            {
                'master': 'St. Ignatius Loyola',
                'prompt': 'Where did I sense God\'s presence yesterday?',
                'reflection': 'Practice the daily examen'
            },
            {
                'master': 'Julian of Norwich',
                'prompt': 'How has God shown His goodness to me recently?',
                'reflection': 'Trust in divine providence'
            }
        ]
        
        return random.choice(daily_prompts)
