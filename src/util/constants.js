export const defaultExerciseSites = [
  {
    "hostname": "www.zeeguu.org",
    "href": "https://www.zeeguu.org/whatnext",
    "pathname": "/whatnext",
    "regex": "*://*.www.zeeguu.org/*",
    "tld": "org",
    "domain": "zeeguu",
    "subdomain": "www",
    "name": "Zeeguu"
  },
  {
    "hostname": "web.hellotalk.com",
    "href": "https://web.hellotalk.com/",
    "pathname": "/",
    "regex": "*://*.web.hellotalk.com/*",
    "tld": "com",
    "domain": "hellotalk",
    "subdomain": "web",
    "name": "Hellotalk"
  },
  // 'https://www.brainscape.com/'
];

export const defaultExerciseSite = defaultExerciseSites[0];

export const defaultExerciseTime = 5; // minutes

export const exerciseTime = 5 * 60 * 1000; // 5 minutes, in ms

export const s2 = 'https://www.google.com/s2/favicons?domain=';