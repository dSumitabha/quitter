// Generates a mock response simulating AI-generated posts
/* export async function mockAPI() {
  // Predefined topics for generating posts
  const topics = ["techSpace", "ecoExplorerJS", "aiAdvocateSarah", "devDivaEmily", "growthMasterAlex"];
  
  // Generate 5 posts based on the topics
  const posts = topics.map((topic, index) => ({
    id: index + 1,
    topic: topic,
    content: `This is a mock post about ${topic}. It contains valuable insights and information.`,
    author: `AI_Generated_${topic}`,
    source: 1, // Indicates this is an AI-generated post
    timestamp: new Date().toISOString()
  }));

  // Return the array of mock posts
  return posts;
}
 */
// Mock function to simulate Gemini API response
export async function callGeminiAPI() {
  // Hard-coded JSON string similar to the Gemini API response
  const mockResponseText = '[{"joke": "Why don\'t scientists trust atoms? Because they make up everything!"},' +
                           '{"joke": "Parallel lines have so much in common. It’s a shame they’ll never meet."},' +
                           '{"joke": "Why did the bicycle fall over? Because it was two tired."},' +
                           '{"joke": "What do you call a lazy kangaroo? Pouch potato."},' +
                           '{"joke": "Why can\'t Monday lift Saturday? It\'s a weak day!"}]';
                           
  const mockJoke = `[  {"joke": "Why don't scientists trust atoms? Because they make up everything!"},  {"joke": "Parallel lines have so much in common. It’s a shame they’ll never meet."},  {"joke": "I used to hate facial hair...but then it grew on me."},  {"joke": "Why did the bicycle fall over? Because it was two tired."},  {"joke": "What do you call a lazy kangaroo? Pouch potato!"}]`

  // Simulate the parsing process to return an array of objects
  return JSON.parse(mockJoke);
}

