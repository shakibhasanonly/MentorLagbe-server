import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import { connectDB, getDB } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Server Health Check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'MentorLagbe Server is Running!',
  });
});

// Get Approved and Active Tuitions with Search and Filters
app.get('/tuitions', async (req: Request, res: Response) => {
  try {
    const search = String(req.query.search || '').trim();
    const subject = String(req.query.subject || '').trim();
    const classLevel = String(req.query.classLevel || '').trim();
    const mode = String(req.query.mode || '').trim();
    const limit = Number(req.query.limit);

    const filters: Record<string, unknown> = {
      approvalStatus: 'approved',
      isActive: true,
    };

    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      filters.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { subject: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    if (subject) {
      filters.subject = subject;
    }

    if (classLevel) {
      filters.classLevel = classLevel;
    }

    if (mode) {
      filters.mode = mode;
    }

    let query = getDB()
      .collection('tuitions')
      .find(filters)
      .sort({ createdAt: -1 });

    if (Number.isInteger(limit) && limit > 0) {
      query = query.limit(Math.min(limit, 50));
    }

    const tuitions = await query.toArray();

    res.status(200).json({
      success: true,
      message: 'Tuitions fetched successfully',
      data: tuitions,
    });
  } catch (error) {
    console.error('Failed to fetch tuitions:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch tuitions',
    });
  }
});

// Get Single Tuition Details by ID
app.get('/tuitions/:id', async (req: Request, res: Response) => {
  try {
    const paramId = req.params.id;
    const id = Array.isArray(paramId) ? paramId[0] : paramId;

    if (!id || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid tuition ID',
      });
      return;
    }

    const tuition = await getDB()
      .collection('tuitions')
      .findOne({
        _id: new ObjectId(id),
        approvalStatus: 'approved',
        isActive: true,
      });

    if (!tuition) {
      res.status(404).json({
        success: false,
        message: 'Tuition not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Tuition details fetched successfully',
      data: tuition,
    });
  } catch (error) {
    console.error('Failed to fetch tuition details:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch tuition details',
    });
  }
});

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`MentorLagbe Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
  }
};

startServer();
