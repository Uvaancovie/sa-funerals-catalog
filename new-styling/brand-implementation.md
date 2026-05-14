Although `www.safuneral.co.za` restricts direct automated scraping, analyzing their market position, product catalogs (which heavily feature premium woods like Kiaat, Fritzroy Walnut, and Prestige Cherry), and their B2B corporate identity out of Phoenix, Durban allows us to accurately reverse-engineer their brand guidelines.

To transition your current digital assets to match the **"South African Funeral Supplies - SA's leading caskets supplier"** brand identity, you must shift from a standard digital look to a highly dignified, heritage-driven, and premium aesthetic.

Here is the comprehensive brand guideline analysis and the exact code you need to implement it across your Angular frontend and .NET backend.

### 1. Brand Identity & Tone

* **Voice:** Compassionate, professional, and deeply rooted in South African heritage. It should speak to both B2B undertakers and grieving families with utmost respect.
* **Visual Style:** Clean, structured, and premium. It should highlight the craftsmanship of the wood (Kiaat, Oak, Walnut) and the metallic hardware (domes, figurines) without feeling cluttered.
* **Imagery:** High-contrast, well-lit studio shots of caskets on pure white or light-grey backgrounds (which aligns perfectly with the image optimizer and white/grey background CSS you have already written).

### 2. The Color Palette

Your current codebase (`BrevoEmailService.cs`) uses a highly saturated violet/navy (`#1a103c`) and a flat gold (`#a89f6e`). To match SAFS, you need to transition to a more traditional, grounded palette that reflects casket materials:

* **Primary Brand Color (Heritage Navy):** `#0F2040` — A much deeper, traditional navy blue that commands trust and solemnity.
* **Accent Color (Brass/Gold):** `#C5A059` — A warmer, metallic gold that perfectly matches the casket handles, trimming, and hardware.
* **Backgrounds:** `#F8F9FA` (Soft off-white for catalog pages) and `#FFFFFF` (Pure white for product cards).
* **Text:** `#2C3E50` (Deep charcoal, which is softer on the eyes than pure black for reading sensitive information).

### 3. Typography

To look like a legacy supplier established in 1998, you should use a dual-font strategy:

* **Headings (Legacy & Premium):** Use a clean Serif font like **Playfair Display** or **Merriweather**. This mimics traditional print and conveys history.
* **Body & Catalog UI (Modern & Readable):** Use a structured Sans-Serif like **Inter** or **Roboto** for your product tables, prices, and forms.

---

### Step-by-Step Implementation

#### 1. Update the .NET Email Service (`BrevoEmailService.cs`)

You need to update the hardcoded HTML template in your .NET backend to use the new SAFS colors, update the company name, and inject the slogan.

Find the `htmlContent` string inside your `SendOrderConfirmationAsync` method and update it to this:

```csharp
var htmlContent = $@"
<html>
    <body style='font-family: ""Inter"", Arial, sans-serif; color: #2C3E50; line-height: 1.6;'>
        <div style='background: #0F2040; padding: 25px; text-align: center; border-bottom: 4px solid #C5A059;'>
            <h2 style='color: #FFFFFF; margin: 0; font-family: ""Playfair Display"", serif; font-size: 24px; letter-spacing: 1px;'>
                SOUTH AFRICAN FUNERAL SUPPLIES
            </h2>
            <p style='color: #C5A059; margin: 5px 0 0 0; font-size: 13px; font-style: italic;'>
                SA's leading caskets supplier
            </p>
        </div>
        <div style='padding: 20px;'>
            <h3 style='font-family: ""Playfair Display"", serif; color: #0F2040;'>Order Confirmation</h3>
            <p>Dear {customerName},</p>
            <p>Thank you for placing your order with us. Your order status is currently <strong style='color: #C5A059;'>Pending</strong>.</p>
            <p><strong>Order ID:</strong> #{order.OrderId.ToString().PadLeft(5, '0')}</p>
            
            <table style='width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;'>
                <thead>
                    <tr style='background: #F8F9FA; text-transform: uppercase; font-size: 12px; color: #0F2040;'>
                        <th style='padding: 10px; text-align: left; border-bottom: 2px solid #C5A059;'>Product</th>
                        <th style='padding: 10px; text-align: left; border-bottom: 2px solid #C5A059;'>Variant</th>
                        <th style='padding: 10px; border-bottom: 2px solid #C5A059;'>Qty</th>
                    </tr>
                </thead>
                <tbody>
                    {itemsHtml}
                </tbody>
            </table>
            
            {(string.IsNullOrEmpty(order.Notes) ? "" : $"<p style='margin-top: 20px;'><strong>Your Notes:</strong><br/>{order.Notes}</p>")}

            <div style='margin-top: 30px; padding: 15px; background: #F8F9FA; text-align: center; border-radius: 5px; border: 1px solid #E9ECEF;'>
                <p style='margin: 0 0 15px 0; color: #0F2040;'><strong>Browse Our Full Catalog</strong></p>
                <a href='{_settings.CatalogueUrl}' style='display: inline-block; padding: 12px 30px; background: #0F2040; color: #FFFFFF; text-decoration: none; border-radius: 4px; font-weight: bold;'>View Full Catalog</a>
            </div>

            <p style='margin-top: 30px; font-size: 13px; color: #7f8c8d;'>
                Our team will review your order and get back to you with pricing details shortly.<br/>
                For any inquiries, please contact us at {(_settings.SenderEmail)} or call our Phoenix, Durban head office.
            </p>
        </div>
    </body>
</html>";

```

#### 2. Update the Angular Frontend (`styles.css`)

To apply this across your website, define these colors as CSS variables at the root of your Angular `styles.css` file so all your components can inherit them.

```css
/* src/styles.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

:root {
  /* Core Brand Colors */
  --safs-primary: #0F2040;     /* Heritage Navy */
  --safs-accent: #C5A059;      /* Brass / Gold */
  
  /* Text Colors */
  --safs-text-main: #2C3E50;   /* Charcoal */
  --safs-text-muted: #7F8C8D;  /* Grey */
  
  /* Backgrounds */
  --safs-bg-light: #F8F9FA;
  --safs-bg-white: #FFFFFF;

  /* Typography */
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
}

body {
  font-family: var(--font-body);
  color: var(--safs-text-main);
  background-color: var(--safs-bg-light);
}

h1, h2, h3, h4, h5 {
  font-family: var(--font-heading);
  color: var(--safs-primary);
}

/* Example generic button update */
.btn-primary {
  background-color: var(--safs-primary);
  color: var(--safs-bg-white);
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: var(--safs-accent);
}

```

#### 3. Update the Website Title (`index.html`)

Finally, ensure SEO and the browser tab reflect the new branding. Open your Angular `src/index.html` file and change the `<title>` tag:

```html
<title>SA Funeral API</title>

<title>South African Funeral Supplies - SA's leading caskets supplier</title>

```