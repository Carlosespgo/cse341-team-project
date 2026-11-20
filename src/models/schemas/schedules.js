import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  tripId: { type: String, required: true, trim: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  daysOfWeek: [String],
  status: { type: Boolean, required: true },
});

const Schedule = mongoose.model('Schedule', scheduleSchema, 'schedules');

export default Schedule;