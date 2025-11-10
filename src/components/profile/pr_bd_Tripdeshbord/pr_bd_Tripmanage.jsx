import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pt_Bd_Navbar from './Pt_Bd_Navbar'
import { useSelector } from 'react-redux';
const Pr_bd_TripManagementDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(''); 
  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem("access_token");
  const trip_id = useSelector((state) => state.app.prtpidcode);
  console.log('trip_id',trip_id)
  // Fetch trips data from API
  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8006/ShowtheTripUserinvateorpublic/${trip_id}/`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setTrips(response.data.data || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
      alert('Failed to load trip requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Handle approve action
  const handleApprove = async (inviteId) => {
    console.log('inviteid .....',inviteId)
    try {
      setActionLoading(true);
      await axios.patch(
        `http://127.0.0.1:8006/ApprovetheTripinvateorPublic/${inviteId}/`,
        {},
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Remove the approved trip from the list
      setTrips(prevTrips => prevTrips.filter(trip => trip.trip_id !== inviteId));
      alert('Trip request approved successfully!');
    } catch (error) {
      console.error('Error approving trip:', error);
      alert('Failed to approve trip request');
    } finally {
      setActionLoading(false);
      setShowModal(false);
    }
  };

  // Handle reject action
  const handleReject = async (inviteId) => {
    console.log('invate id ',inviteId)
    try {
      setActionLoading(true);
      await axios.delete(
        `http://127.0.0.1:8006/RejecttheInvateorpublic/${inviteId}/`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Remove the rejected trip from the list
      setTrips(prevTrips => prevTrips.filter(trip => trip.trip_id !== inviteId));
      alert('Trip request rejected successfully!');
    } catch (error) {
      console.error('Error rejecting trip:', error);
      alert('Failed to reject trip request');
    } finally {
      setActionLoading(false);
      setShowModal(false);
    }
  };

  const openActionModal = (trip, action) => {
    setSelectedTrip(trip);
    setActionType(action);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryBadge = (category) => {
    const categories = {
      'young': 'bg-blue-100 text-blue-800',
      'adult': 'bg-green-100 text-green-800',
      'senior': 'bg-purple-100 text-purple-800',
      'new_born': 'bg-pink-100 text-pink-800'
    };
    return categories[category] || 'bg-gray-100 text-gray-800';
  };

  const getJoinTypeBadge = (joinType) => {
    return joinType === 'public' 
      ? 'bg-green-100 text-green-800'
      : 'bg-orange-100 text-orange-800';
  };



  const getJoinTypeTrueorFalse = (joinapproveorreject) => {
    return joinapproveorreject === true
      ? 'bg-green-100 text-green-800'
      : 'bg-orange-100 text-orange-800';
  };
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trip requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Pt_Bd_Navbar/>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trip Join Requests</h1>
          <p className="text-gray-600 mt-2">Manage and review trip join requests from users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{trips.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Public Joins</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {trips.filter(trip => trip.join_type === 'public').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Invite Only</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {trips.filter(trip => trip.join_type === 'invite_only').length}
                </p>
              </div>
            </div>
          </div>

          {/* <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">{trips.length}</p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Trip Requests Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">All Join Requests</h2>
            <button
              onClick={fetchTrips}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
          
          {trips.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No trip requests</h3>
              <p className="mt-1 text-gray-500">There are no pending trip join requests at the moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trip Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status & Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trips.map((trip, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      {/* User Details */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {trip.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{trip.name}</div>
                            <div className="text-sm text-gray-500">{trip.email}</div>
                            <div className="text-sm text-gray-500">{trip.phone_number}</div>
                          </div>
                        </div>
                      </td>

                      {/* Trip Information */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{trip.trip_name}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(trip.created_at)}
                          </div>
                        </div>
                        {trip.notes && (
                          <div className="text-sm text-gray-600 mt-2">
                            <span className="font-medium">Notes:</span> {trip.notes}
                          </div>
                        )}
                      </td>

                      {/* Location Details */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">Starting: {trip.your_startinglocation}</div>
                          <div className="mt-1">
                            <div>{trip.city}, {trip.state}</div>
                            <div>Pincode: {trip.pincode}</div>
                          </div>
                        </div>
                        {trip.address_line && (
                          <div className="text-xs text-gray-500 mt-2">
                            {trip.address_line}
                          </div>
                        )}
                      </td>

                      {/* Status & Type */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(trip.category)}`}>
                            {trip.category.charAt(0).toUpperCase() + trip.category.slice(1)}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getJoinTypeBadge(trip.join_type)}`}>
                            {trip.join_type === 'public' ? 'Public Join' : 'Invite Only'}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getJoinTypeTrueorFalse(trip.is_accepted)}`}>
                            {trip.is_accepted === true ? 'Approved ✅ ' : 'Pending ⏳'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openActionModal(trip, 'approve')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve
                          </button>
                          <button
                            onClick={() => openActionModal(trip, 'reject')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                          </button>
                          <button
                            onClick={() => setSelectedTrip(trip)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Confirmation Modal */}
        {showModal && selectedTrip && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${actionType === 'approve' ? 'bg-green-100' : 'bg-red-100'}`}>
                  <svg className={`h-6 w-6 ${actionType === 'approve' ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {actionType === 'approve' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    )}
                  </svg>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">
                  {actionType === 'approve' ? 'Approve Trip Request' : 'Reject Trip Request'}
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to {actionType} the trip request from <strong>{selectedTrip.name}</strong> for <strong>{selectedTrip.trip_name}</strong>?
                  </p>
                </div>
                <div className="flex justify-center space-x-3 mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-24 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => actionType === 'approve' ? handleApprove(selectedTrip.id) : handleReject(selectedTrip.id)}
                    disabled={actionLoading}
                    className={`px-4 py-2 text-base font-medium rounded-md w-24 text-white focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 ${
                      actionType === 'approve' 
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                        : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    }`}
                  >
                    {actionLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                    ) : (
                      actionType === 'approve' ? 'Approve' : 'Reject'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trip Details Modal */}
        {selectedTrip && !showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-semibold text-gray-900">Trip Request Details</h3>
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">User Information</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <p className="text-gray-900">{selectedTrip.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{selectedTrip.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone Number</label>
                      <p className="text-gray-900">{selectedTrip.phone_number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Category</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(selectedTrip.category)}`}>
                        {selectedTrip.category.charAt(0).toUpperCase() + selectedTrip.category.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trip Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Trip Information</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Trip Name</label>
                      <p className="text-gray-900">{selectedTrip.trip_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Join Type</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getJoinTypeBadge(selectedTrip.join_type)}`}>
                        {selectedTrip.join_type === 'public' ? 'Public Join' : 'Invite Only'}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Request Date</label>
                      <p className="text-gray-900">{formatDate(selectedTrip.created_at)}</p>
                    </div>
                    {selectedTrip.notes && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Additional Notes</label>
                        <p className="text-gray-900">{selectedTrip.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Location Details</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Starting Location</label>
                      <p className="text-gray-900">{selectedTrip.your_startinglocation}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">City & State</label>
                      <p className="text-gray-900">{selectedTrip.city}, {selectedTrip.state}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Pincode</label>
                      <p className="text-gray-900">{selectedTrip.pincode}</p>
                    </div>
                    {selectedTrip.address_line && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Full Address</label>
                        <p className="text-gray-900 whitespace-pre-line">{selectedTrip.address_line}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ID Proof */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">ID Proof</h4>
                  <div className="space-y-2">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                      {selectedTrip.aadhaar_image ? (
                        <img
                          src={`http://127.0.0.1:8006${selectedTrip.aadhaar_image}`}
                          alt="ID Proof"
                          className="max-w-full max-h-64 object-contain rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                          }}
                        />
                      ) : (
                        <div className="text-center text-gray-500">
                          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="mt-2">No ID Proof Uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3 border-t pt-4">
                <button
                  onClick={() => openActionModal(selectedTrip, 'reject')}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  Reject Request
                </button>
                <button
                  onClick={() => openActionModal(selectedTrip, 'approve')}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                >
                  Approve Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pr_bd_TripManagementDashboard;













