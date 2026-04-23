const progressBar = document.querySelector('.progress-bar');
let progress = 0;

const interval = setInterval(() => {
  progress += 1;
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute('aria-valuenow', progress);

  if (progress >= 100) {
    clearInterval(interval);
    window.location.href = "dashboard.html"; // Replace with your actual homepage
  }
}, 30); // Adjust speed as needed
