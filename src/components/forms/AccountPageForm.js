"use client";
import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEdit,
} from "react-icons/fa";

function AccountPageForm({ firstName, lastName, username, email, password }) {
  const [formData, setFormData] = useState({
    firstName: firstName,
    lastName: lastName,
    username: username,
    email: email,
    password: password,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    // currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async () => {
    // Validation
    if (
      // !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      alert("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert("New password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/user/${userId}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update password");
      }

      // Success
      alert("Password updated successfully!");
      setShowChangePassword(false);
      setPasswordData({
        // currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      alert(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData)

    setLoading(true);
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("failed to update user");
      }
      setIsEditing(false);
      // closeModal();
    } catch (error) {
      console.error("error updating user", error);
    } finally {
      setLoading(false);
      // router.refresh();
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: password,
    });
  };

  return (
    <div className="h-screen max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="mr-5 md:mr-0">
          <h1 className="text-3xl font-bold text-[#D7CDBF] mb-2">
            Account Details
          </h1>
          <p className="text-[#8B8680] text-sm">
            Manage your personal information
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={toggleEdit}
            className="flex items-center gap-1 px-4 py-2 bg-[#252220] hover:bg-[#4C4138] text-[#D7CDBF] rounded-lg transition-colors duration-200"
          >
            <FaEdit size={14} />
            Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-4">
        {/* Name Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#D7CDBF] mb-1">
              First Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B8680] text-sm" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-transparent text-[#D7CDBF] outline-none transition-all duration-200 ${
                  isEditing
                    ? "border-[#4C4138] hover:border-[#D7CDBF] focus:border-[#D7CDBF] focus:ring-2 focus:ring-[#D7CDBF]/20"
                    : "border-[#252220] cursor-not-allowed opacity-70"
                }`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#D7CDBF] mb-1">
              Last Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B8680] text-sm" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-transparent text-[#D7CDBF] outline-none transition-all duration-200 ${
                  isEditing
                    ? "border-[#4C4138] hover:border-[#D7CDBF] focus:border-[#D7CDBF] focus:ring-2 focus:ring-[#D7CDBF]/20"
                    : "border-[#252220] cursor-not-allowed opacity-70"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Username Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#D7CDBF] mb-1">
            Username
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B8680] text-sm">
              @
            </span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-transparent text-[#D7CDBF] outline-none transition-all duration-200 ${
                isEditing
                  ? "border-[#4C4138] hover:border-[#D7CDBF] focus:border-[#D7CDBF] focus:ring-2 focus:ring-[#D7CDBF]/20"
                  : "border-[#252220] cursor-not-allowed opacity-70"
              }`}
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#D7CDBF] mb-1">
            Email Address
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B8680] text-sm" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-transparent text-[#D7CDBF] outline-none transition-all duration-200 ${
                isEditing
                  ? "border-[#4C4138] hover:border-[#D7CDBF] focus:border-[#D7CDBF] focus:ring-2 focus:ring-[#D7CDBF]/20"
                  : "border-[#252220] cursor-not-allowed opacity-70"
              }`}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#D7CDBF] mb-1">
            Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B8680] text-sm" />
            <div className="flex items-center w-full pl-10 pr-4 py-3 rounded-lg border border-[#252220] bg-transparent">
              <span className="text-[#8B8680] flex-1">••••••••••••</span>
              <button
                type="button"
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="text-[#D7CDBF] hover:text-[#C4B8A8] text-sm font-medium transition-colors duration-200"
              >
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        {showChangePassword && (
          <div className="space-y-4 p-4 bg-[#252220] rounded-lg">
            <h3 className="text-lg font-semibold text-[#D7CDBF] mb-3">
              Change Password
            </h3>

            {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-[#D7CDBF] mb-1">
                Current Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B8680] text-sm" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-[#4C4138] hover:border-[#D7CDBF] focus:border-[#D7CDBF] focus:ring-2 focus:ring-[#D7CDBF]/20 bg-transparent text-[#D7CDBF] outline-none transition-all duration-200"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B8680] hover:text-[#D7CDBF] transition-colors duration-200"
                >
                  {showCurrentPassword ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                </button>
              </div>
            </div> */}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#D7CDBF] mb-1">
                New Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B8680] text-sm" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-[#4C4138] hover:border-[#D7CDBF] focus:border-[#D7CDBF] focus:ring-2 focus:ring-[#D7CDBF]/20 bg-transparent text-[#D7CDBF] outline-none transition-all duration-200"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B8680] hover:text-[#D7CDBF] transition-colors duration-200"
                >
                  {showNewPassword ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#D7CDBF] mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B8680] text-sm" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-[#4C4138] hover:border-[#D7CDBF] focus:border-[#D7CDBF] focus:ring-2 focus:ring-[#D7CDBF]/20 bg-transparent text-[#D7CDBF] outline-none transition-all duration-200"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B8680] hover:text-[#D7CDBF] transition-colors duration-200"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handlePasswordUpdate}
                disabled={loading}
                className="bg-[#D7CDBF] hover:bg-[#C4B8A8] text-[#000000] font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                onClick={() => setShowChangePassword(false)}
                className="bg-[#252220] hover:bg-[#4C4138] text-[#D7CDBF] font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#D7CDBF] hover:bg-[#C4B8A8] text-[#000000] font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={loading}
              className="flex-1 bg-[#252220] hover:bg-[#4C4138] text-[#D7CDBF] font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default AccountPageForm;
