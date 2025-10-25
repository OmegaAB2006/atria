// Configuration
const API_BASE_URL = 'http://localhost:5000';

// State
let constellation = null;
let currentUserId = 'user123'; // In a real app, this would come from authentication

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize constellation
    constellation = new Constellation('constellation');

    // Load user data
    await loadUserData();

    // Set up event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Handle enter key in GitHub input
    document.getElementById('github-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            analyzeGitHub();
        }
    });

    // Handle enter key in add skill input
    document.getElementById('new-skill-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addSkill();
        }
    });
}

function getUserId() {
    return currentUserId;
}

function showSection(section) {
    // Hide all sections
    document.getElementById('dashboard-section').classList.add('hidden');
    document.getElementById('quiz-section').classList.add('hidden');
    document.getElementById('recommendations-section').classList.add('hidden');

    // Show selected section
    document.getElementById(`${section}-section`).classList.remove('hidden');

    // Reset quiz if switching away
    if (section !== 'quiz') {
        resetQuiz();
    }
}

async function loadUserData() {
    try {
        const progress = await loadProgress(getUserId());
        const stats = await loadStatistics(getUserId());

        // Update constellation
        constellation.updateStars(progress);

        // Update skill cards
        renderSkillCards(progress);

        // Update statistics
        renderStatistics(stats);

        // Populate quiz skill dropdown
        populateQuizSkills(progress);

    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

async function loadProgress(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/get-progress/${userId}`);
        const data = await response.json();

        if (data.success) {
            return data.progress;
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }

    // Return mock data if API fails
    return getMockProgress();
}

async function loadStatistics(userId) {
    // In a real app, this would be an API call
    // For now, calculate from progress
    const progress = await loadProgress(userId);

    const skills = Object.entries(progress);
    const total = skills.length;
    const average = total > 0
        ? skills.reduce((sum, [_, val]) => sum + val, 0) / total
        : 0;

    const sorted = skills.sort((a, b) => b[1] - a[1]);

    return {
        total_skills: total,
        average_progress: average,
        total_quizzes: 0,
        strongest_skills: sorted.slice(0, 3),
        weakest_skills: sorted.slice(-3)
    };
}

async function analyzeGitHub() {
    const input = document.getElementById('github-input').value.trim();
    const statusDiv = document.getElementById('github-status');

    if (!input) {
        statusDiv.innerHTML = '<span class="text-red-400">Please enter a GitHub username or repository URL</span>';
        return;
    }

    statusDiv.innerHTML = '<span class="text-blue-400">Analyzing GitHub profile...</span>';

    try {
        // Determine if input is URL or username
        const isUrl = input.includes('github.com');

        const response = await fetch(`${API_BASE_URL}/api/analyze-github`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                github_url: isUrl ? input : null,
                username: !isUrl ? input : null
            })
        });

        const data = await response.json();

        if (data.success) {
            // Import skills
            const skills = data.skills;
            const skillCount = Object.keys(skills).length;

            statusDiv.innerHTML = `<span class="text-green-400">Successfully imported ${skillCount} skills from GitHub!</span>`;

            // Bulk import skills
            await bulkImportSkills(skills);

            // Reload user data
            await loadUserData();

            // Clear input
            document.getElementById('github-input').value = '';
        } else {
            statusDiv.innerHTML = `<span class="text-red-400">Error: ${data.error}</span>`;
        }
    } catch (error) {
        console.error('Error analyzing GitHub:', error);
        statusDiv.innerHTML = `<span class="text-red-400">Error analyzing GitHub. Please check the input and try again.</span>`;
    }
}

async function bulkImportSkills(skills) {
    try {
        // Import each skill
        for (const [skill, progress] of Object.entries(skills)) {
            await fetch(`${API_BASE_URL}/api/add-skill`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: getUserId(),
                    skill: skill
                })
            });

            // Update progress
            await fetch(`${API_BASE_URL}/api/submit-quiz`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: getUserId(),
                    skill: skill,
                    answers: [],
                    correct_answers: []
                })
            });
        }
    } catch (error) {
        console.error('Error importing skills:', error);
    }
}

function getMockProgress() {
    // Return mock data for demo purposes
    return {
        'JavaScript': 75,
        'Python': 60,
        'React': 80,
        'Node.js': 65,
        'CSS': 70,
        'HTML': 85,
        'Git': 55,
        'SQL': 50
    };
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add some initial demo skills if no skills exist
async function initializeDemoSkills() {
    const progress = await loadProgress(getUserId());

    if (Object.keys(progress).length === 0) {
        const demoSkills = {
            'JavaScript': 65,
            'Python': 50,
            'HTML': 75,
            'CSS': 60
        };

        await bulkImportSkills(demoSkills);
        await loadUserData();
    }
}

// Initialize demo skills on first load
setTimeout(initializeDemoSkills, 1000);
