import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnvVar.js';

const transport = nodemailer.createTransport({
  host: getEnvVar('SMTP_HOST'),
  port: getEnvVar('SMTP_PORT'),
  secure: false,
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASSWORD'),
  },
  logger: true,
  debug: true,
});

export async function sendMail(mail) {
  mail.from = getEnvVar('SMTP_FROM');

  await transport.sendMail(mail);
}
