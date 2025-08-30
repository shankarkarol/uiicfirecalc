// UIIC Fire Premium Calculator - Main JavaScript

class FirePremiumCalculator {
    constructor() {
        this.initializeEventListeners();
        this.loadSavedCalculations();
        this.initializePWA();
        this.premiumRates = this.initializePremiumRates();
    }

    // Premium rate structure based on property types and risk factors
    initializePremiumRates() {
        return {
            // Base rates per thousand of sum insured (in ₹)
            baseRates: {
                residential: 0.50,
                commercial: 0.75,
                industrial: 1.00
            },
            
            // Construction type multipliers
            constructionMultipliers: {
                pucca: 0.8,
                'semi-pucca': 1.0,
                kutcha: 1.5
            },
            
            // Occupancy type multipliers
            occupancyMultipliers: {
                'own-residence': 0.9,
                'rented-residence': 1.0,
                office: 1.1,
                'shop': 1.2,
                warehouse: 1.0,
                manufacturing: 1.4,
                educational: 0.95,
                healthcare: 1.1
            },
            
            // Location risk multipliers (simplified)
            locationMultipliers: {
                'mumbai': 1.2,
                'delhi': 1.1,
                'kolkata': 1.1,
                'chennai': 1.1,
                'maharashtra': 1.05,
                'gujarat': 1.0,
                'karnataka': 1.0,
                'tamil-nadu': 1.0,
                'west-bengal': 1.05,
                'uttar-pradesh': 0.95,
                'rajasthan': 0.9,
                'madhya-pradesh': 0.9,
                'bihar': 0.85,
                'odisha': 0.85,
                'andhra-pradesh': 0.9,
                'telangana': 0.9,
                'kerala': 1.0,
                'punjab': 0.95,
                'haryana': 0.95,
                'jharkhand': 0.85,
                'chhattisgarh': 0.85,
                'uttarakhand': 0.9,
                'himachal-pradesh': 0.9,
                'goa': 1.0,
                'assam': 0.85,
                'arunachal-pradesh': 0.8,
                'manipur': 0.8,
                'meghalaya': 0.8,
                'mizoram': 0.8,
                'nagaland': 0.8,
                'sikkim': 0.8,
                'tripura': 0.8
            },
            
            // Safety measure discounts (percentage)
            safetyDiscounts: {
                'fire-extinguisher': 2,
                'smoke-detector': 3,
                'sprinkler-system': 5,
                'fire-alarm': 4
            },
            
            // Security system discounts (percentage)
            securityDiscounts: {
                'security-guard': 3,
                'cctv': 2,
                'burglar-alarm': 2
            },
            
            // Age loading (percentage increase per year above 10 years)
            ageLoading: {
                threshold: 10,
                ratePerYear: 0.5,
                maxLoading: 25
            },
            
            // Tax rates
            taxRates: {
                gst: 18,
                serviceTax: 0 // Replaced by GST
            }
        };
    }

    initializeEventListeners() {
        // Form submission
        document.getElementById('premiumForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculatePremium();
        });

        // Reset form
        document.getElementById('resetForm').addEventListener('click', () => {
            this.resetForm();
        });

        // Results actions
        document.getElementById('saveCalculation').addEventListener('click', () => {
            this.saveCalculation();
        });

        document.getElementById('printQuote').addEventListener('click', () => {
            this.printQuote();
        });

        document.getElementById('newCalculation').addEventListener('click', () => {
            this.newCalculation();
        });

        // Real-time validation
        document.getElementById('sumInsured').addEventListener('input', (e) => {
            this.validateSumInsured(e.target);
        });

        // Property type change handler
        document.getElementById('propertyType').addEventListener('change', () => {
            this.updateOccupancyOptions();
        });
    }

    validateSumInsured(input) {
        const value = parseInt(input.value);
        const min = 1000;
        const max = 100000000;
        
        if (value < min || value > max) {
            input.setCustomValidity(`Amount must be between ₹${min.toLocaleString()} and ₹${max.toLocaleString()}`);
        } else {
            input.setCustomValidity('');
        }
    }

    updateOccupancyOptions() {
        const propertyType = document.getElementById('propertyType').value;
        const occupancySelect = document.getElementById('occupancyType');
        
        // Clear existing options except the first one
        occupancySelect.innerHTML = '<option value="">Select Occupancy Type</option>';
        
        let options = [];
        switch (propertyType) {
            case 'residential':
                options = [
                    { value: 'own-residence', text: 'Own Residence' },
                    { value: 'rented-residence', text: 'Rented Residence' }
                ];
                break;
            case 'commercial':
                options = [
                    { value: 'office', text: 'Office' },
                    { value: 'shop', text: 'Shop/Retail' },
                    { value: 'warehouse', text: 'Warehouse' },
                    { value: 'educational', text: 'Educational Institution' },
                    { value: 'healthcare', text: 'Healthcare Facility' }
                ];
                break;
            case 'industrial':
                options = [
                    { value: 'manufacturing', text: 'Manufacturing' },
                    { value: 'warehouse', text: 'Warehouse' }
                ];
                break;
        }
        
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            occupancySelect.appendChild(optionElement);
        });
    }

    async calculatePremium() {
        try {
            this.showLoading(true);
            
            // Get form data
            const formData = this.getFormData();
            
            // Validate required fields
            if (!this.validateFormData(formData)) {
                this.showLoading(false);
                return;
            }
            
            // Simulate calculation delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Perform calculations
            const calculations = this.performCalculations(formData);
            
            // Display results
            this.displayResults(formData, calculations);
            
            this.showLoading(false);
        } catch (error) {
            console.error('Calculation error:', error);
            alert('An error occurred during calculation. Please try again.');
            this.showLoading(false);
        }
    }

    getFormData() {
        const form = document.getElementById('premiumForm');
        const formData = new FormData(form);
        
        return {
            propertyType: formData.get('propertyType'),
            sumInsured: parseInt(formData.get('sumInsured')),
            location: formData.get('location'),
            constructionType: formData.get('constructionType'),
            propertyAge: parseInt(formData.get('propertyAge')) || 0,
            occupancyType: formData.get('occupancyType'),
            fireSafety: formData.getAll('fireSafety'),
            security: formData.getAll('security')
        };
    }

    validateFormData(data) {
        const required = ['propertyType', 'sumInsured', 'location', 'constructionType', 'occupancyType'];
        
        for (const field of required) {
            if (!data[field]) {
                alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
                return false;
            }
        }
        
        if (data.sumInsured < 1000 || data.sumInsured > 100000000) {
            alert('Sum insured must be between ₹1,000 and ₹10,00,00,000');
            return false;
        }
        
        return true;
    }

    performCalculations(data) {
        const rates = this.premiumRates;
        
        // Base premium calculation
        const baseRate = rates.baseRates[data.propertyType];
        const basePremium = (data.sumInsured / 1000) * baseRate;
        
        // Apply multipliers
        const constructionMultiplier = rates.constructionMultipliers[data.constructionType];
        const occupancyMultiplier = rates.occupancyMultipliers[data.occupancyType];
        const locationMultiplier = rates.locationMultipliers[data.location] || 1.0;
        
        let adjustedPremium = basePremium * constructionMultiplier * occupancyMultiplier * locationMultiplier;
        
        // Age loading
        let ageLoading = 0;
        if (data.propertyAge > rates.ageLoading.threshold) {
            const excessYears = data.propertyAge - rates.ageLoading.threshold;
            ageLoading = Math.min(
                excessYears * rates.ageLoading.ratePerYear,
                rates.ageLoading.maxLoading
            );
            adjustedPremium += (adjustedPremium * ageLoading / 100);
        }
        
        // Safety discounts
        let safetyDiscount = 0;
        data.fireSafety.forEach(safety => {
            if (rates.safetyDiscounts[safety]) {
                safetyDiscount += rates.safetyDiscounts[safety];
            }
        });
        
        // Security discounts
        let securityDiscount = 0;
        data.security.forEach(security => {
            if (rates.securityDiscounts[security]) {
                securityDiscount += rates.securityDiscounts[security];
            }
        });
        
        const totalDiscount = Math.min(safetyDiscount + securityDiscount, 20); // Max 20% discount
        const discountAmount = adjustedPremium * totalDiscount / 100;
        const netPremium = adjustedPremium - discountAmount;
        
        // GST calculation
        const gstAmount = netPremium * rates.taxRates.gst / 100;
        const totalPremium = netPremium + gstAmount;
        
        return {
            basePremium,
            constructionMultiplier,
            occupancyMultiplier,
            locationMultiplier,
            ageLoading,
            adjustedPremium,
            safetyDiscount,
            securityDiscount,
            totalDiscount,
            discountAmount,
            netPremium,
            gstAmount,
            totalPremium
        };
    }

    displayResults(formData, calculations) {
        // Update property details
        const propertyDetails = document.getElementById('propertyDetails');
        propertyDetails.innerHTML = `
            <p><strong>Property Type:</strong> ${this.formatPropertyType(formData.propertyType)}</p>
            <p><strong>Sum Insured:</strong> ₹${formData.sumInsured.toLocaleString()}</p>
            <p><strong>Location:</strong> ${this.formatLocation(formData.location)}</p>
            <p><strong>Construction:</strong> ${this.formatConstruction(formData.constructionType)}</p>
            <p><strong>Occupancy:</strong> ${this.formatOccupancy(formData.occupancyType)}</p>
            <p><strong>Property Age:</strong> ${formData.propertyAge} years</p>
            ${formData.fireSafety.length > 0 ? `<p><strong>Fire Safety:</strong> ${formData.fireSafety.map(s => this.formatSafety(s)).join(', ')}</p>` : ''}
            ${formData.security.length > 0 ? `<p><strong>Security:</strong> ${formData.security.map(s => this.formatSecurity(s)).join(', ')}</p>` : ''}
        `;
        
        // Update premium breakdown
        const premiumBreakdown = document.getElementById('premiumBreakdown');
        premiumBreakdown.innerHTML = `
            <div class="breakdown-item">
                <span>Base Premium:</span>
                <span>₹${calculations.basePremium.toFixed(2)}</span>
            </div>
            <div class="breakdown-item">
                <span>Construction Factor (${calculations.constructionMultiplier}x):</span>
                <span>₹${(calculations.basePremium * calculations.constructionMultiplier - calculations.basePremium).toFixed(2)}</span>
            </div>
            <div class="breakdown-item">
                <span>Occupancy Factor (${calculations.occupancyMultiplier}x):</span>
                <span>₹${(calculations.basePremium * calculations.constructionMultiplier * calculations.occupancyMultiplier - calculations.basePremium * calculations.constructionMultiplier).toFixed(2)}</span>
            </div>
            <div class="breakdown-item">
                <span>Location Factor (${calculations.locationMultiplier}x):</span>
                <span>₹${(calculations.adjustedPremium / (1 + calculations.ageLoading/100) - calculations.basePremium * calculations.constructionMultiplier * calculations.occupancyMultiplier).toFixed(2)}</span>
            </div>
            ${calculations.ageLoading > 0 ? `
            <div class="breakdown-item">
                <span>Age Loading (${calculations.ageLoading}%):</span>
                <span>₹${(calculations.adjustedPremium - calculations.adjustedPremium / (1 + calculations.ageLoading/100)).toFixed(2)}</span>
            </div>` : ''}
            <div class="breakdown-item">
                <span>Sub Total:</span>
                <span>₹${calculations.adjustedPremium.toFixed(2)}</span>
            </div>
            ${calculations.totalDiscount > 0 ? `
            <div class="breakdown-item">
                <span>Discount (${calculations.totalDiscount}%):</span>
                <span>-₹${calculations.discountAmount.toFixed(2)}</span>
            </div>` : ''}
            <div class="breakdown-item">
                <span>Net Premium:</span>
                <span>₹${calculations.netPremium.toFixed(2)}</span>
            </div>
            <div class="breakdown-item">
                <span>GST (${this.premiumRates.taxRates.gst}%):</span>
                <span>₹${calculations.gstAmount.toFixed(2)}</span>
            </div>
            <div class="breakdown-item">
                <span>Total Premium:</span>
                <span>₹${calculations.totalPremium.toFixed(2)}</span>
            </div>
        `;
        
        // Update total premium
        document.getElementById('totalPremium').textContent = `₹${calculations.totalPremium.toFixed(2)}`;
        
        // Show results section
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }

    formatPropertyType(type) {
        return type.charAt(0).toUpperCase() + type.slice(1);
    }

    formatLocation(location) {
        return location.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatConstruction(type) {
        const types = {
            'pucca': 'Pucca (RCC/Brick/Stone)',
            'semi-pucca': 'Semi-Pucca (Mixed)',
            'kutcha': 'Kutcha (Wood/Thatch)'
        };
        return types[type] || type;
    }

    formatOccupancy(type) {
        const types = {
            'own-residence': 'Own Residence',
            'rented-residence': 'Rented Residence',
            'office': 'Office',
            'shop': 'Shop/Retail',
            'warehouse': 'Warehouse',
            'manufacturing': 'Manufacturing',
            'educational': 'Educational Institution',
            'healthcare': 'Healthcare Facility'
        };
        return types[type] || type;
    }

    formatSafety(safety) {
        const safetyTypes = {
            'fire-extinguisher': 'Fire Extinguisher',
            'smoke-detector': 'Smoke Detector',
            'sprinkler-system': 'Sprinkler System',
            'fire-alarm': 'Fire Alarm'
        };
        return safetyTypes[safety] || safety;
    }

    formatSecurity(security) {
        const securityTypes = {
            'security-guard': 'Security Guard',
            'cctv': 'CCTV Surveillance',
            'burglar-alarm': 'Burglar Alarm'
        };
        return securityTypes[security] || security;
    }

    saveCalculation() {
        const formData = this.getFormData();
        const calculations = this.performCalculations(formData);
        
        const calculation = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            formData,
            calculations,
            totalPremium: calculations.totalPremium
        };
        
        const saved = this.getSavedCalculations();
        saved.push(calculation);
        
        // Keep only last 10 calculations
        if (saved.length > 10) {
            saved.splice(0, saved.length - 10);
        }
        
        localStorage.setItem('fireCalculations', JSON.stringify(saved));
        this.loadSavedCalculations();
        
        alert('Calculation saved successfully!');
    }

    getSavedCalculations() {
        const saved = localStorage.getItem('fireCalculations');
        return saved ? JSON.parse(saved) : [];
    }

    loadSavedCalculations() {
        const saved = this.getSavedCalculations();
        const savedList = document.getElementById('savedList');
        
        if (saved.length === 0) {
            savedList.innerHTML = '<p class="text-center text-muted">No saved calculations yet.</p>';
            return;
        }
        
        savedList.innerHTML = saved.reverse().map(calc => `
            <div class="saved-item">
                <div class="saved-item-info">
                    <div class="saved-item-title">
                        ${this.formatPropertyType(calc.formData.propertyType)} - ₹${calc.formData.sumInsured.toLocaleString()}
                    </div>
                    <div class="saved-item-details">
                        ${new Date(calc.timestamp).toLocaleDateString()} | Premium: ₹${calc.totalPremium.toFixed(2)}
                    </div>
                </div>
                <div class="saved-item-actions">
                    <button class="btn btn-sm btn-info" onclick="calculator.loadCalculation(${calc.id})">Load</button>
                    <button class="btn btn-sm btn-secondary" onclick="calculator.deleteCalculation(${calc.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    loadCalculation(id) {
        const saved = this.getSavedCalculations();
        const calculation = saved.find(calc => calc.id === id);
        
        if (!calculation) {
            alert('Calculation not found!');
            return;
        }
        
        // Populate form with saved data
        const data = calculation.formData;
        document.getElementById('propertyType').value = data.propertyType;
        document.getElementById('sumInsured').value = data.sumInsured;
        document.getElementById('location').value = data.location;
        document.getElementById('constructionType').value = data.constructionType;
        document.getElementById('propertyAge').value = data.propertyAge;
        
        // Update occupancy options and set value
        this.updateOccupancyOptions();
        setTimeout(() => {
            document.getElementById('occupancyType').value = data.occupancyType;
        }, 100);
        
        // Set checkboxes
        document.querySelectorAll('input[name="fireSafety"]').forEach(cb => {
            cb.checked = data.fireSafety.includes(cb.value);
        });
        
        document.querySelectorAll('input[name="security"]').forEach(cb => {
            cb.checked = data.security.includes(cb.value);
        });
        
        // Display results
        this.displayResults(data, calculation.calculations);
        
        // Scroll to form
        document.getElementById('premiumForm').scrollIntoView({ behavior: 'smooth' });
    }

    deleteCalculation(id) {
        if (!confirm('Are you sure you want to delete this calculation?')) {
            return;
        }
        
        const saved = this.getSavedCalculations();
        const filtered = saved.filter(calc => calc.id !== id);
        localStorage.setItem('fireCalculations', JSON.stringify(filtered));
        this.loadSavedCalculations();
    }

    printQuote() {
        window.print();
    }

    newCalculation() {
        this.resetForm();
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('premiumForm').scrollIntoView({ behavior: 'smooth' });
    }

    resetForm() {
        document.getElementById('premiumForm').reset();
        document.getElementById('resultsSection').style.display = 'none';
        this.updateOccupancyOptions();
    }

    showLoading(show) {
        document.getElementById('loadingSpinner').style.display = show ? 'flex' : 'none';
    }

    // PWA functionality
    initializePWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }

        // Install prompt
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallPrompt();
        });

        document.getElementById('installApp').addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log('Install prompt outcome:', outcome);
                deferredPrompt = null;
                this.hideInstallPrompt();
            }
        });

        document.getElementById('dismissInstall').addEventListener('click', () => {
            this.hideInstallPrompt();
            localStorage.setItem('installPromptDismissed', Date.now().toString());
        });
    }

    showInstallPrompt() {
        const lastDismissed = localStorage.getItem('installPromptDismissed');
        const daysSinceDismissed = lastDismissed ? 
            (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24) : 999;
        
        if (daysSinceDismissed > 7) { // Show again after 7 days
            document.getElementById('installPrompt').style.display = 'block';
        }
    }

    hideInstallPrompt() {
        document.getElementById('installPrompt').style.display = 'none';
    }
}

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new FirePremiumCalculator();
});