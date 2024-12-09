import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
  Search,
  UserPlus,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  Filter,
  Menu,
  Grid,
  X,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import styles from "../styles/UserManagement.module.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [currentPage] = useState(1);
  const [totalPages] = useState(1);
  const [view, setView] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [csrfToken, setCsrfToken] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedInUserId = userData?.user?.id;

  const userTypes = [
    { id: 1, name: "BCombs Super Admin" },
    { id: 2, name: "Client Admin Access 1" },
    { id: 3, name: "Client Admin Access 2" },
    { id: 4, name: "Client Admin Access 3" },
    { id: 5, name: "Normal User" },
    { id: 6, name: "Read-Only User" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenResponse = await axios.get("http://localhost:5001/csrf-token", {
          withCredentials: true,
        });
        setCsrfToken(tokenResponse.data.csrfToken);

        const orgResponse = await axios.get(
          `http://localhost:5001/account/user/${loggedInUserId}/organization`,
          {
            withCredentials: true,
            headers: {
              "CSRF-Token": tokenResponse.data.csrfToken,
            },
          }
        );
        setOrganizationId(orgResponse.data.organizationId);

        const usersResponse = await axios.get(
          `http://localhost:5001/account/organizations/${orgResponse.data.organizationId}/users`,
          {
            withCredentials: true,
            headers: {
              "CSRF-Token": tokenResponse.data.csrfToken,
            },
          }
        );
        setUsers(usersResponse.data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
        showAlert("Failed to fetch data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loggedInUserId]);

  const handleInviteUser = async () => {
    if (!csrfToken || !organizationId) {
      console.error("CSRF token or Organization ID is missing");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5001/account/invite-user`,
        { email, organizationId },
        {
          withCredentials: true,
          headers: {
            "CSRF-Token": csrfToken,
          },
        }
      );
      showAlert("Invitation sent successfully!", "success");
      setIsAddUserOpen(false);
      setEmail("");
      fetchUsers(); // Refresh the user list after inviting
    } catch (error) {
      console.error("Error sending invitation:", error);
      showAlert("Failed to send invitation", "error");
    }
  };

  const fetchUsers = async () => {
    if (!csrfToken || !organizationId) {
      console.error("CSRF token or Organization ID is not available");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:5001/account/organizations/${organizationId}/users`,
        {
          withCredentials: true,
          headers: {
            "CSRF-Token": csrfToken,
          },
        }
      );

      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      showAlert("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, userTypeId) => {
    if (!csrfToken) {
      console.error("CSRF token is not available");
      return;
    }

    const confirmChange = window.confirm("Are you sure you want to change this user's role?");
    if (!confirmChange) {
      return;
    }

    try {
      await axios.put(
        `http://localhost:5001/account/update-user-role`,
        { userId, userTypeId },
        {
          withCredentials: true,
          headers: {
            "CSRF-Token": csrfToken,
          },
        }
      );

      showAlert("Role updated successfully!", "success");
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      showAlert("Failed to update role", "error");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!csrfToken) {
      console.error("CSRF token is not available");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/account/delete-user/${userId}`, {
        withCredentials: true,
        headers: {
          "CSRF-Token": csrfToken,
        },
      });

      showAlert("User deleted successfully!", "success");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      showAlert("Failed to delete user", "error");
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>User Management</h1>
        <button className={styles.createButton} onClick={() => setIsAddUserOpen(true)}>
          <UserPlus size={20} />
          Add User
        </button>
      </div>

      <div className={styles.subheader}>
        <p className={styles.description}>Manage organization users and permissions</p>
        <div className={styles.metrics}>
          <span className={styles.metric}>{users.length} Total Users</span>
        </div>
      </div>

      {loading ? (
        <div className={styles.formRow}>Loading...</div>
      ) : (
        <div className={styles.formList}>
          <div className={styles.listHeader}>
            <div className={styles.headerCell}>Name</div>
            <div className={styles.headerCell}>Email</div>
            <div className={styles.headerCell}>Role</div>
            <div className={styles.headerCell}>Actions</div>
          </div>
          {users.map((user) => (
            <div key={user.id} className={styles.formRow}>
              <div className={styles.cell}>
                {user.firstname} {user.lastname}
              </div>
              <div className={styles.cell}>{user.email}</div>
              <div className={styles.cell}>
                <select
                  className={styles.roleSelect}
                  value={user.roleId}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={user.id === loggedInUserId}
                >
                  {userTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.cell}>
                {user.id !== loggedInUserId && (
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isAddUserOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Invite User</h2>
              <button className={styles.closeButton} onClick={() => setIsAddUserOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="Enter email address"
                />
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsAddUserOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.continueButton}
                  onClick={handleInviteUser}
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {alert.show && (
        <div
          className={`${styles.alert} ${
            alert.type === "success" ? styles.alertSuccess : styles.alertError
          }`}
        >
          {alert.type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
          {alert.message}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
