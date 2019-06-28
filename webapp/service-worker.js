const CACHE_NAME = "version5";
const FILES_TO_CACHE = [
	"/",
	"/index.html",
	"/assets/images/image-144.png",
	"/css/styles.css",
	"/model/todoitems.json",
	'/resources/sap-ui-custom.js',
	'/resources/sap/m/themes/sap_fiori_3/library.css',
	'/resources/sap/m/messagebundle_en.properties',
	'/resources/sap/ui/core/messagebundle_en.properties',
	"/resources/sap/ui/core/themes/base/fonts/SAP-icons.woff2",
	"/resources/sap/ui/core/themes/sap_fiori_3/fonts/72-Regular.woff2",
	"/resources/sap/ui/core/themes/sap_fiori_3/library.css",
	"/thirdparty/pouchdb-7.1.1.min.js",
	"/web-manifest.json",
];

self.importScripts('/thirdparty/pouchdb-7.1.1.min.js');

self.addEventListener("install", function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log("[ServiceWorker] Pre-caching offline page");
			return cache.addAll(FILES_TO_CACHE);
		})
	);
});

self.addEventListener("fetch", function (event) {
	event.respondWith(
		caches.match(event.request)
			.then(function (response) {
					// Cache hit - return response
					if (response) {
						return response;
					}

					return fetch(event.request).then(async function (response) {
						if (event.request.url.startsWith('chrome-extension')) {
							return response;
						}

						const clonedResponse = response.clone();
						caches.open(CACHE_NAME).then(function (cache) {
							cache.put(event.request, clonedResponse);
						});
						return response;
					});
				}
			)
	);
});

// cleanup old caches
self.addEventListener("activate", function (event) {
	var cacheWhitelist = [CACHE_NAME];

	event.waitUntil(
		caches.keys().then(function (keyList) {
			return Promise.all(keyList.map(function (key) {
				if (cacheWhitelist.indexOf(key) === -1) {
					return caches.delete(key);
				}
			}));
		})
	);
});

self.addEventListener('sync', function(event) {
	if (event.tag == 'syncTodos') {
		event.waitUntil(PouchDB.sync('todos', 'http://localhost:5984/todos'));
	}
});
