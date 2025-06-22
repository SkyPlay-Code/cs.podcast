import { Episode } from '../types';

/**
 * A static array of all available episodes for the "CS-11: NCERT Decoded" series.
 * This serves as our application's database.
 */
export const episodes: Episode[] = [
  {
    id: 'cs11-ch1',
    chapter: "Chapter 1",
    title: "Computer Systems",
    description: "An introduction to the basic components of a computer system, including hardware, software, data, and users.",
    audioSrc: "/audio/cs11-chapter-1.mp3",
    coverArt: "/images/cs-cover.png",
    duration: 952, // 15:52
  },
  {
    id: 'cs11-ch2',
    chapter: "Chapter 2",
    title: "Encoding Schemes and Number Systems",
    description: "Exploring how data is represented in a computer using ASCII, ISCII, Unicode, and various number systems like binary and hexadecimal.",
    audioSrc: "/audio/cs11-chapter-2.mp3",
    coverArt: "/images/cs-cover.png",
    duration: 1245, // 20:45
  },
  {
    id: 'cs11-ch3',
    chapter: "Chapter 3",
    title: "Emerging Trends",
    description: "A look into the future of computing, covering topics like Artificial Intelligence, Machine Learning, Cloud Computing, and the Internet of Things (IoT).",
    audioSrc: "/audio/cs11-chapter-3.mp3",
    coverArt: "/images/cs-cover.png",
    duration: 1180, // 19:40
  },
  // ... more episodes can be added here following the same structure.
];
