import google.generativeai as genai
import json

class QuizGenerator:
    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash-latest')

    def generate_quiz(self, skill, difficulty='medium', question_count=5):
        """Generate a quiz with both LeetCode-style and MCQ questions"""

        # Calculate mix of questions (60% MCQ, 40% LeetCode-style)
        mcq_count = int(question_count * 0.6)
        coding_count = question_count - mcq_count

        quiz = {
            'skill': skill,
            'difficulty': difficulty,
            'questions': []
        }

        # Generate MCQ questions
        if mcq_count > 0:
            mcq_questions = self._generate_mcq(skill, difficulty, mcq_count)
            quiz['questions'].extend(mcq_questions)

        # Generate LeetCode-style coding questions
        if coding_count > 0:
            coding_questions = self._generate_coding_questions(skill, difficulty, coding_count)
            quiz['questions'].extend(coding_questions)

        return quiz

    def _generate_mcq(self, skill, difficulty, count):
        """Generate multiple choice questions"""

        prompt = f"""Generate {count} multiple choice questions about {skill} at {difficulty} difficulty level.

For each question, provide:
1. The question text
2. Four options (A, B, C, D)
3. The correct answer (letter)
4. A brief explanation

Format the response as a JSON array with this structure:
[
  {{
    "type": "mcq",
    "question": "question text",
    "options": {{
      "A": "option A text",
      "B": "option B text",
      "C": "option C text",
      "D": "option D text"
    }},
    "correct_answer": "A",
    "explanation": "explanation text"
  }}
]

Make the questions practical and relevant to real-world {skill} scenarios."""

        try:
            full_prompt = "You are an expert technical interviewer and educator.\n\n" + prompt
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.GenerationConfig(
                    temperature=0.7,
                    response_mime_type="application/json"
                )
            )

            content = response.text
            # Parse JSON response
            questions_data = json.loads(content)

            # Handle both direct array and object with questions key
            if isinstance(questions_data, dict):
                if 'questions' in questions_data:
                    return questions_data['questions']
                else:
                    # Try to get the first value if it's a dict
                    return list(questions_data.values())[0]
            return questions_data

        except Exception as e:
            print(f"Error generating MCQ: {e}")
            return []

    def _generate_coding_questions(self, skill, difficulty, count):
        """Generate LeetCode-style coding questions"""

        prompt = f"""Generate {count} LeetCode-style coding problems about {skill} at {difficulty} difficulty level.

For each problem, provide:
1. Problem title
2. Problem description
3. Example input/output
4. Constraints
5. Function signature (in Python)
6. Sample solution
7. Test cases

Format the response as a JSON array with this structure:
[
  {{
    "type": "coding",
    "title": "problem title",
    "description": "detailed problem description",
    "examples": [
      {{
        "input": "example input",
        "output": "example output",
        "explanation": "why this output"
      }}
    ],
    "constraints": ["constraint 1", "constraint 2"],
    "function_signature": "def function_name(params):",
    "solution": "complete solution code",
    "test_cases": [
      {{
        "input": "test input",
        "expected_output": "expected output"
      }}
    ],
    "difficulty": "{difficulty}"
  }}
]

Make the problems practical and test real-world {skill} knowledge."""

        try:
            full_prompt = "You are an expert algorithm designer and coding instructor.\n\n" + prompt
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.GenerationConfig(
                    temperature=0.7,
                    response_mime_type="application/json"
                )
            )

            content = response.text
            questions_data = json.loads(content)

            # Handle both direct array and object with questions key
            if isinstance(questions_data, dict):
                if 'questions' in questions_data:
                    return questions_data['questions']
                elif 'problems' in questions_data:
                    return questions_data['problems']
                else:
                    return list(questions_data.values())[0]
            return questions_data

        except Exception as e:
            print(f"Error generating coding questions: {e}")
            return []

    def generate_recommendations(self, user_progress):
        """Generate personalized learning recommendations based on user progress"""

        skills_text = "\n".join([f"- {skill}: {progress}%" for skill, progress in user_progress.items()])

        prompt = f"""Based on the following skill progress data, provide personalized learning recommendations:

{skills_text}

For each recommendation, provide:
1. Skill to focus on
2. Why they should improve this skill
3. Specific resources or topics to study
4. Estimated time to improve
5. Related skills that would benefit

Format the response as a JSON object with a 'recommendations' array:
{{
  "recommendations": [
    {{
      "skill": "skill name",
      "reason": "why improve this",
      "topics": ["topic 1", "topic 2"],
      "resources": ["resource 1", "resource 2"],
      "estimated_time": "2-3 weeks",
      "related_skills": ["skill 1", "skill 2"]
    }}
  ]
}}

Prioritize skills with lower progress scores and suggest complementary skills."""

        try:
            full_prompt = "You are a career development advisor and technical mentor.\n\n" + prompt
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.GenerationConfig(
                    temperature=0.7,
                    response_mime_type="application/json"
                )
            )

            content = response.text
            recommendations_data = json.loads(content)

            return recommendations_data.get('recommendations', [])

        except Exception as e:
            print(f"Error generating recommendations: {e}")
            return []

    def evaluate_code(self, code, problem, test_cases):
        """Evaluate submitted code against test cases"""

        prompt = f"""Evaluate the following code submission for this problem:

Problem: {problem['title']}
Description: {problem['description']}

Submitted Code:
{code}

Test Cases:
{json.dumps(test_cases, indent=2)}

Provide:
1. Whether the code passes all test cases
2. Code quality score (0-100)
3. Feedback on code style and efficiency
4. Suggestions for improvement

Format as JSON:
{{
  "passes_tests": true/false,
  "quality_score": 85,
  "feedback": "detailed feedback",
  "suggestions": ["suggestion 1", "suggestion 2"]
}}"""

        try:
            full_prompt = "You are a code reviewer and technical assessor.\n\n" + prompt
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.GenerationConfig(
                    temperature=0.3,
                    response_mime_type="application/json"
                )
            )

            content = response.text
            return json.loads(content)

        except Exception as e:
            print(f"Error evaluating code: {e}")
            return {
                "passes_tests": False,
                "quality_score": 0,
                "feedback": f"Error evaluating code: {str(e)}",
                "suggestions": []
            }
