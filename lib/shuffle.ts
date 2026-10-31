/**
 * Fisher-Yates shuffle — returns a new array and never mutates the input.
 *
 * `rotateBy` shifts the result, so a timer can lead with a different item even
 * when two shuffles happen to land on the same order.
 */
export function shuffleArray<T>(items: readonly T[], rotateBy = 0): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  if (rotateBy <= 0 || shuffled.length === 0) return shuffled;
  const shift = rotateBy % shuffled.length;
  return [...shuffled.slice(shift), ...shuffled.slice(0, shift)];
}
