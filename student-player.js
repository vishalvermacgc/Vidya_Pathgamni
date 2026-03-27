const courseData = [
  {
    id: 1,
    title: "JavaScript Basics",
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

const params = new URLSearchParams(window.location.search);
const courseId = Number(params.get("course"));

const courseTitleEl = document.getElementById("courseTitle");
const chapterListEl = document.getElementById("chapterList");
const chapterTitleEl = document.getElementById("chapterTitle");
const playerFrame = document.getElementById("playerFrame");
const notesLink = document.getElementById("notesLink");

const selectedCourse = courseData.find((course) => course.id === courseId) || courseData[0];
let currentChapterIndex = 0;

function renderPlayer() {
  const chapter = selectedCourse.chapters[currentChapterIndex];
  if (!chapter) return;
  chapterTitleEl.textContent = chapter.title;
  playerFrame.src = chapter.youtubeEmbed;
  notesLink.href = chapter.notesLink;
}

function renderChapterList() {
  courseTitleEl.textContent = selectedCourse.title;
  chapterListEl.innerHTML = selectedCourse.chapters
    .map((chapter, index) => {
      const isActive = index === currentChapterIndex ? "active" : "";
      return `<button class="list-group-item list-group-item-action ${isActive}" data-index="${index}">${chapter.title}</button>`;
    })
    .join("");

  chapterListEl.querySelectorAll(".list-group-item").forEach((item) => {
    item.addEventListener("click", () => {
      currentChapterIndex = Number(item.dataset.index);
      renderChapterList();
      renderPlayer();
    });
  });
}

renderChapterList();
renderPlayer();
