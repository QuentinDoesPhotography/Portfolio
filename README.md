# Quentin Bowden Photography Portfolio

A modern, responsive photographer portfolio website showcasing professional photography across sports, portraits, still life, and design categories.

## Features

- **Masonry Grid Layout**: Pinterest-style responsive grid that handles various image orientations and aspect ratios
- **AOS Scroll Animations**: Staggered fade-up animations as images appear in viewport
- **Lightbox Modal**: Full-size image viewing with:
  - Keyboard navigation (arrow keys, ESC)
  - Touch swipe support for mobile
  - Social sharing (Facebook, Twitter, Pinterest, Copy Link)
  - Image metadata display (title, description, category)
  - Image counter
- **Curated Albums**: Separate pages for Sports, Portrait, Still Photos, and Design categories
- **Dedicated About Page**: Multi-section biography with services showcase
- **Mobile Responsive**: Hamburger menu and fully responsive design
- **Performance Optimized**: 
  - Native lazy loading for images
  - CDN-hosted libraries
  - Preconnect hints for faster resource loading

## Project Structure

```
qb_site/
├── index.html              # Homepage with all 27 images
├── about.html              # About page with photographer bio
├── sports.html             # Sports photography album
├── portrait.html           # Portrait photography album
├── still-photo.html        # Still life photography album
├── design.html             # Design/architecture album
├── css/
│   └── styles.css          # All styling with CSS custom properties
├── js/
│   ├── gallery.js          # Gallery and Masonry initialization
│   └── lightbox.js         # Lightbox modal functionality
├── data/
│   ├── images.json         # All 27 image metadata
│   ├── albums.json         # Album definitions
│   └── site-config.json    # Site-wide configuration
└── images/                 # 27 JPG image files
```

## Setup & Deployment

### Local Development

1. **Clone or download the repository**

2. **Serve the site locally** (required for JSON file loading):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server -p 8000
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**: Navigate to `http://localhost:8000`

### GitHub Pages Deployment

1. **Create a GitHub repository** and push all files

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` (or `master`)
   - Folder: `/` (root)
   - Click Save

3. **Access your site**: `https://yourusername.github.io/repository-name/`

### Customization

#### Update Images
- Replace files in `/images/` folder
- Update `/data/images.json` with new metadata

#### Modify Site Content
- **Photographer info**: Edit `/data/site-config.json`
- **Album descriptions**: Edit `/data/albums.json`
- **Color scheme**: Modify CSS custom properties in `/css/styles.css` (`:root` section)
- **Typography**: Change Google Fonts in HTML `<head>` sections

#### Add New Images
1. Add image file to `/images/` folder
2. Add entry to `/data/images.json`:
```json
{
  "id": "unique-id",
  "filename": "image.jpg",
  "path": "images/image.jpg",
  "title": "Image Title",
  "description": "Image description",
  "category": "portrait",
  "tags": ["tag1", "tag2"],
  "albums": ["portrait"]
}
```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript**: ES6+ features, async/await
- **Masonry.js**: Responsive grid layout
- **imagesLoaded**: Layout after image loading
- **AOS (Animate On Scroll)**: Scroll-triggered animations
- **Font Awesome**: Icons
- **Google Fonts**: Inter & Playfair Display

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lazy loading for images
- Staggered animation delays (50ms per image)
- Responsive images with proper sizing
- Minimal external dependencies
- Optimized for Core Web Vitals

## License

© 2026 Quentin Bowden Photography. All rights reserved.

## Support

For questions or issues, contact: info@quentindoes.com
