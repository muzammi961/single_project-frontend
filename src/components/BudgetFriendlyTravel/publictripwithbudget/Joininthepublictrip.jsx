import React from 'react';

const Joininthepublictrip = () => {
  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center py-4 px-4">
      <div className="w-full  bg-white dark:bg-white rounded-xl shadow-lg border border-neutral-200 ">

        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="text-[#141414]  text-xl md:text-2xl font-bold leading-tight text-left">
            Trip Booking
          </h1>
         
        </div>


        <div className="p-6 space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
                Full Name
              </label>
              <input
                className="w-full rounded-lg text-[#141414]  border  h-10 placeholder:text-neutral-500 px-3 text-sm font-normal leading-normal"
                placeholder="Enter your full name"
              />
            </div>

<div className="flex flex-row gap-6">

  <div className="flex flex-col w-1/2">
    <label className="text-[#141414]  text-sm font-medium leading-normal pb-1">
      Email
    </label>
    <input
      className="w-full rounded-lg text-[#141414] border h-10 placeholder:text-neutral-500 px-3 text-sm font-normal leading-normal"
      placeholder="your@email.com"
      type="email"
    />
  </div>

  <div className="flex flex-col w-1/2">
    <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
      Phone Number <span className="text-neutr font-normal">(Optional)</span>
    </label>
    <input
      className="w-full rounded-lg text-[#141414]  border  h-10 placeholder:text-neutral-500 px-3 text-sm font-normal leading-normal"
      placeholder="Enter your phone number"
    />
  </div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div className="flex flex-col">
    <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
      Category
    </label>
    <select className="w-full rounded-lg text-[#141414] border h-10 px-3 text-sm font-normal leading-normal">
      <option>Hiker</option>
      <option>Driver</option>
      <option>Organizer</option>
    </select>
  </div>


  <div className="flex flex-col">
    <label className="text-[#141414]  text-sm font-medium leading-normal pb-1">
      Starting Location
    </label>
    <input
      className="w-full rounded-lg text-[#141414]  border h-10 placeholder:text-neutral-500 px-3 text-sm font-normal leading-normal"
      placeholder="e.g., Downtown Station"
    />
  </div>

    <div className="flex flex-col">
    <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
      Pincode
    </label>
    <input
      className="w-full rounded-lg text-[#141414]  border  h-10 placeholder:text-neutral-500 px-3 text-sm font-normal leading-normal"
      placeholder="12345"
    />
  </div>
</div>


<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div className="flex flex-col">
    <label className="text-[#141414]text-sm font-medium leading-normal pb-1">
      City / State
    </label>
    <input className="flex items-center h-10 px-3 text-black border rounded-lg text-sm" placeholder=' Denver, CO'/>
  </div>
   <div className="flex flex-col">
            <label className="text-[#141414]  text-sm font-medium leading-normal pb-1">
              Address <span className="text-black font-normal">(Optional)</span>
            </label>
            <textarea
              className="w-full rounded-lg text-[#141414]  border min-h-[60px] placeholder:text-neutral-500 p-3 text-sm font-normal leading-normal resize-vertical"
              placeholder="Enter your full address"
            ></textarea>
          </div>


            <div className="flex flex-col">
    <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
      Additional Notes <span className="text-black font-normal">(Optional)</span>
    </label>
    <textarea
      className="w-full rounded-lg text-[#141414]  border      min-h-[60px] placeholder:text-neutral-500 p-3 text-sm font-normal leading-normal resize-vertical"
      placeholder="Any special requests or information..."
    ></textarea>
  </div>

</div>



<div className="grid grid-cols-1 md:grid-cols-3 gap-4">


  <div className="flex flex-col">
    <label className="text-[#141414]  text-sm font-medium leading-normal pb-1">
      ID Proof Upload
    </label>
    <div className="flex items-center gap-3">
      <div className="relative w-20 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-600">
        <img
          className="w-full h-full object-cover rounded-md"
          alt="uploaded id proof thumbnail"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZSBze7A6uUmItNtjSekBlucbx29ls8EVESObVeNJl0sLRRdx_TTORkxXUBSHdX93Uei6MYrMSxMlOJB664kLXPwvtRMx-_OKX8YOGypiOkwbAjuaB_BRftFLZx8U3iSAZzsAaRUzhGj-uMcEOJR7WFmA5Bs0iD9qRf6z0rqt7XqnqMlfZrIaTf2rQf6N-Ff89iR-0D2Eu67TUkgJDI_HQJzDSNqcuOJD1WreaMIfvOu8OSXS43YOAQutnRsm9R86drt8lX1q_THc"
        />

      </div>
      <label className="cursor-pointer text-black dark:text-black text-sm font-medium underline underline-offset-2">
        Upload a file
        <input className="hidden" type="file" />
      </label>
    </div>
  </div>


 
 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex flex-col">
                <label className="text-[#141414] text-sm font-medium leading-normal pb-1">
                  Enter OTP
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((index) => (
                    <input
                      key={index}
                      className="w-10 h-10 text-center text-base font-bold rounded-lg border bg-neutral-50   focus:ring-2 focus:ring-primary/50"
                      maxLength="1"
                      type="text"
                    />
                  ))}
                </div>
                  <button className="mt-4 sm:mt-6 h-10  items-center justify-center rounded-lg text-sm font-medium px-6 py-2 transition-all text-black dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 bg-black hover:bg-primary hover:text-white dark:hover:bg-neutral-700">

                Send OTP
              </button>
              </div>
              
            </div>


</div>

        

        </div>

        <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
  <div className="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
<button className="flex-1 flex items-center justify-center rounded-lg text-sm font-medium px-6 py-2 transition-all text-black dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 bg-black hover:bg-primary hover:text-white dark:hover:bg-neutral-700">
      Join Trip
    </button>
<button className="flex-1 flex items-center justify-center rounded-lg text-sm font-medium px-6 py-2 transition-all text-black dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 bg-black hover:bg-primary hover:text-white dark:hover:bg-neutral-700">
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