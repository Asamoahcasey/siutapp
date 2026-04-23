document.addEventListener('DOMContentLoaded', function () {
    // Function to handle tab switching
    const tabLinks = document.querySelectorAll('.nav-tabs .nav-link');

    tabLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            // Remove active class from all tabs
            tabLinks.forEach(link => link.classList.remove('active'));

            // Hide all tab content
            const tabContents = document.querySelectorAll('.tab-pane');
            tabContents.forEach(content => content.classList.remove('active', 'show'));

            // Add active class to the clicked tab
            this.classList.add('active');

            // Show the corresponding tab content
            const target = this.getAttribute('href');
            document.querySelector(target).classList.add('active', 'show');
        });
    });
});