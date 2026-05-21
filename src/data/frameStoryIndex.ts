import type { UnsplashCategory } from '../services/unsplash';

export type FrameStorySummary = {
 photoId: string;
 title: string;
 excerpt: string;
 category: UnsplashCategory;
 readTime: string;
};

export const FRAME_STORY_ORDER = [
 "J5p1E5uKjJ0",
 "pyQKxWBvpEM",
 "-sP6ygGXd2k",
 "HUIxER9U01Y",
 "6Tb53fdDxt4",
 "yMZ5Y2y5t8I",
 "Fd-VPPyI-mc",
 "QDkiMATUE-Q",
 "GMV307LlXjI",
 "2QuIKvdHNTI",
 "hihmEojaViE",
 "6Mw8IZ7x7P8",
 "cNGW82G8M7E",
 "xeCywSyt8Zc",
 "lVdaJ4tvJ3g",
 "udb2NC3sTFQ",
 "fdZmGmoWhfI",
 "HsgjlP-T4ew",
 "ASMkNFrpYgE",
 "_TDpgSSCKUY",
 "p8m1qiPTu8M",
 "K5NWFvXc2eU",
 "0wDRISJDIqE",
 "MdWfPdzZDPA",
 "Z4OQNafuuEs",
 "4tzZuPnpmcw",
 "l8whdxT7a5A",
 "Ye6PwmjGGE8",
 "ZDdCP5tEs3s",
 "bbEJt12pv0Q",
 "F8MllnZn8sY",
 "WsiutYZv9mg",
 "6B-iyeZfFbY",
 "IcGyAm1FzuE",
 "-VxvtIqU9m4",
 "3W7dvbHjhAE",
 "8dQ4ePH9IOM",
 "f4vhe1Nptws",
 "GxqKdYmg0Ow",
 "jqkZ5P-CHuc",
 "gpk9OvJglEs",
 "mPS4Ud-t9Fw",
 "GEDLwjL9wE0",
 "3hxHpCMC-SI",
 "AFhFzyPLvFU",
 "EMbXiCjwfpc",
 "fK2hrd0WrLM",
 "7PdUGlHwmh8",
 "J8XNY0LFQlA",
 "8m5GOy-gsoY",
 "LyklJe8ufj8",
 "XiYNiFp0-X8",
 "fYNJYbwpTZA",
 "FOzOkyz6u30",
 "_2OdbG4q4Wc",
 "UBNyqLn7NBM",
 "yQ45iaJcD90",
 "wk0Dm8ddxFU",
 "ebeE8yT9M7I",
 "y3Zkb5zNnCY",
 "vn-ayvTl1tQ",
 "Cnb1Q5n6IDY",
 "krwh5R4GXj0",
 "UgHPn5NBTkI",
 "Qa31NNMX9es",
 "Vvvcks9ta5A",
 "5tPHEl2Dk48",
 "Qq1NqH-RHDk",
 "B-0r8cdcHLY",
 "WK3hovzi83s",
 "VE_5dDh_sKQ",
 "UHY26OgSYQI",
 "53EcH_n1iXY",
 "e0OzhjkyOPw",
 "iGeevJWIV5o",
 "o4jMAcBKtZA",
 "bihUPrxyF9I",
 "i7nrMLaAqyw",
 "z5Za0wuto0I",
 "xmEupVYRQqw",
 "AgR5lTUA9YU",
 "0S8yBoFxwN0",
 "g2PxpIF4jR0",
 "yXFgXu2ykjs",
 "V-kiYdvrbow",
 "dUw6bWTtYuU",
 "ptZd3bq25ac",
 "k7Ng1Ljk6Hk",
 "_VkliRriDEU",
 "WoKNhPqNPCE",
 "9Q1T_objFWQ",
 "n-gAJGAT5sg",
 "bCFdUI_DQnM",
 "NtSvPzbxoWI",
 "ziKzI-Hd_pI",
 "XH5PmBAVTqc",
 "ZsvtPlUNRv4",
 "8NZRnd70I3s",
 "M7LUKbijoOY",
 "6buxNSjNsf8",
 "Sv18RPP6JuE",
 "ic1wznGQkok",
 "TBVjbMy1u94",
 "R6AwhSTwPQg",
 "T9A9Zh2ZUI0",
 "M5n-O3NFkdM",
 "6IpmwhXcaC0",
 "BbqbZJ2hRyQ",
 "aj6VNhDTan0",
 "NUlHzjhXGjQ",
 "ZRUnSLz-2rw",
 "t76E2TnJLTE",
 "eT8_HC0e970",
 "AxUGGBTFi44",
 "Mqujtys9ruU",
 "wv2KybPelME",
 "CTU7VvlHqrI",
 "M3WCMx36oZE",
 "0mMYJQPQT-M",
 "jUyVH_eNl3E",
 "vPiMDs936EA",
 "UOT3t0Gboro",
 "0b6efidqIZs",
 "YrzF2aB_Yl8",
 "MJmWSE3CslE",
 "usGRVc_-FlU",
 "REBhTWjX7cI",
 "SyfFqg00m0U",
 "iW8868s42E0",
 "NFB-JDDOgDo",
 "oScZLX0iy-A",
 "XprPmzFV-FY",
 "9sMdW58CQ7k",
 "QizmvalQn78",
 "GhGGnM-fxuw",
 "iJKXnMSZ_qI",
 "F_lc9t1GwGU",
 "NlJ_WzgannM",
 "2YjLeyK60yE",
 "-JcABHJxMto",
 "YcpQ3AVFZwI",
 "hfmQwnkgan0",
 "okGvjRnLe-I",
 "l2qeqbJaEho",
 "IKj8PjyM13E",
 "F2ueNvi4n2Y",
 "-nZoeOpaOrA",
 "EdF13Rlw9Zw",
 "nwiA-MtsNSs",
 "H-C2Go3lcJo",
 "2i0zRMSxl_M",
 "2NEtFcxbNQc",
 "D-dtxfYBemI",
 "oY_sXKTsFCw",
 "QxGO4oZm67U",
 "DsiUTYqYsIQ",
 "Eo-Vxk0RC00",
 "ECT69eJ1lqw",
 "L-f9boaeZRI",
 "YpNZJ8IOOqc",
 "9dz36grL2XE",
 "pD9DMyvvuTw",
 "MxBhlFjmgqU",
 "B96_DlGpBDU",
 "AkMRWJbG_ew",
 "fVanvaNvQMA",
 "ojA0P433DdY",
 "8sVtKLswmeM",
 "ex48YonCVA0",
 "D8wCJg9hEg8",
 "Ya4rzj4L6Lo",
 "m5RrjdQCaxA",
 "M6pfCpLuxeE",
 "cjxYDCM1Pv8",
 "hcdBXIUZI64",
 "l8MHcngK4Ww",
 "DnGY_P1Qkzc",
 "6h8zPnjqu0g",
 "zTtHoZyUVBU",
 "0enfWTUJcsM",
 "aZoun8V9N_Q",
 "hkhQALGqH4k",
 "XzWkVZKqU0M"
] as const;

export const FRAME_STORY_INDEX = {
 "J5p1E5uKjJ0": {
 "photoId": "J5p1E5uKjJ0",
 "title": "Two Cups Before Noon",
 "excerpt": "Hospitality rests in a plate, warm enough to slow the day.",
 "category": "Everyday",
 "readTime": "2 min read"
 },
 "pyQKxWBvpEM": {
 "photoId": "pyQKxWBvpEM",
 "title": "Harbor Breath",
 "excerpt": "Steel, sea, and rooftops meet where Mogadishu keeps moving.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "-sP6ygGXd2k": {
 "photoId": "-sP6ygGXd2k",
 "title": "Pink Horizon, Small Ship",
 "excerpt": "A ship crosses the blush of evening while the shore stays quiet below.",
 "category": "Light",
 "readTime": "2 min read"
 },
 "HUIxER9U01Y": {
 "photoId": "HUIxER9U01Y",
 "title": "Blue Door Breathing",
 "excerpt": "Color becomes the subject before the object reveals itself.",
 "category": "Light",
 "readTime": "2 min read"
 },
 "6Tb53fdDxt4": {
 "photoId": "6Tb53fdDxt4",
 "title": "Unfinished Self-Portrait",
 "excerpt": "The portrait withholds the face and lets gesture carry the scene.",
 "category": "Portrait",
 "readTime": "2 min read"
 },
 "yMZ5Y2y5t8I": {
 "photoId": "yMZ5Y2y5t8I",
 "title": "Balcony Geometry",
 "excerpt": "From above, the body becomes scale inside a strict little architecture.",
 "category": "Street",
 "readTime": "2 min read"
 },
 "Fd-VPPyI-mc": {
 "photoId": "Fd-VPPyI-mc",
 "title": "Garden Parliament",
 "excerpt": "Under the trees, the city lowers itself into talk and shade.",
 "category": "Everyday",
 "readTime": "2 min read"
 },
 "QDkiMATUE-Q": {
 "photoId": "QDkiMATUE-Q",
 "title": "Camel Prints On A Quiet Wall",
 "excerpt": "Two framed journeys rest quietly inside the room.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "GMV307LlXjI": {
 "photoId": "GMV307LlXjI",
 "title": "Stairwell Laughter",
 "excerpt": "The stairwell opens into laughter before anyone has time to pose.",
 "category": "Black & White",
 "readTime": "2 min read"
 },
 "2QuIKvdHNTI": {
 "photoId": "2QuIKvdHNTI",
 "title": "Cafe After Dusk",
 "excerpt": "After dusk, the storefront becomes a small room for the street.",
 "category": "Street",
 "readTime": "2 min read"
 },
 "hihmEojaViE": {
 "photoId": "hihmEojaViE",
 "title": "Tree Shadow On The Wall",
 "excerpt": "A tree writes briefly across the wall, then gives the pattern back to the day.",
 "category": "Light",
 "readTime": "2 min read"
 },
 "6Mw8IZ7x7P8": {
 "photoId": "6Mw8IZ7x7P8",
 "title": "Street In A Hurry",
 "excerpt": "The road moves faster than the buildings can answer.",
 "category": "Street",
 "readTime": "2 min read"
 },
 "cNGW82G8M7E": {
 "photoId": "cNGW82G8M7E",
 "title": "Palms At Closing Hour",
 "excerpt": "Between palms and glass, the last warmth gathers near the entrance.",
 "category": "Light",
 "readTime": "2 min read"
 },
 "xeCywSyt8Zc": {
 "photoId": "xeCywSyt8Zc",
 "title": "Night Code, Blue Hands",
 "excerpt": "Code fills the room with color, and the hand keeps moving through it.",
 "category": "Everyday",
 "readTime": "2 min read"
 },
 "lVdaJ4tvJ3g": {
 "photoId": "lVdaJ4tvJ3g",
 "title": "Red Sky Over The Block",
 "excerpt": "The sky turns red, and the building becomes a silhouette of waiting.",
 "category": "Light",
 "readTime": "2 min read"
 },
 "udb2NC3sTFQ": {
 "photoId": "udb2NC3sTFQ",
 "title": "Two Steps Looking Down",
 "excerpt": "The body enters as feet, direction, and a pause on the floor.",
 "category": "Everyday",
 "readTime": "2 min read"
 },
 "fdZmGmoWhfI": {
 "photoId": "fdZmGmoWhfI",
 "title": "Red Room, Covered Face",
 "excerpt": "The room glows red while the face withdraws from view.",
 "category": "Portrait",
 "readTime": "2 min read"
 },
 "HsgjlP-T4ew": {
 "photoId": "HsgjlP-T4ew",
 "title": "Satellite Above The Roof",
 "excerpt": "Above the roofline, a dish listens to the sky.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "ASMkNFrpYgE": {
 "photoId": "ASMkNFrpYgE",
 "title": "Blue Flag, Near Wind",
 "excerpt": "A blue field lifts, and the star comes forward like a breath.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "_TDpgSSCKUY": {
 "photoId": "_TDpgSSCKUY",
 "title": "Desk With A City Map",
 "excerpt": "Tools, music, and a city map share the same working surface.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "p8m1qiPTu8M": {
 "photoId": "p8m1qiPTu8M",
 "title": "Courtyard After Gold",
 "excerpt": "Gold slips through the courtyard and leaves the palms in silhouette.",
 "category": "Light",
 "readTime": "2 min read"
 },
 "K5NWFvXc2eU": {
 "photoId": "K5NWFvXc2eU",
 "title": "Bajaj Hour",
 "excerpt": "The road fills with red roofs, engines, and the patience of movement.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "0wDRISJDIqE": {
 "photoId": "0wDRISJDIqE",
 "title": "Figure On The Rock",
 "excerpt": "A lone figure sits where rock, sky, and evening meet.",
 "category": "Portrait",
 "readTime": "2 min read"
 },
 "MdWfPdzZDPA": {
 "photoId": "MdWfPdzZDPA",
 "title": "Terrace In Late Warmth",
 "excerpt": "The terrace catches the day at its gentlest angle.",
 "category": "Light",
 "readTime": "2 min read"
 },
 "Z4OQNafuuEs": {
 "photoId": "Z4OQNafuuEs",
 "title": "Mogadishu On The Wall",
 "excerpt": "The city becomes a circle, a coastline, and a name on the wall.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "4tzZuPnpmcw": {
 "photoId": "4tzZuPnpmcw",
 "title": "Schoolyard In Monochrome",
 "excerpt": "The school stands wide and pale while one figure moves through the open yard.",
 "category": "Black & White",
 "readTime": "2 min read"
 },
 "l8whdxT7a5A": {
 "photoId": "l8whdxT7a5A",
 "title": "Doctor In The Corridor",
 "excerpt": "The corridor brightens around a figure prepared for care.",
 "category": "Portrait",
 "readTime": "2 min read"
 },
 "Ye6PwmjGGE8": {
 "photoId": "Ye6PwmjGGE8",
 "title": "Work Seen From Behind",
 "excerpt": "The face is turned away; the work becomes the portrait.",
 "category": "Everyday",
 "readTime": "2 min read"
 },
 "ZDdCP5tEs3s": {
 "photoId": "ZDdCP5tEs3s",
 "title": "Wires Holding Sunset",
 "excerpt": "The sun falls into a net of wires, signs, and city edges.",
 "category": "Street",
 "readTime": "2 min read"
 },
 "bbEJt12pv0Q": {
 "photoId": "bbEJt12pv0Q",
 "title": "Steps Toward Class",
 "excerpt": "A single figure climbs into the school facade, small against its repeating lines.",
 "category": "Black & White",
 "readTime": "2 min read"
 },
 "F8MllnZn8sY": {
 "photoId": "F8MllnZn8sY",
 "title": "Afterlight Breath",
 "excerpt": "The image gathers distance into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "WsiutYZv9mg": {
 "photoId": "WsiutYZv9mg",
 "title": "Signal Door",
 "excerpt": "Signal Door studies archive with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "6B-iyeZfFbY": {
 "photoId": "6B-iyeZfFbY",
 "title": "Public Frame",
 "excerpt": "Public Frame studies pause with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "IcGyAm1FzuE": {
 "photoId": "IcGyAm1FzuE",
 "title": "From The Shade Of A Quiet",
 "excerpt": "A quiet photographic essay on window light, held between light, place, and the pause that made the image worth keeping.",
 "category": "Light",
 "readTime": "2 min read"
 },
 "-VxvtIqU9m4": {
 "photoId": "-VxvtIqU9m4",
 "title": "Mogadishu At Five",
 "excerpt": "Mogadishu, 5 PM ----- The sun leans low over Mogadishu, softening the street as the day slows its pace. Engines pass quietly, shops glow in patience, and the city settles into its evening calm-unrushed, alive, and at ease. The...",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "3W7dvbHjhAE": {
 "photoId": "3W7dvbHjhAE",
 "title": "Portrait Without Noise",
 "excerpt": "A Mother’s Joy - I --------------------- A mother and her child share a moment of spontaneous laughter, looking upward together as joy unfolds naturally. This image captures the lightness of their bond - a reminder that love o...",
 "category": "Portrait",
 "readTime": "2 min read"
 },
 "8dQ4ePH9IOM": {
 "photoId": "8dQ4ePH9IOM",
 "title": "Portrait Without Noise, Study",
 "excerpt": "A Mother’s Joy - II -------------------- Moments later, the same mother draws her child close, shifting from laughter to quiet presence. Their faces meet in calm connection, expressing protection, tenderness, and trust. Togeth...",
 "category": "Portrait",
 "readTime": "2 min read"
 },
 "f4vhe1Nptws": {
 "photoId": "f4vhe1Nptws",
 "title": "Portrait Without Noise, Afterlight",
 "excerpt": "The image gathers quiet expression into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Portrait",
 "readTime": "2 min read"
 },
 "GxqKdYmg0Ow": {
 "photoId": "GxqKdYmg0Ow",
 "title": "Mirror Heat",
 "excerpt": "This moment feels like a quiet conversation held between shade and sunlight. Two men sit beneath broad palms in Mogadishu, their chairs turned toward each other, wrapped in the ease of familiarity. Patterned fabrics fall acros...",
 "category": "Portrait",
 "readTime": "2 min read"
 },
 "jqkZ5P-CHuc": {
 "photoId": "jqkZ5P-CHuc",
 "title": "Blue Hour Over Mogadishu, Study",
 "excerpt": "A quiet moment between her and the morning tide. Somalia - Liido Beach The frame slows around harbor, distance, and a small editorial silence.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "gpk9OvJglEs": {
 "photoId": "gpk9OvJglEs",
 "title": "My Little Sister Our Precious Angel",
 "excerpt": "My Little Sister Our Precious Angel studies distance with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "mPS4Ud-t9Fw": {
 "photoId": "mPS4Ud-t9Fw",
 "title": "Blue Hour Over Mogadishu, Afterlight",
 "excerpt": "Blue Hour Over Mogadishu, Afterlight studies home with a restrained eye, letting Somalia stay present without forcing the scene.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "GEDLwjL9wE0": {
 "photoId": "GEDLwjL9wE0",
 "title": "Patient Horizon",
 "excerpt": "Patient Horizon keeps a quiet visual note from the archive. The frame slows around trace, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "3hxHpCMC-SI": {
 "photoId": "3hxHpCMC-SI",
 "title": "Hidden Gesture",
 "excerpt": "A quiet photographic essay on trace, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "AFhFzyPLvFU": {
 "photoId": "AFhFzyPLvFU",
 "title": "Small Portrait",
 "excerpt": "Small Portrait studies distance with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "EMbXiCjwfpc": {
 "photoId": "EMbXiCjwfpc",
 "title": "Soft Street",
 "excerpt": "The image gathers pause into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "fK2hrd0WrLM": {
 "photoId": "fK2hrd0WrLM",
 "title": "Salt Afterglow",
 "excerpt": "Salt Afterglow studies archive with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "7PdUGlHwmh8": {
 "photoId": "7PdUGlHwmh8",
 "title": "Behind The Warm Lens",
 "excerpt": "The photographer enters the frame as shadow, hand, and instrument.",
 "category": "Portrait",
 "readTime": "2 min read"
 },
 "J8XNY0LFQlA": {
 "photoId": "J8XNY0LFQlA",
 "title": "Warm Echo",
 "excerpt": "Warm Echo studies distance with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "8m5GOy-gsoY": {
 "photoId": "8m5GOy-gsoY",
 "title": "Warm Window",
 "excerpt": "Warm Window studies distance with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "LyklJe8ufj8": {
 "photoId": "LyklJe8ufj8",
 "title": "Window Interval",
 "excerpt": "A quiet photographic essay on fragment, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "XiYNiFp0-X8": {
 "photoId": "XiYNiFp0-X8",
 "title": "Small Portrait, Study",
 "excerpt": "The image gathers distance into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "fYNJYbwpTZA": {
 "photoId": "fYNJYbwpTZA",
 "title": "Quiet Light",
 "excerpt": "Quiet Light keeps a quiet visual note from the archive. The frame slows around trace, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "FOzOkyz6u30": {
 "photoId": "FOzOkyz6u30",
 "title": "Salt Portrait",
 "excerpt": "The image gathers archive into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "_2OdbG4q4Wc": {
 "photoId": "_2OdbG4q4Wc",
 "title": "Window Grammar",
 "excerpt": "The room says very little, then lets the window speak.",
 "category": "Light",
 "readTime": "2 min read"
 },
 "UBNyqLn7NBM": {
 "photoId": "UBNyqLn7NBM",
 "title": "Patient Return",
 "excerpt": "Patient Return keeps a quiet visual note from the archive. The frame slows around trace, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "yQ45iaJcD90": {
 "photoId": "yQ45iaJcD90",
 "title": "Warm Window, Study",
 "excerpt": "The image gathers distance into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "wk0Dm8ddxFU": {
 "photoId": "wk0Dm8ddxFU",
 "title": "Portrait Without Noise, Interval",
 "excerpt": "The image gathers gesture into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Portrait",
 "readTime": "2 min read"
 },
 "ebeE8yT9M7I": {
 "photoId": "ebeE8yT9M7I",
 "title": "Patient Passage",
 "excerpt": "A quiet photographic essay on trace, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "y3Zkb5zNnCY": {
 "photoId": "y3Zkb5zNnCY",
 "title": "Harbor Map",
 "excerpt": "Harbor Map studies pause with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "vn-ayvTl1tQ": {
 "photoId": "vn-ayvTl1tQ",
 "title": "Late Street Signal",
 "excerpt": "The image gathers public rhythm into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Street",
 "readTime": "2 min read"
 },
 "Cnb1Q5n6IDY": {
 "photoId": "Cnb1Q5n6IDY",
 "title": "Public Gesture",
 "excerpt": "Public Gesture studies pause with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "krwh5R4GXj0": {
 "photoId": "krwh5R4GXj0",
 "title": "Night Room",
 "excerpt": "A quiet photographic essay on silence, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "UgHPn5NBTkI": {
 "photoId": "UgHPn5NBTkI",
 "title": "Blue Hour Over Mogadishu, Interval",
 "excerpt": "A quiet photographic essay on city air, held between light, place, and the pause that made the image worth keeping.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "Qa31NNMX9es": {
 "photoId": "Qa31NNMX9es",
 "title": "Blue Hour Over Mogadishu, Return",
 "excerpt": "Walking through Città Vecchia feels like stepping into a Mogadishu memory that refuses to fade The frame slows around rooftops, distance, and a small editorial silence.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "Vvvcks9ta5A": {
 "photoId": "Vvvcks9ta5A",
 "title": "Blue Hour Over Mogadishu, Trace",
 "excerpt": "Where time whispers through the walls of Città Vecchia - Mogadishu’s soul frozen in history. The frame slows around harbor, distance, and a small editorial silence.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "5tPHEl2Dk48": {
 "photoId": "5tPHEl2Dk48",
 "title": "Where The Sky Paints Poetry And",
 "excerpt": "Where The Sky Paints Poetry And studies archive with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "Qq1NqH-RHDk": {
 "photoId": "Qq1NqH-RHDk",
 "title": "Different Angles Same Energy - Calm",
 "excerpt": "The image gathers distance into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "B-0r8cdcHLY": {
 "photoId": "B-0r8cdcHLY",
 "title": "Amber Haze",
 "excerpt": "Amber Haze The frame slows around trace, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "WK3hovzi83s": {
 "photoId": "WK3hovzi83s",
 "title": "Blue Hour Over Mogadishu, Second Note",
 "excerpt": "The Nimow Desert, just 18 kilometres northwest of Mogadishu near Jazeera Beach, is among Somalia’s most captivating natural wonders. Guests may explore its sweeping golden dunes by quad bike or embrace tradition with a camel r...",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "VE_5dDh_sKQ": {
 "photoId": "VE_5dDh_sKQ",
 "title": "Blue Hour Over Mogadishu, Quiet Version",
 "excerpt": "The image gathers home into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "UHY26OgSYQI": {
 "photoId": "UHY26OgSYQI",
 "title": "Afterlight Breath, Study",
 "excerpt": "Afterlight Breath, Study studies distance with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "53EcH_n1iXY": {
 "photoId": "53EcH_n1iXY",
 "title": "Dust Courtyard",
 "excerpt": "Dust Courtyard keeps a quiet visual note from the archive. The frame slows around silence, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "e0OzhjkyOPw": {
 "photoId": "e0OzhjkyOPw",
 "title": "Afterlight Door",
 "excerpt": "The image gathers distance into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "iGeevJWIV5o": {
 "photoId": "iGeevJWIV5o",
 "title": "Rooftop Corner",
 "excerpt": "A quiet photographic essay on silence, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "o4jMAcBKtZA": {
 "photoId": "o4jMAcBKtZA",
 "title": "Soft Street, Study",
 "excerpt": "Soft Street, Study studies pause with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "bihUPrxyF9I": {
 "photoId": "bihUPrxyF9I",
 "title": "Night Signal, Study",
 "excerpt": "The image gathers city movement into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Street",
 "readTime": "2 min read"
 },
 "i7nrMLaAqyw": {
 "photoId": "i7nrMLaAqyw",
 "title": "Night Signal, Afterlight",
 "excerpt": "Night Signal, Afterlight studies passing figures with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Street",
 "readTime": "2 min read"
 },
 "z5Za0wuto0I": {
 "photoId": "z5Za0wuto0I",
 "title": "Night Signal, Interval",
 "excerpt": "Nighttime scene with cars in front of a pizzeria. The frame slows around corners, distance, and a small editorial silence.",
 "category": "Street",
 "readTime": "2 min read"
 },
 "xmEupVYRQqw": {
 "photoId": "xmEupVYRQqw",
 "title": "Night Signal",
 "excerpt": "After dark, the street speaks in magenta, glass, and moving headlights.",
 "category": "Street",
 "readTime": "2 min read"
 },
 "AgR5lTUA9YU": {
 "photoId": "AgR5lTUA9YU",
 "title": "Courtyard Map",
 "excerpt": "Courtyard Map keeps a quiet visual note from the archive. The frame slows around trace, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "0S8yBoFxwN0": {
 "photoId": "0S8yBoFxwN0",
 "title": "Warm Window, Afterlight",
 "excerpt": "Warm Window, Afterlight studies distance with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "g2PxpIF4jR0": {
 "photoId": "g2PxpIF4jR0",
 "title": "A Book Laying On The Ground",
 "excerpt": "A quiet photographic essay on fragment, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "yXFgXu2ykjs": {
 "photoId": "yXFgXu2ykjs",
 "title": "Afterlight Tide",
 "excerpt": "Afterlight Tide studies distance with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "V-kiYdvrbow": {
 "photoId": "V-kiYdvrbow",
 "title": "Late Street",
 "excerpt": "Late Street keeps a quiet visual note from the archive. The frame slows around fragment, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "dUw6bWTtYuU": {
 "photoId": "dUw6bWTtYuU",
 "title": "Silver Rooftop",
 "excerpt": "The image gathers archive into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "ptZd3bq25ac": {
 "photoId": "ptZd3bq25ac",
 "title": "Morning Silence",
 "excerpt": "Morning Silence studies archive with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "k7Ng1Ljk6Hk": {
 "photoId": "k7Ng1Ljk6Hk",
 "title": "Warm Window, Interval",
 "excerpt": "Warm Window, Interval studies distance with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "_VkliRriDEU": {
 "photoId": "_VkliRriDEU",
 "title": "Quiet Harbor",
 "excerpt": "Quiet Harbor keeps a quiet visual note from the archive. The frame slows around trace, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "WoKNhPqNPCE": {
 "photoId": "WoKNhPqNPCE",
 "title": "Warm Rooftop",
 "excerpt": "The image gathers distance into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "9Q1T_objFWQ": {
 "photoId": "9Q1T_objFWQ",
 "title": "Narrow Horizon",
 "excerpt": "Narrow Horizon studies pause with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "n-gAJGAT5sg": {
 "photoId": "n-gAJGAT5sg",
 "title": "Narrow Return",
 "excerpt": "The image gathers pause into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "bCFdUI_DQnM": {
 "photoId": "bCFdUI_DQnM",
 "title": "Courtyard Wall",
 "excerpt": "Courtyard Wall keeps a quiet visual note from the archive. The frame slows around trace, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "NtSvPzbxoWI": {
 "photoId": "NtSvPzbxoWI",
 "title": "Silver Window",
 "excerpt": "The image gathers archive into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "ziKzI-Hd_pI": {
 "photoId": "ziKzI-Hd_pI",
 "title": "Open Street",
 "excerpt": "Open Street keeps a quiet visual note from the archive. The frame slows around trace, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "XH5PmBAVTqc": {
 "photoId": "XH5PmBAVTqc",
 "title": "Patient Horizon, Study",
 "excerpt": "A quiet photographic essay on trace, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "ZsvtPlUNRv4": {
 "photoId": "ZsvtPlUNRv4",
 "title": "Threshold Door",
 "excerpt": "A quiet photographic essay on silence, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "8NZRnd70I3s": {
 "photoId": "8NZRnd70I3s",
 "title": "Harbor Map, Study",
 "excerpt": "The image gathers pause into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "M7LUKbijoOY": {
 "photoId": "M7LUKbijoOY",
 "title": "Rooftop Corner, Study",
 "excerpt": "A quiet photographic essay on silence, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "6buxNSjNsf8": {
 "photoId": "6buxNSjNsf8",
 "title": "Courtyard Wall, Study",
 "excerpt": "A quiet photographic essay on trace, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "Sv18RPP6JuE": {
 "photoId": "Sv18RPP6JuE",
 "title": "Quiet Light, Study",
 "excerpt": "A quiet photographic essay on trace, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "ic1wznGQkok": {
 "photoId": "ic1wznGQkok",
 "title": "Still Gesture",
 "excerpt": "A quiet photographic essay on fragment, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "TBVjbMy1u94": {
 "photoId": "TBVjbMy1u94",
 "title": "Harbor Wall",
 "excerpt": "The image gathers pause into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "R6AwhSTwPQg": {
 "photoId": "R6AwhSTwPQg",
 "title": "Signal Tide",
 "excerpt": "Signal Tide studies archive with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "T9A9Zh2ZUI0": {
 "photoId": "T9A9Zh2ZUI0",
 "title": "Soft Street, Afterlight",
 "excerpt": "The image gathers pause into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "M5n-O3NFkdM": {
 "photoId": "M5n-O3NFkdM",
 "title": "Dust Courtyard, Study",
 "excerpt": "Dust Courtyard, Study keeps a quiet visual note from the archive. The frame slows around silence, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "6IpmwhXcaC0": {
 "photoId": "6IpmwhXcaC0",
 "title": "Courtyard Interval",
 "excerpt": "Courtyard Interval keeps a quiet visual note from the archive. The frame slows around trace, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "BbqbZJ2hRyQ": {
 "photoId": "BbqbZJ2hRyQ",
 "title": "Rooftop Afterglow",
 "excerpt": "Rooftop Afterglow keeps a quiet visual note from the archive. The frame slows around silence, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "aj6VNhDTan0": {
 "photoId": "aj6VNhDTan0",
 "title": "Patient Passage, Study",
 "excerpt": "Patient Passage, Study keeps a quiet visual note from the archive. The frame slows around trace, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "NUlHzjhXGjQ": {
 "photoId": "NUlHzjhXGjQ",
 "title": "Patient Passage, Afterlight",
 "excerpt": "A quiet photographic essay on trace, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "ZRUnSLz-2rw": {
 "photoId": "ZRUnSLz-2rw",
 "title": "Late Street, Study",
 "excerpt": "A quiet photographic essay on fragment, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "t76E2TnJLTE": {
 "photoId": "t76E2TnJLTE",
 "title": "Dust Courtyard, Afterlight",
 "excerpt": "Dust Courtyard, Afterlight keeps a quiet visual note from the archive. The frame slows around silence, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "eT8_HC0e970": {
 "photoId": "eT8_HC0e970",
 "title": "Courtyard Interval, Study",
 "excerpt": "Courtyard Interval, Study keeps a quiet visual note from the archive. The frame slows around trace, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "AxUGGBTFi44": {
 "photoId": "AxUGGBTFi44",
 "title": "Window Map",
 "excerpt": "A quiet photographic essay on fragment, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "Mqujtys9ruU": {
 "photoId": "Mqujtys9ruU",
 "title": "Dust Trace",
 "excerpt": "Dust Trace keeps a quiet visual note from the archive. The frame slows around silence, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "wv2KybPelME": {
 "photoId": "wv2KybPelME",
 "title": "Bright Courtyard",
 "excerpt": "The image gathers archive into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "CTU7VvlHqrI": {
 "photoId": "CTU7VvlHqrI",
 "title": "Warm Window, Return",
 "excerpt": "The image gathers distance into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "M3WCMx36oZE": {
 "photoId": "M3WCMx36oZE",
 "title": "Warm Echo, Study",
 "excerpt": "The image gathers distance into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "0mMYJQPQT-M": {
 "photoId": "0mMYJQPQT-M",
 "title": "Salt Corner",
 "excerpt": "The image gathers archive into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "jUyVH_eNl3E": {
 "photoId": "jUyVH_eNl3E",
 "title": "Warm Window, Trace",
 "excerpt": "The image gathers distance into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "vPiMDs936EA": {
 "photoId": "vPiMDs936EA",
 "title": "Narrow Return, Study",
 "excerpt": "The image gathers pause into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "UOT3t0Gboro": {
 "photoId": "UOT3t0Gboro",
 "title": "Silver Window, Study",
 "excerpt": "Silver Window, Study studies archive with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "0b6efidqIZs": {
 "photoId": "0b6efidqIZs",
 "title": "Warm Rooftop, Study",
 "excerpt": "Warm Rooftop, Study studies distance with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "YrzF2aB_Yl8": {
 "photoId": "YrzF2aB_Yl8",
 "title": "Afterlight Tide, Study",
 "excerpt": "The image gathers distance into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "MJmWSE3CslE": {
 "photoId": "MJmWSE3CslE",
 "title": "Public Shadow",
 "excerpt": "Public Shadow studies pause with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "usGRVc_-FlU": {
 "photoId": "usGRVc_-FlU",
 "title": "Tender Horizon",
 "excerpt": "A quiet photographic essay on fragment, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "REBhTWjX7cI": {
 "photoId": "REBhTWjX7cI",
 "title": "Narrow Passage",
 "excerpt": "The image gathers pause into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "SyfFqg00m0U": {
 "photoId": "SyfFqg00m0U",
 "title": "Soft Weather",
 "excerpt": "Soft Weather studies pause with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "iW8868s42E0": {
 "photoId": "iW8868s42E0",
 "title": "Late Weather",
 "excerpt": "Late Weather keeps a quiet visual note from the archive. The frame slows around fragment, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "NFB-JDDOgDo": {
 "photoId": "NFB-JDDOgDo",
 "title": "Afterlight Door, Study",
 "excerpt": "The image gathers distance into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "oScZLX0iy-A": {
 "photoId": "oScZLX0iy-A",
 "title": "Warm Echo, Afterlight",
 "excerpt": "Warm Echo, Afterlight studies distance with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "XprPmzFV-FY": {
 "photoId": "XprPmzFV-FY",
 "title": "Late Pause",
 "excerpt": "Late Pause keeps a quiet visual note from the archive. The frame slows around fragment, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "9sMdW58CQ7k": {
 "photoId": "9sMdW58CQ7k",
 "title": "Signal Tide, Study",
 "excerpt": "The image gathers archive into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "QizmvalQn78": {
 "photoId": "QizmvalQn78",
 "title": "Small Afterglow",
 "excerpt": "The image gathers distance into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "GhGGnM-fxuw": {
 "photoId": "GhGGnM-fxuw",
 "title": "Street Circle, Second Light",
 "excerpt": "Street Circle, Second Light studies passing figures with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Street",
 "readTime": "2 min read"
 },
 "iJKXnMSZ_qI": {
 "photoId": "iJKXnMSZ_qI",
 "title": "Public Stillness",
 "excerpt": "Friendship gathers in the open, bright enough to stop the street for a second.",
 "category": "Street",
 "readTime": "2 min read"
 },
 "F_lc9t1GwGU": {
 "photoId": "F_lc9t1GwGU",
 "title": "Blue Hour Over Mogadishu, Field Note",
 "excerpt": "Grace and resilience shine through-celebrating the beauty and strength of Somali Women. The frame slows around city air, distance, and a small editorial silence.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "NlJ_WzgannM": {
 "photoId": "NlJ_WzgannM",
 "title": "Threshold Breath",
 "excerpt": "A quiet photographic essay on silence, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "2YjLeyK60yE": {
 "photoId": "2YjLeyK60yE",
 "title": "Portrait Without Noise, Return",
 "excerpt": "A man with a blindfold covering his eyes The frame slows around selfhood, distance, and a small editorial silence.",
 "category": "Portrait",
 "readTime": "2 min read"
 },
 "-JcABHJxMto": {
 "photoId": "-JcABHJxMto",
 "title": "Open Weather",
 "excerpt": "A quiet photographic essay on trace, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "YcpQ3AVFZwI": {
 "photoId": "YcpQ3AVFZwI",
 "title": "Harbor Interval",
 "excerpt": "The image gathers pause into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "hfmQwnkgan0": {
 "photoId": "hfmQwnkgan0",
 "title": "Blue Light",
 "excerpt": "The image gathers pause into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "okGvjRnLe-I": {
 "photoId": "okGvjRnLe-I",
 "title": "Quiet Light, Afterlight",
 "excerpt": "A quiet photographic essay on trace, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "l2qeqbJaEho": {
 "photoId": "l2qeqbJaEho",
 "title": "Warm Window, Second Note",
 "excerpt": "Warm Window, Second Note studies distance with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "IKj8PjyM13E": {
 "photoId": "IKj8PjyM13E",
 "title": "Coastal Room",
 "excerpt": "The image gathers distance into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "F2ueNvi4n2Y": {
 "photoId": "F2ueNvi4n2Y",
 "title": "Small Afterglow, Study",
 "excerpt": "Small Afterglow, Study studies distance with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "-nZoeOpaOrA": {
 "photoId": "-nZoeOpaOrA",
 "title": "Silver Echo",
 "excerpt": "Silver Echo studies archive with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "EdF13Rlw9Zw": {
 "photoId": "EdF13Rlw9Zw",
 "title": "Warm Echo, Interval",
 "excerpt": "Warm Echo, Interval studies distance with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "nwiA-MtsNSs": {
 "photoId": "nwiA-MtsNSs",
 "title": "Late Street, Afterlight",
 "excerpt": "Late Street, Afterlight keeps a quiet visual note from the archive. The frame slows around fragment, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "H-C2Go3lcJo": {
 "photoId": "H-C2Go3lcJo",
 "title": "Tender Horizon, Study",
 "excerpt": "Tender Horizon, Study keeps a quiet visual note from the archive. The frame slows around fragment, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "2i0zRMSxl_M": {
 "photoId": "2i0zRMSxl_M",
 "title": "Soft Pause",
 "excerpt": "Soft Pause studies pause with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "2NEtFcxbNQc": {
 "photoId": "2NEtFcxbNQc",
 "title": "Afterlight Breath, Afterlight",
 "excerpt": "Afterlight Breath, Afterlight studies distance with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "D-dtxfYBemI": {
 "photoId": "D-dtxfYBemI",
 "title": "Blue Hour Over Mogadishu, Small Weather",
 "excerpt": "Blue Hour Over Mogadishu, Small Weather studies coast with a restrained eye, letting Somalia stay present without forcing the scene.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "oY_sXKTsFCw": {
 "photoId": "oY_sXKTsFCw",
 "title": "Portrait Without Noise, Trace",
 "excerpt": "Portrait Without Noise, Trace studies quiet expression with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Portrait",
 "readTime": "2 min read"
 },
 "QxGO4oZm67U": {
 "photoId": "QxGO4oZm67U",
 "title": "Warm Echo, Return",
 "excerpt": "Warm Echo, Return studies distance with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "DsiUTYqYsIQ": {
 "photoId": "DsiUTYqYsIQ",
 "title": "Quiet Threshold",
 "excerpt": "Quiet Threshold keeps a quiet visual note from the archive. The frame slows around trace, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "Eo-Vxk0RC00": {
 "photoId": "Eo-Vxk0RC00",
 "title": "Signal Tide, Afterlight",
 "excerpt": "The image gathers archive into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "ECT69eJ1lqw": {
 "photoId": "ECT69eJ1lqw",
 "title": "Quiet Light, Interval",
 "excerpt": "Quiet Light, Interval keeps a quiet visual note from the archive. The frame slows around trace, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "L-f9boaeZRI": {
 "photoId": "L-f9boaeZRI",
 "title": "Distant Window",
 "excerpt": "A quiet photographic essay on silence, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "YpNZJ8IOOqc": {
 "photoId": "YpNZJ8IOOqc",
 "title": "Bright Signal",
 "excerpt": "Bright Signal studies archive with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "9dz36grL2XE": {
 "photoId": "9dz36grL2XE",
 "title": "Window Map, Study",
 "excerpt": "Window Map, Study keeps a quiet visual note from the archive. The frame slows around fragment, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "pD9DMyvvuTw": {
 "photoId": "pD9DMyvvuTw",
 "title": "Patient Passage, Interval",
 "excerpt": "Patient Passage, Interval keeps a quiet visual note from the archive. The frame slows around trace, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "MxBhlFjmgqU": {
 "photoId": "MxBhlFjmgqU",
 "title": "Garden Courtyard",
 "excerpt": "The image gathers distance into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "B96_DlGpBDU": {
 "photoId": "B96_DlGpBDU",
 "title": "Garden Signal",
 "excerpt": "Garden Signal studies distance with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "AkMRWJbG_ew": {
 "photoId": "AkMRWJbG_ew",
 "title": "Amber Light",
 "excerpt": "Amber Light keeps a quiet visual note from the archive. The frame slows around fragment, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "fVanvaNvQMA": {
 "photoId": "fVanvaNvQMA",
 "title": "Window Wall",
 "excerpt": "A quiet photographic essay on fragment, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "ojA0P433DdY": {
 "photoId": "ojA0P433DdY",
 "title": "Signal Tide, Interval",
 "excerpt": "The image gathers archive into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "8sVtKLswmeM": {
 "photoId": "8sVtKLswmeM",
 "title": "Still Shadow",
 "excerpt": "Still Shadow keeps a quiet visual note from the archive. The frame slows around fragment, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "ex48YonCVA0": {
 "photoId": "ex48YonCVA0",
 "title": "Portrait Without Noise, Second Note",
 "excerpt": "Portrait Without Noise, Second Note studies quiet expression with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Portrait",
 "readTime": "2 min read"
 },
 "D8wCJg9hEg8": {
 "photoId": "D8wCJg9hEg8",
 "title": "Mirror Heat, Study",
 "excerpt": "Mirror Heat, Study studies gesture with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Portrait",
 "readTime": "2 min read"
 },
 "Ya4rzj4L6Lo": {
 "photoId": "Ya4rzj4L6Lo",
 "title": "Silver Rooftop, Study",
 "excerpt": "The image gathers archive into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "m5RrjdQCaxA": {
 "photoId": "m5RrjdQCaxA",
 "title": "Blue Hour Over Mogadishu 2",
 "excerpt": "Blue Hour Over Mogadishu 2 studies coast with a restrained eye, letting Somalia stay present without forcing the scene.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "M6pfCpLuxeE": {
 "photoId": "M6pfCpLuxeE",
 "title": "Blue Hour Over Mogadishu 3",
 "excerpt": "The image gathers home into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "cjxYDCM1Pv8": {
 "photoId": "cjxYDCM1Pv8",
 "title": "Embracing The Slow Pace Of Beach",
 "excerpt": "A quiet photographic essay on silence, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "hcdBXIUZI64": {
 "photoId": "hcdBXIUZI64",
 "title": "Open Weather, Study",
 "excerpt": "A quiet photographic essay on trace, held between light, place, and the pause that made the image worth keeping.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "l8MHcngK4Ww": {
 "photoId": "l8MHcngK4Ww",
 "title": "Just Watching The Clouds Make Me",
 "excerpt": "Just Watching The Clouds Make Me studies distance with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "DnGY_P1Qkzc": {
 "photoId": "DnGY_P1Qkzc",
 "title": "Salt Water Heals Everything",
 "excerpt": "The image gathers pause into a small cinematic note, simple enough to feel lived rather than staged.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "6h8zPnjqu0g": {
 "photoId": "6h8zPnjqu0g",
 "title": "Blue Hour Over Mogadishu 4",
 "excerpt": "A quiet photographic essay on city air, held between light, place, and the pause that made the image worth keeping.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "zTtHoZyUVBU": {
 "photoId": "zTtHoZyUVBU",
 "title": "The Charm Of Fishing Is That",
 "excerpt": "The Charm of fishing is that it is the pursuit of that which is elusive but attainable, a perpetual series of occasions for hope. The frame slows around silence, distance, and a small editorial silence.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "0enfWTUJcsM": {
 "photoId": "0enfWTUJcsM",
 "title": "On Wednesday I Wear Optimism",
 "excerpt": "On Wednesday I Wear Optimism studies archive with a restrained eye, letting the archive stay present without forcing the scene.",
 "category": "Memory",
 "readTime": "2 min read"
 },
 "aZoun8V9N_Q": {
 "photoId": "aZoun8V9N_Q",
 "title": "Blue Hour Over Mogadishu 5",
 "excerpt": "A quiet photographic essay on rooftops, held between light, place, and the pause that made the image worth keeping.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "hkhQALGqH4k": {
 "photoId": "hkhQALGqH4k",
 "title": "Blue Hour Over Mogadishu 6",
 "excerpt": "Blue Hour Over Mogadishu 6 studies Somali light with a restrained eye, letting Somalia stay present without forcing the scene.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 },
 "XzWkVZKqU0M": {
 "photoId": "XzWkVZKqU0M",
 "title": "Blue Hour Over Mogadishu",
 "excerpt": "A city exhales into evening, soft with distance and roofline.",
 "category": "Mogadishu",
 "readTime": "2 min read"
 }
} as const satisfies Record<string, FrameStorySummary>;

export const getFrameStorySummary = (photoId: string): FrameStorySummary | undefined =>
 FRAME_STORY_INDEX[photoId as keyof typeof FRAME_STORY_INDEX];
