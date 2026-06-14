/* ============================================================
   TEERAKHUB — DATA FILE
   ============================================================
   This is the ONLY file you need to edit to add/update content.
   Everything below is plain text and lists — follow the same
   pattern as the examples and the site will update itself.

   IMAGES: Put your image files in an "images" folder next to
   index.html, then reference them like "images/mylakorn.jpg".
   You can also paste a direct image URL from the internet.
   ============================================================ */


/* ------------------------------------------------------------
   1. DAILY QUOTE
   Change the text + author whenever you like. This shows in
   the banner at the very top of the site.
------------------------------------------------------------- */
const DAILY_QUOTE = {
  text: "Some love stories aren't written to end — they're written to be remembered.",
  author: "Teerakhub"
};


/* ------------------------------------------------------------
   2. SERIES & FILMS
   ------------------------------------------------------------
   Each entry is one show or film. Fields:

   id            -> unique short code, no spaces (e.g. "gap-here")
   title         -> name of the show
   type          -> "series" or "film"
   genre         -> "GL", "BL", "WLW", or "Queer"
   country       -> e.g. "Thailand", "Korea", "Philippines"
   poster        -> path/URL to poster image
   couplePhoto   -> path/URL to a photo of the main couple
   yearStart     -> year it started airing
   yearEnd       -> year it ended (leave same as yearStart if one
                     season / movie, or "ongoing" if still airing)
   happyEnding   -> true, false, or "unknown" if you don't know yet
   watchOn       -> array of platforms, e.g. ["YouTube", "Viki"]
   studio        -> production company / studio name
   cast          -> array of { character, actor }
------------------------------------------------------------- */
const SERIES = [
  {
    id: "girl-from-nowhere",
    title: "Girl From Nowhere",
    type: "series",
    genre: "WLW",
    country: "Thailand",
    poster: "images/placeholder-poster.jpg",
    couplePhoto: "images/placeholder-couple.jpg",
    yearStart: 2018,
    yearEnd: 2021,
    happyEnding: "unknown",
    watchOn: ["Netflix"],
    studio: "GMMTV",
    cast: [
      { character: "Nanno", actor: "Chicha Amatayakul" },
      { character: "Yuri", actor: "Sherina Hermana" }
    ]
  },
  {
    id: "bad-buddy",
    title: "Bad Buddy",
    type: "series",
    genre: "BL",
    country: "Thailand",
    poster: "images/placeholder-poster.jpg",
    couplePhoto: "images/placeholder-couple.jpg",
    yearStart: 2021,
    yearEnd: 2021,
    happyEnding: true,
    watchOn: ["YouTube", "iQIYI"],
    studio: "GMMTV",
    cast: [
      { character: "Pat", actor: "Nattawin Wattanagitiphat" },
      { character: "Pran", actor: "Pawat Chittsawangdee" }
    ]
  },
  {
    id: "love-syndrome",
    title: "Love Syndrome",
    type: "series",
    genre: "GL",
    country: "Korea",
    poster: "images/placeholder-poster.jpg",
    couplePhoto: "images/placeholder-couple.jpg",
    yearStart: 2022,
    yearEnd: 2022,
    happyEnding: true,
    watchOn: ["Viki"],
    studio: "Sample Studio",
    cast: [
      { character: "Soo-jin", actor: "Actor Name" },
      { character: "Ji-eun", actor: "Actor Name" }
    ]
  },
    {
    id: "enemies-with-benefits",
    title: "Enemies with Benefits",
    type: "series",
    genre: "GL",
    country: "Thailand",
    poster: "ewb-poster.jpg",
    couplePhoto: "images/placeholder-couple.jpg",
    yearStart: 2026,
    yearEnd: 2026,
    happyEnding: "unknown",
    watchOn: ["GMMTV YouTube"],
    studio: "GMMTV",
    cast: [
      { character: "Lal", actor: "Jan Ployshompoo Supasap" },
      { character: "Wine", actor: "JingJing Prariyapit Yu" }
    ]
}
];


/* ------------------------------------------------------------
   3. ACTORS
   ------------------------------------------------------------
   id       -> unique short code
   name     -> real name
   gender   -> "Female" or "Male"
   country  -> country they're from / work in
   photo    -> path/URL to a photo
   bio      -> short description (optional, can leave as "")
   works    -> array of series ids from the SERIES list above
               (these create automatic links to the show pages)
------------------------------------------------------------- */
const ACTORS = [
  {
    id: "chicha",
    name: "Chicha Amatayakul",
    gender: "Female",
    country: "Thailand",
    photo: "images/placeholder-actor.jpg",
    bio: "",
    works: ["girl-from-nowhere"]
  },
  {
    id: "sherina",
    name: "Sherina Hermana",
    gender: "Female",
    country: "Thailand",
    photo: "images/placeholder-actor.jpg",
    bio: "",
    works: ["girl-from-nowhere"]
  },
  {
    id: "nattawin",
    name: "Nattawin Wattanagitiphat",
    gender: "Male",
    country: "Thailand",
    photo: "images/placeholder-actor.jpg",
    bio: "",
    works: ["bad-buddy"]
  },
  {
    id: "pawat",
    name: "Pawat Chittsawangdee",
    gender: "Male",
    country: "Thailand",
    photo: "images/placeholder-actor.jpg",
    bio: "",
    works: ["bad-buddy"]
  }
  /* Copy a block above to add a new actor. */
];


/* ------------------------------------------------------------
   4. STICKER PACKS
   ------------------------------------------------------------
   title    -> name of the pack
   genre    -> "GL" or "BL"
   image    -> a preview image / thumbnail for the pack
   link     -> the download / WhatsApp sticker link
------------------------------------------------------------- */
const STICKERS = [
  {
    title: "GL Hearts Pack",
    genre: "GL",
    image: "images/placeholder-sticker.jpg",
    link: "#"
  },
  {
    title: "BL Classic Pack",
    genre: "BL",
    image: "images/placeholder-sticker.jpg",
    link: "#"
  }
  /* Copy a block above to add a new sticker pack. */
];


/* ------------------------------------------------------------
   5. SUGGESTIONS FORM
   ------------------------------------------------------------
   Replace YOUR_FORM_ID with your own Formspree form ID.
   Steps:
   1. Go to formspree.io and create a free account
   2. Create a new form, it gives you a URL like:
      https://formspree.io/f/abc12345
   3. Copy just the "abc12345" part below.
------------------------------------------------------------- */
const FORMSPREE_ID = "YOUR_FORM_ID";
