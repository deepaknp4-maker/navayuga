// ==========================================
// 1. ഗ്ലോബൽ ക്രമീകരണങ്ങൾ (GLOBAL SETTINGS)
// ==========================================
console.log("നവയുഗ ക്ലബ് ആപ്പ് സിസ്റ്റം ലൈവ് ആണ്!"); 

// 🚀 ഗൂഗിളിന്റെ പുതിയ പോളിസി അനുസരിച്ചുള്ള ലോഗോ ലിങ്ക് (lh3.googleusercontent.com)
const DRIVE_LOGO = "https://lh3.googleusercontent.com/d/1IUNqvKYZDq_YjKi_jSJtFwpBW31ORy8P";
// 🌐 നിങ്ങളുടെ ലൈവ് ഗൂഗിൾ വെബ് ആപ്പ് ലിങ്ക്
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby96lV6JOLU7vFekEkYTIp33OjiEJQW6am4crpEWyF1nZPCuoryKMv9-Fb7qliS7Ovmqg/exec';

// ==========================================
// 2. ഗ്ലോബൽ മെനു ഇൻജക്ഷൻ സിസ്റ്റം (DYNAMIC HEADER)
// ==========================================
function loadGlobalMenu() {
    const headerPlace = document.getElementById('header-placeholder');
    if (!headerPlace) return;

    let currentFile = window.location.pathname.split("/").pop();
    if (currentFile === "" || !currentFile) { currentFile = "index.html"; }

    const loggedInUser = localStorage.getItem('loggedInUser');
    
    let authHTML = '';
    let mobileLogoutHTML = ''; 

    if (loggedInUser) {
        authHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div class="user-profile" style="background: #198754; display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 5px;">
                    <a href="profile.html" style="color:#ffffff; text-decoration: none;"><i class="fa-solid fa-user"></i> <span>${loggedInUser}</span></a>
                </div>
                <button class="header-logout" onclick="logoutUser(event)" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 5px;">
                    <i class="fa-solid fa-right-from-bracket"></i> ലോഗൗട്ട്
                </button>
            </div>
        `;
        mobileLogoutHTML = `<a href="#" class="nav-logout" onclick="logoutUser(event)" style="color: #ffcbd1; font-weight: bold;"><i class="fa-solid fa-right-from-bracket"></i> ലോഗൗട്ട്</a>`;
    } else {
        authHTML = `
            <div class="user-profile" style="background: #0d6efd; cursor: pointer; padding: 6px 15px; border-radius: 5px;" onclick="window.location.href='auth.html'">
                <i class="fa-solid fa-lock"></i> <span>ലോഗിൻ</span>
            </div>
        `;
    }

    headerPlace.innerHTML = `
        <header>
            <div class="logo" style="display: flex; align-items: center; gap: 10px;">
                <a href="index.html"><img src="${DRIVE_LOGO}" alt="Logo" style="height: 42px; width: 42px; border-radius: 50%; object-fit: cover;"></a>
                <span><a href="index.html" style="color:#ffffff; text-decoration: none;">നവയുഗ ക്ലബ്</a></span>
            </div>
            <div class="menu-toggle" id="mobile-menu-btn"><i class="fa-solid fa-bars"></i></div>
            <nav id="nav-links-box">
                <a href="index.html" class="${currentFile === 'index.html' ? 'active' : ''}">ഹോം</a>
                <a href="library.html" class="${currentFile === 'library.html' || currentFile === 'booking.html' ? 'active' : ''}">ലൈബ്രറി</a>
                <a href="gallery.html" class="${currentFile === 'gallery.html' ? 'active' : ''}">ഗാലറി</a>
                <a href="events.html" class="${currentFile === 'events.html' ? 'active' : ''}">പരിപാടികൾ</a>
                <a href="post.html" class="${currentFile === 'post.html' ? 'active' : ''}">പോസ്റ്റ്</a>
                <a href="vote.html" class="${currentFile === 'vote.html' ? 'active' : ''}">വോട്ട്</a>
                <a href="about.html" class="${currentFile === 'about.html' ? 'active' : ''}">ഞങ്ങളെക്കുറിച്ച്</a>
                ${mobileLogoutHTML}
            </nav>
            <div class="header-auth-zone" id="desktop-auth-box">
                ${authHTML}
            </div>
        </header>
    `;

    const menuBtn = document.getElementById('mobile-menu-btn');
    const linksBox = document.getElementById('nav-links-box');
    if (menuBtn && linksBox) {
        menuBtn.addEventListener('click', () => {
            linksBox.classList.toggle('show-menu');
            menuBtn.querySelector('i').className = linksBox.classList.contains('show-menu') ? "fa-solid fa-xmark" : "fa-solid fa-bars";
        });
    }
}

// 🔄 ഗൂഗിൾ ഡ്രൈവ് ലിങ്കുകളെ പുതിയ ഡയറക്ട് ഇമേജ് ലിങ്കായി മാറ്റുന്ന ഫങ്ഷൻ
function cleanDriveLink(url) {
    if (!url) return '';
    const strUrl = url.toString().trim();
    const normalized = strUrl.replace(/\s+/g, '');
    const driveIdMatch = normalized.match(/\/d\/([^/]+)/) || normalized.match(/id=([^&]+)/) || normalized.match(/googleusercontent\.com\/d\/([^/?]+)/);
    if (driveIdMatch && driveIdMatch[1]) {
        return `https://drive.google.com/uc?export=view&id=${driveIdMatch[1]}`;
    }
    if (normalized.includes('uc?export=view') || normalized.includes('uc?export=download')) {
        return normalized.replace('uc?export=download', 'uc?export=view');
    }
    return normalized;
}

function buildDriveImageUrls(url) {
    const primary = cleanDriveLink(url);
    const urls = [];
    if (!primary) return urls;
    urls.push(primary);
    const idMatch = primary.match(/id=([^&]+)/);
    if (idMatch && idMatch[1]) {
        urls.push(`https://drive.google.com/uc?export=download&id=${idMatch[1]}`);
        urls.push(`https://drive.google.com/thumbnail?id=${idMatch[1]}`);
        urls.push(`https://drive.google.com/thumbnail?sz=w320&id=${idMatch[1]}`);
        urls.push(`https://docs.google.com/uc?export=view&id=${idMatch[1]}`);
        urls.push(`https://docs.google.com/uc?export=download&id=${idMatch[1]}`);
    }
    if (primary.includes('uc?export=view')) {
        urls.push(primary.replace('uc?export=view', 'uc?export=download'));
    }
    if (primary.includes('uc?export=download')) {
        urls.push(primary.replace('uc?export=download', 'uc?export=view'));
    }
    return [...new Set(urls.filter(Boolean))];
}

function tryDriveFallback(img, urlArray) {
    if (!img) return;
    let urls = urlArray;
    if (!Array.isArray(urls)) {
        const datasetValue = img.dataset && img.dataset.fallback;
        if (typeof urlArray === 'string' && urlArray.trim()) {
            try {
                urls = JSON.parse(decodeURIComponent(urlArray));
            } catch (e) {
                try { urls = JSON.parse(urlArray); } catch (e2) { urls = null; }
            }
        } else if (datasetValue) {
            try {
                urls = JSON.parse(decodeURIComponent(datasetValue));
            } catch (e) {
                try { urls = JSON.parse(datasetValue); } catch (e2) { urls = null; }
            }
        }
    }
    if (!Array.isArray(urls) || urls.length === 0) {
        img.onerror = null;
        img.src = 'https://placehold.co/600x400?text=Image+Not+Found';
        return;
    }
    const current = img.src || '';
    const index = urls.findIndex(u => u === current);
    const nextIndex = index < 0 ? 0 : index + 1;
    if (nextIndex >= urls.length) {
        img.onerror = null;
        img.src = 'https://placehold.co/600x400?text=Image+Not+Found';
        return;
    }
    img.onerror = function() { tryDriveFallback(img, urls); };
    img.src = urls[nextIndex];
}

// 🚪 ലോഗൗട്ട് ഫങ്ഷൻ
function logoutUser(event) {
    if (event) event.preventDefault();
    if (confirm("നിങ്ങൾക്ക് അക്കൗണ്ടിൽ നിന്നും ലോഗൗട്ട് ചെയ്യണോ?")) {
        localStorage.clear();
        alert("നിങ്ങൾ വിജയകരമായി ലോഗൗട്ട് ചെയ്തിരിക്കുന്നു.");
        window.location.href = "index.html";
    }
}

// 🔐 പേജ് സെക്യൂരിറ്റി ചെക്ക്
function checkPageSecurity() {
    let currentFile = window.location.pathname.split("/").pop();
    if (currentFile === "booking.html" && !localStorage.getItem('loggedInUser')) {
        alert("ബുക്കിംഗ് ചെയ്യുന്നതിനായി ദയവായി ആദ്യം ലോഗിൻ ചെയ്യുക!");
        window.location.href = "auth.html";
    }
}

// ==========================================
// 3. ഹോം പേജ് ഇമേജ് സ്ലൈഡർ ലോജിക്
// ==========================================
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (slides.length === 0) return;
    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active-slide');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active-slide');
    }, 4000);
}

// ==========================================
// 3.5. താല്ക്കാലിക പ്ലേസ്‌ഹോൾഡർ ചിത്രങ്ങൾ തിരുത്തുന്ന ഫങ്ഷൻ
// ==========================================
function fixStaticPlaceholderImages() {
    // 1. ക്ലബ്ബ് ചിത്രത്തിനുള്ള ലിങ്ക് തിരുത്തുന്നു
    const clubImg = document.querySelector('.club-intro img');
    if (clubImg && (clubImg.src.includes('club.png') || clubImg.src.includes('picture/3') || clubImg.getAttribute('src') === 'https://lh3.googleusercontent.com/d/1-zBHmY4ZzUU5E-QGptbOeTDFJQyTaK6v')) {
        clubImg.src = "https://lh3.googleusercontent.com/d/1-zBHmY4ZzUU5E-QGptbOeTDFJQyTaK6v";
    }

    // 2. കുട്ടികളുടെ നേട്ടങ്ങൾ സെക്ഷനിലെ താല്ക്കാലിക ചിത്രങ്ങൾ തിരുത്തുന്നു
    const carouselImgs = document.querySelectorAll('.scroll-carousel .carousel-item img');
    carouselImgs.forEach(img => {
        const currentSrc = img.getAttribute('src') || '';
        if (currentSrc.includes('picture/') || currentSrc.includes('googleusercontent.com')) {
            img.src = "https://lh3.googleusercontent.com/d/1aKay44TSxlxb1n-F9MeCmYM3agZctf0p";
        }
    });
}

// ==========================================
// 4. ലൈബ്രറി പുസ്തകങ്ങൾ കാണിക്കാനുള്ള ലോജിക്
// ==========================================
async function fetchLibraryBooks() {
    const bookListContainer = document.getElementById('live-book-list');
    if (!bookListContainer) return; 

    window.handleLibraryBooks = function(books) {
        if (!books || books.length === 0) {
            bookListContainer.innerHTML = `<p style="text-align: center;">ലൈബ്രറിയിൽ പുസ്തകങ്ങൾ ഒന്നും കണ്ടെത്തിയില്ല!</p>`;
            return;
        }
        bookListContainer.innerHTML = '';

        books.forEach(book => {
            const isUnavailable = book.status && book.status.toString().trim().toLowerCase() === 'not available';
            const avgRating = book.ratingCount > 0 ? Math.round(book.totalStars / book.ratingCount) : 0;

            let buttonHTML = isUnavailable 
                ? `<button class="btn booked-btn" disabled style="background-color: #6c757d; cursor: not-allowed; width: 120px;">Booked</button>`
                : `<button class="btn book-now-btn" style="width: 120px;">ബുക്ക് ചെയ്യുക</button>`;

            let starsHTML = '';
            for (let starValue = 1; starValue <= 5; starValue++) {
                starsHTML += `<span class="star ${starValue <= avgRating ? 'selected' : ''}">★</span>`;
            }

            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.setAttribute('data-id', book.bookId);
            const bookingDetails = isUnavailable && book.expectedReturn && book.bookedUserName
                ? `<p style="margin:10px 0 0; color:#b02a37; font-size:13px;"> ${book.expectedReturn} ന് തിരികെ ക്ലബ്ബിൽ എത്തുമെന്ന് പ്രദീക്ഷിക്കുന്നു.`
                : '';
            bookCard.innerHTML = `
                <div class="book-info">
                    <h3 class="b-title" style="color: #0f5132; margin-bottom: 5px;">${book.bookName}</h3>
                    <p class="b-author" style="font-style: italic; color: #555; margin-bottom: 8px;">${book.authorName}</p>
                    <p class="b-desc" style="font-size: 14px; color: #666; margin-bottom: 10px;">${book.description}</p>
                    <span class="status-tag" style="font-size: 12px; font-weight: bold; color: ${isUnavailable ? '#dc3545' : '#198754'};">
                        <i class="fa-solid ${isUnavailable ? 'fa-circle-xmark' : 'fa-circle-check'}"></i> ${isUnavailable ? 'നിലവിൽ ലഭ്യമല്ല' : 'ലഭ്യമാണ്'}
                    </span>
                    ${bookingDetails}
                </div>
                <div class="book-actions" style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between;">
                    <div class="star-rating-block">
                        <div class="star-rating">${starsHTML}</div>
                        <small style="color:#888; font-size:11px;">(${book.ratingCount} റേറ്റിംഗുകൾ)</small>
                    </div>
                    ${buttonHTML}
                </div>`;
            bookListContainer.appendChild(bookCard);
        });
        activateBookButtons();
    };

    const script = document.createElement('script');
    script.src = `${WEB_APP_URL}?action=getBooks&callback=handleLibraryBooks`;
    script.onerror = function(err) {
        console.error('Library load failed', err);
        bookListContainer.innerHTML = `<p style="text-align: center; color: red;">ലൈബ്രറി ഡാറ്റ ലഭിച്ചില്ല. വീണ്ടും ശ്രമിക്കുക.</p>`;
    };
    document.body.appendChild(script);
    return;
}

function activateBookButtons() {
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach(card => {
        const bookBtn = card.querySelector('.book-now-btn');
        if (!bookBtn) return;

        bookBtn.addEventListener('click', () => {
            if (!localStorage.getItem('loggedInUser')) {
                alert('പുസ്തകം ബുക്ക് ചെയ്യുന്നതിനായി ദയവായി ആദ്യം ലോഗിൻ ചെയ്യുക!');
                window.location.href = "auth.html";
                return;
            }
            localStorage.setItem('selectedBookId', card.getAttribute('data-id'));
            localStorage.setItem('selectedBookName', card.querySelector('.b-title').innerText);
            localStorage.setItem('selectedBookAuthor', card.querySelector('.b-author').innerText);
            window.location.href = "booking.html";
        });
    });
}

// ==========================================
// 5. ബുക്കിംഗ് ഫോം സബ്മിഷൻ ലോജിക്
// ==========================================
function initBookingForm() {
    const reservationForm = document.getElementById('library-reservation-form');
    if (!reservationForm) return;

    const userField = document.getElementById('form-user-name');
    const bookField = document.getElementById('form-book-name');
    const authorField = document.getElementById('form-author-name');
    const dateField = document.getElementById('form-booked-date');

    if (userField) userField.value = localStorage.getItem('loggedInUser') || "";
    if (bookField) bookField.value = localStorage.getItem('selectedBookName') || "തിരഞ്ഞെടുത്തിട്ടില്ല";
    if (authorField) authorField.value = localStorage.getItem('selectedBookAuthor') || "";
    if (dateField) dateField.value = new Date().toISOString().split('T')[0];

     reservationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = reservationForm.querySelector('button[type="submit"]');
    submitBtn.innerText = "സമർപ്പിക്കുന്നു...";
    submitBtn.disabled = true;

    const bookingData = {
        action: 'addBooking',
        bookingId: "BK-" + Math.floor(1000 + Math.random() * 9000),
        userName: localStorage.getItem('loggedInUser') || "",
        bookId: localStorage.getItem('selectedBookId'),
        bookName: bookField.value,
        authorName: authorField.value,
        bookedDate: dateField.value,
        returnDate: document.getElementById('form-return-date').value
    };

    try {
        await fetch(WEB_APP_URL, { 
            method: 'POST', 
            // no-cors പകരം cors ഉപയോഗിക്കുന്നത് സുരക്ഷിതമാണ് (Apps Script-ൽ CORS എനേബിൾ ആണെങ്കിൽ)
            body: JSON.stringify(bookingData) 
        });
        alert("ബുക്കിംഗ് വിജയകരമായി സമർപ്പിച്ചു!");
        window.location.href = "library.html";
    } catch (error) {
        alert("പരാജയപ്പെട്ടു. ദയവായി വീണ്ടും ശ്രമിക്കുക.");
        submitBtn.innerText = "ബുക്കിംഗ് സമർപ്പിക്കുക";
        submitBtn.disabled = false;
    }
});
}

// ==========================================
// 6. ഹോം പേജ് ഡാറ്റ ലോഡിങ് ലോജിക് (Notices & Achievements)
// ==========================================
async function loadHomeDynamicData() {
    const noticeContainer = document.getElementById('live-notices-list') || document.querySelector('.notice-grid');
    const achievementContainer = document.getElementById('live-achievements-list') || document.querySelector('.scroll-carousel');

    if (noticeContainer) {
        try {
            const res = await fetch(`${WEB_APP_URL}?action=getNotices`);
            const notices = await res.json();
            if(notices && notices.length > 0) {
                noticeContainer.innerHTML = '';
                notices.forEach(n => {
                    noticeContainer.innerHTML += `
                        <div class="notice-card">
                            <h4>${n.title || n.heading || ''}</h4>
                            <p>${n.content || n.details || ''}</p>
                        </div>`;
                });
            }
        } catch(e) { console.log("Notice load error", e); }
    }

    if (achievementContainer) {
        try {
            const res = await fetch(`${WEB_APP_URL}?action=getAchievements`);
            const achievements = await res.json();
            if(achievements && achievements.length > 0) {
                achievementContainer.innerHTML = '';
                achievements.forEach(a => {
                    const rawImgUrl = a.imageUrl || a.image || a.imageLink || a.Image || a.ImageUrl || '';
                    const imgUrls = buildDriveImageUrls(rawImgUrl);
                    const mainImg = imgUrls[0] || 'https://lh3.googleusercontent.com/d/1aKay44TSxlxb1n-F9MeCmYM3agZctf0p';
                    const titleText = a.title || a.name || a.heading || a.Title || a.Name || '';

                    achievementContainer.innerHTML += `
                        <div class="carousel-item" style="text-align:center; min-width:220px;">
                            <img src="${mainImg}" data-fallback="${encodeURIComponent(JSON.stringify(imgUrls))}" alt="Achievement" style="width:100%; height:300px; object-fit:cover; border-radius:4px; margin-bottom:8px;" onerror="tryDriveFallback(this)">
                            <p style="margin-top:8px; font-weight:bold; font-size:16px;">${titleText}</p>
                        </div>`;
                });
            }
        } catch(e) { console.log("Achievement load error", e); }
    }
}

// ==========================================
// 7. വിൻഡോ റൺ ലോജിക്
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    checkPageSecurity();
    try { loadGlobalMenu(); } catch (e) { console.error(e); }
    try { initHeroSlider(); } catch (e) { console.error(e); }
    try { fixStaticPlaceholderImages(); } catch (e) { console.error(e); }
    try { fetchLibraryBooks(); } catch (e) { console.error(e); }
    try { initBookingForm(); } catch (e) { console.error(e); }
    try { loadHomeDynamicData(); } catch (e) { console.error(e); }
});


// ==========================================
// 7. app converted to PWA (Progressive Web App) service worker logic
// ==========================================
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('navayuga-store').then((cache) => {
      return cache.addAll(['/', '/index.html', '/style.css']);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
