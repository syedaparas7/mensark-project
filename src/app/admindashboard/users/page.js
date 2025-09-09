'use client';

import Loader from "@/app/loader/page";
import React, { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    "#EF4444", "#3B82F6", "#10B981", "#F59E0B",
    "#8B5CF6", "#EC4899", "#14B8A6", "#F97316",
  ];
  return colors[Math.abs(hash) % colors.length];
}

const roleBadgeColor = {
  Admin: "bg-red-200 text-red-800",
  Editor: "bg-blue-200 text-blue-800",
  Customer: "bg-green-200 text-green-800",
  Default: "bg-gray-200 text-gray-700"
};

export default function UserList() {
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterRole, setFilterRole] = useState("All");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
 

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/users');
        const allUsers = await res.json();
        setUsers(allUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
      setIsLoading(false)
    };
    fetchUsers();
  }, []);

const handleRoleChange = async (userId, newRole) => {
  setIsLoading(true)
  try {
    setUsers(prev =>
      prev.map(user => user.id === userId ? { ...user, role: newRole } : user)
    );

    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newRole }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Failed to update role:", data.error);
      setIsLoading(false)
      toast("Failed to update role.");
    }
  } catch (err) {
    console.error("Error updating role:", err);
    setIsLoading(false)
    toast("Error updating role.");
  }
  setIsLoading(false)
};

  const roles = useMemo(() => {
    const roleSet = new Set(users.map((u) => u.role).filter(Boolean));
    return ["All", ...Array.from(roleSet)];
  }, [users]);

  const filteredSortedUsers = useMemo(() => {
    let filtered = users;
    if (filterRole !== "All") {
      filtered = users.filter((u) => u.role === filterRole);
    }

    return filtered.sort((a, b) => {
      const aVal = sortKey === "name" ? a.name || "" : a.role || "";
      const bVal = sortKey === "name" ? b.name || "" : b.role || "";
      const compare = aVal.localeCompare(bVal);
      return sortOrder === "asc" ? compare : -compare;
    });
  }, [users, filterRole, sortKey, sortOrder]);

  if (!users || users.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 min-h-screen">
        No users to display.
      </div>
    );
  }

  return (
    <>
    {isLoading && <Loader/>}
    <div className="w-full pt-30 mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Users List</h2>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
        <div>
          <label htmlFor="roleFilter" className="mr-2 font-medium text-gray-700">
            Filter by role:
          </label>
          <select
            id="roleFilter"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <label htmlFor="sortKey" className="font-medium text-gray-700">Sort by:</label>
          <select
            id="sortKey"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="name">Name</option>
            <option value="role">Role</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            aria-label="Toggle sort order"
            className="ml-2 rounded border border-gray-300 p-1 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {sortOrder === "asc" ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredSortedUsers.map(({ id, fullName, email, role }) => {
          const avatarColor = stringToColor(fullName || "");
          const firstLetter = (fullName || "U").charAt(0).toUpperCase();
          const badgeClass = roleBadgeColor[role] || roleBadgeColor.Default;

          return (
            <div
              key={id}
              className="border border-gray-300 rounded-lg p-6 flex items-center space-x-5 shadow-md bg-gradient-to-r from-white to-gray-50 transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-gradient-to-r hover:from-red-100 hover:to-red-50"
            >
              <div
                className="flex items-center justify-center rounded-full h-16 w-16 text-2xl font-bold text-white flex-shrink-0"
                style={{ backgroundColor: avatarColor }}
              >
                {firstLetter}
              </div>

              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-gray-900">{fullName || "Unnamed User"}</h3>
                <p className="text-sm text-gray-600">{email || "No Email"}</p>

                <div className="mt-2 flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
                    {role || "No Role"}
                  </span>
                  <select
                    value={role || ""}
                    onChange={(e) => handleRoleChange(id, e.target.value)}
                    className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="">No Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}
