import {
    createBooking,
    getAllBookings as findAllBookings,
    getBookingById,
    getBookingFormData
} from '../models/bookings.js';

export async function getAllBookings(req, res) {
  try {
    const bookings = await findAllBookings();
    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
}

export async function processBookingRequest(req, res, next) {
  try {
    const booking = await createBooking(req.body);
    return res.redirect(303, `/trips/confirmation/${booking.id}`);
  } catch (error) {
    if (error.name === 'ValidationError') {
        for (const [field, issue] of Object.entries(error.errors)) {
            console.log(`Campo: ${field} | Regla: ${issue.kind}`);
        }

        return res.status(400).send('Please check the booking and passenger details.');
    }

    return next(error);
  }
}

export async function bookingConfirmationPage(req, res, next) {
  try {
    const booking = await getBookingById(req.params.confirmationId);

    if (!booking) {
      return res.status(404).render('errors/404', { title: 'Booking Not Found' });
    }

    return res.render('trips/confirm', {
      title: 'Trip Confirmation',
      booking,
    });
  } catch (error) {
    return next(error);
  }
}

export async function bookingPage(req, res, next) {
  try {
    const scheduleId = Number(req.params.scheduleId);

    if (!Number.isSafeInteger(scheduleId) || scheduleId < 1) {
      return res.status(404).render('errors/404', { title: 'Schedule Not Found' });
    }

    const data = await getBookingFormData(scheduleId);
    if (!data) {
      return res.status(404).render('errors/404', { title: 'Schedule Not Found' });
    }

    return res.render('trips/book', {
      title: 'Book Trip',
      schedule: data.schedule,
      ticketOptions: data.ticketOptions,
    });
  } catch (error) {
    return next(error);
  }
}

export function bookingsAdminPage(req, res) {
  return res.render('bookings', { title: 'Bookings Admin' });
}