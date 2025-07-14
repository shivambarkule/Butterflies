import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IStudent extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  studentId: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: Date;
  grade?: string;
  school?: string;
  subjects: string[];
  profile: {
    bio?: string;
    interests: string[];
    studyGoals: string[];
    timezone: string;
    language: string;
  };
  gamification: {
    level: number;
    xp: number;
    totalXp: number;
    streak: number;
    longestStreak: number;
    badges: Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      earnedAt: Date;
      category: string;
    }>;
    achievements: Array<{
      id: string;
      name: string;
      description: string;
      earnedAt: Date;
      points: number;
    }>;
    dailyChallenges: Array<{
      id: string;
      completed: boolean;
      completedAt?: Date;
      points: number;
    }>;
  };
  examHistory: Array<{
    examId: mongoose.Types.ObjectId;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
    completedAt: Date;
    status: 'completed' | 'incomplete' | 'abandoned';
  }>;
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      examReminders: boolean;
      results: boolean;
      achievements: boolean;
    };
    theme: 'light' | 'dark' | 'auto';
    accessibility: {
      highContrast: boolean;
      largeText: boolean;
      screenReader: boolean;
    };
  };
  social: {
    friends: mongoose.Types.ObjectId[];
    studyGroups: mongoose.Types.ObjectId[];
    lastActive: Date;
  };
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const StudentSchema = new Schema<IStudent>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  grade: {
    type: String,
    trim: true
  },
  school: {
    type: String,
    trim: true
  },
  subjects: [{
    type: String,
    trim: true
  }],
  profile: {
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    interests: [{
      type: String,
      trim: true
    }],
    studyGoals: [{
      type: String,
      trim: true
    }],
    timezone: {
      type: String,
      default: 'UTC'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  gamification: {
    level: {
      type: Number,
      default: 1
    },
    xp: {
      type: Number,
      default: 0
    },
    totalXp: {
      type: Number,
      default: 0
    },
    streak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    badges: [{
      id: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        required: true
      },
      earnedAt: {
        type: Date,
        default: Date.now
      },
      category: {
        type: String,
        required: true
      }
    }],
    achievements: [{
      id: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      earnedAt: {
        type: Date,
        default: Date.now
      },
      points: {
        type: Number,
        required: true
      }
    }],
    dailyChallenges: [{
      id: {
        type: String,
        required: true
      },
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: {
        type: Date
      },
      points: {
        type: Number,
        required: true
      }
    }]
  },
  examHistory: [{
    examId: {
      type: Schema.Types.ObjectId,
      ref: 'Exam',
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    correctAnswers: {
      type: Number,
      required: true
    },
    timeSpent: {
      type: Number,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['completed', 'incomplete', 'abandoned'],
      default: 'completed'
    }
  }],
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      examReminders: {
        type: Boolean,
        default: true
      },
      results: {
        type: Boolean,
        default: true
      },
      achievements: {
        type: Boolean,
        default: true
      }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    accessibility: {
      highContrast: {
        type: Boolean,
        default: false
      },
      largeText: {
        type: Boolean,
        default: false
      },
      screenReader: {
        type: Boolean,
        default: false
      }
    }
  },
  social: {
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'Student'
    }],
    studyGroups: [{
      type: Schema.Types.ObjectId,
      ref: 'StudyGroup'
    }],
    lastActive: {
      type: Date,
      default: Date.now
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
StudentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for exam completion rate
StudentSchema.virtual('examCompletionRate').get(function() {
  if (this.examHistory.length === 0) return 0;
  const completed = this.examHistory.filter(exam => exam.status === 'completed').length;
  return Math.round((completed / this.examHistory.length) * 100);
});

// Virtual for average score
StudentSchema.virtual('averageScore').get(function() {
  if (this.examHistory.length === 0) return 0;
  const completedExams = this.examHistory.filter(exam => exam.status === 'completed');
  if (completedExams.length === 0) return 0;
  const totalScore = completedExams.reduce((sum, exam) => sum + exam.score, 0);
  return Math.round(totalScore / completedExams.length);
});

// Index for better query performance
StudentSchema.index({ email: 1 });
StudentSchema.index({ studentId: 1 });
StudentSchema.index({ 'gamification.level': -1, 'gamification.xp': -1 });
StudentSchema.index({ 'social.lastActive': -1 });

// Pre-save middleware to hash password
StudentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
StudentSchema['methods']['comparePassword'] = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this['password']);
};

// Static method to find by email
StudentSchema['statics']['findByEmail'] = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

export default mongoose.model<IStudent>('Student', StudentSchema); 