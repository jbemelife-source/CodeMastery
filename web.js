// Data & State
let courses = [
    { id: 1, title: 'Complete Python Bootcamp', lang: 'Python', price: 29, oldPrice: 79, rating: 4.9, videos: 20, curriculum: ['Variables & Data Types', 'Functions & Loops', 'OOP & Projects'], bestseller: true },
    { id: 2, title: 'PHP & MySQL Masterclass', lang: 'PHP', price: 39, oldPrice: 99, rating: 4.7, videos: 15, curriculum: ['PHP Basics', 'MySQL Database', 'User Authentication'], bestseller: false },
    { id: 3, title: 'Modern JavaScript ES6+', lang: 'JavaScript', price: 49, oldPrice: 129, rating: 4.8, videos: 25, curriculum: ['ES6 Features', 'Async/Await', 'React Projects'], bestseller: true }
];
let cart = [];
let user = null;
let currentCourse = null;

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderCourses();
    loadState();
    updateCartBadge();
    checkAuth();
});

// Navigation
function showSection(section) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(section).classList.remove('hidden');
    if (section === 'dashboard') renderDashboard();
}

// Courses
function renderCourses(filtered = courses) {
    const grid = document.getElementById('courseGrid');
    grid.innerHTML = filtered.map(course => `
        <div class="course-card bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer" onclick="openCourseModal(${course.id})">
          <div class="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <i class="fas fa-play-circle text-5xl text-white/80"></i>
            <div class="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">${course.videos} Videos + PDFs</div>
            ${course.bestseller ? '<div class="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">Bestseller</div>' : ''}
          </div>
          <div class="p-6">
            <h3 class="font-bold text-xl mb-2">${course.title}</h3>
            <p class="text-gray-600 mb-4">${course.lang} • Beginner to Pro</p>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-1 text-yellow-400">
                ${'<i class="fas fa-star"></i>'.repeat(5)}
                <span class="text-gray-600 ml-1">${course.rating} (${Math.floor(Math.random() * 1000) + 200} ratings)</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-2xl font-bold text-purple-600">$${course.price}</span>
                <span class="text-lg text-gray-400 line-through ml-2">$${course.oldPrice}</span>
              </div>
              <button class="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 font-semibold" onclick="event.stopPropagation(); addToCart(${course.id})">
                <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
              </button>
            </div>
          </div>
        </div>
      `).join('');
}

function filterCourses() {
    const checked = Array.from(document.querySelectorAll('.filter-lang:checked')).map(cb => cb.value);
    const filtered = checked.length ? courses.filter(c => checked.includes(c.lang)) : courses;
    renderCourses(filtered);
}

function filterByLang(lang) {
    document.querySelectorAll('.filter-lang').forEach(cb => cb.checked = false);
    document.querySelector(`.filter-lang[value="${lang}"]`).checked = true;
    filterCourses();
}

// Modals
function openCourseModal(id) {
    currentCourse = courses.find(c => c.id === id);
    document.getElementById('modalTitle').textContent = currentCourse.title;
    document.getElementById('modalRating').textContent = currentCourse.rating + ' (' + (Math.floor(Math.random() * 1000) + 200) + ' ratings)';
    document.getElementById('modalPrice').textContent = '$' + currentCourse.price;
    document.getElementById('modalOldPrice').textContent = '$' + currentCourse.oldPrice;
    document.getElementById('modalVideo').style.background = `linear-gradient(to right, ${currentCourse.lang === 'Python' ? 'from-blue-500 to-purple-600' : currentCourse.lang === 'PHP' ? 'from-green-500 to-blue-600' : 'from-orange-500 to-red-600'})`;

    const curriculum = document.getElementById('modalCurriculum');
    curriculum.innerHTML = currentCourse.curriculum.map(item => `<li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>${item}</li>`).join('');

    document.getElementById('courseModal').classList.remove('hidden');
}

function closeCourseModal() {
    document.getElementById('courseModal').classList.add('hidden');
}

function toggleAuthModal() {
    document.getElementById('authModal').classList.toggle('hidden');
}

function switchAuth(type) {
    document.getElementById('authTitle').textContent = type === 'login' ? 'Login' : 'Sign Up';
    document.getElementById('authSubmit').textContent = type === 'login' ? 'Login' : 'Create Account';
}

// Cart & Checkout
function addToCart(id) {
    const course = courses.find(c => c.id === id);
    if (!cart.find(c => c.id === id)) {
        cart.push(course);
        saveState();
        updateCartBadge();
        alert('Added to cart!');
    }
}

function addToCartModal() {
    addToCart(currentCourse.id);
    closeCourseModal();
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    badge.textContent = cart.length;
    badge.classList.toggle('hidden', cart.length === 0);
}

function showCheckout() {
    if (cart.length === 0) return alert('Cart is empty');
    document.getElementById('checkoutItems').innerHTML = cart.map(course => `
        <div class="flex items-center justify-between py-4 border-b">
          <div>
            <h4 class="font-bold">${course.title}</h4>
            <p class="text-sm text-gray-500">${course.lang}</p>
          </div>
          <div class="text-right">
            <div class="font-bold">$${course.price}</div>
            <button onclick="removeFromCart(${course.id})" class="text-red-500 text-sm">Remove</button>
          </div>
        </div>
      `).join('');

    const total = cart.reduce((sum, c) => sum + c.price, 0);
    document.getElementById('checkoutTotal').textContent = '$' + total;
    document.getElementById('checkoutModal').classList.remove('hidden');
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveState();
    updateCartBadge();
    showCheckout();
}

function completePurchase() {
    if (!user) return alert('Please login first');
    cart.forEach(course => {
        if (!user.courses) user.courses = [];
        if (!user.courses.find(c => c.id === course.id)) user.courses.push(course);
    });
    cart = [];
    saveState();
    updateCartBadge();
    closeCheckout();
    alert('Purchase complete! Check your dashboard.');
    showSection('dashboard');
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.add('hidden');
}

// Auth
document.getElementById('authForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    if (email === 'test@example.com' && password === 'password123') {
        user = { email, courses: [] };
        saveState();
        checkAuth();
        toggleAuthModal();
        alert('Logged in successfully!');
    } else {
        alert('Use demo: test@example.com / password123');
    }
});

function checkAuth() {
    const loginBtn = document.getElementById('loginBtn');
    if (user) {
        loginBtn.textContent = user.email;
        loginBtn.className = 'text-green-600 font-semibold px-6 py-2';
    }
}

// Dashboard
function renderDashboard() {
    const grid = document.getElementById('myCoursesGrid');
    if (!user?.courses?.length) {
        grid.innerHTML = '<div class="col-span-full text-center py-20"><h3 class="text-2xl font-bold mb-4">No courses yet</h3><p>Buy your first course to get started!</p><button onclick="showSection(\'home\')" class="bg-purple-600 text-white px-8 py-3 rounded-xl mt-4">Browse Courses</button></div>';
        return;
    }
    grid.innerHTML = user.courses.map(course => `
        <div class="bg-white rounded-2xl p-6 shadow-lg">
          <div class="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center">
            <i class="fas fa-play-circle text-4xl text-white/80"></i>
          </div>
          <h3 class="font-bold text-xl mb-2">${course.title}</h3>
          <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div class="bg-green-500 h-2 rounded-full" style="width: ${Math.floor(Math.random() * 80) + 20}%"></div>
          </div>
          <div class="flex space-x-4 text-sm mb-4">
            <span>${course.videos} Videos</span>
            <span>PDF Downloads</span>
          </div>
          <div class="flex gap-2">
            <button class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 flex items-center justify-center">
              <i class="fas fa-play mr-2"></i>Continue
            </button>
            <button class="flex-1 bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 flex items-center justify-center">
              <i class="fas fa-download mr-2"></i>PDFs
            </button>
          </div>
        </div>
      `).join('');
}

// Search
function searchCourses() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = courses.filter(c => c.title.toLowerCase().includes(query) || c.lang.toLowerCase().includes(query));
    renderCourses(filtered);
}

// State Management
function saveState() {
    localStorage.setItem('codmastery_user', JSON.stringify(user));
    localStorage.setItem('codmastery_cart', JSON.stringify(cart));
}

function loadState() {
    const savedUser = localStorage.getItem('codmastery_user');
    const savedCart = localStorage.getItem('codmastery_cart');
    if (savedUser) user = JSON.parse(savedUser);
    if (savedCart) cart = JSON.parse(savedCart);
}