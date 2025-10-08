import {
  registreUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestPasswordReset,
  resetPassword,
} from '../services/auth.js';

export async function registerUserController(req, res) {
  const user = await registreUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
}

export async function loginUserController(req, res) {
  const session = await loginUser(req.body.email, req.body.password);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutUserController(req, res) {
  const { sessionId } = req.cookies;
  if (typeof req.cookies.sessionId === 'string') {
    await logoutUser(sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.sendStatus(204);
}

export async function refreshSessionController(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshSession(sessionId, refreshToken);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function requestPasswordResetController(req, res) {
  await requestPasswordReset(req.body.email);

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
  });
}

export async function resetPasswordController(req, res) {
  await resetPassword(req.body.token, req.body.password);
  res.json({ status: 200, message: 'Password has been successfully reset.' });
}
