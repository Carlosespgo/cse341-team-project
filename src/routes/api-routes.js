import { Router } from 'express';
import { getAllTrips, getTripById } from '../controllers/trips.js';
import {
  getSchedulesForTrip,
  getSchedulesForTripAndMonth,
} from '../controllers/schedules.js';
import { getAllBookings } from '../controllers/bookings.js';

const router = Router();

/**
 * @openapi
 * /api/trips:
 *   get:
 *     summary: Get all trips
 *     tags: [Trips]
 *     responses:
 *       '200':
 *         description: A list of trips. An empty list is returned if there are no trips.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       '500':
 *         description: Failed to fetch trips.
 */
router.get('/trips', getAllTrips);

/**
 * @openapi
 * /api/trips/{id}:
 *   get:
 *     summary: Get one trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: alpine-panorama
 *     responses:
 *       '200':
 *         description: The matching trip.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       '404':
 *         description: Trip not found.
 *       '500':
 *         description: Failed to fetch trip.
 */
router.get('/trips/:id', getTripById);

/**
 * @openapi
 * /api/trips/{id}/schedules:
 *   get:
 *     summary: Get schedules for a trip, optionally filtered by month
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Trip ID
 *         schema:
 *           type: string
 *         example: alpine-panorama
 *       - in: query
 *         name: month
 *         required: false
 *         description: Operating month, from January (1) to December (12)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         example: 4
 *     responses:
 *       '200':
 *         description: Matching schedules, or an empty array if none are available.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: integer }
 *                   tripId: { type: string }
 *                   departureTime: { type: string, example: '08:30' }
 *                   arrivalTime: { type: string, example: '13:00' }
 *                   daysOfWeek: { type: array, items: { type: string } }
 *                   status: { type: boolean }
 *       '400':
 *         description: Invalid month. Expected a whole number from 1 to 12.
 *       '500':
 *         description: Failed to fetch schedules.
 */
router.get('/trips/:id/schedules', (req, res) => {
  if (req.query.month !== undefined) {
    return getSchedulesForTripAndMonth(req, res);
  }

  return getSchedulesForTrip(req, res);
});

/**
 * @openapi
 * /api/bookings:
 *   get:
 *     summary: List all bookings, newest first
 *     tags: [Bookings]
 *     responses:
 *       '200':
 *         description: All bookings, or an empty array if none exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   tripId: { type: string }
 *                   scheduleId: { type: integer }
 *                   ticketClass: { type: string }
 *                   selectedDay: { type: string }
 *                   createdAt: { type: string, format: date-time }
 *                   passengers:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         firstName: { type: string }
 *                         lastName: { type: string }
 *                         email: { type: string, format: email }
 *                         phone: { type: string }
 *       '500':
 *         description: Failed to fetch bookings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string }
 */
router.get('/bookings', getAllBookings);

export default router;