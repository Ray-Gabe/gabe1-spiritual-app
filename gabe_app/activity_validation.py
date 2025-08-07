"""
GABE Activity Validation System
Ensures genuine spiritual engagement through comprehensive verification mechanisms
"""

import logging
import json
import hashlib
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import random

class ActivityValidator:
    def __init__(self):
        """Initialize the activity validation system"""
        self.logger = logging.getLogger(__name__)
        
        # Minimum time thresholds for activities (in seconds)
        self.min_activity_times = {
            'devotion': 180,        # 3 minutes minimum for devotion
            'prayer': 60,           # 1 minute minimum for prayer
            'bible_reading': 120,   # 2 minutes minimum for reading
            'bible_study': 300,     # 5 minutes minimum for study
            'verse_memorization': 90, # 1.5 minutes minimum for verses
            'trivia': 30           # 30 seconds minimum for trivia
        }
        
        # Validation requirements for each activity type
        self.validation_requirements = {
            'devotion': {
                'min_reflection_length': 20,    # Minimum characters in reflection
                'required_fields': ['reflection'],
                'time_threshold': 180,
                'engagement_checks': ['reflection_quality', 'time_spent']
            },
            'prayer': {
                'min_prayer_length': 15,        # Minimum characters in prayer
                'required_fields': ['prayer_text'],
                'time_threshold': 60,
                'engagement_checks': ['prayer_authenticity', 'time_spent']
            },
            'bible_reading': {
                'min_verses_read': 3,           # Minimum number of verses
                'required_fields': ['verses_read', 'key_insight'],
                'time_threshold': 120,
                'engagement_checks': ['comprehension_check', 'time_spent']
            },
            'bible_study': {
                'min_answers': 2,               # Minimum study questions answered
                'required_fields': ['study_answers', 'personal_application'],
                'time_threshold': 300,
                'engagement_checks': ['depth_analysis', 'time_spent', 'question_quality']
            },
            'verse_memorization': {
                'accuracy_threshold': 0.8,      # 80% accuracy required
                'required_fields': ['verse_attempt'],
                'time_threshold': 90,
                'engagement_checks': ['memory_accuracy', 'time_spent']
            }
        }
        
        # Suspicious behavior patterns to detect
        self.suspicious_patterns = {
            'rapid_completion': 10,     # Completing activities in less than 10 seconds
            'identical_responses': 3,   # Same response used 3+ times
            'pattern_responses': 5,     # Repetitive patterns in responses
            'time_inconsistency': 0.5   # Completion time vs claimed time ratio
        }

    def validate_activity_completion(self, activity_type: str, activity_data: Dict[str, Any], 
                                   session_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Comprehensive validation of activity completion
        
        Args:
            activity_type: Type of spiritual activity
            activity_data: Data submitted for the activity
            session_data: User's session information
            
        Returns:
            Validation result with authenticity score and feedback
        """
        validation_result = {
            'is_valid': False,
            'authenticity_score': 0.0,
            'validation_details': {},
            'feedback_message': '',
            'xp_multiplier': 1.0,
            'warnings': []
        }
        
        try:
            # Get validation requirements for this activity
            requirements = self.validation_requirements.get(activity_type, {})
            if not requirements:
                validation_result['warnings'].append(f"No validation rules defined for {activity_type}")
                validation_result['is_valid'] = True
                return validation_result
            
            # 1. TIME VALIDATION
            time_score = self._validate_time_spent(activity_type, activity_data, session_data)
            validation_result['validation_details']['time_validation'] = time_score
            
            # 2. CONTENT VALIDATION
            content_score = self._validate_content_quality(activity_type, activity_data, requirements)
            validation_result['validation_details']['content_validation'] = content_score
            
            # 3. ENGAGEMENT VALIDATION
            engagement_score = self._validate_user_engagement(activity_type, activity_data, session_data)
            validation_result['validation_details']['engagement_validation'] = engagement_score
            
            # 4. PATTERN ANALYSIS
            pattern_score = self._analyze_behavior_patterns(activity_data, session_data)
            validation_result['validation_details']['pattern_analysis'] = pattern_score
            
            # 5. CALCULATE OVERALL AUTHENTICITY SCORE
            authenticity_score = (time_score + content_score + engagement_score + pattern_score) / 4
            validation_result['authenticity_score'] = authenticity_score
            
            # 6. DETERMINE VALIDATION RESULT
            if authenticity_score >= 0.7:
                validation_result['is_valid'] = True
                validation_result['xp_multiplier'] = min(1.5, authenticity_score + 0.3)  # Bonus for high authenticity
                validation_result['feedback_message'] = "Authentic spiritual engagement detected! 🌟"
            elif authenticity_score >= 0.5:
                validation_result['is_valid'] = True
                validation_result['xp_multiplier'] = 0.8  # Reduced XP for questionable authenticity
                validation_result['feedback_message'] = "Activity completed. Consider deeper reflection next time."
                validation_result['warnings'].append("Low engagement detected")
            else:
                validation_result['is_valid'] = False
                validation_result['xp_multiplier'] = 0.0
                validation_result['feedback_message'] = "Please take more time for genuine spiritual reflection."
                validation_result['warnings'].append("Insufficient authentic engagement")
                
            return validation_result
            
        except Exception as e:
            self.logger.error(f"Activity validation error: {str(e)}")
            validation_result['warnings'].append("Validation system error - defaulting to partial credit")
            validation_result['is_valid'] = True
            validation_result['xp_multiplier'] = 0.5
            return validation_result

    def _validate_time_spent(self, activity_type: str, activity_data: Dict[str, Any], 
                           session_data: Dict[str, Any]) -> float:
        """Validate time spent on activity"""
        try:
            start_time = activity_data.get('start_time')
            end_time = activity_data.get('end_time', time.time())
            min_time = self.min_activity_times.get(activity_type, 30)
            
            if not start_time:
                return 0.3  # No time tracking = suspicious
                
            time_spent = end_time - start_time
            
            if time_spent < 5:  # Completed in less than 5 seconds
                return 0.0
            elif time_spent < min_time * 0.5:  # Less than half minimum time
                return 0.2
            elif time_spent < min_time:  # Less than minimum but reasonable
                return 0.6
            else:  # Met or exceeded minimum time
                return min(1.0, time_spent / (min_time * 2))  # Cap at 1.0, reward reasonable time
                
        except Exception as e:
            self.logger.error(f"Time validation error: {str(e)}")
            return 0.5

    def _validate_content_quality(self, activity_type: str, activity_data: Dict[str, Any], 
                                requirements: Dict[str, Any]) -> float:
        """Validate quality and authenticity of submitted content"""
        try:
            score = 0.0
            checks_passed = 0
            total_checks = 0
            
            # Check required fields
            required_fields = requirements.get('required_fields', [])
            for field in required_fields:
                total_checks += 1
                if field in activity_data and activity_data[field]:
                    content = str(activity_data[field]).strip()
                    
                    # Length checks
                    if activity_type == 'devotion' and field == 'reflection':
                        min_length = requirements.get('min_reflection_length', 20)
                        if len(content) >= min_length:
                            checks_passed += 1
                            score += self._analyze_text_authenticity(content)
                    elif activity_type == 'prayer' and field == 'prayer_text':
                        min_length = requirements.get('min_prayer_length', 15)
                        if len(content) >= min_length:
                            checks_passed += 1
                            score += self._analyze_prayer_authenticity(content)
                    elif activity_type == 'bible_study' and field == 'study_answers':
                        min_answers = requirements.get('min_answers', 2)
                        answers = content.split('\n') if isinstance(content, str) else content
                        if len(answers) >= min_answers:
                            checks_passed += 1
                            score += self._analyze_study_depth(answers)
                    else:
                        if len(content) > 5:  # Basic content check
                            checks_passed += 1
                            score += 0.5
            
            return score / max(1, total_checks) if total_checks > 0 else 0.5
            
        except Exception as e:
            self.logger.error(f"Content validation error: {str(e)}")
            return 0.5

    def _analyze_text_authenticity(self, text: str) -> float:
        """Analyze text for signs of authentic personal reflection"""
        try:
            authenticity_indicators = [
                ('personal pronouns', ['i ', 'my ', 'me ', 'myself']),
                ('emotional words', ['feel', 'felt', 'emotion', 'heart', 'soul']),
                ('faith language', ['god', 'lord', 'jesus', 'faith', 'pray', 'bible']),
                ('reflection words', ['learn', 'realize', 'understand', 'think', 'believe']),
                ('personal experience', ['today', 'yesterday', 'recently', 'experience', 'life'])
            ]
            
            text_lower = text.lower()
            score = 0.0
            
            for category, words in authenticity_indicators:
                found_words = sum(1 for word in words if word in text_lower)
                if found_words > 0:
                    score += min(0.2, found_words * 0.1)  # Max 0.2 per category
            
            # Penalty for very short or repetitive responses
            if len(text) < 10:
                score *= 0.3
            elif len(set(text.split())) / len(text.split()) < 0.5:  # High repetition
                score *= 0.6
                
            return min(1.0, score)
            
        except Exception as e:
            self.logger.error(f"Text authenticity analysis error: {str(e)}")
            return 0.5

    def _analyze_prayer_authenticity(self, prayer_text: str) -> float:
        """Analyze prayer text for authenticity markers"""
        try:
            prayer_indicators = [
                ('address to god', ['god', 'lord', 'father', 'jesus', 'holy spirit']),
                ('gratitude', ['thank', 'grateful', 'bless', 'praise']),
                ('requests', ['help', 'guide', 'protect', 'heal', 'forgive']),
                ('personal needs', ['i need', 'please help', 'i pray', 'i ask']),
                ('closing', ['amen', 'in jesus name', 'in your name'])
            ]
            
            prayer_lower = prayer_text.lower()
            score = 0.0
            
            for category, words in prayer_indicators:
                found_words = sum(1 for word in words if word in prayer_lower)
                if found_words > 0:
                    score += 0.2  # Each category worth 0.2
            
            return min(1.0, score)
            
        except Exception as e:
            self.logger.error(f"Prayer authenticity analysis error: {str(e)}")
            return 0.5

    def _analyze_study_depth(self, answers: List[str]) -> float:
        """Analyze Bible study answers for depth and thoughtfulness"""
        try:
            depth_score = 0.0
            
            for answer in answers:
                if len(answer.strip()) < 5:
                    continue
                    
                # Check for thoughtful indicators
                thoughtful_words = ['because', 'therefore', 'however', 'although', 'since', 'meaning', 'shows', 'teaches']
                personal_application = ['apply', 'practice', 'change', 'improve', 'learn', 'grow']
                
                answer_lower = answer.lower()
                depth_indicators = 0
                
                depth_indicators += sum(1 for word in thoughtful_words if word in answer_lower)
                depth_indicators += sum(1 for word in personal_application if word in answer_lower)
                
                # Length and complexity bonus
                if len(answer) > 50:
                    depth_indicators += 1
                if len(answer.split()) > 15:
                    depth_indicators += 1
                    
                depth_score += min(0.5, depth_indicators * 0.1)
            
            return min(1.0, depth_score)
            
        except Exception as e:
            self.logger.error(f"Study depth analysis error: {str(e)}")
            return 0.5

    def _validate_user_engagement(self, activity_type: str, activity_data: Dict[str, Any], 
                                session_data: Dict[str, Any]) -> float:
        """Validate user engagement patterns"""
        try:
            engagement_score = 0.5  # Default score
            
            # Check for engagement indicators
            if 'mouse_movements' in activity_data and activity_data['mouse_movements'] > 10:
                engagement_score += 0.1
                
            if 'key_presses' in activity_data and activity_data['key_presses'] > 20:
                engagement_score += 0.1
                
            if 'page_focus_time' in activity_data:
                focus_time = activity_data['page_focus_time']
                total_time = activity_data.get('end_time', time.time()) - activity_data.get('start_time', time.time())
                if total_time > 0 and focus_time / total_time > 0.8:  # 80% focus time
                    engagement_score += 0.2
                    
            # Check for copy-paste patterns (suspicious)
            if 'paste_events' in activity_data and activity_data['paste_events'] > 2:
                engagement_score -= 0.2
                
            return min(1.0, max(0.0, engagement_score))
            
        except Exception as e:
            self.logger.error(f"Engagement validation error: {str(e)}")
            return 0.5

    def _analyze_behavior_patterns(self, activity_data: Dict[str, Any], 
                                 session_data: Dict[str, Any]) -> float:
        """Analyze for suspicious behavior patterns"""
        try:
            pattern_score = 1.0  # Start with perfect score, deduct for issues
            
            # Check for rapid consecutive completions
            recent_activities = session_data.get('recent_activities', [])
            if len(recent_activities) > 1:
                time_gaps = []
                for i in range(1, len(recent_activities)):
                    if 'completion_time' in recent_activities[i] and 'completion_time' in recent_activities[i-1]:
                        gap = recent_activities[i]['completion_time'] - recent_activities[i-1]['completion_time']
                        time_gaps.append(gap)
                
                # Penalize rapid consecutive completions
                rapid_completions = sum(1 for gap in time_gaps if gap < 30)  # Less than 30 seconds apart
                if rapid_completions > 0:
                    pattern_score -= rapid_completions * 0.2
            
            # Check for identical responses
            current_response = str(activity_data.get('reflection', '') + activity_data.get('prayer_text', ''))
            if current_response:
                identical_count = 0
                for past_activity in recent_activities[-5:]:  # Check last 5 activities
                    past_response = str(past_activity.get('reflection', '') + past_activity.get('prayer_text', ''))
                    if current_response == past_response and len(current_response) > 10:
                        identical_count += 1
                
                if identical_count > 0:
                    pattern_score -= identical_count * 0.3
            
            return max(0.0, pattern_score)
            
        except Exception as e:
            self.logger.error(f"Pattern analysis error: {str(e)}")
            return 0.7

    def generate_validation_challenge(self, activity_type: str) -> Dict[str, Any]:
        """Generate a random validation challenge for enhanced verification"""
        challenges = {
            'devotion': [
                {
                    'type': 'reflection_prompt',
                    'question': 'What specific emotion did you feel during this devotion?',
                    'expected_type': 'emotional_response'
                },
                {
                    'type': 'application_prompt', 
                    'question': 'Name one specific action you will take today based on this devotion.',
                    'expected_type': 'action_plan'
                }
            ],
            'prayer': [
                {
                    'type': 'gratitude_check',
                    'question': 'What are you most grateful for right now?',
                    'expected_type': 'gratitude_response'
                },
                {
                    'type': 'intention_check',
                    'question': 'What did you specifically pray about?',
                    'expected_type': 'prayer_content'
                }
            ],
            'bible_reading': [
                {
                    'type': 'comprehension_check',
                    'question': 'What was the main message of the verses you read?',
                    'expected_type': 'summary_response'
                },
                {
                    'type': 'personal_connection',
                    'question': 'How does this passage relate to your life right now?',
                    'expected_type': 'personal_application'
                }
            ]
        }
        
        activity_challenges = challenges.get(activity_type, [])
        if activity_challenges:
            return random.choice(activity_challenges)
        
        return {
            'type': 'general_reflection',
            'question': 'What did you learn or feel during this spiritual activity?',
            'expected_type': 'general_response'
        }

# Global validator instance
activity_validator = ActivityValidator()
