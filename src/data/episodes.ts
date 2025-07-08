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
    duration: 0, // 27:20 - IMPORTANT: This duration likely needs to be updated for the new .wav file
  },
  {
    id: 'cs11-ch2',
    chapter: "Chapter 2",
    title: "Encoding Schemes and Number Systems",
    description: "Exploring how data is represented in a computer using ASCII, ISCII, Unicode, and various number systems like binary and hexadecimal.",
    audioSrc: "/audio/cs11-chapter-2.mp3",
    coverArt: "/images/cs2-cover.jpeg",
    duration: 0, // 15:16
  },
  // ... more episodes can be added here following the same structure.
];
