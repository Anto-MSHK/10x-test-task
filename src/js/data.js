/**
 * Single source of truth for the catalog.
 *
 * `CATEGORIES` defines the filter tabs (order matters — it is the render order).
 * `COURSES` holds every course; the `category` field references a category `id`.
 *
 * The 9 courses from the Figma mock are kept verbatim (titles, prices, authors,
 * images). The remaining 8 are added in the same style so the category counts
 * match the mock (Marketing 4 · Management 3 · HR & Recruting 5 · Design 2 ·
 * Development 3 = 17) and the search / "Load more" behaviour is easy to try out.
 */

export const CATEGORIES = [
  { id: 'marketing',   name: 'Marketing' },
  { id: 'management',  name: 'Management' },
  { id: 'hr',          name: 'HR & Recruting' },
  { id: 'design',      name: 'Design' },
  { id: 'development', name: 'Development' },
];

const img = (name) => `assets/images/${name}`;

export const COURSES = [
  // --- From the Figma mock (kept in the mock's exact grid order) -------------
  {
    title: 'The Ultimate Google Ads Training Course',
    category: 'marketing',
    price: 100,
    author: 'Jerome Bell',
    image: img('course-9.jpg'),
  },
  {
    title: 'Prduct Management Fundamentals',
    category: 'management',
    price: 480,
    author: 'Marvin McKinney',
    image: img('course-8.jpg'),
  },
  {
    title: 'HR Management and Analytics',
    category: 'hr',
    price: 200,
    author: 'Leslie Alexander Li',
    image: img('course-7.jpg'),
  },
  {
    title: 'Brand Management & PR Communications',
    category: 'marketing',
    price: 530,
    author: 'Kristin Watson',
    image: img('course-6.jpg'),
  },
  {
    title: 'Graphic Design Basic',
    category: 'design',
    price: 500,
    author: 'Guy Hawkins',
    image: img('course-5.jpg'),
  },
  {
    title: 'Business Development Management',
    category: 'management',
    price: 400,
    author: 'Dianne Russell',
    image: img('course-4.jpg'),
  },
  {
    title: 'Highload Software Architecture',
    category: 'development',
    price: 600,
    author: 'Brooklyn Simmons',
    image: img('course-3.jpg'),
  },
  {
    title: 'Human Resources – Selection and Recruitment',
    category: 'hr',
    price: 150,
    author: 'Kathryn Murphy',
    image: img('course-2.jpg'),
  },
  {
    title: 'User Experience. Human-centered Design',
    category: 'design',
    price: 240,
    author: 'Cody Fisher',
    image: img('course-1.jpg'),
  },

  // --- Added to complete the category counts ---------------------------------
  {
    title: 'Digital Marketing Strategy',
    category: 'marketing',
    price: 320,
    author: 'Ralph Edwards',
    image: img('course-6.jpg'),
  },
  {
    title: 'SMM & Content Creation',
    category: 'marketing',
    price: 280,
    author: 'Courtney Henry',
    image: img('course-9.jpg'),
  },
  {
    title: 'Agile Project Management',
    category: 'management',
    price: 450,
    author: 'Theresa Webb',
    image: img('course-4.jpg'),
  },
  {
    title: 'Talent Acquisition Strategy',
    category: 'hr',
    price: 190,
    author: 'Albert Flores',
    image: img('course-2.jpg'),
  },
  {
    title: 'Employee Engagement & Culture',
    category: 'hr',
    price: 210,
    author: 'Jenny Wilson',
    image: img('course-7.jpg'),
  },
  {
    title: 'Modern Recruiting Techniques',
    category: 'hr',
    price: 170,
    author: 'Devon Lane',
    image: img('course-1.jpg'),
  },
  {
    title: 'Frontend Development with JavaScript',
    category: 'development',
    price: 380,
    author: 'Wade Warren',
    image: img('course-3.jpg'),
  },
  {
    title: 'Backend Engineering Essentials',
    category: 'development',
    price: 420,
    author: 'Esther Howard',
    image: img('course-5.jpg'),
  },
];
