# Brevo Transactional Email API Documentation

This document provides a simplified, agent-friendly reference for sending transactional emails using the Brevo (formerly Sendinblue) API.

## Core Endpoint

- **URL**: `POST https://api.brevo.com/v3/smtp/email`
- **Headers to Include**:
  - `accept: application/json`
  - `content-type: application/json`
  - `api-key: YOUR_API_KEY`

## Message Configuration (Static vs. Dynamic)

You can send emails either by providing static HTML/text directly, or by triggering a pre-designed template and passing dynamic variables.

### 1. Request Payload Schema

A typical JSON request body includes:

```json
{
  "sender": {
    "name": "Sender Name",
    "email": "sender@domain.com"
  },
  "to": [
    {
      "email": "recipient@domain.com",
      "name": "Recipient Name"
    }
  ],
  "subject": "Your Email Subject",
  
  // -- CHOOSE EXACTLY ONE OF THE FOLLOWING BODY TYPES --
  
  // Option A: Raw HTML content
  "htmlContent": "<html><body><h1>Hello!</h1></body></html>",
  
  // Option B: Plain text content
  "textContent": "Hello! This is a plain text email.",
  
  // Option C: Use a remote Template ID (integer)
  "templateId": 123,

  // -- OPTIONAL FIELDS --

  // Dynamic parameters injected into templates or htmlContent via {{params.variableName}}
  "params": {
    "trackingCode": "JD123",
    "estimatedArrival": "Tomorrow"
  },
  
  // Optional custom tags for webhook tracking
  "tags": [
    "orderConfirmation", "ecommerce"
  ]
}
```

### 2. Rendering Dynamic Variables

If you provide `params` in your JSON, you can output them directly in your `htmlContent` or `textContent` (or your Brevo-hosted template) using double curly braces:

- E.g., `{{params.trackingCode}}`

## Examples

### Example 1: Basic HTML Content

```bash
curl --request POST \
  --url https://api.brevo.com/v3/smtp/email \
  --header 'accept: application/json' \
  --header 'api-key: YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --data '{
    "sender": { "name": "System", "email": "system@example.com" },
    "to": [ { "email": "user@example.com", "name": "John Doe" } ],
    "subject": "Welcome!",
    "htmlContent": "<html><body><h1>Welcome John!</h1></body></html>"
  }'
```

### Example 2: Using Template ID + Dynamic Params

```bash
curl --request POST \
  --url https://api.brevo.com/v3/smtp/email \
  --header 'accept: application/json' \
  --header 'api-key: YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --data '{
    "sender": { "name": "Store", "email": "store@example.com" },
    "to": [ { "email": "customer@example.com", "name": "Jane Smith" } ],
    "templateId": 8,
    "params": {
      "ORDER_ID": "12345",
      "STATUS": "Shipped"
    }
  }'
```

## Response

A successful API call will respond with a `messageId` which can be used to track deliverability.

```json
{
  "messageId": "<202112345678.xxxx@domain.com>"
}
```

## Important Notes for Agents

1. **Body Types are Mutually Exclusive:** Never include `htmlContent`, `textContent`, and `templateId` in the same request payload. Choose exactly one.
2. **Sender Domain:** Ensure the sender email used matches a registered and verified sender domain in the Brevo account dashboard.
3. **Contact Attributes:** If the template relies on Brevo Contact Attributes (e.g. `{{contact.FIRSTNAME}}`), the recipient email must exist in the Brevo Contacts list with those attributes populated. Alternatively, use `params` for on-the-fly injection without relying on stored contacts.
