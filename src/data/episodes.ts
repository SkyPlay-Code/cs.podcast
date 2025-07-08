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
    audioSrc: "/audio/chatpter1.mp3", // Updated from cs11-chapter-1.mp3
    coverArt: "/images/cs1-cover.jpeg",
    duration: 1640, // 27:20 - IMPORTANT: This duration likely needs to be updated for the new .wav file
  },
  {
    id: 'cs11-ch2',
    chapter: "Chapter 2",
    title: "Encoding Schemes and Number Systems",
    description: "Exploring how data is represented in a computer using ASCII, ISCII, Unicode, and various number systems like binary and hexadecimal.",
    audioSrc: "/audio/cs11-chapter-2.mp3",
    coverArt: "/images/cs2-cover.jpeg",
    duration: 916, // 15:16
  },
  {
    id: 'cs11-ch3',
    chapter: "Chapter 3",
    title: "Emerging Computing Trends and Technologies",
    description: "introduction to key emerging trends in computer science and technology",
    audioSrc: "/audio/cs11-chapter-3.mp3",
    coverArt: "/images/cs3-cover.jpeg",
    duration: 916, // 15:16
  },
  // ... more episodes can be added here following the same structure.
];
