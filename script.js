const demoCustomers = [
  {
    id: 1,
    name: "Aisha Bello",
    phone: "0803 123 4567",
    gender: "Female",
    category: "Dress",
    date: "Today",
    initial: "A",
    measurements: {
      Bust: "34",
      Waist: "28",
      Hip: "38",
      Shoulder: "15",
      Sleeve: "24",
      Length: "58"
    },
    notes: "Prefers a comfortable fit. Gold zipper."
  },
  {
    id: 2,
    name: "Tunde Adeyemi",
    phone: "0812 445 7788",
    gender: "Male",
    category: "Native wear",
    date: "Yesterday",
    initial: "T",
    measurements: {
      Chest: "42",
      Shoulder: "18",
      Sleeve: "25",
      Length: "31",
      Waist: "36",
      Trouser: "42"
    },
    notes: "Keep native top slightly loose."
  },
  {
    id: 3,
    name: "Mariam Yusuf",
    phone: "0901 778 2345",
    gender: "Female",
    category: "Gown",
    date: "Sep 29",
    initial: "M",
    measurements: {
      Bust: "36",
      Waist: "30",
      Hip: "40",
      Shoulder: "14.5",
      Sleeve: "23",
      Length: "60"
    },
    notes: ""
  },
  {
    id: 4,
    name: "David Okafor",
    phone: "0705 222 1100",
    gender: "Male",
    category: "Shirt",
    date: "Sep 27",
    initial: "D",
    measurements: {
      Chest: "40",
      Shoulder: "17",
      Sleeve: "24",
      Length: "29",
      Waist: "34",
      Neck: "16"
    },
    notes: "French cuff."
  }
];

let customers =
  JSON.parse(localStorage.getItem("tailorbook_customers") || "null") ||
  demoCustomers;
let selectedCustomer = null;
let currentTemplate = "dress";

const templates = {
  dress: ["Bust", "Waist", "Hip", "Shoulder", "Sleeve", "Length"],
  native: [
    "Chest",
    "Shoulder",
    "Sleeve",
    "Buba Length",
    "Trouser Waist",
    "Trouser Length"
  ],
  shirt: ["Neck", "Chest", "Shoulder", "Sleeve", "Shirt Length", "Waist"],
  trouser: [
    "Waist",
    "Hip",
    "Thigh",
    "Knee",
    "Inseam",
    "Trouser Length"
  ]
};

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function saveLocal() {
  localStorage.setItem("tailorbook_customers", JSON.stringify(customers));
}

function showToast(
  title = "Saved",
  msg = "Your customer was added successfully."
) {
  $("#toast").querySelector("b").textContent = title;
  $("#toast").querySelector("small").textContent = msg;
  $("#toast").classList.add("show");
  setTimeout(() => $("#toast").classList.remove("show"), 3000);
}

function avatarHTML(c) {
  return c.photo
    ? `<img src="${c.photo}" alt="">`
    : c.initial || c.name[0];
}

function renderRecent() {
  $("#recentCustomers").innerHTML = customers
    .slice(0, 5)
    .map(
      (c) => `
    <div class="customer-row" data-customer="${c.id}">
      <div class="customer-avatar">${avatarHTML(c)}</div>
      <div class="customer-info">
        <b>${c.name}</b>
        <small>${c.category} · ${c.phone || "No phone"}</small>
      </div>
      <time>${c.date || "Today"}</time>
    </div>`
    )
    .join("");

  $$("#recentCustomers .customer-row").forEach(
    (x) => (x.onclick = () => openProfile(+x.dataset.customer))
  );
}

function renderCustomers(filter = "") {
  const q = filter.trim().toLowerCase();
  const list = customers.filter((c) =>
    (c.name + " " + (c.phone || "")).toLowerCase().includes(q)
  );

  $("#customerGrid").innerHTML = list.length
    ? list
        .map(
          (c) => `
    <article class="customer-card" data-customer="${c.id}">
      <div class="card-top">
        <div class="customer-avatar">${avatarHTML(c)}</div>
        <div>
          <h3>${c.name}</h3>
          <p>${c.phone || "No phone number"}</p>
        </div>
      </div>
      <div class="card-meta">
        <span class="pill">${c.category}</span>
        <span class="pill">${Object.keys(c.measurements || {}).length} measurements</span>
        <span class="pill">${c.date || "Today"}</span>
      </div>
    </article>`
        )
        .join("")
    : `<div class="panel" style="grid-column:1/-1;text-align:center;padding:50px">
        <h3>No customer found</h3>
        <p class="muted" style="margin-top:6px">Try another name or add a new customer.</p>
      </div>`;

  $$("#customerGrid .customer-card").forEach(
    (x) => (x.onclick = () => openProfile(+x.dataset.customer))
  );
}

function updateStats() {
  $("#totalCustomers").textContent = customers.length;
  $("#totalMeasurements").textContent = customers.reduce(
    (n, c) => n + Object.keys(c.measurements || {}).length,
    0
  );
}

function renderFields() {
  $("#measurementFields").innerHTML = templates[currentTemplate]
    .map(
      (name) => `
    <label>
      ${name}
      <input data-measure="${name}" placeholder="—">
    </label>`
    )
    .join("");
}

function populateProfile(c) {
  $("#profileAvatar").innerHTML = avatarHTML(c);
  $("#profileName").textContent = c.name;
  $("#profileMeta").textContent = `${c.phone || "No phone"} · ${c.category}`;
  $("#profileDate").textContent = `Saved ${c.date || "today"}`;
  $("#profileNotes").textContent = c.notes || "No notes yet.";
  $("#historyDate").textContent = c.date || "Today";
  $("#profileMeasurements").innerHTML = Object.entries(
    c.measurements || {}
  )
    .map(
      ([k, v]) => `
    <div class="measure-card">
      <span>${k}</span>
      <b>${v || "—"}</b>
      <small>in</small>
    </div>`
    )
    .join("");
}

function openProfile(id) {
  selectedCustomer = customers.find((c) => c.id === id);
  if (!selectedCustomer) return;
  populateProfile(selectedCustomer);
  showView("profile");
}

function showView(name) {
  $$(".view").forEach((v) => v.classList.remove("active"));
  $(`#view-${name}`).classList.add("active");
  $$(".nav-item").forEach((n) =>
    n.classList.toggle("active", n.dataset.view === name)
  );
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (name === "customers") {
    renderCustomers($("#searchInput")?.value || "");
  }
}

function createCustomer(e) {
  e.preventDefault();

  const name = $("#customerName").value.trim();
  const measurements = {};

  $$('[data-measure]').forEach((i) => {
    if (i.value.trim()) measurements[i.dataset.measure] = i.value.trim();
  });

  const c = {
    id: Date.now(),
    name,
    phone: $("#customerPhone").value.trim(),
    gender: $("#customerGender").value,
    category: $("#customerCategory").value,
    date: "Today",
    initial: name[0]?.toUpperCase() || "T",
    measurements,
    notes: $("#customerNotes").value.trim(),
    photo: $("#photoPreview").dataset.photo || ""
  };

  customers.unshift(c);
  saveLocal();
  updateStats();
  renderRecent();
  renderCustomers();

  e.target.reset();
  $("#photoPreview").style.backgroundImage = "";
  $("#photoPreview").classList.remove("has-photo");
  delete $("#photoPreview").dataset.photo;

  renderFields();
  showToast("Customer saved", "The measurement record is now in your book.");
  openProfile(c.id);
}

function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("tailorbook_theme", theme);
}

const savedTheme = localStorage.getItem("tailorbook_theme");
if (savedTheme) setTheme(savedTheme);

$$("[data-view]").forEach((btn) =>
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    showView(btn.dataset.view);
  })
);

$("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  showView("dashboard");
  showToast("Welcome back", "Demo mode is ready to explore.");
});

$("#demoBtn").onclick = () => {
  showView("dashboard");
  showToast("Demo opened", "You can explore the complete interface.");
};

$("#showPass").onclick = () => {
  const i = $("#loginPassword");
  i.type = i.type === "password" ? "text" : "password";
  $("#showPass").textContent = i.type === "password" ? "Show" : "Hide";
};

$("#themeQuickBtn").onclick = () => showView("themes");

$("#profileBtn").onclick = () => {
  showView("login");
  showToast("Signed out", "You have been signed out of TailorBook.");
};

$("#customerForm").addEventListener("submit", createCustomer);
$("#searchInput").addEventListener("input", (e) =>
  renderCustomers(e.target.value)
);

$("#customerPhoto").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    $("#photoPreview").dataset.photo = ev.target.result;
    $("#photoPreview").style.backgroundImage = `url("${ev.target.result}")`;
    $("#photoPreview").classList.add("has-photo");
  };
  reader.readAsDataURL(file);
});

$$(".template").forEach(
  (btn) =>
    (btn.onclick = () => {
      $$(".template").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentTemplate = btn.dataset.template;
      renderFields();
    })
);

$$("[data-theme-choice]").forEach(
  (btn) =>
    (btn.onclick = () => {
      setTheme(btn.dataset.themeChoice);
      showToast("Theme applied", "Your workspace has been updated.");
    })
);

$("#accentPicker").addEventListener("input", (e) => {
  document.documentElement.style.setProperty("--accent", e.target.value);
  $("#accentValue").textContent = e.target.value.toUpperCase();
  localStorage.setItem("tailorbook_accent", e.target.value);
});

const accent = localStorage.getItem("tailorbook_accent");
if (accent) {
  document.documentElement.style.setProperty("--accent", accent);
  $("#accentPicker").value = accent;
  $("#accentValue").textContent = accent.toUpperCase();
}

$("#newMeasurementBtn").onclick = () => {
  showView("add");
  $("#customerName").value = selectedCustomer?.name || "";
  $("#customerPhone").value = selectedCustomer?.phone || "";
  $("#customerCategory").value = selectedCustomer?.category || "Dress";
};

$("#whatsappBtn").onclick = () => {
  if (selectedCustomer?.phone) {
    window.open(
      "https://wa.me/" + selectedCustomer.phone.replace(/\D/g, ""),
      "_blank"
    );
  } else {
    showToast("No phone number", "Add a phone number to use WhatsApp.");
  }
};

$("#editProfileBtn").onclick = () => {
  if (!selectedCustomer) return;

  showView("add");
  $("#customerName").value = selectedCustomer.name;
  $("#customerPhone").value = selectedCustomer.phone || "";
  $("#customerGender").value = selectedCustomer.gender || "Female";
  $("#customerCategory").value = selectedCustomer.category || "Dress";
  $("#customerNotes").value = selectedCustomer.notes || "";
  renderFields();

  Object.entries(selectedCustomer.measurements || {}).forEach(([k, v]) => {
    const i = document.querySelector(`[data-measure="${CSS.escape(k)}"]`);
    if (i) i.value = v;
  });
};

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    showView("customers");
    setTimeout(() => $("#searchInput").focus(), 100);
  }
});

renderFields();
renderRecent();
renderCustomers();
updateStats();
