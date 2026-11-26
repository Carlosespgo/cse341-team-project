import railTripsRouter from './ejs-routes.js';
import { trainsApi, trainsPage } from './trains.js';
import { Router } from 'express';
import { homePage, aboutPage, testErrorPage } from './index.js';
import tripsApiRouter from './api-routes.js';
import { bookingsAdminPage } from '../controllers/bookings.js';
import { registerPage, loginPage, register, login, logout } from '../controllers/auth.js';
import { requirePageRole } from '../middleware/auth.js';

const router = Router();

// Home page
router.get('/', homePage);

// About page
router.get('/about', aboutPage);

// Trains page
router.get('/trains', trainsPage);

// Trains API
router.get('/api/trains', trainsApi);
router.use('/api', tripsApiRouter);

// Rail trips
router.use('/trips', railTripsRouter);

// Test 500 error page
router.get('/500', testErrorPage);

// Bookings admin page
router.get('/bookings-admin', bookingsAdminPage);

router.get('/register', registerPage);
router.get('/login', loginPage);

router.get('/register', registerPage);
router.post('/register', register);

router.get('/login', loginPage);
router.post('/login', login);
router.post('/logout', logout);

router.get('/403', (req, res) => {
  return res.status(403).render('errors/403', { title: 'Access denied' });
});

router.get('/admin', requirePageRole('admin'), (req, res) => {
  return res.render('admin', { title: 'Admin Dashboard' });
});

export default router;