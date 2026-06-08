/**
 * Catalog logic: render category tabs and course cards from the data source,
 * then wire up live search, category filtering and the "Load more" button.
 *
 * No frameworks — plain DOM APIs and ES modules. Extras:
 *  • accessible category filter (radiogroup pattern + arrow-key navigation)
 *  • search-term highlighting in results
 *  • shareable state synced to the URL (?category=&q=) with Back support
 *  • result counter, Esc-to-clear, fade-in for newly shown cards
 */

import { COURSES, CATEGORIES } from './data.js';

const ALL_ID = 'all';
const PAGE_SIZE = 9;   // cards shown initially (matches the 3×3 mock grid)
const LOAD_STEP = 6;   // cards revealed per "Load more" click

const VALID_CATEGORIES = new Set([ALL_ID, ...CATEGORIES.map((c) => c.id)]);

/** Mutable view state. */
const state = {
  category: ALL_ID,
  query: '',
  visible: PAGE_SIZE,
};

const els = {
  tabs: document.getElementById('tabs'),
  search: document.getElementById('search-input'),
  count: document.getElementById('count'),
  courses: document.getElementById('courses'),
  empty: document.getElementById('empty'),
  loadMore: document.getElementById('load-more'),
};

// Keys of the cards shown in the previous render — lets us animate only the
// cards that are actually new instead of flashing the whole grid on each keystroke.
let shownKeys = new Set();

// -- Helpers ------------------------------------------------------------------

const escapeHtml = (str) =>
  str.replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));

/** Escape `text`, then wrap every occurrence of `query` in a <mark>. */
function highlight(text, query) {
  const safe = escapeHtml(text);
  const q = query.trim();
  if (!q) return safe;

  const safeQuery = escapeHtml(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${safeQuery})`, 'gi');
  return safe.replace(re, '<mark class="card__mark">$1</mark>');
}

/** Courses matching the current category + search query (ignores pagination). */
function getMatches() {
  const query = state.query.trim().toLowerCase();

  return COURSES.filter((course) => {
    const byCategory = state.category === ALL_ID || course.category === state.category;
    const byQuery = !query || course.title.toLowerCase().includes(query);
    return byCategory && byQuery;
  });
}

/** Total number of courses in a category (used for the tab counters). */
function countFor(categoryId) {
  if (categoryId === ALL_ID) return COURSES.length;
  return COURSES.filter((course) => course.category === categoryId).length;
}

// -- Rendering ----------------------------------------------------------------

function renderTabs({ focusActive = false } = {}) {
  const tabs = [{ id: ALL_ID, name: 'All' }, ...CATEGORIES];

  els.tabs.innerHTML = tabs
    .map((tab) => {
      const isActive = tab.id === state.category;
      return `
        <li class="tabs__item" role="presentation">
          <button
            class="tab${isActive ? ' tab--active' : ''}"
            type="button"
            role="radio"
            aria-checked="${isActive}"
            tabindex="${isActive ? 0 : -1}"
            data-category="${tab.id}">
            <span class="tab__label">${tab.name}</span>
            <span class="tab__count">${countFor(tab.id)}</span>
          </button>
        </li>`;
    })
    .join('');

  if (focusActive) {
    const active = els.tabs.querySelector('.tab--active');
    active.focus();
    active.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }

  updateTabFade();
}

function cardTemplate(course) {
  const category = CATEGORIES.find((c) => c.id === course.category);
  const categoryName = category ? category.name : course.category;
  const isNew = !shownKeys.has(course.title);

  return `
    <li class="card${isNew ? ' card--enter' : ''}">
      <div class="card__image">
        <img class="card__photo" src="${course.image}" alt="${escapeHtml(course.title)}"
             width="390" height="240" loading="lazy">
      </div>
      <div class="card__content">
        <span class="badge badge--${course.category}">${escapeHtml(categoryName)}</span>
        <h3 class="card__title">${highlight(course.title, state.query)}</h3>
        <div class="card__info">
          <span class="card__price">$${course.price}</span>
          <span class="card__divider" aria-hidden="true"></span>
          <span class="card__author">by ${escapeHtml(course.author)}</span>
        </div>
      </div>
    </li>`;
}

function renderCount(matchCount) {
  const isFiltering = state.category !== ALL_ID || state.query.trim() !== '';
  if (!isFiltering) {
    els.count.hidden = true;
    return;
  }
  const noun = matchCount === 1 ? 'course' : 'courses';
  els.count.textContent = `Found ${matchCount} ${noun}`;
  els.count.hidden = false;
}

function render() {
  const matches = getMatches();
  const shown = matches.slice(0, state.visible);

  els.courses.innerHTML = shown.map(cardTemplate).join('');
  shownKeys = new Set(shown.map((course) => course.title));

  const isEmpty = matches.length === 0;
  els.empty.hidden = !isEmpty;
  els.courses.hidden = isEmpty;
  els.loadMore.hidden = matches.length <= state.visible;

  renderCount(matches.length);
}

// -- URL state ----------------------------------------------------------------

function readStateFromUrl() {
  const params = new URLSearchParams(location.search);
  const category = params.get('category');
  state.category = VALID_CATEGORIES.has(category) ? category : ALL_ID;
  state.query = params.get('q') || '';
  state.visible = PAGE_SIZE;
  els.search.value = state.query;
}

function syncUrl({ push = false } = {}) {
  const params = new URLSearchParams();
  if (state.category !== ALL_ID) params.set('category', state.category);
  if (state.query.trim()) params.set('q', state.query.trim());

  const qs = params.toString();
  const url = qs ? `${location.pathname}?${qs}` : location.pathname;
  history[push ? 'pushState' : 'replaceState']({}, '', url);
}

// -- Interactions -------------------------------------------------------------

function selectCategory(categoryId, { focusActive = false, push = true } = {}) {
  if (!VALID_CATEGORIES.has(categoryId)) return;
  state.category = categoryId;
  state.visible = PAGE_SIZE;
  renderTabs({ focusActive });
  render();
  syncUrl({ push });
}

/** Toggle the edge fade hints that signal the tab strip can scroll sideways. */
function updateTabFade() {
  const el = els.tabs;
  const max = el.scrollWidth - el.clientWidth;
  el.classList.toggle('tabs--fade-start', el.scrollLeft > 1);
  el.classList.toggle('tabs--fade-end', el.scrollLeft < max - 1);
}

function debounce(fn, delay = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function bindEvents() {
  // Category: click
  els.tabs.addEventListener('click', (event) => {
    const button = event.target.closest('.tab');
    if (button) selectCategory(button.dataset.category, { push: true });
  });

  // Category: keyboard (radiogroup roving navigation)
  els.tabs.addEventListener('keydown', (event) => {
    const navKeys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!navKeys.includes(event.key)) return;
    event.preventDefault();

    const ids = [...els.tabs.querySelectorAll('.tab')].map((t) => t.dataset.category);
    let i = ids.indexOf(state.category);

    if (event.key === 'Home') i = 0;
    else if (event.key === 'End') i = ids.length - 1;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') i = (i + 1) % ids.length;
    else i = (i - 1 + ids.length) % ids.length;

    selectCategory(ids[i], { focusActive: true, push: true });
  });

  // Live search (debounced)
  els.search.addEventListener(
    'input',
    debounce((event) => {
      state.query = event.target.value;
      state.visible = PAGE_SIZE;
      render();
      syncUrl({ push: false });
    })
  );

  // Esc clears the search field
  els.search.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && els.search.value) {
      els.search.value = '';
      state.query = '';
      state.visible = PAGE_SIZE;
      render();
      syncUrl({ push: false });
    }
  });

  // Load more
  els.loadMore.addEventListener('click', () => {
    state.visible += LOAD_STEP;
    render();
  });

  // Tab strip scroll hints
  els.tabs.addEventListener('scroll', updateTabFade, { passive: true });
  window.addEventListener('resize', updateTabFade);

  // Back/forward navigation restores the shared state
  window.addEventListener('popstate', () => {
    readStateFromUrl();
    renderTabs();
    render();
  });
}

// -- Init ---------------------------------------------------------------------

readStateFromUrl();
renderTabs();
render();
bindEvents();
