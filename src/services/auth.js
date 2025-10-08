import createHttpError from 'http-errors';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import Handlebars from 'handlebars';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { sendMail } from '../utils/sendMail.js';

const REQUEST_PASSWORD_RESET_TEMPLATE = fs.readFileSync(
  path.resolve(`src/templates/request-reset-password.html`),
  'utf-8',
);

export const registreUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (user) {
    throw createHttpError.Conflict('Email in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new createHttpError.Unauthorized('Email or password incorect');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch !== true) {
    throw new createHttpError.Unauthorized('Email or password incorect');
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 50 * 60 * 1000), // 50 min
    refreshTokenValidUntil: new Date(Date.now() + 720 * 60 * 60 * 1000), // 30 d
  });
};

export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findById(sessionId);

  if (!session) {
    throw new createHttpError.Unauthorized('Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw new createHttpError.Unauthorized('Refresh token is invalid');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Refresh token is expire');
  }

  await Session.deleteOne({ _id: session._id });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 h
  });
}

export async function requestPasswordReset(email) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new createHttpError.NotFound('User not found!');
  }

  const token = jwt.sign({ sub: user._id }, getEnvVar('JWT_SECRET'), {
    expiresIn: '5m',
  });

  const template = Handlebars.compile(REQUEST_PASSWORD_RESET_TEMPLATE);

  await sendMail({
    to: email,
    subject: 'Reset password',
    html: template({
      resetPasswordLink: `https://localhost:3000/reset-pwd?token=${token}`,
    }),
  });
}

export async function resetPassword(token, password) {
  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

    const user = User.findOne(decoded.sub);

    if (!user) {
      throw new createHttpError.NotFound('User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.sub, { password: hashedPassword });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new createHttpError.Unauthorized('Token is expired or invalid.');
    }

    if (error.name === 'JsonWebTokenError') {
      throw new createHttpError.Unauthorized('Token is unauthorized');
    }
  }
}
