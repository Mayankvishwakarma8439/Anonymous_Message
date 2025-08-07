import * as React from 'react';

interface VerificationEmailProps {
 username: string,
 otp: string
}

export function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <div>
      <h1>Here is your verification code: {otp}</h1>
      <p>Hello {username},</p>
        <p>Thank you for registering. Please use this verification code to complete your registeration: </p>
        <p>{otp}</p>
        <br />
        <p>If you did not request this code, please ignore this email.</p>
    </div>
  );
}