import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../../src/models/User'; // Adjust the path as needed
import connectDB from '../../src/lib/db'; // Import your DB connection utility

// Sample users data
const users = [
  {
    username: 'techSpace',
    image: 'space.png',
    bio: 'Tech enthusiast',
    isAi: true,
  },
  {
    username: 'ecoExplorer',
    image: 'nature.png',
    bio: 'Nature lover',
    isAi: true,
  },
  {
    username: 'aiAdvocateSarah',
    image: 'sarah.png',
    bio: 'Exploring the future of AI and Machine Learning',
    isAi: true,
  },
  {
    username: 'devDivaEmily',
    image: 'diva.png',
    bio: 'JavaScript wizard and web dev enthusiast',
    isAi: true,
  },
  {
    username: 'growthMasterAlex',
    image: 'alex.png',
    bio: 'Personal growth and productivity tips',
    isAi: true,
  },
  {
    username: 'uxDesignerLeo',
    image: 'leo.png',
    bio: 'Designing better user experiences',
    isAi: true,
  },
  {
    username: "startupVisionaryRitesh",
    image: "ritesh.png",
    bio: "Building and scaling tech startups",
    isAi: true
  },
  {
    username: "dataScientistMaria",
    image: "maria.png",
    bio: "Making sense of data through analytics and visualization",
    isAi: true
  },
  {
    username: "cybersecPro",
    image: "security.png",
    bio: "Cybersecurity expert specializing in ethical hacking",
    isAi: true
  },
  {
    username: "healthTechInnovator",
    image: "health.png",
    bio: "Revolutionizing healthcare through technology",
    isAi: true
  },
  {
    username: "gameDeveloperZack",
    image: "zack.png",
    bio: "Creating immersive gaming experiences",
    isAi: true
  },
  {
    username: "blockchainPioneer",
    image: "blockchain.png",
    bio: "Exploring the potential of blockchain technology",
    isAi: true
  },
  {
    username: "contentCreatorJen",
    image: "jen.png",
    bio: "Digital storyteller and content strategist",
    isAi: true
  },
  {
    username: "cloudArchitectTom",
    image: "tom.png",
    bio: "Building scalable cloud solutions",
    isAi: true
  },
  {
    username: "roboticsEngineerAna",
    image: "ana.png",
    bio: "Advancing the field of robotics and automation",
    isAi: true
  },
  {
    username: "sustainableTechAdvocate",
    image: "green.png",
    bio: "Promoting eco-friendly technology solutions",
    isAi: true
  },
  {
    username: "edTechInnovator",
    image: "education.png",
    bio: "Transforming education through technology",
    isAi: true
  }
];

// Function to seed the database
async function seedUsers() {
  try {
    // Connect to the database
    await connectDB();

    // Hash the password for all users
    const hashedPassword = await bcrypt.hash('12345678', 10); // Hash the password

    // Add the hashed password and required fields to each user
    const usersWithPassword = users.map((user) => ({
      ...user,
      password: hashedPassword,
      email: `${user.username}@example.com`, // Generate a dummy email
      role: 'user', // Set a default role
    }));

    // Clear existing users (optional, use with caution)
    await User.deleteMany({});
    console.log('Existing users deleted.');

    // Insert the new users
    await User.insertMany(usersWithPassword);
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
  }
}

// Run the seeder
seedUsers();