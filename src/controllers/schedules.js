import { getSchedulesByTripId } from '../models/schedules.js';

export async function getSchedulesForTrip(req, res) {
  try {
    const schedules = await getSchedulesByTripId(req.params.id);
    return res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return res.status(500).json({ error: 'Failed to fetch schedules' });
  }
}

export async function getSchedulesForTripAndMonth(req, res) {
  const { month } = req.query;

  if (typeof month !== 'string' || !/^(0?[1-9]|1[0-2])$/.test(month)) {
    return res.status(400).json({
      error: 'Month must be a whole number from 1 to 12',
    });
  }

  try {
    const schedules = await getSchedulesByTripId(req.params.id, Number(month));
    return res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching schedules by month:', error);
    return res.status(500).json({ error: 'Failed to fetch schedules' });
  }
}