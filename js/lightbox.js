// Lightbox Module - Handles image modal display and navigation

class Lightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxTitle = document.getElementById('lightboxTitle');
        this.lightboxDescription = document.getElementById('lightboxDescription');
        this.lightboxCategory = document.getElementById('lightboxCategory');
        this.lightboxCounter = document.getElementById('lightboxCounter');
        
        this.closeBtn = document.getElementById('lightboxClose');
        this.prevBtn = document.getElementById('lightboxPrev');
        this.nextBtn = document.getElementById('lightboxNext');
        
        this.shareFacebook = document.getElementById('shareFacebook');
        this.shareTwitter = document.getElementById('shareTwitter');
        this.sharePinterest = document.getElementById('sharePinterest');
        this.shareCopy = document.getElementById('shareCopy');
        
        this.currentIndex = 0;
        this.images = [];
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }

    init() {
        // Close button
        this.closeBtn.addEventListener('click', () => this.close());
        
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Close on background click
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.close();
            }
        });
        
        // Touch swipe support
        this.lightbox.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.lightbox.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
        
        // Social share buttons
        this.shareFacebook.addEventListener('click', () => this.shareOnFacebook());
        this.shareTwitter.addEventListener('click', () => this.shareOnTwitter());
        this.sharePinterest.addEventListener('click', () => this.shareOnPinterest());
        this.shareCopy.addEventListener('click', () => this.copyLink());
    }

    open(index, images) {
        this.images = images;
        this.currentIndex = index;
        this.updateContent();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Preload adjacent images
        this.preloadImages();
    }

    close() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateContent();
        this.preloadImages();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateContent();
        this.preloadImages();
    }

    updateContent() {
        const image = this.images[this.currentIndex];
        
        // Fade out
        this.lightboxImage.style.opacity = '0';
        
        setTimeout(() => {
            // Update content
            this.lightboxImage.src = image.path;
            this.lightboxImage.alt = image.title;
            this.lightboxTitle.textContent = image.title;
            this.lightboxDescription.textContent = image.description;
            this.lightboxCategory.textContent = image.category.replace('-', ' ');
            this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
            
            // Fade in
            this.lightboxImage.style.opacity = '1';
        }, 150);
    }

    preloadImages() {
        // Preload previous and next images
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        
        [prevIndex, nextIndex].forEach(index => {
            const img = new Image();
            img.src = this.images[index].path;
        });
    }

    handleKeyboard(e) {
        if (!this.lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                this.close();
                break;
            case 'ArrowLeft':
                this.prev();
                break;
            case 'ArrowRight':
                this.next();
                break;
        }
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - next image
                this.next();
            } else {
                // Swiped right - previous image
                this.prev();
            }
        }
    }

    getCurrentImageUrl() {
        const image = this.images[this.currentIndex];
        return `${window.location.origin}/${image.path}`;
    }

    getCurrentPageUrl() {
        return window.location.href;
    }

    shareOnFacebook() {
        const url = this.getCurrentPageUrl();
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    shareOnTwitter() {
        const image = this.images[this.currentIndex];
        const text = `${image.title} - Quentin Bowden Photography`;
        const url = this.getCurrentPageUrl();
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    shareOnPinterest() {
        const image = this.images[this.currentIndex];
        const imageUrl = this.getCurrentImageUrl();
        const description = `${image.title} - ${image.description}`;
        const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(this.getCurrentPageUrl())}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(description)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    async copyLink() {
        const url = this.getCurrentPageUrl();
        
        try {
            // Try modern clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url);
                this.showCopyFeedback();
            } else {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = url;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                this.showCopyFeedback();
            }
        } catch (error) {
            console.error('Failed to copy link:', error);
            alert('Failed to copy link to clipboard');
        }
    }

    showCopyFeedback() {
        const originalIcon = this.shareCopy.innerHTML;
        this.shareCopy.innerHTML = '<i class="fas fa-check"></i>';
        this.shareCopy.style.color = '#4CAF50';
        
        setTimeout(() => {
            this.shareCopy.innerHTML = originalIcon;
            this.shareCopy.style.color = '';
        }, 2000);
    }

    // Web Share API support (optional enhancement)
    async tryWebShare() {
        const image = this.images[this.currentIndex];
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: image.title,
                    text: image.description,
                    url: this.getCurrentPageUrl()
                });
            } catch (error) {
                console.log('Share cancelled or failed:', error);
            }
        }
    }
}

// Initialize lightbox when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = new Lightbox();
    window.lightboxController = lightbox;
});
