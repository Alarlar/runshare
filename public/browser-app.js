// === INITIALIZATION ===
let map, polyline;
let routePoints = [];
let totalDistance = 0;
let currentType = "run";
let isTracking = false; // Состояние GPS
let watchId = null; // ID процесса слежения

const feed = document.getElementById("friendsFeed");
const addRunBtn = document.getElementById("addRunBtn");
const startTrackBtn = document.getElementById("startTrack");
const logoutBtn = document.getElementById("logoutBtn");
const milesDisplay = document.getElementById("miles");
const activeTypeDisplay = document.getElementById("activeType");
const authModal = document.getElementById("authModal");

// === MAP SETUP ===
map = L.map("map", { zoomControl: false }).setView([37.7749, -122.4194], 13);
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
).addTo(map);

polyline = L.polyline([], { color: "#00f2ff", weight: 4 }).addTo(map);

// Ручное рисование (клик на карту)
map.on("click", (e) => {
  if (isTracking) return; // Запрещаем кликать, если идет авто-трекинг
  const { lat, lng } = e.latlng;
  routePoints.push([lat, lng]);
  polyline.setLatLngs(routePoints);
  updateStats();
});

function updateStats() {
  if (routePoints.length < 2) return;
  totalDistance = 0;
  for (let i = 1; i < routePoints.length; i++) {
    const p1 = L.latLng(routePoints[i - 1]);
    const p2 = L.latLng(routePoints[i]);
    totalDistance += p1.distanceTo(p2) / 1609.34;
  }
  milesDisplay.innerText = totalDistance.toFixed(2);
}

// === GPS LIVE TRACKING (НОВОЕ) ===
startTrackBtn.onclick = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    authModal.style.display = "flex";
    return;
  }

  if (!isTracking) {
    // СТАРТ
    if (!navigator.geolocation)
      return alert("GPS not supported by your browser");

    isTracking = true;
    resetMap();
    startTrackBtn.innerText = "STOP & SAVE";
    startTrackBtn.style.background = "#ff4444";

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPoint = [latitude, longitude];

        routePoints.push(newPoint);
        polyline.setLatLngs(routePoints);
        map.setView(newPoint, 16); // Следим за атлетом
        updateStats();
      },
      (err) => alert("GPS Error: " + err.message),
      { enableHighAccuracy: true, distanceFilter: 5 }
    );
  } else {
    // СТОП
    isTracking = false;
    startTrackBtn.innerText = "START GPS TRACKING";
    startTrackBtn.style.background = "#00ff88";
    navigator.geolocation.clearWatch(watchId);

    // Автоматически вызываем сохранение после остановки
    saveCurrentActivity();
  }
};

// === SAVE LOGIC (Вынесена в отдельную функцию) ===
async function saveCurrentActivity() {
  if (routePoints.length < 2) return alert("No distance recorded");

  const res = await fetch("/api/v1/activities", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      type: currentType,
      distance: +totalDistance.toFixed(2),
      points: routePoints,
    }),
  });

  if (res.ok) {
    alert("Activity Saved!");
    resetMap();
    fetchActivities();
  } else {
    alert("Error saving activity");
  }
}

addRunBtn.onclick = () => {
  const token = localStorage.getItem("token");
  if (!token) return (authModal.style.display = "flex");
  saveCurrentActivity();
};

// === ОСТАЛЬНЫЕ ФУНКЦИИ (БЕЗ ИЗМЕНЕНИЙ) ===
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

async function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    logoutBtn.style.display = "none";
    addRunBtn.innerText = "LOGIN TO SAVE";
    return;
  }
  try {
    const res = await fetch("/api/v1/users/me", { headers: getHeaders() });
    if (res.ok) {
      logoutBtn.style.display = "block";
      addRunBtn.innerText = "SAVE MANUALLY";
    } else {
      localStorage.removeItem("token");
      checkAuth();
    }
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("submitLogin").onclick = async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const res = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    authModal.style.display = "none";
    checkAuth();
    fetchActivities();
  } else {
    alert(data.msg || "Login failed");
  }
};

document.getElementById("closeModal").onclick = () =>
  (authModal.style.display = "none");
logoutBtn.onclick = () => {
  localStorage.removeItem("token");
  window.location.reload();
};

async function fetchActivities() {
  try {
    const res = await fetch("/api/v1/activities");
    const data = await res.json();
    const activities = data.activities || [];
    feed.innerHTML = "";
    activities.forEach((act) => {
      const icons = { run: "🏃", walk: "🚶", cycle: "🚲", ski: "⛷️" };
      const card = document.createElement("div");
      card.style.cssText = `cursor:pointer; background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; margin-bottom:8px; border-left:3px solid #00f2ff; color:white; position:relative;`;
      const date = new Date(act.createdAt).toLocaleDateString();
      card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span>${icons[act.type] || "🏁"} <b>${act.distance.toFixed(
        2
      )}</b> mi by <strong>${act.user?.name || "User"}</strong></span>
                    <small style="opacity:.5; margin-right:25px;">${date}</small>
                </div>
                <button class="del-btn" style="position:absolute; top:10px; right:10px; background:#ff4444; color:white; border:none; padding:2px 8px; border-radius:4px; cursor:pointer;">✕</button>
            `;
      card.onclick = (e) => {
        if (e.target.classList.contains("del-btn")) deleteActivity(act._id);
        else showActivityOnMap(act);
      };
      feed.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

async function deleteActivity(id) {
  if (!confirm("Delete?")) return;
  const res = await fetch(`/api/v1/activities/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (res.ok) fetchActivities();
}

function resetMap() {
  routePoints = [];
  polyline.setLatLngs([]);
  totalDistance = 0;
  milesDisplay.innerText = "0.00";
}

document.getElementById("clearRoute").onclick = resetMap;

function showActivityOnMap(act) {
  if (!act.path || act.path.length === 0) return;
  polyline.setLatLngs(act.path);
  map.fitBounds(polyline.getBounds());
}

document.querySelectorAll(".type-btn").forEach((btn) => {
  btn.onclick = () => {
    document
      .querySelectorAll(".type-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentType = btn.dataset.type;
    activeTypeDisplay.innerText = currentType.toUpperCase();
  };
});

checkAuth();
fetchActivities();
