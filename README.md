# Office Visitor Management System (VMS)
### Full Stack Java Spring Boot + Spring Security + MySQL + Multi-Page Enterprise Web Application

A modern, responsive, and robust **Full Stack Office Visitor Management System** designed for enterprise reception desks, corporate offices, and visitor check-in workflows. Built with a **Java Spring Boot** backend, **Spring Security** session-based authentication with **BCrypt password hashing**, **Spring Data JPA / Hibernate**, **MySQL** database, and an enhanced vanilla **HTML5 / CSS3 / JavaScript (Fetch API)** frontend featuring a **dedicated multi-page view router**, **collapsible sidebar navigation**, **live statistics charts**, **status filters**, **pagination**, **visitor details modal cards**, and high-contrast **Light and Dark Modes**.

---

## 🌟 Key Features & Multi-Page Views

### 1. Secure Admin Authentication & Authorization (Spring Security + BCrypt)
- **Dedicated Admin Login Portal (`/login`)**:
  - Clean, modern, responsive authentication screen with brand logo and lock badges.
  - Username or Email lookup for flexible login.
  - Interactive password field with **Show / Hide Password eye toggle button**.
  - Asynchronous form submission with loading spinner and disabled state to prevent duplicate submissions.
  - Real-time client-side validation and server-side BCrypt credential verification.
  - Clear, user-friendly error banners on invalid credentials.
- **Spring Security 6 Protection**:
  - All `/api/visitors/**` REST API endpoints are protected and require authenticated session.
  - Unauthenticated API calls return clean JSON `401 Unauthorized` responses (`customAuthenticationEntryPoint`), avoiding HTML redirect loops for Fetch calls.
  - Session cookie hardening: `HttpOnly=true`, `SameSite=Lax`, and `server.servlet.session.timeout=30m`.
- **Initial Admin Seeding (`AdminDataInitializer`)**:
  - Secure initial administrator account seeded automatically on startup if not present.
  - Credentials configurable via environment variables (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL`, `ADMIN_NAME`) with secure defaults.
  - Passwords are encrypted exclusively using **BCrypt** hashing — plaintext passwords are never stored.
  - Avoids duplicate records on application restarts.
- **Session Logout**:
  - Invalidate server-side HTTP session via `POST /api/auth/logout`.
  - Clears `SecurityContextHolder` and redirects user safely to `/login`.
  - Prevents back-button navigation to protected visitor data after logout.
- **User Profile Display**:
  - Displays administrator avatar initial, full name, and role badge (`ADMIN`) in both the sidebar footer and header bar.

### 2. Functional Multi-Page Navigation & Client-Side Router
- **Separate Dedicated Views**:
  - 📊 **Dashboard (`/` or `/dashboard`)**:
    - Live metric counter cards: **Total Visitors**, **Checked In**, and **Checked Out**.
    - **Visitor Status Ratio Chart**: Interactive SVG donut chart showing the live proportion of checked-in vs checked-out visitors.
    - **Visits by Department**: Live bar meter distribution across office officials (`Manager`, `HR`, `Receptionist`, `IT Department`, `Accounts`).
    - **Recent Visitor Activity**: Concise table showing the 5 most recent visitors with quick inspect action.
    - Quick shortcut buttons: `New Visitor Registration` and `View All Records`.
  - 📝 **Visitor Registration (`/visitors/register`)**:
    - Dedicated, distraction-free visitor check-in form.
    - Complete validation: 10-digit mobile number, visitor name, department, purpose, visit date & time, and email format.
    - Prevents accidental double submissions via button lock & spinner.
    - On submission, saves to MySQL and automatically routes to the records log so the newly created record is immediately visible.
  - 📋 **Visitor Records (`/visitors`)**:
    - Dedicated records management page.
    - **Search Toolbar**: Instant search by visitor name, mobile number, department, purpose, or email.
    - **Segmented Status Filter Pills**: `All`, `Checked In` (with green status indicator), and `Checked Out`.
    - **Date-Based Filtering**: Filter records by specific date with a single click.
    - **Pagination**: 10 records per page with Previous, Page Numbers, and Next controls.
    - **Check-In & Check-Out Actions**: Instant two-way status toggles with backend synchronization.
    - **Delete**: Confirmation modal before permanent database deletion.
- **Browser History & Direct URL Support**:
  - Full HTML5 History API integration (`history.pushState` and `popstate` handler).
  - Browser **Back** and **Forward** buttons work seamlessly.
  - Direct browser URLs (`/visitors`, `/visitors/register`, `/login`, `/`) and page refreshes work cleanly thanks to Spring Boot's internal `ViewController` forwarder.

### 3. Collapsible Left Sidebar Navigation
- **Workspace Navigation**:
  - Dashboard, Visitor Registration, and Visitor Records with clearly highlighted active state.
  - Live visitor count badge displayed next to Visitor Records in the sidebar.
- **Desktop Collapse**:
  - Toggles between full width (`260px`) and compact icon-rail (`74px`).
  - Preference saved in `localStorage`.
- **Mobile & Tablet Off-Canvas Drawer**:
  - Smooth slide-in drawer with backdrop blur overlay.
  - Automatically closes upon navigation.

### 4. Visitor Details Inspection Modal
- Clicking **View** on any visitor row opens an executive **Visitor Profile Card**.
- Displays full Visitor ID, status badge, full name, phone number, email address, visiting official, purpose, date, check-in timestamp, and check-out timestamp.
- Allows Check Out or Check In directly from inside the details modal.

### 5. Modern Dark & Light Mode
- **Header Toggle**: Accessible button with Sun (Light) and Moon (Dark) icons in the top-right header.
- **Whole-Site Styling**: Works across all pages, login card, sidebar, cards, inputs, charts, and modals.
- **Instant Persistence**: Selected theme preference is saved in `localStorage`.
- **High-Contrast Palette**:
  - **Light Mode**: Background `#F8FAFC`, Sidebar `#FFFFFF`, Cards `#FFFFFF`, Text `#0F172A`, Primary `#1E40AF`, Secondary `#2563EB`.
  - **Dark Mode**: Background `#0B1120`, Sidebar `#0F172A`, Cards `#1E293B`, Text `#F8FAFC`, Borders `#334155`, Accent `#3B82F6`.

---

## 🏗️ Architecture & OOP Implementation

```
src/main/java/com/vms/
├── VisitorManagementApplication.java    # Spring Boot Main Entry Point
├── config/
│   ├── AdminDataInitializer.java        # CommandLineRunner to Seed Default Admin Account
│   ├── CorsConfig.java                  # Cross-Origin Resource Sharing (CORS) Configuration
│   └── SecurityConfig.java              # Spring Security 6 Filter Chain & BCrypt Configuration
├── controller/
│   ├── AuthController.java              # Admin Authentication REST Controller (Login, Logout, Status)
│   ├── ViewController.java              # Client-Side Routing Forwarder (SPA Route Support)
│   └── VisitorController.java           # Protected Visitor REST API Endpoints
├── dto/
│   ├── ApiResponse.java                 # Standard Generic API Response Wrapper
│   ├── AuthResponseDTO.java             # Admin Authentication Response Payload
│   ├── DashboardStatsDTO.java           # Live Dashboard Counters Payload
│   ├── LoginRequestDTO.java             # Admin Login Credentials Request Payload
│   ├── VisitorRequestDTO.java           # Registration Form Input Validation DTO
│   └── VisitorResponseDTO.java          # Client-Facing Output DTO
├── entity/
│   ├── AdminUser.java                   # JPA Entity for Administrators (BCrypt Credentials)
│   └── Visitor.java                     # JPA Entity for Visitors (Encapsulation, Tables & Indices)
├── exception/
│   ├── BadRequestException.java         # Custom 400 Exception
│   ├── ErrorDetails.java                # Standard Error Response Structure
│   ├── GlobalExceptionHandler.java      # Centralized REST Exception Handler (@RestControllerAdvice)
│   └── ResourceNotFoundException.java   # Custom 404 Exception
├── repository/
│   ├── AdminUserRepository.java         # Spring Data JPA Repository for AdminUser
│   └── VisitorRepository.java           # Spring Data JPA Repository for Visitor
├── security/
│   └── CustomUserDetailsService.java    # Spring Security UserDetailsService querying MySQL
└── service/
    ├── VisitorService.java              # Service Interface (Abstraction)
    └── impl/
        └── VisitorServiceImpl.java      # Service Implementation (Business Logic & Transactions)
```

---

## 🗄️ Database Setup (MySQL)

- **Database Name**: `visitor_management_db`
- **Tables**: `visitors`, `admin_users`

Spring Boot will automatically create and update the database schema on startup (`spring.jpa.hibernate.ddl-auto=update`).
To view or initialize manually:

```bash
mysql -u root -p < database/schema.sql
```

---

## ⚙️ Default Credentials & Configuration

### Default Administrator Account
- **Username**: `admin` (or `admin@vms.com`)
- **Password**: `admin123`
- **Role**: `ROLE_ADMIN`

*(Credentials can be customized through environment variables: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL`).*

### `application.properties`
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/visitor_management_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:root}
spring.jpa.hibernate.ddl-auto=update
vms.admin.username=${ADMIN_USERNAME:admin}
vms.admin.password=${ADMIN_PASSWORD:admin123}
server.servlet.session.timeout=30m
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.same-site=lax
```

---

## 🚀 How to Run the Application

```bash
cd C:\Users\nisha\.gemini\antigravity\scratch\visitor-management-system
.\mvnw.cmd clean package -DskipTests
java -jar target/visitor-management-system-1.0.0.jar
```

Once running, access the application in your browser:
👉 **`http://localhost:8080/`**

---

## 🔌 REST API Endpoints

### Authentication APIs
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate administrator with username/email and password | Public |
| `GET` | `/api/auth/status` | Get current session authentication status & user profile | Public |
| `POST` | `/api/auth/logout` | Invalidate session & logout administrator | Authenticated |

### Protected Visitor Management APIs
| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `POST` | `/api/visitors` | Register a new visitor | `201 Created` |
| `GET` | `/api/visitors` | Get all visitor records | `200 OK` |
| `GET` | `/api/visitors/{id}` | Get visitor details by ID | `200 OK` |
| `GET` | `/api/visitors/search?keyword={query}` | Search visitors by name, mobile, etc. | `200 OK` |
| `PUT` | `/api/visitors/{id}/checkout` | Mark visitor as Checked Out | `200 OK` |
| `PUT` | `/api/visitors/{id}/checkin` | Mark visitor as Checked In | `200 OK` |
| `DELETE` | `/api/visitors/{id}` | Permanently delete visitor record | `200 OK` |
| `GET` | `/api/visitors/stats` | Retrieve live dashboard statistics | `200 OK` |
