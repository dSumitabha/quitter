import users from '../../../data/users.json';

export function selectTopics(count = 5) {
    // Filter users to only include those with isAi: true
    const aiUsers = users.filter(user => user.isAi);

    // Shuffle the filtered users
    const shuffled = [...aiUsers].sort(() => 0.5 - Math.random());

    // Select the required number of users
    const selected = shuffled.slice(0, count);

    // Return array of objects with id, username, and image
    return selected.map(user => ({
        id: user.id,
        username: user.username,
        image: user.image,
    }));
}
