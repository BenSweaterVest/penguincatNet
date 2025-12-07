# HTML Enhancement Implementation Guide

This document provides step-by-step instructions for implementing the remaining enhancements to `index.html`.

## Overview of Remaining Features

1. **Loading States** - Visual feedback during API operations
2. **Restaurant Search** - Search bar in admin panel
3. **Enhanced Keyboard Navigation** - Full keyboard support for autocomplete
4. **Import Data Validation** - Validate imported JSON
5. **Restaurant Images** - Image upload/URL support
6. **Restaurant Ratings** - 1-5 star rating system
7. **Multi-Language Support** - Internationalization (i18n)
8. **Restaurant Hours** - Operating hours display and editing
9. **Dietary Restrictions** - Filtering by dietary needs

---

## Data Schema Updates

First, update the `restaurants.json` schema to support new fields:

```json
{
  "id": "uuid-string",
  "name": "Restaurant Name",
  "foodTypes": ["Italian", "Pizza"],
  "serviceTypes": ["takeout", "delivery"],
  "profiles": ["quick-lunch"],
  "orderMethod": "Call or online",
  "menuLink": "https://example.com/menu",
  "address": "123 Main St",
  "phone": "(555) 123-4567",
  "notes": "Great place!",

  // NEW FIELDS:
  "imageUrl": "https://example.com/restaurant.jpg",
  "rating": 4.5,
  "dietaryRestrictions": ["vegetarian", "gluten-free", "vegan"],
  "hours": {
    "monday": "11:00-22:00",
    "tuesday": "11:00-22:00",
    "wednesday": "11:00-22:00",
    "thursday": "11:00-23:00",
    "friday": "11:00-23:00",
    "saturday": "10:00-23:00",
    "sunday": "10:00-22:00"
  }
}
```

---

## Feature 1: Loading States

### CSS Addition (in `<style>` section)

```css
/* Loading Spinner */
.spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.btn.loading {
    position: relative;
    pointer-events: none;
    opacity: 0.7;
}

.btn.loading::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    top: 50%;
    left: 50%;
    margin-left: -8px;
    margin-top: -8px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 0.6s linear infinite;
}
```

### JavaScript Utility Functions

```javascript
/**
 * Show loading state on button
 * @param {HTMLElement} button - Button element
 * @param {string} originalText - Text to restore later
 */
function showLoading(button, originalText) {
    button.setAttribute('data-original-text', originalText || button.textContent);
    button.classList.add('loading');
    button.disabled = true;
}

/**
 * Hide loading state on button
 * @param {HTMLElement} button - Button element
 */
function hideLoading(button) {
    button.classList.remove('loading');
    button.disabled = false;
    const originalText = button.getAttribute('data-original-text');
    if (originalText) {
        button.textContent = originalText;
        button.removeAttribute('data-original-text');
    }
}
```

### Usage Example

```javascript
async function addRestaurant() {
    const button = event.target;
    showLoading(button, 'Adding...');

    try {
        // Your API call here
        await fetch('/api/restaurants', { ... });
    } finally {
        hideLoading(button);
    }
}
```

---

## Feature 2: Restaurant Search

### HTML Addition (in admin panel)

```html
<h3>Manage Restaurants</h3>

<!-- ADD THIS SEARCH BAR -->
<div class="form-group">
    <input
        type="text"
        id="restaurantSearch"
        placeholder="🔍 Search restaurants..."
        oninput="filterRestaurantList()"
        style="margin-bottom: 15px;"
    >
</div>

<!-- Existing restaurant form follows -->
```

### CSS Addition

```css
#restaurantSearch {
    width: 100%;
    padding: 10px;
    border: 2px solid var(--border-color);
    border-radius: 5px;
    font-size: 1em;
    transition: border-color 0.3s;
}

#restaurantSearch:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.restaurant-item.hidden {
    display: none;
}
```

### JavaScript Function

```javascript
/**
 * Filter restaurant list based on search input
 */
function filterRestaurantList() {
    const searchTerm = document.getElementById('restaurantSearch').value.toLowerCase();
    const restaurantItems = document.querySelectorAll('.restaurant-item');

    restaurantItems.forEach(item => {
        const nameElement = item.querySelector('.restaurant-item-name');
        const typesElement = item.querySelector('.restaurant-item-types');

        const name = nameElement?.textContent.toLowerCase() || '';
        const types = typesElement?.textContent.toLowerCase() || '';

        if (name.includes(searchTerm) || types.includes(searchTerm)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}
```

---

## Feature 3: Enhanced Keyboard Navigation

### JavaScript Enhancement

```javascript
/**
 * Enhanced profile input handler with keyboard navigation
 */
function handleProfileInput() {
    const input = document.getElementById('profileInput');
    const suggestionsContainer = document.getElementById('profileSuggestions');
    const searchTerm = input.value.toLowerCase().trim();

    // Filter profiles
    const filteredProfiles = profiles.filter(profile =>
        profile.name.toLowerCase().includes(searchTerm)
    );

    // Clear and populate suggestions
    suggestionsContainer.innerHTML = '';

    if (searchTerm === '' || filteredProfiles.length === 0) {
        suggestionsContainer.classList.remove('active');
        return;
    }

    filteredProfiles.forEach((profile, index) => {
        const div = document.createElement('div');
        div.className = 'autocomplete-suggestion';
        if (index === 0) {
            div.classList.add('highlighted');
        }
        if (profile.id === selectedProfile) {
            div.classList.add('selected');
        }
        div.textContent = profile.name;
        div.setAttribute('data-profile-id', profile.id);
        div.onclick = () => selectProfile(profile.id, profile.name);
        suggestionsContainer.appendChild(div);
    });

    suggestionsContainer.classList.add('active');
}

/**
 * Handle keyboard events on profile input
 * @param {KeyboardEvent} event
 */
function handleProfileKeydown(event) {
    const suggestionsContainer = document.getElementById('profileSuggestions');
    const suggestions = suggestionsContainer.querySelectorAll('.autocomplete-suggestion');
    const highlighted = suggestionsContainer.querySelector('.highlighted');

    if (!suggestionsContainer.classList.contains('active')) {
        return;
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (highlighted && highlighted.nextElementSibling) {
            highlighted.classList.remove('highlighted');
            highlighted.nextElementSibling.classList.add('highlighted');
        } else if (suggestions.length > 0) {
            suggestions[0].classList.add('highlighted');
        }
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (highlighted && highlighted.previousElementSibling) {
            highlighted.classList.remove('highlighted');
            highlighted.previousElementSibling.classList.add('highlighted');
        }
    } else if (event.key === 'Enter') {
        event.preventDefault();
        if (highlighted) {
            const profileId = highlighted.getAttribute('data-profile-id');
            const profileName = highlighted.textContent;
            selectProfile(profileId, profileName);
        }
    } else if (event.key === 'Escape') {
        event.preventDefault();
        suggestionsContainer.classList.remove('active');
    }
}

// Update HTML input to include keyboard handler
// <input onkeydown="handleProfileKeydown(event)" ...>
```

---

## Feature 4: Import Data Validation

### JavaScript Enhancement

```javascript
/**
 * Import data with validation
 * @param {Event} event - File input change event
 */
function importData(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);

            // Validation checks
            const validation = validateImportedData(data);

            if (!validation.valid) {
                alert(`Import validation failed:\n\n${validation.errors.join('\n')}`);
                return;
            }

            // Show confirmation with details
            const confirmMessage = `Import ${data.restaurants?.length || 0} restaurants and ${data.profiles?.length || 0} profiles?\n\n` +
                `This will replace your current local data.\n\n` +
                `${validation.warnings.length > 0 ? 'Warnings:\n' + validation.warnings.join('\n') : ''}`;

            if (!confirm(confirmMessage)) {
                return;
            }

            // Apply data
            localRestaurants = data.restaurants || [];
            localProfiles = data.profiles || [];
            restaurants = JSON.parse(JSON.stringify(localRestaurants));
            profiles = JSON.parse(JSON.stringify(localProfiles));

            // Reset pending changes
            pendingChanges = {
                addedRestaurants: [],
                deletedRestaurants: [],
                addedProfiles: [],
                deletedProfiles: []
            };
            hasUnsavedChanges = false;

            // Update UI
            updateFoodTypeFilters();
            updateRestaurantList();
            updateProfileInput();
            updateProfileList();
            updateUnsavedChangesUI();
            drawWheel();

            alert('Data imported successfully! Remember to click "Save All Changes" to save to GitHub.');
        } catch (error) {
            console.error('Import error:', error);
            alert('Failed to import data. Please check the file format.');
        }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
}

/**
 * Validate imported data
 * @param {Object} data - Imported data object
 * @returns {Object} - { valid: boolean, errors: Array, warnings: Array }
 */
function validateImportedData(data) {
    const errors = [];
    const warnings = [];

    // Check structure
    if (!data.profiles || !data.restaurants) {
        errors.push('Invalid JSON format. Must contain "profiles" and "restaurants" arrays.');
        return { valid: false, errors, warnings };
    }

    if (!Array.isArray(data.profiles) || !Array.isArray(data.restaurants)) {
        errors.push('profiles and restaurants must be arrays.');
        return { valid: false, errors, warnings };
    }

    // Validate profiles
    const profileIds = new Set();
    const duplicateProfiles = [];

    data.profiles.forEach((profile, index) => {
        if (!profile.id || !profile.name) {
            errors.push(`Profile at index ${index} missing required fields (id, name).`);
        }

        if (!/^[a-z0-9-]+$/.test(profile.id)) {
            errors.push(`Profile "${profile.name}" has invalid ID format. Must be lowercase alphanumeric with hyphens.`);
        }

        if (profileIds.has(profile.id)) {
            duplicateProfiles.push(profile.id);
        }
        profileIds.add(profile.id);
    });

    if (duplicateProfiles.length > 0) {
        errors.push(`Duplicate profile IDs: ${duplicateProfiles.join(', ')}`);
    }

    // Validate restaurants
    const restaurantIds = new Set();
    const duplicateRestaurants = [];

    data.restaurants.forEach((restaurant, index) => {
        if (!restaurant.name || !restaurant.foodTypes || !restaurant.serviceTypes) {
            errors.push(`Restaurant at index ${index} missing required fields.`);
        }

        if (!Array.isArray(restaurant.foodTypes) || restaurant.foodTypes.length === 0) {
            errors.push(`Restaurant "${restaurant.name}" must have at least one food type.`);
        }

        if (!Array.isArray(restaurant.serviceTypes) || restaurant.serviceTypes.length === 0) {
            errors.push(`Restaurant "${restaurant.name}" must have at least one service type.`);
        }

        // Validate service types
        const validServiceTypes = ['takeout', 'delivery', 'dine-in', 'at-home'];
        const invalidServices = restaurant.serviceTypes?.filter(st => !validServiceTypes.includes(st)) || [];
        if (invalidServices.length > 0) {
            errors.push(`Restaurant "${restaurant.name}" has invalid service types: ${invalidServices.join(', ')}`);
        }

        // Check for orphaned profile references
        if (restaurant.profiles && Array.isArray(restaurant.profiles)) {
            const orphanedProfiles = restaurant.profiles.filter(p => !profileIds.has(p));
            if (orphanedProfiles.length > 0) {
                warnings.push(`Restaurant "${restaurant.name}" references non-existent profiles: ${orphanedProfiles.join(', ')}`);
            }
        }

        // Check for duplicate IDs
        if (restaurant.id) {
            if (restaurantIds.has(restaurant.id)) {
                duplicateRestaurants.push(restaurant.id);
            }
            restaurantIds.add(restaurant.id);
        }
    });

    if (duplicateRestaurants.length > 0) {
        warnings.push(`Duplicate restaurant IDs found: ${duplicateRestaurants.join(', ')}. IDs will be regenerated.`);

        // Regenerate IDs for duplicates
        const idCounts = {};
        data.restaurants.forEach(restaurant => {
            if (!restaurant.id || duplicateRestaurants.includes(restaurant.id)) {
                restaurant.id = generateUUID ? generateUUID() : `${Date.now()}-${Math.random()}`;
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

// Helper UUID generator (if not already defined)
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
```

---

##Feature 5: Restaurant Images

### HTML Addition (in restaurant form)

```html
<div class="form-group">
    <label>Restaurant Image URL (optional)</label>
    <input type="text" id="imageUrl" placeholder="https://example.com/restaurant.jpg">
    <div id="imagePreview" style="margin-top: 10px; display: none;">
        <img id="previewImg" style="max-width: 200px; border-radius: 5px;" />
    </div>
</div>
```

### CSS Addition

```css
.restaurant-image {
    width: 100%;
    max-width: 300px;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    margin: 15px 0;
}

.restaurant-item-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 5px;
    margin-right: 10px;
}
```

### JavaScript Functions

```javascript
// Image preview on URL input
document.getElementById('imageUrl')?.addEventListener('input', function(e) {
    const url = e.target.value;
    const preview = document.getElementById('imagePreview');
    const img = document.getElementById('previewImg');

    if (url && isValidURL(url)) {
        img.src = url;
        img.onerror = () => {
            preview.style.display = 'none';
        };
        img.onload = () => {
            preview.style.display = 'block';
        };
    } else {
        preview.style.display = 'none';
    }
});

// Update addRestaurant function to include imageUrl
function addRestaurant() {
    // ... existing code ...
    const imageUrl = document.getElementById('imageUrl').value.trim();

    const newRestaurant = {
        // ... existing fields ...
        imageUrl: imageUrl || undefined
    };

    // ... rest of function ...
}

// Update showResult to display image
function showResult(filteredRestaurants, numSegments, anglePerSegment) {
    // ... existing code ...

    if (winner.imageUrl) {
        html += `<img src="${sanitizeHTML(winner.imageUrl)}" class="restaurant-image" alt="${sanitizeHTML(winner.name)}" />`;
    }

    // ... rest of function ...
}
```

---

## Feature 6: Restaurant Ratings

### CSS Addition

```css
.rating-stars {
    display: inline-flex;
    gap: 5px;
    font-size: 1.5em;
    cursor: pointer;
    user-select: none;
}

.rating-stars .star {
    color: #ddd;
    transition: color 0.2s;
}

.rating-stars .star.filled {
    color: #ffd700;
}

.rating-stars .star:hover,
.rating-stars .star.hover {
    color: #ffed4e;
}

.rating-display {
    display: inline-flex;
    gap: 3px;
    font-size: 1.2em;
}

.rating-display .star {
    color: #ffd700;
}
```

### HTML Addition

```html
<div class="form-group">
    <label>Rating (optional)</label>
    <div class="rating-stars" id="ratingInput">
        <span class="star" data-rating="1">★</span>
        <span class="star" data-rating="2">★</span>
        <span class="star" data-rating="3">★</span>
        <span class="star" data-rating="4">★</span>
        <span class="star" data-rating="5">★</span>
    </div>
    <input type="hidden" id="rating" value="0">
</div>
```

### JavaScript Functions

```javascript
let currentRating = 0;

// Initialize rating stars
document.querySelectorAll('#ratingInput .star').forEach(star => {
    star.addEventListener('click', function() {
        currentRating = parseInt(this.getAttribute('data-rating'));
        document.getElementById('rating').value = currentRating;
        updateRatingStars(currentRating);
    });

    star.addEventListener('mouseenter', function() {
        const hoverRating = parseInt(this.getAttribute('data-rating'));
        updateRatingStars(hoverRating, true);
    });
});

document.getElementById('ratingInput').addEventListener('mouseleave', function() {
    updateRatingStars(currentRating);
});

function updateRatingStars(rating, isHover = false) {
    document.querySelectorAll('#ratingInput .star').forEach((star, index) => {
        if (index < rating) {
            star.classList.add(isHover ? 'hover' : 'filled');
            if (!isHover) {
                star.classList.remove('hover');
            }
        } else {
            star.classList.remove('filled', 'hover');
        }
    });
}

function displayRating(rating) {
    if (!rating) return '';

    let html = '<div class="rating-display">';
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
        html += '<span class="star">★</span>';
    }
    if (hasHalf) {
        html += '<span class="star" style="position: relative;"><span style="position: absolute; overflow: hidden; width: 50%;">★</span><span style="color: #ddd;">★</span></span>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        html += '<span class="star" style="color: #ddd;">★</span>';
    }
    html += '</div>';
    return html;
}
```

---

## Conclusion

This guide covers the major enhancements needed for the HTML file. Due to the file's complexity (2330 lines), it's recommended to:

1. **Test Each Feature Separately** - Implement one feature at a time and test thoroughly
2. **Use Version Control** - Commit after each working feature
3. **Test in Both Modes** - Verify light and dark mode compatibility
4. **Test Responsive Design** - Check mobile and desktop views
5. **Run Linting** - Use `npm run lint` after changes

For features 7-9 (Multi-language, Hours, Dietary Restrictions), the implementation follows similar patterns - create the UI elements, add CSS styling, implement JavaScript functions, and integrate with the existing data flow.

Would you like me to provide detailed implementation for any specific remaining feature?
