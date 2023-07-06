'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"index.html": "a1785a6e25ec677504e764d34d427a3f",
"/": "a1785a6e25ec677504e764d34d427a3f",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"main.dart.js": "e6016c1f12ff6c2f703a784b49f116fd",
"version.json": "ed2980b11e7a5b04ad6303af9e6a0b79",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"manifest.json": "c70fadc9bfe96f44925ce682675abc08",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/shaders/super_crt.glsl": "ac4698087d439507c96e67217c956765",
"assets/google_fonts/Bungee-Regular.ttf": "5eae7e3db643f2ee5bf10a658977fbe6",
"assets/google_fonts/MajorMonoDisplay-Regular.ttf": "e7acc228230d22332855765872b0a3bf",
"assets/google_fonts/BungeeShade-Regular.ttf": "89c481ef65f7e4b061e9ea271f9d3b41",
"assets/AssetManifest.bin": "6a4bfc9ac516585839678343d3e41f16",
"assets/AssetManifest.json": "5a9bf4865e24c15e737793783c50de9e",
"assets/NOTICES": "8bd5578267708a3b338637086424a3a8",
"assets/FontManifest.json": "d751713988987e9331980363e24189ce",
"assets/assets/audio/Action_-_Midnight_Cruisers.wav": "4318df32d1d76334aab386a547bb0332",
"assets/assets/audio/Menu_-_Floating_Point.wav": "3b84356c90b6da7c4da8cb68b6c50fd6",
"assets/assets/audio/LightRunners.wav": "da00e0a0cf497d93ca8be912de58b2ef",
"assets/assets/images/logo_writing.png": "3ce741b521f3de0f9d2d850ae02b9978",
"assets/assets/images/qr.png": "67d06e1bffa1bd0d45e6b8c1599293ec",
"assets/assets/images/powerups/widgetbook.png": "0b0c9a952defcf4b3daf75e0b51a0f3a",
"assets/assets/images/powerups/melos.png": "944ddd38ac46952a295171dcf2646af9",
"assets/assets/images/powerups/invertase.png": "95cf22e361c6de58d74aaa5b9e823678",
"assets/assets/images/powerups/flame.png": "954516e8356e4dacd6b6d1244832a811",
"assets/assets/images/gold.png": "6552a878bddfb07639264675581da11b",
"assets/assets/images/liltex_3.jpg": "d74eeaaa4938509f284fce4c588c777b",
"assets/assets/images/ships/crimson_fury.png": "96c99755e226053eff1fedaa81af8980",
"assets/assets/images/ships/purple_haze.png": "a014fdf53675f990caf531608f1329d7",
"assets/assets/images/ships/star_chaser.png": "f9caf09d526b078f041fc1212ecdbe59",
"assets/assets/images/ships/netunos_wrath.png": "8e5712d2b359228188b450738a421c9b",
"assets/assets/images/ships/silver_bullet.png": "1ca46a85e20759769a3b40cc4c99e26d",
"assets/assets/images/ships/photon_raider.png": "62bd13196da6e245075f61c40624560f",
"assets/assets/images/ships/dagger_of_venus.png": "4f2a60706433d142d172c3233d37e455",
"assets/assets/images/ships/andromedas_revenge.png": "7bef5520ccd924ee6970f3e8f9e6db0d",
"assets/assets/images/logo_background.png": "c3772747954e6c2796a6adcfbb46f2b9",
"assets/assets/images/silver.png": "29023cd9c0ac123daf463b24524fcc6a",
"assets/assets/images/bg.png": "b9f0c1a2bae11678c73aaa533e536767",
"assets/assets/images/lightrunners.png": "11a5667e67e04bf605da355378fe47ae",
"assets/assets/images/bronze.png": "cc776e0054e5f158b16ea1e3f59be649",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
