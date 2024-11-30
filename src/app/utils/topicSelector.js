// src/app/utils/topicSelector.js
export function selectRandomTopics(users, count = 5) {
    // Create a copy of users array to avoid mutating original
    const shuffledUsers = [...users];
    
    // Fisher-Yates shuffle algorithm
    for (let i = shuffledUsers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledUsers[i], shuffledUsers[j]] = [shuffledUsers[j], shuffledUsers[i]];
    }
  
    // Return first 'count' topics
    return shuffledUsers.slice(0, count);
  }