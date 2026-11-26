export function loadSessionUser(req, res, next) {
  req.user = req.session.user ?? null;
  res.locals.user = req.user;
  next();
}

export function requireApiLogin() {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    return next();
  };
}

export function requirePageLogin() {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect('/login');
    }

    return next();
  };
}

export function requireApiRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return next();
  };
}

export function requirePageRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect('/login');
    }

    if (req.user.role !== role) {
      return res.redirect('/403');
    }

    return next();
  };
}