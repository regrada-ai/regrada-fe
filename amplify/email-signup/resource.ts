import { defineFunction } from '@aws-amplify/backend';

export const emailSignup = defineFunction({
  name: 'email-signup',
  entry: './handler.ts',
  runtime: 22,
  environment: {
    SNS_TOPIC_ARN: 'arn:aws:sns:us-east-1:985274299679:regrada-email-signups', // You'll set this in Amplify Console
    FROM_EMAIL: 'noreply@regrada.com', // Update with your verified SES email
    ADMIN_EMAIL: 'admin@regrada.com', // Your admin email to receive notifications
  },
});
