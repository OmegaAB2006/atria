from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from github_analyzer import GitHubAnalyzer
from quiz_generator import QuizGenerator
from skill_tracker import SkillTracker

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize services
github_analyzer = GitHubAnalyzer()
quiz_generator = QuizGenerator(os.getenv('GEMINI_API_KEY', 'AIzaSyAtG6gB5C-ZnZGqcIhDAsTSPJr8OwYCSCw'))
skill_tracker = SkillTracker()

@app.route('/api/analyze-github', methods=['POST'])
def analyze_github():
    """Analyze a GitHub repository and extract skills"""
    data = request.json
    github_url = data.get('github_url')
    username = data.get('username')

    if not github_url and not username:
        return jsonify({'error': 'GitHub URL or username required'}), 400

    try:
        # Analyze repository or user profile
        if github_url:
            skills = github_analyzer.analyze_repository(github_url)
        else:
            skills = github_analyzer.analyze_user_profile(username)

        return jsonify({
            'success': True,
            'skills': skills
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-quiz', methods=['POST'])
def generate_quiz():
    """Generate a quiz based on skills"""
    data = request.json
    skill = data.get('skill')
    difficulty = data.get('difficulty', 'medium')
    question_count = data.get('question_count', 5)

    if not skill:
        return jsonify({'error': 'Skill is required'}), 400

    try:
        quiz = quiz_generator.generate_quiz(
            skill=skill,
            difficulty=difficulty,
            question_count=question_count
        )

        return jsonify({
            'success': True,
            'quiz': quiz
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/submit-quiz', methods=['POST'])
def submit_quiz():
    """Submit quiz answers and get score"""
    data = request.json
    user_id = data.get('user_id')
    skill = data.get('skill')
    answers = data.get('answers')
    correct_answers = data.get('correct_answers')
    weak_topics = data.get('weak_topics', [])

    try:
        score = skill_tracker.calculate_score(answers, correct_answers)
        skill_tracker.update_progress(user_id, skill, score, weak_topics)

        # Get updated progress
        progress = skill_tracker.get_user_progress(user_id)

        return jsonify({
            'success': True,
            'score': score,
            'progress': progress
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-progress/<user_id>', methods=['GET'])
def get_progress(user_id):
    """Get user's skill progress"""
    try:
        progress = skill_tracker.get_user_progress(user_id)
        return jsonify({
            'success': True,
            'progress': progress
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/add-skill', methods=['POST'])
def add_skill():
    """Add a new skill to user's constellation"""
    data = request.json
    user_id = data.get('user_id')
    skill = data.get('skill')

    try:
        skill_tracker.add_skill(user_id, skill)
        progress = skill_tracker.get_user_progress(user_id)

        return jsonify({
            'success': True,
            'progress': progress
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-recommendations', methods=['POST'])
def get_recommendations():
    """Get weak topics from test results"""
    data = request.json
    user_id = data.get('user_id')

    try:
        # Get weak topics from quiz history
        weak_topics = skill_tracker.get_weak_topics(user_id)

        return jsonify({
            'success': True,
            'weak_topics': weak_topics
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
