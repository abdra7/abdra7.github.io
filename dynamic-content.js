const TARGET_A_XPATH = "/html/body/div/div/main/section[4]";
const TARGET_B_XPATH = "/html/body/div/div/main/div[3]/section[1]/div";

const modal = document.getElementById("project-modal");
const modalClose = document.getElementById("project-modal-close");
const modalTitle = document.getElementById("project-modal-title");
const modalDescription = document.getElementById("project-modal-description");
const modalStack = document.getElementById("project-modal-stack");
const modalJourney = document.getElementById("project-modal-journey");
const modalJourneyTitle = document.getElementById("project-modal-journey-title");
const modalJourneyDescription = document.getElementById("project-modal-journey-description");
const modalImages = document.getElementById("project-modal-images");
const modalLinks = document.getElementById("project-modal-links");

let projectsById = new Map();
let lastFocusedElement = null;

const TECH_ICONS = {
  "AWS S3": { src: "/assets/aws-s3.svg", label: "AWS" },
  CSS: { src: "https://cdn.simpleicons.org/css/663399", label: "CSS" },
  Docker: { src: "https://cdn.simpleicons.org/docker/2496ED", label: "Docker" },
  FastAPI: { src: "https://cdn.simpleicons.org/fastapi/009688", label: "FastAPI" },
  Figma: { src: "https://cdn.simpleicons.org/figma/F24E1E", label: "Figma" },
  Firebase: { src: "https://cdn.simpleicons.org/firebase/FFCA28", label: "Firebase" },
  Flutter: { src: "https://cdn.simpleicons.org/flutter/02569B", label: "Flutter" },
  Grafana: { src: "https://cdn.simpleicons.org/grafana/F46800", label: "Grafana" },
  HTML: { src: "https://cdn.simpleicons.org/html5/E34F26", label: "HTML5" },
  HTML5: { src: "https://cdn.simpleicons.org/html5/E34F26", label: "HTML5" },
  JavaScript: { src: "https://cdn.simpleicons.org/javascript/F7DF1E", label: "JavaScript" },
  MySQL: { src: "https://cdn.simpleicons.org/mysql/4479A1", label: "MySQL" },
  "Node.js": { src: "https://cdn.simpleicons.org/nodedotjs/5FA04E", label: "Node.js" },
  Ollama: { src: "https://cdn.simpleicons.org/ollama/888888", label: "Ollama" },
  PHP: { src: "https://cdn.simpleicons.org/php/777BB4", label: "PHP" },
  PostgreSQL: { src: "https://cdn.simpleicons.org/postgresql/4169E1", label: "PostgreSQL" },
  Prometheus: { src: "https://cdn.simpleicons.org/prometheus/E6522C", label: "Prometheus" },
  Python: { src: "https://cdn.simpleicons.org/python/3776AB", label: "Python" },
  Qdrant: { src: "https://cdn.simpleicons.org/qdrant/DC244C", label: "Qdrant" },
  Streamlit: { src: "https://cdn.simpleicons.org/streamlit/FF4B4B", label: "Streamlit" },
  "TensorFlow / Keras": { src: "https://cdn.simpleicons.org/tensorflow/FF6F00", label: "TensorFlow" },
  "UI/UX Design": { src: "https://cdn.simpleicons.org/figma/F24E1E", label: "Figma" }
};

const PROJECT_ORDER = [
  "lycosa",
  "darbak",
  "visit-system",
  "safehear-ai",
  "sahilha",
  "public-library"
];

function getElementByXPath(xpath) {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

function waitForTargets() {
  return new Promise((resolve, reject) => {
    const findTargets = () => {
      const targetA = getElementByXPath(TARGET_A_XPATH);
      const targetB = getElementByXPath(TARGET_B_XPATH);
      return targetA && targetB ? { targetA, targetB } : null;
    };

    const existingTargets = findTargets();
    if (existingTargets) {
      resolve(existingTargets);
      return;
    }

    const timeout = window.setTimeout(() => {
      observer.disconnect();
      reject(new Error("Dynamic content targets were not found."));
    }, 10000);

    const observer = new MutationObserver(() => {
      const targets = findTargets();
      if (!targets) return;

      window.clearTimeout(timeout);
      observer.disconnect();
      resolve(targets);
    });

    observer.observe(document.getElementById("root"), {
      childList: true,
      subtree: true
    });
  });
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

function createTechIcon(technology) {
  const iconData = TECH_ICONS[technology];
  if (!iconData) return null;

  const icon = document.createElement("img");
  icon.className = "portfolio-tech-icon";
  icon.src = iconData.src;
  icon.alt = `${iconData.label} logo`;
  icon.title = technology;
  icon.loading = "lazy";
  icon.decoding = "async";
  icon.addEventListener("error", () => {
    icon.hidden = true;
  });
  return icon;
}

function enhanceExistingTechStacks() {
  document.querySelectorAll('ul[aria-label="Tech stack"] li').forEach((item) => {
    if (item.querySelector(".portfolio-tech-icon")) return;
    const icon = createTechIcon(item.textContent.trim());
    if (icon) item.prepend(icon);
  });
}

function replaceText(root, search, replacement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    if (node.nodeValue.includes(search)) {
      node.nodeValue = node.nodeValue.replaceAll(search, replacement);
    }
    node = walker.nextNode();
  }
}

function updatePortfolioContent(portfolio, certificates) {
  document.title = `${portfolio.name} — ${portfolio.professionalTitle}`;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content = `الموقع الرسمي لعبدالرحيم راشد الحربي، مهندس برمجيات ومتخصص في الذكاء الاصطناعي. Official portfolio of software engineer ${portfolio.name}.`;
  }

  replaceText(document.body, "Software Engineer & UI/UX Designer", portfolio.professionalTitle);

  const expertiseIntro = [...document.querySelectorAll("#expertise p")].find((element) =>
    element.textContent.startsWith("Grouped from my CV")
  );
  if (expertiseIntro) {
    expertiseIntro.textContent = "Software engineering, AI and machine learning, data platforms, and dependable delivery practices.";
  }

  const expertiseCards = document.querySelectorAll("#expertise article");
  portfolio.skills.forEach((skill, index) => {
    const card = expertiseCards[index];
    if (!card) return;

    const heading = card.querySelector("h3");
    if (heading) heading.textContent = skill.title;

    const lines = card.querySelectorAll("li span:last-child");
    skill.lines.forEach((line, lineIndex) => {
      if (lines[lineIndex]) lines[lineIndex].textContent = line;
    });
  });

  const about = document.getElementById("about");
  if (about) {
    const aboutParagraphs = [...about.querySelectorAll("p")];
    const bio = aboutParagraphs.find((element) => element.textContent.startsWith("I design clear"));
    const strengths = aboutParagraphs.find((element) => element.textContent.startsWith("Core strengths mirror"));
    const focus = aboutParagraphs.find((element) => element.textContent.startsWith("UI/UX, front-end"));

    if (bio) bio.textContent = portfolio.aboutSummary;
    if (strengths) strengths.textContent = portfolio.professionalSummary;
    if (focus) focus.textContent = "Software engineering, distributed AI agents, RAG, machine learning, backend APIs, data platforms, and reliable product delivery.";

    const languageRows = about.querySelectorAll("li");
    portfolio.languages.forEach((language, index) => {
      const row = languageRows[index];
      if (!row) return;
      const values = row.querySelectorAll("span");
      if (values[0]) values[0].textContent = language.name;
      if (values[1]) values[1].textContent = language.level;
    });

  }

  const journey = document.getElementById("journey");
  if (journey) {
    const entries = journey.querySelectorAll(":scope > div.space-y-0 > div");

    portfolio.experience.forEach((experience, index) => {
      const entry = entries[index];
      if (!entry) return;

      const heading = entry.querySelector("h3");
      const period = entry.querySelector("div:first-child p:nth-child(2)");
      const bullets = entry.querySelectorAll("li span:last-child");
      if (heading) heading.textContent = experience.title;
      if (period) period.textContent = experience.period;
      experience.bullets.forEach((bullet, bulletIndex) => {
        if (bullets[bulletIndex]) bullets[bulletIndex].textContent = bullet;
      });
    });

    const educationEntry = entries[2];
    if (educationEntry) {
      const heading = educationEntry.querySelector("h3");
      const period = educationEntry.querySelector("div:first-child p:nth-child(2)");
      const degree = [...educationEntry.querySelectorAll("p")].find((element) =>
        element.textContent.includes("Bachelor")
      );
      if (heading) heading.textContent = portfolio.education.institution;
      if (period) period.textContent = portfolio.education.period;
      if (degree) degree.textContent = portfolio.education.degree;
    }

    const certificationsLabel = [...journey.querySelectorAll("p")].find(
      (element) => element.textContent.trim() === "Certifications"
    );
    const certificationGrid = certificationsLabel?.nextElementSibling;
    if (certificationGrid) {
      const existingRows = [...certificationGrid.children];
      certificates.forEach((certificate, index) => {
        let row = existingRows[index];
        if (!row && existingRows.length) {
          row = existingRows[0].cloneNode(true);
          certificationGrid.append(row);
        }
        const text = row?.querySelector("span:last-child");
        if (text) text.textContent = `${certificate.title} — ${certificate.issuer}`;
      });
    }
  }

  const contact = document.getElementById("contact");
  if (contact) {
    const pitch = [...contact.querySelectorAll("p")].find((element) =>
      element.textContent.startsWith("If you're hiring")
    );
    if (pitch) pitch.textContent = portfolio.contactPitch;

    const linkedin = contact.querySelector('a[href*="linkedin.com"]');
    if (linkedin) {
      linkedin.href = portfolio.linkedin;
      const label = linkedin.querySelector("span:last-child");
      if (label) label.textContent = "abdulrahim-rashid";
    }
  }

  window.setTimeout(() => {
    const labels = [...document.querySelectorAll("main section p")];
    const certificationLabel = labels.find((element) =>
      element.textContent.trim() === "Professional certifications"
    );
    if (certificationLabel?.previousElementSibling) {
      certificationLabel.previousElementSibling.textContent = String(portfolio.certificationCount);
    }

    const graduationLabel = labels.find((element) =>
      element.textContent.trim() === "Graduating — Computer Science"
    );
    if (graduationLabel) graduationLabel.textContent = "Computer Science graduate — 2026";
  }, 1700);
}

function renderCertificates(target, certificates) {
  const block = document.createElement("div");
  block.className = "hair mt-14 border-t pt-10";
  block.dataset.dynamicContent = "certificates";

  block.append(
    createTextElement(
      "p",
      "text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-strong",
      "Certificates"
    )
  );

  const grid = document.createElement("div");
  grid.className = "mt-5 grid gap-x-8 sm:grid-cols-2";

  certificates.forEach((certificate) => {
    const item = document.createElement("article");
    item.className = "hair border-b py-4 text-sm text-brand-heading";

    const heading = createTextElement(
      "h3",
      "font-medium text-brand-heading",
      certificate.title
    );
    const issuer = createTextElement(
      "p",
      "mt-1 text-xs uppercase tracking-[0.08em] text-brand-muted",
      certificate.issuer
    );
    const description = createTextElement(
      "p",
      "mt-2 text-sm leading-relaxed text-brand-text",
      certificate.description
    );

    item.append(heading, issuer, description);

    grid.append(item);
  });

  block.append(grid);
  target.append(block);
}

function renderProjectBadges(target, projects) {
  const block = document.createElement("div");
  block.className = "portfolio-projects hair mt-10 border-t pt-10";
  block.dataset.dynamicContent = "project-badges";

  block.append(
    createTextElement(
      "p",
      "text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-strong",
      "Projects"
    )
  );

  const badgeList = document.createElement("div");
  badgeList.className = "portfolio-projects__grid";

  const orderedProjects = [...projects].sort(
    (first, second) => PROJECT_ORDER.indexOf(first.id) - PROJECT_ORDER.indexOf(second.id)
  );

  orderedProjects.forEach((project) => {
    const badge = document.createElement("button");
    badge.type = "button";
    badge.className = "portfolio-project-card";
    badge.dataset.projectId = project.id;
    badge.setAttribute("aria-haspopup", "dialog");
    badge.setAttribute("aria-label", `Open ${project.badgeLabel} project details`);

    const title = createTextElement("span", "portfolio-project-card__title", project.badgeLabel);
    const body = document.createElement("span");
    body.className = "portfolio-project-card__body";

    const previewImage = project.images?.[0];
    if (previewImage) {
      const preview = document.createElement("img");
      preview.className = "portfolio-project-card__preview";
      preview.src = previewImage.src;
      preview.alt = previewImage.alt;
      preview.loading = "lazy";
      preview.decoding = "async";
      preview.referrerPolicy = "no-referrer";
      body.append(preview);
    } else {
      const placeholder = document.createElement("span");
      placeholder.className = "portfolio-project-card__placeholder";
      placeholder.append(createTextElement("span", "portfolio-project-card__action", "Project preview coming soon"));
      body.append(placeholder);
    }

    const footer = document.createElement("span");
    footer.className = "portfolio-project-card__footer";
    footer.setAttribute("aria-label", `${project.badgeLabel} technology stack`);

    footer.append(createTextElement("span", "portfolio-project-card__summary", project.summary));

    const technologyIcons = document.createElement("span");
    technologyIcons.className = "portfolio-project-card__technologies";

    (project.techStack ?? []).slice(0, 4).forEach((technology) => {
      const icon = createTechIcon(technology);
      if (icon) technologyIcons.append(icon);
    });

    if (!technologyIcons.children.length) {
      technologyIcons.append(createTextElement("span", "portfolio-project-card__fallback", "Software project"));
    }

    footer.append(technologyIcons);

    badge.append(title, body, footer);
    badgeList.append(badge);
  });

  badgeList.addEventListener("click", (event) => {
    const badge = event.target.closest("[data-project-id]");
    if (!badge) return;

    const project = projectsById.get(badge.dataset.projectId);
    if (project) openProjectModal(project, badge);
  });

  block.append(badgeList);
  const work = document.getElementById("work");
  (work ?? target).prepend(block);

  ["darbak", "visit-system"].forEach((sectionId) => {
    const legacySection = document.getElementById(sectionId);
    if (legacySection) legacySection.hidden = true;
  });

  document.querySelectorAll('a[href="#darbak"], a[href="#visit-system"]').forEach((link) => {
    link.href = "#work";
  });
}

function startFeaturedImageRotation(projects) {
  const imageSlots = [
    document.querySelector('img[alt="Darbak logistics platform interface"]'),
    document.querySelector('img[alt="Visit System operations interface"]')
  ].filter(Boolean);

  const imagePool = projects.flatMap((project) =>
    (project.images ?? []).map((imageData) => ({
      ...imageData,
      projectTitle: project.badgeLabel ?? project.title
    }))
  );

  if (imageSlots.length !== 2 || imagePool.length < 2) return;

  let cursor = 0;
  let isUpdating = false;

  const preloadImage = (imageData) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(imageData);
      image.onerror = reject;
      image.referrerPolicy = "no-referrer";
      image.src = imageData.src;
    });

  const rotateImages = async () => {
    if (document.hidden || isUpdating) return;
    isUpdating = true;

    const nextImages = imageSlots.map(
      (_, index) => imagePool[(cursor + index) % imagePool.length]
    );

    try {
      const loadedImages = await Promise.all(nextImages.map(preloadImage));

      imageSlots.forEach((slot, index) => {
        const imageData = loadedImages[index];
        slot.src = imageData.src;
        slot.alt = `${imageData.projectTitle} — ${imageData.alt}`;
        slot.referrerPolicy = "no-referrer";

        const caption = slot.closest("figure")?.querySelector("figcaption");
        if (caption) {
          caption.textContent = `${imageData.projectTitle} — ${imageData.caption}`;
        }
      });

      cursor = (cursor + imageSlots.length) % imagePool.length;
    } catch (error) {
      cursor = (cursor + 1) % imagePool.length;
      console.warn("A featured project image could not be loaded.", error);
    } finally {
      isUpdating = false;
    }
  };

  window.setInterval(rotateImages, 3000);
}

function openProjectModal(project, trigger) {
  lastFocusedElement = trigger;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalStack.replaceChildren();
  modalImages.replaceChildren();
  modalLinks.replaceChildren();

  const hasVisualJourney = project.images.length > 0;
  modalJourney.hidden = !hasVisualJourney;
  modalJourneyTitle.textContent = project.visualJourney?.title ?? `${project.title} visual journey`;
  modalJourneyDescription.textContent = project.visualJourney?.description ?? "Explore the primary interfaces and product experience.";

  (project.techStack ?? []).forEach((technology) => {
    const chip = document.createElement("span");
    chip.className = "project-modal__tech-chip";
    const icon = createTechIcon(technology);
    if (icon) chip.append(icon);
    chip.append(document.createTextNode(technology));
    modalStack.append(chip);
  });

  project.images.forEach((imageData) => {
    const figure = document.createElement("figure");
    figure.className = "project-modal__figure";

    const image = document.createElement("img");
    image.src = imageData.src;
    image.alt = imageData.alt;
    image.loading = "lazy";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";

    const caption = document.createElement("figcaption");
    const captionTitle = document.createElement("strong");
    captionTitle.textContent = imageData.caption;
    caption.append(captionTitle);

    if (imageData.description) {
      const captionDescription = document.createElement("span");
      captionDescription.textContent = imageData.description;
      caption.append(captionDescription);
    }
    figure.append(image, caption);
    modalImages.append(figure);
  });

  const projectLinks = project.links ?? [];

  projectLinks.forEach((linkData) => {
    const link = document.createElement("a");
    link.href = linkData.href;
    link.textContent = `${linkData.label} →`;
    link.target = "_blank";
    link.rel = "noreferrer";
    modalLinks.append(link);
  });

  modal.hidden = false;
  modal.scrollTop = 0;
  modalClose.focus();
}

function closeProjectModal() {
  modal.hidden = true;
  modalStack.replaceChildren();
  modalJourney.hidden = true;
  modalImages.replaceChildren();
  modalLinks.replaceChildren();
  lastFocusedElement?.focus();
  lastFocusedElement = null;
}

modalClose.addEventListener("click", closeProjectModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeProjectModal();
});

modal.addEventListener(
  "wheel",
  (event) => {
    if (modal.hidden) return;
    modal.scrollTop += event.deltaY;
    event.preventDefault();
    event.stopPropagation();
  },
  { passive: false }
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeProjectModal();
});

async function initializeDynamicContent() {
  const [response, targets] = await Promise.all([
    fetch("/data.json", { headers: { Accept: "application/json" } }),
    waitForTargets()
  ]);

  if (!response.ok) {
    throw new Error(`Unable to load data.json (${response.status}).`);
  }

  const data = await response.json();
  projectsById = new Map(data.projects.map((project) => [project.id, project]));

  updatePortfolioContent(data.portfolio, data.certificates);
  enhanceExistingTechStacks();
  renderCertificates(targets.targetA, data.certificates);
  renderProjectBadges(targets.targetB, data.projects);
  startFeaturedImageRotation(data.projects);
}

initializeDynamicContent().catch((error) => {
  console.error("Dynamic portfolio content could not be initialized:", error);
});
