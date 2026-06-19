export const FORM_CONFIG = {
  // Set to "live" once you have a real endpoint.
  // In "demo" mode the form shows a success message without sending data.
  mode: "demo",
  // Full URL to your form submission endpoint (required when mode is "live")
  endpoint: "",
  // Custom headers sent with every submission request
  headers: {
    "Content-Type": "application/json",
  },
};
