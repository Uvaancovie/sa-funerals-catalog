# Color Variations Feature Guide

## Overview
The color variation system allows you to add multiple color options for products, each with its own set of images. When users click on a color swatch, the product images update automatically.

## How to Add Products with Color Variations

### As an Admin:

1. **Navigate to Admin Portal**
   - Go to `/admin-signin` and login
   - Click on "Product Management" or navigate to `/admin/products`

2. **Create a New Product**
   - Fill in basic information (ID, Name, Category, etc.)
   - Upload general product images if needed

3. **Add Color Variations**
   - Scroll down to the "Color Variations" section
   - Click "+ Add Color Variation"
   - For each color variation:
     - Enter the color name (e.g., "Brown", "Cherry", "White")
     - Click "Choose Images" to upload images for that specific color
     - Upload multiple images showing the product in that color
     - Repeat for each color you want to add

4. **Submit**
   - Click "Create Product" to save

### Example Setup:

**Product: Oxford Casket**
- Color Variation 1:
  - Color: "Cherry"
  - Images: [cherry-front.png, cherry-side.png, cherry-detail.png]
- Color Variation 2:
  - Color: "Walnut"
  - Images: [walnut-front.png, walnut-side.png, walnut-detail.png]
- Color Variation 3:
  - Color: "White"
  - Images: [white-front.png, white-side.png, white-detail.png]

## How It Works on the Frontend

### Product Catalog (`/catalog`)
- Color swatches appear at the bottom of each product card
- Clicking a color swatch changes the displayed image
- The selected color is highlighted with a gold ring

### Product Detail Page (`/product/{id}`)
- Large color swatches appear in the "Selective Finish" section
- Clicking a color updates the main product image
- The magnifier feature works with the selected color's image
- Selected color name is displayed at the top right

## Database Structure

Products store color variations as JSON:
```json
{
  "colorVariations": [
    {
      "color": "Brown",
      "images": [
        "assets/product-id/brown-1.png",
        "assets/product-id/brown-2.png"
      ]
    },
    {
      "color": "Cherry",
      "images": [
        "assets/product-id/cherry-1.png"
      ]
    }
  ]
}
```

## Testing

1. Reset database with color variations:
   ```powershell
   cd SAFuneralSuppliesAPI
   dotnet ef database drop --force
   dotnet ef database update
   dotnet run
   ```

2. The seeder will automatically create color variations for products where applicable

3. Visit the catalog to see color swatches

4. Click on a color to see images change

## Tips

- Use consistent naming for colors (e.g., "Brown", not "brown" or "BROWN")
- Ensure images are high quality and show the product clearly
- Upload at least one image per color variation
- Colors work best with: Cherry, Teak, Kiaat, Walnut, White, Ash, Black, Brown, Green, Hemlock

## Troubleshooting

**Colors not showing?**
- Make sure you've added at least one color variation with images
- Check that color names are filled in
- Verify images were uploaded successfully

**Images not changing?**
- Clear browser cache
- Check browser console for errors
- Ensure the API is running and data is seeded
