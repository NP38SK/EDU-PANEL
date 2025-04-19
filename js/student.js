// js/student.js
// Check authentication
window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "student") {
        window.location.href = "index.html";
    }
    loadStudentInfo();
};

// Load student information
function loadStudentInfo() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    document.getElementById("studentName").textContent = currentUser.name || currentUser.email;
    document.getElementById("studentEmail").textContent = currentUser.email;
    document.getElementById("studentRole").textContent = currentUser.role;
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", function() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
});