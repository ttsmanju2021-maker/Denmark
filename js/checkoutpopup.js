    // This function should be called from your existing "Start Design" button
    // Add onclick="goToPopup()" to your existing button in tombstone.html
    function goToPopup() {
      // Show loading animation
      document.getElementById('loadingContainer').style.display = 'flex';

      // After 1.5 seconds, hide loading and show cookie popup
      setTimeout(() => {
        document.getElementById('loadingContainer').style.display = 'none';
        document.getElementById('cookieOverlay').classList.add('show');
      }, 1500);
    }

    // Toggle cookie details
    function toggleDetails() {
      const content = document.getElementById('detailsContent');
      const icon = document.getElementById('detailsIcon');
      const text = document.getElementById('detailsText');

      content.classList.toggle('active');

      if (content.classList.contains('active')) {
        icon.textContent = 'expand_less';
        text.textContent = 'Hide Details';
      } else {
        icon.textContent = 'expand_more';
        text.textContent = 'Show Details';
      }
    }

    // Close popup - close icon clicked
    function closePopup() {
      document.getElementById('cookieOverlay').classList.remove('show');
      console.log('Popup closed');
    }

    // Show success message
    function showSuccessMessage() {
      const msg = document.getElementById('successMessage');
      msg.classList.add('show');
      setTimeout(() => {
        msg.classList.remove('show');
      }, 3000);
    }

    // Accept All - redirect to formpage
    function acceptAll() {
      document.getElementById('performance').checked = true;
      document.getElementById('targeting').checked = true;
      document.getElementById('functionality').checked = true;

      console.log('Accepted all cookies - redirecting to form page');

      // Close popup
      document.getElementById('cookieOverlay').classList.remove('show');

      // Show success message
      showSuccessMessage();

      // Show loading animation
      document.getElementById('loadingContainer').style.display = 'flex';

      // Redirect to formpage after loading animation
      setTimeout(() => {
        window.location.href = 'formpage.html';
      }, 1000);
    }

    // Reject All - close popup
    function rejectAll() {
      document.getElementById('performance').checked = false;
      document.getElementById('targeting').checked = false;
      document.getElementById('functionality').checked = false;

      console.log('Rejected cookies - popup closed');

      // Close popup
      document.getElementById('cookieOverlay').classList.remove('show');
      showSuccessMessage();
    }

    
  