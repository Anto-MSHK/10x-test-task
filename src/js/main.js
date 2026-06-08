/**
 * Catalog logic: render category tabs and course cards from the data source,
 * then wire up live search, category filtering and the "Load more" button.
 *
 * No frameworks — plain DOM APIs and ES modules.
 */

import { COURSES, CATEGORIES } from './data.js';

const ALL_ID = 'all';
const PAGE_SIZE = 9;   // cards shown initially (matches the 3×3 mock grid)
const LOAD_STEP = 6;   // cards revealed per "Load more" click

/** Mutable view state. */
const state = {
  category: ALL_ID,
  query: '',
  visible: PAGE_SIZE,
};

const els = {
  tabs: document.getElementById('tabs'),
  search: document.getElementById('search-input'),
  courses: document.getElementById('courses'),
  empty: document.getElementById('empty'),
  loadMore: document.getElementById('load-more'),
};

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

function renderTabs() {
  const tabs = [{ id: ALL_ID, name: 'All' }, ...CATEGORIES];

  els.tabs.innerHTML = tabs
    .map((tab) => {
      const isActive = tab.id === state.category;
      return `
        <li class="tabs__item" role="presentation">
          <button
            class="tab${isActive ? ' tab--active' : ''}"
            type="button"
            role="tab"
            aria-selected="${isActive}"
            data-category="${tab.id}">
            <span class="tab__label">${tab.name}</span>
            <span class="tab__count">${countFor(tab.id)}</span>
          </button>
        </li>`;
    })
    .join('');
}

function cardTemplate(course) {
  const category = CATEGORIES.find((c) => c.id === course.category);
  const categoryName = category ? category.name : course.category;

  return `
    <li class="card">
      <div class="card__image">
        <img class="card__photo" src="${course.image}" alt="${course.title}" loading="lazy">
      </div>
      <div class="card__content">
        <span class="badge badge--${course.category}">${categoryName}</span>
        <h3 class="card__title">${course.title}</h3>
        <div class="card__info">
          <span class="card__price">$${course.price}</span>
          <span class="card__divider" aria-hidden="true"></span>
          <span class="card__author">by ${course.author}</span>
        </div>
      </div>
    </li>`;
}

function render() {
  const matches = getMatches();
  const shown = matches.slice(0, state.visible);

  els.courses.innerHTML = shown.map(cardTemplate).join('');

  const isEmpty = matches.length === 0;
  els.empty.hidden = !isEmpty;
  els.courses.hidden = isEmpty;

  // "Load more" only matters when there are still hidden matches.
  els.loadMore.hidden = matches.length <= state.visible;
}

/** Small debounce so the live search does not re-render on every keystroke. */
function debounce(fn, delay = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function bindEvents() {
  els.tabs.addEventListener('click', (event) => {
    const button = event.target.closest('.tab');
    if (!button) return;

    state.category = button.dataset.category;
    state.visible = PAGE_SIZE;
    renderTabs();
    render();
  });

  els.search.addEventListener(
    'input',
    debounce((event) => {
      state.query = event.target.value;
      state.visible = PAGE_SIZE;
      render();
    })
  );

  els.loadMore.addEventListener('click', () => {
    state.visible += LOAD_STEP;
    render();
  });
}

renderTabs();
render();
bindEvents();
