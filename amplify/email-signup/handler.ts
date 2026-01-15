import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { SESv2Client, CreateContactCommand } from '@aws-sdk/client-sesv2';

const snsClient = new SNSClient({});
const sesClient = new SESClient({});
const sesv2Client = new SESv2Client({});

const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@regrada.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@regrada.com';
const CONTACT_LIST_NAME = 'regrada-newsletter';

interface SignupEvent {
  body: string;
}

interface SignupBody {
  email: string;
}

export const handler = async (event: SignupEvent) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  try {
    // Parse request body
    const body: SignupBody = JSON.parse(event.body);
    const { email } = body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid email address' }),
      };
    }

    // Add contact to SES contact list
    console.log('Attempting to add contact to list:', email);
    try {
      await sesv2Client.send(
        new CreateContactCommand({
          ContactListName: CONTACT_LIST_NAME,
          EmailAddress: email,
          TopicPreferences: [
            {
              TopicName: 'newsletter',
              SubscriptionStatus: 'OPT_IN',
            },
          ],
        })
      );
      console.log('Successfully added contact to list');
    } catch (contactError) {
      // If contact already exists, that's fine
      const error = contactError as { name?: string };
      console.error('Contact list error:', error.name, contactError);
      if (error.name !== 'AlreadyExistsException') {
        console.error('Error adding contact to list:', contactError);
      }
    }

    // Publish to SNS topic (for notifications)
    if (SNS_TOPIC_ARN) {
      await snsClient.send(
        new PublishCommand({
          TopicArn: SNS_TOPIC_ARN,
          Subject: 'New Regrada Newsletter Signup',
          Message: JSON.stringify({
            email,
            timestamp: new Date().toISOString(),
            source: 'landing_page',
          }),
        })
      );
    }

    // Send confirmation email via SES
    try {
      await sesClient.send(
        new SendEmailCommand({
          Source: FROM_EMAIL,
          Destination: {
            ToAddresses: [email],
          },
          Message: {
            Subject: {
              Data: 'Welcome to Regrada!',
            },
            Body: {
              Text: {
                Data: `Thank you for signing up for Regrada updates!\n\nWe'll keep you posted on our launch and latest developments.\n\nCI for AI behavior — catch regressions before they ship.\n\n- The Regrada Team`,
              },
              Html: {
                Data: `
                  <html>
                    <body style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background-color: #1D1F21; color: #C5C8C6; padding: 20px; margin: 0;">
                      <h2 style="color: #81A2BE; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">Welcome to Regrada!</h2>
                      <p style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">Thank you for signing up for Regrada updates!</p>
                      <p style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">We'll keep you posted on our launch and latest developments.</p>
                      <p style="color: #969896; margin-top: 30px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
                        <em>CI for AI behavior — catch regressions before they ship.</em>
                      </p>
                      <p style="color: #969896; margin-top: 30px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">- The Regrada Team</p>
                    </body>
                  </html>
                `,
              },
            },
          },
        })
      );
    } catch (sesError) {
      console.error('SES error (non-blocking):', sesError);
      // Continue even if SES fails
    }

    // Notify admin
    if (ADMIN_EMAIL && FROM_EMAIL) {
      try {
        await sesClient.send(
          new SendEmailCommand({
            Source: FROM_EMAIL,
            Destination: {
              ToAddresses: [ADMIN_EMAIL],
            },
            Message: {
              Subject: {
                Data: `New signup: ${email}`,
              },
              Body: {
                Text: {
                  Data: `New email signup:\n\nEmail: ${email}\nTimestamp: ${new Date().toISOString()}`,
                },
              },
            },
          })
        );
      } catch (adminError) {
        console.error('Admin notification error (non-blocking):', adminError);
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Successfully signed up!'
      }),
    };
  } catch (error) {
    console.error('Error processing signup:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to process signup. Please try again.'
      }),
    };
  }
};

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
