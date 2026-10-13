import resumeData from "../data/resume";

// World layout. The walker travels along -Z, starting at z = 0.
export const ROAD_HALF_WIDTH = 5;
export const SIDEWALK_WIDTH = 3.5;
export const STOP_SPACING = 34;
export const BILLBOARD_AHEAD = 12;
export const BILLBOARD_X = 9;

export const PALETTE = {
  skyTop: "#070616",
  skyMid: "#2b1452",
  horizon: "#ff7b54",
  fog: "#24123a",
  sun: "#ffb46b",
  cyan: "#3ff5ff",
  magenta: "#ff3fb4",
  amber: "#ffb648",
  violet: "#9b6bff",
  teal: "#0ea5a4",
};

// Each stop is a point on the road where the walker lingers in front of a billboard.
// side: -1 = left of the road, 1 = right, 0 = gantry spanning the road.
export const STOPS = [
  {
    id: "intro",
    label: "Start",
    side: 0,
    accent: PALETTE.cyan,
    kicker: "WELCOME TO",
    title: "DEV STREET",
    subtitle: "Population: one curious full stack developer",
  },
  {
    id: "about",
    label: "About",
    side: -1,
    accent: PALETTE.magenta,
    kicker: "01 — ABOUT",
    title: "Hello, world.",
    body: resumeData.profileSummary,
  },
  {
    id: "skills",
    label: "Skills",
    side: 1,
    accent: PALETTE.cyan,
    kicker: "02 — SKILLS",
    title: "The toolbox",
    chips: resumeData.skills,
  },
  {
    id: "experience",
    label: "Experience",
    side: -1,
    accent: PALETTE.amber,
    kicker: "03 — EXPERIENCE",
    title: resumeData.experience[0].role,
    subtitle: `${resumeData.experience[0].company}  •  ${resumeData.experience[0].period}`,
    bullets: resumeData.experience[0].highlights,
  },
  {
    id: "projects",
    label: "Projects",
    side: 1,
    accent: PALETTE.violet,
    kicker: "04 — PROJECTS",
    title: "Things I've built",
    projects: resumeData.projects,
  },
  {
    id: "education",
    label: "Education",
    side: -1,
    accent: PALETTE.cyan,
    kicker: "05 — EDUCATION",
    title: resumeData.education.school,
    subtitle: resumeData.education.degree,
    stat: { value: resumeData.education.cgpa, label: "CGPA" },
  },
  {
    id: "awards",
    label: "Awards",
    side: 1,
    accent: PALETTE.amber,
    kicker: "06 — AWARDS",
    title: "1st Place — Hackathon",
    body: resumeData.awards[0].desc,
    subtitle: "Meta Quest 2 • VR Game Development",
  },
  {
    id: "contact",
    label: "Contact",
    side: 0,
    accent: PALETTE.magenta,
    kicker: "END OF THE ROAD?",
    title: "LET'S BUILD SOMETHING",
    subtitle: "ashutosh6603@gmail.com",
  },
];

export const LAST_STOP = STOPS.length - 1;
export const stopZ = (i) => -i * STOP_SPACING;
export const ROAD_END_Z = stopZ(LAST_STOP);

// Where the walker stands at stop i, and which way he faces to read its board
// (front is -Z, so heading 0 looks straight down the road).
export const readingHeading = (i) => {
  const { position } = billboardTransform(i);
  return Math.atan2(-position[0], -(position[2] - stopZ(i)));
};

export const billboardTransform = (i) => {
  const stop = STOPS[i];
  const z = stopZ(i) - BILLBOARD_AHEAD;
  if (stop.side === 0) return { position: [0, 0, z], rotationY: 0 };
  return {
    position: [stop.side * BILLBOARD_X, 0, z],
    // Angle each board toward the centre of the road so it reads from behind the walker.
    rotationY: -stop.side * 0.5,
  };
};
