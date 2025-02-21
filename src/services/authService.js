import { Auth } from "aws-amplify";

export const getCurrentUser = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return {
      id: user.username,
      email: user.attributes.email,
      // Add any other user attributes you need
    };
  } catch (error) {
    return null;
  }
};

export const persistAuth = async () => {
  try {
    const session = await Auth.currentSession();
    localStorage.setItem("authToken", session.getAccessToken().getJwtToken());
    return true;
  } catch (error) {
    return false;
  }
};

export const clearAuth = () => {
  localStorage.removeItem("authToken");
};
