const events = [
  {
    id: 1,
    name: "HackSphere 2026",
    category: "Technology",
    date: "November 21, 2026",
    dateValue: "2026-11-21T09:00:00",
    venue: "KIIT Convention Centre, KIIT Campus",
    description: "A student-led hackathon concept focused on turning practical problems into working prototypes. Form a team, explore emerging technology and build a solution through collaborative coding.",
    short: "A fast-paced campus hackathon built around ideas, teamwork and prototypes.",
    image: "https://news.kiit.ac.in/wp-content/uploads/2026/04/Hackathon2.jpg",
    imageAlt: "Students collaborating on a project during an official KIIT hackathon"
  },
  {
    id: 2,
    name: "Rhythm After Dark",
    category: "Music",
    date: "December 05, 2026",
    dateValue: "2026-12-05T17:00:00",
    venue: "KIIT Open Air Theatre, KIIT Campus",
    description: "An evening of student bands, live performances and music across genres. Bring your friends and enjoy a lively campus night built around local talent.",
    short: "A live campus music night featuring student performers and bands.",
    image: "https://ksac.kiit.ac.in/wp-content/uploads/2024/05/kiitfest-3.jpg",
    imageAlt: "KIIT FEST 7.0 stage and audience during the official campus festival"
  },
  {
    id: 3,
    name: "Founders’ Exchange",
    category: "Business",
    date: "December 12, 2026",
    dateValue: "2026-12-12T10:00:00",
    venue: "KIIT Technology Business Incubator, Campus 11",
    description: "Connect with student founders, mentors and aspiring entrepreneurs. Explore early-stage ideas, learn how teams build products and take part in practical networking sessions.",
    short: "Meet aspiring founders, exchange ideas and explore early-stage ventures.",
    image: "https://kiit.ac.in/wp-content/uploads/2025/10/Arch-img-6.png.webp",
    imageAlt: "KIIT Technology Business Incubator building"
  },
  {
    id: 4,
    name: "Rang — The Creative Arts Festival",
    category: "Art & Culture",
    date: "December 19, 2026",
    dateValue: "2026-12-19T11:00:00",
    venue: "Campus 6, Creative Studio, KIIT",
    description: "A relaxed, beginner-friendly creative session for students. Experiment with colour, learn simple painting techniques and meet others who enjoy making art.",
    short: "A hands-on painting session for beginners and creative minds.",
    image: "https://news.kiit.ac.in/wp-content/uploads/2025/04/Painting-Workshop1.jpg",
    imageAlt: "Students participating in an official KIIT painting workshop"
  },
  {
    id: 5,
    name: "CodeCraft — Web Development Workshop",
    category: "Workshops",
    date: "December 19, 2026",
    dateValue: "2026-12-19T10:00:00",
    venue: "Campus 12, School of Computer Engineering, KIIT",
    description: "A hands-on web development workshop concept where students explore HTML, CSS and JavaScript by building and styling a small responsive website.",
    short: "Build a responsive web page through practical HTML, CSS and JavaScript activities.",
    image: "https://news.kiit.ac.in/wp-content/uploads/2026/08/1-1024x768.jpeg",
    imageAlt: "Students attending an official KIIT workshop in a campus auditorium"
  },
  {
    id: 6,
    name: "KIIT Champions Cup",
    category: "Sports",
    date: "January 09, 2027",
    dateValue: "2027-01-09T08:00:00",
    venue: "KIIT Sports Complex, KIIT Campus",
    description: "A campus cricket competition concept celebrating skill, strategy and team spirit. Watch players take the field and compete in an energetic match-day atmosphere.",
    short: "Campus cricket action, team spirit and a match-day atmosphere.",
    image: "https://kiit.ac.in/wp-content/uploads/2025/10/sports-img-11.png.webp",
    imageAlt: "A cricket player batting during a match at KIIT"
  }
];

const STORAGE_KEYS = {
  registrations: "eventoraRegistrations",
  theme: "eventoraTheme"
};

const eventGrid = document.getElementById("eventGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyMessage = document.getElementById("emptyMessage");
const eventModal = document.getElementById("eventModal");
const registerModal = document.getElementById("registerModal");
const historyModal = document.getElementById("historyModal");
const registrationForm = document.getElementById("registrationForm");

let activeCategory = "All";
let selectedEventId = events[0].id;
let countdownTimer = null;
let lastFocusedElement = null;
let motionObserver = null;

function safeGet(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
}

function getRegistrations() {
  try {
    const saved = JSON.parse(safeGet(STORAGE_KEYS.registrations, "[]"));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function renderStats() {
  const categories = new Set(events.map(event => event.category));
  const venues = new Set(events.map(event => event.venue));
  document.getElementById("eventCount").textContent = events.length;
  document.getElementById("categoryCount").textContent = categories.size;
  document.getElementById("venueCount").textContent = venues.size;
}

function renderEvents() {
  const searchText = searchInput.value.toLowerCase().trim();

  const filteredEvents = events.filter(event => {
    const matchesCategory = activeCategory === "All" || event.category === activeCategory;
    const searchableText = `${event.name} ${event.venue} ${event.category} ${event.description} ${event.short}`.toLowerCase();
    return matchesCategory && searchableText.includes(searchText);
  });

  const sortMode = sortSelect ? sortSelect.value : "earliest";
  filteredEvents.sort((first, second) => {
    if (sortMode === "latest") return new Date(second.dateValue) - new Date(first.dateValue);
    if (sortMode === "name") return first.name.localeCompare(second.name);
    return new Date(first.dateValue) - new Date(second.dateValue);
  });

  eventGrid.innerHTML = filteredEvents.map(event => `
    <article class="event-card reveal">
      <div class="event-image">
        <img src="${event.image}" alt="${escapeHTML(event.imageAlt || event.name)}" loading="lazy" decoding="async">
        <span class="category-tag">${event.category}</span>
      </div>
      <div class="event-body">
        <div class="event-date">${event.date}</div>
        <h3>${escapeHTML(event.name)}</h3>
        <p>${escapeHTML(event.short)}</p>
        <div class="event-meta">
          <span>⌖ ${escapeHTML(event.venue.split(",")[0])}</span>
          <button class="card-action" type="button" data-event-id="${event.id}" aria-label="Explore details for ${escapeHTML(event.name)}">Explore details <span>↗</span></button>
        </div>
      </div>
    </article>
  `).join("");

  emptyMessage.hidden = filteredEvents.length !== 0;
  if (motionObserver) eventGrid.querySelectorAll(".reveal").forEach(card => motionObserver.observe(card));

  eventGrid.querySelectorAll("img").forEach(image => {
    image.addEventListener("error", () => {
      image.hidden = true;
      image.parentElement.classList.add("image-fallback");
    }, { once: true });
  });
}

function openModal(modal) {
  lastFocusedElement = document.activeElement;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  const closeButton = modal.querySelector(".modal-close");
  if (closeButton) closeButton.focus();
}

function closeModals() {
  document.querySelectorAll(".modal.open").forEach(modal => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });
  document.body.style.overflow = "";
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

function showEventDetails(id) {
  const event = events.find(item => item.id === Number(id));
  if (!event) return;

  selectedEventId = event.id;
  const modalImage = document.getElementById("modalImage");
  modalImage.src = event.image;
  modalImage.loading = "eager";
  modalImage.decoding = "async";
  modalImage.alt = event.name;
  document.getElementById("modalCategory").textContent = event.category;
  document.getElementById("modalTitle").textContent = event.name;
  document.getElementById("modalDescription").textContent = event.description;
  document.getElementById("modalDate").textContent = event.date;
  document.getElementById("modalVenue").textContent = event.venue;

  updateCountdown(event);
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = setInterval(() => updateCountdown(event), 1000);
  openModal(eventModal);
}

function updateCountdown(event) {
  const difference = new Date(event.dateValue).getTime() - Date.now();
  const countdown = document.getElementById("countdown");

  if (Number.isNaN(difference)) {
    countdown.textContent = "Event date is not available.";
    return;
  }

  if (difference <= 0) {
    countdown.textContent = "This event has started or passed.";
    return;
  }

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference % 86400000) / 3600000);
  const minutes = Math.floor((difference % 3600000) / 60000);
  const seconds = Math.floor((difference % 60000) / 1000);

  countdown.textContent = `✦ Starts in ${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
}

function openRegistration(eventId) {
  const select = document.getElementById("selectedEvent");
  select.innerHTML = events.map(event =>
    `<option value="${event.id}">${event.name}</option>`
  ).join("");

  registrationForm.reset();
  if (eventId) select.value = String(eventId);

  document.getElementById("registrationForm").hidden = false;
  document.getElementById("successMessage").hidden = true;
  document.getElementById("formError").textContent = "";
  closeModals();
  openModal(registerModal);
  document.getElementById("fullName").focus();
}

function showHistory() {
  renderRegistrationHistory();
  openModal(historyModal);
}

function renderRegistrationHistory() {
  const list = document.getElementById("registrationList");
  const clearButton = document.getElementById("clearRegistrations");
  const registrations = getRegistrations().map(item => ({
    ...item,
    name: item.name || "Guest",
    event: item.event || item.eventName || item.title || "Event details unavailable",
    email: item.email || "Email unavailable",
    phone: item.phone || "Phone unavailable",
    registeredAt: item.registeredAt || item.createdAt || "Previously saved"
  }));

  if (registrations.length === 0) {
    list.innerHTML = '<div class="no-registrations">You have no saved registrations yet.</div>';
    clearButton.hidden = true;
    return;
  }

  list.innerHTML = registrations.map((registration, index) => `
    <article class="registration-item">
      <strong>${escapeHTML(registration.name)} — ${escapeHTML(registration.event)}</strong>
      <p>${escapeHTML(registration.email)} · ${escapeHTML(registration.phone)}</p>
      <p>Registered: ${escapeHTML(registration.registeredAt)}</p>
      <button class="text-button danger-button" type="button" data-remove-registration="${index}">Remove this registration</button>
    </article>
  `).join("");

  clearButton.hidden = false;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

eventGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-event-id]");
  if (button) showEventDetails(button.dataset.eventId);
});

searchInput.addEventListener("input", renderEvents);

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    activeCategory = button.dataset.category;
    renderEvents();
  });
});

document.getElementById("registerFromDetails").addEventListener("click", () => {
  openRegistration(selectedEventId);
});

document.querySelectorAll("[data-close='true']").forEach(element => {
  element.addEventListener("click", closeModals);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModals();

  const openDialog = document.querySelector(".modal.open [role='dialog']");
  if (event.key === "Tab" && openDialog) {
    const focusable = Array.from(openDialog.querySelectorAll("button,input,select,a[href]"))
      .filter(element => !element.disabled && element.getClientRects().length > 0);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

function createRegistrationId() {
  const randomPart = window.crypto && window.crypto.getRandomValues
    ? Array.from(window.crypto.getRandomValues(new Uint8Array(4)), value => value.toString(16).padStart(2, "0")).join("").toUpperCase()
    : Math.random().toString(16).slice(2, 10).toUpperCase();
  return `EVT-${randomPart}`;
}

registrationForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("fullName").value.trim().replace(/\s+/g, " ");
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const eventId = Number(document.getElementById("selectedEvent").value);
  const error = document.getElementById("formError");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneDigits = phone.replace(/\D/g, "");
  const phonePattern = /^\+?[0-9\s()-]{7,18}$/;

  error.textContent = "";

  if (name.length < 2 || name.length > 80 || !/^[\p{L}][\p{L}\p{M} .'-]*[\p{L}]$/u.test(name)) {
    error.textContent = "Please enter a valid name (2–80 letters; spaces, apostrophes and hyphens are allowed).";
    document.getElementById("fullName").focus();
    return;
  }

  if (!emailPattern.test(email)) {
    error.textContent = "Please enter a valid email address.";
    document.getElementById("email").focus();
    return;
  }

  if (!phonePattern.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    error.textContent = "Please enter a valid phone number with 7 to 15 digits.";
    document.getElementById("phone").focus();
    return;
  }

  const selectedEvent = events.find(item => item.id === eventId);
  if (!selectedEvent) {
    error.textContent = "Please select a valid event.";
    document.getElementById("selectedEvent").focus();
    return;
  }

  const savedRegistrations = getRegistrations();
  const duplicate = savedRegistrations.some(item =>
    String(item.email || "").toLowerCase() === email.toLowerCase() &&
    item.event === selectedEvent.name
  );

  if (duplicate) {
    error.textContent = "This email is already registered for this event.";
    document.getElementById("email").focus();
    return;
  }

  const registrationId = createRegistrationId();
  const registration = {
    id: registrationId,
    name,
    email,
    phone,
    event: selectedEvent.name,
    eventDate: selectedEvent.date,
    venue: selectedEvent.venue,
    registeredAt: new Date().toLocaleString()
  };

  savedRegistrations.push(registration);

  if (!safeSet(STORAGE_KEYS.registrations, JSON.stringify(savedRegistrations))) {
    error.textContent = "Your browser could not save this registration. Please check its storage settings and try again.";
    return;
  }

  registrationForm.hidden = true;
  document.getElementById("successText").textContent =
    `Thanks ${name}! Your registration for ${selectedEvent.name} has been saved in this browser.`;
  document.getElementById("ticketEvent").textContent = selectedEvent.name;
  document.getElementById("ticketDate").textContent = selectedEvent.date;
  document.getElementById("ticketVenue").textContent = selectedEvent.venue;
  document.getElementById("ticketId").textContent = registrationId;
  document.getElementById("successMessage").hidden = false;
  document.getElementById("doneButton").focus();
});

document.getElementById("doneButton").addEventListener("click", closeModals);
document.getElementById("historyButton").addEventListener("click", showHistory);

document.getElementById("registrationList").addEventListener("click", event => {
  const button = event.target.closest("[data-remove-registration]");
  if (!button) return;

  const index = Number(button.dataset.removeRegistration);
  const registrations = getRegistrations();
  if (!Number.isInteger(index) || index < 0 || index >= registrations.length) return;

  registrations.splice(index, 1);
  if (safeSet(STORAGE_KEYS.registrations, JSON.stringify(registrations))) {
    renderRegistrationHistory();
  }
});

document.getElementById("clearRegistrations").addEventListener("click", () => {
  if (!window.confirm("Clear all saved registrations from this browser?")) return;
  if (safeSet(STORAGE_KEYS.registrations, "[]")) renderRegistrationHistory();
});

function applyTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light", isLight);
  const button = document.getElementById("themeToggle");
  button.textContent = isLight ? "☾" : "☼";
  button.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  document.querySelector('meta[name="theme-color"]').content = isLight ? "#f2eee7" : "#171719";
}

document.getElementById("themeToggle").addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light") ? "dark" : "light";
  applyTheme(nextTheme);
  safeSet(STORAGE_KEYS.theme, nextTheme);
});

document.getElementById("menuToggle").addEventListener("click", () => {
  const navLinks = document.getElementById("navLinks");
  const isOpen = navLinks.classList.toggle("show");
  document.getElementById("menuToggle").setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("show");
    document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".hero-image-wrap img, .feature-art img, #modalImage").forEach(image => {
  image.addEventListener("error", () => {
    image.hidden = true;
    image.parentElement.classList.add("image-fallback");
  }, { once: true });
});

document.getElementById("year").textContent = new Date().getFullYear();
applyTheme(safeGet(STORAGE_KEYS.theme, "dark"));

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("js-motion");
  motionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        motionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".feature-inner, .cta-inner, .section-heading").forEach(item => {
    item.classList.add("reveal");
    motionObserver.observe(item);
  });
}

sortSelect.addEventListener("change", renderEvents);
renderStats();
renderEvents();
