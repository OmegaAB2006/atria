import re
from collections import Counter
import requests
from github import Github

class GitHubAnalyzer:
    def __init__(self, access_token=None):
        self.github = Github(access_token) if access_token else Github()

        # Language to skill mapping
        self.language_skills = {
            'Python': ['Python', 'Backend', 'Scripting'],
            'JavaScript': ['JavaScript', 'Frontend', 'Web Development'],
            'TypeScript': ['TypeScript', 'Frontend', 'Web Development'],
            'Java': ['Java', 'Backend', 'OOP'],
            'C++': ['C++', 'Systems Programming', 'Algorithms'],
            'C': ['C', 'Systems Programming', 'Low-level'],
            'Go': ['Go', 'Backend', 'Microservices'],
            'Rust': ['Rust', 'Systems Programming', 'Memory Safety'],
            'Ruby': ['Ruby', 'Backend', 'Web Development'],
            'PHP': ['PHP', 'Backend', 'Web Development'],
            'Swift': ['Swift', 'iOS', 'Mobile Development'],
            'Kotlin': ['Kotlin', 'Android', 'Mobile Development'],
            'HTML': ['HTML', 'Frontend', 'Web Development'],
            'CSS': ['CSS', 'Frontend', 'Styling'],
            'SQL': ['SQL', 'Database', 'Data Management'],
            'Shell': ['Shell', 'DevOps', 'Automation'],
        }

        # Framework detection patterns
        self.framework_patterns = {
            'React': r'(react|jsx)',
            'Vue': r'vue',
            'Angular': r'angular',
            'Django': r'django',
            'Flask': r'flask',
            'Express': r'express',
            'Node.js': r'(node|nodejs)',
            'Spring': r'spring',
            'TensorFlow': r'tensorflow',
            'PyTorch': r'pytorch',
            'Docker': r'docker',
            'Kubernetes': r'(kubernetes|k8s)',
            'AWS': r'(aws|amazon\s+web\s+services)',
            'PostgreSQL': r'(postgresql|postgres)',
            'MongoDB': r'mongodb',
            'Redis': r'redis',
            'GraphQL': r'graphql',
            'REST API': r'(rest|api)',
        }

    def analyze_repository(self, repo_url):
        """Analyze a single GitHub repository"""
        try:
            # Extract owner and repo name from URL
            parts = repo_url.rstrip('/').split('/')
            owner, repo_name = parts[-2], parts[-1]

            repo = self.github.get_repo(f"{owner}/{repo_name}")

            skills = {}

            # Analyze languages
            languages = repo.get_languages()
            total_bytes = sum(languages.values())

            for lang, bytes_count in languages.items():
                percentage = (bytes_count / total_bytes) * 100 if total_bytes > 0 else 0

                if lang in self.language_skills:
                    for skill in self.language_skills[lang]:
                        if skill not in skills:
                            skills[skill] = 0
                        skills[skill] += percentage

            # Analyze README and file contents for frameworks
            try:
                readme = repo.get_readme()
                readme_content = readme.decoded_content.decode('utf-8').lower()

                for framework, pattern in self.framework_patterns.items():
                    if re.search(pattern, readme_content, re.IGNORECASE):
                        if framework not in skills:
                            skills[framework] = 30  # Base score for framework detection
            except:
                pass

            # Analyze repository topics
            topics = repo.get_topics()
            for topic in topics:
                topic_formatted = topic.replace('-', ' ').title()
                if topic_formatted not in skills:
                    skills[topic_formatted] = 20

            # Normalize skills to 0-100 scale
            if skills:
                max_value = max(skills.values())
                skills = {k: min(100, (v / max_value) * 100) for k, v in skills.items()}

            return skills

        except Exception as e:
            raise Exception(f"Error analyzing repository: {str(e)}")

    def analyze_user_profile(self, username):
        """Analyze all repositories of a GitHub user"""
        try:
            user = self.github.get_user(username)
            repos = user.get_repos()

            all_skills = Counter()
            repo_count = 0

            for repo in repos:
                if repo.fork:
                    continue  # Skip forked repositories

                repo_count += 1

                # Analyze languages
                languages = repo.get_languages()
                total_bytes = sum(languages.values())

                for lang, bytes_count in languages.items():
                    if lang in self.language_skills:
                        percentage = (bytes_count / total_bytes) * 100 if total_bytes > 0 else 0
                        for skill in self.language_skills[lang]:
                            all_skills[skill] += percentage

                # Analyze topics
                topics = repo.get_topics()
                for topic in topics:
                    topic_formatted = topic.replace('-', ' ').title()
                    all_skills[topic_formatted] += 10

            # Calculate average and normalize
            if repo_count > 0:
                skills = {k: min(100, v / repo_count) for k, v in all_skills.items()}
            else:
                skills = {}

            return skills

        except Exception as e:
            raise Exception(f"Error analyzing user profile: {str(e)}")

    def analyze_file_types(self, repo):
        """Analyze file types in repository to detect additional skills"""
        skills = []

        try:
            contents = repo.get_contents("")

            file_extensions = {
                '.py': 'Python',
                '.js': 'JavaScript',
                '.ts': 'TypeScript',
                '.java': 'Java',
                '.cpp': 'C++',
                '.go': 'Go',
                '.rs': 'Rust',
                '.rb': 'Ruby',
                '.php': 'PHP',
                '.swift': 'Swift',
                '.kt': 'Kotlin',
                '.sql': 'SQL',
                '.yml': 'DevOps',
                '.yaml': 'DevOps',
                '.dockerfile': 'Docker',
            }

            while contents:
                file_content = contents.pop(0)
                if file_content.type == "dir":
                    contents.extend(repo.get_contents(file_content.path))
                else:
                    for ext, skill in file_extensions.items():
                        if file_content.name.endswith(ext):
                            skills.append(skill)

        except:
            pass

        return skills
