import 'dotenv/config';
import { MongoClient } from 'mongodb';

const sampleTuitions = [
  {
    title: 'Class 9 Mathematics Tuition',
    subject: 'Mathematics',
    classLevel: 'Class 9',
    mode: 'Offline',
    location: 'Dhanmondi, Dhaka',
    monthlyFee: 4000,
    daysPerWeek: 3,
    bannerImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
    description:
      'Experienced tutor offering mathematics lessons with regular practice and assessments.',
    tutorName: 'Rahim Ahmed',
    tutorEmail: 'rahim@example.com',
  },
  {
    title: 'HSC Physics Preparation',
    subject: 'Physics',
    classLevel: 'HSC',
    mode: 'Online',
    location: 'Online',
    monthlyFee: 5000,
    daysPerWeek: 4,
    bannerImage: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa',
    description:
      'Complete HSC physics preparation with concept-based lessons and problem solving.',
    tutorName: 'Nusrat Jahan',
    tutorEmail: 'nusrat@example.com',
  },
  {
    title: 'English Grammar and Writing',
    subject: 'English',
    classLevel: 'Class 8',
    mode: 'Offline',
    location: 'Uttara, Dhaka',
    monthlyFee: 3500,
    daysPerWeek: 3,
    bannerImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a',
    description:
      'Improve English grammar, writing skills and communication through guided lessons.',
    tutorName: 'Sadia Islam',
    tutorEmail: 'sadia@example.com',
  },
  {
    title: 'Primary School Science',
    subject: 'Science',
    classLevel: 'Class 5',
    mode: 'Online',
    location: 'Online',
    monthlyFee: 2500,
    daysPerWeek: 3,
    bannerImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
    description:
      'Friendly and interactive science lessons for primary school students.',
    tutorName: 'Tanvir Hasan',
    tutorEmail: 'tanvir@example.com',
  },
  {
    title: 'Class 10 Chemistry Special',
    subject: 'Chemistry',
    classLevel: 'Class 10',
    mode: 'Offline',
    location: 'Mirpur, Dhaka',
    monthlyFee: 4500,
    daysPerWeek: 4,
    bannerImage: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13',
    description:
      'Board exam focused chemistry lessons with chapter-wise practice.',
    tutorName: 'Farhana Akter',
    tutorEmail: 'farhana@example.com',
  },
  {
    title: 'HSC Higher Mathematics',
    subject: 'Higher Mathematics',
    classLevel: 'HSC',
    mode: 'Online',
    location: 'Online',
    monthlyFee: 5000,
    daysPerWeek: 4,
    bannerImage: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238',
    description:
      'Build strong mathematical skills through detailed explanations and exercises.',
    tutorName: 'Mahmud Karim',
    tutorEmail: 'mahmud@example.com',
  },
  {
    title: 'Class 7 General Mathematics',
    subject: 'Mathematics',
    classLevel: 'Class 7',
    mode: 'Offline',
    location: 'Bashundhara, Dhaka',
    monthlyFee: 3000,
    daysPerWeek: 3,
    bannerImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
    description:
      'Step-by-step mathematics lessons to strengthen fundamental concepts.',
    tutorName: 'Arif Hossain',
    tutorEmail: 'arif@example.com',
  },
  {
    title: 'IELTS English Preparation',
    subject: 'English',
    classLevel: 'IELTS',
    mode: 'Online',
    location: 'Online',
    monthlyFee: 6000,
    daysPerWeek: 4,
    bannerImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a',
    description:
      'IELTS preparation covering speaking, listening, reading and writing.',
    tutorName: 'Maliha Rahman',
    tutorEmail: 'maliha@example.com',
  },
  {
    title: 'Class 9 Biology Tuition',
    subject: 'Biology',
    classLevel: 'Class 9',
    mode: 'Offline',
    location: 'Mohammadpur, Dhaka',
    monthlyFee: 3500,
    daysPerWeek: 3,
    bannerImage: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8',
    description: 'Detailed biology lessons with diagrams and regular revision.',
    tutorName: 'Sabbir Ahmed',
    tutorEmail: 'sabbir@example.com',
  },
  {
    title: 'HSC Accounting Complete Course',
    subject: 'Accounting',
    classLevel: 'HSC',
    mode: 'Online',
    location: 'Online',
    monthlyFee: 4500,
    daysPerWeek: 3,
    bannerImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
    description:
      'Learn accounting fundamentals, practical problems and exam techniques.',
    tutorName: 'Nabila Sultana',
    tutorEmail: 'nabila@example.com',
  },
].map((tuition, index) => ({
  ...tuition,
  approvalStatus: 'approved',
  isActive: true,
  createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
}));

const seedTuitions = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is missing from .env');
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db('mentorlagbe');
    const collection = db.collection('tuitions');

    const existingCount = await collection.countDocuments();

    if (existingCount > 0) {
      console.log('Tuitions collection already contains data.');
      console.log('Seed cancelled to prevent duplicate records.');
      return;
    }

    const result = await collection.insertMany(sampleTuitions);

    console.log(
      `${result.insertedCount} sample tuitions inserted successfully!`,
    );
  } catch (error) {
    console.error('Failed to seed tuitions:', error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
};

seedTuitions();
