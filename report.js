function generateReport() {
    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);
    const reportResults = document.getElementById("reportResults");

    // Validate date range
    if (isNaN(startDate) || isNaN(endDate)) {
        alert("Please select valid start and end dates.");
        return;
    }
    if (startDate > endDate) {
        alert("Start date must be before end date.");
        return;
    }

    // Filter orders based on the selected date range
    const filteredOrders = TailorApp.orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= startDate && orderDate <= endDate;
    });

    // Calculate total sales and other metrics
    const totalSales = filteredOrders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0);
    const totalOrders = filteredOrders.length;
    const completedOrders = filteredOrders.filter(order => new Date(order.collectionDate) < new Date()).length;

    // Display the results
    reportResults.innerHTML = `
        <h4>Report Summary</h4>
        <p>Total Orders: ${totalOrders}</p>
        <p>Completed Orders: ${completedOrders}</p>
        <p>Total Sales: Ghs${totalSales.toFixed(2)}</p>
        <h5>Orders:</h5>
        <ul>
            ${filteredOrders.map(order => `
                <li>
                    Order ID: ${order.id}, 
                    Customer: ${order.customerName}, 
                    Amount: Ghs${order.amount}, 
                    Order Date: ${order.orderDate}, 
                    Due Date: ${order.collectionDate}
                </li>
            `).join('')}
        </ul>
    `;
}

// Event listener for report generation
document.getElementById("generateReport").addEventListener("click", generateReport);