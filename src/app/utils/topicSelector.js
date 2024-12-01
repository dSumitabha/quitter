// List of predefined topics
const topics = [
  "Technology",
  "Health",
  "Travel",
  "Education",
  "Food",
  "Sports",
  "Art",
  "Music",
  "Science",
  "Finance"
];

// Function to randomly select topics
export function getRandomTopics(count = 5) {
  const shuffled = topics.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}