# Shop-pal (ShopTracker Pro)

Shop-pal is a modern, browser-based sales and inventory management system designed for small shops and businesses. It provides a beautiful, responsive interface for tracking sales, managing products, generating reports, and customizing your shop experience—all without any backend or server setup. All data is stored locally in your browser using localStorage.

## Features

- **Dashboard Overview**: Visualize sales, revenue, profit, and product stats with interactive charts.
- **Sales Management**: Record new sales, view sales history, and edit or delete sales entries.
- **Product Catalog**: Add, edit, and manage products with categories, stock levels, and low-stock alerts.
- **Reports**: Generate daily, weekly, and product performance reports. Export data as JSON or Excel.
- **Profiles**: Support for multiple shop profiles, each with its own data and settings.
- **Settings**: Customize shop name, owner, currency, profile picture, and high performance limits.
- **Custom Categories**: Add, edit, or delete product categories for better organization.
- **Dashboard Customization**: Choose which statistics and cards to display on your dashboard.
- **Avatar Cropping**: Upload and crop profile avatars with a built-in cropping tool.
- **Multi-Currency Support**: Choose from a wide range of world currencies for your shop.
- **Data Import/Export**: Backup or restore your shop data using JSON or Excel files.
- **Notifications & Messages**: In-app notifications and message management.
- **Responsive Design**: Works great on desktop and tablets.

## Quick Start

1. **Download or Clone the Repository**
   ```
   git clone https://github.com/justelson/Shop-pal.git
   ```
2. **Open the App**
   - Simply open `index.html` in your preferred web browser (Chrome, Edge, Firefox, Safari, etc.).
   - No installation or server required.

## Dependencies

- [Chart.js](https://www.chartjs.org/) (for charts, loaded via CDN)
- [SheetJS (xlsx)](https://sheetjs.com/) (for Excel export, loaded via CDN)
- All other logic and UI are implemented in vanilla JavaScript, HTML, and CSS.

## File Structure

- `index.html` — Main application HTML
- `styles.css` — App styling
- `script.js` — Main application logic
- `assets/` — Icons and images
- `logo.png` — App icon

## Data Storage

All data is stored in your browser's localStorage. No data is sent to any server. You can export/import your data for backup or migration.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request. For major changes, open an issue first to discuss what you would like to change.

## License

MIT-license 