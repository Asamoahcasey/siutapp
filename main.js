function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleIcon = document.getElementById('toggleIcon');

    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');

    if (sidebar.classList.contains('collapsed')) {
        toggleIcon.classList.remove('bi-chevron-left');
        toggleIcon.classList.add('bi-chevron-right');
    } else {
        toggleIcon.classList.remove('bi-chevron-right');
        toggleIcon.classList.add('bi-chevron-left');
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.nav-link[onclick="showSection('${sectionId}')"]`).classList.add('active');
}

const TailorApp = {
    orders: [],
    currentPage: 1,
    recordsPerPage: 5,
    searchTerm: "",
    currentEditId: null,

    calculateBalance() {
        const amount = parseFloat(document.getElementById("amount").value) || 0;
        const initialPayment = parseFloat(document.getElementById("initialPayment").value) || 0;
        const balance = amount - initialPayment;
        document.getElementById("balance").value = balance.toFixed(2);
    },

    resetNewOrderForm() {
        document.getElementById("customerForm").reset();
        document.getElementById("imagePreview").innerHTML = "";
        this.currentEditId = null;
    },

    init() {
        this.loadOrders();
        this.setupEventListeners();
        this.renderOrders();
        this.setupNotifications();
        this.updateDashboard();
        setInterval(() => this.checkDueDates(), 3600000);
    },

    loadOrders() {
        const savedOrders = JSON.parse(localStorage.getItem("tailorOrders")) || [];
        this.orders = savedOrders;
    },

    getCustomersFromOrders() {
const customers = {};

this.orders.forEach(order => {
    if (!customers[order.customerName]) {
        customers[order.customerName] = {
            phoneNumber: order.phoneNumber,
            address: order.address,
            orders: []
        };
    }
    customers[order.customerName].orders.push(order);
});

return Object.keys(customers).map(name => ({
    name,
    ...customers[name]
}));
},

renderCustomers() {
const customersList = this.getCustomersFromOrders();
const customersListElement = document.getElementById("customersList");

if (customersList.length === 0) {
customersListElement.innerHTML = '<div class="no-customers">No customers found</div>';
return;
}

customersListElement.innerHTML = `
<div class="customers-container">
    ${customersList.map(customer => `
        <div class="customer-card">
            <h5>${customer.name}</h5>
            <p><strong>Phone:</strong> ${customer.phoneNumber}</p>
            <p><strong>Address:</strong> ${customer.address}</p>
            <h6>Orders:</h6>
            <ul>
                ${customer.orders.map(order => `
                    <li>
                        Order ID: ${order.id}, 
                        Amount: Ghs${order.amount}, 
                        Balance: Ghs${order.balance}, 
                        Order Date: ${order.orderDate}, 
                        Due Date: ${order.collectionDate}
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('')}
</div>
`;
},

// Call this method to render customers when the customer section is activated
init() {
this.loadOrders();
this.setupEventListeners();
this.renderOrders();
this.renderCustomers(); // Ensure customers are rendered
this.updateDashboard(); // Call this after rendering customers
this.setupNotifications();
setInterval(() => this.checkDueDates(), 3600000);
},

saveOrders() {
localStorage.setItem("tailorOrders", JSON.stringify(this.orders));
this.updateDashboard(); // Update dashboard after saving
},

    saveSettings() {
        const reminderDays = document.getElementById("reminderDays").value;
        if (reminderDays < 1) {
            alert("Reminder days must be at least 1.");
            return;
        }
        localStorage.setItem("reminderDays", reminderDays);
        this.checkDueDates();
        alert("Settings saved successfully!");
    },

    setupEventListeners() {
document.getElementById("customerForm").addEventListener("submit", (e) => {
e.preventDefault(); // Prevent the default form submission
if (this.currentEditId) {
    this.handleEditSubmit();
} else {
    this.handleFormSubmit();
}
});
        document.getElementById("styleImage").addEventListener("change", (e) => {
            this.handleImagePreview(e);
        });

        document.getElementById("searchInput").addEventListener("input", (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.currentPage = 1;
            this.renderOrders();
        });

        document.getElementById("recordsPerPage").addEventListener("change", (e) => {
            this.recordsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderOrders();
        });

        document.getElementById("prevPage").addEventListener("click", () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderOrders();
            }
        });

        document.getElementById("nextPage").addEventListener("click", () => {
            const filteredOrders = this.getFilteredOrders();
            const maxPages = Math.ceil(filteredOrders.length / this.recordsPerPage);
            if (this.currentPage < maxPages) {
                this.currentPage++;
                this.renderOrders();
            }
        });
    },

    handleFormSubmit() {
const amount = parseFloat(document.getElementById("amount").value);
const initialPayment = parseFloat(document.getElementById("initialPayment").value);
const orderDate = document.getElementById("orderDate").value;
const collectionDate = document.getElementById("collectionDate").value;

// Validation checks
if (amount < 0 || initialPayment < 0) {
alert("Amounts cannot be negative.");
return;
}
if (initialPayment > amount) {
alert("Initial payment cannot exceed total amount.");
return;
}
if (new Date(collectionDate) < new Date(orderDate)) {
alert("Collection date must be after order date.");
return;
}

// Create the order data
const formData = {
id: Date.now(), // Unique ID for the order
customerName: document.getElementById("customerName").value,
phoneNumber: document.getElementById("phoneNumber").value,
address: document.getElementById("address").value,
measurements: {
    trouser: {
        waist: document.getElementById("waist").value,
        thigh: document.getElementById("thigh").value,
        knee: document.getElementById("knee").value,
        calf: document.getElementById("calf").value,
        wKnee: document.getElementById("wKnee").value,
        wCalf: document.getElementById("wCalf").value,
        trouserLength: document.getElementById("trouserLength").value,
        bar: document.getElementById("bar").value,
    },
    shirt: {
        neck: document.getElementById("neck").value,
        stomach: document.getElementById("stomach").value,
        acrossBack: document.getElementById("acrossBack").value,
        sleeveLength: document.getElementById("sleeveLength").value,
        aroundArm: document.getElementById("aroundArm").value,
        shirtLength: document.getElementById("shirtLength").value,
        jacketL: document.getElementById("jacketL").value,
        chest: document.getElementById("chest").value,
        longSleeve: document.getElementById("longSleeve").value,
        shortSleeve: document.getElementById("shortSleeve").value,
        threeQuarter: document.getElementById("threeQuarter").value,
    },
},
amount: document.getElementById("amount").value,
initialPayment: document.getElementById("initialPayment").value,
balance: document.getElementById("balance").value,
orderDate: document.getElementById("orderDate").value,
collectionDate: document.getElementById("collectionDate").value,
comments: document.getElementById("comments").value,
styleImage: document.getElementById("imagePreview").innerHTML,
};

// Add new order to the orders array
this.orders.unshift(formData);
this.saveOrders(); // Save orders to local storage
this.renderOrders(); // Update the orders list
this.resetNewOrderForm(); // Reset the form
showSection('orders'); // Show the orders section
alert("Order saved successfully!"); // Confirmation message
},

    handleEditSubmit() {
        const amount = parseFloat(document.getElementById("amount").value);
        const initialPayment = parseFloat(document.getElementById("initialPayment").value);
        const orderDate = document.getElementById("orderDate").value;
        const collectionDate = document.getElementById("collectionDate").value;

        if (amount < 0 || initialPayment < 0) {
            alert("Amounts cannot be negative.");
            return;
        }
        if (initialPayment > amount) {
            alert("Initial payment cannot exceed total amount.");
            return;
        }
        if (new Date(collectionDate) < new Date(orderDate)) {
            alert("Collection date must be after order date.");
            return;
        }

        const formData = {
            id: this.currentEditId,
            customerName: document.getElementById("customerName").value,
            phoneNumber: document.getElementById("phoneNumber").value,
            address: document.getElementById("address").value,
            measurements: {
                trouser: {
                    waist: document.getElementById("waist").value,
                    thigh: document.getElementById("thigh").value,
                    knee: document.getElementById("knee").value,
                    calf: document.getElementById("calf").value,
                    wKnee: document.getElementById("wKnee").value,
                    wCalf: document.getElementById("wCalf").value,
                    trouserLength: document.getElementById("trouserLength").value,
                    bar: document.getElementById("bar").value,
                },
                shirt: {
                    neck: document.getElementById("neck").value,
                    stomach: document.getElementById("stomach").value,
                    acrossBack: document.getElementById("acrossBack").value,
                    sleeveLength: document.getElementById("sleeveLength").value,
                    aroundArm: document.getElementById("aroundArm").value,
                    shirtLength: document.getElementById("shirtLength").value,
                    jacketL: document.getElementById("jacketL").value,
                    chest: document.getElementById("chest").value,
                    longSleeve: document.getElementById("longSleeve").value,
                    shortSleeve: document.getElementById("shortSleeve").value,
                    threeQuarter: document.getElementById("threeQuarter").value,
                },
            },
            amount: document.getElementById("amount").value,
            initialPayment: document.getElementById("initialPayment").value,
            balance: document.getElementById("balance").value,
            orderDate: document.getElementById("orderDate").value,
            collectionDate: document.getElementById("collectionDate").value,
            comments: document.getElementById("comments").value,
            styleImage: document.getElementById("imagePreview").innerHTML,
        };

        const index = this.orders.findIndex((order) => order.id === this.currentEditId);
        if (index !== -1) {
            this.orders[index] = formData;
            this.saveOrders();
            this.renderOrders();
        }

        this.resetNewOrderForm();
        showSection('orders');
        alert("Order updated successfully!");
    },

    handleImagePreview(e) {
        const files = e.target.files;
        const imagePreviewContainer = document.getElementById("imagePreview");
        imagePreviewContainer.innerHTML = "";

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = (e) => {
                const imgElement = document.createElement("div");
                imgElement.classList.add("position-relative", "mb-2");
                imgElement.innerHTML = `
                    <img src="${e.target.result}" alt="Style Preview" class="img-fluid" style="max-height: 200px;">
                    <button class="btn btn-danger btn-sm position-absolute top-0 end-0" onclick="TailorApp.removeImage(this)">Remove</button>
                `;
                imagePreviewContainer.appendChild(imgElement);
            };
            reader.readAsDataURL(file);
        }
    },

    removeImage(button) {
        const imgContainer = button.parentElement;
        imgContainer.remove();
    },

    editOrder(id) {
        const order = this.orders.find((o) => o.id === id);
        if (order) {
            this.currentEditId = id;
            showSection('new-order');

            document.getElementById("customerName").value = order.customerName;
            document.getElementById("phoneNumber").value = order.phoneNumber;
            document.getElementById("address").value = order.address;

            document.getElementById("waist").value = order.measurements.trouser.waist;
            document.getElementById("thigh").value = order.measurements.trouser.thigh;
            document.getElementById("knee").value = order.measurements.trouser.knee;
            document.getElementById("calf").value = order.measurements.trouser.calf;
            document.getElementById("wKnee").value = order.measurements.trouser.wKnee;
            document.getElementById("wCalf").value = order.measurements.trouser.wCalf;
            document.getElementById("trouserLength").value = order.measurements.trouser.trouserLength;
            document.getElementById("bar").value = order.measurements.trouser.bar;

            document.getElementById("neck").value = order.measurements.shirt.neck;
            document.getElementById("stomach").value = order.measurements.shirt.stomach;
            document.getElementById("acrossBack").value = order.measurements.shirt.acrossBack;
            document.getElementById("sleeveLength").value = order.measurements.shirt.sleeveLength;
            document.getElementById("aroundArm").value = order.measurements.shirt.aroundArm;
            document.getElementById("shirtLength").value = order.measurements.shirt.shirtLength;
            document.getElementById("jacketL").value = order.measurements.shirt.jacketL;
            document.getElementById("chest").value = order.measurements.shirt.chest;
            document.getElementById("longSleeve").value = order.measurements.shirt.longSleeve;
            document.getElementById("shortSleeve").value = order.measurements.shirt.shortSleeve;
            document.getElementById("threeQuarter").value = order.measurements.shirt.threeQuarter;

            document.getElementById("amount").value = order.amount;
            document.getElementById("initialPayment").value = order.initialPayment;
            document.getElementById("balance").value = order.balance;
            document.getElementById("orderDate").value = order.orderDate;
            document.getElementById("collectionDate").value = order.collectionDate;
            document.getElementById("comments").value = order.comments || "";
            document.getElementById("imagePreview").innerHTML = order.styleImage;
        }
    },

    getFilteredOrders() {
        return this.orders.filter((order) => {
            const searchString = this.searchTerm.toLowerCase();
            return (
                order.customerName.toLowerCase().includes(searchString) ||
                order.phoneNumber.toLowerCase().includes(searchString) ||
                order.id.toString().includes(searchString)
            );
        });
    },

    renderOrders() {
        const filteredOrders = this.getFilteredOrders();
        const startIndex = (this.currentPage - 1) * this.recordsPerPage;
        const endIndex = Math.min(startIndex + this.recordsPerPage, filteredOrders.length);
        const ordersToDisplay = filteredOrders.slice(startIndex, endIndex);

        const ordersList = document.getElementById("ordersList");
        ordersList.innerHTML = ordersToDisplay.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.styleImage ? '<i class="bi bi-image text-success"></i>' : '<i class="bi bi-x text-danger"></i>'}</td>
                <td>${order.customerName}</td>
                <td>${order.phoneNumber}</td>
                <td>Ghs ${order.amount}</td>
                <td>${order.orderDate}</td>
                <td>${order.collectionDate}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="TailorApp.viewOrder(${order.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="TailorApp.editOrder(${order.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="TailorApp.deleteOrder(${order.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join("");

        document.getElementById("startRecord").textContent = filteredOrders.length ? startIndex + 1 : 0;
        document.getElementById("endRecord").textContent = endIndex;
        document.getElementById("totalRecords").textContent = filteredOrders.length;

        document.getElementById("prevPage").disabled = this.currentPage === 1;
        document.getElementById("nextPage").disabled = endIndex >= filteredOrders.length;
    },

    updateDashboard() {
const totalOrders = this.orders.length;
const today = new Date().toISOString().split('T')[0];
const completedOrders = this.orders.filter(order => order.collectionDate < today).length;
const pendingOrders = totalOrders - completedOrders;
const totalRevenue = this.orders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0);
const balanceDue = this.orders.reduce((sum, order) => sum + parseFloat(order.balance || 0), 0);

document.getElementById("totalOrders").textContent = totalOrders;
document.getElementById("completedOrders").textContent = completedOrders;
document.getElementById("pendingOrders").textContent = pendingOrders;
document.getElementById("totalRevenue").textContent = `Ghs${totalRevenue.toFixed(2)}`;
document.getElementById("balanceDue").textContent = `Ghs${balanceDue.toFixed(2)}`;

const recentOrders = this.orders.slice(0, 5);
const recentOrdersList = document.getElementById("recentOrdersList");

if (recentOrders.length === 0) {
    recentOrdersList.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No orders yet</td></tr>';
} else {
    recentOrdersList.innerHTML = recentOrders.map(order => {
        const dueDate = new Date(order.collectionDate);
        const today = new Date();
        const status = dueDate < today ? 'Overdue' : dueDate.toDateString() === today.toDateString() ? 'Due Today' : 'Pending';
        const statusClass = status === 'Overdue' ? 'badge bg-danger' : status === 'Due Today' ? 'badge bg-warning' : 'badge bg-success';
        
        return `
            <tr>
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.collectionDate}</td>
                <td><span class="${statusClass}">${status}</span></td>
                <td>Ghs${order.amount}</td>
            </tr>
        `;
    }).join("");
}
},

    viewOrder(id) {
        const order = this.orders.find((o) => o.id === id);
        if (order) {
            const modal = new bootstrap.Modal(document.getElementById("viewOrder"));
            const detailsContainer = document.getElementById("viewOrderDetails");

            detailsContainer.innerHTML = `
                <div class="container">
                    ${order.styleImage ? `
                        <div class="text-center mb-4">
                            ${order.styleImage}
                        </div>
                    ` : ""}
                    <h5>Customer Details</h5>
                    <p><strong>Name:</strong> ${order.customerName}</p>
                    <p><strong>Phone:</strong> ${order.phoneNumber}</p>
                    <p><strong>Address:</strong> ${order.address}</p>
                    
                    <h5>Measurements</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Trouser Measurements:</h6>
                            <p><strong>Waist:</strong> ${order.measurements.trouser.waist || '-'}</p>
                            <p><strong>Thigh:</strong> ${order.measurements.trouser.thigh || '-'}</p>
                            <p><strong>Knee:</strong> ${order.measurements.trouser.knee || '-'}</p>
                            <p><strong>Calf:</strong> ${order.measurements.trouser.calf || '-'}</p>
                            <p><strong>W-Knee:</strong> ${order.measurements.trouser.wKnee || '-'}</p>
                            <p><strong>W-Calf:</strong> ${order.measurements.trouser.wCalf || '-'}</p>
                            <p><strong>Trouser Length:</strong> ${order.measurements.trouser.trouserLength || '-'}</p>
                            <p><strong>Bar:</strong> ${order.measurements.trouser.bar || '-'}</p>
                        </div>
                        <div class="col-md-6">
                            <h6>Shirt Measurements:</h6>
                            <p><strong>Neck:</strong> ${order.measurements.shirt.neck || '-'}</p>
                            <p><strong>Stomach:</strong> ${order.measurements.shirt.stomach || '-'}</p>
                            <p><strong>Across Back:</strong> ${order.measurements.shirt.acrossBack || '-'}</p>
                            <p><strong>Sleeve Length:</strong> ${order.measurements.shirt.sleeveLength || '-'}</p>
                            <p><strong>Around Arm:</strong> ${order.measurements.shirt.aroundArm || '-'}</p>
                            <p><strong>Shirt Length:</strong> ${order.measurements.shirt.shirtLength || '-'}</p>
                            <p><strong>Jacket Length:</strong> ${order.measurements.shirt.jacketL || '-'}</p>
                            <p><strong>Chest:</strong> ${order.measurements.shirt.chest || '-'}</p>
                            <p><strong>Long Sleeve:</strong> ${order.measurements.shirt.longSleeve || '-'}</p>
                            <p><strong>Short Sleeve:</strong> ${order.measurements.shirt.shortSleeve || '-'}</p>
                            <p><strong>Three Quarter:</strong> ${order.measurements.shirt.threeQuarter || '-'}</p>
                        </div>
                    </div>
                    
                    <h5>Payment Details</h5>
                    <p><strong>Total Amount:</strong> Ghs ${order.amount}</p>
                    <p><strong>Initial Payment:</strong> Ghs ${order.initialPayment}</p>
                    <p><strong>Balance:</strong> Ghs ${order.balance}</p>
                    <p><strong>Order Date:</strong> ${order.orderDate}</p>
                    <p><strong>Collection Date:</strong> ${order.collectionDate}</p>

                    <h5>Comments</h5>
                    <p>${order.comments || "No comments provided."}</p>

                    <div class="mt-3">
                        <button class="btn btn-primary me-2" onclick="TailorApp.printReceipt(${order.id})">
                            Print Receipt <i class="bi bi-printer"></i>
                        </button>
                        <button class="btn btn-success" onclick="TailorApp.saveOrderAsPDF(${order.id})">
                            Save Order Details <i class="bi bi-file-earmark-pdf"></i>
                        </button>
                    </div>
                </div>
            `;
            modal.show();
        }
    },

    deleteOrder(id) {
        if (confirm("Are you sure you want to delete this order?")) {
            this.orders = this.orders.filter((order) => order.id !== id);
            this.saveOrders();
            this.renderOrders();
        }
    },

    setupNotifications() {
        this.checkDueDates();
    },

    checkDueDates() {
        const reminderDays = parseInt(localStorage.getItem("reminderDays")) || 7;
        const now = new Date();
        const notifications = [];

        this.orders.forEach((order) => {
            const dueDate = new Date(order.collectionDate);
            const diffTime = dueDate - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= reminderDays && diffDays >= 0) {
                notifications.push({
                    id: order.id,
                    daysLeft: diffDays,
                    customerName: order.customerName,
                    collectionDate: order.collectionDate,
                    isOverdue: diffDays < 0,
                });
            }
        });

        this.updateNotificationUI(notifications);
    },

    updateNotificationUI(notifications) {
        const notificationList = document.getElementById("notificationList");
        const notificationCount = document.getElementById("notificationCount");

        notificationList.innerHTML = notifications
            .sort((a, b) => a.daysLeft - b.daysLeft)
            .map(
                (notification) => `
                <div class="notification-item ${notification.isOverdue ? "overdue" : "upcoming"}">
                    <div class="d-flex justify-content-between">
                        <div>
                            <strong>${notification.customerName}</strong><br>
                            Due in ${notification.daysLeft} day${notification.daysLeft !== 1 ? 's' : ''}
                        </div>
                        <div>
                            <button class="btn btn-sm btn-link" onclick="TailorApp.viewOrder(${notification.id})">
                                <i class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>
                    <small class="text-muted">${notification.collectionDate}</small>
                </div>
            `
            )
            .join("");

        notificationCount.textContent = notifications.length;
        if (notifications.length > 0) {
            notificationCount.classList.add("bg-danger");
        } else {
            notificationCount.classList.remove("bg-danger");
        }
    },

    exportToExcel() {
        if (this.orders.length === 0) {
            alert("No orders to export.");
            return;
        }

        const wsData = this.orders.map((order) => ({
            "Order ID": order.id,
            "Customer Name": order.customerName,
            "Phone Number": order.phoneNumber,
            Address: order.address,
            Amount: order.amount,
            "Order Date": order.orderDate,
            "Collection Date": order.collectionDate,
            Waist: order.measurements.trouser.waist,
            Thigh: order.measurements.trouser.thigh,
            Knee: order.measurements.trouser.knee,
            Calf: order.measurements.trouser.calf,
            "W-Knee": order.measurements.trouser.wKnee,
            "W-Calf": order.measurements.trouser.wCalf,
            "Trouser Length": order.measurements.trouser.trouserLength,
            Bar: order.measurements.trouser.bar,
            Neck: order.measurements.shirt.neck,
            Stomach: order.measurements.shirt.stomach,
            "Across Back": order.measurements.shirt.acrossBack,
            "Sleeve Length": order.measurements.shirt.sleeveLength,
            "Around Arm": order.measurements.shirt.aroundArm,
            "Shirt Length": order.measurements.shirt.shirtLength,
            "Jacket Length": order.measurements.shirt.jacketL,
            Chest: order.measurements.shirt.chest,
            "Long Sleeve": order.measurements.shirt.longSleeve,
            "Short Sleeve": order.measurements.shirt.shortSleeve,
            "Three Quarter": order.measurements.shirt.threeQuarter,
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Orders");
        XLSX.writeFile(wb, "groomsmen_gh_orders.xlsx");
    },

    importFromExcel(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                const importedOrders = jsonData.map((row) => ({
                    id: row["Order ID"] || Date.now() + Math.random(),
                    customerName: row["Customer Name"] || "",
                    phoneNumber: row["Phone Number"] || "",
                    address: row["Address"] || "",
                    measurements: {
                        trouser: {
                            waist: row["Waist"] || "",
                            thigh: row["Thigh"] || "",
                            knee: row["Knee"] || "",
                            calf: row["Calf"] || "",
                            wKnee: row["W-Knee"] || "",
                            wCalf: row["W-Calf"] || "",
                            trouserLength: row["Trouser Length"] || "",
                            bar: row["Bar"] || "",
                        },
                        shirt: {
                            neck: row["Neck"] || "",
                            stomach: row["Stomach"] || "",
                            acrossBack: row["Across Back"] || "",
                            sleeveLength: row["Sleeve Length"] || "",
                            aroundArm: row["Around Arm"] || "",
                            shirtLength: row["Shirt Length"] || "",
                            jacketL: row["Jacket Length"] || "",
                            chest: row["Chest"] || "",
                            longSleeve: row["Long Sleeve"] || "",
                            shortSleeve: row["Short Sleeve"] || "",
                            threeQuarter: row["Three Quarter"] || "",
                        },
                    },
                    amount: row["Amount"] || "",
                    orderDate: row["Order Date"] || "",
                    collectionDate: row["Collection Date"] || "",
                    styleImage: "",
                }));

                this.orders = [...importedOrders, ...this.orders];
                this.saveOrders();
                this.renderOrders();
                alert("Orders imported successfully!");
            } catch (error) {
                console.error("Error importing file:", error);
                alert("Error importing file. Please check the file format.");
            }
        };
        reader.readAsArrayBuffer(file);
    },

    async printReceipt(id) {
        const order = this.orders.find((o) => o.id === id);
        if (order) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            let yOffset = 30;

            doc.setFontSize(20);
            doc.text("Bespoke Suit", 105, yOffset, { align: "center" });
            yOffset += 10;

            doc.setFontSize(14);
            doc.text("Receipt", 105, yOffset, { align: "center" });
            yOffset += 10;
            doc.line(10, yOffset, 200, yOffset);
            yOffset += 10;

            doc.setFontSize(12);
            doc.text(`Order ID: ${order.id}`, 14, yOffset);
            yOffset += 10;
            doc.text(`Customer: ${order.customerName}`, 14, yOffset);
            yOffset += 10;
            doc.text(`Phone: ${order.phoneNumber}`, 14, yOffset);
            yOffset += 10;
            doc.text(`Order Date: ${order.orderDate}`, 14, yOffset);
            yOffset += 10;
            doc.text(`Collection Date: ${order.collectionDate}`, 14, yOffset);
            yOffset += 15;

            doc.text(`Total Amount: Ghs ${order.amount}`, 14, yOffset);
            yOffset += 10;
            doc.text(`Initial Payment: Ghs ${order.initialPayment}`, 14, yOffset);
            yOffset += 10;
            doc.text(`Balance: Ghs ${order.balance}`, 14, yOffset);
            yOffset += 15;

            doc.line(10, yOffset, 200, yOffset);
            yOffset += 10;
            doc.text("© 2025 Bespoke Suit", 105, yOffset, { align: "center" });

            doc.save(`Receipt_${order.id}.pdf`);
        }
    },

    async saveOrderAsPDF(id) {
        const order = this.orders.find((o) => o.id === id);
        if (order) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            let yOffset = 20;

            doc.setFontSize(16);
            doc.text("Bespoke Suit", 105, yOffset, { align: "center" });
            doc.setFontSize(10);
            doc.text("Complete Order Details", 105, yOffset + 7, { align: "center" });
            yOffset += 30;

            if (order.styleImage) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = order.styleImage;
                tempDiv.style.position = 'absolute';
                tempDiv.style.left = '-9999px';
                document.body.appendChild(tempDiv);

                const canvas = await html2canvas(tempDiv, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 170;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                doc.addImage(imgData, 'PNG', 20, yOffset, imgWidth, imgHeight);
                yOffset += imgHeight + 10;

                document.body.removeChild(tempDiv);
            }

            doc.setFontSize(14);
            doc.text("Customer Information", 20, yOffset);
            doc.setFontSize(12);
            yOffset += 10;
            doc.text(`Order ID: ${order.id}`, 20, yOffset);
            yOffset += 10;
            doc.text(`Name: ${order.customerName}`, 20, yOffset);
            yOffset += 10;
            doc.text(`Phone: ${order.phoneNumber}`, 20, yOffset);
            yOffset += 10;
            doc.text(`Address: ${order.address}`, 20, yOffset);
            yOffset += 15;

            const comment = order.comments || "No comment provided.";
            const commentLines = doc.splitTextToSize(comment, 170);
            doc.text("Comments:", 20, yOffset);
            yOffset += 10;
            commentLines.forEach(line => {
                doc.text(line, 20, yOffset);
                yOffset += 10;
            });

            doc.setFontSize(14);
            doc.text("Measurements", 20, yOffset);
            yOffset += 10;
            doc.setFontSize(12);
            doc.text("Trouser Measurements:", 20, yOffset);
            yOffset += 10;
            Object.entries(order.measurements.trouser).forEach(([key, value]) => {
                if (value) {
                    doc.text(`${key}: ${value}`, 20, yOffset);
                    yOffset += 10;
                }
            });
            doc.text("Shirt Measurements:", 20, yOffset);
            yOffset += 10;
            Object.entries(order.measurements.shirt).forEach(([key, value]) => {
                if (value) {
                    doc.text(`${key}: ${value}`, 20, yOffset);
                    yOffset += 10;
                }
            });

            doc.setFontSize(14);
            doc.text("Payment Details", 20, yOffset);
            yOffset += 10;
            doc.setFontSize(12);
            doc.text(`Total Amount: Ghs ${order.amount}`, 20, yOffset);
            yOffset += 10;
            doc.text(`Initial Payment: Ghs ${order.initialPayment}`, 20, yOffset);
            yOffset += 10;
            doc.text(`Balance: Ghs ${order.balance}`, 20, yOffset);
            yOffset += 10;
            doc.text(`Order Date: ${order.orderDate}`, 20, yOffset);
            yOffset += 10;
            doc.text(`Collection Date: ${order.collectionDate}`, 20, yOffset);

            doc.save(`Order_${order.id}.pdf`);
        }
    }
};

TailorApp.init();