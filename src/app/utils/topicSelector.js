import users from '../../../data/users.json';

export function selectTopics(count = 5) {
    const shuffled = [...users].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);
 
    return selected.reduce((acc, user) => {
        acc[user.username] = true;
        return acc;
    }, {});
}