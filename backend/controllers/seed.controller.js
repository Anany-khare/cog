import { User } from '../models/user.model.js';
import { Post } from '../models/post.model.js';

// Sample data to be added to the database
const sampleUsers = [
    {
        username: 'JohnDoe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'gamer',
        profilepic: 'https://i.pravatar.cc/150?u=john'
    },
    {
        username: 'JaneSmith',
        email: 'jane.smith@example.com',
        password: 'password123',
        role: 'gamer',
        profilepic: 'https://i.pravatar.cc/150?u=jane'
    }
];

const samplePosts = [
    {
        caption: 'Loving the new Valorant update! #gaming #valorant',
        image: 'https://images.unsplash.com/photo-1618090584212-b53a5b186b4c?q=80&w=2070&auto=format&fit=crop',
    },
    {
        caption: 'Just hit Ace in BGMI! What a grind.',
        image: 'https://images.unsplash.com/photo-1593305842551-12c855a8039c?q=80&w=1974&auto=format&fit=crop',
    }
];

// Controller to handle the database seeding
export const seedDatabase = async (req, res) => {
    try {
        // Clear existing posts and users to prevent duplicates
        await Post.deleteMany({});
        await User.deleteMany({});

        // Create new users. We use a loop and .create() to ensure the password hashing pre-save hook is triggered.
        const createdUsers = [];
        for (const userData of sampleUsers) {
            const user = await User.create(userData);
            createdUsers.push(user);
        }

        // Create new posts and assign them to the users we just created
        const postsToCreate = samplePosts.map((post, index) => ({
            ...post,
            author: createdUsers[index % createdUsers.length]._id,
        }));
        const createdPosts = await Post.insertMany(postsToCreate);

        // Add the created posts to each user's `posts` array
        for (const post of createdPosts) {
            const author = await User.findById(post.author);
            if (author) {
                author.posts.push(post._id);
                await author.save();
            }
        }

        return res.status(200).json({ 
            message: 'Database seeded successfully!', 
            users: createdUsers, 
            posts: createdPosts 
        });
    } catch (error) {
        console.error('Error seeding database:', error);
        return res.status(500).json({ message: 'Failed to seed database', error: error.message });
    }
}; 