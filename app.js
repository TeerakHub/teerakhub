/* ============================================================
   TEERAKHUB — APP LOGIC
   You shouldn't need to edit this file. All content lives in
   data.js. This file just builds the pages from that data.
   ============================================================ */

const app = document.getElementById('app');
const navLinks = document.querySelectorAll('nav.main-nav a, nav.main-nav button');

/* ---------------- Helpers ---------------- */
function esc(str) {
  if (str === undefined || str === null) return "";
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function groupByCountry(items) {
  const groups = {};
  items.forEach(item => {
    const c = item.country || "Other";
    if (!groups[c]) groups[c] = [];
    groups[c].push(item);
  });
  return groups;
}

function findSeries(id) {
  return SERIES.find(s => s.id === id);
}
function findActor(id) {
  return ACTORS.find(a => a.id === id);
}

function yearRange(s) {
  if (s.type === 'film' || !s.yearEnd || s.yearEnd === s.yearStart) {
    return `${s.yearStart}`;
  }
  if (s.yearEnd === "ongoing") return `${s.yearStart} – ongoing`;
  return `${s.yearStart} – ${s.yearEnd}`;
}

function showCard(s) {
  return `
    <div class="show-card" data-route="series" data-id="${esc(s.id)}">
      <div class="poster-wrap">
        <span class="tag ${esc(s.genre)}">${esc(s.genre)}</span>
        <img src="${esc(s.poster)}" alt="${esc(s.title)} poster" onerror="this.style.opacity=0.15">
      </div>
      <div class="card-body">
        <div class="card-title">${esc(s.title)}</div>
        <div class="card-year">${yearRange(s)}</div>
      </div>
    </div>`;
}

/* ---------------- Quote banner ---------------- */
function renderQuoteBanner() {
  document.getElementById('quote-banner').innerHTML =
    `“${esc(DAILY_QUOTE.text)}”<span class="quote-author">— ${esc(DAILY_QUOTE.author)}</span>`;
}

/* ---------------- Router ---------------- */
function route() {
  const hash = window.location.hash || "#/home";
  const parts = hash.replace('#/', '').split('/').filter(Boolean);
  const page = parts[0] || 'home';

  setActiveNav(page);
  window.scrollTo(0, 0);

  switch (page) {
    case 'home': return renderHome();
    case 'series': return renderSeriesDetail(parts[1]);
    case 'stickers': return renderStickers();
    case 'actors': return renderActorsLanding();
    case 'actors-country': return renderActorsByCountry(parts[1], parts[2]);
    case 'actor': return renderActorProfile(parts[1]);
    case 'suggest': return renderSuggest();
    default: return renderHome();
  }
}

function setActiveNav(page) {
  navLinks.forEach(a => {
    a.classList.toggle('active', a.dataset.page === page ||
      (page === 'series' && a.dataset.page === 'home') ||
      ((page === 'actors' || page === 'actors-country' || page === 'actor') && a.dataset.page === 'actors'));
  });
}

/* ---------------- Home ---------------- */
function renderHome() {
  const filmCount = SERIES.filter(s => s.type === 'film').length;
  const showCount = SERIES.filter(s => s.type === 'series').length;

  const genres = ['All', 'GL', 'BL', 'WLW', 'Queer'];
  const countries = ['All', ...new Set(SERIES.map(s => s.country))];

  app.innerHTML = `
    <section class="hero">
      <h1>Welcome to <span class="accent">Teerakhub</span></h1>
      <p class="tagline">A home for GL, BL, WLW & queer dramas and films — browse by country, discover new favorites, and find out (if you dare) how they end.</p>
      <div class="stats-banner">
        <div class="stat-pill"><span class="stat-num">${filmCount}</span><span class="stat-label">Films</span></div>
        <div class="stat-pill"><span class="stat-num">${showCount}</span><span class="stat-label">Shows</span></div>
      </div>
    </section>

    <div class="filter-bar">
      <select id="genre-filter">
        ${genres.map(g => `<option value="${g}">${g === 'All' ? 'All genres' : g}</option>`).join('')}
      </select>
      <select id="country-filter">
        ${countries.map(c => `<option value="${esc(c)}">${c === 'All' ? 'All countries' : esc(c)}</option>`).join('')}
      </select>
      <input type="text" id="search-filter" placeholder="Search by title...">
    </div>

    <div id="results"></div>
  `;

  document.getElementById('genre-filter').addEventListener('change', renderResults);
  document.getElementById('country-filter').addEventListener('change', renderResults);
  document.getElementById('search-filter').addEventListener('input', renderResults);

  renderResults();
}

function renderResults() {
  const genre = document.getElementById('genre-filter').value;
  const country = document.getElementById('country-filter').value;
  const search = document.getElementById('search-filter').value.trim().toLowerCase();

  let filtered = SERIES.filter(s => {
    if (genre !== 'All' && s.genre !== genre) return false;
    if (country !== 'All' && s.country !== country) return false;
    if (search && !s.title.toLowerCase().includes(search)) return false;
    return true;
  });

  const results = document.getElementById('results');

  if (filtered.length === 0) {
    results.innerHTML = `<div class="empty-state">No titles match your filters yet — try a different combination, or <a href="#/suggest" style="color:var(--lilac); text-decoration:underline;">suggest one</a>!</div>`;
    return;
  }

  const groups = groupByCountry(filtered);
  const countryNames = Object.keys(groups).sort();

  results.innerHTML = countryNames.map(c => `
    <section class="country-section">
      <div class="country-heading">
        <h2>${esc(c)}</h2>
        <div class="line"></div>
      </div>
      <div class="card-grid">
        ${groups[c].map(showCard).join('')}
      </div>
    </section>
  `).join('');
}

/* ---------------- Series detail ---------------- */
function renderSeriesDetail(id) {
  const s = findSeries(id);
  if (!s) {
    app.innerHTML = `<div class="empty-state">This title couldn't be found. <a href="#/home" style="color:var(--lilac); text-decoration:underline;">Go back home</a>.</div>`;
    return;
  }

  const endingClass = s.happyEnding === true ? 'yes' : s.happyEnding === false ? 'no' : 'unknown';
  const endingText = s.happyEnding === true ? 'YES' : s.happyEnding === false ? 'NO' : 'Not confirmed yet';

  app.innerHTML = `
    <div class="detail-hero">
      <img src="${esc(s.couplePhoto)}" alt="${esc(s.title)} main couple" onerror="this.style.opacity=0.1">
    </div>
    <div class="detail-info">
      <span class="tag ${esc(s.genre)}">${esc(s.genre)}</span>
      <h1 class="detail-title">${esc(s.title)}</h1>
      <div class="detail-meta">
        <span>${esc(s.country)}</span>
        <span class="dot">•</span>
        <span>${yearRange(s)}</span>
        <span class="dot">•</span>
        <span>${s.type === 'film' ? 'Film' : 'Series'}</span>
      </div>

      <div class="info-grid">
        <div class="info-card reveal-box">
          <h3>Happy Ending?</h3>
          <button class="reveal-btn" id="reveal-btn">Reveal</button>
          <div class="reveal-answer ${endingClass}" id="reveal-answer">${endingText}</div>
        </div>
        <div class="info-card">
          <h3>Where to Watch</h3>
          <div>${(s.watchOn || []).map(w => `<span class="platform-chip">${esc(w)}</span>`).join('') || '<span class="value" style="color:var(--text-faint); font-size:0.9rem;">Not listed yet</span>'}</div>
        </div>
        <div class="info-card">
          <h3>Production</h3>
          <div class="value">${esc(s.studio) || '—'}</div>
        </div>
      </div>

      <h2 class="section-heading">Cast</h2>
      <div class="cast-grid">
        ${(s.cast || []).map(c => `
          <div class="cast-card">
            <div class="char-name">${esc(c.character)}</div>
            <div class="actor-name">${esc(c.actor)}</div>
          </div>
        `).join('') || '<div class="empty-state" style="grid-column:1/-1; padding:20px;">Cast info coming soon.</div>'}
      </div>

      <a href="#/home" class="back-link">← Back to all titles</a>
    </div>
  `;

  document.getElementById('reveal-btn').addEventListener('click', () => {
    const ans = document.getElementById('reveal-answer');
    ans.classList.add('shown');
  });
}

/* ---------------- Stickers ---------------- */
function renderStickers() {
  const gl = STICKERS.filter(s => s.genre === 'GL');
  const bl = STICKERS.filter(s => s.genre === 'BL');

  function stickerCard(s) {
    return `
      <div class="sticker-card">
        <img src="${esc(s.image)}" alt="${esc(s.title)}" onerror="this.style.opacity=0.1">
        <div class="sticker-body">
          <div class="sticker-title">${esc(s.title)}</div>
          <a class="btn" href="${esc(s.link)}" target="_blank" rel="noopener">Add to WhatsApp</a>
        </div>
      </div>`;
  }

  app.innerHTML = `
    <h1 class="page-heading">Sticker Packs</h1>
    <p class="page-sub">Free WhatsApp sticker packs inspired by your favorite GL & BL series.</p>

    <h2 class="section-heading">GL Sticker Packs</h2>
    <div class="sticker-grid">
      ${gl.map(stickerCard).join('') || '<div class="empty-state">No GL packs yet — check back soon!</div>'}
    </div>

    <h2 class="section-heading">BL Sticker Packs</h2>
    <div class="sticker-grid">
      ${bl.map(stickerCard).join('') || '<div class="empty-state">No BL packs yet — check back soon!</div>'}
    </div>
  `;
}

/* ---------------- Actor database: landing (choose gender) ---------------- */
function renderActorsLanding() {
  app.innerHTML = `
    <h1 class="page-heading">Actor Database</h1>
    <p class="page-sub">Browse actors by gender, then by country.</p>
    <div class="gender-toggle">
      <button data-route="actors-country" data-gender="Female">Female Actors</button>
      <button data-route="actors-country" data-gender="Male">Male Actors</button>
    </div>
  `;
}

/* ---------------- Actor database: country tiles ---------------- */
function renderActorsByCountry(gender, country) {
  if (!gender) {
    app.innerHTML = `<div class="empty-state">Choose a category. <a href="#/actors" style="color:var(--lilac); text-decoration:underline;">Go to actor database</a>.</div>`;
    return;
  }

  const genderActors = ACTORS.filter(a => a.gender === gender);

  if (!country) {
    const countries = {};
    genderActors.forEach(a => {
      countries[a.country] = (countries[a.country] || 0) + 1;
    });
    const countryNames = Object.keys(countries).sort();

    app.innerHTML = `
      <h1 class="page-heading">${esc(gender)} Actors</h1>
      <p class="page-sub">Choose a country to browse actors.</p>
      <div class="gender-toggle">
        <button class="${gender === 'Female' ? 'active' : ''}" data-route="actors-country" data-gender="Female">Female Actors</button>
        <button class="${gender === 'Male' ? 'active' : ''}" data-route="actors-country" data-gender="Male">Male Actors</button>
      </div>
      <div class="country-tile-grid" style="margin-top:32px;">
        ${countryNames.map(c => `
          <div class="country-tile" data-route="actors-country" data-gender="${esc(gender)}" data-country="${esc(c)}">
            ${esc(c)}
            <span class="count">${countries[c]} actor${countries[c] > 1 ? 's' : ''}</span>
          </div>
        `).join('') || '<div class="empty-state">No actors listed yet.</div>'}
      </div>
      <a href="#/actors" class="back-link">← Back to actor database</a>
    `;
    return;
  }

  // Specific country -> list actors
  const actors = genderActors.filter(a => a.country === country);
  app.innerHTML = `
    <h1 class="page-heading">${esc(gender)} Actors — ${esc(country)}</h1>
    <div class="actor-grid">
      ${actors.map(a => `
        <div class="actor-card" data-route="actor" data-id="${esc(a.id)}">
          <div class="actor-photo"><img src="${esc(a.photo)}" alt="${esc(a.name)}" onerror="this.style.opacity=0.1"></div>
          <div class="actor-name">${esc(a.name)}</div>
        </div>
      `).join('') || '<div class="empty-state">No actors listed for this country yet.</div>'}
    </div>
    <a href="#/actors-country/${encodeURIComponent(gender)}" class="back-link">← Back to ${esc(gender)} actors</a>
  `;
}

/* ---------------- Actor profile ---------------- */
function renderActorProfile(id) {
  const a = findActor(id);
  if (!a) {
    app.innerHTML = `<div class="empty-state">Actor not found. <a href="#/actors" style="color:var(--lilac); text-decoration:underline;">Go to actor database</a>.</div>`;
    return;
  }

  const works = (a.works || []).map(findSeries).filter(Boolean);

  app.innerHTML = `
    <div class="actor-profile">
      <div class="actor-photo-lg"><img src="${esc(a.photo)}" alt="${esc(a.name)}" onerror="this.style.opacity=0.1"></div>
      <div class="actor-details">
        <h1>${esc(a.name)}</h1>
        <div class="actor-meta">${esc(a.gender)} • ${esc(a.country)}</div>
        ${a.bio ? `<p class="actor-bio">${esc(a.bio)}</p>` : ''}
      </div>
    </div>

    <h2 class="section-heading">Known For</h2>
    <div class="card-grid">
      ${works.map(showCard).join('') || '<div class="empty-state" style="grid-column:1/-1;">No linked titles yet.</div>'}
    </div>

    <a href="#/actors-country/${encodeURIComponent(a.gender)}/${encodeURIComponent(a.country)}" class="back-link">← Back to ${esc(a.country)} actors</a>
  `;
}

/* ---------------- Suggestions ---------------- */
function renderSuggest() {
  if (FORMSPREE_ID === "YOUR_FORM_ID" || !FORMSPREE_ID) {
    app.innerHTML = `
      <h1 class="page-heading">Suggest a Title</h1>
      <div class="empty-state">
        The suggestion form isn't set up yet. Add your Formspree form ID in <code>data.js</code> to enable it.
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <h1 class="page-heading">Suggest a Title</h1>
    <p class="page-sub">Know a GL, BL, WLW or queer series/film that should be on Teerakhub? Let us know!</p>

    <form class="suggest-form" id="suggest-form" action="https://formspree.io/f/${esc(FORMSPREE_ID)}" method="POST">
      <label for="title">Title of the series/film</label>
      <input type="text" id="title" name="title" required>

      <label for="country">Country</label>
      <input type="text" id="country" name="country" required>

      <label for="notes">Anything else? (optional)</label>
      <textarea id="notes" name="notes" placeholder="Genre, where you watched it, links, etc."></textarea>

      <label for="email">Your email (optional, in case we have questions)</label>
      <input type="email" id="email" name="email">

      <div class="submit-row">
        <button type="submit" class="btn">Send Suggestion</button>
      </div>
    </form>
  `;

  document.getElementById('suggest-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    try {
      await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
    } catch (err) {
      // even if it fails, show thank-you per request; Formspree handles retries via its dashboard
    }
    app.innerHTML = `
      <div class="thank-you">
        <h2>Thank you!</h2>
        <p>Your suggestion is greatly appreciated — I'll add it soon!</p>
        <a href="#/home" class="back-link" style="display:block; margin-top:20px;">← Back to home</a>
      </div>
    `;
  });
}

/* ---------------- Global click delegation for card routing ---------------- */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-route]');
  if (!el) return;

  const r = el.dataset.route;
  if (r === 'series') {
    window.location.hash = `#/series/${encodeURIComponent(el.dataset.id)}`;
  } else if (r === 'actor') {
    window.location.hash = `#/actor/${encodeURIComponent(el.dataset.id)}`;
  } else if (r === 'actors-country') {
    if (el.dataset.country) {
      window.location.hash = `#/actors-country/${encodeURIComponent(el.dataset.gender)}/${encodeURIComponent(el.dataset.country)}`;
    } else {
      window.location.hash = `#/actors-country/${encodeURIComponent(el.dataset.gender)}`;
    }
  }
});

/* ---------------- Mobile nav toggle ---------------- */
document.getElementById('nav-toggle').addEventListener('click', () => {
  document.querySelector('nav.main-nav').classList.toggle('open');
});
document.querySelector('nav.main-nav').addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    document.querySelector('nav.main-nav').classList.remove('open');
  }
});

/* ---------------- Init ---------------- */
window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', () => {
  renderQuoteBanner();
  route();
});
renderQuoteBanner();
route();
