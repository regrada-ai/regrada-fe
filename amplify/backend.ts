import { defineBackend } from '@aws-amplify/backend';
import { emailSignup } from './functions/email-signup/resource';

const backend = defineBackend({
  emailSignup,
});
