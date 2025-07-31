# Shop-pal (ShopTracker Pro)

Shop-pal is a modern, browser-based sales and inventory management system designed for small shops and businesses. It provides a beautiful, responsive interface for tracking sales, managing products, generating reports, and customizing your shop experience—all without any backend or server setup. All data is stored locally in your browser using localStorage.

## Features

- **Dashboard Overview**: Visualize sales, revenue, profit, and product stats with interactive charts.
<img width="1919" height="1079" alt="Screenshot 2025-07-31 172429" src="https://github.com/user-attachments/assets/3a7e4309-cb58-47c8-9efa-6ce334e17150" />

- **Sales Management**: Record new sales, view sales history, and edit or delete sales entries.
- <img width="1919" height="1072" alt="image" src="https://github.com/user-attachments/assets/e94a6b31-4a60-48e6-8d8e-b4f48e2be1c3" />

- **Product Catalog**: Add, edit, and manage products with categories, stock levels, and low-stock alerts.
- <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/26fc5d1f-ceba-4fb9-95b2-5a78de0beb0a" />

- **Reports**: Generate daily, weekly, and product performance reports. Export data as JSON or Excel.
- <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/eb5f0258-4484-4a61-9241-6afd27b37dd9" />

- **Profiles**: Support for multiple shop profiles, each with its own data and settings.
- <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/01ae1694-dd3d-466a-b044-a554d94c3191" />

- **Settings**: Customize shop name, owner, currency, profile picture, and high performance limits.
- <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3edc1515-123d-4590-9959-c2de02630680" />

- **Custom Categories**: Add, edit, or delete product categories for better organization.
- <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/911eded7-1009-4871-b1c6-d142d3323f1c" />

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
