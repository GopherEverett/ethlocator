import { defineAuth } from '@aws-amplify/backend';

/**
 * Cognito user pool for Ethlocator: users sign up and sign in with
 * email + password and confirm their account with an emailed code.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
