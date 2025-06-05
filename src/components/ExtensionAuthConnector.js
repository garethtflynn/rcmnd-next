"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function ExtensionAuthConnector() {
  const { data: session } = useSession();

  useEffect(() => {
    // Function to communicate with the Chrome extension
    const setupExtensionCommunication = () => {
      // Define a global method that can be called from any component
      window.sendAuthToExtension = () => {
        window.postMessage(
          {
            type: "AUTH_UPDATE",
            data: {
              isAuthenticated: !!session,
              user: session?.user || null,
            },
          },
          "*"
        );
      };

      // Listen for messages from the extension's content script
      window.addEventListener("message", (event) => {
        // Security check to ensure message comes from a trusted source
        if (event.source !== window) return;

        if (event.data.type === "REQUEST_AUTH_STATUS") {
          window.sendAuthToExtension();
        }
      });

      // Initial auth status send (useful if extension loads after the page)
      setTimeout(window.sendAuthToExtension, 1000);
    };

    // Run the setup when the component mounts
    setupExtensionCommunication();

    // Also send updates when session changes
    if (session !== undefined) {
      window.sendAuthToExtension();
    }
  }, [session]);

  // This component doesn't render anything
  return null;
}
