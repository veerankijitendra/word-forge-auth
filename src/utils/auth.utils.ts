import bcrypt from 'bcrypt';

import crypto from 'crypto';

import { Request } from 'express';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (
  candidatePassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

export const hashRefreshToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const compareRefreshToken = ({
  incommingToken,
  storedHash,
}: {
  incommingToken: string;
  storedHash: string;
}): boolean => {
  const incomingHash = hashRefreshToken(incommingToken);
  return incomingHash === storedHash;
};

export const getDeviceInfo = (req: Request) => {
  return req.headers['user-agent'] || 'unknown';
};

export const getIp = (req: Request) => {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
};
