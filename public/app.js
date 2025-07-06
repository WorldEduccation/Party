// PartyLink App - Pure JavaScript
class PartyLinkApp {
    constructor() {
        this.user = null;
        this.videos = [];
        this.currentVideo = null;
        this.filters = {
            country: '',
            eventType: ''
        };
        
        this.init();
    }
    
    init() {
        this.initFirebase();
        this.bindEvents();
        this.checkAuthState();
        this.initTheme();
        this.loadVideos();
    }
    
    initFirebase() {
        // Firebase configuration will be set via environment variables
        const firebaseConfig = {
            apiKey: "YOUR_FIREBASE_API_KEY",
            authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
            appId: "YOUR_FIREBASE_APP_ID"
        };
        
        // Note: In production, these should come from environment variables
        // For now, we'll use a simple authentication simulation
        this.firebase = null; // Will be implemented when Firebase keys are provided
    }
    
    bindEvents() {
        // Auth buttons
        const authBtn = document.getElementById('auth-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const getStartedBtn = document.getElementById('get-started-btn');
        
        authBtn?.addEventListener('click', () => this.login());
        logoutBtn?.addEventListener('click', () => this.logout());
        getStartedBtn?.addEventListener('click', () => this.login());
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle?.addEventListener('click', () => this.toggleTheme());
        
        // Upload
        const uploadBtn = document.getElementById('upload-btn');
        uploadBtn?.addEventListener('click', () => this.showUploadModal());
        
        // Modal controls
        const closeModal = document.getElementById('close-modal');
        const cancelUpload = document.getElementById('cancel-upload');
        const closeVideo = document.getElementById('close-video');
        
        closeModal?.addEventListener('click', () => this.hideUploadModal());
        cancelUpload?.addEventListener('click', () => this.hideUploadModal());
        closeVideo?.addEventListener('click', () => this.hideVideoModal());
        
        // Upload form
        const uploadForm = document.getElementById('upload-form');
        uploadForm?.addEventListener('submit', (e) => this.handleUpload(e));
        
        // Filters
        const countryFilter = document.getElementById('country-filter');
        const eventFilter = document.getElementById('event-filter');
        
        countryFilter?.addEventListener('change', (e) => {
            this.filters.country = e.target.value;
            this.loadVideos();
        });
        
        eventFilter?.addEventListener('change', (e) => {
            this.filters.eventType = e.target.value;
            this.loadVideos();
        });
        
        // Modal background clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModals();
            }
        });
    }
    
    checkAuthState() {
        // Simulate auth check - in production this would check Firebase auth
        const savedUser = localStorage.getItem('partylink_user');
        if (savedUser) {
            this.user = JSON.parse(savedUser);
            this.updateAuthUI();
            this.showHome();
        } else {
            this.showLanding();
        }
    }
    
    login() {
        // Simulate Google login - in production this would use Firebase Auth
        const mockUser = {
            uid: 'user_' + Date.now(),
            displayName: 'Usuário Demo',
            email: 'demo@partylink.com',
            photoURL: 'https://via.placeholder.com/32x32/667eea/ffffff?text=U'
        };
        
        this.user = mockUser;
        localStorage.setItem('partylink_user', JSON.stringify(mockUser));
        this.updateAuthUI();
        this.showHome();
        this.showToast('Login realizado com sucesso!', 'success');
    }
    
    logout() {
        this.user = null;
        localStorage.removeItem('partylink_user');
        this.updateAuthUI();
        this.showLanding();
        this.showToast('Logout realizado com sucesso!', 'success');
    }
    
    updateAuthUI() {
        const authBtn = document.getElementById('auth-btn');
        const userMenu = document.getElementById('user-menu');
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        
        if (this.user) {
            authBtn.classList.add('hidden');
            userMenu.classList.remove('hidden');
            userAvatar.src = this.user.photoURL;
            userName.textContent = this.user.displayName;
        } else {
            authBtn.classList.remove('hidden');
            userMenu.classList.add('hidden');
        }
    }
    
    showLanding() {
        document.getElementById('landing').classList.remove('hidden');
        document.getElementById('home').classList.add('hidden');
    }
    
    showHome() {
        document.getElementById('landing').classList.add('hidden');
        document.getElementById('home').classList.remove('hidden');
    }
    
    initTheme() {
        const savedTheme = localStorage.getItem('partylink_theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('partylink_theme', newTheme);
        this.updateThemeIcon(newTheme);
    }
    
    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    
    async loadVideos() {
        this.showLoading();
        
        try {
            const params = new URLSearchParams();
            if (this.filters.country) params.append('country', this.filters.country);
            if (this.filters.eventType) params.append('eventType', this.filters.eventType);
            
            const response = await fetch(`/api/videos?${params.toString()}`);
            const videos = await response.json();
            
            this.videos = videos;
            this.renderVideos();
        } catch (error) {
            console.error('Error loading videos:', error);
            this.showToast('Erro ao carregar vídeos', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    renderVideos() {
        const grid = document.getElementById('videos-grid');
        
        if (this.videos.length === 0) {
            grid.innerHTML = `
                <div class="text-center" style="grid-column: 1 / -1; padding: 3rem;">
                    <h3>Nenhum vídeo encontrado</h3>
                    <p style="color: var(--text-secondary); margin-top: 0.5rem;">
                        Ajuste os filtros ou seja o primeiro a fazer upload!
                    </p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = this.videos.map(video => `
            <div class="video-card" data-video-id="${video.id}">
                <img 
                    src="${video.thumbnailUrl || '/placeholder-video.jpg'}" 
                    alt="${video.title}"
                    class="video-thumbnail"
                    onerror="this.src='/placeholder-video.jpg'"
                >
                <div class="video-info">
                    <h3 class="video-title">${this.escapeHtml(video.title)}</h3>
                    <p class="video-description">${this.escapeHtml(video.description || '')}</p>
                    
                    <div class="video-meta">
                        ${video.country ? `<span class="video-badge">📍 ${video.country}</span>` : ''}
                        ${video.eventType ? `<span class="video-badge">🎉 ${video.eventType}</span>` : ''}
                    </div>
                    
                    <div class="video-stats">
                        <span>❤️ ${video.likes}</span>
                        <span>👁️ ${video.views}</span>
                        <span>💬 ${video.telegramClicks}</span>
                    </div>
                    
                    <div class="video-actions">
                        <button class="btn-action play-video" data-video-id="${video.id}">
                            ▶️ Assistir
                        </button>
                        <button class="btn-telegram open-telegram" data-telegram="${video.telegramLink}">
                            💬 Telegram
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Bind video events
        grid.querySelectorAll('.play-video').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const videoId = parseInt(btn.getAttribute('data-video-id'));
                this.playVideo(videoId);
            });
        });
        
        grid.querySelectorAll('.open-telegram').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const telegramLink = btn.getAttribute('data-telegram');
                this.openTelegram(telegramLink);
            });
        });
        
        grid.querySelectorAll('.video-card').forEach(card => {
            card.addEventListener('click', () => {
                const videoId = parseInt(card.getAttribute('data-video-id'));
                this.playVideo(videoId);
            });
        });
    }
    
    async playVideo(videoId) {
        const video = this.videos.find(v => v.id === videoId);
        if (!video) return;
        
        this.currentVideo = video;
        
        // Update view count
        try {
            await fetch(`/api/videos/${videoId}/view`, { method: 'POST' });
            video.views++;
        } catch (error) {
            console.error('Error updating view count:', error);
        }
        
        // Show video modal
        const modal = document.getElementById('video-modal');
        const videoElement = document.getElementById('modal-video');
        const titleElement = document.getElementById('video-title-display');
        const descriptionElement = document.getElementById('video-description-display');
        const likesCount = document.getElementById('likes-count');
        const telegramBtn = document.getElementById('telegram-link-btn');
        const likeBtn = document.getElementById('like-video');
        
        videoElement.src = video.videoUrl;
        titleElement.textContent = video.title;
        descriptionElement.textContent = video.description || '';
        likesCount.textContent = video.likes;
        
        // Bind like button
        likeBtn.onclick = () => this.likeVideo(videoId);
        telegramBtn.onclick = () => this.openTelegram(video.telegramLink);
        
        modal.classList.remove('hidden');
    }
    
    async likeVideo(videoId) {
        if (!this.user) {
            this.showToast('Faça login para curtir vídeos', 'warning');
            return;
        }
        
        try {
            const response = await fetch(`/api/videos/${videoId}/like`, { method: 'POST' });
            const data = await response.json();
            
            // Update local data
            const video = this.videos.find(v => v.id === videoId);
            if (video) {
                video.likes = data.likes;
                document.getElementById('likes-count').textContent = data.likes;
            }
            
            this.showToast('Vídeo curtido!', 'success');
        } catch (error) {
            console.error('Error liking video:', error);
            this.showToast('Erro ao curtir vídeo', 'error');
        }
    }
    
    openTelegram(link) {
        if (link) {
            window.open(link, '_blank');
            
            // Update telegram click count
            if (this.currentVideo) {
                fetch(`/api/videos/${this.currentVideo.id}/telegram`, { method: 'POST' })
                    .catch(error => console.error('Error updating telegram clicks:', error));
            }
        }
    }
    
    showUploadModal() {
        if (!this.user) {
            this.showToast('Faça login para fazer upload de vídeos', 'warning');
            return;
        }
        
        document.getElementById('upload-modal').classList.remove('hidden');
    }
    
    hideUploadModal() {
        document.getElementById('upload-modal').classList.add('hidden');
        document.getElementById('upload-form').reset();
    }
    
    hideVideoModal() {
        const modal = document.getElementById('video-modal');
        const videoElement = document.getElementById('modal-video');
        
        modal.classList.add('hidden');
        videoElement.pause();
        videoElement.src = '';
        this.currentVideo = null;
    }
    
    hideModals() {
        this.hideUploadModal();
        this.hideVideoModal();
    }
    
    async handleUpload(event) {
        event.preventDefault();
        
        if (!this.user) {
            this.showToast('Faça login para fazer upload', 'warning');
            return;
        }
        
        const form = event.target;
        const formData = new FormData();
        
        // Get form data
        const videoFile = document.getElementById('video-file').files[0];
        const thumbnailFile = document.getElementById('thumbnail-file').files[0];
        const title = document.getElementById('video-title').value;
        const description = document.getElementById('video-description').value;
        const telegramLink = document.getElementById('telegram-link').value;
        const country = document.getElementById('video-country').value;
        const eventType = document.getElementById('event-type').value;
        const hashtags = document.getElementById('hashtags').value;
        
        if (!videoFile) {
            this.showToast('Selecione um arquivo de vídeo', 'error');
            return;
        }
        
        if (!title.trim()) {
            this.showToast('Digite um título para o vídeo', 'error');
            return;
        }
        
        if (!telegramLink.trim()) {
            this.showToast('Digite o link do Telegram', 'error');
            return;
        }
        
        // Prepare form data
        formData.append('video', videoFile);
        if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('telegramLink', telegramLink);
        formData.append('country', country);
        formData.append('eventType', eventType);
        formData.append('hashtags', hashtags);
        formData.append('userId', this.user.uid);
        
        // Show loading
        const submitBtn = document.getElementById('submit-upload');
        const uploadText = submitBtn.querySelector('.upload-text');
        const uploadLoading = submitBtn.querySelector('.upload-loading');
        
        uploadText.classList.add('hidden');
        uploadLoading.classList.remove('hidden');
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('/api/videos', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Upload failed');
            }
            
            const newVideo = await response.json();
            
            this.showToast('Vídeo enviado com sucesso!', 'success');
            this.hideUploadModal();
            this.loadVideos(); // Reload videos
            
        } catch (error) {
            console.error('Upload error:', error);
            this.showToast('Erro ao enviar vídeo', 'error');
        } finally {
            uploadText.classList.remove('hidden');
            uploadLoading.classList.add('hidden');
            submitBtn.disabled = false;
        }
    }
    
    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
    }
    
    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }
    
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.partyLinkApp = new PartyLinkApp();
});

// Handle file input preview
document.addEventListener('DOMContentLoaded', () => {
    const videoInput = document.getElementById('video-file');
    const thumbnailInput = document.getElementById('thumbnail-file');
    
    if (videoInput) {
        videoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const size = (file.size / 1024 / 1024).toFixed(2);
                console.log(`Video selected: ${file.name} (${size}MB)`);
            }
        });
    }
    
    if (thumbnailInput) {
        thumbnailInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                console.log(`Thumbnail selected: ${file.name}`);
            }
        });
    }
});