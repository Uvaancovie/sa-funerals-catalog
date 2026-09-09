# MailerLite MCP Server (/mcp)



This is the Model Context Protocol (MCP) server that provides seamless integration with MailerLite's email marketing API. This server enables AI assistants to manage subscribers, campaigns, groups, and many other things through standardized MCP tools.

## How MCP Works [#how-mcp-works]

The Model Context Protocol (MCP) is a standardized protocol for AI assistants to interact with external systems. Think of it as USB-C port for AI. You can connect multiple MCPs that talk to each-other and get things done for you.

## Connecting a Client [#connecting-a-client]

You can connect any MCP-compatible client to the running server. The server supports a streamable HTTP endpoint up to the latest MCP server specifications. Usually, you would just add `https://mcp.mailerlite.com/mcp` as a remote MCP address in any tooling that you are working with.

### Claude (desktop and web) [#claude-desktop-and-web]

Open Claude (Desktop), go to Settings > Connectors, and then Add Custom Connector. Name can be whatever you want, but we suggest using MailerLite as name, and Remote MCP server URL is [https://mcp.mailerlite.com/mcp](https://mcp.mailerlite.com/mcp). Click connect and follow the login process.

### Claude Code [#claude-code]

Execute this in terminal:

```bash
claude mcp add --transport http mailerlite https://mcp.mailerlite.com/mcp
```

### Gemini CLI [#gemini-cli]

Add following lines in your `~/.gemini/settings.json` file:

```json
{
  "mcpServers": {
    "mailerlite": {
      "httpUrl": "https://mcp.mailerlite.com/mcp",
      "timeout": 5000
    }
  }
}
```

### VSCode [#vscode]

You can use [one-click install](vscode:mcp/install?%7B%22name%22%3A%22mailerlite%22%2C%22gallery%22%3Afalse%2C%22url%22%3A%22https%3A%2F%2Fmcp.mailerlite.com%2Fmcp%22%7D) to add it to VSCode.

### Cursor [#cursor]

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=MailerLite\&config=eyJ1cmwiOiJodHRwczovL21jcC5tYWlsZXJsaXRlLmNvbS9tY3AifQ==)

### ChatGPT [#chatgpt]

*Eligibility: Available to Pro and Plus accounts on the web.*

* First, Enable developer mode: Go to: Settings → Connectors → Advanced → Developer mode.
* Go to back to Connectors main screen, click **Create** next to Browse connectors and in the dialog that opens enter the following:

Name: MailerLite
Description: leave empty or fill as you wish
MCP Server URL: [https://mcp.mailerlite.com/mcp](https://mcp.mailerlite.com/mcp)
Authentication: OAuth

Click on **I trust this application** checkbox and then click Create. It will guide you through the authentication process.

In order to use connectors in conversations: Open a new convo, choose Developer mode from the Plus menu and select connectors. You may need to explore different prompting techniques to call the correct tools.

## Available Tools [#available-tools]

### Subscriber Management [#subscriber-management]

* **add\_subscriber**: Add a new subscriber or update an existing one (supports email, name, fields, groups)
* **get\_subscriber**: Get subscriber info by ID or email
* **update\_subscriber**: Update subscriber information (non-destructive)
* **list\_subscribers**: List subscribers with filtering by status (active, unsubscribed, unconfirmed, bounced, junk)
* **get\_subscriber\_activity**: Get activity history for a subscriber
* **get\_subscriber\_count**: Get the total count of subscribers
* **delete\_subscriber**: Delete a subscriber (keeps info for re-subscription)

### Campaign Management [#campaign-management]

* **create\_campaign**: Create a new email campaign (regular, ab, resend types)
* **get\_campaign**: Get specific campaign details
* **list\_campaigns**: List campaigns with filtering by status and type
* **update\_campaign**: Update campaign details (name, subject, from, content)
* **delete\_campaign**: Delete a campaign
* **schedule\_campaign**: Schedule a campaign to be sent
* **cancel\_campaign**: Cancel a scheduled campaign
* **get\_campaign\_subscribers**: Get subscribers who received a campaign, with filters
* **get\_campaign\_links**: List the links in a sent campaign with their click stats
* **get\_campaign\_link\_recipients**: Get the subscribers who clicked a specific link

### Group Management [#group-management]

* **create\_group**: Create a new subscriber group
* **update\_group**: Update a group name
* **delete\_group**: Delete a group
* **get\_group\_subscribers**: Get subscribers in a group
* **assign\_subscriber\_to\_group**: Add a subscriber to a group
* **unassign\_subscriber\_from\_group**: Remove a subscriber from a group
* **import\_subscribers\_to\_group**: Bulk import subscribers into a group

### Segment Management [#segment-management]

* **list\_segments**: List all segments
* **create\_segment**: Create a new segment
* **get\_segment**: Get a single segment's details
* **update\_segment**: Update a segment name
* **delete\_segment**: Delete a segment
* **get\_segment\_subscribers**: Get subscribers in a segment, with status filtering

### Field Management [#field-management]

* **list\_fields**: List custom subscriber fields
* **create\_field**: Create a custom field (text, number, or date)
* **update\_field**: Rename a custom field
* **delete\_field**: Delete a custom field

### Form Management [#form-management]

* **list\_forms**: List forms by type (popup, embedded, promotion)
* **create\_form**: Create a new form
* **get\_form**: Get a single form's details
* **update\_form**: Update a form name
* **delete\_form**: Delete a form
* **get\_form\_subscribers**: Get subscribers who signed up through a form

### Automation Management [#automation-management]

* **list\_automations**: List automations with filtering by name, group, and enabled status
* **get\_automation\_activity**: Get subscriber activity for an automation, with status filtering
* **create\_automation**: Create a draft automation
* **build\_custom\_automation**: Plan and validate a custom automation before creating it
* **start\_automation\_conversation**: Begin a guided, conversational automation build
* **update\_automation\_email**: Update the subject line and plain text content of an automation email step
* **update\_automation\_email\_content**: Replace the HTML body of an automation email, overwriting the existing design
* **update\_automation\_delay**: Update the delay of an automation step
* **dry\_run\_automation**: Validate an automation without sending anything
* **send\_test\_automation**: Send test emails for an automation
* **delete\_automation**: Delete an automation

### Templates [#templates]

* **discover\_automation\_templates**: Browse available automation templates
* **install\_template**: Install an automation template into the account
* **list\_email\_templates**: List available email templates
* **list\_form\_templates**: List available form templates

### Email Content [#email-content]

* **generate\_email\_content**: Generate and validate HTML email content
* **suggest\_subject\_lines**: Generate and validate subject line suggestions

### E-commerce Management [#e-commerce-management]

* **manage\_ecommerce\_shops**: List, fetch, create, update, or delete shops
* **manage\_ecommerce\_products**: List, fetch, create, update, delete, or bulk-import products in a shop
* **manage\_ecommerce\_customers**: List, fetch, create, update, or delete customers in a shop
* **manage\_ecommerce\_orders**: List, fetch, create, update, delete, or bulk-import orders in a shop
* **manage\_ecommerce\_categories**: List, fetch, create, update, delete, or bulk-import product categories
* **manage\_ecommerce\_carts**: List, fetch, or update shopping carts
* **manage\_ecommerce\_cart\_items**: List, fetch, create, update, or delete the line items of a cart
* **manage\_ecommerce\_category\_products**: List products in a category, or attach/detach a product

Each `manage_ecommerce_*` tool takes an `action` parameter (e.g. `list`, `get`, `create`, `update`, `delete`, `import`) rather than exposing a separate tool per operation.

### Webhook Management [#webhook-management]

* **list\_webhooks**: List all webhooks
* **get\_webhook**: Get a specific webhook's details
* **create\_webhook**: Create a new webhook with a name, URL, and events
* **update\_webhook**: Update a webhook, including enabling/disabling it
* **delete\_webhook**: Delete a webhook

### Discovery & Utility [#discovery--utility]

* **search**: Search across MailerLite resources
* **fetch**: Fetch a specific MailerLite resource by reference
* **list\_resources**: List the resource types available to work with
* **select\_resource**: Resolve a resource by name to its ID
* **batch\_requests**: Run multiple API operations in a single batched request
* **get\_dashboard\_link**: Get a deep link to edit a resource in the MailerLite dashboard

### Authentication [#authentication]

* **get\_auth\_status**: Get the current authentication status

## Feedback [#feedback]

We are always eager about feedback of the exciting things we are working on. If you have feedback about our MCP, feel free to send an email to [mcp@mailerlite.com](mailto:mcp@mailerlite.com).
