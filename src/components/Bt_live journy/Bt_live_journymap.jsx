import React from 'react';
import { useParams } from 'react-router-dom';

const BtLiveJournymap = () => {
  const uniqelivecode=useParams()
  console.log('uniqelivecode',uniqelivecode)
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-white">
      <div className="flex h-screen w-full">
        {/* Main Panel (Map) */}
        <main className="w-[70%] h-full flex flex-col bg-gray-200">
          <div className="relative h-full w-full">
            <div 
              className="w-full h-full bg-center bg-no-repeat bg-cover object-cover"
              style={{ 
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBVBbE6oHP7M1kBrK-8S5I6qlizwnDbZpP-dSlSCumCiVuSOSt4KrS2C2rasUU1KJjU2O8QE6SKuTBXw3LWBs1OY65h8lOrosdBnrecmps5B0K-s_LOJ63lZPsQHezenYLvCimyK3xNlFjwX350WJdUYq77Gus_AzdNroxh1OoJy1PgCqeYq10T3UakTiH4qtsB48cBSb_eaRJPKbGssvSbNLMB-NfG25bUArdstmgBMjNtvM0LvvXkG5xMkqXJEtPLHFmuK-Gy4ABD")' 
              }}
            >
              {/* Map controls can be added here */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button className="bg-white text-gray-800 p-2 rounded-lg shadow-lg">
                  <span className="material-symbols-outlined">add</span>
                </button>
                <button className="bg-white text-gray-800 p-2 rounded-lg shadow-lg">
                  <span className="material-symbols-outlined">remove</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-[30%] h-full flex flex-col bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6 flex flex-col gap-8">
            {/* Progress Bar */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-6 justify-between items-center">
                <p className="text-black text-base font-medium leading-normal">Trip Progress</p>
                <p className="text-black text-sm font-semibold leading-normal">65%</p>
              </div>
              <div className="rounded-full bg-gray-200 h-2">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: '65%' }}></div>
              </div>
            </div>

            {/* Trip Overview */}
            <div className="flex flex-col">
              <h3 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] pb-3">Trip Overview</h3>
              <div className="flex flex-col gap-3">
                <div className="flex flex-1 flex-col gap-2 rounded-lg p-4 border border-gray-200 bg-gray-50">
                  <p className="text-gray-600 text-sm font-medium leading-normal">Total Distance</p>
                  <p className="text-black tracking-light text-2xl font-bold leading-tight">1,204 km</p>
                </div>
                <div className="flex flex-1 flex-col gap-2 rounded-lg p-4 border border-gray-200 bg-gray-50">
                  <p className="text-gray-600 text-sm font-medium leading-normal">Budget Spent</p>
                  <p className="text-black tracking-light text-2xl font-bold leading-tight">$1,850</p>
                </div>
                <div className="flex flex-1 flex-col gap-2 rounded-lg p-4 border border-gray-200 bg-gray-50">
                  <p className="text-gray-600 text-sm font-medium leading-normal">Remaining Budget</p>
                  <p className="text-black tracking-light text-2xl font-bold leading-tight">$1,150</p>
                </div>
              </div>
            </div>

            {/* Daily Itinerary */}
            <div className="flex flex-col">
              <h3 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] pb-3">Daily Itinerary</h3>
              <div className="flex flex-col gap-6">
                {/* Today's Itinerary */}
                <div>
                  <p className="text-sm font-semibold text-gray-500 pb-4">Today, Oct 26</p>
                  <div className="relative flex flex-col gap-6 pl-6">
                    {/* Vertical Line */}
                    <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200"></div>
                    
                    {/* Timeline Item 1 (Completed) */}
                    <div className="flex items-start gap-4 opacity-60">
                      <div className="absolute left-[-9px] mt-1 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center ring-4 ring-white">
                        <span className="material-symbols-outlined text-white" style={{ fontSize: '16px' }}>check</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-black line-through">09:00 AM</p>
                        <p className="text-base text-gray-800 line-through">Breakfast at Le Pain Quotidien</p>
                        <p className="text-sm text-gray-500 line-through">Rue des Martyrs</p>
                      </div>
                    </div>

                    {/* Timeline Item 2 (Completed) */}
                    <div className="flex items-start gap-4 opacity-60">
                      <div className="absolute left-[-9px] mt-1 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center ring-4 ring-white">
                        <span className="material-symbols-outlined text-white" style={{ fontSize: '16px' }}>check</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-black line-through">10:30 AM</p>
                        <p className="text-base text-gray-800 line-through">Louvre Museum Tour</p>
                        <p className="text-sm text-gray-500 line-through">Rue de Rivoli</p>
                      </div>
                    </div>

                    {/* Timeline Item 3 (Current) */}
                    <div className="flex items-start gap-4">
                      <div className="absolute left-[-9px] mt-1 h-5 w-5 rounded-full bg-blue-600 ring-4 ring-white"></div>
                      <div>
                        <p className="text-sm font-semibold text-blue-600">02:00 PM</p>
                        <p className="text-base font-medium text-black">Seine River Cruise</p>
                        <p className="text-sm text-gray-500">Port de la Bourdonnais</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tomorrow's Itinerary */}
                <div>
                  <p className="text-sm font-semibold text-gray-500 pb-4">Tomorrow, Oct 27</p>
                  <div className="relative flex flex-col gap-6 pl-6">
                    {/* Vertical Line */}
                    <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200"></div>
                    
                    {/* Timeline Item 4 (Upcoming) */}
                    <div className="flex items-start gap-4">
                      <div className="absolute left-[-9px] mt-1 h-5 w-5 rounded-full bg-gray-300 ring-4 ring-white"></div>
                      <div>
                        <p className="text-sm font-semibold text-black">10:00 AM</p>
                        <p className="text-base text-gray-800">Visit the Eiffel Tower</p>
                        <p className="text-sm text-gray-500">Champ de Mars</p>
                      </div>
                    </div>

                    {/* Timeline Item 5 (Upcoming) */}
                    <div className="flex items-start gap-4">
                      <div className="absolute left-[-9px] mt-1 h-5 w-5 rounded-full bg-gray-300 ring-4 ring-white"></div>
                      <div>
                        <p className="text-sm font-semibold text-black">01:00 PM</p>
                        <p className="text-base text-gray-800">Lunch in Montmartre</p>
                        <p className="text-sm text-gray-500">Place du Tertre</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BtLiveJournymap;