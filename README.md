# EVENTORA

Eventora is a responsive event discovery and registration website developed as a student web-design project using HTML5, CSS3, and vanilla JavaScript. It provides a simple interface for browsing events, viewing event details, and managing registrations.

## Features

- Responsive layout for desktop, tablet, and mobile devices
- Event cards displaying images, dates, categories, venues, and descriptions
- Event search, category filtering, and sorting
- Event details modal with a live countdown
- Registration form with name, email, and phone validation
- Duplicate registration prevention
- Ticket-style registration confirmation
- Registration history with remove and clear options
- Dark and light themes saved using Local Storage
- Mobile navigation and scroll-reveal effects

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Google Fonts – DM Sans and Outfit
- Browser Local Storage


## Project Structure

```text
EVENTORA/
│
├── 📄 index.html       # Main HTML structure
├── 🎨 style.css        # Styling and responsive design
├── ⚙️ script.js        # JavaScript functionality
└── 📘 README.md        # Project documentation
```


## How to Run Locally

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Ensure that `index.html`, `style.css`, and `script.js` are in the correct locations.
4. Open `index.html` in a browser, or use the VS Code Live Server extension.

**Note:** An internet connection is required to load Google Fonts and remotely hosted photographs.

## Event and Image Information

The event names, dates, descriptions, and venues displayed on this website are illustrative sample listings created for demonstration purposes. They are not official KIIT announcements or a confirmed event schedule.

Some photographs are referenced from KIIT, KIIT News, and KSAC web domains. Other event images are included as illustrative visuals. Image availability may depend on the respective hosting websites. Please follow applicable image-reuse permissions and credit requirements before redistributing the project.

## Registration and Data Privacy

Eventora is a front-end demonstration project and does not use a backend server or shared database.

Registration details and theme preferences are stored in the browser using Local Storage. This information remains in the browser profile where it was saved and is not automatically shared across devices.

Local Storage is not encrypted and should not be used to store sensitive personal information or process real event registrations. A production-ready application would require a secure backend, HTTPS, server-side validation, appropriate access controls, and a privacy policy.

## Limitations

- Event listings are sample data.
- Registrations are stored locally in the browser.
- No real tickets are generated or issued.
- No backend database or authentication system is implemented.
- Remote photographs and Google Fonts require an internet connection.

## Project Purpose

This project was developed to demonstrate practical implementation of responsive web design, DOM manipulation, JavaScript event handling, form validation, browser storage, and interactive user-interface components.
