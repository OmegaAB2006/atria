import json
import os
from datetime import datetime

class SkillTracker:
    def __init__(self, data_file='user_data.json'):
        self.data_file = data_file
        self.data = self._load_data()

    def _load_data(self):
        """Load user data from JSON file"""
        if os.path.exists(self.data_file):
            with open(self.data_file, 'r') as f:
                return json.load(f)
        return {}

    def _save_data(self):
        """Save user data to JSON file"""
        with open(self.data_file, 'w') as f:
            json.dump(self.data, f, indent=2)

    def get_user_progress(self, user_id):
        """Get user's skill progress"""
        if user_id not in self.data:
            self.data[user_id] = {
                'skills': {},
                'quiz_history': [],
                'created_at': datetime.now().isoformat()
            }
            self._save_data()

        return self.data[user_id]['skills']

    def update_progress(self, user_id, skill, score, weak_topics=None):
        """Update user's progress for a skill based on quiz score"""
        if user_id not in self.data:
            self.data[user_id] = {
                'skills': {},
                'quiz_history': [],
                'weak_topics': [],
                'created_at': datetime.now().isoformat()
            }

        # Initialize weak_topics if not present
        if 'weak_topics' not in self.data[user_id]:
            self.data[user_id]['weak_topics'] = []

        # Get current progress
        current_progress = self.data[user_id]['skills'].get(skill, 0)

        # Calculate new progress (weighted average favoring recent scores)
        # New score has 70% weight, existing progress has 30% weight
        new_progress = (score * 0.7) + (current_progress * 0.3)

        # Cap at 100
        new_progress = min(100, new_progress)

        # Update skill progress
        self.data[user_id]['skills'][skill] = round(new_progress, 2)

        # Track weak topics if score is below 70%
        if score < 70 and weak_topics:
            for topic in weak_topics:
                topic_entry = {
                    'skill': skill,
                    'topic': topic,
                    'score': score,
                    'timestamp': datetime.now().isoformat()
                }
                # Add only if not already tracked recently
                if not any(t.get('topic') == topic and t.get('skill') == skill
                          for t in self.data[user_id]['weak_topics'][-10:]):
                    self.data[user_id]['weak_topics'].append(topic_entry)

        # If score is low (<70), mark the skill itself as weak
        if score < 70:
            topic_entry = {
                'skill': skill,
                'topic': skill,
                'score': score,
                'timestamp': datetime.now().isoformat()
            }
            if not any(t.get('topic') == skill and t.get('skill') == skill
                      for t in self.data[user_id]['weak_topics'][-5:]):
                self.data[user_id]['weak_topics'].append(topic_entry)

        # Add to quiz history
        self.data[user_id]['quiz_history'].append({
            'skill': skill,
            'score': score,
            'timestamp': datetime.now().isoformat()
        })

        self._save_data()

        return new_progress

    def add_skill(self, user_id, skill, initial_progress=0):
        """Add a new skill to user's constellation"""
        if user_id not in self.data:
            self.data[user_id] = {
                'skills': {},
                'quiz_history': [],
                'created_at': datetime.now().isoformat()
            }

        if skill not in self.data[user_id]['skills']:
            self.data[user_id]['skills'][skill] = initial_progress
            self._save_data()

        return self.data[user_id]['skills']

    def remove_skill(self, user_id, skill):
        """Remove a skill from user's constellation"""
        if user_id in self.data and skill in self.data[user_id]['skills']:
            del self.data[user_id]['skills'][skill]
            self._save_data()

        return self.data[user_id]['skills'] if user_id in self.data else {}

    def calculate_score(self, user_answers, correct_answers):
        """Calculate quiz score based on user answers"""
        if not user_answers or not correct_answers:
            return 0

        correct_count = 0
        total_questions = len(correct_answers)

        for i, correct_answer in enumerate(correct_answers):
            if i < len(user_answers) and user_answers[i] == correct_answer:
                correct_count += 1

        score = (correct_count / total_questions) * 100
        return round(score, 2)

    def get_quiz_history(self, user_id, skill=None):
        """Get quiz history for a user, optionally filtered by skill"""
        if user_id not in self.data:
            return []

        history = self.data[user_id]['quiz_history']

        if skill:
            history = [h for h in history if h['skill'] == skill]

        return history

    def get_weak_topics(self, user_id):
        """Get list of weak topics from quiz history"""
        if user_id not in self.data or 'weak_topics' not in self.data[user_id]:
            return []

        # Return unique weak topics (most recent 20)
        weak_topics = self.data[user_id]['weak_topics'][-20:]

        # Deduplicate while preserving order (keep most recent)
        seen = set()
        unique_topics = []
        for topic in reversed(weak_topics):
            topic_key = topic.get('topic')
            if topic_key and topic_key not in seen:
                seen.add(topic_key)
                unique_topics.append(topic)

        return list(reversed(unique_topics))

    def get_statistics(self, user_id):
        """Get detailed statistics for a user"""
        if user_id not in self.data:
            return {
                'total_skills': 0,
                'average_progress': 0,
                'total_quizzes': 0,
                'strongest_skills': [],
                'weakest_skills': []
            }

        skills = self.data[user_id]['skills']
        quiz_history = self.data[user_id]['quiz_history']

        if not skills:
            return {
                'total_skills': 0,
                'average_progress': 0,
                'total_quizzes': len(quiz_history),
                'strongest_skills': [],
                'weakest_skills': []
            }

        # Calculate statistics
        sorted_skills = sorted(skills.items(), key=lambda x: x[1], reverse=True)

        return {
            'total_skills': len(skills),
            'average_progress': round(sum(skills.values()) / len(skills), 2),
            'total_quizzes': len(quiz_history),
            'strongest_skills': sorted_skills[:3],
            'weakest_skills': sorted_skills[-3:],
            'last_activity': quiz_history[-1]['timestamp'] if quiz_history else None
        }

    def bulk_import_skills(self, user_id, skills_dict):
        """Import multiple skills at once (e.g., from GitHub analysis)"""
        if user_id not in self.data:
            self.data[user_id] = {
                'skills': {},
                'quiz_history': [],
                'created_at': datetime.now().isoformat()
            }

        # Merge with existing skills (keeping higher values)
        for skill, progress in skills_dict.items():
            current_progress = self.data[user_id]['skills'].get(skill, 0)
            self.data[user_id]['skills'][skill] = max(current_progress, progress)

        self._save_data()

        return self.data[user_id]['skills']
