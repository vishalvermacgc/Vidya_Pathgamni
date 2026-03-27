const sidebarNav = document.getElementById("sidebarNav");
const sectionEls = document.querySelectorAll(".dashboard-section");
const addCourseForm = document.getElementById("addCourseForm");
const addChapterForm = document.getElementById("addChapterForm");
const chapterCourseSelect = document.getElementById("chapterCourseSelect");
const myCoursesGrid = document.getElementById("myCoursesGrid");

const totalCoursesStat = document.getElementById("totalCoursesStat");
const totalStudentsStat = document.getElementById("totalStudentsStat");
const totalChaptersStat = document.getElementById("totalChaptersStat");

const courses = [
  {
    id: 1,
    title: "JavaScript Basics",
    description: "Learn JavaScript fundamentals from scratch.",
    students: 120,
    chapters: [
      {
        title: "Intro to JS",
        youtubeUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
        documentLink: "https://example.com/js-intro-notes"
      }
    ]
  },
  {
    id: 2,
    title: "React for Beginners",
    description: "Build modern UI with React and components.",
    students: 95,
    chapters: [
      {
        title: "React Setup",
        youtubeUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8",
        documentLink: "https://example.com/react-setup-doc"
      },
      {
        title: "JSX and Props",
        youtubeUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
        documentLink: "https://example.com/jsx-props-doc"
      }
    ]
  }
];

let nextCourseId = 3;

function showSection(sectionId) {
  sectionEls.forEach((section) => {
    const isTarget = section.id === sectionId;
    section.classList.toggle("d-none", !isTarget);
  });
}

function updateStats() {
  const totalCourses = courses.length;
  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
  const totalChapters = courses.reduce((sum, course) => sum + course.chapters.length, 0);

  totalCoursesStat.textContent = String(totalCourses);
  totalStudentsStat.textContent = String(totalStudents);
  totalChaptersStat.textContent = String(totalChapters);
}

function updateCourseDropdown() {
  chapterCourseSelect.innerHTML = "";
  if (courses.length === 0) {
    chapterCourseSelect.innerHTML = `<option value="">No courses available</option>`;
    chapterCourseSelect.disabled = true;
    return;
  }

  chapterCourseSelect.disabled = false;
  courses.forEach((course) => {
    const option = document.createElement("option");
    option.value = String(course.id);
    option.textContent = course.title;
    chapterCourseSelect.appendChild(option);
  });
}

function renderCourses() {
  if (courses.length === 0) {
    myCoursesGrid.innerHTML = `
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <p class="mb-0 text-muted">No courses created yet.</p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  myCoursesGrid.innerHTML = courses
    .map((course) => {
      return `
        <div class="col-12 col-md-6 col-xl-4">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${course.title}</h5>
              <p class="card-text text-muted mb-3">${course.description}</p>
              <button class="btn btn-outline-primary mt-auto view-chapters-btn" data-course-id="${course.id}">
                View Chapters
              </button>
              <div class="chapter-box mt-3 d-none" id="chapter-box-${course.id}">
                <ul class="chapter-list">
                  ${course.chapters
                    .map(
                      (chapter) =>
                        `<li><strong>${chapter.title}</strong> - <a href="${chapter.youtubeUrl}" target="_blank" rel="noreferrer">Video</a> | <a href="${chapter.documentLink}" target="_blank" rel="noreferrer">Doc</a></li>`
                    )
                    .join("")}
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  const viewButtons = document.querySelectorAll(".view-chapters-btn");
  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const courseId = Number(btn.dataset.courseId);
      const box = document.getElementById(`chapter-box-${courseId}`);
      box.classList.toggle("d-none");
      btn.textContent = box.classList.contains("d-none") ? "View Chapters" : "Hide Chapters";
    });
  });
}

function syncUI() {
  updateStats();
  updateCourseDropdown();
  renderCourses();
}

sidebarNav.addEventListener("click", (event) => {
  const target = event.target.closest("button[data-section]");
  if (!target) return;

  const allButtons = sidebarNav.querySelectorAll(".nav-link");
  allButtons.forEach((btn) => btn.classList.remove("active"));
  target.classList.add("active");

  showSection(target.dataset.section);
});

addCourseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("courseTitle").value.trim();
  const description = document.getElementById("courseDescription").value.trim();
  if (!title || !description) return;

  courses.push({
    id: nextCourseId++,
    title,
    description,
    students: Math.floor(Math.random() * 150) + 30,
    chapters: []
  });

  addCourseForm.reset();
  syncUI();
  alert("Course created.");
});

addChapterForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const courseId = Number(chapterCourseSelect.value);
  const chapterTitle = document.getElementById("chapterTitle").value.trim();
  const youtubeUrl = document.getElementById("youtubeUrl").value.trim();
  const documentLink = document.getElementById("documentLink").value.trim();
  if (!courseId || !chapterTitle || !youtubeUrl || !documentLink) return;

  const course = courses.find((item) => item.id === courseId);
  if (!course) return;

  course.chapters.push({
    title: chapterTitle,
    youtubeUrl,
    documentLink
  });

  addChapterForm.reset();
  chapterCourseSelect.value = String(courseId);
  syncUI();
  alert("Chapter added.");
});

syncUI();
