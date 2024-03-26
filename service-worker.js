var staticCacheName = "Anish";
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(["/index.html"]);
    })
  );
});
self.addEventListener("fetch", function (event) {
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
self.addEventListener("sync", (event) => {
  if (event.tag === "syncMessage") {
    console.log("Sync successful!");
  }
});
self.addEventListener("push", function (event) {
  if (event && event.data) {
    var data = event.data.json();
    if (data.method == "pushMessage") {
      console.log("Push notification sent");
      // Request notification permission
      self.registration.showNotification("My shopping", {
        body: data.message,
      }).catch(function(err) {
        console.error('Error displaying notification:', err);
        if (Notification.permission === 'denied') {
          console.warn('Notification permission is denied by the user.');
          return;
        }
        // Otherwise, request permission
        Notification.requestPermission().then(function(permission) {
          if (permission === 'granted') {
            // Try showing the notification again
            return self.registration.showNotification("My shopping", {
              body: data.message,
            });
          } else {
            console.warn('User denied notification permission');
          }
        }).catch(function(err) {
          console.error('Error requesting notification permission:', err);
        });
      });
    }
  }
});



var checkResponse = function (request) {
  return new Promise(function (fulfill, reject) {
    fetch(request).then(function (response) {
      if (response.status !== 404) {
        fulfill(response);
      } else {
        reject();
      }
    }, reject);
  });
};
