import { useMsal } from "@azure/msal-react";
import { graphConfig, loginRequest } from "./authConfig";

// Function to get user information including security groups from Microsoft Graph API
const getUserInformation = async (accessToken) => {
  try {
    const response = await fetch(
      "https://graph.microsoft.com/v1.0/me/memberOf",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      const securityGroups = data.value.map((group) => ({
        id: group.id,
        name: group.displayName,
      }));
      console.log("User Security Groups:", securityGroups);
      // You can now use the securityGroups information as needed in your application
    } else {
      console.error(
        "Error retrieving user security groups:",
        response.statusText,
      );
    }
  } catch (error) {
    console.error("Error retrieving user security groups:", error);
  }
};

// Component where you handle the login logic
const NewTestAuth = () => {
  const { instance, accounts } = useMsal();

  // Event handler for login button click
  const handleLogin = async () => {
    try {
      const loginResponse = await instance.loginPopup(loginRequest);

      // Check if login was successful
      if (loginResponse && loginResponse.account) {
        // Use the access token for subsequent requests
        const accessTokenResponse = await instance.acquireTokenSilent({
          ...loginRequest,
          account: loginResponse.account,
        });

        // Check if access token was successfully acquired
        if (accessTokenResponse && accessTokenResponse.accessToken) {
          // Call Microsoft Graph API to get user information and security groups
          await getUserInformation(accessTokenResponse.accessToken);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default NewTestAuth;
