import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    enum: ['customer', 'admin'],
  },
});

export default mongoose.model('Role', roleSchema, 'roles');