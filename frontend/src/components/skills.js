function renderSkillCards(skills) {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';

    const skillsArray = Object.entries(skills).sort((a, b) => b[1] - a[1]);

    skillsArray.forEach(([skill, progress]) => {
        const card = document.createElement('div');
        card.className = 'skill-card rounded-lg p-6';
        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold text-white">${skill}</h3>
                <button
                    onclick="removeSkill('${skill}')"
                    class="text-red-400 hover:text-red-300 transition"
                >
                    ×
                </button>
            </div>
            <div class="mb-2">
                <div class="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                    <div
                        class="progress-bar h-full rounded-full transition-all duration-500"
                        style="width: ${progress}%"
                    ></div>
                </div>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-sm text-purple-300">${Math.round(progress)}%</span>
                <button
                    onclick="takeQuizForSkill('${skill}')"
                    class="text-sm text-purple-400 hover:text-purple-300 transition"
                >
                    Take Quiz
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderStatistics(stats) {
    const container = document.getElementById('statistics-container');
    container.innerHTML = '';

    const statItems = [
        {
            label: 'Total Skills',
            value: stats.total_skills || 0,
            icon: '⭐'
        },
        {
            label: 'Average Progress',
            value: `${Math.round(stats.average_progress || 0)}%`,
            icon: '📊'
        },
        {
            label: 'Total Quizzes',
            value: stats.total_quizzes || 0,
            icon: '📝'
        },
        {
            label: 'Strongest Skill',
            value: stats.strongest_skills && stats.strongest_skills[0]
                ? `${stats.strongest_skills[0][0]} (${Math.round(stats.strongest_skills[0][1])}%)`
                : 'N/A',
            icon: '🏆'
        }
    ];

    statItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'text-center';
        div.innerHTML = `
            <div class="text-3xl mb-2">${item.icon}</div>
            <div class="text-2xl font-bold text-white mb-1">${item.value}</div>
            <div class="text-sm text-purple-300">${item.label}</div>
        `;
        container.appendChild(div);
    });
}

function showSkillDetails(skill, progress) {
    // Create a detailed modal for skill
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="quiz-modal p-8 rounded-lg max-w-lg w-full mx-4">
            <h3 class="text-3xl font-bold text-white mb-4">${skill}</h3>
            <div class="mb-6">
                <div class="w-full bg-white/10 rounded-full h-6 overflow-hidden mb-2">
                    <div
                        class="progress-bar h-full rounded-full"
                        style="width: ${progress}%"
                    ></div>
                </div>
                <p class="text-xl text-purple-300 text-center">${Math.round(progress)}% Proficiency</p>
            </div>
            <div class="flex gap-4">
                <button
                    onclick="takeQuizForSkill('${skill}'); this.closest('.fixed').remove();"
                    class="btn-primary px-6 py-3 rounded-lg text-white font-semibold flex-1"
                >
                    Take Quiz
                </button>
                <button
                    onclick="this.closest('.fixed').remove()"
                    class="px-6 py-3 rounded-lg text-white border border-white/20 hover:bg-white/10 flex-1"
                >
                    Close
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showAddSkillModal() {
    document.getElementById('add-skill-modal').classList.remove('hidden');
}

function closeAddSkillModal() {
    document.getElementById('add-skill-modal').classList.add('hidden');
    document.getElementById('new-skill-input').value = '';
}

async function addSkill() {
    const skillInput = document.getElementById('new-skill-input');
    const skill = skillInput.value.trim();

    if (!skill) {
        alert('Please enter a skill name');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/add-skill`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: getUserId(),
                skill: skill
            })
        });

        const data = await response.json();

        if (data.success) {
            closeAddSkillModal();
            await loadUserData();
        } else {
            alert('Error adding skill: ' + data.error);
        }
    } catch (error) {
        console.error('Error adding skill:', error);
        alert('Error adding skill. Please try again.');
    }
}

async function removeSkill(skill) {
    if (!confirm(`Are you sure you want to remove "${skill}" from your constellation?`)) {
        return;
    }

    try {
        // Remove from local data and reload
        const userId = getUserId();
        const progress = await loadProgress(userId);
        delete progress[skill];

        // Update constellation
        constellation.updateStars(progress);
        renderSkillCards(progress);

        // In a real app, you'd call an API to persist this
        console.log(`Removed skill: ${skill}`);
    } catch (error) {
        console.error('Error removing skill:', error);
        alert('Error removing skill. Please try again.');
    }
}

function takeQuizForSkill(skill) {
    showSection('quiz');
    document.getElementById('quiz-skill').value = skill;
}

function getProgressColor(progress) {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-red-500';
}

function animateProgress(element, targetWidth) {
    let currentWidth = 0;
    const step = targetWidth / 50;

    const interval = setInterval(() => {
        currentWidth += step;
        if (currentWidth >= targetWidth) {
            currentWidth = targetWidth;
            clearInterval(interval);
        }
        element.style.width = `${currentWidth}%`;
    }, 20);
}
