/**
 * Defines the data structure for a single educational audio episode.
 */
export interface Episode {
  /**
   * A machine-readable, unique identifier for the episode.
   * Example: 'cs11-ch1'
   */
  id: string;

  /**
   * The human-readable chapter number or title.
   * Example: "Chapter 1"
   */
  chapter: string;

  /**
   * The full, descriptive title of the episode's content.
   * Example: "Introduction to Computer Systems"
   */
  title: string;

  /**
   * A brief, one or two-sentence summary of the chapter's content.
   * Used for display on episode cards.
   */
  description: string;

  /**
   * The relative or absolute URL to the audio file (e.g., MP3).
   * Example: '/audio/cs11-chapter-1.mp3'
   */
  audioSrc: string;

  /**
   * The relative or absolute URL to the episode's cover art image.
   * Can be a general cover for the whole series.
   * Example: '/images/cs-cover.png'
   */
  coverArt: string;

  /**
   * The total duration of the audio file, specified in **seconds**.
   * Example: 952 (represents 15 minutes and 52 seconds).
   * This will be used for display and progress calculation.
   */
  duration: number;
}
