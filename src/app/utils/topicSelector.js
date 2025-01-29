import User from '@/models/User';
import connectDB from '@/lib/db';

export async function selectTopics(count = 5) {

    try {
        await connectDB();

        const users = await User.find({})

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
            bio: user.bio
        }));
    }
    catch(error) {
        console.error('Failed to fetch users:', error);
        return [];
    }
}