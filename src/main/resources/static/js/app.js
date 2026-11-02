/**
 * Office Visitor Management System - Multi-Page Enterprise Frontend Application
 * Fully integrated with Spring Boot REST Backend via Fetch API
 * Features Client-Side Router, Dashboard Analytics, Filters, Pagination & Modal Cards
 */

(function () {
    'use strict';

    // Backend API Base URLs
    const API_BASE_URL = (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '8080'))
        ? 'http://localhost:8080/api/visitors'
        : '/api/visitors';

    const AUTH_BASE_URL = (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '8080'))
        ? 'http://localhost:8080/api/auth'
        : '/api/auth';

    // Application State
    const state = {
        isAuthenticated: false,
        currentUser: null,
        currentRoute: '/',
        visitors: [],
        filteredVisitors: [],
        dashboardStats: { totalVisitors: 0, checkedIn: 0, checkedOut: 0 },
        visitorToDelete: null,
        activeDetailsVisitor: null,
        isLoading: false,

        // Records Table Filters & Pagination
        searchKeyword: '',
        statusFilter: 'all', // 'all', 'checkedin', 'checkedout'
        dateFilter: '',
        currentPage: 1,
        pageSize: 10
    };

    // DOM Elements Cache
    const elements = {
        htmlRoot: document.documentElement,
        appLayout: document.getElementById('appLayout'),
        appSidebar: document.getElementById('appSidebar'),
        sidebarToggleBtn: document.getElementById('sidebarToggleBtn'),
        sidebarCloseBtn: document.getElementById('sidebarCloseBtn'),
        sidebarBackdrop: document.getElementById('sidebarBackdrop'),
        currentSectionTitle: document.getElementById('currentSectionTitle'),

        // Sidebar Navigation Links
        navDashboard: document.getElementById('navDashboard'),
        navRegistration: document.getElementById('navRegistration'),
        navRecords: document.getElementById('navRecords'),
        navRecordCount: document.getElementById('navRecordCount'),
        sidebarNavLinks: document.querySelectorAll('.app-sidebar .nav-link, .sidebar-brand'),

        // Page Views
        viewDashboard: document.getElementById('viewDashboard'),
        viewRegistration: document.getElementById('viewRegistration'),
        viewRecords: document.getElementById('viewRecords'),
        viewLogin: document.getElementById('viewLogin'),

        // Admin Login View & Form Elements
        loginForm: document.getElementById('loginForm'),
        loginUsername: document.getElementById('loginUsername'),
        loginPassword: document.getElementById('loginPassword'),
        loginUsernameError: document.getElementById('loginUsernameError'),
        loginPasswordError: document.getElementById('loginPasswordError'),
        loginAlert: document.getElementById('loginAlert'),
        loginAlertMessage: document.getElementById('loginAlertMessage'),
        loginSubmitBtn: document.getElementById('loginSubmitBtn'),
        loginSpinner: document.getElementById('loginSpinner'),
        togglePasswordBtn: document.getElementById('togglePasswordBtn'),
        eyeShow: document.querySelector('.eye-show'),
        eyeHide: document.querySelector('.eye-hide'),

        // Sidebar & Header Profile & Logout
        sidebarUserCard: document.getElementById('sidebarUserCard'),
        sidebarAdminName: document.getElementById('sidebarAdminName'),
        sidebarAdminRole: document.getElementById('sidebarAdminRole'),
        sidebarAvatar: document.getElementById('sidebarAvatar'),
        sidebarLogoutBtn: document.getElementById('sidebarLogoutBtn'),
        topUserPill: document.getElementById('topUserPill'),
        topUsername: document.getElementById('topUsername'),
        topAvatar: document.getElementById('topAvatar'),
        headerLogoutBtn: document.getElementById('headerLogoutBtn'),

        // Header Elements
        themeToggleBtn: document.getElementById('themeToggleBtn'),
        themeLabel: document.getElementById('themeLabel'),
        liveClock: document.getElementById('liveClock'),

        // Dashboard Elements
        statTotal: document.getElementById('statTotal'),
        statCheckedIn: document.getElementById('statCheckedIn'),
        statCheckedOut: document.getElementById('statCheckedOut'),
        donutTotalCount: document.getElementById('donutTotalCount'),
        donutCheckedIn: document.getElementById('donutCheckedIn'),
        donutCheckedOut: document.getElementById('donutCheckedOut'),
        legendCheckedInVal: document.getElementById('legendCheckedInVal'),
        legendCheckedOutVal: document.getElementById('legendCheckedOutVal'),
        departmentMeters: document.getElementById('departmentMeters'),
        recentActivityTableBody: document.getElementById('recentActivityTableBody'),
        recentEmptyState: document.getElementById('recentEmptyState'),

        // Registration Form Elements
        visitorForm: document.getElementById('visitorForm'),
        visitorName: document.getElementById('visitorName'),
        mobileNumber: document.getElementById('mobileNumber'),
        email: document.getElementById('email'),
        personToVisit: document.getElementById('personToVisit'),
        purpose: document.getElementById('purpose'),
        visitDate: document.getElementById('visitDate'),
        visitTime: document.getElementById('visitTime'),
        registerBtn: document.getElementById('registerBtn'),
        registerSpinner: document.getElementById('registerSpinner'),
        resetFormBtn: document.getElementById('resetFormBtn'),
        formAlert: document.getElementById('formAlert'),

        // Field Error Spans
        visitorNameError: document.getElementById('visitorNameError'),
        mobileNumberError: document.getElementById('mobileNumberError'),
        emailError: document.getElementById('emailError'),
        personToVisitError: document.getElementById('personToVisitError'),
        purposeError: document.getElementById('purposeError'),
        visitDateError: document.getElementById('visitDateError'),
        visitTimeError: document.getElementById('visitTimeError'),

        // Records Table & Toolbar
        searchInput: document.getElementById('searchInput'),
        searchClearBtn: document.getElementById('searchClearBtn'),
        searchBtn: document.getElementById('searchBtn'),
        showAllBtn: document.getElementById('showAllBtn'),
        emptyShowAllBtn: document.getElementById('emptyShowAllBtn'),
        recordDateFilter: document.getElementById('recordDateFilter'),
        clearDateFilterBtn: document.getElementById('clearDateFilterBtn'),
        filterAll: document.getElementById('filterAll'),
        filterCheckedIn: document.getElementById('filterCheckedIn'),
        filterCheckedOut: document.getElementById('filterCheckedOut'),
        filterAllCount: document.getElementById('filterAllCount'),
        filterInCount: document.getElementById('filterInCount'),
        filterOutCount: document.getElementById('filterOutCount'),
        statusPills: document.querySelectorAll('.filter-pill'),

        visitorTable: document.getElementById('visitorTable'),
        visitorTableBody: document.getElementById('visitorTableBody'),
        emptyState: document.getElementById('emptyState'),
        emptyStateDesc: document.getElementById('emptyStateDesc'),
        tableLoading: document.getElementById('tableLoading'),
        recordCountText: document.getElementById('recordCountText'),
        paginationControls: document.getElementById('paginationControls'),
        prevPageBtn: document.getElementById('prevPageBtn'),
        nextPageBtn: document.getElementById('nextPageBtn'),
        pageNumbers: document.getElementById('pageNumbers'),

        // Visitor Details Modal
        visitorDetailsModal: document.getElementById('visitorDetailsModal'),
        closeDetailsModalBtn: document.getElementById('closeDetailsModalBtn'),
        closeDetailsBtn: document.getElementById('closeDetailsBtn'),
        modalDynamicActionContainer: document.getElementById('modalDynamicActionContainer'),
        detailVisitorId: document.getElementById('detailVisitorId'),
        detailStatusBadge: document.getElementById('detailStatusBadge'),
        detailName: document.getElementById('detailName'),
        detailMobile: document.getElementById('detailMobile'),
        detailEmail: document.getElementById('detailEmail'),
        detailPerson: document.getElementById('detailPerson'),
        detailPurpose: document.getElementById('detailPurpose'),
        detailDate: document.getElementById('detailDate'),
        detailCheckInTime: document.getElementById('detailCheckInTime'),
        detailCheckOutTime: document.getElementById('detailCheckOutTime'),

        // Delete Modal
        deleteModal: document.getElementById('deleteModal'),
        modalVisitorName: document.getElementById('modalVisitorName'),
        modalVisitorId: document.getElementById('modalVisitorId'),
        confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
        cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
        deleteSpinner: document.getElementById('deleteSpinner'),

        // Toast Container
        toastContainer: document.getElementById('toastContainer')
    };

    /* ===================================================================
       1. Centralized API Fetch & Security 401 Interceptor
       =================================================================== */

    async function apiFetch(url, options = {}) {
        options.credentials = 'include';
        try {
            const response = await fetch(url, options);

            // Handle unauthorized access or expired server session
            if (response.status === 401) {
                state.isAuthenticated = false;
                state.currentUser = null;
                if (elements.appLayout) elements.appLayout.classList.add('auth-mode');
                showToast('Session expired or unauthorized. Please sign in.', 'warning', 'Authentication Required');
                navigateTo('/login', true);
                throw new Error('UNAUTHORIZED');
            }

            return response;
        } catch (err) {
            if (err.message === 'UNAUTHORIZED') {
                throw err;
            }
            throw err;
        }
    }

    /* ===================================================================
       2. Client-Side Router & Multi-Page Navigation
       =================================================================== */

    // Normalize path to clean standard routes
    function normalizeRoute(path) {
        if (!path) return '/';
        // Handle hash-based URLs if present (e.g. #/visitors -> /visitors)
        if (path.startsWith('#')) {
            path = path.slice(1);
        }
        path = path.split('?')[0];
        if (path.length > 1 && path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        if (path === '' || path === '/dashboard') {
            return '/';
        }
        if (path === '/register') {
            return '/visitors/register';
        }
        if (path === '/login' || path === '/auth/login') {
            return '/login';
        }
        return path;
    }

    function navigateTo(targetPath, pushState = true) {
        let route = normalizeRoute(targetPath);

        // Authentication route guard
        if (!state.isAuthenticated && route !== '/login') {
            route = '/login';
        } else if (state.isAuthenticated && route === '/login') {
            route = '/';
        }

        state.currentRoute = route;

        // Hide all page views
        elements.viewDashboard.classList.add('hidden');
        elements.viewRegistration.classList.add('hidden');
        elements.viewRecords.classList.add('hidden');
        if (elements.viewLogin) elements.viewLogin.classList.add('hidden');

        // Deactivate all sidebar nav links
        document.querySelectorAll('.app-sidebar .nav-link').forEach(link => {
            link.classList.remove('active');
        });

        if (route === '/login') {
            if (elements.appLayout) elements.appLayout.classList.add('auth-mode');
            if (elements.viewLogin) elements.viewLogin.classList.remove('hidden');
            if (elements.currentSectionTitle) elements.currentSectionTitle.textContent = 'Administrator Login';
            document.title = 'Admin Sign In - Office Visitor Management';
        } else {
            if (elements.appLayout) elements.appLayout.classList.remove('auth-mode');

            // Activate matching view and sidebar link
            if (route === '/visitors/register') {
                elements.viewRegistration.classList.remove('hidden');
                if (elements.navRegistration) elements.navRegistration.classList.add('active');
                if (elements.currentSectionTitle) elements.currentSectionTitle.textContent = 'Visitor Registration';
                document.title = 'Visitor Registration - Office Visitor Management';
            } else if (route === '/visitors') {
                elements.viewRecords.classList.remove('hidden');
                if (elements.navRecords) elements.navRecords.classList.add('active');
                if (elements.currentSectionTitle) elements.currentSectionTitle.textContent = 'Visitor Records';
                document.title = 'Visitor Records - Office Visitor Management';
                applyRecordsFiltersAndRender();
            } else {
                // Default: Dashboard View (/)
                elements.viewDashboard.classList.remove('hidden');
                if (elements.navDashboard) elements.navDashboard.classList.add('active');
                if (elements.currentSectionTitle) elements.currentSectionTitle.textContent = 'Dashboard Overview';
                document.title = 'Dashboard - Office Visitor Management';
                renderDashboardActivityAndCharts();
            }
        }

        // Update Browser URL with History API
        if (pushState && window.history && window.history.pushState) {
            try {
                const currentBrowserPath = window.location.pathname;
                if (currentBrowserPath !== route) {
                    window.history.pushState({ route }, '', route);
                }
            } catch (e) {
                // Fallback for file:// protocol or restricted environments
                window.location.hash = route;
            }
        }

        // Close mobile drawer on navigation
        closeMobileSidebar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function initRouter() {
        // Read current URL on page load
        let initialPath = window.location.pathname;
        if (window.location.hash) {
            initialPath = window.location.hash.replace('#', '');
        }

        // Listen for browser Back & Forward button events
        window.addEventListener('popstate', (e) => {
            let path = window.location.pathname;
            if (window.location.hash) {
                path = window.location.hash.replace('#', '');
            }
            navigateTo(path, false);
        });

        // Intercept all clicks on elements with data-route attribute
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-route]');
            if (link) {
                const targetRoute = link.getAttribute('data-route') || link.getAttribute('href');
                if (targetRoute && !targetRoute.startsWith('http') && !targetRoute.startsWith('mailto')) {
                    e.preventDefault();
                    navigateTo(targetRoute, true);
                }
            }
        });

        // Launch initial route
        navigateTo(initialPath, false);
    }

    /* ===================================================================
       2. Theme Management (Light / Dark Mode with localStorage)
       =================================================================== */

    function initTheme() {
        const savedTheme = localStorage.getItem('vms_theme') || 'light';
        applyTheme(savedTheme);

        if (elements.themeToggleBtn) {
            elements.themeToggleBtn.addEventListener('click', () => {
                const currentTheme = elements.htmlRoot.getAttribute('data-theme') || 'light';
                const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
                applyTheme(nextTheme);
            });
        }
    }

    function applyTheme(theme) {
        elements.htmlRoot.setAttribute('data-theme', theme);
        localStorage.setItem('vms_theme', theme);
        if (elements.themeLabel) {
            elements.themeLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
        }
    }

    /* ===================================================================
       3. Sidebar Navigation & Responsive Collapse
       =================================================================== */

    function initSidebar() {
        // Load desktop collapse state from localStorage
        const isCollapsed = localStorage.getItem('vms_sidebar_collapsed') === 'true';
        if (isCollapsed && window.innerWidth > 1024) {
            elements.appLayout.classList.add('sidebar-collapsed');
        }

        // Toggle button click
        if (elements.sidebarToggleBtn) {
            elements.sidebarToggleBtn.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    elements.appLayout.classList.toggle('sidebar-mobile-open');
                } else {
                    elements.appLayout.classList.toggle('sidebar-collapsed');
                    const currentlyCollapsed = elements.appLayout.classList.contains('sidebar-collapsed');
                    localStorage.setItem('vms_sidebar_collapsed', currentlyCollapsed);
                }
            });
        }

        if (elements.sidebarBackdrop) {
            elements.sidebarBackdrop.addEventListener('click', closeMobileSidebar);
        }

        if (elements.sidebarCloseBtn) {
            elements.sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
        }
    }

    function closeMobileSidebar() {
        if (elements.appLayout) {
            elements.appLayout.classList.remove('sidebar-mobile-open');
        }
    }

    /* ===================================================================
       4. Real-Time Clock & Form Date/Time Defaults
       =================================================================== */

    function updateLiveClock() {
        if (!elements.liveClock) return;
        const now = new Date();
        const options = {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        elements.liveClock.textContent = now.toLocaleDateString('en-US', options);
    }

    function setDefaultDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        if (elements.visitDate) elements.visitDate.value = `${year}-${month}-${day}`;

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        if (elements.visitTime) elements.visitTime.value = `${hours}:${minutes}`;
    }

    /* ===================================================================
       5. Toast Notification System
       =================================================================== */

    function showToast(message, type = 'info', title = '') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
            error: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
            info: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
        };

        const defaultTitles = {
            success: 'Success',
            error: 'Action Failed',
            info: 'Notice'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-body">
                <div class="toast-title">${title || defaultTitles[type] || 'Notice'}</div>
                <div class="toast-msg">${message}</div>
            </div>
            <button type="button" class="toast-close-btn" aria-label="Close notification">&times;</button>
        `;

        const closeBtn = toast.querySelector('.toast-close-btn');
        closeBtn.addEventListener('click', () => removeToast(toast));

        elements.toastContainer.appendChild(toast);
        setTimeout(() => removeToast(toast), 3500);
    }

    function removeToast(toast) {
        if (!toast || !toast.parentElement) return;
        toast.classList.add('toast-leave');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 200);
    }

    function showFormAlert(message, type = 'success') {
        elements.formAlert.className = `form-alert alert-${type}`;
        elements.formAlert.textContent = message;
        elements.formAlert.classList.remove('hidden');

        setTimeout(() => {
            elements.formAlert.classList.add('hidden');
        }, 5000);
    }

    /* ===================================================================
       6. Backend API Data Fetching & Sync
       =================================================================== */

    async function fetchDashboardStats() {
        if (!state.isAuthenticated) return;
        try {
            const response = await apiFetch(`${API_BASE_URL}/stats`);
            if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
            const result = await response.json();
            if (result.success && result.data) {
                state.dashboardStats = result.data;
                renderDashboardStats(result.data);
            }
        } catch (error) {
            if (error.message !== 'UNAUTHORIZED') {
                console.error('Failed to load dashboard statistics:', error);
            }
        }
    }

    function renderDashboardStats(stats) {
        const total = stats.totalVisitors || 0;
        const inCount = stats.checkedIn || 0;
        const outCount = stats.checkedOut || 0;

        // Stat cards
        if (elements.statTotal) elements.statTotal.textContent = total;
        if (elements.statCheckedIn) elements.statCheckedIn.textContent = inCount;
        if (elements.statCheckedOut) elements.statCheckedOut.textContent = outCount;

        // Sidebar badge
        if (elements.navRecordCount) elements.navRecordCount.textContent = total;

        // Filter pills count badges
        if (elements.filterAllCount) elements.filterAllCount.textContent = total;
        if (elements.filterInCount) elements.filterInCount.textContent = inCount;
        if (elements.filterOutCount) elements.filterOutCount.textContent = outCount;

        // Update dashboard chart
        renderDonutChart(inCount, outCount, total);
    }

    async function fetchAllVisitors(showLoading = true) {
        if (!state.isAuthenticated) return;
        if (showLoading) toggleTableLoading(true);
        try {
            const response = await apiFetch(API_BASE_URL);
            if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                state.visitors = result.data;
            } else {
                state.visitors = [];
            }
        } catch (error) {
            if (error.message !== 'UNAUTHORIZED') {
                console.error('Failed to retrieve visitors:', error);
                showToast('Unable to connect to backend server. Make sure Spring Boot is running on port 8080.', 'error', 'Connection Error');
            }
            state.visitors = [];
        } finally {
            if (showLoading) toggleTableLoading(false);
            // Refresh whatever view is currently visible
            renderDashboardActivityAndCharts();
            applyRecordsFiltersAndRender();
        }
    }

    /* ===================================================================
       7. Dashboard Charts & Recent Activity
       =================================================================== */

    function renderDashboardActivityAndCharts() {
        // Donut Chart
        renderDonutChart(state.dashboardStats.checkedIn, state.dashboardStats.checkedOut, state.dashboardStats.totalVisitors);

        // Department Meters
        renderDepartmentMeters(state.visitors);

        // Recent Activity Table (top 5 latest visitors)
        renderRecentActivity(state.visitors.slice(0, 5));
    }

    function renderDonutChart(checkedIn, checkedOut, total) {
        if (!elements.donutTotalCount) return;
        elements.donutTotalCount.textContent = total;
        if (elements.legendCheckedInVal) elements.legendCheckedInVal.textContent = checkedIn;
        if (elements.legendCheckedOutVal) elements.legendCheckedOutVal.textContent = checkedOut;

        const circumference = 2 * Math.PI * 48; // ~301.6

        if (total === 0) {
            if (elements.donutCheckedIn) elements.donutCheckedIn.setAttribute('stroke-dasharray', `0 ${circumference}`);
            if (elements.donutCheckedOut) elements.donutCheckedOut.setAttribute('stroke-dasharray', `0 ${circumference}`);
            return;
        }

        const inLength = (checkedIn / total) * circumference;
        const outLength = (checkedOut / total) * circumference;

        if (elements.donutCheckedIn) {
            elements.donutCheckedIn.setAttribute('stroke-dasharray', `${inLength} ${circumference}`);
            elements.donutCheckedIn.setAttribute('stroke-dashoffset', '0');
        }

        if (elements.donutCheckedOut) {
            elements.donutCheckedOut.setAttribute('stroke-dasharray', `${outLength} ${circumference}`);
            elements.donutCheckedOut.setAttribute('stroke-dashoffset', `-${inLength}`);
        }
    }

    function renderDepartmentMeters(visitors) {
        if (!elements.departmentMeters) return;

        const defaultDepts = ['Manager', 'HR', 'Receptionist', 'IT Department', 'Accounts'];
        const counts = {};
        defaultDepts.forEach(d => counts[d] = 0);

        visitors.forEach(v => {
            const p = v.personToVisit || 'Other';
            counts[p] = (counts[p] || 0) + 1;
        });

        const maxCount = Math.max(1, ...Object.values(counts));

        let html = '';
        Object.entries(counts).forEach(([dept, count]) => {
            const pct = Math.round((count / maxCount) * 100);
            html += `
                <div class="dept-bar-row">
                    <span class="dept-name" title="${escapeHtml(dept)}">${escapeHtml(dept)}</span>
                    <div class="dept-track">
                        <div class="dept-fill" style="width: ${pct}%;"></div>
                    </div>
                    <span class="dept-count">${count}</span>
                </div>
            `;
        });

        elements.departmentMeters.innerHTML = html;
    }

    function renderRecentActivity(recentList) {
        if (!elements.recentActivityTableBody) return;
        elements.recentActivityTableBody.innerHTML = '';

        if (!recentList || recentList.length === 0) {
            if (elements.recentEmptyState) elements.recentEmptyState.classList.remove('hidden');
            return;
        }

        if (elements.recentEmptyState) elements.recentEmptyState.classList.add('hidden');

        recentList.forEach(visitor => {
            const tr = document.createElement('tr');
            const isCheckedIn = visitor.status && visitor.status.toLowerCase() === 'checked in';
            const statusClass = isCheckedIn ? 'badge-checked-in' : 'badge-checked-out';

            tr.innerHTML = `
                <td><span class="visitor-id-tag">${escapeHtml(visitor.visitorId)}</span></td>
                <td>
                    <strong>${escapeHtml(visitor.visitorName)}</strong>
                    ${visitor.mobileNumber ? `<br><small class="text-muted" style="color:var(--color-text-muted);font-size:0.75rem;">${escapeHtml(visitor.mobileNumber)}</small>` : ''}
                </td>
                <td>${escapeHtml(visitor.personToVisit)}</td>
                <td>${escapeHtml(visitor.purpose)}</td>
                <td>${formatDateDisplay(visitor.visitDate)} ${formatTimeDisplay(visitor.visitTime)}</td>
                <td><span class="status-badge ${statusClass}">${escapeHtml(visitor.status)}</span></td>
                <td class="text-center">
                    <button type="button" class="btn btn-table-action btn-table-view inspect-btn" data-id="${visitor.id}">
                        View
                    </button>
                </td>
            `;
            elements.recentActivityTableBody.appendChild(tr);
        });

        // Attach inspect listeners
        elements.recentActivityTableBody.querySelectorAll('.inspect-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openVisitorDetailsModal(id);
            });
        });
    }

    /* ===================================================================
       8. Visitor Records Table Filtering, Sorting & Pagination
       =================================================================== */

    function applyRecordsFiltersAndRender() {
        let list = [...state.visitors];

        // 1. Search Query Filter
        if (state.searchKeyword.trim()) {
            const q = state.searchKeyword.toLowerCase().trim();
            list = list.filter(v =>
                (v.visitorName && v.visitorName.toLowerCase().includes(q)) ||
                (v.mobileNumber && v.mobileNumber.includes(q)) ||
                (v.visitorId && v.visitorId.toLowerCase().includes(q)) ||
                (v.personToVisit && v.personToVisit.toLowerCase().includes(q)) ||
                (v.purpose && v.purpose.toLowerCase().includes(q)) ||
                (v.email && v.email.toLowerCase().includes(q))
            );
        }

        // 2. Status Filter
        if (state.statusFilter === 'checkedin') {
            list = list.filter(v => v.status && v.status.toLowerCase() === 'checked in');
        } else if (state.statusFilter === 'checkedout') {
            list = list.filter(v => v.status && v.status.toLowerCase() === 'checked out');
        }

        // 3. Date Filter
        if (state.dateFilter) {
            list = list.filter(v => v.visitDate === state.dateFilter);
        }

        state.filteredVisitors = list;
        renderPaginatedVisitorTable();
    }

    function renderPaginatedVisitorTable() {
        if (!elements.visitorTableBody) return;
        elements.visitorTableBody.innerHTML = '';

        const totalItems = state.filteredVisitors.length;

        if (totalItems === 0) {
            elements.visitorTable.classList.add('hidden');
            elements.emptyState.classList.remove('hidden');
            if (elements.paginationControls) elements.paginationControls.classList.add('hidden');
            elements.recordCountText.textContent = 'Showing 0 records';

            if (state.searchKeyword || state.statusFilter !== 'all' || state.dateFilter) {
                elements.emptyStateDesc.textContent = 'No visitors match the active search or filter criteria.';
            } else {
                elements.emptyStateDesc.textContent = 'No visitor records found in the database. Use Registration to check in visitors.';
            }
            return;
        }

        elements.visitorTable.classList.remove('hidden');
        elements.emptyState.classList.add('hidden');
        if (elements.paginationControls) elements.paginationControls.classList.remove('hidden');

        // Pagination Calculations
        const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
        if (state.currentPage > totalPages) state.currentPage = totalPages;
        if (state.currentPage < 1) state.currentPage = 1;

        const startIndex = (state.currentPage - 1) * state.pageSize;
        const endIndex = Math.min(startIndex + state.pageSize, totalItems);
        const pageItems = state.filteredVisitors.slice(startIndex, endIndex);

        elements.recordCountText.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${totalItems} record${totalItems === 1 ? '' : 's'}`;

        // Populate Table Rows
        pageItems.forEach(visitor => {
            const row = document.createElement('tr');
            const isCheckedIn = visitor.status && visitor.status.toLowerCase() === 'checked in';
            const statusClass = isCheckedIn ? 'badge-checked-in' : 'badge-checked-out';

            row.innerHTML = `
                <td>
                    <span class="visitor-id-tag">${escapeHtml(visitor.visitorId)}</span>
                </td>
                <td>
                    <strong>${escapeHtml(visitor.visitorName)}</strong>
                    ${visitor.email ? `<br><small style="color:var(--color-text-muted);font-size:0.75rem;">${escapeHtml(visitor.email)}</small>` : ''}
                </td>
                <td>${escapeHtml(visitor.mobileNumber)}</td>
                <td>${escapeHtml(visitor.personToVisit)}</td>
                <td>${escapeHtml(visitor.purpose)}</td>
                <td>${formatDateDisplay(visitor.visitDate)}</td>
                <td>${formatTimeDisplay(visitor.visitTime)}</td>
                <td>
                    <span class="status-badge ${statusClass}">${escapeHtml(visitor.status)}</span>
                </td>
                <td class="text-center">
                    <div class="table-actions">
                        <button type="button" class="btn btn-table-action btn-table-view view-detail-btn" 
                                data-id="${visitor.id}" title="View Visitor Card">
                            View
                        </button>
                        ${isCheckedIn ? `
                            <button type="button" class="btn btn-table-action btn-checkout checkout-btn" 
                                    data-id="${visitor.id}" data-vcode="${escapeHtml(visitor.visitorId)}"
                                    title="Check out visitor">
                                Check Out
                            </button>
                        ` : `
                            <button type="button" class="btn btn-table-action btn-checkin checkin-btn" 
                                    data-id="${visitor.id}" data-vcode="${escapeHtml(visitor.visitorId)}"
                                    title="Check in visitor">
                                Check In
                            </button>
                        `}
                        <button type="button" class="btn btn-table-action btn-table-delete delete-btn" 
                                data-id="${visitor.id}" 
                                data-vcode="${escapeHtml(visitor.visitorId)}"
                                data-name="${escapeHtml(visitor.visitorName)}"
                                title="Delete visitor record">
                            Delete
                        </button>
                    </div>
                </td>
            `;

            elements.visitorTableBody.appendChild(row);
        });

        // Render Pagination Numbers
        renderPaginationButtons(totalPages);

        // Attach action button event listeners
        attachTableActionListeners();
    }

    function renderPaginationButtons(totalPages) {
        if (!elements.pageNumbers) return;
        elements.pageNumbers.innerHTML = '';

        elements.prevPageBtn.disabled = (state.currentPage === 1);
        elements.nextPageBtn.disabled = (state.currentPage === totalPages);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `page-number-btn ${i === state.currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.addEventListener('click', () => {
                state.currentPage = i;
                renderPaginatedVisitorTable();
            });
            elements.pageNumbers.appendChild(btn);
        }
    }

    function attachTableActionListeners() {
        // View detail buttons
        document.querySelectorAll('.view-detail-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openVisitorDetailsModal(id);
            });
        });

        // Checkout buttons
        document.querySelectorAll('.checkout-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const vcode = btn.getAttribute('data-vcode');
                checkOutVisitor(id, vcode);
            });
        });

        // Checkin buttons
        document.querySelectorAll('.checkin-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const vcode = btn.getAttribute('data-vcode');
                checkInVisitor(id, vcode);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const vcode = btn.getAttribute('data-vcode');
                const name = btn.getAttribute('data-name');
                openDeleteModal(id, vcode, name);
            });
        });
    }

    /* ===================================================================
       9. Form Validation & Registration Actions
       =================================================================== */

    function validateRegistrationForm() {
        let isValid = true;
        clearAllErrors();

        // 1. Visitor Name
        const nameVal = elements.visitorName.value.trim();
        if (!nameVal) {
            setFieldError('visitorName', 'Visitor Name is required');
            isValid = false;
        } else if (nameVal.length < 2) {
            setFieldError('visitorName', 'Visitor Name must be at least 2 characters');
            isValid = false;
        }

        // 2. Mobile Number (10 digits)
        const mobileVal = elements.mobileNumber.value.trim();
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileVal) {
            setFieldError('mobileNumber', 'Mobile Number is required');
            isValid = false;
        } else if (!mobileRegex.test(mobileVal)) {
            setFieldError('mobileNumber', 'Please enter a valid 10-digit mobile number');
            isValid = false;
        }

        // 3. Email (optional format check)
        const emailVal = elements.email.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailVal && !emailRegex.test(emailVal)) {
            setFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // 4. Person to Visit
        const personVal = elements.personToVisit.value;
        if (!personVal) {
            setFieldError('personToVisit', 'Please select a person / department to visit');
            isValid = false;
        }

        // 5. Purpose of Visit
        const purposeVal = elements.purpose.value;
        if (!purposeVal) {
            setFieldError('purpose', 'Please select the purpose of visit');
            isValid = false;
        }

        // 6. Visit Date
        const dateVal = elements.visitDate.value;
        if (!dateVal) {
            setFieldError('visitDate', 'Visit Date is required');
            isValid = false;
        }

        // 7. Visit Time
        const timeVal = elements.visitTime.value;
        if (!timeVal) {
            setFieldError('visitTime', 'Visit Time is required');
            isValid = false;
        }

        return isValid;
    }

    function setFieldError(field, message) {
        const inputEl = elements[field];
        const errorEl = elements[`${field}Error`];
        if (inputEl) inputEl.classList.add('is-invalid');
        if (errorEl) errorEl.textContent = message;
    }

    function clearFieldError(field) {
        const inputEl = elements[field];
        const errorEl = elements[`${field}Error`];
        if (inputEl) inputEl.classList.remove('is-invalid');
        if (errorEl) errorEl.textContent = '';
    }

    function clearAllErrors() {
        ['visitorName', 'mobileNumber', 'email', 'personToVisit', 'purpose', 'visitDate', 'visitTime'].forEach(clearFieldError);
    }

    async function registerVisitor(formData) {
        setRegisterLoading(true);
        clearAllErrors();

        try {
            const response = await apiFetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const newVisitor = result.data;
                showToast(`Visitor ${newVisitor.visitorName} registered (${newVisitor.visitorId})!`, 'success');
                showFormAlert(`Registration Successful! Visitor ID: ${newVisitor.visitorId}. Redirecting to records...`, 'success');

                elements.visitorForm.reset();
                setDefaultDateTime();

                // Refresh backend data
                await Promise.all([
                    fetchAllVisitors(false),
                    fetchDashboardStats()
                ]);

                // Navigate to visitor records page after 1.2 seconds so user sees new row
                setTimeout(() => {
                    navigateTo('/visitors');
                }, 1200);
            } else {
                if (result.validationErrors) {
                    for (const [field, msg] of Object.entries(result.validationErrors)) {
                        setFieldError(field, msg);
                    }
                }
                const errorMsg = result.message || 'Registration failed. Please check form inputs.';
                showToast(errorMsg, 'error');
                showFormAlert(errorMsg, 'danger');
            }
        } catch (error) {
            if (error.message !== 'UNAUTHORIZED') {
                console.error('Registration failed:', error);
                showToast('Network error while saving visitor to MySQL.', 'error');
                showFormAlert('Network error occurred. Unable to contact database.', 'danger');
            }
        } finally {
            setRegisterLoading(false);
        }
    }

    /* ===================================================================
       10. Check-Out, Check-In & Delete Backend Operations
       =================================================================== */

    async function checkOutVisitor(id, visitorCode) {
        try {
            const response = await apiFetch(`${API_BASE_URL}/${id}/checkout`, {
                method: 'PUT'
            });
            const result = await response.json();

            if (response.ok && result.success) {
                showToast(`Visitor ${visitorCode} marked as Checked Out.`, 'success');
                await Promise.all([
                    fetchAllVisitors(false),
                    fetchDashboardStats()
                ]);

                // If modal was open for this visitor, update modal
                if (state.activeDetailsVisitor && state.activeDetailsVisitor.id == id) {
                    openVisitorDetailsModal(id);
                }
            } else {
                showToast(result.message || 'Failed to check out visitor.', 'error');
            }
        } catch (error) {
            if (error.message !== 'UNAUTHORIZED') {
                console.error('Checkout failed:', error);
                showToast('Network error during checkout operation.', 'error');
            }
        }
    }

    async function checkInVisitor(id, visitorCode) {
        try {
            const response = await apiFetch(`${API_BASE_URL}/${id}/checkin`, {
                method: 'PUT'
            });
            const result = await response.json();

            if (response.ok && result.success) {
                showToast(`Visitor ${visitorCode} marked as Checked In.`, 'success');
                await Promise.all([
                    fetchAllVisitors(false),
                    fetchDashboardStats()
                ]);

                if (state.activeDetailsVisitor && state.activeDetailsVisitor.id == id) {
                    openVisitorDetailsModal(id);
                }
            } else {
                showToast(result.message || 'Failed to check in visitor.', 'error');
            }
        } catch (error) {
            if (error.message !== 'UNAUTHORIZED') {
                console.error('Checkin failed:', error);
                showToast('Network error during check-in operation.', 'error');
            }
        }
    }

    async function deleteVisitor(id) {
        setDeleteLoading(true);
        try {
            const response = await apiFetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (response.ok && result.success) {
                showToast('Visitor record deleted permanently from MySQL.', 'success');
                closeDeleteModal();
                closeVisitorDetailsModal();

                await Promise.all([
                    fetchAllVisitors(false),
                    fetchDashboardStats()
                ]);
            } else {
                showToast(result.message || 'Failed to delete record.', 'error');
            }
        } catch (error) {
            if (error.message !== 'UNAUTHORIZED') {
                console.error('Delete request failed:', error);
                showToast('Network error while deleting visitor record.', 'error');
            }
        } finally {
            setDeleteLoading(false);
        }
    }

    /* ===================================================================
       11. Visitor Details Modal
       =================================================================== */

    function openVisitorDetailsModal(id) {
        const visitor = state.visitors.find(v => v.id == id);
        if (!visitor) return;

        state.activeDetailsVisitor = visitor;
        elements.detailVisitorId.textContent = visitor.visitorId;

        const isCheckedIn = visitor.status && visitor.status.toLowerCase() === 'checked in';
        const statusClass = isCheckedIn ? 'badge-checked-in' : 'badge-checked-out';
        elements.detailStatusBadge.innerHTML = `<span class="status-badge ${statusClass}">${escapeHtml(visitor.status)}</span>`;

        elements.detailName.textContent = visitor.visitorName;
        elements.detailMobile.textContent = visitor.mobileNumber || '--';
        elements.detailEmail.textContent = visitor.email || 'None provided';
        elements.detailPerson.textContent = visitor.personToVisit;
        elements.detailPurpose.textContent = visitor.purpose;
        elements.detailDate.textContent = formatDateDisplay(visitor.visitDate);
        elements.detailCheckInTime.textContent = formatTimeDisplay(visitor.visitTime);
        elements.detailCheckOutTime.textContent = visitor.checkoutTime ? formatDateTimeDisplay(visitor.checkoutTime) : 'Still Checked In';

        // Dynamic Action Button in Modal
        elements.modalDynamicActionContainer.innerHTML = '';
        if (isCheckedIn) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-checkout';
            btn.textContent = 'Check Out Visitor';
            btn.addEventListener('click', () => {
                checkOutVisitor(visitor.id, visitor.visitorId);
            });
            elements.modalDynamicActionContainer.appendChild(btn);
        } else {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-checkin';
            btn.textContent = 'Check In Visitor';
            btn.addEventListener('click', () => {
                checkInVisitor(visitor.id, visitor.visitorId);
            });
            elements.modalDynamicActionContainer.appendChild(btn);
        }

        elements.visitorDetailsModal.classList.remove('hidden');
    }

    function closeVisitorDetailsModal() {
        state.activeDetailsVisitor = null;
        elements.visitorDetailsModal.classList.add('hidden');
    }

    /* ===================================================================
       12. Delete Confirmation Modal
       =================================================================== */

    function openDeleteModal(id, visitorCode, name) {
        state.visitorToDelete = id;
        elements.modalVisitorId.textContent = visitorCode || `ID #${id}`;
        elements.modalVisitorName.textContent = name || 'this visitor';
        elements.deleteModal.classList.remove('hidden');
    }

    function closeDeleteModal() {
        state.visitorToDelete = null;
        elements.deleteModal.classList.add('hidden');
    }

    /* ===================================================================
       13. Utility & Helper Functions
       =================================================================== */

    function formatDateDisplay(dateStr) {
        if (!dateStr) return '--';
        try {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                const [year, month, day] = parts;
                const d = new Date(year, month - 1, day);
                return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
            }
        } catch (e) {}
        return dateStr;
    }

    function formatTimeDisplay(timeStr) {
        if (!timeStr) return '--';
        try {
            const parts = timeStr.split(':');
            if (parts.length >= 2) {
                let hours = parseInt(parts[0], 10);
                const minutes = parts[1];
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
                return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
            }
        } catch (e) {}
        return timeStr;
    }

    function formatDateTimeDisplay(dateTimeStr) {
        if (!dateTimeStr) return '--';
        try {
            const d = new Date(dateTimeStr);
            return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
        } catch (e) {}
        return dateTimeStr;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function toggleTableLoading(show) {
        state.isLoading = show;
        if (show) {
            elements.tableLoading.classList.remove('hidden');
        } else {
            elements.tableLoading.classList.add('hidden');
        }
    }

    function setRegisterLoading(loading) {
        elements.registerBtn.disabled = loading;
        if (loading) {
            elements.registerSpinner.classList.remove('hidden');
        } else {
            elements.registerSpinner.classList.add('hidden');
        }
    }

    function setDeleteLoading(loading) {
        elements.confirmDeleteBtn.disabled = loading;
        if (loading) {
            elements.deleteSpinner.classList.remove('hidden');
        } else {
            elements.deleteSpinner.classList.add('hidden');
        }
    }

    /* ===================================================================
       14. Event Listeners Initialization
       =================================================================== */

    function initEventListeners() {
        // Registration Form Submit
        elements.visitorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validateRegistrationForm()) return;

            const formData = {
                visitorName: elements.visitorName.value.trim(),
                mobileNumber: elements.mobileNumber.value.trim(),
                email: elements.email.value.trim() || null,
                personToVisit: elements.personToVisit.value,
                purpose: elements.purpose.value,
                visitDate: elements.visitDate.value,
                visitTime: elements.visitTime.value.length === 5 ? `${elements.visitTime.value}:00` : elements.visitTime.value
            };

            registerVisitor(formData);
        });

        // Clear Form Button
        elements.resetFormBtn.addEventListener('click', () => {
            elements.visitorForm.reset();
            clearAllErrors();
            setDefaultDateTime();
            elements.formAlert.classList.add('hidden');
        });

        // Real-time error clearing on input
        ['visitorName', 'mobileNumber', 'email', 'personToVisit', 'purpose', 'visitDate', 'visitTime'].forEach(field => {
            const el = elements[field];
            if (el) {
                el.addEventListener('input', () => clearFieldError(field));
                el.addEventListener('change', () => clearFieldError(field));
            }
        });

        // Mobile numeric input guard
        elements.mobileNumber.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
        });

        // Search Input & Buttons
        elements.searchBtn.addEventListener('click', () => {
            state.searchKeyword = elements.searchInput.value.trim();
            state.currentPage = 1;
            applyRecordsFiltersAndRender();
        });

        elements.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                state.searchKeyword = elements.searchInput.value.trim();
                state.currentPage = 1;
                applyRecordsFiltersAndRender();
            }
        });

        elements.searchInput.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val.length > 0) {
                elements.searchClearBtn.classList.remove('hidden');
            } else {
                elements.searchClearBtn.classList.add('hidden');
                if (state.searchKeyword) {
                    state.searchKeyword = '';
                    state.currentPage = 1;
                    applyRecordsFiltersAndRender();
                }
            }
        });

        elements.searchClearBtn.addEventListener('click', () => {
            elements.searchInput.value = '';
            elements.searchClearBtn.classList.add('hidden');
            state.searchKeyword = '';
            state.currentPage = 1;
            applyRecordsFiltersAndRender();
        });

        // Status Filter Pills
        elements.statusPills.forEach(pill => {
            pill.addEventListener('click', () => {
                elements.statusPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                state.statusFilter = pill.getAttribute('data-filter') || 'all';
                state.currentPage = 1;
                applyRecordsFiltersAndRender();
            });
        });

        // Date Filter Picker
        elements.recordDateFilter.addEventListener('change', (e) => {
            state.dateFilter = e.target.value;
            state.currentPage = 1;
            applyRecordsFiltersAndRender();
        });

        elements.clearDateFilterBtn.addEventListener('click', () => {
            elements.recordDateFilter.value = '';
            state.dateFilter = '';
            state.currentPage = 1;
            applyRecordsFiltersAndRender();
        });

        // Reset Filters / Show All
        const resetFiltersHandler = () => {
            elements.searchInput.value = '';
            elements.searchClearBtn.classList.add('hidden');
            elements.recordDateFilter.value = '';
            elements.statusPills.forEach(p => p.classList.remove('active'));
            elements.filterAll.classList.add('active');

            state.searchKeyword = '';
            state.statusFilter = 'all';
            state.dateFilter = '';
            state.currentPage = 1;
            applyRecordsFiltersAndRender();
        };

        elements.showAllBtn.addEventListener('click', resetFiltersHandler);
        elements.emptyShowAllBtn.addEventListener('click', resetFiltersHandler);

        // Pagination Previous / Next Buttons
        elements.prevPageBtn.addEventListener('click', () => {
            if (state.currentPage > 1) {
                state.currentPage--;
                renderPaginatedVisitorTable();
            }
        });

        elements.nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(state.filteredVisitors.length / state.pageSize);
            if (state.currentPage < totalPages) {
                state.currentPage++;
                renderPaginatedVisitorTable();
            }
        });

        // Details Modal Close Handlers
        elements.closeDetailsModalBtn.addEventListener('click', closeVisitorDetailsModal);
        elements.closeDetailsBtn.addEventListener('click', closeVisitorDetailsModal);
        elements.visitorDetailsModal.addEventListener('click', (e) => {
            if (e.target === elements.visitorDetailsModal) closeVisitorDetailsModal();
        });

        // Delete Modal Handlers
        elements.cancelDeleteBtn.addEventListener('click', closeDeleteModal);
        elements.confirmDeleteBtn.addEventListener('click', () => {
            if (state.visitorToDelete) deleteVisitor(state.visitorToDelete);
        });
        elements.deleteModal.addEventListener('click', (e) => {
            if (e.target === elements.deleteModal) closeDeleteModal();
        });

        // Escape Key Global Handler for Modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!elements.deleteModal.classList.contains('hidden')) closeDeleteModal();
                if (!elements.visitorDetailsModal.classList.contains('hidden')) closeVisitorDetailsModal();
            }
        });

        // Administrator Login Form Submission
        if (elements.loginForm) {
            elements.loginForm.addEventListener('submit', handleLogin);
        }

        // Toggle Password Visibility Button
        if (elements.togglePasswordBtn) {
            elements.togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
        }

        // Clear login error indicators on typing
        if (elements.loginUsername) {
            elements.loginUsername.addEventListener('input', () => {
                if (elements.loginUsernameError) {
                    elements.loginUsernameError.classList.add('hidden');
                    elements.loginUsername.classList.remove('is-invalid');
                }
                hideLoginAlert();
            });
        }
        if (elements.loginPassword) {
            elements.loginPassword.addEventListener('input', () => {
                if (elements.loginPasswordError) {
                    elements.loginPasswordError.classList.add('hidden');
                    elements.loginPassword.classList.remove('is-invalid');
                }
                hideLoginAlert();
            });
        }

        // Logout Buttons (Sidebar and Header)
        if (elements.sidebarLogoutBtn) {
            elements.sidebarLogoutBtn.addEventListener('click', handleLogout);
        }
        if (elements.headerLogoutBtn) {
            elements.headerLogoutBtn.addEventListener('click', handleLogout);
        }
    }

    /* ===================================================================
       14. Administrator Authentication & Session Management
       =================================================================== */

    async function checkAuthStatus() {
        try {
            const response = await fetch(`${AUTH_BASE_URL}/status`, {
                credentials: 'include'
            });
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data && result.data.authenticated) {
                    state.isAuthenticated = true;
                    state.currentUser = result.data;
                    updateAdminProfileUI(result.data);
                    if (elements.appLayout) elements.appLayout.classList.remove('auth-mode');
                    return true;
                }
            }
        } catch (err) {
            console.warn('Auth status verification warning:', err);
        }
        state.isAuthenticated = false;
        state.currentUser = null;
        if (elements.appLayout) elements.appLayout.classList.add('auth-mode');
        return false;
    }

    function updateAdminProfileUI(user) {
        if (!user) return;
        const displayName = user.fullName || user.username || 'Administrator';
        const displayRole = user.role ? user.role.replace('ROLE_', '') : 'ADMIN';
        const initial = (displayName.charAt(0) || 'A').toUpperCase();

        if (elements.sidebarAdminName) elements.sidebarAdminName.textContent = displayName;
        if (elements.sidebarAdminRole) elements.sidebarAdminRole.textContent = displayRole;
        if (elements.sidebarAvatar) elements.sidebarAvatar.textContent = initial;

        if (elements.topUsername) elements.topUsername.textContent = displayName;
        if (elements.topAvatar) elements.topAvatar.textContent = initial;
    }

    function showLoginError(elementId, message) {
        const errorEl = elements[elementId];
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
        if (elementId === 'loginUsernameError' && elements.loginUsername) {
            elements.loginUsername.classList.add('is-invalid');
        }
        if (elementId === 'loginPasswordError' && elements.loginPassword) {
            elements.loginPassword.classList.add('is-invalid');
        }
    }

    function clearLoginErrors() {
        if (elements.loginUsernameError) {
            elements.loginUsernameError.textContent = '';
            elements.loginUsernameError.classList.add('hidden');
        }
        if (elements.loginPasswordError) {
            elements.loginPasswordError.textContent = '';
            elements.loginPasswordError.classList.add('hidden');
        }
        if (elements.loginUsername) elements.loginUsername.classList.remove('is-invalid');
        if (elements.loginPassword) elements.loginPassword.classList.remove('is-invalid');
    }

    function showLoginAlert(message) {
        if (elements.loginAlert && elements.loginAlertMessage) {
            elements.loginAlertMessage.textContent = message;
            elements.loginAlert.classList.remove('hidden');
        }
    }

    function hideLoginAlert() {
        if (elements.loginAlert) {
            elements.loginAlert.classList.add('hidden');
        }
    }

    function setLoginLoading(isLoading) {
        if (elements.loginSubmitBtn) {
            elements.loginSubmitBtn.disabled = isLoading;
        }
        if (elements.loginSpinner) {
            if (isLoading) {
                elements.loginSpinner.classList.remove('hidden');
            } else {
                elements.loginSpinner.classList.add('hidden');
            }
        }
    }

    function togglePasswordVisibility() {
        if (!elements.loginPassword) return;
        const isPassword = elements.loginPassword.type === 'password';
        elements.loginPassword.type = isPassword ? 'text' : 'password';

        if (elements.eyeShow && elements.eyeHide) {
            if (isPassword) {
                elements.eyeShow.classList.add('hidden');
                elements.eyeHide.classList.remove('hidden');
            } else {
                elements.eyeShow.classList.remove('hidden');
                elements.eyeHide.classList.add('hidden');
            }
        }
    }

    async function handleLogin(e) {
        if (e) e.preventDefault();
        hideLoginAlert();
        clearLoginErrors();

        const username = elements.loginUsername ? elements.loginUsername.value.trim() : '';
        const password = elements.loginPassword ? elements.loginPassword.value : '';

        let hasError = false;
        if (!username) {
            showLoginError('loginUsernameError', 'Please enter your username or email address.');
            hasError = true;
        }
        if (!password) {
            showLoginError('loginPasswordError', 'Please enter your administrator password.');
            hasError = true;
        }
        if (hasError) return;

        setLoginLoading(true);

        try {
            const response = await fetch(`${AUTH_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    usernameOrEmail: username,
                    password: password
                })
            });

            const result = await response.json();

            if (response.ok && result.success && result.data && result.data.authenticated) {
                state.isAuthenticated = true;
                state.currentUser = result.data;
                updateAdminProfileUI(result.data);
                if (elements.appLayout) elements.appLayout.classList.remove('auth-mode');

                showToast(`Welcome back, ${result.data.fullName || result.data.username}!`, 'success', 'Login Successful');
                if (elements.loginForm) elements.loginForm.reset();

                // Refresh backend data now that user is authenticated
                await Promise.all([
                    fetchDashboardStats(),
                    fetchAllVisitors(false)
                ]);

                // Navigate to dashboard view
                navigateTo('/', true);
            } else {
                const msg = (result && result.message) ? result.message : 'Invalid credentials. Please verify your username and password.';
                showLoginAlert(msg);
            }
        } catch (err) {
            console.error('Authentication request error:', err);
            showLoginAlert('Unable to contact the authentication server. Please verify MySQL and backend status.');
        } finally {
            setLoginLoading(false);
        }
    }

    async function handleLogout() {
        try {
            await fetch(`${AUTH_BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (err) {
            console.warn('Logout API response note:', err);
        } finally {
            state.isAuthenticated = false;
            state.currentUser = null;
            state.visitors = [];
            state.filteredVisitors = [];
            state.dashboardStats = { totalVisitors: 0, checkedIn: 0, checkedOut: 0 };

            if (elements.appLayout) elements.appLayout.classList.add('auth-mode');

            showToast('You have been logged out successfully.', 'info', 'Signed Out');
            navigateTo('/login', true);
        }
    }

    /* ===================================================================
       15. Application Bootstrap
       =================================================================== */

    document.addEventListener('DOMContentLoaded', async () => {
        initTheme();
        initSidebar();
        setDefaultDateTime();
        updateLiveClock();
        setInterval(updateLiveClock, 1000);
        initEventListeners();

        // Check authentication status first on app load
        const isAuthenticated = await checkAuthStatus();

        initRouter();

        if (isAuthenticated) {
            fetchDashboardStats();
            fetchAllVisitors();
        } else {
            navigateTo('/login', true);
        }
    });

})();
