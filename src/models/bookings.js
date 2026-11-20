import Booking from './schemas/bookings.js';
import { generateConfirmationCode } from '../includes/helpers.js';
import Schedule from './schemas/schedules.js';
import { getTripById } from './trips.js';

export async function createBooking({
  tripId,
  scheduleId,
  ticketClass,
  selectedDay,
  passengers,
}) {
  return Booking.create({
    id: generateConfirmationCode(),
    tripId,
    scheduleId,
    ticketClass,
    selectedDay,
    passengers,
  });
}

export async function getAllBookings() {
  return Booking.find({}).sort({ createdAt: -1 }).lean();
}

export async function getBookingById(id) {
  return Booking.findOne({ id }).lean();
}

export async function getBookingFormData(scheduleId) {
  const schedule = await Schedule.findOne({ id: scheduleId }).lean();
  if (!schedule) return null;

  const trip = await getTripById(schedule.tripId);
  if (!trip) return null;

  const ticketClasses = await Booking.db
    .collection('ticketClasses')
    .find({})
    .toArray();

  const ticketOptions = ticketClasses.map(ticket => ({
    class: ticket.class,
    name: ticket.name,
    price: trip.distance * ticket.pricePerKm,
    amenities: ticket.amenities,
    description: ticket.description,
  }));

  return { schedule, ticketOptions };
}