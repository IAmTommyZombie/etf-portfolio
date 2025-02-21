import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      region: "us-east-2", // Your AWS region
      userPoolId: "us-east-2_dnbjL6KXe", // Your Cognito User Pool ID
      userPoolClientId: "7d4mu7v4rnrsf1h1oqq932lr7e",
      authenticationFlowType: "USER_SRP_AUTH",
    },
  },
});
