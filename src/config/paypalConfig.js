import paypal from "@paypal/checkout-server-sdk";
import { paypalCleintSecret, paypalClientId } from "./index.js";

function paypalConfig() {
  const clientId = paypalClientId;
  const clientSecret = paypalCleintSecret;

  const environment = new paypal.core.SandboxEnvironment(
    clientId,
    clientSecret
  );
  const client = new paypal.core.PayPalHttpClient(environment);
  return client;
}

export default paypalConfig;
