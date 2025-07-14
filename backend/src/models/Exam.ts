import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'essay' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  imageUrl?: string;
}

export interface IExam extends Document {
  title: string;
  description: string;
  subject: string;
  grade: string;
  duration: number; // in minutes
  totalQuestions: number;
  totalPoints: number;
  passingScore: number;
  questions: IQuestion[];
  settings: {
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    showResults: boolean;
    allowReview: boolean;
    timeLimit: boolean;
    allowRetake: boolean;
    maxRetakes: number;
    requirePassword: boolean;
    password?: string;
  };
  schedule: {
    startDate: Date;
    endDate: Date;
    availableFrom: Date;
    availableUntil: Date;
    timeSlots?: Array<{
      startTime: string;
      endTime: string;
      maxStudents: number;
    }>;
  };
  restrictions: {
    allowedStudents: mongoose.Types.ObjectId[];
    allowedSchools: string[];
    allowedGrades: string[];
    prerequisites: mongoose.Types.ObjectId[];
  };
  status: 'draft' | 'published' | 'active' | 'completed' | 'archived';
  createdBy: mongoose.Types.ObjectId;
  tags: string[];
  instructions: string;
  materials: Array<{
    name: string;
    url: string;
    type: 'pdf' | 'video' | 'link' | 'document';
  }>;
  analytics: {
    totalAttempts: number;
    averageScore: number;
    completionRate: number;
    averageTime: number;
    difficultyRating: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'fill-blank', 'essay', 'matching'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String
  }],
  correctAnswer: {
    type: Schema.Types.Mixed,
    required: true
  },
  explanation: {
    type: String
  },
  points: {
    type: Number,
    required: true,
    default: 1
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String
  }
});

const ExamSchema = new Schema<IExam>({
  title: {
    type: String,
    required: [true, 'Exam title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Exam description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  grade: {
    type: String,
    required: [true, 'Grade is required'],
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: [1, 'Exam must have at least 1 question']
  },
  totalPoints: {
    type: Number,
    required: true,
    min: [1, 'Exam must have at least 1 point']
  },
  passingScore: {
    type: Number,
    required: true,
    min: [0, 'Passing score cannot be negative'],
    max: [100, 'Passing score cannot exceed 100']
  },
  questions: [QuestionSchema],
  settings: {
    shuffleQuestions: {
      type: Boolean,
      default: true
    },
    shuffleOptions: {
      type: Boolean,
      default: true
    },
    showResults: {
      type: Boolean,
      default: true
    },
    allowReview: {
      type: Boolean,
      default: true
    },
    timeLimit: {
      type: Boolean,
      default: true
    },
    allowRetake: {
      type: Boolean,
      default: false
    },
    maxRetakes: {
      type: Number,
      default: 0
    },
    requirePassword: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      select: false
    }
  },
  schedule: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    availableFrom: {
      type: Date,
      required: [true, 'Available from date is required']
    },
    availableUntil: {
      type: Date,
      required: [true, 'Available until date is required']
    },
    timeSlots: [{
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      },
      maxStudents: {
        type: Number,
        required: true,
        min: [1, 'Max students must be at least 1']
      }
    }]
  },
  restrictions: {
    allowedStudents: [{
      type: Schema.Types.ObjectId,
      ref: 'Student'
    }],
    allowedSchools: [{
      type: String,
      trim: true
    }],
    allowedGrades: [{
      type: String,
      trim: true
    }],
    prerequisites: [{
      type: Schema.Types.ObjectId,
      ref: 'Exam'
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'active', 'completed', 'archived'],
    default: 'draft'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  instructions: {
    type: String,
    trim: true,
    maxlength: [2000, 'Instructions cannot exceed 2000 characters']
  },
  materials: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['pdf', 'video', 'link', 'document'],
      required: true
    }
  }],
  analytics: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: Number,
      default: 0
    },
    difficultyRating: {
      type: Number,
      default: 0,
      min: [0, 'Difficulty rating cannot be negative'],
      max: [5, 'Difficulty rating cannot exceed 5']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for exam availability
ExamSchema.virtual('isAvailable').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         now >= this.schedule.availableFrom && 
         now <= this.schedule.availableUntil;
});

// Virtual for exam status
ExamSchema.virtual('statusText').get(function() {
  const now = new Date();
  if (this.status === 'draft') return 'Draft';
  if (this.status === 'published') return 'Published';
  if (this.status === 'active') {
    if (now < this.schedule.availableFrom) return 'Scheduled';
    if (now > this.schedule.availableUntil) return 'Expired';
    return 'Active';
  }
  if (this.status === 'completed') return 'Completed';
  if (this.status === 'archived') return 'Archived';
  return 'Unknown';
});

// Index for better query performance
ExamSchema.index({ subject: 1, grade: 1 });
ExamSchema.index({ status: 1 });
ExamSchema.index({ 'schedule.availableFrom': 1, 'schedule.availableUntil': 1 });
ExamSchema.index({ createdBy: 1 });
ExamSchema.index({ tags: 1 });

// Pre-save middleware to calculate totals
ExamSchema.pre('save', function(next) {
  if (this.questions && this.questions.length > 0) {
    this.totalQuestions = this.questions.length;
    this.totalPoints = this.questions.reduce((sum, question) => sum + question.points, 0);
  }
  next();
});

export default mongoose.model<IExam>('Exam', ExamSchema); 