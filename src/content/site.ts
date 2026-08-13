/**
 * Site-wide settings and links.
 *
 * Future execs: replace every [PLACEHOLDER] value with the real one.
 * This is the single source of truth for contact links - the header,
 * footer, and pages all read from here.
 */

export const site = {
  name: "Compete McGill",
  shortDescription:
    "McGill University's competitive programming club. We train for ICPC, run practice contests, and help students get better at solving hard problems fast.",
  heroDescription:
    "McGill University's competitive programming club. We train for ICPC, run practice contests, and help students get better at solving hard problems fast.",

  /** Paragraphs for the "who we are" panel on the home page. */
  about: [
    "Founded in 2018, Compete McGill helps students discover competitive programming and develop their problem-solving skills. Members range from first-years writing their first loops to ICPC regional competitors, and everyone trains and competes together.",
    "Every semester we run beginner and advanced training tracks, host practice contests under real ICPC rules, and prepare McGill's teams for the ICPC.",
  ],

  // TODO: replace remaining placeholders with real links before launch.
  links: {
    discord: "https://discord.gg/geSn7UvGY",
    instagram: "https://www.instagram.com/computemcgill/",
    github: "https://github.com/competemcgill",
    email: "[CLUB_EMAIL]",
  },

  /**
   * Google Calendar embed URL for the Schedule page.
   * How to get it: Google Calendar → Settings → your calendar →
   * "Integrate calendar" → copy the src of the embed iframe.
   * It looks like: https://calendar.google.com/calendar/embed?src=...
   * Leave as the placeholder to show setup instructions instead of an iframe.
   */
  calendarEmbedUrl: "[GOOGLE_CALENDAR_EMBED_URL]",

  /** Shown in the "Partner with us" strip and on /sponsorship. */
  sponsorshipEmail: "compete.mcgill@gmail.com",
};

/** The weekly rhythm table on the Schedule page. */
export const weeklyRhythm = [
  {
    day: "[DAY]",
    time: "[TIME]",
    activity: "Beginner training",
    note: "For newcomers. No prerequisites.",
  },
  {
    day: "[DAY]",
    time: "[TIME]",
    activity: "Advanced training",
    note: "Harder topics, aimed at Codeforces Div. 1/2 regulars.",
  },
  {
    day: "[DAY]",
    time: "[TIME]",
    activity: "ICPC team practice",
    note: "5-hour team simulations for ICPC candidates.",
  },
  {
    day: "Varies",
    time: "Varies",
    activity: "Practice contests & reviews",
    note: "Announced on Discord, usually every 2–3 weeks.",
  },
];
