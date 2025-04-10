// Service Worker Registration Script

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('Service Worker update found!');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is installed, but waiting to activate
              if (confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });

  // Handle service worker updates
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

// Function to check if the app is installed (in standalone mode)
function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone || // for iOS
         document.referrer.includes('android-app://');
}

// Expose functions to the global scope
window.pwaUtils = {
  isAppInstalled,

  // Function to prompt the user to install the app
  showInstallPrompt: () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();

      window.deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }

        window.deferredPrompt = null;
      });
    }
  }
};

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();

  // Stash the event so it can be triggered later
  window.deferredPrompt = e;

  // Notify the app that the app can be installed
  const event = new CustomEvent('pwaInstallable');
  window.dispatchEvent(event);
});

// Listen for the appinstalled event
window.addEventListener('appinstalled', (e) => {
  console.log('PWA was installed');

  // Notify the app that the app was installed
  const event = new CustomEvent('pwaInstalled');
  window.dispatchEvent(event);

  // Clear the deferredPrompt
  window.deferredPrompt = null;
});
