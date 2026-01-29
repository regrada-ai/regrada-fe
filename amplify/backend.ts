// SPDX-License-Identifier: LicenseRef-Regrada-Proprietary
import { defineBackend } from '@aws-amplify/backend';
import { emailSignup } from './email-signup/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  emailSignup,
});
