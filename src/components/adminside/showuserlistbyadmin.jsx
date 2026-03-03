import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Showuserlistbyadmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'profile', 'changePassword'
  const [message, setMessage] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    adminname: '',
    adminemail: '',
    adminotp: '',
    new_password: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    fetchUsers();
  }, [accessToken]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8001/authentication/AllusergetAdmin/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
      console.error('Error fetching users:', err);
    }
  };

  const handleBlockUser = async (userId, currentStatus) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8001/authentication/BlockuserbyAdmin/${userId}/`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      
      setMessage(`User ${currentStatus ? 'unblocked' : 'blocked'} successfully`);
      
      // Update the user in the local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_blocked: !user.is_blocked } : user
      ));
      
      // If viewing profile, update selected user
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, is_blocked: !selectedUser.is_blocked });
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user block status');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8001/authentication/ChangeAdminPassword/',
        {
          adminname: passwordForm.adminname,
          adminemail: passwordForm.adminemail
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      
      setMessage('OTP sent to your email');
      setOtpSent(true);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.patch(
        'http://127.0.0.1:8001/authentication/VarifyOtpByAdmin/',
        {
          adminotp: passwordForm.adminotp
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      
      setMessage('OTP verified successfully');
      setOtpVerified(true);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify OTP');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.patch(
        'http://127.0.0.1:8001/authentication/ResetPasswordByAdmin/',
        {
          new_password: passwordForm.new_password
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      
      setMessage('Password reset successfully');
      setPasswordForm({
        adminname: '',
        adminemail: '',
        adminotp: '',
        new_password: ''
      });
      setOtpSent(false);
      setOtpVerified(false);
      setView('list');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
      setTimeout(() => setError(null), 3000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (user) => {
    if (user.is_blocked) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Blocked</span>;
    }
    if (!user.is_active) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Inactive</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>;
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setView('profile');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedUser(null);
  };

  const ChangePasswordView = () => (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
       

        <button className="button"  onClick={() => setView('list')} aria-label="Go back">
            <div className="button-box">
              <span className="button-elem">
                <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z" />
                </svg>
              </span>
              <span className="button-elem">
                <svg viewBox="0 0 46 40">
                  <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z" />
                </svg>
              </span>
            </div>
          </button>
 




      

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Change Admin Password</h2>
          
          {/* Step 1: Admin Credentials */}
          {!otpSent && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Username</label>
                <input
                  type="text"
                  value={passwordForm.adminname}
                  onChange={(e) => setPasswordForm({...passwordForm, adminname: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                <input
                  type="email"
                  value={passwordForm.adminemail}
                  onChange={(e) => setPasswordForm({...passwordForm, adminemail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <button
                onClick={handleChangePassword}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Send OTP
              </button>
            </div>
          )}

          {/* Step 2: Verify OTP */}
          {otpSent && !otpVerified && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={passwordForm.adminotp}
                  onChange={(e) => setPasswordForm({...passwordForm, adminotp: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter OTP sent to your email"
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Verify OTP
              </button>
            </div>
          )}

          {/* Step 3: New Password */}
          {otpVerified && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              <button
                onClick={handleResetPassword}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
              >
                Reset Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const UserProfileView = ({ user }) => {
    const profile = user.rpc_profile || {};

    return (
      <div className="min-h-screen bg-white text-black p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
        

                  <button className="button"  onClick={handleBackToList} aria-label="Go back">
            <div className="button-box">
              <span className="button-elem">
                <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z" />
                </svg>
              </span>
              <span className="button-elem">
                <svg viewBox="0 0 46 40">
                  <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z" />
                </svg>
              </span>
            </div>
          </button>





       

          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
              {profile.cover_photo ? (
                <img
                  src={`http://127.0.0.1:8002${profile.cover_photo}`}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                  <span className="text-white text-lg">No cover photo</span>
                </div>
              )}
              
              {/* Profile Picture */}
              <div className="absolute -bottom-12 left-8">
                <div className="relative">
                  {profile.profile_picture ? (
                    <img
                      src={`http://127.0.0.1:8002${profile.profile_picture}`}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center shadow-lg">
                      <span className="text-gray-600 text-2xl font-bold">
                        {user.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Block/Unblock Button */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => handleBlockUser(user.id, user.is_blocked)}
                  className={`px-4 py-2 rounded-md text-white font-medium ${
                    user.is_blocked 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  } transition-colors`}
                >
                  {user.is_blocked ? 'Unblock User' : 'Block User'}
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-16 pb-6 px-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.name || user.username}
                  </h1>
                  <p className="text-gray-600 text-lg">{user.email}</p>
                  {profile.bio && (
                    <p className="text-gray-700 mt-2 max-w-2xl">{profile.bio}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(user)}
                  <div className="flex gap-2">
                    {user.is_staff && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                        Staff
                      </span>
                    )}
                    {user.is_superuser && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                        Superuser
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">User ID</label>
                      <p className="text-gray-900">{user.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Username</label>
                      <p className="text-gray-900">{user.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <p className="text-gray-900">{profile.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-gray-900">{profile.location || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="text-gray-900">{formatDate(profile.date_of_birth)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact</label>
                      <p className="text-gray-900">{profile.contact_number || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Account Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Created</label>
                      <p className="text-gray-900">{formatDate(user.created_at)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-gray-900">{formatDate(user.updated_at)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Status</label>
                      <div className="flex gap-2 mt-1">
                        {getStatusBadge(user)}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  {profile.social_links && Object.keys(profile.social_links).length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium text-gray-900 mb-2">Social Links</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(profile.social_links).map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                          >
                            {platform}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">{user.id}</div>
                    <div className="text-sm text-gray-500">User ID</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {user.is_active ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm text-gray-500">Active</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {user.is_blocked ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm text-gray-500">Blocked</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {user.is_staff ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm text-gray-500">Staff</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const UserListView = () => (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <button
            onClick={() => setView('changePassword')}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Change Admin Password
          </button>
        </div>
        
        {/* Messages */}
        {message && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td 
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => handleUserClick(user)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.rpc_profile?.profile_picture ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={`http://127.0.0.1:8002${user.rpc_profile.profile_picture}`}
                              alt="Profile"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-gray-600 text-sm font-medium">
                                {user.username?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.rpc_profile?.name || user.username}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.rpc_profile?.contact_number || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex flex-wrap gap-1">
                          {user.rpc_profile?.gender && (
                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {user.rpc_profile.gender}
                            </span>
                          )}
                          {user.rpc_profile?.location && (
                            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                              {user.rpc_profile.location}
                            </span>
                          )}
                          {user.rpc_profile?.date_of_birth && (
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              DOB: {formatDate(user.rpc_profile.date_of_birth)}
                            </span>
                          )}
                        </div>
                        {user.rpc_profile?.bio && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {user.rpc_profile.bio}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(user)}
                        {user.is_staff && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Staff
                          </span>
                        )}
                        {user.is_superuser && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            Superuser
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleBlockUser(user.id, user.is_blocked)}
                        className={`px-3 py-1 text-xs rounded-md ${
                          user.is_blocked 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } transition-colors`}
                      >
                        {user.is_blocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>Total Users: {users.length}</p>
          <p>Active Users: {users.filter(user => user.is_active && !user.is_blocked).length}</p>
          <p>Blocked Users: {users.filter(user => user.is_blocked).length}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <>
      {view === 'list' && <UserListView />}
      {view === 'profile' && selectedUser && <UserProfileView user={selectedUser} />}
      {view === 'changePassword' && <ChangePasswordView />}
    </>
  );
};

export default Showuserlistbyadmin;