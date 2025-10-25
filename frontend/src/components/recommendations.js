async function loadRecommendations() {
    const container = document.getElementById('recommendations-container');
    container.innerHTML = '<div class="text-white text-center py-8">Loading recommendations...</div>';

    try {
        const response = await fetch(`${API_BASE_URL}/api/get-recommendations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: getUserId()
            })
        });

        const data = await response.json();

        if (data.success) {
            renderRecommendations(data.recommendations);
        } else {
            container.innerHTML = `<div class="text-red-400">Error loading recommendations: ${data.error}</div>`;
        }
    } catch (error) {
        console.error('Error loading recommendations:', error);
        container.innerHTML = '<div class="text-red-400">Error loading recommendations. Please try again.</div>';
    }
}

function renderRecommendations(recommendations) {
    const container = document.getElementById('recommendations-container');
    container.innerHTML = '';

    if (!recommendations || recommendations.length === 0) {
        container.innerHTML = '<div class="text-white text-center py-8">No recommendations available yet. Take some quizzes to get personalized recommendations!</div>';
        return;
    }

    recommendations.forEach((rec, index) => {
        const card = document.createElement('div');
        card.className = 'skill-card rounded-lg p-6 mb-6';
        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h3 class="text-2xl font-bold text-white mb-2">${rec.skill}</h3>
                    <span class="inline-block px-3 py-1 bg-purple-500/30 rounded-full text-sm text-purple-300">
                        ${rec.estimated_time || 'N/A'}
                    </span>
                </div>
                <span class="text-4xl">${getRecommendationIcon(index)}</span>
            </div>

            <div class="mb-4">
                <h4 class="text-white font-semibold mb-2">Why Focus on This?</h4>
                <p class="text-gray-300">${rec.reason}</p>
            </div>

            ${rec.topics && rec.topics.length > 0 ? `
                <div class="mb-4">
                    <h4 class="text-white font-semibold mb-2">Topics to Study</h4>
                    <div class="flex flex-wrap gap-2">
                        ${rec.topics.map(topic => `
                            <span class="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                                ${topic}
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${rec.resources && rec.resources.length > 0 ? `
                <div class="mb-4">
                    <h4 class="text-white font-semibold mb-2">Recommended Resources</h4>
                    <ul class="space-y-2">
                        ${rec.resources.map(resource => `
                            <li class="text-gray-300 flex items-start">
                                <span class="text-purple-400 mr-2">→</span>
                                <span>${resource}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}

            ${rec.related_skills && rec.related_skills.length > 0 ? `
                <div class="mb-4">
                    <h4 class="text-white font-semibold mb-2">Related Skills</h4>
                    <div class="flex flex-wrap gap-2">
                        ${rec.related_skills.map(skill => `
                            <span class="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                                ${skill}
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <button
                onclick="addSkillFromRecommendation('${rec.skill}')"
                class="btn-primary px-6 py-2 rounded-lg text-white font-semibold w-full mt-4"
            >
                Add to My Constellation
            </button>
        `;

        container.appendChild(card);
    });
}

function getRecommendationIcon(index) {
    const icons = ['🎯', '🚀', '💡', '⭐', '🔥'];
    return icons[index % icons.length];
}

async function addSkillFromRecommendation(skill) {
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
            alert(`${skill} added to your constellation!`);
            await loadUserData();
            showSection('dashboard');
        } else {
            alert('Error adding skill: ' + data.error);
        }
    } catch (error) {
        console.error('Error adding skill:', error);
        alert('Error adding skill. Please try again.');
    }
}

function generateMockRecommendations(skills) {
    // Generate mock recommendations based on current skills
    const recommendations = [];

    const skillLevels = Object.entries(skills).sort((a, b) => a[1] - b[1]);

    // Recommend improving weak skills
    if (skillLevels.length > 0 && skillLevels[0][1] < 70) {
        recommendations.push({
            skill: skillLevels[0][0],
            reason: `Your proficiency in ${skillLevels[0][0]} is at ${Math.round(skillLevels[0][1])}%. Improving this skill will help round out your skill set.`,
            topics: [
                'Advanced concepts',
                'Best practices',
                'Real-world applications'
            ],
            resources: [
                'Official documentation',
                'Interactive tutorials',
                'Practice projects'
            ],
            estimated_time: '2-3 weeks',
            related_skills: skillLevels.slice(1, 3).map(s => s[0])
        });
    }

    // Recommend complementary skills
    const complementarySkills = {
        'Frontend': ['React', 'Vue', 'Angular', 'CSS'],
        'Backend': ['Node.js', 'Python', 'Database', 'API Design'],
        'JavaScript': ['TypeScript', 'React', 'Node.js'],
        'Python': ['Django', 'Flask', 'Data Science'],
        'Database': ['SQL', 'MongoDB', 'Redis']
    };

    Object.keys(skills).forEach(skill => {
        if (complementarySkills[skill]) {
            complementarySkills[skill].forEach(compSkill => {
                if (!skills[compSkill] && recommendations.length < 3) {
                    recommendations.push({
                        skill: compSkill,
                        reason: `Since you know ${skill}, learning ${compSkill} would be a natural next step to expand your capabilities.`,
                        topics: [
                            'Fundamentals',
                            'Integration with ' + skill,
                            'Common patterns'
                        ],
                        resources: [
                            'Online courses',
                            'Documentation',
                            'Community tutorials'
                        ],
                        estimated_time: '3-4 weeks',
                        related_skills: [skill]
                    });
                }
            });
        }
    });

    return recommendations;
}
