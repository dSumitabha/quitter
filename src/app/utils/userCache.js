const userCache = new Map();

export function getUserImage(userId, imagePath) {
    if (!userCache.has(userId)) {
        userCache.set(userId, `/path-to-image/${imagePath}`);
    }
    return userCache.get(userId);
}