// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAC9oB-RO5zt3JhLHaUVGXvMelK9Xbtzd0",
  authDomain: "find-me-d602f.firebaseapp.com",
  projectId: "find-me-d602f",
  storageBucket: "find-me-d602f.firebasestorage.app",
  messagingSenderId: "634021763989",
  appId: "1:634021763989:web:465a76cce74eadaec3349c",
  measurementId: "G-JH4ERPJNKZ"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
var map, carMarker, userMarker;
var watchID = null;

function initMap(lat, lon) {
    lat = lat || 10;
    lon = lon || 10;
    
    map = L.map('map').setView([lat, lon], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    userMarker = L.marker([lat, lon], { color: "blue" })
        .addTo(map)
        .bindPopup("Your Live Location")
        .openPopup();
}

function updateMap(lat, lon, isUser) {
    if (isUser) {
        if (userMarker) {
            userMarker.setLatLng([lat, lon]).bindPopup("Your Live Location").openPopup();
        }
    } else {
        if (carMarker) {
            carMarker.setLatLng([lat, lon]).bindPopup("Parked Car Location").openPopup();
        }
    }
}

function markCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                var timestamp = new Date().toLocaleString();
                var floor = document.getElementById("floor").value || "Not specified";
                var parkingLot = document.getElementById("parking-lot").value || "Not specified";

                document.getElementById("latitude").innerText = lat;
                document.getElementById("longitude").innerText = lon;
                document.getElementById("timestamp").innerText = timestamp;
                document.getElementById("floor-display").innerText = floor;
                document.getElementById("parking-lot-display").innerText = parkingLot;

                localStorage.setItem("carLocation", JSON.stringify({ lat: lat, lon: lon, timestamp: timestamp, floor: floor, parkingLot: parkingLot }));

                if (!carMarker) {
                    carMarker = L.marker([lat, lon], { color: "red" }).addTo(map);
                }
                updateMap(lat, lon, false);
            },
            function (error) {
                alert("❌ Error fetching location. Enable GPS.");
                console.error("Geolocation error:", error);
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

function findMyCar() {
    var savedLocation = JSON.parse(localStorage.getItem("carLocation"));

    if (savedLocation) {
        var lat = savedLocation.lat;
        var lon = savedLocation.lon;
        var timestamp = savedLocation.timestamp;
        var floor = savedLocation.floor;
        var parkingLot = savedLocation.parkingLot;

        document.getElementById("latitude").innerText = lat;
        document.getElementById("longitude").innerText = lon;
        document.getElementById("timestamp").innerText = timestamp;
        document.getElementById("floor-display").innerText = floor;
        document.getElementById("parking-lot-display").innerText = parkingLot;

        if (!carMarker) {
            carMarker = L.marker([lat, lon], { color: "red" }).addTo(map);
        }
        updateMap(lat, lon, false);
        startRealTimeTracking();
    } else {
        alert("❌ No car location found! Please mark your location first.");
    }
}

function startRealTimeTracking() {
    if (navigator.geolocation) {
        watchID = navigator.geolocation.watchPosition(
            function (position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                updateMap(lat, lon, true);
            },
            function (error) {
                alert("❌ Error tracking location.");
                console.error("Tracking error:", error);
            },
            { enableHighAccuracy: true, maximumAge: 0 }
        );
    }
}

window.onload = function () {
    initMap();
};

async function saveLocation() {
    const timestampinput = new Date().toLocaleString();
    const floorinput = document.getElementById("floor").value || "Not specified";
    const parkingLotinput = document.getElementById("parking-lot").value || "Not specified";//Add location 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log(lat, lon);
                if(lat && lon) {
                    try{
                    await db.collection("location").add({
                        latitude:lat,
                        longitude:lon,
                        floor: floorinput,
                        parkingLot: parkingLotinput,
                        timestamp: timestampinput
                    });
                
                                    
                    alert("location is added successfully");
                    }
                    catch(error) {
                        console.error("error adding location",error);
                    }
                }else{
                        alert("please enter lat and lon)");
                    }
                
            },
            function (error) {
                alert("❌ Error fetching location. Enable GPS.");
                console.error("Geolocation error:", error);
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
};