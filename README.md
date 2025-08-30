# UIIC Fire Premium Calculator

A comprehensive web application for calculating fire insurance premiums for UIIC (United India Insurance Company) policies. This modern, responsive web app provides the same functionality as the original APK with enhanced features for web and mobile devices.

## 🔥 Features

### Core Functionality
- **Premium Calculation Engine**: Advanced algorithms for accurate fire insurance premium calculations
- **Property Type Support**: Residential, Commercial, and Industrial properties
- **Risk Assessment**: Comprehensive evaluation of fire and security risks
- **Multi-factor Calculations**: Property type, construction, location, age, and safety measures
- **Tax Calculations**: Automatic GST and service tax computations
- **Discount Applications**: Safety and security measure discounts

### User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with intuitive navigation
- **Real-time Validation**: Instant form validation and error feedback
- **Interactive Results**: Detailed premium breakdown with explanations
- **Print Support**: Professional quote printing functionality

### Advanced Features
- **Progressive Web App**: Install on mobile devices for native app experience
- **Offline Functionality**: Calculate premiums without internet connection
- **Local Storage**: Save and retrieve previous calculations
- **Background Sync**: Automatic data synchronization when online
- **Fast Loading**: Optimized performance with caching strategies

## 🚀 Getting Started

### Quick Start
1. **Direct Access**: Open `index.html` in any modern web browser
2. **Local Server**: For full PWA features, serve through a local HTTP server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
3. **Access**: Navigate to `http://localhost:8000`

### Installation as PWA
1. **Desktop**: Click the install prompt in supported browsers
2. **Mobile**: Use "Add to Home Screen" option in browser menu
3. **Offline**: App works fully offline after first visit

## 📱 Usage Guide

### Basic Calculation
1. **Property Information**:
   - Select property type (Residential/Commercial/Industrial)
   - Enter sum insured amount (₹1,000 to ₹10,00,00,000)
   - Choose location/state
   - Select construction type
   - Specify property age

2. **Risk Assessment**:
   - Choose occupancy type
   - Select fire safety measures
   - Indicate security systems

3. **Calculate**: Click "Calculate Premium" for instant results

### Advanced Features
- **Save Calculations**: Store up to 10 recent calculations
- **Load Previous**: Reload any saved calculation for modification
- **Print Quote**: Generate professional printable quotes
- **Reset Form**: Clear all data for new calculation

## 🏗️ File Structure

```
uiicfirecalc/
├── index.html          # Main application interface
├── styles.css          # Responsive styling and themes
├── script.js           # Premium calculation logic
├── manifest.json       # PWA configuration
├── service-worker.js   # Offline functionality
├── README.md           # Documentation
└── Fire Premium Calc.apk  # Original Android app
```

## 💰 Premium Calculation Method

### Base Rates (per ₹1,000 of sum insured)
- **Residential**: ₹0.50
- **Commercial**: ₹0.75
- **Industrial**: ₹1.00

### Risk Factors
- **Construction Type**: Pucca (0.8x), Semi-Pucca (1.0x), Kutcha (1.5x)
- **Location**: State-specific multipliers (0.8x to 1.2x)
- **Occupancy**: Type-specific multipliers (0.9x to 1.4x)
- **Age Loading**: 0.5% per year above 10 years (max 25%)

### Discounts
- **Fire Safety**: Up to 14% (Fire extinguisher 2%, Smoke detector 3%, Sprinkler 5%, Alarm 4%)
- **Security**: Up to 7% (Security guard 3%, CCTV 2%, Burglar alarm 2%)
- **Maximum Discount**: 20% combined

### Taxes
- **GST**: 18% on net premium
- **Service Tax**: Replaced by GST

## 🛠️ Technical Specifications

### Technologies Used
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: ES6+ for calculations and interactions
- **PWA**: Service Worker and Web App Manifest
- **Local Storage**: Client-side data persistence

### Browser Support
- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 11+, Edge 79+
- **Mobile**: iOS Safari 11+, Chrome Mobile 60+
- **PWA Support**: Chrome, Edge, Samsung Internet, Safari 14.7+

### Performance
- **First Load**: < 2 seconds on 3G
- **Offline Ready**: Full functionality after first visit
- **Cache Strategy**: Static assets cached, dynamic content network-first
- **Bundle Size**: < 100KB total

## 🔒 Security & Privacy

### Data Handling
- **Local Only**: All calculations performed client-side
- **No Server**: No data transmitted to external servers
- **Private**: Calculations stored only in local browser storage
- **Secure**: HTTPS recommended for production deployment

### Compliance
- **GDPR**: No personal data collection
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Core Web Vitals optimized

## 🎨 Customization

### Styling
- **CSS Variables**: Easy color and spacing customization
- **Responsive**: Breakpoints for mobile, tablet, and desktop
- **Dark Mode**: Automatic system preference detection
- **Print Styles**: Optimized for professional quotes

### Premium Rates
- **Configurable**: Modify rates in `script.js`
- **Location-based**: Add new states and risk factors
- **Industry-specific**: Customize for different insurance types

## 🔄 Updates & Maintenance

### Version Control
- **Cache Busting**: Automatic cache updates with new versions
- **Progressive Enhancement**: Graceful degradation for older browsers
- **Backward Compatibility**: Saved calculations remain valid

### Monitoring
- **Service Worker**: Automatic updates and error handling
- **Performance**: Built-in loading indicators and feedback
- **Error Handling**: Comprehensive error catching and user feedback

## 📞 Support

### Common Issues
1. **Calculation Errors**: Verify all required fields are completed
2. **Offline Issues**: Ensure first visit completed successfully
3. **Install Problems**: Use supported browser and HTTPS
4. **Performance**: Clear browser cache and reload

### Browser Requirements
- JavaScript enabled
- Local Storage supported
- Service Worker supported (for PWA features)
- Modern CSS support (Grid, Flexbox)

## 📄 License

This project is created for UIIC fire insurance premium calculations. All premium rates and calculation methods are based on UIIC guidelines and may be subject to change based on current insurance regulations.

**Disclaimer**: This calculator is for estimation purposes only. Actual premium amounts may vary based on underwriting guidelines, current rates, and specific policy terms. Please consult with UIIC representatives for official premium quotes.

## 🤝 Contributing

1. **Issues**: Report bugs or suggest features
2. **Pull Requests**: Submit improvements or fixes
3. **Testing**: Help test across different devices and browsers
4. **Documentation**: Improve or translate documentation

---

**© 2024 UIIC Fire Premium Calculator. Built with ❤️ for insurance professionals.**
