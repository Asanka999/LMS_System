// Main JavaScript for ABC Campus LMS

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

// Global variables
let currentUser = null;
let notifications = [];
let courses = [];
let assignments = [];
let quizzes = [];
let grades = [];
let forums = [];
let users = [];

// Initialize the application
function initApp() {
    // Attach event listeners
    attachEventListeners();
   
    // For development purposes - auto login or show login screen
    showLoginScreen();
   
    // Load mock data (in production, this would come from a server)
    loadMockData();
}

// Attach all event listeners
function attachEventListeners() {
    // Login form submission
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);
   
    // Logout link
    document.getElementById('logout-link')?.addEventListener('click', handleLogout);
   
    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });
   
    // User profile dropdown
    document.querySelector('.user-profile')?.addEventListener('click', toggleUserDropdown);
   
    // Notification icon
    document.querySelector('.notification-icon')?.addEventListener('click', toggleNotificationDropdown);
    document.querySelector('.mark-all-read')?.addEventListener('click', markAllNotificationsAsRead);
   
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', closeModals);
    });
   
    // Create buttons
    document.getElementById('create-course-btn')?.addEventListener('click', openCourseModal);
    document.getElementById('create-assignment-btn')?.addEventListener('click', openAssignmentModal);
    document.getElementById('create-quiz-btn')?.addEventListener('click', openQuizModal);
    document.getElementById('create-topic-btn')?.addEventListener('click', openForumTopicModal);
    document.getElementById('create-user-btn')?.addEventListener('click', openUserModal);
   
    // Save buttons
    document.getElementById('save-course-btn')?.addEventListener('click', saveCourse);
    document.getElementById('save-assignment-btn')?.addEventListener('click', saveAssignment);
    document.getElementById('save-quiz-basic-btn')?.addEventListener('click', saveQuizBasicInfo);
    document.getElementById('save-topic-btn')?.addEventListener('click', saveForumTopic);
    document.getElementById('save-user-btn')?.addEventListener('click', saveUser);
   
    // Forum category filter
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', filterForumByCategory);
    });
   
    // Topic category change
    document.getElementById('topic-category')?.addEventListener('change', handleTopicCategoryChange);
   
    // Settings forms
    document.getElementById('profile-settings-form')?.addEventListener('submit', saveProfileSettings);
    document.getElementById('account-settings-form')?.addEventListener('submit', saveAccountSettings);
    document.getElementById('system-settings-form')?.addEventListener('submit', saveSystemSettings);
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
   
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
   
    // Simple validation
    if (!username || !password) {
        showLoginError('Please enter both username and password');
        return;
    }
   
    // Mock authentication - In production, this would be a server request
    if (username === 'admin' && password === 'admin') {
        currentUser = {
            id: 1,
            name: 'Admin User',
            username: 'admin',
            email: 'admin@abccampus.edu',
            role: 'admin',
            status: 'active'
        };
        loginSuccess();
    } else if (username === 'lecturer' && password === 'lecturer') {
        currentUser = {
            id: 2,
            name: 'Jane Smith',
            username: 'lecturer',
            email: 'jsmith@abccampus.edu',
            role: 'lecturer',
            status: 'active'
        };
        loginSuccess();
    } else if (username === 'student' && password === 'student') {
        currentUser = {
            id: 3,
            name: 'John Doe',
            username: 'student',
            email: 'jdoe@abccampus.edu',
            role: 'student',
            status: 'active'
        };
        loginSuccess();
    } else {
        showLoginError('Invalid username or password');
    }
}

function loginSuccess() {
    // Hide login screen
    document.getElementById('login-screen').classList.add('hidden');
   
    // Show app interface
    document.getElementById('app-interface').classList.remove('hidden');
   
    // Set user information
    document.querySelector('.username').textContent = currentUser.name;
   
    // Set up UI based on user role
    setupUIForUserRole();
   
    // Load data based on user
    loadUserData();
   
    // Show a welcome notification
    addNotification({
        id: Date.now(),
        title: 'Welcome back!',
        message: `Welcome back, ${currentUser.name}. You have successfully logged in.`,
        time: new Date(),
        read: false
    });
}

function handleLogout(e) {
    e.preventDefault();
   
    // Reset current user
    currentUser = null;
   
    // Clear all data
    clearAllData();
   
    // Hide app interface
    document.getElementById('app-interface').classList.add('hidden');
   
    // Show login screen
    document.getElementById('login-screen').classList.remove('hidden');
   
    // Clear login form
    document.getElementById('login-form').reset();
    document.getElementById('login-error').textContent = '';
}

function showLoginError(message) {
    const errorElement = document.getElementById('login-error');
    errorElement.textContent = message;
    errorElement.classList.add('visible');
}

function setupUIForUserRole() {
    // Show/hide elements based on user role
    if (currentUser.role === 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
        document.querySelectorAll('.lecturer-only').forEach(el => el.classList.remove('hidden'));
    } else if (currentUser.role === 'lecturer') {
        document.querySelectorAll('.admin-only').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.lecturer-only').forEach(el => el.classList.remove('hidden'));
    } else {
        document.querySelectorAll('.admin-only').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.lecturer-only').forEach(el => el.classList.add('hidden'));
    }
}

// Navigation functions
function handleNavigation(e) {
    const targetPage = e.currentTarget.getAttribute('data-page');
   
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
   
    // Add active class to clicked nav item
    e.currentTarget.classList.add('active');
   
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
   
    // Show the target page
    document.getElementById(`${targetPage}-page`).classList.add('active');
}

// Dropdown toggle functions
function toggleUserDropdown(e) {
    // Prevent bubbling to document click
    e.stopPropagation();
   
    const dropdown = document.querySelector('.user-dropdown');
    dropdown.classList.toggle('visible');
   
    // Hide notification dropdown if open
    document.querySelector('.notification-dropdown').classList.remove('visible');
}

function toggleNotificationDropdown(e) {
    // Prevent bubbling to document click
    e.stopPropagation();
   
    const dropdown = document.querySelector('.notification-dropdown');
    dropdown.classList.toggle('visible');
   
    // Hide user dropdown if open
    document.querySelector('.user-dropdown').classList.remove('visible');
}

// Close dropdowns when clicking elsewhere
document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-profile') && !e.target.closest('.notification-icon')) {
        document.querySelector('.user-dropdown')?.classList.remove('visible');
        document.querySelector('.notification-dropdown')?.classList.remove('visible');
    }
});

// Notification functions
function addNotification(notification) {
    notifications.unshift(notification);
    updateNotificationCounter();
    updateNotificationList();
}

function updateNotificationCounter() {
    const unreadCount = notifications.filter(notification => !notification.read).length;
    const counterElement = document.querySelector('.notification-count');
   
    counterElement.textContent = unreadCount;
    if (unreadCount > 0) {
        counterElement.classList.add('visible');
    } else {
        counterElement.classList.remove('visible');
    }
}

function updateNotificationList() {
    const listElement = document.querySelector('.notification-list');
    listElement.innerHTML = '';
   
    if (notifications.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'empty-notification';
        emptyItem.textContent = 'No notifications';
        listElement.appendChild(emptyItem);
        return;
    }
   
    notifications.forEach(notification => {
        const item = document.createElement('li');
        item.className = notification.read ? 'notification-item read' : 'notification-item unread';
        item.setAttribute('data-id', notification.id);
       
        const timeString = formatNotificationTime(notification.time);
       
        item.innerHTML = `
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <span class="notification-time">${timeString}</span>
            </div>
            <div class="notification-actions">
                <button class="mark-read-btn" title="Mark as read">
                    <i class="fa-solid fa-check"></i>
                </button>
                <button class="delete-notification-btn" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
       
        // Add event listeners to the buttons
        item.querySelector('.mark-read-btn').addEventListener('click', () => markNotificationAsRead(notification.id));
        item.querySelector('.delete-notification-btn').addEventListener('click', () => deleteNotification(notification.id));
       
        // Add click event to mark as read when clicked
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-actions')) {
                markNotificationAsRead(notification.id);
            }
        });
       
        listElement.appendChild(item);
    });
}

function formatNotificationTime(time) {
    const now = new Date();
    const diff = now - new Date(time);
   
    // Less than a minute
    if (diff < 60000) {
        return 'Just now';
    }
    // Less than an hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    // Less than a day
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    // Less than a week
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
   
    // More than a week
    const date = new Date(time);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function markNotificationAsRead(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        updateNotificationCounter();
        updateNotificationList();
    }
}

function markAllNotificationsAsRead() {
    notifications.forEach(notification => {
        notification.read = true;
    });
    updateNotificationCounter();
    updateNotificationList();
}

function deleteNotification(id) {
    notifications = notifications.filter(notification => notification.id !== id);
    updateNotificationCounter();
    updateNotificationList();
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('visible');
   
    // Prevent scrolling on the body
    document.body.classList.add('modal-open');
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('visible');
    });
   
    // Allow scrolling on the body
    document.body.classList.remove('modal-open');
   
    // Reset forms
    document.querySelectorAll('.modal form').forEach(form => {
        form.reset();
    });
}

// Course functions
function openCourseModal() {
    // Reset the modal title and button text
    document.querySelector('#course-modal .modal-header h3').textContent = 'Create New Course';
    document.getElementById('save-course-btn').textContent = 'Create Course';
   
    openModal('course-modal');
}

function saveCourse() {
    const form = document.getElementById('course-form');
   
    // Simple validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
   
    // Get form values
    const courseData = {
        id: Date.now(),
        title: document.getElementById('course-title').value,
        code: document.getElementById('course-code').value,
        description: document.getElementById('course-description').value,
        startDate: document.getElementById('course-start-date').value,
        endDate: document.getElementById('course-end-date').value,
        thumbnail: 'https://api.placeholder.com/350/250',  // Mock image URL
        lecturer: currentUser.name,
        enrolledStudents: 0,
        createdAt: new Date()
    };
   
    // Add the course to the list
    courses.push(courseData);
   
    // Update the courses list in UI
    updateCoursesList();
   
    // Close the modal
    closeModals();
   
    // Show success notification
    addNotification({
        id: Date.now(),
        title: 'Course Created',
        message: `Course "${courseData.title}" has been created successfully.`,
        time: new Date(),
        read: false
    });
}

function updateCoursesList() {
    const coursesContainer = document.querySelector('.courses-grid');
    coursesContainer.innerHTML = '';
   
    if (courses.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No courses available.';
        coursesContainer.appendChild(emptyMessage);
        return;
    }
   
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.setAttribute('data-id', course.id);
       
        courseCard.innerHTML = `
            <div class="course-thumbnail">
                <img src="${course.thumbnail}" alt="${course.title}">
            </div>
            <div class="course-details">
                <h3>${course.title}</h3>
                <p class="course-code">${course.code}</p>
                <p class="course-description">${course.description.substring(0, 100)}${course.description.length > 100 ? '...' : ''}</p>
                <div class="course-meta">
                    <span class="course-lecturer"><i class="fa-solid fa-user"></i> ${course.lecturer}</span>
                    <span class="course-students"><i class="fa-solid fa-users"></i> ${course.enrolledStudents} students</span>
                </div>
                <div class="course-dates">
                    <span class="course-start-date">Start: ${formatDate(course.startDate)}</span>
                    <span class="course-end-date">End: ${formatDate(course.endDate)}</span>
                </div>
            </div>
            <div class="course-actions">
                <button class="btn btn-primary course-enroll-btn">Enroll</button>
                ${currentUser.role === 'student' ? '' : `
                <button class="btn btn-secondary course-edit-btn"><i class="fa-solid fa-edit"></i></button>
                <button class="btn btn-danger course-delete-btn"><i class="fa-solid fa-trash"></i></button>
                `}
            </div>
        `;
       
        // Add event listeners
        courseCard.querySelector('.course-enroll-btn').addEventListener('click', () => enrollInCourse(course.id));
        if (currentUser.role !== 'student') {
            courseCard.querySelector('.course-edit-btn').addEventListener('click', () => editCourse(course.id));
            courseCard.querySelector('.course-delete-btn').addEventListener('click', () => deleteCourse(course.id));
        }
       
        coursesContainer.appendChild(courseCard);
    });
}

function enrollInCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (course) {
        // In a real application, this would check if the user is already enrolled
        course.enrolledStudents++;
        updateCoursesList();
       
        // Show success notification
        addNotification({
            id: Date.now(),
            title: 'Course Enrollment',
            message: `You have successfully enrolled in "${course.title}".`,
            time: new Date(),
            read: false
        });
    }
}

function editCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (course) {
        // Update modal title and button
        document.querySelector('#course-modal .modal-header h3').textContent = 'Edit Course';
        document.getElementById('save-course-btn').textContent = 'Update Course';
       
        // Fill form with course data
        document.getElementById('course-title').value = course.title;
        document.getElementById('course-code').value = course.code;
        document.getElementById('course-description').value = course.description;
        document.getElementById('course-start-date').value = course.startDate;
        document.getElementById('course-end-date').value = course.endDate;
       
        // Store the course ID in the form for reference
        document.getElementById('course-form').setAttribute('data-course-id', courseId);
       
        // Open the modal
        openModal('course-modal');
    }
}

function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
        const courseIndex = courses.findIndex(c => c.id === courseId);
        if (courseIndex !== -1) {
            const course = courses[courseIndex];
            courses.splice(courseIndex, 1);
            updateCoursesList();
           
            // Show notification
            addNotification({
                id: Date.now(),
                title: 'Course Deleted',
                message: `Course "${course.title}" has been deleted.`,
                time: new Date(),
                read: false
            });
        }
    }
}

// Assignment functions
function openAssignmentModal() {
    // Reset the modal title and button text
    document.querySelector('#assignment-modal .modal-header h3').textContent = 'Create New Assignment';
    document.getElementById('save-assignment-btn').textContent = 'Create Assignment';
   
    // Populate course dropdown
    populateCourseDropdown('assignment-course');
   
    openModal('assignment-modal');
}

function populateCourseDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '';
   
    if (courses.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No courses available';
        option.disabled = true;
        dropdown.appendChild(option);
        return;
    }
   
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = `${course.code} - ${course.title}`;
        dropdown.appendChild(option);
    });
}

function saveAssignment() {
    const form = document.getElementById('assignment-form');
   
    // Simple validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
   
    // Get form values
    const assignmentData = {
        id: Date.now(),
        title: document.getElementById('assignment-title').value,
        courseId: document.getElementById('assignment-course').value,
        courseName: document.getElementById('assignment-course').options[document.getElementById('assignment-course').selectedIndex].textContent,
        description: document.getElementById('assignment-description').value,
        dueDate: document.getElementById('assignment-due-date').value,
        points: document.getElementById('assignment-points').value,
        attachment: null,  // In a real app, this would be a file upload
        createdBy: currentUser.name,
        createdAt: new Date(),
        status: 'pending'  // pending, submitted, graded
    };
   
    // Add the assignment to the list
    assignments.push(assignmentData);
   
    // Update the assignments list in UI
    updateAssignmentsList();
   
    // Close the modal
    closeModals();
   
    // Show success notification
    addNotification({
        id: Date.now(),
        title: 'Assignment Created',
        message: `Assignment "${assignmentData.title}" has been created successfully.`,
        time: new Date(),
        read: false
    });
}

function updateAssignmentsList() {
    const assignmentsContainer = document.querySelector('.assignments-list');
    assignmentsContainer.innerHTML = '';
   
    if (assignments.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No assignments available.';
        assignmentsContainer.appendChild(emptyMessage);
        return;
    }
   
    assignments.forEach(assignment => {
        const assignmentCard = document.createElement('div');
        assignmentCard.className = `assignment-card ${assignment.status}`;
        assignmentCard.setAttribute('data-id', assignment.id);
       
        // Format due date
        const dueDate = new Date(assignment.dueDate);
        const formattedDueDate = dueDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
       
        // Check if assignment is overdue
        const isOverdue = new Date() > dueDate && assignment.status === 'pending';
       
        assignmentCard.innerHTML = `
            <div class="assignment-header">
                <h3>${assignment.title}</h3>
                <span class="assignment-course">${assignment.courseName}</span>
            </div>
            <div class="assignment-details">
                <p class="assignment-description">${assignment.description.substring(0, 100)}${assignment.description.length > 100 ? '...' : ''}</p>
                <div class="assignment-meta">
                    <span class="assignment-points"><i class="fa-solid fa-star"></i> ${assignment.points} points</span>
                    <span class="assignment-due-date ${isOverdue ? 'overdue' : ''}">
                        <i class="fa-solid fa-calendar"></i> Due: ${formattedDueDate}
                        ${isOverdue ? ' (Overdue)' : ''}
                    </span>
                </div>
            </div>
            <div class="assignment-status">
                <span class="status-badge ${assignment.status}">
                    ${assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </span>
            </div>
            <div class="assignment-actions">
                ${currentUser.role === 'student' ? `
                    <button class="btn btn-primary assignment-submit-btn">Submit</button>
                ` : `
                    <button class="btn btn-secondary assignment-edit-btn"><i class="fa-solid fa-edit"></i></button>
                    <button class="btn btn-danger assignment-delete-btn"><i class="fa-solid fa-trash"></i></button>
                `}
            </div>
        `;
       
        // Add event listeners
        if (currentUser.role === 'student') {
            assignmentCard.querySelector('.assignment-submit-btn').addEventListener('click', () => submitAssignment(assignment.id));
        } else {
            assignmentCard.querySelector('.assignment-edit-btn').addEventListener('click', () => editAssignment(assignment.id));
            assignmentCard.querySelector('.assignment-delete-btn').addEventListener('click', () => deleteAssignment(assignment.id));
        }
       
        assignmentsContainer.appendChild(assignmentCard);
    });
}

function submitAssignment(assignmentId) {
    // In a real app, this would open a submit assignment modal
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
        assignment.status = 'submitted';
        updateAssignmentsList();
       
        // Show success notification
        addNotification({
            id: Date.now(),
            title: 'Assignment Submitted',
            message: `You have successfully submitted "${assignment.title}".`,
            time: new Date(),
            read: false
        });
    }
}

function editAssignment(assignmentId) {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
        // Update modal title and button
        document.querySelector('#assignment-modal .modal-header h3').textContent = 'Edit Assignment';
        document.getElementById('save-assignment-btn').textContent = 'Update Assignment';
       
        // Fill form with assignment data
        document.getElementById('assignment-title').value = assignment.title;
        document.getElementById('assignment-course').value = assignment.courseId;
        document.getElementById('assignment-description').value = assignment.description;
        document.getElementById('assignment-due-date').value = assignment.dueDate;
        document.getElementById('assignment-points').value = assignment.points;
       
        // Store the assignment ID in the form for reference
        document.getElementById('assignment-form').setAttribute('data-assignment-id', assignmentId);
       
        // Open the modal
        openModal('assignment-modal');
    }
}

function deleteAssignment(assignmentId) {
    if (confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
        const assignmentIndex = assignments.findIndex(a => a.id === assignmentId);
        if (assignmentIndex !== -1) {
            const assignment = assignments[assignmentIndex];
            assignments.splice(assignmentIndex, 1);
            updateAssignmentsList();
           
            // Show notification
            addNotification({
                id: Date.now(),
                title: 'Assignment Deleted',
                message: `Assignment "${assignment.title}" has been deleted.`,
                time: new Date(),
                read: false
            });
        }
    }
}

// Quiz functions
function openQuizModal() {
    // Reset the modal title and button text
    document.querySelector('#quiz-modal .modal-header h3').textContent = 'Create New Quiz';
    document.getElementById('save-quiz-basic-btn').textContent = 'Continue to Questions';
   
    // Populate course dropdown
    populateCourseDropdown('quiz-course');
   
    openModal('quiz-modal');
}

function saveQuizBasicInfo() {
    const form = document.getElementById('quiz-form');
   
    // Simple validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
   
    // Get form values
    const quizData = {
        id: Date.now(),
        title: document.getElementById('quiz-title').value,
        courseId: document.getElementById('quiz-course').value,
        courseName: document.getElementById('quiz-course').options[document.getElementById('quiz-course').selectedIndex].textContent,
        description: document.getElementById('quiz-description').value,
        duration: document.getElementById('quiz-duration').value,
        startDate: document.getElementById('quiz-start-date').value,
        endDate: document.getElementById('quiz-end-date').value,
        attempts: document.getElementById('quiz-attempts').value,
        passingScore: document.getElementById('quiz-passing-score').value,
        questions: [],  // In a real app, this would be populated from a question editor
        createdBy: currentUser.name,
        createdAt: new Date(),
        status: 'upcoming'  // upcoming, available, completed
    };
   
    // Add sample questions (for demonstration)
    quizData.questions = [
        {
            id: 1,
            text: 'Sample multiple choice question?',
            type: 'multiple_choice',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 'Option B',
            points: 5
        },
        {
            id: 2,
            text: 'Sample true/false question?',
            type: 'true_false',
            options: ['True', 'False'],
            correctAnswer: 'True',
            points: 3
        }
    ];
   
    // Add the quiz to the list
    quizzes.push(quizData);
   
    // Update the quizzes list in UI
    updateQuizzesList();
   
    // Close the modal
    closeModals();
   
    // Show success notification
    addNotification({
        id: Date.now(),
        title: 'Quiz Created',
        message: `Quiz "${quizData.title}" has been created successfully.`,
        time: new Date(),
        read: false
    });
}

function updateQuizzesList() {
    const quizzesContainer = document.querySelector('.quizzes-list');
    quizzesContainer.innerHTML = '';
   
    if (quizzes.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No quizzes available.';
        quizzesContainer.appendChild(emptyMessage);
        return;
    }
   
    quizzes.forEach(quiz => {
        const quizCard = document.createElement('div');
        quizCard.className = `quiz-card ${quiz.status}`;
        quizCard.setAttribute('data-id', quiz.id);
       
        // Format dates
        const startDate = new Date(quiz.startDate);
        const endDate = new Date(quiz.endDate);
        const formattedStartDate = startDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

const formattedEndDate = endDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
       
        // Check quiz status
        const now = new Date();
        let status = 'upcoming';
        if (now >= startDate && now <= endDate) {
            status = 'available';
        } else if (now > endDate) {
            status = 'completed';
        }
       
        // Update quiz status if changed
        if (quiz.status !== status) {
            quiz.status = status;
        }
       
        quizCard.innerHTML = `
            <div class="quiz-header">
                <h3>${quiz.title}</h3>
                <span class="quiz-course">${quiz.courseName}</span>
            </div>
            <div class="quiz-details">
                <p class="quiz-description">${quiz.description.substring(0, 100)}${quiz.description.length > 100 ? '...' : ''}</p>
                <div class="quiz-meta">
                    <span class="quiz-duration"><i class="fa-solid fa-clock"></i> ${quiz.duration} minutes</span>
                    <span class="quiz-questions"><i class="fa-solid fa-question-circle"></i> ${quiz.questions.length} questions</span>
                    <span class="quiz-attempts"><i class="fa-solid fa-redo"></i> ${quiz.attempts} ${quiz.attempts === 1 ? 'attempt' : 'attempts'}</span>
                </div>
                <div class="quiz-dates">
                    <span class="quiz-start-date">Available from: ${formattedStartDate}</span>
                    <span class="quiz-end-date">Available until: ${formattedEndDate}</span>
                </div>
            </div>
            <div class="quiz-status">
                <span class="status-badge ${quiz.status}">
                    ${quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                </span>
            </div>
            <div class="quiz-actions">
                ${quiz.status === 'available' && currentUser.role === 'student' ? `
                    <button class="btn btn-primary quiz-take-btn">Take Quiz</button>
                ` : ''}
                ${currentUser.role !== 'student' ? `
                    <button class="btn btn-secondary quiz-edit-btn"><i class="fa-solid fa-edit"></i></button>
                    <button class="btn btn-danger quiz-delete-btn"><i class="fa-solid fa-trash"></i></button>
                ` : ''}
            </div>
        `;
       
        // Add event listeners
        if (quiz.status === 'available' && currentUser.role === 'student') {
            quizCard.querySelector('.quiz-take-btn').addEventListener('click', () => takeQuiz(quiz.id));
        }
        if (currentUser.role !== 'student') {
            quizCard.querySelector('.quiz-edit-btn').addEventListener('click', () => editQuiz(quiz.id));
            quizCard.querySelector('.quiz-delete-btn').addEventListener('click', () => deleteQuiz(quiz.id));
        }
       
        quizzesContainer.appendChild(quizCard);
    });
}

function takeQuiz(quizId) {
    // In a real app, this would open the quiz interface
    alert('Quiz interface would open here. This feature is not implemented in this demo.');
}

function editQuiz(quizId) {
    const quiz = quizzes.find(q => q.id === quizId);
    if (quiz) {
        // Update modal title and button
        document.querySelector('#quiz-modal .modal-header h3').textContent = 'Edit Quiz';
        document.getElementById('save-quiz-basic-btn').textContent = 'Update Quiz';
       
        // Fill form with quiz data
        document.getElementById('quiz-title').value = quiz.title;
        document.getElementById('quiz-course').value = quiz.courseId;
        document.getElementById('quiz-description').value = quiz.description;
        document.getElementById('quiz-duration').value = quiz.duration;
        document.getElementById('quiz-start-date').value = quiz.startDate;
        document.getElementById('quiz-end-date').value = quiz.endDate;
        document.getElementById('quiz-attempts').value = quiz.attempts;
        document.getElementById('quiz-passing-score').value = quiz.passingScore;
       
        // Store the quiz ID in the form for reference
        document.getElementById('quiz-form').setAttribute('data-quiz-id', quizId);
       
        // Open the modal
        openModal('quiz-modal');
    }
}

function deleteQuiz(quizId) {
    if (confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
        const quizIndex = quizzes.findIndex(q => q.id === quizId);
        if (quizIndex !== -1) {
            const quiz = quizzes[quizIndex];
            quizzes.splice(quizIndex, 1);
            updateQuizzesList();
           
            // Show notification
            addNotification({
                id: Date.now(),
                title: 'Quiz Deleted',
                message: `Quiz "${quiz.title}" has been deleted.`,
                time: new Date(),
                read: false
            });
        }
    }
}

// Forum functions
function openForumTopicModal() {
    // Reset the modal title and button text
    document.querySelector('#forum-topic-modal .modal-header h3').textContent = 'Create New Topic';
    document.getElementById('save-topic-btn').textContent = 'Create Topic';
   
    // Hide the course dropdown by default
    document.querySelector('.course-specific-only').classList.add('hidden');
   
    // Populate course dropdown for course-specific topics
    populateCourseDropdown('topic-course');
   
    openModal('forum-topic-modal');
}

function handleTopicCategoryChange() {
    const category = document.getElementById('topic-category').value;
    const courseField = document.querySelector('.course-specific-only');
   
    if (category === 'course-specific') {
        courseField.classList.remove('hidden');
    } else {
        courseField.classList.add('hidden');
    }
}

function saveForumTopic() {
    const form = document.getElementById('forum-topic-form');
   
    // Simple validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
   
    // Get form values
    const category = document.getElementById('topic-category').value;
    const topicData = {
        id: Date.now(),
        title: document.getElementById('topic-title').value,
        category: category,
        courseId: category === 'course-specific' ? document.getElementById('topic-course').value : null,
        courseName: category === 'course-specific' ? document.getElementById('topic-course').options[document.getElementById('topic-course').selectedIndex].textContent : null,
        content: document.getElementById('topic-content').value,
        author: currentUser.name,
        authorRole: currentUser.role,
        createdAt: new Date(),
        replies: [],
        views: 0,
        pinned: currentUser.role !== 'student' && document.getElementById('topic-category').value === 'announcements'
    };
   
    // Add the topic to the list
    forums.push(topicData);
   
    // Update the forum topics list in UI
    updateForumTopicsList();
   
    // Close the modal
    closeModals();
   
    // Show success notification
    addNotification({
        id: Date.now(),
        title: 'Topic Created',
        message: `Topic "${topicData.title}" has been created successfully.`,
        time: new Date(),
        read: false
    });
}

function updateForumTopicsList() {
    const topicsContainer = document.querySelector('.forum-topics');
    topicsContainer.innerHTML = '';
   
    // Get the active category
    const activeCategory = document.querySelector('.category-item.active').getAttribute('data-category');
   
    // Filter topics by category
    let filteredTopics = forums;
    if (activeCategory !== 'all') {
        filteredTopics = forums.filter(topic => topic.category === activeCategory);
    }
   
    // Sort topics: pinned first, then by date
    filteredTopics.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
   
    if (filteredTopics.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No topics available in this category.';
        topicsContainer.appendChild(emptyMessage);
        return;
    }
   
    filteredTopics.forEach(topic => {
        const topicCard = document.createElement('div');
        topicCard.className = `topic-card ${topic.pinned ? 'pinned' : ''}`;
        topicCard.setAttribute('data-id', topic.id);
       
        // Format date
        const topicDate = new Date(topic.createdAt);
        const formattedDate = topicDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
       
        topicCard.innerHTML = `
            <div class="topic-header">
                <h3>
                    ${topic.pinned ? '<i class="fa-solid fa-thumbtack"></i> ' : ''}
                    ${topic.title}
                </h3>
                ${topic.category === 'course-specific' ? `<span class="topic-course">${topic.courseName}</span>` : ''}
            </div>
            <div class="topic-details">
                <p class="topic-preview">${topic.content.substring(0, 150)}${topic.content.length > 150 ? '...' : ''}</p>
                <div class="topic-meta">
                    <span class="topic-author">
                        <i class="fa-solid fa-user"></i> ${topic.author}
                        <span class="author-role">(${topic.authorRole})</span>
                    </span>
                    <span class="topic-date"><i class="fa-solid fa-calendar"></i> ${formattedDate}</span>
                    <span class="topic-replies"><i class="fa-solid fa-comment"></i> ${topic.replies.length} replies</span>
                    <span class="topic-views"><i class="fa-solid fa-eye"></i> ${topic.views} views</span>
                </div>
            </div>
            <div class="topic-category-tag">
                <span class="category-badge ${topic.category}">
                    ${topic.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
            </div>
        `;
       
        // Add click event to view topic
        topicCard.addEventListener('click', () => viewTopic(topic.id));
       
        topicsContainer.appendChild(topicCard);
    });
}

function filterForumByCategory(e) {
    // Remove active class from all category items
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });
   
    // Add active class to clicked category item
    e.currentTarget.classList.add('active');
   
    // Update the topics list
    updateForumTopicsList();
}

function viewTopic(topicId) {
    const topic = forums.find(t => t.id === topicId);
    if (topic) {
        // In a real app, this would navigate to a topic view page
        alert(`Topic view for "${topic.title}" would open here. This feature is not implemented in this demo.`);
       
        // Increment view count
        topic.views++;
        updateForumTopicsList();
    }
}

// User management functions
function openUserModal() {
    // Reset the modal title and button text
    document.querySelector('#user-modal .modal-header h3').textContent = 'Create New User';
    document.getElementById('save-user-btn').textContent = 'Create User';
   
    openModal('user-modal');
}

function saveUser() {
    const form = document.getElementById('user-form');
   
    // Simple validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
   
    // Get form values
    const userData = {
        id: Date.now(),
        name: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value,
        username: document.getElementById('user-username').value,
        role: document.getElementById('user-role').value,
        status: document.getElementById('user-status').value,
        createdAt: new Date()
    };
   
    // Add the user to the list
    users.push(userData);
   
    // Update the users table in UI
    updateUsersList();
   
    // Close the modal
    closeModals();
   
    // Show success notification
    addNotification({
        id: Date.now(),
        title: 'User Created',
        message: `User "${userData.name}" has been created successfully.`,
        time: new Date(),
        read: false
    });
}

function updateUsersList() {
    const usersTableBody = document.querySelector('.users-table tbody');
    usersTableBody.innerHTML = '';
   
    if (users.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 6;
        cell.textContent = 'No users available.';
        cell.className = 'empty-message';
        row.appendChild(cell);
        usersTableBody.appendChild(row);
        return;
    }
   
    users.forEach(user => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', user.id);
       
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <span class="role-badge ${user.role}">
                    ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
            </td>
            <td>
                <span class="status-badge ${user.status}">
                    ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
            </td>
            <td class="table-actions">
                <button class="btn btn-sm btn-secondary user-edit-btn"><i class="fa-solid fa-edit"></i></button>
                <button class="btn btn-sm btn-danger user-delete-btn"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
       
        // Add event listeners
        row.querySelector('.user-edit-btn').addEventListener('click', () => editUser(user.id));
        row.querySelector('.user-delete-btn').addEventListener('click', () => deleteUser(user.id));
       
        usersTableBody.appendChild(row);
    });
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        // Update modal title and button
        document.querySelector('#user-modal .modal-header h3').textContent = 'Edit User';
        document.getElementById('save-user-btn').textContent = 'Update User';
       
        // Fill form with user data
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-username').value = user.username;
        document.getElementById('user-role').value = user.role;
        document.getElementById('user-status').value = user.status;
       
        // Store the user ID in the form for reference
        document.getElementById('user-form').setAttribute('data-user-id', userId);
       
        // Open the modal
        openModal('user-modal');
    }
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            const user = users[userIndex];
            users.splice(userIndex, 1);
            updateUsersList();
           
            // Show notification
            addNotification({
                id: Date.now(),
                title: 'User Deleted',
                message: `User "${user.name}" has been deleted.`,
                time: new Date(),
                read: false
            });
        }
    }
}

// Settings functions
function saveProfileSettings(e) {
    e.preventDefault();
   
    // In a real app, this would update user profile settings
   
    // Show success notification
    addNotification({
        id: Date.now(),
        title: 'Profile Updated',
        message: 'Your profile settings have been updated successfully.',
        time: new Date(),
        read: false
    });
}

function saveAccountSettings(e) {
    e.preventDefault();
   
    // In a real app, this would update user account settings
   
    // Show success notification
    addNotification({
        id: Date.now(),
        title: 'Account Updated',
        message: 'Your account settings have been updated successfully.',
        time: new Date(),
        read: false
    });
}

function saveSystemSettings(e) {
    e.preventDefault();
   
    // In a real app, this would update system settings
   
    // Show success notification
    addNotification({
        id: Date.now(),
        title: 'System Settings Updated',
        message: 'System settings have been updated successfully.',
        time: new Date(),
        read: false
    });
}

// Helper functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function clearAllData() {
    notifications = [];
    courses = [];
    assignments = [];
    quizzes = [];
    grades = [];
    forums = [];
}

// Load user data based on role
function loadUserData() {
    // This function would typically load data from a server
    // For this demo, we'll use mock data
    loadMockData();
   
    // Update UI with loaded data
    updateCoursesList();
    updateAssignmentsList();
    updateQuizzesList();
    updateForumTopicsList();
   
    if (currentUser.role === 'admin') {
        updateUsersList();
    }
}

// Load mock data for demonstration
function loadMockData() {
    // Mock courses
    courses = [
        {
            id: 1,
            title: 'Introduction to Computer Science',
            code: 'CS101',
            description: 'This course provides an introduction to the fundamental concepts of computer science.',
            startDate: '2025-01-15',
            endDate: '2025-05-30',
            thumbnail: 'https://api.placeholder.com/350/250',
            lecturer: 'Dr. Jane Smith',
            enrolledStudents: 45,
            createdAt: new Date('2025-01-01')
        },
        {
            id: 2,
            title: 'Calculus I',
            code: 'MATH102',
            description: 'An introduction to differential and integral calculus.',
            startDate: '2025-01-15',
            endDate: '2025-05-30',
            thumbnail: 'https://api.placeholder.com/350/250',
            lecturer: 'Dr. Robert Johnson',
            enrolledStudents: 38,
            createdAt: new Date('2025-01-02')
        },
        {
            id: 3,
            title: 'English Literature',
            code: 'ENG201',
            description: 'Survey of major works of British and American literature.',
            startDate: '2025-01-15',
            endDate: '2025-05-30',
            thumbnail: 'https://api.placeholder.com/350/250',
            lecturer: 'Prof. Sarah Williams',
            enrolledStudents: 22,
            createdAt: new Date('2025-01-03')
        }
    ];
   
    // Mock assignments
    assignments = [
        {
            id: 1,
            title: 'Programming Assignment 1',
            courseId: 1,
            courseName: 'CS101 - Introduction to Computer Science',
            description: 'Create a simple calculator program using Python.',
            dueDate: '2025-02-28T23:59:59',
            points: 20,
            attachment: null,
            createdBy: 'Dr. Jane Smith',
            createdAt: new Date('2025-01-20'),
            status: 'pending'
        },
        {
            id: 2,
            title: 'Essay on Shakespeare',
            courseId: 3,
            courseName: 'ENG201 - English Literature',
            description: 'Write a 1000-word essay analyzing a theme in one of Shakespeare\'s plays.',
            dueDate: '2025-03-15T23:59:59',
            points: 30,
            attachment: null,
            createdBy: 'Prof. Sarah Williams',
            createdAt: new Date('2025-01-25'),
            status: 'pending'
        }
    ];
   
    // Mock quizzes
    quizzes = [
        {
            id: 1,
            title: 'CS101 Midterm Quiz',
            courseId: 1,
            courseName: 'CS101 - Introduction to Computer Science',
            description: 'Midterm quiz covering chapters 1-5.',
            duration: 60,
            startDate: '2025-03-10T09:00:00',
            endDate: '2025-03-10T23:59:59',
            attempts: 1,
            passingScore: 70,
            questions: [
                {
                    id: 1,
                    text: 'What is the time complexity of binary search?',
                    type: 'multiple_choice',
                    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
                    correctAnswer: 'O(log n)',
                    points: 5
                },
                {
                    id: 2,
                    text: 'Python is a compiled language.',
                    type: 'true_false',
                    options: ['True', 'False'],
                    correctAnswer: 'False',
                    points: 3
                }
            ],
            createdBy: 'Dr. Jane Smith',
            createdAt: new Date('2025-02-15'),
            status: 'upcoming'
        },
        {
            id: 2,
            title: 'Calculus Quiz 1',
            courseId: 2,
            courseName: 'MATH102 - Calculus I',
            description: 'Quiz on limits and derivatives.',
            duration: 45,
            startDate: '2025-02-20T09:00:00',
            endDate: '2025-02-20T23:59:59',
            attempts: 2,
            passingScore: 60,
            questions: [
                {
                    id: 1,
                    text: 'Find the derivative of f(x) = x^2 + 3x + 2.',
                    type: 'multiple_choice',
                    options: ['f\'(x) = 2x + 3', 'f\'(x) = x^2 + 3', 'f\'(x) = 2x', 'f\'(x) = 3'],
                    correctAnswer: 'f\'(x) = 2x + 3',
                    points: 5
                }
            ],
            createdBy: 'Dr. Robert Johnson',
            createdAt: new Date('2025-02-01'),
            status: 'upcoming'
        }
    ];
   
    // Mock forum topics
    forums = [
        {
            id: 1,
            title: 'Welcome to the Spring Semester!',
            category: 'announcements',
            courseId: null,
            courseName: null,
            content: 'Welcome to the Spring 2025 semester! This is going to be an exciting semester with many new courses and activities planned.',
            author: 'Admin User',
            authorRole: 'admin',
            createdAt: new Date('2025-01-10'),
            replies: [],
            views: 78,
            pinned: true
        },
        {
            id: 2,
            title: 'Questions about Assignment 1',
            category: 'course-specific',
            courseId: 1,
            courseName: 'CS101 - Introduction to Computer Science',
            content: 'I\'m having trouble understanding the requirements for the calculator program. Could someone clarify what functions we need to implement?',
            author: 'John Doe',
            authorRole: 'student',
            createdAt: new Date('2025-01-22'),
            replies: [
                {
                    id: 1,
                    content: 'You need to implement basic arithmetic operations: addition, subtraction, multiplication, and division. Let me know if you need further assistance.',
                    author: 'Dr. Jane Smith',
                    authorRole: 'lecturer',
                    createdAt: new Date('2025-01-22T14:35:00')
                }
            ],
            views: 12,
            pinned: false
        },
        {
            id: 3,
            title: 'Study group for Calculus',
            category: 'general',
            courseId: null,
            courseName: null,
            content: 'Would anyone be interested in forming a study group for Calculus I? We could meet in the library twice a week.',
            author: 'Emma Wilson',
            authorRole: 'student',
            createdAt: new Date('2025-01-18'),
            replies: [],
            views: 8,
            pinned: false
        }
    ];
   
    // Mock users (admin only)
    if (currentUser.role === 'admin') {
        users = [
            {
                id: 1,
                name: 'Admin User',
                email: 'admin@abccampus.edu',
                username: 'admin',
                role: 'admin',
                status: 'active',
                createdAt: new Date('2024-12-01')
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'jsmith@abccampus.edu',
                username: 'lecturer',
                role: 'lecturer',
                status: 'active',
                createdAt: new Date('2024-12-05')
            },
            {
                id: 3,
                name: 'John Doe',
                email: 'jdoe@abccampus.edu',
                username: 'student',
                role: 'student',
                status: 'active',
                createdAt: new Date('2024-12-10')
            },
            {
                id: 4,
                name: 'Robert Johnson',
                email: 'rjohnson@abccampus.edu',
                username: 'rjohnson',
                role: 'lecturer',
                status: 'active',
                createdAt: new Date('2024-12-05')
            },
            {
                id: 5,
                name: 'Emma Wilson',
                email: 'ewilson@abccampus.edu',
                username: 'ewilson',
                role: 'student',
                status: 'active',
                createdAt: new Date('2024-12-15')
            }
        ];
    }
   
    // Mock notifications
    notifications = [
        {
            id: 1,
            title: 'New Assignment',
            message: 'A new assignment "Programming Assignment 1" has been posted in CS101.',
            time: new Date('2025-01-20T10:30:00'),
            read: false
        },
        {
            id: 2,
            title: 'Forum Reply',
            message: 'Dr. Jane Smith replied to your forum topic "Questions about Assignment 1".',
            time: new Date('2025-01-22T14:35:00'),
            read: true
        }
    ];
}

// Show the login screen
function showLoginScreen() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app-interface').classList.add('hidden');
}

// Event to close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModals();
    }
});

// Initialize the app when the DOM is loaded (this call is already at the top of the file)