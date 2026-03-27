const ENROLLED_KEY = "learnhub_student_enrolled_ids_v1";

const courses = [
  {
    id: 1,
    title: "JavaScript Basics",
    description: "Learn variables, functions, arrays, loops, and DOM basics.",
    isFree: true,
    chapters: [
      {
        title: "Introduction to JavaScript",
        youtubeEmbed: "https://www.youtube.com/embed/W6NZfCO5SIk",
        notesLink: "https://example.com/js-intro-notes"
      },
      {
        title: "Functions and Scope",
        youtubeEmbed: "https://www.youtube.com/embed/N8ap4k_1QEQ",
        notesLink: "https://example.com/js-functions-notes"
      }
    ]
  },
  {
    id: 2,
    title: "React Frontend Masterclass",
    description: "Build modern web interfaces with components and hooks.",
    isFree: false,
    chapters: [
      {
        title: "React Setup and Tooling",
        youtubeEmbed: "https://www.youtube.com/embed/bMknfKXIFA8",
        notesLink: "https://example.com/react-setup-notes"
      },
      {
        title: "Props and State",
        youtubeEmbed: "https://www.youtube.com/embed/35lXWvCuM8o",
        notesLink: "https://example.com/react-props-state-notes"
      }
    ]
  },
  {
    id: 3,
    title: "UI/UX Design Essentials",
    description: "Learn wireframing, layout systems, and design principles.",
    isFree: true,
    chapters: [
      {
        title: "Design Thinking Overview",
        youtubeEmbed: "https://www.youtube.com/embed/_r0VX-aU_T8",
        notesLink: "https://example.com/uiux-design-thinking"
      }
    ]
  },
  {
    id: 4,
    title: "Python for Data Analysis",
    description: "Analyze data with NumPy, Pandas, and visualization tools.",
    isFree: false,
    chapters: [
      {
        title: "NumPy Basics",
        youtubeEmbed: "https://www.youtube.com/embed/QUT1VHiLmmI",
        notesLink: "https://example.com/python-numpy-notes"
      },
      {
        title: "Pandas Fundamentals",
        youtubeEmbed: "https://www.youtube.com/embed/vmEHCJofslg",
        notesLink: "https://example.com/python-pandas-notes"
      }
    ]
  }
];

const sidebarNav = document.getElementById("sidebarNav");
const sections = document.querySelectorAll(".page-section");
const allCoursesGrid = document.getElementById("allCoursesGrid");
const myCoursesGrid = document.getElementById("myCoursesGrid");
const enrolledCount = document.getElementById("enrolledCount");
const completedCount = document.getElementById("completedCount");
const ongoingCount = document.getElementById("ongoingCount");

let enrolledIds = readEnrolled();

function readEnrolled() {
  const raw = localStorage.getItem(ENROLLED_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function persistEnrolled() {
  localStorage.setItem(ENROLLED_KEY, JSON.stringify(enrolledIds));
}

function showSection(sectionId) {
  sections.forEach((section) => {
    section.classList.toggle("d-none", section.id !== sectionId);
  });
}

function getEnrolledCourses() {
  return courses.filter((course) => enrolledIds.includes(course.id));
}

function updateStats() {
  const enrolled = getEnrolledCourses();
  const totalEnrolled = enrolled.length;

  // Dummy progress logic for frontend demo.
  const completed = Math.floor(totalEnrolled / 2);
  const ongoing = Math.max(totalEnrolled - completed, 0);

  enrolledCount.textContent = String(totalEnrolled);
  completedCount.textContent = String(completed);
  ongoingCount.textContent = String(ongoing);
}

function renderAllCourses() {
  allCoursesGrid.innerHTML = courses
    .map((course) => {
      const isEnrolled = enrolledIds.includes(course.id);
      return `
        <div class="col-12 col-md-6 col-xl-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${course.title}</h5>
              <p class="card-text text-muted">${course.description}</p>
              <div class="d-flex gap-2 mt-auto">
                <button class="btn btn-success enroll-btn" data-id="${course.id}" ${isEnrolled ? "disabled" : ""}>
                  ${isEnrolled ? "Enrolled" : "Enroll"}
                </button>
                <button class="btn btn-outline-primary buy-btn" data-id="${course.id}">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  document.querySelectorAll(".enroll-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      if (!enrolledIds.includes(id)) {
        enrolledIds.push(id);
        persistEnrolled();
        syncUI();
        alert("Course enrolled successfully.");
      }
    });
  });

  document.querySelectorAll(".buy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const course = courses.find((item) => item.id === id);
      alert(`Demo purchase for "${course.title}" (frontend only).`);
    });
  });
}

function renderMyCourses() {
  const enrolled = getEnrolledCourses();
  if (enrolled.length === 0) {
    myCoursesGrid.innerHTML = `
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <p class="mb-0 text-muted">No enrolled courses yet. Go to All Courses and enroll.</p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  myCoursesGrid.innerHTML = enrolled
    .map((course) => {
      return `
        <div class="col-12 col-md-6 col-xl-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${course.title}</h5>
              <p class="card-text text-muted">${course.description}</p>
              <button class="btn btn-primary mt-auto continue-btn" data-id="${course.id}">
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  document.querySelectorAll(".continue-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      window.location.href = `student-player.html?course=${id}`;
    });
  });
}

function syncUI() {
  updateStats();
  renderAllCourses();
  renderMyCourses();
}

sidebarNav.addEventListener("click", (event) => {
  const target = event.target.closest("button[data-section]");
  if (!target) return;
  sidebarNav.querySelectorAll(".nav-link").forEach((btn) => btn.classList.remove("active"));
  target.classList.add("active");
  showSection(target.dataset.section);
});

syncUI();
