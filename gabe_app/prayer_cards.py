"""
Prayer Cards System - Scripture + Prayer Prompt Format
Implements card-based prayer experiences with optional features
"""

import random
from typing import Dict, List

class PrayerCardsSystem:
    def __init__(self):
        self.prayer_cards = [
            {
                'id': 'quiet_storm',
                'title': 'Quiet the Storm Within',
                'icon': '⛈️',
                'color': '#6366f1',
                'scripture_text': 'The Lord is near. Do not be anxious...',
                'scripture_reference': 'Philippians 4:5-6',
                'prayer_prompt': 'Lord, meet me in my anxious thoughts. I lay down overthinking, doubt, and mental clutter. Renew my mind with Your truth.',
                'category': 'anxiety',
                'badge': 'Mind Renewed',
                'badge_icon': '🧠',
                'badge_color': '#3b82f6'
            },
            {
                'id': 'guard_heart',
                'title': 'Guard My Heart, God',
                'icon': '❤️',
                'color': '#ef4444',
                'scripture_text': 'He heals the brokenhearted...',
                'scripture_reference': 'Psalm 147:3',
                'prayer_prompt': 'God, I bring You the pieces of my broken trust. Heal wounds I pretend don\'t hurt. Let love in again.',
                'category': 'healing',
                'badge': 'Heart Healed',
                'badge_icon': '❤️',
                'badge_color': '#ef4444'
            },
            {
                'id': 'remind_identity',
                'title': 'Remind Me Who I Am',
                'icon': '👤',
                'color': '#f59e0b',
                'scripture_text': 'See what kind of love the Father has given to us...',
                'scripture_reference': '1 John 3:1',
                'prayer_prompt': 'God, in the noise of the world, remind me I am Yours. Not defined by failure, status, or fear.',
                'category': 'identity',
                'badge': 'Beloved Badge',
                'badge_icon': '🏅',
                'badge_color': '#f59e0b'
            },
            {
                'id': 'break_cycles',
                'title': 'Strength to Break Cycles',
                'icon': '🚫',
                'color': '#dc2626',
                'scripture_text': 'Let us put aside the deeds of darkness...',
                'scripture_reference': 'Romans 13:12',
                'prayer_prompt': 'Lord, shine light on habits that pull me from You. Replace craving with contentment. Let grace break chains.',
                'category': 'freedom',
                'badge': 'Chain Broken',
                'badge_icon': '⛓️‍💥',
                'badge_color': '#dc2626'
            },
            {
                'id': 'future_guidance',
                'title': 'God of What\'s Next',
                'icon': '🔮',
                'color': '#8b5cf6',
                'scripture_text': 'God, my future feels fuzzy. I surrender the pressure to figure it all out. Lead me one next step at a time.',
                'scripture_reference': 'Proverbs 3:5-6',
                'prayer_prompt': 'Trust in the Lord with all your heart and lean not on your own understanding...',
                'category': 'guidance',
                'badge': 'Path Found',
                'badge_icon': '🗺️',
                'badge_color': '#8b5cf6'
            },
            {
                'id': 'wordless_prayer',
                'title': 'What I Can\'t Say',
                'icon': '📱',
                'color': '#06b6d4',
                'scripture_text': 'Even when I have no words, You understand me. Hear the things I don\'t know how to pray.',
                'scripture_reference': 'Romans 8:26',
                'prayer_prompt': 'The Spirit helps us in our weakness...',
                'category': 'intercession',
                'badge': 'Heard',
                'badge_icon': '👂',
                'badge_color': '#06b6d4'
            }
        ]
        
        self.mirror_cards = [
            {
                'title': 'Pray for Family',
                'prompt': 'Choose a family member who needs God\'s blessing today',
                'icon': '👨‍👩‍👧‍👦',
                'color': '#10b981'
            },
            {
                'title': 'Pray for a Friend',
                'prompt': 'Think of a friend who could use encouragement',
                'icon': '👥',
                'color': '#3b82f6'
            },
            {
                'title': 'Pray for Someone Struggling',
                'prompt': 'Lift up someone going through a difficult time',
                'icon': '🤲',
                'color': '#f59e0b'
            },
            {
                'title': 'Pray for Your Community',
                'prompt': 'Ask God to bless your neighborhood or workplace',
                'icon': '🏘️',
                'color': '#8b5cf6'
            }
        ]
    
    def get_random_prayer_card(self) -> Dict:
        """Get a random prayer card for the session"""
        return random.choice(self.prayer_cards)
    
    def get_prayer_card_by_category(self, category: str) -> Dict:
        """Get a prayer card by specific category"""
        category_cards = [card for card in self.prayer_cards if card['category'] == category]
        return random.choice(category_cards) if category_cards else self.get_random_prayer_card()
    
    def get_mirror_card(self) -> Dict:
        """Get a random mirror card for praying for others"""
        return random.choice(self.mirror_cards)
    
    def complete_prayer_card(self, card_id: str, activity_metadata=None) -> Dict:
        """Complete a prayer card and return reward information"""
        card = next((c for c in self.prayer_cards if c['id'] == card_id), None)
        if not card:
            return {'success': False, 'message': 'Prayer card not found'}
        
        # Calculate engagement score if metadata provided
        engagement_score = 1.0
        bonus_xp = 0
        
        if activity_metadata:
            time_spent = activity_metadata.get('total_time', 0)
            engagement_score = min(time_spent / 30.0, 1.0)  # 30 seconds = full engagement
            
            if engagement_score >= 0.8:
                bonus_xp = 2
            elif engagement_score >= 0.6:
                bonus_xp = 1
        
        base_xp = 3
        total_xp = base_xp + bonus_xp
        
        return {
            'success': True,
            'xp_earned': total_xp,
            'badge_earned': card['badge'],
            'badge_icon': card['badge_icon'],
            'engagement_bonus': bonus_xp,
            'message': f'Prayer completed! {card["badge"]} earned.',
            'validation_score': engagement_score
        }
