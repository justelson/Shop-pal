// ShopTracker Pro - Sales Management System
class SalesTracker {
    constructor() {
        // Currency symbols mapping
        this.currencySymbols = {
            'USD': '$', 'EUR': '€', 'GBP': '$', 'JPY': '¥',
            'AED': 'د.إ', 'AFN': '؋', 'ALL': 'L', 'AMD': '֏',
            'AOA': 'Kz', 'ARS': '$', 'AWG': 'ƒ', 'AZN': '₼',
            'BAM': 'KM', 'BBD': '$', 'BDT': '৳', 'BGN': 'лв',
            'BHD': '.د.ب', 'BIF': 'Fr', 'BMD': '$', 'BND': '$',
            'BOB': 'Bs.', 'BRL': 'R$', 'BSD': '$', 'BTN': 'Nu.',
            'BWP': 'P', 'BYN': 'Br', 'BZD': '$', 'CAD': 'C$',
            'CDF': 'Fr', 'CHF': 'CHF', 'CLP': '$', 'CNY': '¥',
            'COP': '$', 'CRC': '₡', 'CUP': '$', 'CVE': '$',
            'CZK': 'Kč', 'DJF': 'Fr', 'DKK': 'kr', 'DOP': 'RD$',
            'DZD': 'د.ج', 'EGP': '£', 'ERN': 'Nfk', 'ETB': 'Br',
            'FJD': '$', 'FKP': '£', 'GEL': '₾', 'GHS': '₵',
            'GIP': '£', 'GMD': 'D', 'GNF': 'Fr', 'GTQ': 'Q',
            'GYD': '$', 'HKD': 'HK$', 'HNL': 'L', 'HRK': 'kn',
            'HTG': 'G', 'HUF': 'Ft', 'IDR': 'Rp', 'ILS': '₪',
            'INR': '₹', 'IQD': 'ع.د', 'IRR': '﷼', 'ISK': 'kr',
            'JMD': '$', 'JOD': 'د.ا', 'KES': 'Sh', 'KGS': 'с',
            'KHR': '៛', 'KMF': 'Fr', 'KPW': '₩', 'KRW': '₩',
            'KWD': 'د.ك', 'KYD': '$', 'KZT': '₸', 'LAK': '₭',
            'LBP': 'ل.ل', 'LKR': '₨', 'LRD': '$', 'LSL': 'L',
            'LYD': 'ل.د', 'MAD': 'د.م.', 'MDL': 'L', 'MGA': 'Ar',
            'MKD': 'ден', 'MMK': 'K', 'MNT': '₮', 'MOP': 'MOP$',
            'MRU': 'UM', 'MUR': '₨', 'MVR': '.ރ', 'MWK': 'MK',
            'MXN': '$', 'MYR': 'RM', 'MZN': 'MT', 'NAD': '$',
            'NGN': '₦', 'NIO': 'C$', 'NOK': 'kr', 'NPR': 'रू',
            'NZD': 'NZ$', 'OMR': 'ر.ع.', 'PAB': 'B/.', 'PEN': 'S/',
            'PGK': 'K', 'PHP': '₱', 'PKR': '₨', 'PLN': 'zł',
            'PYG': '₲', 'QAR': 'ر.ق', 'RON': 'lei', 'RSD': 'дин',
            'RUB': '₽', 'RWF': 'Fr', 'SAR': 'ر.س', 'SBD': '$',
            'SCR': '₨', 'SDG': 'ج.س', 'SEK': 'kr', 'SGD': 'S$',
            'SHP': '£', 'SLL': 'Le', 'SOS': 'Sh.So', 'SRD': '$',
            'SSP': '£', 'STN': 'Db', 'SYP': '£', 'SZL': 'L',
            'THB': '฿', 'TJS': 'с.', 'TMT': 'm.', 'TND': 'د.ت',
            'TOP': 'T$', 'TRY': '₺', 'TTD': '$', 'TWD': '$',
            'TZS': 'TSh', 'UAH': '₴', 'UGX': 'Sh', 'UYU': '$',
            'UZS': 'soʻm', 'VND': '₫', 'VUV': 'Vt', 'WST': 'T',
            'XAF': 'Fr', 'XCD': '$', 'XOF': 'Fr', 'XPF': '₣',
            'YER': '﷼', 'ZAR': 'R', 'ZMW': 'ZK', 'ZWL': '$'
        };

        // Initialize profiles system
        this.profiles = this.getAllProfiles();

        // Avatar cropping system
        this.avatarCropData = {
            image: null,
            scale: 1,
            x: 50,
            y: 50,
            canvas: null,
            previewCanvas: null
        };

        // Initial check for profile before initializing fully
        this.shopProfile = this.getShopProfile();
        if (!this.shopProfile) {
            this.showProfileSetup();
        } else {
            this.init();
        }
    }

    // --- INITIALIZATION & DATA SETUP --- //

    init() {
        document.getElementById('appBlocker').classList.remove('active');
        document.getElementById('profileSetupModal').classList.remove('active');

        // Always load data for the current profile using its ID
        this.userDatabase = this.initializeUserDatabase();
        this.products = this.userDatabase.products || [];
        this.sales = this.userDatabase.sales || [];
        // Note: Messages are dynamically generated, not stored.

        this.currentEditingSaleId = null;

        this.setupEventListeners();
        this.updateShopProfileUI();
        this.updateProductSelects();
        this.updateNotifications();
        this.loadProfiles();
        this.loadSettings();
        this.initializeAvatar();
        this.initializeCustomCategories();
        this.initializeDashboardCustomization();
        this.switchTab('dashboard');
    }

    getShopProfile() {
        const profile = localStorage.getItem('shopTrackerProfile');
        return profile ? JSON.parse(profile) : null;
    }

    showProfileSetup() {
        document.getElementById('appBlocker').classList.add('active');
        document.getElementById('profileSetupModal').classList.add('active');
        document.getElementById('profileSetupForm').addEventListener('submit', this.handleProfileSetup.bind(this));

        // Setup avatar click handler for profile setup
        const setupAvatar = document.getElementById('setupAvatarCircle');
        if (setupAvatar) {
            setupAvatar.addEventListener('click', () => {
                document.getElementById('profilePictureSetup').click();
            });
        }
        
        // Setup cancel button handler
        const cancelButton = document.getElementById('cancelProfileSetup');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                document.getElementById('profileSetupModal').classList.remove('active');
                document.getElementById('appBlocker').classList.remove('active');
            });
        }
        
        // Setup close button handler
        const closeButton = document.getElementById('closeProfileSetupModal');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                document.getElementById('profileSetupModal').classList.remove('active');
                document.getElementById('appBlocker').classList.remove('active');
            });
        }

        // Setup profile picture change handler
        const profilePictureInput = document.getElementById('profilePictureSetup');
        if (profilePictureInput) {
            profilePictureInput.addEventListener('change', (e) => this.handleSetupProfilePicture(e));
        }
    }

    handleProfileSetup(e) {
        e.preventDefault();
        const shopName = document.getElementById('shopName').value.trim();
        const ownerName = document.getElementById('ownerName').value.trim();
        const currency = document.getElementById('currency').value;
        if (!shopName || !ownerName || !currency) {
            alert('Please fill in all required fields.');
            return;
        }
        const newProfile = {
            id: Date.now(),
            shopName,
            ownerName,
            currency,
            established: new Date().getFullYear(),
            createdAt: new Date().toISOString(),
            profilePicture: this.setupProfilePicture || null // Include the profile picture if available
        };
        // Add to profiles array only if not duplicate
        let profiles = this.getAllProfiles();
        const exists = profiles.some(p => p.shopName === newProfile.shopName && p.ownerName === newProfile.ownerName && p.currency === newProfile.currency);
        if (!exists) {
            profiles.push(newProfile);
            localStorage.setItem('shopTrackerProfiles', JSON.stringify(profiles));
        }
        // Set as current profile
        localStorage.setItem('shopTrackerProfile', JSON.stringify(newProfile));
        // Create default data for this profile with default categories and dashboard settings
        localStorage.setItem(`shopTrackerData_${newProfile.id}`, JSON.stringify(this.createDefaultDatabase()));
        this.shopProfile = newProfile;
        this.profiles = profiles;
        // Remove the event listener to prevent double submissions
        document.getElementById('profileSetupForm').removeEventListener('submit', this.handleProfileSetup.bind(this));
        this.init();
    }

    initializeUserDatabase() {
        // Always use profile-specific key
        if (this.shopProfile && this.shopProfile.id) {
            let userData = localStorage.getItem(`shopTrackerData_${this.shopProfile.id}`);
            if (!userData) {
                // For backward compatibility, try generic key
                userData = localStorage.getItem('shopTrackerData');
                if (userData) {
                    // Migrate data to profile-specific key
                    localStorage.setItem(`shopTrackerData_${this.shopProfile.id}`, userData);
                    localStorage.removeItem('shopTrackerData');
                } else {
                    // No data, create default
                    localStorage.setItem(`shopTrackerData_${this.shopProfile.id}`, JSON.stringify(this.createDefaultDatabase()));
                    userData = localStorage.getItem(`shopTrackerData_${this.shopProfile.id}`);
                }
            }
            return JSON.parse(userData);
        }
        // Fallback: create default
        return this.createDefaultDatabase();
    }

    createDefaultDatabase() {
        return {
            products: [],
            sales: [],
            customCategories: [
                'Electronics', 'Clothing', 'Food & Beverages', 'Books', 'Home & Garden', 'Sports', 'Miscellaneous'
            ],
            dashboardConfig: {
                showTodaySales: true,
                showWeekSales: true,
                showTotalRevenue: true,
                showTotalProfit: true,
                showTotalProducts: true,
                showLowStock: true
            }
        };
    }

    saveUserDatabase() {
        const dataToSave = {
            products: this.products,
            sales: this.sales,
            customCategories: this.userDatabase.customCategories || [],
            dashboardConfig: this.userDatabase.dashboardConfig || {}
        };
        // Save to profile-specific key if we have a profile
        if (this.shopProfile && this.shopProfile.id) {
            const profileDataKey = `shopTrackerData_${this.shopProfile.id}`;
            localStorage.setItem(profileDataKey, JSON.stringify(dataToSave));
        }
        this.userDatabase = dataToSave;
        this.updateNotifications();
    }

    // --- EVENT LISTENERS --- //

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.currentTarget.dataset.tab));
        });

        // Forms
        document.getElementById('saleForm').addEventListener('submit', (e) => this.handleSaleSubmit(e));
        document.getElementById('productForm').addEventListener('submit', (e) => this.handleProductSubmit(e));
        document.getElementById('editSaleForm').addEventListener('submit', (e) => this.handleSaleEditSubmit(e));

        // Product selection change
        document.getElementById('productSelect').addEventListener('change', () => this.updateSaleCalculation());
        document.getElementById('quantity').addEventListener('input', () => this.updateSaleCalculation());

        // Modal controls
        document.getElementById('addProductBtn').addEventListener('click', () => this.openProductModal());
        document.getElementById('closeProductModal').addEventListener('click', () => this.closeProductModal());
        document.getElementById('cancelProductBtn').addEventListener('click', () => this.closeProductModal());

        document.getElementById('closeSaleModal').addEventListener('click', () => this.closeSaleModal());
        document.getElementById('cancelSaleEditBtn').addEventListener('click', () => this.closeSaleModal());

        // Filters
        document.getElementById('dateFilter').addEventListener('change', () => this.filterSalesHistory());
        document.getElementById('productFilter').addEventListener('change', () => this.filterSalesHistory());
        document.getElementById('clearFilters').addEventListener('click', () => this.clearFilters());

        // Search
        document.getElementById('globalSearch').addEventListener('input', (e) => this.handleGlobalSearch(e));

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-box')) {
                const searchResults = document.getElementById('searchResults');
                if (searchResults) {
                    searchResults.style.display = 'none';
                }
            }
        }, true); // Use capture to catch the click early

        // Reports & Data Management
        document.getElementById('generateReport').addEventListener('click', () => this.generateReport());
        document.getElementById('exportDataBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importDataBtn').addEventListener('click', () => document.getElementById('importDataInput').click());
        document.getElementById('importDataInput').addEventListener('change', (e) => this.importData(e));
        document.getElementById('exportExcelBtn').addEventListener('click', () => this.exportSalesToExcel());

        // Profiles Management
        document.getElementById('addProfileBtn').addEventListener('click', () => {
            document.getElementById('newProfileModal').classList.add('active');
            document.getElementById('appBlocker').classList.add('active');

            // Reset the new profile picture
            this.newProfilePicture = null;

            // Reset the avatar preview
            const avatarCircle = document.getElementById('newProfileAvatarCircle');
            if (avatarCircle) {
                const avatarImage = avatarCircle.querySelector('.avatar-image');
                const avatarPlaceholder = avatarCircle.querySelector('.avatar-placeholder');

                if (avatarImage && avatarPlaceholder) {
                    avatarImage.src = 'assets/icons/green/iconsax-profile-circle-5aksjsgv-.svg';
                    avatarImage.setAttribute('data-icon', 'iconsax-profile-circle-5aksjsgv-.svg');
                    avatarImage.style.display = 'block';
                    avatarPlaceholder.style.display = 'flex';
                    avatarCircle.classList.remove('has-image');
                }
            }
        });

        document.getElementById('closeNewProfileModal').addEventListener('click', () => {
            document.getElementById('newProfileModal').classList.remove('active');
            document.getElementById('appBlocker').classList.remove('active');
        });

        document.getElementById('cancelNewProfileBtn').addEventListener('click', () => {
            document.getElementById('newProfileModal').classList.remove('active');
            document.getElementById('appBlocker').classList.remove('active');
        });

        // Setup avatar click handler for new profile
        const newProfileAvatar = document.getElementById('newProfileAvatarCircle');
        if (newProfileAvatar) {
            newProfileAvatar.addEventListener('click', () => {
                document.getElementById('newProfilePicture').click();
            });
        }

        // Setup profile picture change handler for new profile
        const newProfilePictureInput = document.getElementById('newProfilePicture');
        if (newProfilePictureInput) {
            newProfilePictureInput.addEventListener('change', (e) => this.handleNewProfilePicture(e));
        }

        document.getElementById('newProfileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const shopName = document.getElementById('newProfileShopName').value.trim();
            const ownerName = document.getElementById('newProfileOwnerName').value.trim();
            const currency = document.getElementById('newProfileCurrency').value;
            if (!shopName || !ownerName || !currency) {
                alert('Please fill in all required fields.');
                return;
            }
            this.createNewProfile({
                shopName,
                ownerName,
                currency,
                profilePicture: this.newProfilePicture || null // Include the profile picture if available
            });
            document.getElementById('newProfileModal').classList.remove('active');
            document.getElementById('appBlocker').classList.remove('active');
        });
        document.getElementById('profilesList').addEventListener('click', (e) => this.handleProfileActions(e));

        // Settings Management
        document.getElementById('profileSettingsForm').addEventListener('submit', (e) => this.handleProfileSettingsSubmit(e));
        document.getElementById('clearAllDataBtn').addEventListener('click', () => this.clearAllData());
        document.getElementById('resetProfileBtn').addEventListener('click', () => this.resetProfile());

        // Event Delegation for action buttons
        document.getElementById('productsList').addEventListener('click', (e) => this.handleProductActions(e));
        document.getElementById('salesHistory').addEventListener('click', (e) => this.handleSaleActions(e));

        // Switch Profile button
        const switchProfileBtn = document.getElementById('switchProfileBtn');
        if (switchProfileBtn) {
            switchProfileBtn.addEventListener('click', () => this.switchTab('profiles'));
        }

        // Avatar System Event Listeners
        document.getElementById('userAvatarContainer').addEventListener('click', () => this.openAvatarCrop());
        document.getElementById('settingsProfilePicture').addEventListener('change', (e) => this.handleAvatarUpload(e));
        document.getElementById('closeAvatarCrop').addEventListener('click', () => this.closeAvatarCrop());
        document.getElementById('cancelAvatarCrop').addEventListener('click', () => this.closeAvatarCrop());
        document.getElementById('saveAvatarCrop').addEventListener('click', () => this.saveAvatarCrop());

        // Avatar crop controls
        document.getElementById('cropScale').addEventListener('input', (e) => this.updateAvatarCrop());
        document.getElementById('cropX').addEventListener('input', (e) => this.updateAvatarCrop());
        document.getElementById('cropY').addEventListener('input', (e) => this.updateAvatarCrop());

        // Custom Categories Management
        document.getElementById('addCategoryBtn').addEventListener('click', () => this.addCustomCategory());
        document.getElementById('categoriesList').addEventListener('click', (e) => this.handleCategoryActions(e));
        
        // Category Edit Modal
        document.getElementById('closeCategoryEditModal').addEventListener('click', () => this.closeCategoryEditModal());
        document.getElementById('cancelCategoryEdit').addEventListener('click', () => this.closeCategoryEditModal());
        document.getElementById('categoryEditForm').addEventListener('submit', (e) => this.handleCategoryEditSubmit(e));

        // Dashboard Customization
        document.getElementById('saveDashboardConfig').addEventListener('click', () => this.saveDashboardConfiguration());
        document.getElementById('resetDashboardConfig').addEventListener('click', () => this.resetDashboardConfiguration());

        // Modal Esc close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => modal.classList.remove('active'));
                document.getElementById('appBlocker').classList.remove('active');
            }
        });

        // Dashboard New Sale and New Product buttons
        const dashboardNewSaleBtn = document.getElementById('dashboardNewSaleBtn');
        if (dashboardNewSaleBtn) {
            dashboardNewSaleBtn.addEventListener('click', () => this.switchTab('new-sale'));
        }
        const dashboardNewProductBtn = document.getElementById('dashboardNewProductBtn');
        if (dashboardNewProductBtn) {
            dashboardNewProductBtn.addEventListener('click', () => this.openProductModal());
        }
        // Notification icon to Messages tab
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.switchTab('messages'));
        }
    }

    // --- UI & TAB MANAGEMENT --- //

    switchTab(tabName) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.removeAttribute('aria-current');
        });
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-current', 'page');
        }
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');
        this.updatePageHeader(tabName);

        // Load content for the active tab
        if (tabName === 'dashboard') this.loadDashboard();
        if (tabName === 'history') this.loadSalesHistory();
        if (tabName === 'products') this.loadProducts();
        if (tabName === 'messages') this.loadMessages();
        if (tabName === 'profiles') this.loadProfiles();
        if (tabName === 'settings') this.loadSettings();
    }

    updatePageHeader(tabName) {
        const titles = {
            'dashboard': { title: 'Dashboard', subtitle: 'Overview of your sales performance' },
            'new-sale': { title: 'New Sale', subtitle: 'Record a new sales transaction' },
            'products': { title: 'Products', subtitle: 'Manage your product catalog' },
            'history': { title: 'Sales History', subtitle: 'View and manage past transactions' },
            'reports': { title: 'Reports & Data', subtitle: 'Generate analytics and manage your data' },
            'messages': { title: 'Messages', subtitle: 'Check your notifications and messages' },
            'profiles': { title: 'Shop Profiles', subtitle: 'Manage multiple shop profiles' },
            'settings': { title: 'Settings', subtitle: 'Customize your app preferences' }
        };
        const pageInfo = titles[tabName];
        if (pageInfo) {
            document.getElementById('pageTitle').textContent = pageInfo.title;
            document.getElementById('pageSubtitle').textContent = pageInfo.subtitle;
        }
    }

    updateShopProfileUI() {
        document.querySelector('.user-name').textContent = this.shopProfile.ownerName;
        document.querySelector('.sidebar-header h2').textContent = this.shopProfile.shopName;

        // Update avatar using the new system
        this.updateAvatarUI();
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10); // Trigger transition
        setTimeout(() => {
            notification.classList.remove('show');
            notification.addEventListener('transitionend', () => notification.remove());
        }, 3000);
    }

    updateNotifications() {
        const lowStockCount = this.products.filter(p => p.stock <= 5).length;
        const badge = document.getElementById('notificationCount');
        badge.textContent = lowStockCount;
        badge.classList.toggle('active', lowStockCount > 0);
    }

    // --- PRODUCT MANAGEMENT --- //

    handleProductActions(e) {
        const button = e.target.closest('button');
        if (!button) return;

        const { id } = button.dataset;
        if (!id) return;

        if (button.classList.contains('btn-edit')) {
            this.editProduct(parseInt(id));
        } else if (button.classList.contains('btn-delete')) {
            this.deleteProduct(parseInt(id));
        }
    }

    handleProductSubmit(e) {
        e.preventDefault();
        const editId = document.getElementById('editProductId').value;
        const productData = {
            name: document.getElementById('productName').value,
            buyPrice: parseFloat(document.getElementById('productBuyPrice').value),
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            lowStock: parseInt(document.getElementById('productLowStock').value) || 0,
            category: document.getElementById('productCategory').value || 'Miscellaneous'
        };

        if (editId) {
            const index = this.products.findIndex(p => p.id == editId);
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...productData };
                this.showNotification('Product updated successfully!', 'success');
            }
        } else {
            this.products.push({ id: Date.now(), ...productData });
            this.showNotification('Product added successfully!', 'success');
        }

        this.saveUserDatabase();
        this.loadProducts();
        this.updateProductSelects();
        this.closeProductModal();
        if (document.getElementById('dashboard').classList.contains('active')) this.loadDashboard();
    }

    loadProducts() {
        const container = document.getElementById('productsList');
        container.innerHTML = '';

        if (this.products.length === 0) {
            container.innerHTML = '<p>No products yet. Add one to get started!</p>';
            return;
        }

        // Group products by category
        const productsByCategory = this.products.reduce((acc, product) => {
            const category = product.category || 'Miscellaneous';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {});

        // Create sections for each category that has products
        Object.keys(productsByCategory).sort().forEach(category => {
            const section = document.createElement('div');
            section.className = 'category-section';
            section.innerHTML = `
                <h3 class="category-header">${category}</h3>
                <div class="category-products"></div>
            `;

            const productsContainer = section.querySelector('.category-products');
            productsByCategory[category].forEach(product => {
                const stockClass = (product.lowStock > 0 && product.stock <= product.lowStock) ? 'stock-low custom-low' : (product.stock <= 5 ? 'stock-low' : '');
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <div class="product-details">
                        <div class="product-name">${product.name}</div>
                        <div class="product-category">${product.category}</div>
                        <div class="product-price">${this.formatCurrency(product.price)}</div>
                        <div class="product-stock ${stockClass}">Stock: ${product.stock}</div>
                    </div>
                    <div class="product-actions">
                        <button data-id="${product.id}" class="btn-secondary btn-edit">
                            <img class="icon" data-icon="iconsax-edit-2-tp6wwxq2-.svg" src="assets/icons/green/iconsax-edit-2-tp6wwxq2-.svg" alt="Edit" style="width: 28px; height: 28px; margin-right: 4px;">
                            Edit
                        </button>
                        <button data-id="${product.id}" class="btn-delete">
                            <img class="icon" data-icon="iconsax-transaction-minus-zlqylfdc-.svg" src="assets/icons/green/iconsax-transaction-minus-zlqylfdc-.svg" alt="Delete" style="width: 28px; height: 28px; margin-right: 4px;">
                            Delete
                        </button>
                    </div>`;
                productsContainer.appendChild(card);
            });
            container.appendChild(section);
        });
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) return;
        document.getElementById('editProductId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productBuyPrice').value = product.buyPrice || '';
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productLowStock').value = product.lowStock || '';
        document.getElementById('productModalTitle').textContent = 'Edit Product';
        document.getElementById('productSubmitBtn').textContent = 'Update Product';
        this.openProductModal();
    }

    deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) return;
        this.products = this.products.filter(p => p.id != productId);
        this.saveUserDatabase();
        this.loadProducts();
        this.updateProductSelects();
        if (document.getElementById('dashboard').classList.contains('active')) this.loadDashboard();
        this.showNotification('Product deleted.', 'success');
    }

    updateProductSelects() {
        const selects = [document.getElementById('productSelect'), document.getElementById('productFilter')];
        selects.forEach(select => {
            if (!select) return;
            const currentVal = select.value;
            select.innerHTML = `<option value="">${select.id === 'productFilter' ? 'All Products' : 'Select a product'}</option>`;
            this.products.forEach(p => {
                select.innerHTML += `<option value="${p.id}">${p.name} - ${this.formatCurrency(p.price)} (Stock: ${p.stock})</option>`;
            });
            select.value = currentVal;
        });
    }

    openProductModal() { document.getElementById('productModal').classList.add('active'); }
    closeProductModal() {
        document.getElementById('productModal').classList.remove('active');
        document.getElementById('productForm').reset();
        document.getElementById('editProductId').value = '';
        document.getElementById('productModalTitle').textContent = 'Add New Product';
        document.getElementById('productSubmitBtn').textContent = 'Add Product';
    }

    // --- SALES MANAGEMENT --- //

    handleSaleSubmit(e) {
        e.preventDefault();
        const productId = parseInt(document.getElementById('productSelect').value);
        const quantity = parseInt(document.getElementById('quantity').value);
        const product = this.products.find(p => p.id === productId);

        if (!product || !quantity) {
            this.showNotification('Please select a product and quantity.', 'error');
            return;
        }
        if (quantity > product.stock) {
            this.showNotification(`Insufficient stock! Available: ${product.stock}.`, 'error');
            return;
        }

        this.sales.push({
            id: Date.now(),
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            unitPrice: product.price,
            buyPrice: product.buyPrice,
            total: quantity * product.price,
            revenue: quantity * product.price,
            profit: (product.price - (product.buyPrice || 0)) * quantity,
            customerName: document.getElementById('customerName').value || 'Walk-in',
            date: new Date().toISOString()
        });

        product.stock -= quantity;
        this.saveUserDatabase();
        this.showNotification(`Sale recorded successfully!`, 'success');

        // Check high performance limit
        if (this.shopProfile && this.shopProfile.highPerformanceLimit > 0) {
            const stats = this.calculateStatistics();
            if (stats.totalProfit >= this.shopProfile.highPerformanceLimit) {
                this.showNotification(`Congratulations! Total profit has exceeded your high performance limit of ${this.formatCurrency(this.shopProfile.highPerformanceLimit)}.`, 'success');
            } else if (stats.totalRevenue >= this.shopProfile.highPerformanceLimit) {
                this.showNotification(`Congratulations! Total revenue has exceeded your high performance limit of ${this.formatCurrency(this.shopProfile.highPerformanceLimit)}.`, 'success');
            }
        }

        // Check for low stock alerts
        const lowStockProducts = this.products.filter(p => p.lowStock > 0 && p.stock <= p.lowStock);
        if (lowStockProducts.length > 0) {
            lowStockProducts.forEach(p => {
                this.showNotification(`Low stock alert: ${p.name} has only ${p.stock} left (threshold: ${p.lowStock})!`, 'error');
            });
        }

        document.getElementById('saleForm').reset();
        this.updateSaleCalculation();
        this.updateProductSelects();
        if (document.getElementById('products').classList.contains('active')) this.loadProducts();
        if (document.getElementById('dashboard').classList.contains('active')) this.loadDashboard();
    }

    formatCurrency(amount) {
        if (typeof amount !== 'number') {
            amount = 0;
        }
        const symbol = this.currencySymbols[this.shopProfile.currency] || this.shopProfile.currency;
        // Special handling for currencies that typically don't use decimals
        if (['JPY', 'KRW'].includes(this.shopProfile.currency)) {
            return `${symbol}${Math.round(amount)}`;
        }
        return `${symbol}${amount.toFixed(2)}`;
    }

    updateSaleCalculation() {
        const productId = parseInt(document.getElementById('productSelect').value);
        const quantity = parseInt(document.getElementById('quantity').value) || 0;
        const product = this.products.find(p => p.id === productId);

        document.getElementById('unitPrice').textContent = product ? this.formatCurrency(product.price) : this.formatCurrency(0);
        document.getElementById('saleTotal').textContent = product ? this.formatCurrency(product.price * quantity) : this.formatCurrency(0);
    }

    // --- SALES HISTORY & EDITING --- //

    handleSaleActions(e) {
        const button = e.target.closest('button');
        if (!button) return;

        const { id } = button.dataset;
        if (!id) return;

        if (button.classList.contains('btn-edit')) {
            this.editSale(parseInt(id));
        } else if (button.classList.contains('btn-delete')) {
            this.deleteSale(parseInt(id));
        }
    }

    loadSalesHistory() {
        this.filterSalesHistory();
    }

    filterSalesHistory() {
        const dateFilter = document.getElementById('dateFilter').value;
        const productFilter = document.getElementById('productFilter').value;
        let filteredSales = [...this.sales];

        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            filteredSales = filteredSales.filter(s => new Date(s.date).toDateString() === filterDate.toDateString());
        }
        if (productFilter) {
            filteredSales = filteredSales.filter(s => s.productId == productFilter);
        }
        this.displaySalesHistory(filteredSales);
    }

    displaySalesHistory(sales) {
        const container = document.getElementById('salesHistory');
        container.innerHTML = '';
        const fragment = document.createDocumentFragment();

        if (sales.length === 0) {
            container.innerHTML = '<p>No sales found for the selected criteria.</p>';
            return;
        }

        sales.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(sale => {
            const item = document.createElement('div');
            item.className = 'sale-item';
            item.innerHTML = `
                <div class="sale-details">
                    <div class="sale-product">${sale.productName}</div>
                    <div class="sale-info">Qty: ${sale.quantity} | Customer: ${sale.customerName} | ${new Date(sale.date).toLocaleString()}</div>
                </div>
                <div class="sale-amount-actions">
                    <div class="sale-amount">${this.formatCurrency(sale.total)}</div>
                    <div class="sale-actions">
                        <button class="btn-secondary btn-edit" data-id="${sale.id}">
                            <img class="icon" data-icon="iconsax-edit-2-tp6wwxq2-.svg" src="assets/icons/green/iconsax-edit-2-tp6wwxq2-.svg" alt="Edit" style="width: 28px; height: 28px; margin-right: 4px;">
                            Edit
                        </button>
                        <button class="btn-delete" data-id="${sale.id}">
                            <img class="icon" data-icon="iconsax-transaction-minus-zlqylfdc-.svg" src="assets/icons/green/iconsax-transaction-minus-zlqylfdc-.svg" alt="Delete" style="width: 28px; height: 28px; margin-right: 4px;">
                            Delete
                        </button>
                    </div>
                </div>`;
            fragment.appendChild(item);
        });
        container.appendChild(fragment);
    }

    clearFilters() {
        document.getElementById('dateFilter').value = '';
        document.getElementById('productFilter').value = '';
        this.filterSalesHistory();
    }

    editSale(saleId) {
        const sale = this.sales.find(s => s.id === saleId);
        if (!sale) return;

        this.currentEditingSaleId = saleId;

        // This logic correctly formats a date for a datetime-local input
        const saleDate = new Date(sale.date);
        const timezoneOffset = saleDate.getTimezoneOffset() * 60000;
        const localDate = new Date(saleDate - timezoneOffset).toISOString().slice(0, 16);

        document.getElementById('editSaleId').value = sale.id;
        document.getElementById('editSaleProduct').value = `${sale.productName} (ID: ${sale.productId})`;
        document.getElementById('editSaleQuantity').value = sale.quantity;
        document.getElementById('editSaleCustomer').value = sale.customerName;
        document.getElementById('editSaleDate').value = localDate;
        document.getElementById('editUnitPrice').textContent = this.formatCurrency(sale.unitPrice);
        document.getElementById('editSaleTotal').textContent = this.formatCurrency(sale.total);

        this.openSaleModal();
    }

    handleSaleEditSubmit(e) {
        e.preventDefault();
        const saleIndex = this.sales.findIndex(s => s.id === this.currentEditingSaleId);
        if (saleIndex === -1) return;

        const originalSale = this.sales[saleIndex];
        const product = this.products.find(p => p.id === originalSale.productId);
        if (!product) {
            this.showNotification('Associated product not found.', 'error');
            return;
        }

        const newQuantity = parseInt(document.getElementById('editSaleQuantity').value);
        const quantityChange = newQuantity - originalSale.quantity;

        if (quantityChange > product.stock) {
            this.showNotification(`Insufficient stock for this change. Available: ${product.stock}`, 'error');
            return;
        }

        product.stock -= quantityChange;

        this.sales[saleIndex] = {
            ...originalSale,
            quantity: newQuantity,
            customerName: document.getElementById('editSaleCustomer').value,
            date: new Date(document.getElementById('editSaleDate').value).toISOString(),
            total: newQuantity * originalSale.unitPrice
        };

        this.saveUserDatabase();
        this.showNotification("Sale updated successfully", "success");
        this.closeSaleModal();
        this.loadSalesHistory();
        this.updateProductSelects();
    }

    deleteSale(saleId) {
        if (!confirm('Are you sure you want to delete this sale? This will restore product stock.')) return;

        const saleIndex = this.sales.findIndex(s => s.id === saleId);
        if (saleIndex === -1) return;

        const saleToDelete = this.sales[saleIndex];
        const product = this.products.find(p => p.id === saleToDelete.productId);

        if (product) {
            product.stock += saleToDelete.quantity;
        }

        this.sales.splice(saleIndex, 1);
        this.saveUserDatabase();
        this.showNotification("Sale deleted and stock restored.", "success");
        this.loadSalesHistory();
        this.updateProductSelects();
    }

    openSaleModal() { document.getElementById('saleModal').classList.add('active'); }
    closeSaleModal() { document.getElementById('saleModal').classList.remove('active'); }

    // --- DASHBOARD & STATISTICS --- //

    loadDashboard() {
        const stats = this.calculateStatistics();
        document.getElementById('todaySales').textContent = this.formatCurrency(stats.todaySales);
        document.getElementById('weekSales').textContent = this.formatCurrency(stats.weekSales);
        document.getElementById('totalProducts').textContent = stats.totalProducts;
        document.getElementById('lowStock').textContent = stats.lowStockCount;
        // Add profit stat card if it exists
        if (document.getElementById('totalProfit')) {
            document.getElementById('totalProfit').textContent = this.formatCurrency(stats.totalProfit);
        }
        if (document.getElementById('totalRevenue')) {
            document.getElementById('totalRevenue').textContent = this.formatCurrency(stats.totalRevenue);
        }
        this.loadRecentSales();
        this.applyDashboardCustomization();
        this.destroyCharts();
        setTimeout(() => {
            this.createCategoryChart(stats);
            this.createTopProductsChart(stats);
            this.createMonthlySalesChart(stats);
        }, 100);
    }

    calculateStatistics() {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const weekStart = todayStart - 6 * 24 * 60 * 60 * 1000;

        const categorySales = {};
        const productSales = {};
        const monthlySales = {};

        let totalProfit = 0;
        let totalRevenue = 0;

        this.sales.forEach(sale => {
            const product = this.products.find(p => p.id === sale.productId);
            const category = product ? product.category : 'Uncategorized';
            categorySales[category] = (categorySales[category] || 0) + sale.total;

            productSales[sale.productName] = (productSales[sale.productName] || 0) + sale.total;

            const month = new Date(sale.date).toISOString().slice(0, 7); // YYYY-MM
            monthlySales[month] = (monthlySales[month] || 0) + sale.total;

            totalProfit += sale.profit || 0;
            totalRevenue += sale.revenue || sale.total || 0;
        });

        return {
            todaySales: this.sales.filter(s => new Date(s.date).getTime() >= todayStart).reduce((sum, s) => sum + s.total, 0),
            weekSales: this.sales.filter(s => new Date(s.date).getTime() >= weekStart).reduce((sum, s) => sum + s.total, 0),
            totalProducts: this.products.length,
            lowStockCount: this.products.filter(p => p.stock <= 5).length,
            categorySales: Object.entries(categorySales).map(([name, revenue]) => ({ name, revenue })),
            topSellingProducts: Object.entries(productSales).map(([name, revenue]) => ({ name, revenue })).sort((a, b) => b.revenue - a.revenue).slice(0, 5),
            monthlySales: Object.entries(monthlySales).sort(([a], [b]) => a.localeCompare(b)).slice(-12),
            totalProfit,
            totalRevenue
        };
    }

    loadRecentSales() {
        const container = document.getElementById('recentSalesList');
        container.innerHTML = '';
        const fragment = document.createDocumentFragment();
        const recent = [...this.sales].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

        if (recent.length === 0) {
            container.innerHTML = '<p>No recent sales.</p>';
            return;
        }

        recent.forEach(sale => {
            const item = document.createElement('div');
            item.className = 'sale-item';
            item.innerHTML = `
                <div class="sale-details">
                    <div class="sale-product">${sale.productName}</div>
                    <div class="sale-info">Qty: ${sale.quantity} | ${new Date(sale.date).toLocaleTimeString()}</div>
                </div>
                <div class="sale-amount">${this.formatCurrency(sale.total)}</div>`;
            fragment.appendChild(item);
        });
        container.appendChild(fragment);
    }

    // --- CHARTS --- //

    destroyCharts() {
        ['categoryChartCanvas', 'topProductsChartCanvas', 'monthlySalesChartCanvas'].forEach(id => {
            if (Chart.getChart(id)) {
                Chart.getChart(id).destroy();
            }
        });
    }

    createChart(containerId, canvasId, config, title, noDataMessage) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `<h3>${title}</h3>`;
        if (config.data.labels.length === 0) {
            container.innerHTML += `<p>${noDataMessage}</p>`;
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.id = canvasId;
        container.appendChild(canvas);
        new Chart(canvas, config);
    }

    createCategoryChart(stats) {
        this.createChart('categoryChart', 'categoryChartCanvas', {
            type: 'bar',
            data: {
                labels: stats.categorySales.map(c => c.name),
                datasets: [{
                    label: 'Revenue',
                    data: stats.categorySales.map(c => c.revenue),
                    backgroundColor: '#4fd840',
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { ticks: { color: '#e5ece4' } }, y: { ticks: { color: '#e5ece4' } } }
            }
        }, 'Sales by Category', 'No category data available.');
    }

    createTopProductsChart(stats) {
        this.createChart('topProductsChart', 'topProductsChartCanvas', {
            type: 'bar',
            data: {
                labels: stats.topSellingProducts.map(p => p.name),
                datasets: [{
                    label: 'Revenue',
                    data: stats.topSellingProducts.map(p => p.revenue),
                    backgroundColor: '#a9daa4',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { ticks: { color: '#e5ece4' } }, y: { ticks: { color: '#e5ece4' } } }
            }
        }, 'Top 5 Products by Revenue', 'No product sales data available.');
    }

    createMonthlySalesChart(stats) {
        this.createChart('monthlySalesChart', 'monthlySalesChartCanvas', {
            type: 'line',
            data: {
                labels: stats.monthlySales.map(([month]) => new Date(month + '-02').toLocaleString('default', { month: 'short', year: 'numeric' })),
                datasets: [{
                    label: 'Revenue',
                    data: stats.monthlySales.map(([, revenue]) => revenue),
                    borderColor: '#4fd840',
                    tension: 0.1,
                    fill: true,
                    backgroundColor: 'rgba(79, 216, 64, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { ticks: { color: '#e5ece4' } }, y: { ticks: { color: '#e5ece4' } } }
            }
        }, 'Monthly Sales Trend', 'No monthly sales data available.');
    }

    // --- REPORTS, DATA, & MESSAGES --- //

    handleGlobalSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm.length < 2) {
            this.showSearchResults([]); // Hide results if search term is too short
            return;
        }

        const results = [];

        // Search in products
        this.products.forEach(product => {
            if (
                product.name.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            ) {
                results.push({
                    type: 'product',
                    title: product.name,
                    subtitle: `Category: ${product.category}`,
                    details: `Price: ${this.formatCurrency(product.price)} | Stock: ${product.stock}`,
                    id: product.id
                });
            }
        });

        // Search in sales
        this.sales.forEach(sale => {
            if (
                sale.productName.toLowerCase().includes(searchTerm) ||
                sale.customerName.toLowerCase().includes(searchTerm)
            ) {
                results.push({
                    type: 'sale',
                    title: sale.productName,
                    subtitle: `Customer: ${sale.customerName}`,
                    details: `Amount: ${this.formatCurrency(sale.total)} | Date: ${new Date(sale.date).toLocaleString()}`,
                    id: sale.id
                });
            }
        });

        this.showSearchResults(results);
    }

    showSearchResults(results) {
        let searchResults = document.getElementById('searchResults');

        if (!searchResults) {
            searchResults = document.createElement('div');
            searchResults.id = 'searchResults';
            searchResults.className = 'search-results';
            document.querySelector('.search-box').appendChild(searchResults);
        }

        if (results.length === 0) {
            searchResults.style.display = 'none';
            return;
        }

        searchResults.innerHTML = results.map(result => `
            <div class="search-result-item" data-type="${result.type}" data-id="${result.id}">
                <div class="result-title">${result.title}</div>
                <div class="result-subtitle">${result.subtitle}</div>
                <div class="result-details">${result.details}</div>
            </div>
        `).join('');

        searchResults.style.display = 'block';

        // Add click handlers for search results
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                const id = parseInt(item.dataset.id);

                if (type === 'product') {
                    this.switchTab('products');
                    // Highlight the item after switching tab
                    setTimeout(() => {
                        const productElement = document.querySelector(`.product-card .btn-edit[data-id="${id}"]`)?.closest('.product-card');
                        if (productElement) {
                            productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            productElement.classList.add('highlight');
                            setTimeout(() => productElement.classList.remove('highlight'), 2000);
                        }
                    }, 100);
                } else if (type === 'sale') {
                    this.switchTab('history');
                    setTimeout(() => {
                        const saleElement = document.querySelector(`.sale-item .btn-edit[data-id="${id}"]`)?.closest('.sale-item');
                        if (saleElement) {
                            saleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            saleElement.classList.add('highlight');
                            setTimeout(() => saleElement.classList.remove('highlight'), 2000);
                        }
                    }, 100);
                }

                searchResults.style.display = 'none';
                document.getElementById('globalSearch').value = '';
            });
        });
    }

    loadMessages() {
        const container = document.getElementById('messages');
        const messages = [];

        // Check for low stock items
        const lowStockItems = this.products.filter(p => p.stock <= 5);
        lowStockItems.forEach(product => {
            messages.push({
                type: 'warning',
                title: 'Low Stock Alert',
                message: `${product.name} is running low on stock (${product.stock} remaining).`,
                date: new Date()
            });
        });

        // Generate performance messages
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const recentSales = this.sales.filter(sale => new Date(sale.date) >= lastWeek);

        const productSales = recentSales.reduce((acc, sale) => {
            acc[sale.productId] = (acc[sale.productId] || 0) + sale.total;
            return acc;
        }, {});

        // Example: High performance alert for products with > 500 in sales in the last week
        Object.entries(productSales).filter(([_, total]) => total > 500).forEach(([productId, total]) => {
            const product = this.products.find(p => p.id == productId);
            if (product) {
                messages.push({
                    type: 'success',
                    title: 'High Performance Alert',
                    message: `${product.name} has generated ${this.formatCurrency(total)} in the last 7 days.`,
                    date: new Date()
                });
            }
        });

        // Render messages
        const messagesListContainer = container.querySelector('.form-section');
        if (messages.length === 0) {
            messagesListContainer.innerHTML = '<p>You have no new messages.</p>';
            return;
        }

        // Sort messages by date, newest first
        messages.sort((a, b) => b.date - a.date);

        messagesListContainer.innerHTML = `
            <div class="messages-list">
                ${messages.map(msg => `
                    <div class="message-item ${msg.type}">
                        <div class="message-header">
                            <span class="message-title">${msg.title}</span>
                            <span class="message-date">${msg.date.toLocaleString()}</span>
                        </div>
                        <div class="message-content">${msg.message}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    generateReport() {
        const type = document.getElementById('reportType').value;
        const container = document.getElementById('reportResults');
        const now = new Date();
        container.innerHTML = '';

        let salesData = [];
        let title = '';

        if (type === 'daily') {
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            salesData = this.sales.filter(s => new Date(s.date) >= todayStart);
            title = `Daily Report for ${now.toLocaleDateString()}`;
        } else if (type === 'weekly') {
            const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            salesData = this.sales.filter(s => new Date(s.date) >= weekStart);
            title = 'Weekly Report';
        }

        if (type === 'product') {
            const productStats = this.calculateStatistics().topSellingProducts;
            container.innerHTML = `<h3>Product Performance</h3>
                <table class="report-table">
                    <thead><tr><th>Product</th><th>Revenue</th></tr></thead>
                    <tbody>
                        ${productStats.map(p => `<tr><td>${p.name}</td><td>${this.formatCurrency(p.revenue)}</td></tr>`).join('')}
                    </tbody>
                </table>`;
        } else {
            const totalRevenue = salesData.reduce((sum, s) => sum + s.total, 0);
            const totalSales = salesData.length;
            container.innerHTML = `<h3>${title}</h3>
                <p><strong>Total Sales:</strong> ${totalSales}</p>
                <p><strong>Total Revenue:</strong> ${this.formatCurrency(totalRevenue)}</p>
                <p><strong>Average Sale:</strong> ${this.formatCurrency(totalSales > 0 ? (totalRevenue / totalSales) : 0)}</p>`;
        }
    }

    exportData() {
        try {
            const fullData = {
                profile: this.shopProfile,
                data: this.userDatabase
            };
            const dataStr = JSON.stringify(fullData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `shop_data_${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            this.showNotification('Data exported successfully!', 'success');
        } catch (error) {
            this.showNotification('Failed to export data.', 'error');
            console.error("Export Error:", error);
        }
    }

    exportSalesToExcel() {
        try {
            if (!this.sales || this.sales.length === 0) {
                this.showNotification('No sales data to export.', 'error');
                return;
            }
            // Prepare sales data for Excel
            // Add shop details as a header row
            const shopName = this.shopProfile?.shopName || '';
            const ownerName = this.shopProfile?.ownerName || '';
            const currency = this.shopProfile?.currency || '';
            const headerRows = [
                [
                    `Shop Name:`, shopName, '', '', '', '', '', '', '', ''
                ],
                [
                    `Owner:`, ownerName, '', '', '', '', '', '', '', ''
                ],
                [
                    `Currency:`, currency, '', '', '', '', '', '', '', ''
                ],
                [] // Empty row before table
            ];
            // Arrange columns: Date, Product, Quantity, Customer, Buy Price, Unit Price, Total, Profit
            const salesData = this.sales.map(sale => ({
                'Date': sale.date ? new Date(sale.date).toLocaleString() : '',
                'Product': sale.productName || sale.product || '',
                'Quantity': sale.quantity,
                'Customer': sale.customerName || '',
                'Buy Price': sale.buyPrice !== undefined ? sale.buyPrice : (this.products.find(p => p.id === sale.productId)?.buyPrice || ''),
                'Unit Price': sale.unitPrice || sale.price || '',
                'Total': sale.total || (sale.unitPrice && sale.quantity ? sale.unitPrice * sale.quantity : ''),
                'Profit': sale.profit !== undefined ? sale.profit : ((sale.unitPrice - sale.buyPrice) * sale.quantity)
            }));
            // Convert to worksheet and prepend header rows
            const ws = XLSX.utils.json_to_sheet(salesData, {origin: headerRows.length});
            // Insert header rows manually
            XLSX.utils.sheet_add_aoa(ws, headerRows, {origin: 0});
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sales');
            const fileName = `sales_data_${new Date().toISOString().slice(0, 10)}.xlsx`;
            XLSX.writeFile(wb, fileName);
            this.showNotification('Sales data exported as Excel!', 'success');
        } catch (error) {
            this.showNotification('Failed to export sales as Excel.', 'error');
            console.error('Excel Export Error:', error);
        }
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (!imported.profile || !imported.data || !Array.isArray(imported.data.products) || !Array.isArray(imported.data.sales)) {
                    throw new Error("Invalid data file format.");
                }
                if (confirm("This will overwrite all current data. Are you sure you want to proceed?")) {
                    localStorage.setItem('shopTrackerProfile', JSON.stringify(imported.profile));
                    localStorage.setItem('shopTrackerData', JSON.stringify(imported.data));
                    this.showNotification('Data imported successfully! Reloading...', 'success');
                    setTimeout(() => window.location.reload(), 1500);
                }
            } catch (error) {
                this.showNotification('Failed to import data. ' + error.message, 'error');
                console.error("Import Error:", error);
            }
        };
        reader.readAsText(file);
    }

    // --- PROFILE MANAGEMENT --- //

    getAllProfiles() {
        const profiles = localStorage.getItem('shopTrackerProfiles');
        return profiles ? JSON.parse(profiles) : [];
    }

    saveAllProfiles() {
        localStorage.setItem('shopTrackerProfiles', JSON.stringify(this.profiles));
    }

    createNewProfile(profileData) {
        // Only create if all required fields are present
        if (!profileData.shopName || !profileData.ownerName || !profileData.currency) {
            alert('Please fill in all required fields.');
            return;
        }
        const newProfile = {
            id: Date.now(),
            ...profileData,
            established: new Date().getFullYear(),
            createdAt: new Date().toISOString()
        };
        this.profiles.push(newProfile);
        this.saveAllProfiles();
        // Create default data for this profile with default categories and dashboard settings
        localStorage.setItem(`shopTrackerData_${newProfile.id}`, JSON.stringify(this.createDefaultDatabase()));
        // Switch to new profile
        this.switchToProfile(newProfile.id);
        return newProfile;
    }

    switchToProfile(profileId) {
        const profile = this.profiles.find(p => p.id === profileId);
        if (!profile) return;
        // Show loading overlay
        this.showLoadingOverlay('Switching profile...');
        setTimeout(() => {
            try {
                // Set current profile before saving user data
                this.shopProfile = profile;
                localStorage.setItem('shopTrackerProfile', JSON.stringify(profile));
                // Save current profile data before switching
                this.saveUserDatabase();
                // Check for required info
                if (!profile.shopName || !profile.ownerName || !profile.currency) {
                    this.hideLoadingOverlay();
                    this.showProfileSetup();
                    return;
                }
                // Load new profile's data
                const profileDataKey = `shopTrackerData_${profileId}`;
                let profileData = localStorage.getItem(profileDataKey);
                if (!profileData) {
                    // If no data, create default
                    localStorage.setItem(profileDataKey, JSON.stringify(this.createDefaultDatabase()));
                    profileData = localStorage.getItem(profileDataKey);
                }
                this.userDatabase = JSON.parse(profileData);
                this.products = this.userDatabase.products || [];
                this.sales = this.userDatabase.sales || [];
                
                // Reinitialize profile-specific customizations
                this.initializeCustomCategories();
                this.initializeDashboardCustomization();
                
                // Force refresh all customizations for the new profile
                this.refreshProfileCustomizations();
                
                // Update UI
                this.updateShopProfileUI();
                this.updateProductSelects();
                this.updateNotifications();
                this.switchTab('dashboard');
                this.showNotification(`Switched to ${profile.shopName}`, 'success');
                this.hideLoadingOverlay();
            } catch (err) {
                this.hideLoadingOverlay();
                console.error('Error during profile switch:', err);
                alert('An error occurred while switching profiles. See console for details.');
            }
        }, 500); // Simulate loading
    }

    showLoadingOverlay(text) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.querySelector('.loading-text').textContent = text || 'Loading...';
        }
    }
    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.style.display = 'none';
    }

    // Form validation helpers
    validateSaleForm() {
        let valid = true;
        const productSelect = document.getElementById('productSelect');
        const productError = document.getElementById('saleFormProductError');
        if (!productSelect.value) {
            productError.textContent = 'Please select a product.';
            valid = false;
        } else {
            productError.textContent = '';
        }
        // Add more field checks as needed
        return valid;
    }

    // ... Add similar validation for other forms ...

    deleteProfile(profileId) {
        if (!confirm('Are you sure you want to delete this profile? All data will be lost.')) return;

        this.profiles = this.profiles.filter(p => p.id !== profileId);
        this.saveAllProfiles();

        // Remove profile data
        const profileDataKey = `shopTrackerData_${profileId}`;
        localStorage.removeItem(profileDataKey);

        // If the deleted profile is the current one, switch to another or prompt for setup
        if (this.shopProfile && this.shopProfile.id === profileId) {
            if (this.profiles.length > 0) {
                this.switchToProfile(this.profiles[0].id);
            } else {
                localStorage.removeItem('shopTrackerProfile');
                this.showProfileSetup();
                return;
            }
        }
        this.showNotification('Profile deleted successfully', 'success');
        this.loadProfiles();
    }

    loadProfiles() {
        this.loadCurrentProfile();
        this.loadAllProfiles();
    }

    loadSettings() {
        // Remove any existing current settings display
        const existingSettings = document.querySelector('#settings .current-settings');
        if (existingSettings) {
            existingSettings.remove();
        }

        // Get the settings form elements
        const shopNameInput = document.getElementById('settingsShopName');
        const ownerNameInput = document.getElementById('settingsOwnerName');
        const currencySelect = document.getElementById('settingsCurrency');
        const highPerformanceLimitInput = document.getElementById('settingsHighPerformanceLimit');

        // If any of these elements don't exist, we're not on the settings page
        if (!shopNameInput || !ownerNameInput || !currencySelect) {
            return;
        }

        // If we have a shop profile, populate the form with current values
        if (this.shopProfile) {
            // Display current settings
            const currentSettingsDiv = document.createElement('div');
            currentSettingsDiv.className = 'current-settings';
            currentSettingsDiv.innerHTML = `
                <div class="sale-summary" style="margin-bottom: 20px;">
                    <h3 style="margin-bottom: 10px; color: var(--primary);">Current Settings</h3>
                    <div class="summary-row">
                        <span>Shop Name:</span>
                        <span>${this.shopProfile.shopName}</span>
                    </div>
                    <div class="summary-row">
                        <span>Owner Name:</span>
                        <span>${this.shopProfile.ownerName}</span>
                    </div>
                    <div class="summary-row">
                        <span>Currency:</span>
                        <span>${this.shopProfile.currency} (${this.currencySymbols[this.shopProfile.currency] || this.shopProfile.currency})</span>
                    </div>
                    <div class="summary-row">
                        <span>Established:</span>
                        <span>${this.shopProfile.established || 'N/A'}</span>
                    </div>
                </div>
            `;

            // Insert the current settings before the form
            const formSection = document.querySelector('#settings .form-section');
            if (formSection) {
                const profileSettingsForm = document.getElementById('profileSettingsForm');
                if (profileSettingsForm) {
                    formSection.insertBefore(currentSettingsDiv, profileSettingsForm);
                } else {
                    formSection.appendChild(currentSettingsDiv);
                }

                // Populate form fields with current values
                shopNameInput.value = this.shopProfile.shopName;
                ownerNameInput.value = this.shopProfile.ownerName;
                currencySelect.value = this.shopProfile.currency;
                if (highPerformanceLimitInput) {
                    highPerformanceLimitInput.value = this.shopProfile.highPerformanceLimit || '';
                }
            }
        }
    }

    loadCurrentProfile() {
        const container = document.getElementById('currentProfileCard');
        if (!this.shopProfile) return;

        // Create avatar HTML based on whether profile has a picture
        let avatarHTML = '';
        if (this.shopProfile.profilePicture) {
            avatarHTML = `
                <div class="avatar-circle has-image">
                    <img class="avatar-image" src="${this.shopProfile.profilePicture}" alt="${this.shopProfile.shopName}" />
                </div>
            `;
        } else {
            const initials = this.getInitials(this.shopProfile.shopName, this.shopProfile.ownerName);
            avatarHTML = `
                <div class="avatar-circle">
                    <img class="avatar-image" data-icon="iconsax-profile-circle-5aksjsgv-.svg"
                        src="assets/icons/green/iconsax-profile-circle-5aksjsgv-.svg" alt="Profile" />
                    <div class="avatar-placeholder">
                        <span class="avatar-initials">${initials}</span>
                    </div>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="profile-info">
                ${avatarHTML}
                <div class="profile-details">
                    <div class="profile-header">
                        <h4>${this.shopProfile.shopName}</h4>
                        <span class="profile-badge current">Current</span>
                    </div>
                    <p>Owner: ${this.shopProfile.ownerName}</p>
                    <p>Currency: ${this.shopProfile.currency}</p>
                    <p>Established: ${this.shopProfile.established || 'N/A'}</p>
                </div>
            </div>
        `;
    }

    loadAllProfiles() {
        const container = document.getElementById('profilesList');
        container.innerHTML = '';

        if (this.profiles.length === 0) {
            container.innerHTML = '<p>No additional profiles created yet.</p>';
            return;
        }

        this.profiles.forEach(profile => {
            const isCurrent = this.shopProfile && this.shopProfile.id === profile.id;
            const card = document.createElement('div');
            card.className = `profile-card ${isCurrent ? 'current' : ''}`;

            // Create avatar HTML based on whether profile has a picture
            let avatarHTML = '';
            if (profile.profilePicture) {
                avatarHTML = `
                    <div class="avatar-circle has-image">
                        <img class="avatar-image" src="${profile.profilePicture}" alt="${profile.shopName}" />
                    </div>
                `;
            } else {
                const initials = this.getInitials(profile.shopName, profile.ownerName);
                avatarHTML = `
                    <div class="avatar-circle">
                        <img class="avatar-image" data-icon="iconsax-profile-circle-5aksjsgv-.svg"
                            src="assets/icons/green/iconsax-profile-circle-5aksjsgv-.svg" alt="Profile" />
                        <div class="avatar-placeholder">
                            <span class="avatar-initials">${initials}</span>
                        </div>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="profile-info">
                    ${avatarHTML}
                    <div class="profile-details">
                        <div class="profile-header">
                            <h4>${profile.shopName}</h4>
                            ${isCurrent ? '<span class="profile-badge current">Current</span>' : ''}
                        </div>
                        <p>Owner: ${profile.ownerName}</p>
                        <p>Currency: ${profile.currency}</p>
                        <p>Established: ${profile.established || 'N/A'}</p>
                    </div>
                </div>
                <div class="profile-actions">
                    ${!isCurrent ? `<button class="btn-primary" data-action="switch" data-id="${profile.id}">Switch</button>` : ''}
                    <button class="btn-delete" data-action="delete" data-id="${profile.id}">Delete</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    handleProfileActions(e) {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const action = btn.getAttribute('data-action');
        const id = btn.getAttribute('data-id');
        if (!action || !id) return;
        if (action === 'switch') {
            this.switchToProfile(Number(id));
        } else if (action === 'delete') {
            this.deleteProfile(Number(id));
        }
    }

    // handleProfilePictureChange is now handled by the avatar cropping system

    handleProfileSettingsSubmit(e) {
        e.preventDefault();

        // Store the original values for comparison
        const originalShopName = this.shopProfile.shopName;
        const originalOwnerName = this.shopProfile.ownerName;
        const originalCurrency = this.shopProfile.currency;

        // Get new values from form
        const newShopName = document.getElementById('settingsShopName').value;
        const newOwnerName = document.getElementById('settingsOwnerName').value;
        const newCurrency = document.getElementById('settingsCurrency').value;
        const newHighPerformanceLimit = parseFloat(document.getElementById('settingsHighPerformanceLimit').value) || 0;

        // Update profile with new values
        this.shopProfile.shopName = newShopName;
        this.shopProfile.ownerName = newOwnerName;
        this.shopProfile.currency = newCurrency;
        this.shopProfile.highPerformanceLimit = newHighPerformanceLimit;

        // Handle profile picture upload
        const profilePictureInput = document.getElementById('settingsProfilePicture');
        if (profilePictureInput.files && profilePictureInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.shopProfile.profilePicture = event.target.result;
                this.updateShopProfileUI();
                this.loadSettings(); // Reload settings display after image is processed
            };
            reader.readAsDataURL(profilePictureInput.files[0]);
        }

        // Save to localStorage
        localStorage.setItem('shopTrackerProfile', JSON.stringify(this.shopProfile));

        // Update profile in profiles array if it exists
        const profileIndex = this.profiles.findIndex(p => p.id === this.shopProfile.id);
        if (profileIndex !== -1) {
            this.profiles[profileIndex] = { ...this.shopProfile };
            this.saveAllProfiles();
        }

        // Update UI
        this.updateShopProfileUI();

        // Show what changed in the notification
        let changesMsg = '';
        if (originalShopName !== newShopName) changesMsg += 'Shop Name, ';
        if (originalOwnerName !== newOwnerName) changesMsg += 'Owner Name, ';
        if (originalCurrency !== newCurrency) changesMsg += 'Currency, ';
        if (profilePictureInput.files && profilePictureInput.files[0]) changesMsg += 'Profile Picture, ';

        if (changesMsg) {
            changesMsg = changesMsg.slice(0, -2); // Remove trailing comma and space
            this.showNotification(`Profile updated: ${changesMsg}`, 'success');
        } else {
            this.showNotification('No changes were made to the profile', 'success');
        }

        // Reload settings to show current values
        this.loadSettings();
    }

    // --- CUSTOM CATEGORIES MANAGEMENT --- //

    initializeCustomCategories() {
        // Force reload data from localStorage for current profile to ensure isolation
        if (this.shopProfile && this.shopProfile.id) {
            const profileDataKey = `shopTrackerData_${this.shopProfile.id}`;
            const profileData = localStorage.getItem(profileDataKey);
            if (profileData) {
                const parsedData = JSON.parse(profileData);
                this.userDatabase = parsedData;
                
                // Ensure categories exist for this profile
                if (!parsedData.customCategories || parsedData.customCategories.length === 0) {
                    parsedData.customCategories = [
                        'Electronics', 'Clothing', 'Food & Beverages', 'Books', 'Home & Garden', 'Sports', 'Miscellaneous'
                    ];
                    localStorage.setItem(profileDataKey, JSON.stringify(parsedData));
                    this.userDatabase = parsedData;
                }
            }
        }
        
        this.loadCustomCategories();
    }

    loadCustomCategories() {
        const container = document.getElementById('categoriesList');
        if (!container) return;

        // Clear the container completely
        container.innerHTML = '';
        
        // Get categories from current profile's database
        const categories = this.userDatabase.customCategories || [];

        categories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            categoryItem.innerHTML = `
                <span class="category-name">${category}</span>
                <div class="category-actions">
                    <button class="btn-edit-category" data-category="${category}">Edit</button>
                    <button class="btn-delete-category" data-category="${category}">Delete</button>
                </div>
            `;
            container.appendChild(categoryItem);
        });

        // Update product category selects with current profile's categories
        this.updateProductCategorySelects();
    }

    // Force reload categories and dashboard settings for current profile
    refreshProfileCustomizations() {
        // Ensure we have the latest data from localStorage for current profile
        if (this.shopProfile && this.shopProfile.id) {
            const profileDataKey = `shopTrackerData_${this.shopProfile.id}`;
            const profileData = localStorage.getItem(profileDataKey);
            if (profileData) {
                const parsedData = JSON.parse(profileData);
                this.userDatabase = parsedData;
                this.products = parsedData.products || [];
                this.sales = parsedData.sales || [];
                
                // Ensure categories are properly loaded from this profile's data
                if (!parsedData.customCategories) {
                    parsedData.customCategories = [
                        'Electronics', 'Clothing', 'Food & Beverages', 'Books', 'Home & Garden', 'Sports', 'Miscellaneous'
                    ];
                    localStorage.setItem(profileDataKey, JSON.stringify(parsedData));
                    this.userDatabase = parsedData;
                }
            }
        }
        
        // Force reload categories with fresh data
        this.loadCustomCategories();
        
        // Force reload dashboard configuration
        this.loadDashboardConfiguration();
        
        // Force refresh settings tab if it's currently active
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab && activeTab.id === 'settings') {
            // Reload the entire settings tab to ensure fresh data
            this.switchTab('settings');
        }
    }

    addCustomCategory() {
        const categoryName = document.getElementById('newCategoryName').value.trim();
        if (!categoryName) {
            this.showNotification('Please enter a category name.', 'error');
            return;
        }

        if (!this.userDatabase.customCategories) {
            this.userDatabase.customCategories = [];
        }

        if (this.userDatabase.customCategories.includes(categoryName)) {
            this.showNotification('Category already exists.', 'error');
            return;
        }

        this.userDatabase.customCategories.push(categoryName);
        this.saveUserDatabase();
        this.loadCustomCategories();
        document.getElementById('newCategoryName').value = '';
        this.showNotification('Category added successfully!', 'success');
    }

    handleCategoryActions(e) {
        const button = e.target.closest('button');
        if (!button) return;

        const categoryName = button.dataset.category;
        if (!categoryName) return;

        if (button.classList.contains('btn-edit-category')) {
            this.editCustomCategory(categoryName);
        } else if (button.classList.contains('btn-delete-category')) {
            this.deleteCustomCategory(categoryName);
        }
    }

    editCustomCategory(oldName) {
        // Open the category edit modal
        document.getElementById('editCategoryName').value = oldName;
        document.getElementById('editCategoryOldName').value = oldName;
        document.getElementById('categoryEditModal').classList.add('active');
        document.getElementById('appBlocker').classList.add('active');
    }

    handleCategoryEditSubmit(e) {
        e.preventDefault();
        const oldName = document.getElementById('editCategoryOldName').value;
        const newName = document.getElementById('editCategoryName').value.trim();
        
        if (!newName || newName === oldName) {
            this.closeCategoryEditModal();
            return;
        }

        if (this.userDatabase.customCategories.includes(newName)) {
            this.showNotification('Category already exists.', 'error');
            return;
        }

        // Update category in the list
        const index = this.userDatabase.customCategories.indexOf(oldName);
        if (index !== -1) {
            this.userDatabase.customCategories[index] = newName;
        }

        // Update existing products with this category
        this.products.forEach(product => {
            if (product.category === oldName) {
                product.category = trimmedName;
            }
        });

        this.saveUserDatabase();
        this.loadCustomCategories();
        this.loadProducts();
        this.showNotification('Category updated successfully!', 'success');
        this.closeCategoryEditModal();
    }

    closeCategoryEditModal() {
        document.getElementById('categoryEditModal').classList.remove('active');
        document.getElementById('appBlocker').classList.remove('active');
        document.getElementById('categoryEditForm').reset();
    }

    deleteCustomCategory(categoryName) {
        if (!confirm(`Are you sure you want to delete the "${categoryName}" category? Products in this category will be moved to "Miscellaneous".`)) {
            return;
        }

        // Remove from categories list
        this.userDatabase.customCategories = this.userDatabase.customCategories.filter(cat => cat !== categoryName);

        // Update products that use this category
        this.products.forEach(product => {
            if (product.category === categoryName) {
                product.category = 'Miscellaneous';
            }
        });

        this.saveUserDatabase();
        this.loadCustomCategories();
        this.loadProducts();
        this.showNotification('Category deleted successfully!', 'success');
    }

    updateProductCategorySelects() {
        const categorySelect = document.getElementById('productCategory');
        if (!categorySelect) return;

        const currentValue = categorySelect.value;
        categorySelect.innerHTML = '';

        const categories = this.userDatabase.customCategories || ['Miscellaneous'];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        // Restore previous selection if it still exists
        if (categories.includes(currentValue)) {
            categorySelect.value = currentValue;
        }
    }

    // --- DASHBOARD CUSTOMIZATION --- //

    initializeDashboardCustomization() {
        // Initialize default dashboard configuration if none exists
        if (!this.userDatabase.dashboardConfig) {
            this.userDatabase.dashboardConfig = {
                showTodaySales: true,
                showWeekSales: true,
                showTotalRevenue: true,
                showTotalProfit: true,
                showTotalProducts: true,
                showLowStock: true
            };
            this.saveUserDatabase();
        }
        this.loadDashboardConfiguration();
    }

    loadDashboardConfiguration() {
        const config = this.userDatabase.dashboardConfig || {};
        
        // Update checkboxes
        Object.keys(config).forEach(key => {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                checkbox.checked = config[key];
            }
        });
    }

    saveDashboardConfiguration() {
        const config = {
            showTodaySales: document.getElementById('showTodaySales').checked,
            showWeekSales: document.getElementById('showWeekSales').checked,
            showTotalRevenue: document.getElementById('showTotalRevenue').checked,
            showTotalProfit: document.getElementById('showTotalProfit').checked,
            showTotalProducts: document.getElementById('showTotalProducts').checked,
            showLowStock: document.getElementById('showLowStock').checked
        };

        this.userDatabase.dashboardConfig = config;
        this.saveUserDatabase();
        this.showNotification('Dashboard settings saved!', 'success');
        
        // Refresh dashboard if it's currently active
        if (document.getElementById('dashboard').classList.contains('active')) {
            this.loadDashboard();
        }
    }

    resetDashboardConfiguration() {
        if (!confirm('Are you sure you want to reset dashboard settings to default?')) {
            return;
        }

        this.userDatabase.dashboardConfig = {
            showTodaySales: true,
            showWeekSales: true,
            showTotalRevenue: true,
            showTotalProfit: true,
            showTotalProducts: true,
            showLowStock: true
        };

        this.saveUserDatabase();
        this.loadDashboardConfiguration();
        this.showNotification('Dashboard settings reset to default!', 'success');
        
        // Refresh dashboard if it's currently active
        if (document.getElementById('dashboard').classList.contains('active')) {
            this.loadDashboard();
        }
    }

    applyDashboardCustomization() {
        const config = this.userDatabase.dashboardConfig || {};
        const statsGrid = document.querySelector('.stats-grid');
        if (!statsGrid) return;

        // Hide/show stat cards based on configuration
        const cardMappings = {
            showTodaySales: 'todaySales',
            showWeekSales: 'weekSales',
            showTotalRevenue: 'totalRevenue',
            showTotalProfit: 'totalProfit',
            showTotalProducts: 'totalProducts',
            showLowStock: 'lowStock'
        };

        Object.keys(cardMappings).forEach(configKey => {
            const elementId = cardMappings[configKey];
            const statCard = document.getElementById(elementId)?.closest('.stat-card');
            if (statCard) {
                statCard.style.display = config[configKey] ? 'block' : 'none';
            }
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.salesTracker = new SalesTracker();
});
// --- AVATAR CROPPING SYSTEM --- //

SalesTracker.prototype.openAvatarCrop = function () {
    // Trigger file input for avatar upload
    document.getElementById('settingsProfilePicture').click();
};

SalesTracker.prototype.handleAvatarUpload = function (e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        this.showNotification('Please select a valid image file.', 'error');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        this.showNotification('Image file is too large. Please select a file under 5MB.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        this.avatarCropData.image = new Image();
        this.avatarCropData.image.onload = () => {
            this.initializeAvatarCrop();
            this.showAvatarCropModal();
        };
        this.avatarCropData.image.src = event.target.result;
    };
    reader.readAsDataURL(file);
};

SalesTracker.prototype.initializeAvatarCrop = function () {
    // Get canvas elements
    this.avatarCropData.canvas = document.getElementById('cropCanvas');
    this.avatarCropData.previewCanvas = document.getElementById('previewCanvas');

    // Reset crop controls
    document.getElementById('cropScale').value = 1;
    document.getElementById('cropX').value = 50;
    document.getElementById('cropY').value = 50;

    this.avatarCropData.scale = 1;
    this.avatarCropData.x = 50;
    this.avatarCropData.y = 50;

    // Initial crop update
    this.updateAvatarCrop();
};

SalesTracker.prototype.showAvatarCropModal = function () {
    document.getElementById('avatarCropModal').classList.add('active');
    document.getElementById('appBlocker').classList.add('active');
};

SalesTracker.prototype.closeAvatarCrop = function () {
    document.getElementById('avatarCropModal').classList.remove('active');
    document.getElementById('appBlocker').classList.remove('active');

    // Reset file input
    document.getElementById('settingsProfilePicture').value = '';

    // Clear crop data
    this.avatarCropData.image = null;
};

SalesTracker.prototype.updateAvatarCrop = function () {
    if (!this.avatarCropData.image || !this.avatarCropData.canvas) return;

    // Get current values
    this.avatarCropData.scale = parseFloat(document.getElementById('cropScale').value);
    this.avatarCropData.x = parseFloat(document.getElementById('cropX').value);
    this.avatarCropData.y = parseFloat(document.getElementById('cropY').value);

    // Update main canvas
    this.drawCropPreview();

    // Update preview canvas
    this.drawAvatarPreview();
};

SalesTracker.prototype.drawCropPreview = function () {
    const canvas = this.avatarCropData.canvas;
    const ctx = canvas.getContext('2d');
    const img = this.avatarCropData.image;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scaled dimensions
    const scaledWidth = img.width * this.avatarCropData.scale;
    const scaledHeight = img.height * this.avatarCropData.scale;

    // Calculate position based on percentage
    const x = (canvas.width - scaledWidth) * (this.avatarCropData.x / 100);
    const y = (canvas.height - scaledHeight) * (this.avatarCropData.y / 100);

    // Draw image
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
};

SalesTracker.prototype.drawAvatarPreview = function () {
    const canvas = this.avatarCropData.previewCanvas;
    const ctx = canvas.getContext('2d');
    const img = this.avatarCropData.image;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    ctx.clip();

    // Calculate crop area from main canvas
    const mainCanvas = this.avatarCropData.canvas;
    const cropSize = 200; // Size of crop circle
    const cropX = (mainCanvas.width - cropSize) / 2;
    const cropY = (mainCanvas.height - cropSize) / 2;

    // Calculate scaled dimensions for preview
    const scaledWidth = img.width * this.avatarCropData.scale;
    const scaledHeight = img.height * this.avatarCropData.scale;

    // Calculate position
    const x = (mainCanvas.width - scaledWidth) * (this.avatarCropData.x / 100);
    const y = (mainCanvas.height - scaledHeight) * (this.avatarCropData.y / 100);

    // Calculate the portion of the image that's in the crop circle
    const sourceX = Math.max(0, cropX - x);
    const sourceY = Math.max(0, cropY - y);
    const sourceWidth = Math.min(scaledWidth - sourceX, cropSize);
    const sourceHeight = Math.min(scaledHeight - sourceY, cropSize);

    // Draw the cropped portion
    if (sourceWidth > 0 && sourceHeight > 0) {
        const destX = Math.max(0, x - cropX) * (canvas.width / cropSize);
        const destY = Math.max(0, y - cropY) * (canvas.height / cropSize);
        const destWidth = sourceWidth * (canvas.width / cropSize);
        const destHeight = sourceHeight * (canvas.height / cropSize);

        ctx.drawImage(
            img,
            sourceX / this.avatarCropData.scale, sourceY / this.avatarCropData.scale,
            sourceWidth / this.avatarCropData.scale, sourceHeight / this.avatarCropData.scale,
            destX, destY, destWidth, destHeight
        );
    }

    ctx.restore();
};

SalesTracker.prototype.saveAvatarCrop = function () {
    if (!this.avatarCropData.image) return;

    // Create a canvas for the final cropped image
    const finalCanvas = document.createElement('canvas');
    const finalCtx = finalCanvas.getContext('2d');

    // Set final canvas size (circular avatar)
    const finalSize = 200;
    finalCanvas.width = finalSize;
    finalCanvas.height = finalSize;

    // Create circular clipping path
    finalCtx.save();
    finalCtx.beginPath();
    finalCtx.arc(finalSize / 2, finalSize / 2, finalSize / 2, 0, Math.PI * 2);
    finalCtx.clip();

    // Calculate crop parameters
    const mainCanvas = this.avatarCropData.canvas;
    const img = this.avatarCropData.image;
    const cropSize = 200;
    const cropX = (mainCanvas.width - cropSize) / 2;
    const cropY = (mainCanvas.height - cropSize) / 2;

    const scaledWidth = img.width * this.avatarCropData.scale;
    const scaledHeight = img.height * this.avatarCropData.scale;
    const x = (mainCanvas.width - scaledWidth) * (this.avatarCropData.x / 100);
    const y = (mainCanvas.height - scaledHeight) * (this.avatarCropData.y / 100);

    // Draw the final cropped image
    const sourceX = Math.max(0, cropX - x);
    const sourceY = Math.max(0, cropY - y);
    const sourceWidth = Math.min(scaledWidth - sourceX, cropSize);
    const sourceHeight = Math.min(scaledHeight - sourceY, cropSize);

    if (sourceWidth > 0 && sourceHeight > 0) {
        const destX = Math.max(0, x - cropX) * (finalSize / cropSize);
        const destY = Math.max(0, y - cropY) * (finalSize / cropSize);
        const destWidth = sourceWidth * (finalSize / cropSize);
        const destHeight = sourceHeight * (finalSize / cropSize);

        finalCtx.drawImage(
            img,
            sourceX / this.avatarCropData.scale, sourceY / this.avatarCropData.scale,
            sourceWidth / this.avatarCropData.scale, sourceHeight / this.avatarCropData.scale,
            destX, destY, destWidth, destHeight
        );
    }

    finalCtx.restore();

    // Convert to data URL and save
    const croppedImageData = finalCanvas.toDataURL('image/png', 0.9);

    // Update profile with cropped image
    this.shopProfile.profilePicture = croppedImageData;
    localStorage.setItem('shopTrackerProfile', JSON.stringify(this.shopProfile));

    // Update profile in profiles array
    const profileIndex = this.profiles.findIndex(p => p.id === this.shopProfile.id);
    if (profileIndex !== -1) {
        this.profiles[profileIndex] = { ...this.shopProfile };
        this.saveAllProfiles();
    }

    // Update UI
    this.updateAvatarUI();
    this.loadSettings(); // Refresh settings if open

    // Close modal
    this.closeAvatarCrop();

    this.showNotification('Avatar updated successfully!', 'success');
};

SalesTracker.prototype.updateAvatarUI = function () {
    // Update sidebar avatar
    const avatarCircle = document.getElementById('userAvatarCircle');
    if (!avatarCircle) return;

    const avatarImage = avatarCircle.querySelector('.avatar-image');
    const avatarPlaceholder = avatarCircle.querySelector('.avatar-placeholder');
    if (!avatarImage || !avatarPlaceholder) return;

    const avatarInitials = avatarPlaceholder.querySelector('.avatar-initials');
    if (!avatarInitials) return;

    if (this.shopProfile && this.shopProfile.profilePicture) {
        avatarImage.src = this.shopProfile.profilePicture;
        avatarImage.style.display = 'block';
        avatarPlaceholder.style.display = 'none';
        avatarCircle.classList.add('has-image');
    } else {
        avatarImage.style.display = 'none';
        avatarPlaceholder.style.display = 'flex';
        avatarCircle.classList.remove('has-image');

        // Update initials
        const initials = this.getInitials(
            this.shopProfile ? this.shopProfile.shopName : '',
            this.shopProfile ? this.shopProfile.ownerName : ''
        );
        avatarInitials.textContent = initials;
    }
};

SalesTracker.prototype.getInitials = function (shopName, ownerName) {
    const shopInitial = shopName ? shopName.charAt(0).toUpperCase() : '';
    const ownerInitial = ownerName ? ownerName.charAt(0).toUpperCase() : '';
    return shopInitial + ownerInitial;
};

SalesTracker.prototype.initializeAvatar = function () {
    if (this.shopProfile) {
        this.updateAvatarUI();
    }
};
// Handle profile picture upload during initial profile setup
SalesTracker.prototype.handleSetupProfilePicture = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image file is too large. Please select a file under 5MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        // Store the image temporarily
        this.setupProfilePicture = event.target.result;

        // Update the avatar preview in the setup modal
        const setupAvatar = document.getElementById('setupAvatarCircle');
        if (setupAvatar) {
            const avatarImage = setupAvatar.querySelector('.avatar-image');
            const avatarPlaceholder = setupAvatar.querySelector('.avatar-placeholder');

            if (avatarImage && avatarPlaceholder) {
                avatarImage.src = event.target.result;
                avatarImage.style.display = 'block';
                avatarPlaceholder.style.display = 'none';
                setupAvatar.classList.add('has-image');
            }
        }
    };
    reader.readAsDataURL(file);
}
// Handle profile picture upload for new profile creation
SalesTracker.prototype.handleNewProfilePicture = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image file is too large. Please select a file under 5MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        // Store the image temporarily
        this.newProfilePicture = event.target.result;

        // Update the avatar preview in the new profile modal
        const avatarCircle = document.getElementById('newProfileAvatarCircle');
        if (avatarCircle) {
            const avatarImage = avatarCircle.querySelector('.avatar-image');
            const avatarPlaceholder = avatarCircle.querySelector('.avatar-placeholder');

            if (avatarImage && avatarPlaceholder) {
                avatarImage.src = event.target.result;
                avatarImage.style.display = 'block';
                avatarPlaceholder.style.display = 'none';
                avatarCircle.classList.add('has-image');
            }
        }
    };
    reader.readAsDataURL(file);
}
