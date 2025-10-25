class Constellation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.selectedStar = null;
        this.isDragging = false;

        // Set up event listeners
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('click', this.onClick.bind(this));

        // Animation
        this.animate();
    }

    drawStar(star) {
        const ctx = this.ctx;

        // Glow effect
        const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3
        );
        gradient.addColorStop(0, `${star.color}ff`);
        gradient.addColorStop(0.5, `${star.color}88`);
        gradient.addColorStop(1, `${star.color}00`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Star core
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw skill name
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(star.skill, star.x, star.y + star.size * 4 + 10);

        // Draw progress percentage
        ctx.font = '12px Arial';
        ctx.fillStyle = '#a78bfa';
        ctx.fillText(`${Math.round(star.progress)}%`, star.x, star.y + star.size * 4 + 25);
    }

    drawConnection(star1, star2, strength = 1) {
        const ctx = this.ctx;
        const opacity = Math.min(0.3 * strength, 0.6);

        ctx.strokeStyle = `rgba(167, 139, 250, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(star1.x, star1.y);
        ctx.lineTo(star2.x, star2.y);
        ctx.stroke();
    }

    getStarColor(progress) {
        // Color gradient based on progress
        if (progress >= 80) return '#10b981'; // Green
        if (progress >= 60) return '#3b82f6'; // Blue
        if (progress >= 40) return '#f59e0b'; // Orange
        if (progress >= 20) return '#ef4444'; // Red
        return '#6b7280'; // Gray
    }

    createStar(skill, progress, x = null, y = null) {
        // Auto-position if no coordinates provided
        if (x === null || y === null) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 150 + Math.random() * 150;
            x = this.canvas.width / 2 + Math.cos(angle) * radius;
            y = this.canvas.height / 2 + Math.sin(angle) * radius;
        }

        // Ensure within bounds
        x = Math.max(50, Math.min(this.canvas.width - 50, x));
        y = Math.max(50, Math.min(this.canvas.height - 50, y));

        const size = 8 + (progress / 100) * 7; // Size based on progress
        const color = this.getStarColor(progress);

        return {
            skill,
            progress,
            x,
            y,
            size,
            color,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            twinkle: Math.random() * Math.PI * 2
        };
    }

    updateStars(skills) {
        // Keep existing star positions, add new stars, remove deleted ones
        const existingSkills = new Set(this.stars.map(s => s.skill));
        const newSkills = new Set(Object.keys(skills));

        // Remove deleted skills
        this.stars = this.stars.filter(star => newSkills.has(star.skill));

        // Update existing stars
        this.stars.forEach(star => {
            star.progress = skills[star.skill];
            star.size = 8 + (star.progress / 100) * 7;
            star.color = this.getStarColor(star.progress);
        });

        // Add new stars
        for (const skill in skills) {
            if (!existingSkills.has(skill)) {
                this.stars.push(this.createStar(skill, skills[skill]));
            }
        }

        this.draw();
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(15, 12, 41, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections between nearby stars
        for (let i = 0; i < this.stars.length; i++) {
            for (let j = i + 1; j < this.stars.length; j++) {
                const star1 = this.stars[i];
                const star2 = this.stars[j];
                const distance = Math.sqrt(
                    Math.pow(star2.x - star1.x, 2) + Math.pow(star2.y - star1.y, 2)
                );

                if (distance < 200) {
                    const strength = 1 - distance / 200;
                    this.drawConnection(star1, star2, strength);
                }
            }
        }

        // Draw stars
        this.stars.forEach(star => {
            this.drawStar(star);
        });
    }

    animate() {
        // Subtle floating animation
        this.stars.forEach(star => {
            // Twinkle effect
            star.twinkle += 0.05;

            // Very subtle movement
            star.x += Math.sin(star.twinkle) * 0.2;
            star.y += Math.cos(star.twinkle) * 0.2;

            // Keep within bounds
            star.x = Math.max(50, Math.min(this.canvas.width - 50, star.x));
            star.y = Math.max(50, Math.min(this.canvas.height - 50, star.y));
        });

        this.draw();
        requestAnimationFrame(this.animate.bind(this));
    }

    getStarAt(x, y) {
        for (const star of this.stars) {
            const distance = Math.sqrt(
                Math.pow(x - star.x, 2) + Math.pow(y - star.y, 2)
            );
            if (distance <= star.size * 3) {
                return star;
            }
        }
        return null;
    }

    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const star = this.getStarAt(x, y);
        if (star) {
            this.selectedStar = star;
            this.isDragging = true;
            this.canvas.style.cursor = 'grabbing';
        }
    }

    onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.isDragging && this.selectedStar) {
            this.selectedStar.x = x;
            this.selectedStar.y = y;
        } else {
            const star = this.getStarAt(x, y);
            this.canvas.style.cursor = star ? 'pointer' : 'default';
        }
    }

    onMouseUp() {
        this.isDragging = false;
        this.selectedStar = null;
        this.canvas.style.cursor = 'default';
    }

    onClick(e) {
        if (this.isDragging) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const star = this.getStarAt(x, y);
        if (star) {
            showSkillDetails(star.skill, star.progress);
        }
    }

    clear() {
        this.stars = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
