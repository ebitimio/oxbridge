// ========================================
// OXBRIDGE LMS - Landing Page with Direct Telegram Integration
// ========================================

// Your Telegram Bot username (without @)
const TELEGRAM_BOT_USERNAME = 'oxbridgeai_bot';

// Check if user is logged in
window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    
    if (isLoggedIn !== 'true') {
        window.location.href = 'indexauthorization.html';
        return;
    }
    
    // Update user greeting
    const userGreeting = document.getElementById('userGreeting');
    if (userName) {
        userGreeting.textContent = `Welcome, ${userName}!`;
    }
    
    // Add logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userCourse');
        localStorage.removeItem('sessionId');
        
        window.location.href = 'indexauthorization.html';
    });
    
    // Update hero section with personalized message
    const heroTitle = document.querySelector('.hero h1');
    const heroSubtitle = document.querySelector('.hero p');
    if (userName) {
        heroTitle.textContent = `Welcome to OXBRIDGE, ${userName}!`;
        heroSubtitle.textContent = `We're excited to help you unlock your potential!`;
    }

    // Initialize AI Study button
    initializeAIStudyButton();

    // Course viewing functionality
    initializeCourseViewer();
});

// ========================================
// AI STUDY BUTTON HANDLER
// ========================================

function initializeAIStudyButton() {
    const studyBtn = document.querySelector('.hero .btn');
    
    studyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const userName = localStorage.getItem('userName');
        
        showCourseSelectionModal(userName);
    });
}

// ========================================
// COURSE SELECTION MODAL
// ========================================

function showCourseSelectionModal(userName) {
    const modal = document.createElement('div');
    modal.className = 'phone-modal';
    modal.innerHTML = `
        <div class="phone-modal-content">
            <div class="phone-modal-header">
                <h2>📚 Start Your AI Study Session</h2>
                <button class="close-phone-modal">&times;</button>
            </div>
            <div class="phone-modal-body">
                <p>What would you like to study today?</p>
                
                <div class="form-group">
                    <label for="course-input">📚 Enter your subject or course</label>
                    <input 
                        type="text" 
                        id="course-input" 
                        placeholder="e.g., Algorithm, Mathematics, Biology" 
                        required
                        autocomplete="off"
                    >
                    <small>💡 Enter the subject you need help with</small>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-primary" id="confirm-course">🚀 Open Telegram</button>
                    <button class="btn-secondary" id="cancel-course">Cancel</button>
                </div>
                <div id="course-error" class="error-message" style="display: none;"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.close-phone-modal');
    const confirmBtn = modal.querySelector('#confirm-course');
    const cancelBtn = modal.querySelector('#cancel-course');
    const courseInput = modal.querySelector('#course-input');
    const errorDiv = modal.querySelector('#course-error');
    
    closeBtn.addEventListener('click', () => modal.remove());
    cancelBtn.addEventListener('click', () => modal.remove());
    
    courseInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            confirmBtn.click();
        }
    });
    
    confirmBtn.addEventListener('click', () => {
        const courseName = courseInput.value.trim();
        
        if (!courseName) {
            errorDiv.textContent = '⚠️ Please enter a subject';
            errorDiv.style.display = 'block';
            return;
        }
        
        localStorage.setItem('userCourse', courseName);
        modal.remove();
        
        // Open Telegram directly
        openTelegramWithMessage(userName, courseName);
    });
    
    setTimeout(() => courseInput.focus(), 100);
}

// ========================================
// OPEN TELEGRAM WITH PRE-FILLED MESSAGE
// ========================================

function openTelegramWithMessage(userName, courseName) {
    const sessionId = generateSessionId();
    
    // Create the greeting message
    const greetingMessage = `Hi! I'm ${userName} and I want help studying ${courseName}. My session ID is ${sessionId}`;
    const encodedMessage = encodeURIComponent(greetingMessage);
    
    // Create Telegram deep link
    const telegramUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}?text=${encodedMessage}`;
    
    // Show confirmation modal
    showTelegramModal(userName, courseName, sessionId, telegramUrl);
}

// ========================================
// TELEGRAM CONFIRMATION MODAL
// ========================================

function showTelegramModal(userName, courseName, sessionId, telegramUrl) {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    
    modal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-modal-header" style="background: linear-gradient(135deg, #0088cc 0%, #005580 100%);">
                <h2>🎉 Ready to Study!</h2>
                <button class="close-success-modal">&times;</button>
            </div>
            <div class="success-modal-body">
                <p>✅ Your AI Study Assistant is ready on Telegram!</p>
                <p>Click the button below to open Telegram:</p>
                <a href="${telegramUrl}" target="_blank" class="btn-telegram">
                    💬 Open Telegram Chat
                </a>
                <div class="modal-info">
                    <strong>Student:</strong> <code>${userName}</code><br>
                    <strong>Subject:</strong> <code>${courseName}</code><br>
                    <strong>Session ID:</strong> <code>${sessionId}</code>
                </div>
                <div class="telegram-instructions">
                    <h4>📱 What happens next:</h4>
                    <ol>
                        <li><strong>Click the button above</strong> - Telegram will open</li>
                        <li><strong>Your greeting message is ready</strong> - just hit send!</li>
                        <li><strong>Start asking questions</strong> - the AI will help you study</li>
                    </ol>
                </div>
                <div style="margin-top: 1rem; padding: 1rem; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
                    <p style="margin: 0; color: #1565c0; font-size: 0.9rem;">
                        <strong>💡 Your message:</strong><br>
                        "Hi! I'm ${userName} and I want help studying ${courseName}. My session ID is ${sessionId}"
                    </p>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" id="close-modal">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.close-success-modal');
    const secondaryBtn = modal.querySelector('#close-modal');
    
    closeBtn.addEventListener('click', () => modal.remove());
    secondaryBtn.addEventListener('click', () => modal.remove());
}

// ========================================
// GENERATE UNIQUE SESSION ID
// ========================================

function generateSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    const sessionId = `OXBRIDGE-${timestamp}-${random}`;
    localStorage.setItem('sessionId', sessionId);
    return sessionId;
}

// ========================================
// COURSE VIEWER SYSTEM
// ========================================

function initializeCourseViewer() {
    const courseButtons = document.querySelectorAll('.course-btn');
    const courseModal = document.getElementById('courseModal');
    const closeModal = document.getElementById('closeModal');
    const modalCourseTitle = document.getElementById('modalCourseTitle');
    const pdfFrame = document.getElementById('pdfFrame');
    const pdfControls = document.getElementById('pdfControls');
    const noPdfMessage = document.getElementById('noPdfMessage');
    const pdfLoading = document.getElementById('pdfLoading');
    const courseResources = document.getElementById('courseResources');
    const resourceList = document.getElementById('resourceList');

    const courseData = {
        'CSC401: Introduction to Algorithm': {
            pdfs: [
                { name: 'Full Course Summary', path: 'pdfs/CSC_401_Full_Course_Summary.pptx.pdf', type: 'Complete Course' },
                { name: 'Week 1 - Introduction to Algorithms', path: 'pdfs/CSC_401_Week_1_Summary.pptx.pdf', type: 'Weekly Material' },
                { name: 'Week 2 - Search Algorithms', path: 'pdfs/CSC_401_Week_2_Summary.pptx.pdf', type: 'Weekly Material' },
                { name: 'Week 3 - Sorting Algorithms', path: 'pdfs/CSC_401_Week_3_Summary.pptx.pdf', type: 'Weekly Material' }
            ],
            resources: []
        },
        'CSC 403: Distributed Computing': {
            pdfs: [
                { name: 'Full Course Summary', path: 'pdfs/CSC_401_Full_Course_Summary.pptx.pdf', type: 'Complete Course' },
                { name: 'Week 1 - Distributed Computing', path: 'pdfs/CSC403 - Week 1 Summary.pptx (1).pdf', type: 'Weekly Material' },
                { name: 'Week 2 - Communication In Distributed Systems', path: 'pdfs/CSC403 - Week 2 Summary.pptx.pdf', type: 'Weekly Material' },
                { name: 'Week 3 - Performance Consideration In Destributed Systems', path: 'pdfs/CSC403 - Week 3 Summary.pptx.pdf', type: 'Weekly Material' }
            ],
            resources: []
        },
        'INS 401: Project Management': {
            pdfs: [
                { name: 'Full Course Summary', path: 'pdfs/CSC_401_Full_Course_Summary.pptx.pdf', type: 'Complete Course' },
                { name: 'Week 1 - Introduction to Algorithms', path: 'pdfs/CSC_401_Week_1_Summary.pptx.pdf', type: 'Weekly Material' },
                { name: 'Week 2 - Search Algorithms', path: 'pdfs/CSC_401_Week_2_Summary.pptx.pdf', type: 'Weekly Material' },
                { name: 'Week 3 - Sorting Algorithms', path: 'pdfs/CSC_401_Week_3_Summary.pptx.pdf', type: 'Weekly Material' }
            ],
            resources: []
        },
        'COS409: Research Methodology and Technical Writing': {
            pdfs: [
                { name: 'Full Course Summary', path: 'pdfs/CSC_401_Full_Course_Summary.pptx.pdf', type: 'Complete Course' },
                { name: 'Week 1 - Introduction to Algorithms', path: 'pdfs/CSC_401_Week_1_Summary.pptx.pdf', type: 'Weekly Material' },
                { name: 'Week 2 - Search Algorithms', path: 'pdfs/CSC_401_Week_2_Summary.pptx.pdf', type: 'Weekly Material' },
                { name: 'Week 3 - Sorting Algorithms', path: 'pdfs/CSC_401_Week_3_Summary.pptx.pdf', type: 'Weekly Material' }
            ],
            resources: []
        }
    };

    let currentCourse = null;

    courseButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const courseCard = button.closest('.course-card');
            const courseTitle = courseCard.querySelector('.course-title').textContent;
            openCourse(courseTitle);
        });
    });

    function openCourse(courseTitle) {
        modalCourseTitle.textContent = courseTitle;
        courseModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        currentCourse = courseTitle;

        const course = courseData[courseTitle];
        
        if (course && course.pdfs && course.pdfs.length > 0) {
            showPdfSelection(course.pdfs);
        } else {
            showNoPdfMessage();
        }
    }

    function showPdfSelection(pdfs) {
        pdfLoading.style.display = 'none';
        pdfControls.style.display = 'none';
        noPdfMessage.style.display = 'none';
        pdfFrame.style.display = 'none';

        const pdfSelectionHTML = `
            <div class="pdf-selection">
                <h3>📂 Available Course Materials</h3>
                <div class="pdf-list">
                    ${pdfs.map((pdf, index) => `
                        <div class="pdf-item ${pdf.path ? '' : 'coming-soon'}" data-pdf-index="${index}">
                            <div class="pdf-icon">📄</div>
                            <div class="pdf-info">
                                <div class="pdf-name">${pdf.name}</div>
                                <div class="pdf-type">${pdf.type}</div>
                            </div>
                            ${pdf.path ? '<div class="pdf-action">View</div>' : '<div class="pdf-action">Coming Soon</div>'}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const modalBody = document.querySelector('.course-modal-body');
        modalBody.innerHTML = pdfSelectionHTML;
        
        const pdfItems = modalBody.querySelectorAll('.pdf-item');
        pdfItems.forEach(item => {
            if (!item.classList.contains('coming-soon')) {
                item.addEventListener('click', () => {
                    const pdfIndex = item.getAttribute('data-pdf-index');
                    loadSelectedPdf(pdfs[pdfIndex]);
                });
            }
        });
    }

    function loadSelectedPdf(pdf) {
        if (!pdf.path) return;

        const modalBody = document.querySelector('.course-modal-body');
        modalBody.innerHTML = `
            <div class="pdf-viewer-container">
                <div class="pdf-controls" id="pdfControls">
                    <button class="pdf-nav-btn back-to-list" id="backToList">📂 Back to Materials</button>
                </div>
                <div class="pdf-viewer">
                    <iframe class="pdf-iframe" id="pdfFrame" src="${pdf.path}#view=FitH&toolbar=0&navpanes=0"></iframe>
                </div>
            </div>
        `;

        const backToList = modalBody.querySelector('#backToList');
        if (backToList) {
            backToList.addEventListener('click', () => {
                const course = courseData[currentCourse];
                if (course && course.pdfs) {
                    showPdfSelection(course.pdfs);
                }
            });
        }
    }

    function showNoPdfMessage() {
        const modalBody = document.querySelector('.course-modal-body');
        modalBody.innerHTML = `
            <div class="no-pdf-message">
                <h3>⏳ Course Materials Coming Soon</h3>
                <p>This course is currently being prepared. Materials will be available shortly.</p>
            </div>
        `;
    }

    closeModal.addEventListener('click', () => {
        courseModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentCourse = null;
    });

    courseModal.addEventListener('click', (e) => {
        if (e.target === courseModal) {
            courseModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            currentCourse = null;
        }
    });
}