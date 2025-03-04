// Sample Data
let staff = [
  { name: "Dr. Smith", role: "Doctor", availability: "Available" },
  { name: "Nurse Jane", role: "Nurse", availability: "Unavailable" },
];

let rosters = [];
let notifications = [];

// Toggle Sections
document.querySelectorAll("nav ul li a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll("section").forEach((section) => {
      section.classList.remove("active");
    });
    document.querySelector(link.getAttribute("href")).classList.add("active");
  });
});

// Load Staff Data
function loadStaff() {
  const tbody = document.querySelector("#staff-table tbody");
  tbody.innerHTML = "";
  staff.forEach((member) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${member.name}</td>
        <td>${member.role}</td>
        <td>${member.availability}</td>
      `;
    tbody.appendChild(row);
  });
}

// Save Roster
document.getElementById("roster-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const rosterName = document.getElementById("roster-name").value;
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;
  const department = document.getElementById("department").value;

  rosters.push({ rosterName, startDate, endDate, department });
  notifications.push(`New roster "${rosterName}" created for ${department}`);
  updateNotifications();
  alert(
    `Roster "${rosterName}" saved for ${department} from ${startDate} to ${endDate}`
  );
});

// Update Notifications
function updateNotifications() {
  const notificationList = document.getElementById("notification-list");
  notificationList.innerHTML = "";
  notifications.forEach((notification) => {
    const li = document.createElement("li");
    li.textContent = notification;
    notificationList.appendChild(li);
  });
}

// Generate Report
document.getElementById("generate-report-btn").addEventListener("click", () => {
  const reportType = document.getElementById("report-type").value;
  const reportOutput = document.getElementById("report-output");
  reportOutput.innerHTML = `<p>Generated ${reportType} report.</p>`;
});

// Initialize
loadStaff();
updateNotifications();
