import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Joininthepublictrip = () => {
  const { invatetripid } = useParams();
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [inviteData, setInviteData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'adult',
    your_startinglocation: '',
    pincode: '',
    city: '',
    state: '',
    address_line: '',
    notes: '',
    aadhaar_image: null
  });
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);

  // Initialize join process when component mounts
  useEffect(() => {
    if (invatetripid) {
      // You might want to fetch trip details here or keep it as is
    }
  }, [invatetripid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      aadhaar_image: e.target.files[0]
    }));
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 6) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const sendOtp = async () => {
    if (!formData.email || !formData.name) {
      alert('Please fill in email and name fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `http://127.0.0.1:8006/InviteorPublicJoinAPIView/${invatetripid}/`,
        {
          email: formData.email,
          phone: formData.phone,
          name: formData.name,
          category: formData.category,
          join_type: 'public'
        },
      );
      
      setInviteData(response.data);
      setOtpSent(true);
      alert('OTP sent successfully to your email!');
    } catch (error) {
      console.error("❌ Error sending OTP:", error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndJoin = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    if (!inviteData?.invite_id) {
      alert('Please send OTP first');
      return;
    }

    try {
      setLoading(true);
      
      const submitData = new FormData();
      submitData.append('otp', otpString);
      submitData.append('your_startinglocation', formData.your_startinglocation);
      submitData.append('pincode', formData.pincode);
      submitData.append('city', formData.city);
      submitData.append('state', formData.state);
      submitData.append('address_line', formData.address_line);
      submitData.append('notes', formData.notes);
      
      if (formData.aadhaar_image) {
        submitData.append('aadhaar_image', formData.aadhaar_image);
      }

      const response = await axios.post(
        `http://127.0.0.1:8006/InviteorpublicVerifyOTPAPIView/${inviteData.invite_id}/`,
        submitData,
      );
      
      alert('Successfully joined the trip!');
       navigate(-1);
    } catch (error) {
      console.error("❌ Error verifying OTP:", error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Failed to verify OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center py-4 px-4">
      <div className="w-full bg-white dark:bg-white rounded-xl shadow-lg border border-neutral-200">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="text-[#141414] text-xl md:text-2xl font-bold leading-tight text-left">
            Trip Booking
          </h1>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
                Full Name *
              </label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-lg text-[#141414] border h-10 placeholder:text-neutral-500 px-3 text-sm font-normal leading-normal"
                placeholder="Enter your full name"
                disabled={otpSent}
              />
            </div>

            <div className="flex flex-row gap-6">
              <div className="flex flex-col w-1/2">
                <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
                  Email *
                </label>
                <input
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg text-[#141414] border h-10 placeholder:text-neutral-500 px-3 text-sm font-normal leading-normal"
                  placeholder="your@email.com"
                  type="email"
                  disabled={otpSent}
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
                  Phone Number
                </label>
                <input
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-lg text-[#141414] border h-10 placeholder:text-neutral-500 px-3 text-sm font-normal leading-normal"
                  placeholder="Enter your phone number"
                  disabled={otpSent}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
                Category
              </label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-lg text-[#141414] border h-10 px-3 text-sm font-normal leading-normal"
                disabled={otpSent}
              >
                <option value="adult">Adult</option>
                <option value="young">Young</option>
                <option value="senior">Senior</option>
                <option value="new_born">New Born</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
                Starting Location
              </label>
              <input
                required
                name="your_startinglocation"
                value={formData.your_startinglocation}
                onChange={handleInputChange}
                className="w-full rounded-lg text-[#141414] border h-10 placeholder:text-neutral-500 px-3 text-sm font-normal leading-normal"
                placeholder="e.g., Downtown Station"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
                Pincode
              </label>
              <input
                required
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full rounded-lg text-[#141414] border h-10 placeholder:text-neutral-500 px-3 text-sm font-normal leading-normal"
                placeholder="12345"
                maxLength="6"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
                City 
              </label>
              <input 
                required
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="flex items-center h-10 px-3 text-black border rounded-lg text-sm" 
                placeholder="Denver, CO"
              />
            </div>
             <div className="flex flex-col">
              <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
                 State
              </label>
              <input 
                required
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="flex items-center h-10 px-3 text-black border rounded-lg text-sm" 
                placeholder="Denver, CO"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
                Address 
              </label>
              <textarea
                required
                name="address_line"
                value={formData.address_line}
                onChange={handleInputChange}
                className="w-full rounded-lg text-[#141414] border min-h-[60px] placeholder:text-neutral-500 p-3 text-sm font-normal leading-normal resize-vertical"
                placeholder="Enter your full address"
              ></textarea>
            </div>

           
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

             <div className="flex flex-col">
              <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
                Additional Notes 
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full rounded-lg text-[#141414] border min-h-[60px] placeholder:text-neutral-500 p-3 text-sm font-normal leading-normal resize-vertical"
                placeholder="Any special requests or information..."
              ></textarea>
            </div>

            <div className="flex flex-col">
              <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
                ID Proof Upload
              </label>
              <div className="flex items-center gap-3">
                <div className="relative w-20 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-600">
                  {formData.aadhaar_image ? (
                    <img
                      className="w-full h-full object-cover rounded-md"
                      alt="uploaded id proof thumbnail"
                      src={URL.createObjectURL(formData.aadhaar_image)}
                    />
                  ) : (
                    <span className="text-neutral-500 text-xs">No file</span>
                  )}
                </div>
                <label className="cursor-pointer text-black dark:text-black text-sm font-medium underline underline-offset-2">
                  Upload a file
                  <input 
                    required
                    className="hidden" 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {formData.aadhaar_image && (
                <p className="text-xs text-neutral-500 mt-1">
                  {formData.aadhaar_image.name}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex flex-col">
                <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
                  Enter OTP
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3,4,5].map((index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-10 h-10 text-center text-base font-bold rounded-lg border bg-neutral-50 focus:ring-2 focus:ring-primary/50"
                      maxLength="1"
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                  ))}
                </div>
                <button 
                  onClick={sendOtp}
                  disabled={loading || otpSent}
                  className="mt-4 sm:mt-6 h-10 items-center justify-center rounded-lg text-sm font-medium px-6 py-2 transition-all text-black dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 bg-white hover:bg-primary hover:text-white dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
            <button 
              onClick={verifyOtpAndJoin}
              disabled={loading || !otpSent}
              className="flex-1 flex items-center justify-center rounded-lg text-sm font-medium px-6 py-2 transition-all text-white bg-black hover:bg-primary dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Joining...' : 'Join Trip'}
            </button>
            <button 
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center rounded-lg text-sm font-medium px-6 py-2 transition-all text-black dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 bg-white hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-black dark:text-black text-center pt-1">
            Your information is used solely for trip verification and will not be shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Joininthepublictrip;