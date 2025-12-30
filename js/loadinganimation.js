
    // Optional: Add percentage counter
    let percent = 0;
    let percentInterval;

    // Start percentage counter when loading is shown
    function startPercentageCounter() {
      percent = 0;
      percentInterval = setInterval(() => {
        percent = (percent + 1) % 101;
        const percentElement = document.querySelector('.percentage');
        if (percentElement) {
          percentElement.textContent = percent + '%';
        }
      }, 15);
    }

    // Stop percentage counter
    function stopPercentageCounter() {
      if (percentInterval) {
        clearInterval(percentInterval);
      }
    }

    // YOUR EXISTING JAVASCRIPT FUNCTIONS

    // This function should be called from your existing "Start Design" button
    function goToPopup() {
      // Show loading animation
      document.getElementById('loadingContainer').style.display = 'flex';
      startPercentageCounter();

      // After 1.5 seconds, hide loading and show cookie popup
      setTimeout(() => {
        document.getElementById('loadingContainer').style.display = 'none';
        stopPercentageCounter();
        document.getElementById('cookieOverlay').classList.add('show');
      }, 1500);
    }

    // Toggle cookie details
    function toggleDetails() {
      const content = document.getElementById('detailsContent');
      const icon = document.getElementById('detailsIcon');
      const text = document.getElementById('detailsText');

      if (content) content.classList.toggle('active');

      if (content && content.classList.contains('active')) {
        if (icon) icon.textContent = '⮙';
        if (text) text.textContent = 'Hide Details';
      } else {
        if (icon) icon.textContent = '▽';
        if (text) text.textContent = 'Show Details';
      }
    }

    // Close popup - close icon clicked
    function closePopup() {
      const overlay = document.getElementById('cookieOverlay');
      if (overlay) overlay.classList.remove('show');
      console.log('Popup closed');
    }

    // Show success message
    function showSuccessMessage() {
      const msg = document.getElementById('successMessage');
      if (msg) {
        msg.classList.add('show');
        setTimeout(() => {
          msg.classList.remove('show');
        }, 3000);
      }
    }

    // Accept All - redirect to formpage
    function acceptAll() {
      const performance = document.getElementById('performance');
      const targeting = document.getElementById('targeting');
      const functionality = document.getElementById('functionality');
      
      if (performance) performance.checked = true;
      if (targeting) targeting.checked = true;
      if (functionality) functionality.checked = true;

      console.log('Accepted all cookies - redirecting to form page');

      // Close popup
      const overlay = document.getElementById('cookieOverlay');
      if (overlay) overlay.classList.remove('show');

      // Show success message
      showSuccessMessage();

      // Show loading animation
      document.getElementById('loadingContainer').style.display = 'flex';
      startPercentageCounter();

      // Redirect to formpage after loading animation
      setTimeout(() => {
        window.location.href = 'formpage.html';
      }, 1000);
    }

    // Reject All - close popup
    function rejectAll() {
      const performance = document.getElementById('performance');
      const targeting = document.getElementById('targeting');
      const functionality = document.getElementById('functionality');
      
      if (performance) performance.checked = false;
      if (targeting) targeting.checked = false;
      if (functionality) functionality.checked = false;

      console.log('Rejected cookies - popup closed');

      // Close popup
      const overlay = document.getElementById('cookieOverlay');
      if (overlay) overlay.classList.remove('show');
      
      showSuccessMessage();
    }
  