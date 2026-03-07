// Gallery Module - Handles image loading and Masonry grid initialization

class Gallery {
    constructor() {
        this.images = [];
        this.albums = {};
        this.config = {};
        this.masonry = null;
        this.gridElement = document.getElementById('masonryGrid');
        this.currentAlbum = this.gridElement ? this.gridElement.getAttribute('data-album') : null;
    }

    async init() {
        try {
            // Fetch all JSON data
            await this.loadData();
            
            // Generate gallery images
            this.generateGallery();
            
            // Initialize Masonry after images are loaded
            this.initMasonry();
        } catch (error) {
            console.error('Error initializing gallery:', error);
        }
    }

    async loadData() {
        try {
            // Fetch all JSON files
            const [imagesRes, albumsRes, configRes] = await Promise.all([
                fetch('data/images.json'),
                fetch('data/albums.json'),
                fetch('data/site-config.json')
            ]);

            const imagesData = await imagesRes.json();
            const albumsData = await albumsRes.json();
            const configData = await configRes.json();

            this.images = imagesData.images;
            this.albums = albumsData.albums;
            this.config = configData.site;

            // Update album header if on album page
            if (this.currentAlbum && this.albums[this.currentAlbum]) {
                this.updateAlbumHeader();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    updateAlbumHeader() {
        const album = this.albums[this.currentAlbum];
        const titleElement = document.getElementById('albumTitle');
        const descElement = document.getElementById('albumDescription');

        if (titleElement && album) {
            titleElement.textContent = album.title;
        }
        if (descElement && album) {
            descElement.textContent = album.description;
        }
    }

    generateGallery() {
        if (!this.gridElement) return;

        // Filter images if on album page
        const imagesToShow = this.currentAlbum 
            ? this.images.filter(img => img.albums.includes(this.currentAlbum))
            : this.images;

        // Clear existing content
        this.gridElement.innerHTML = '';

        // Generate image elements with staggered AOS delays
        imagesToShow.forEach((image, index) => {
            const gridItem = this.createGridItem(image, index);
            this.gridElement.appendChild(gridItem);
        });
    }

    createGridItem(image, index) {
        // Calculate staggered delay (50ms per item, max 2000ms)
        const delay = Math.min(index * 50, 2000);

        const item = document.createElement('div');
        item.className = 'grid-item';
        item.setAttribute('data-aos', 'fade-up');
        item.setAttribute('data-aos-delay', delay);

        const imageElement = document.createElement('img');
        imageElement.src = image.path;
        imageElement.alt = image.title;
        imageElement.loading = 'lazy';
        imageElement.dataset.id = image.id;
        imageElement.dataset.title = image.title;
        imageElement.dataset.description = image.description;
        imageElement.dataset.category = image.category;

        const overlay = document.createElement('div');
        overlay.className = 'grid-item-overlay';
        
        const overlayContent = document.createElement('div');
        overlayContent.className = 'overlay-content';
        
        const title = document.createElement('h3');
        title.className = 'overlay-title';
        title.textContent = image.title;
        
        const category = document.createElement('span');
        category.className = 'overlay-category';
        category.textContent = image.category.replace('-', ' ');

        overlayContent.appendChild(title);
        overlayContent.appendChild(category);
        overlay.appendChild(overlayContent);

        item.appendChild(imageElement);
        item.appendChild(overlay);

        // Add click handler for lightbox
        item.addEventListener('click', () => {
            if (window.lightboxController) {
                const imageIndex = this.currentAlbum 
                    ? this.images.filter(img => img.albums.includes(this.currentAlbum))
                        .findIndex(img => img.id === image.id)
                    : this.images.findIndex(img => img.id === image.id);
                
                window.lightboxController.open(imageIndex, 
                    this.currentAlbum 
                        ? this.images.filter(img => img.albums.includes(this.currentAlbum))
                        : this.images
                );
            }
        });

        return item;
    }

    initMasonry() {
        if (!this.gridElement) return;

        // Wait for images to load before initializing Masonry
        imagesLoaded(this.gridElement, () => {
            this.masonry = new Masonry(this.gridElement, {
                itemSelector: '.grid-item',
                columnWidth: '.grid-item',
                percentPosition: true,
                gutter: 20,
                transitionDuration: '0.3s',
                fitWidth: false
            });

            // Refresh AOS after Masonry layout
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }

            // Re-layout after each image loads (for lazy loading)
            const images = this.gridElement.querySelectorAll('img');
            images.forEach(img => {
                img.addEventListener('load', () => {
                    if (this.masonry) {
                        this.masonry.layout();
                    }
                });
            });
        });

        // Re-layout on window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (this.masonry) {
                    this.masonry.layout();
                }
            }, 250);
        });
    }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const gallery = new Gallery();
    gallery.init();
    
    // Make gallery available globally for lightbox
    window.galleryController = gallery;
});
