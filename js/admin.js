// js/admin.js
// Check authentication
window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
        window.location.href = "index.html";
    }
    loadUsers();
};

// Load users
function loadUsers() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const usersList = document.getElementById("usersList");
    usersList.innerHTML = "";
    
    users.forEach((user, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.name || user.email}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="action-btn edit-btn" onclick="openEditModal(${index})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteUser(${index})">Delete</button>
            </td>
        `;
        usersList.appendChild(row);
    });
}

// Open edit modal
function openEditModal(index) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users[index];
    
    document.getElementById("editIndex").value = index;
    document.getElementById("editName").value = user.name || "";
    document.getElementById("editEmail").value = user.email;
    document.getElementById("editRole").value = user.role;
    
    document.getElementById("editModal").style.display = "block";
}

// Close modal
const closeModal = document.getElementsByClassName("close")[0];
closeModal.onclick = function() {
    document.getElementById("editModal").style.display = "none";
};

// Click outside modal to close
window.onclick = function(event) {
    const modal = document.getElementById("editModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Edit user
document.getElementById("editForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const index = document.getElementById("editIndex").value;
    const name = document.getElementById("editName").value.trim();
    const email = document.getElementById("editEmail").value.toLowerCase();
    const role = document.getElementById("editRole").value;
    
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Check for duplicate email (excluding current user)
    const emailExists = users.some((u, i) => u.email === email && i != index);
    if (emailExists) {
        showMessage("message", "Email already registered.");
        return;
    }
    
    // Update user
    users[index] = {
        ...users[index],
        name,
        email,
        role
    };
    
    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("editModal").style.display = "none";
    loadUsers();
    showMessage("message", "User updated successfully.", false);
});

// Delete user
function deleteUser(index) {
    if (confirm("Are you sure you want to delete this user?")) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        
        // Prevent admin from deleting themselves
        if (users[index].email === currentUser.email) {
            showMessage("message", "Cannot delete your own account.");
            return;
        }
        
        users.splice(index, 1);
        localStorage.setItem("users", JSON.stringify(users));
        loadUsers();
        showMessage("message", "User deleted successfully.", false);
    }
}

// Message display
function showMessage(elementId, message, isError = true) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.className = isError ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    setTimeout(() => messageDiv.textContent = '', 3000);
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", function() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
});