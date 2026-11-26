import { createUser, findUserByEmail, verifyPassword } from '../models/users.js';

export function registerPage(req, res) {
  return res.render('register', { title: 'Create an account' });
}

export function loginPage(req, res) {
  return res.render('login', { title: 'Log in' });
}

export async function register(req, res, next) {
  const { displayName, username, email, password } = req.body ?? {};

  const profileFields = [displayName, username, email];
  const validProfile = profileFields.every(
    value => typeof value === 'string' && value.trim().length > 0
  );

  if (!validProfile || typeof password !== 'string' || password.length === 0) {
    return res.status(400).render('register', {
      title: 'Create an account',
      error: 'Please complete all fields.',
    });
  }

  if (Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).render('register', {
      title: 'Create an account',
      error: 'Please use a password of 72 bytes or fewer.',
    });
  }

  try {
    await createUser({ displayName, username, email, password });
    return res.redirect(303, '/login');
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).render('register', {
        title: 'Create an account',
        error: 'That username or email is already in use.',
      });
    }

    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body ?? {};

    if (typeof email !== 'string' || typeof password !== 'string' ||
        !email.trim() || !password) {
      return res.status(400).render('login', {
        title: 'Log in',
        error: 'Please enter your email and password.',
      });
    }

    const user = await findUserByEmail(email);

    if (!user || Buffer.byteLength(password, 'utf8') > 72 ||
        !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).render('login', {
        title: 'Log in',
        error: 'Incorrect email or password.',
      });
    }

    if (!user.role?.name) {
      return next(new Error('The user has no assigned role.'));
    }

    return req.session.regenerate(err => {
      if (err) return next(err);

      req.session.user = {
        id: user._id.toString(),
        displayName: user.displayName,
        username: user.username,
        role: user.role.name,
      };

      return req.session.save(err => {
        if (err) return next(err);
        return res.redirect(303, '/trips');
      });
    });
  } catch (error) {
    return next(error);
  }
}

export function logout(req, res, next) {
  req.session.destroy(err => {
    if (err) return next(err);

    res.clearCookie('connect.sid', { path: '/' });
    return res.redirect(303, '/login');
  });
}