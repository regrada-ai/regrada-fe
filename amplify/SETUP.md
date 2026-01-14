# Amplify Email Signup Setup Guide

This guide will help you set up the email signup Lambda function with SES and SNS.

## Prerequisites

1. AWS Account with Amplify deployed
2. Domain configured in Route53 (you already have this)
3. AWS CLI configured locally

## Step 1: Verify Your Email Domain in SES

### Option A: Verify Entire Domain (Recommended)
```bash
# Go to SES Console
# Navigate to: SES → Verified identities → Create identity
# Choose: Domain
# Enter: regrada.com (or your domain)
# Copy the CNAME records and add them to Route53
```

### Option B: Verify Individual Email
```bash
# Go to SES Console
# Navigate to: SES → Verified identities → Create identity
# Choose: Email address
# Enter: noreply@regrada.com
# Click the verification link sent to your email
```

**Note**: Until your domain/email is verified, SES won't send emails.

## Step 2: Request Production Access for SES

By default, SES is in **sandbox mode** (can only send to verified emails).

```bash
# Go to SES Console
# Click "Request production access" in the banner
# Fill out the form:
# - Mail type: Transactional
# - Use case: User notifications for landing page signups
# - Compliance: Confirm you have permission to email these users

# Usually approved within 24 hours
```

## Step 3: Create SNS Topic for Mailing List

```bash
# Create SNS topic
aws sns create-topic --name regrada-email-signups

# Note the TopicArn from the output
# Example: arn:aws:sns:us-east-1:123456789:regrada-email-signups
```

### Subscribe to SNS Topic (to receive signup notifications)

```bash
# Subscribe your email to get notified of new signups
aws sns subscribe \\
  --topic-arn arn:aws:sns:us-east-1:YOUR_ACCOUNT:regrada-email-signups \\
  --protocol email \\
  --notification-endpoint your-admin@email.com

# Confirm subscription via email
```

## Step 4: Configure Environment Variables in Amplify

1. Go to **Amplify Console**
2. Select your app → **Hosting** → **Environment variables**
3. Add the following variables:

```
NEXT_PUBLIC_API_URL=<your-api-gateway-url-from-amplify>
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:YOUR_ACCOUNT:regrada-email-signups
FROM_EMAIL=noreply@regrada.com
ADMIN_EMAIL=your-admin@regrada.com
```

## Step 5: Update IAM Permissions

The Lambda function needs permissions to use SES and SNS.

### Auto-generated Policy (Amplify should handle this)
Amplify will create an execution role, but you need to ensure it has these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "sns:Publish"
      ],
      "Resource": "arn:aws:sns:us-east-1:YOUR_ACCOUNT:regrada-email-signups"
    }
  ]
}
```

### Add Permissions Manually (if needed)

1. Go to **IAM Console** → **Roles**
2. Find role: `amplify-<app-name>-<env>-email-signup-lambda-role`
3. **Attach policies** or **Add inline policy** with the JSON above

## Step 6: Update Backend Configuration

Update `amplify/functions/email-signup/resource.ts` with your verified email:

```typescript
environment: {
  SNS_TOPIC_ARN: 'arn:aws:sns:us-east-1:YOUR_ACCOUNT:regrada-email-signups',
  FROM_EMAIL: 'noreply@regrada.com', // Must be verified in SES
  ADMIN_EMAIL: 'your-admin@regrada.com',
}
```

## Step 7: Deploy

```bash
# Install dependencies
npm install

# Deploy to Amplify (will happen automatically on git push)
git add .
git commit -m "Add email signup Lambda function"
git push
```

## Step 8: Get API Gateway URL

After deployment:

1. Go to **Amplify Console**
2. Navigate to **Backend** → **API**
3. Copy the API Gateway URL for the `email-signup` function
4. Update environment variable: `NEXT_PUBLIC_API_URL=<that-url>`

## Testing

### Test Locally (requires AWS credentials)
```bash
npm run dev
# Try signing up with your email
```

### Test in Production
```bash
# Visit your deployed site
# Enter email and click "Notify Me"
# Check CloudWatch Logs for the Lambda function
```

## Monitoring

### View Logs
```bash
# CloudWatch Logs
# Navigate to: CloudWatch → Log groups → /aws/lambda/email-signup
```

### Check Emails Sent
```bash
# SES Console → Sending Statistics
# Shows: Sends, Deliveries, Opens, Bounces, Complaints
```

### View Signup Data
```bash
# Check SNS topic messages
# Or subscribe your email to the SNS topic to get notifications
```

## Troubleshooting

### "Email address is not verified" error
- Verify your FROM_EMAIL in SES Console
- Make sure you're in the correct AWS region (check SES region)

### "Access Denied" for SNS/SES
- Check Lambda execution role has correct permissions
- Verify SNS_TOPIC_ARN is correct in environment variables

### No emails received
- Check SES is out of sandbox mode
- Verify email in SES Console
- Check CloudWatch logs for errors
- Check spam folder

### API returns 500 error
- Check CloudWatch logs for the Lambda function
- Verify environment variables are set correctly
- Ensure Lambda has internet access (should by default)

## Cost Estimate

- **SES**: $0.10 per 1,000 emails (first 62,000 emails/month free with AWS Free Tier)
- **SNS**: $0.50 per 1M requests (first 1M free)
- **Lambda**: Included in Amplify
- **API Gateway**: Included in Amplify

**Estimated monthly cost for 1,000 signups: < $1**

## Next Steps

- [ ] Set up email template in SES for better formatting
- [ ] Store emails in DynamoDB for full mailing list management
- [ ] Integrate with email service (Mailchimp, SendGrid, etc.)
- [ ] Add double opt-in confirmation
- [ ] Create unsubscribe mechanism (required for production)
