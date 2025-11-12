import React from 'react';

const BtliveTripItinerary = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="flex h-screen w-full">
        {/* Left Column: Participants Panel */}
        <aside className="flex h-full w-full max-w-xs flex-col border-r border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD5kaqDdIY-THEA7QPzyeG5U6qZ9sEr1sZLyz2NnX0Mit4kwufWGHbjflr7416NWyy1Xlfh7UAFbgfddqjE4whB_Ob2iNlhMUCRWZYFZ-OLaTz0u3M2pOs6y6wdAPAKNVndX8ZRjR-BDPII7g1KE3Isf_EOk366GtodXV3VtlwS7gj6FE0rC64EnrDVFWP3uaTeJ8yq8lZCNGQQ1hHIM7PpceKI29TPOv_WvKVFfiknyPpAacjxS67A6nGmlcd0RagITOmUioCBBCVG")' }}
              />
              <div className="flex flex-col">
                <h1 className="text-base font-bold text-black">Alpine Adventure</h1>
                <p className="text-sm font-normal text-gray-600">Trip Members</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-b border-gray-200">
            <label className="flex flex-col w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-11">
                <div className="text-gray-500 flex bg-gray-100 items-center justify-center pl-3 rounded-l-lg border-r-0">
                  <span className="material-icons text-xl">search</span>
                </div>
                <input 
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black focus:outline-0 focus:ring-0 border-none bg-gray-100 h-full placeholder:text-gray-500 pl-2 text-sm font-normal leading-normal" 
                  placeholder="Find a participant" 
                  value=""
                />
              </div>
            </label>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="flex flex-col gap-1">
              <li>
                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-100" href="#">
                  <div className="text-blue-600 flex items-center justify-center rounded-full bg-blue-200 shrink-0 w-10 h-10">
                    <span className="material-icons">groups</span>
                  </div>
                  <span className="text-blue-600 font-bold leading-normal flex-1 truncate text-sm">Group Chat</span>
                  <span className="text-xs font-semibold text-white bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center">3</span>
                </a>
              </li>
              
              <li>
                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100" href="#">
                  <div className="relative">
                    <div 
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10" 
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC4qKy_8WH_CDt1jNRnW3xTgws-CiH-zHfmkIQHM-8UG3EV2wKgf2TuNiRKmnH1mk4z-saHVfIDUPq32nioQHPl25i36XV_SrWUzUXqonkRzUIUQd2ee42s4o24zxABgmm96s_46q-70UT0EFqQhPl7c3ZYXgzdy7_xAt2lJJE7gKHi1ZV0wYeMmbpRORxeMAdkws3cTE6S7wIAwI0NJdbAwS8uymsttLbM3STlfBsVKVPeFxGgsjxDeaD-sMTzI_DjXkEIX-8eQ9DJ")' }}
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>
                  <span className="text-black text-sm font-medium leading-normal flex-1 truncate">Alice Johnson</span>
                </a>
              </li>
              
              <li>
                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100" href="#">
                  <div className="relative">
                    <div 
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10" 
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDICMDBJXUwop67jteQebBqrV5Fvfjvq4vzJqOllKQA1uK_FZEb-opZi2vvsQEDLdNDbcQrddm82iYE7gMqi7fcds0r9iovO_S28ZATEakGEdQNklmJqlE96J48ApCNy5VwizAj2FY_GXrBFLapomTPDyOzRPJ0K2voe9HgNknr4usWSYB1afxObHzxwW0qFo0cmp_H3t-7oudpRfnWIWtCS8B93omPP0EQUsVIG_6c6JurjCtCgOaiAc2rVfd7rI3sFN0yyiCYv8mX")' }}
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>
                  <span className="text-black text-sm font-medium leading-normal flex-1 truncate">Bob Williams</span>
                </a>
              </li>
              
              <li>
                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100" href="#">
                  <div className="relative">
                    <div 
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10" 
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD9hrhfOaoUCKma0kWSNB6Bf51XAo5sPSkvyjUFpJ5gpGDVtGlNWrejI5YbSc7geRS6wc8rfGCd4mAPrYRt8I0rhu-WJA8xtuC0ZNpO5iQOt2Z47mob-1Pz5pj5Tb8tx8h4X5q3qDUICy3ytA51Owo6YSuAFm50SovZvEgRdhl5DllThO2SmIL5HLnUaWgCCBHG4y2-qcXzJnEoZkqfcV7U_9EUoFp-oV2DdGHNH_dosC3lpkpR4V2KsPljS8sWihB0IlX3D5gitOtj")' }}
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-gray-400 border-2 border-white"></div>
                  </div>
                  <span className="text-black text-sm font-medium leading-normal flex-1 truncate">Charlie Brown</span>
                </a>
              </li>
              
              <li>
                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100" href="#">
                  <div className="relative">
                    <div 
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10" 
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC21zIXE60wUXAml6X7YpnI0rt6-5qt0CFict4WD5PbHspx6E2NrnhShUgWGBrNJ6AM9hWFOy8qxCVPYGUfnYkqhCvRv3nCvw0X8CSsLsSSar87Fuo1hYsbBQVRfv-IZaGOHOe16iclsCxwHknJCRup4Lu6dZBSYhYcuB4NOhKrBCH3DmHf6uQyC0xRAdOg7i8CIh5qUPZ3iR3Ql6g5plI4hhStz1dX5NvPeMkeSQMyENAkhCpD3uRJyBUV__lva6E9esaz0ImM3x2_")' }}
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>
                  <span className="text-black text-sm font-medium leading-normal flex-1 truncate">Diana Prince</span>
                  <span className="text-xs font-semibold text-white bg-teal-400 rounded-full w-5 h-5 flex items-center justify-center">1</span>
                </a>
              </li>
              
              <li>
                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100" href="#">
                  <div className="relative">
                    <div 
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10" 
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDlL0icMSbhHdV6uhBqbfLSMAh7T2DS8pPDwJCHsiK-5QzzdqGsmPw0WXgoSA6ColL8Bighd_AOyc-nt5iaivH4jBGzy-z15m_05I0eNcEllYgv13hrSoz8MFcYbiFTCfM7eXrdREiT0-H97libI79vQfEGZg_Jg482JS8a2tgGOOj8gENGrpWBuylSKYphRf3fSalGOc1tRP2feWe-PrhAZFCHMs48DfKgUdjEX9B339XY20-dc29jnGORKquRYvHmkEnViE66GncI")' }}
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-gray-400 border-2 border-white"></div>
                  </div>
                  <span className="text-black text-sm font-medium leading-normal flex-1 truncate">Ethan Hunt</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Middle Column: Chat & Activity Hub */}
        <main className="flex flex-1 flex-col bg-gray-50">
          <header className="flex items-center justify-between border-b border-gray-200 bg-white p-4 h-[73px] shrink-0">
            <div>
              <h2 className="text-lg font-bold text-black">Group Chat</h2>
              <p className="text-sm text-gray-600">5 members, 3 online</p>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <span className="material-icons">more_horiz</span>
            </button>
          </header>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* System Notification Card */}
            <div className="flex justify-center">
              <div className="text-center text-xs text-gray-600 bg-gray-200 rounded-full px-3 py-1">Today</div>
            </div>
            
            <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm border border-gray-200">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-500">
                <span className="material-icons text-base">person_add</span>
              </div>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Diana Prince</span> has joined the trip.
              </p>
            </div>
            
            {/* Message Bubble (Others) */}
            <div className="flex items-start gap-3">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBrnHpRXV9UdemGUhzGSnoJh5GBqodBRXa6AHcotjSHs-CPZX9YiG25BPg3PX_m_nbv4oScz2siv1FigDtPnqhpmwWnI2a5fv87Kg-tCXHPyMYdzEkTalxugRl_VWBOgbGeCDhmHhTVJv6xd_dLvRCj66fbvBBeUsCQBA6HfkO_M_RD09bsBeCAdNa2dE_EaHsOAaMEbfxc-FGoTKTdbSqSec-tfxjpixAH2FcxjIvTg4VuhnWPlCXdLwxkR-aHOAD7t3YXoG4HpCf8")' }}
              />
              <div className="flex flex-col gap-1.5 max-w-md">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm text-black">Alice Johnson</span>
                  <span className="text-xs text-gray-500">10:30 AM</span>
                </div>
                <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm border border-gray-200">
                  <p className="text-sm leading-relaxed text-gray-700">
                    Hey everyone! So excited for this trip. I've just landed. Anyone else at the airport?
                  </p>
                </div>
              </div>
            </div>
            
            {/* Message Bubble (You) */}
            <div className="flex items-start gap-3 flex-row-reverse">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_pJPsZyCbLcn1E_HGxhQv2WG8_uitKzy4eTjPt-jOfX5kPbvmeFq53Gh1vKK_iJZxtIZhMtxfgndT-_FfOMz4kcpnXKQtAvud4-Ilcqdq-8oxbYbzYQPwIOFpRK2FVKYS7VSr91e6xeHbsTvqFbea7FpTscEJ92yX6pfB0DtHz8EujWZwYL4-rZb2j2rx6UAZMoAZJtrbPLTOVlN_cMUjhagXXkZWGVk2fH_IUews7xRXE8UP6Zk3KfdDYpvgulxaLKbbIjkgHrWe")' }}
              />
              <div className="flex flex-col gap-1.5 max-w-md items-end">
                <div className="flex items-baseline gap-2 flex-row-reverse">
                  <span className="font-semibold text-sm text-black">You</span>
                  <span className="text-xs text-gray-500">10:32 AM</span>
                </div>
                <div className="bg-blue-600 text-white p-3 rounded-lg rounded-tr-none">
                  <p className="text-sm leading-relaxed">
                    Welcome, Alice! My flight was delayed a bit. I should be there in about an hour. Bob is already at the hotel.
                  </p>
                </div>
              </div>
            </div>
            
            {/* System Update Card */}
            <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm border border-gray-200">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-500">
                <span className="material-icons text-base">hotel</span>
              </div>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Bob Williams</span> has checked into the hotel.
              </p>
            </div>
            
            {/* Expense Notification Card */}
            <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm border border-gray-200">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-500">
                <span className="material-icons text-base">receipt_long</span>
              </div>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Diana Prince</span> added a new expense: 'Airport Taxi' - $45.00
              </p>
            </div>
          </div>
          
          <footer className="bg-white p-4 border-t border-gray-200 mt-auto">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
              <button className="p-2.5 rounded-full text-gray-500 hover:bg-gray-200">
                <span className="material-icons">add_photo_alternate</span>
              </button>
              <button className="p-2.5 rounded-full text-gray-500 hover:bg-gray-200">
                <span className="material-icons">sentiment_satisfied</span>
              </button>
              <input 
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-black placeholder:text-gray-500" 
                placeholder="Type your message..." 
                type="text"
              />
              <button className="p-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center">
                <span className="material-icons">send</span>
              </button>
            </div>
          </footer>
        </main>

        {/* Right Column: Live Map Panel */}
        <aside className="flex h-full w-full max-w-sm flex-col border-l border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-4 h-[73px]">
            <h2 className="text-lg font-bold text-black">Live Map</h2>
            <p className="text-sm text-gray-600">Who's Where?</p>
          </div>
          
          <div className="flex-1 bg-gray-200 relative">
            <img 
              alt="Map of a city showing streets and buildings" 
              className="h-full w-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAddhg1SMCVRM9qiDgoMWJuRUZAfERVis0U0Yr79JJEzOR5GPJyFd2zyyKVo08KF7KpyrqUzDOxeNOxXsnbt-BFR_VwFihqCTEvl7gumNdRTHoL44wffPwdamd7_0RXbCPjrjzV_UqUQzvbedMAlQf3_UlDCbQCiWUtYRnnL8qXZQTQGOO5GmGliYtF2CK1KihiBpuM7PngBpocnZ7QhQ5P1IYmz2zRqEfDoJyTFFBqe-rX7Q4oNOnMpr8ZOS4RaY4u8QqfZBArOh6N" 
            />
            
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button className="bg-white rounded-lg shadow-md p-2 hover:bg-gray-100">
                <span className="material-icons">add</span>
              </button>
              <button className="bg-white rounded-lg shadow-md p-2 hover:bg-gray-100">
                <span className="material-icons">remove</span>
              </button>
              <button className="bg-white rounded-lg shadow-md p-2 mt-2 hover:bg-gray-100">
                <span className="material-icons">my_location</span>
              </button>
            </div>
            
            {/* Participant Map Pins */}
            <div className="absolute" style={{ top: '35%', left: '40%' }}>
              <div className="relative group">
                <div className="absolute -top-10 -left-8 bg-white text-black text-xs font-semibold px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Alice Johnson
                </div>
                <img 
                  className="w-10 h-10 rounded-full border-2 border-white shadow-xl" 
                  alt="Alice Johnson's map pin" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSVcIiXbC6ZMQoDmUhPRCAlQT9ZzhHIo5Msgz1Szo4j0ixxbQ3440iKC8kPYY2EzQKlhQ_yytdduuWD8iLywN8HS1mpsVUHdcPuAPnKwoImh5F9z8-elKJ6yHTE6emf5wy855sQS9aalbZwawRMopfIEgFJWvu4zxYkBXgFdHSRvRKVy79mk8ZAIQSnxwls0J22Y0z8-iwff8GpS9mPXsBU4ZKE7gF5PcAw4UCgLWuMirthMbXE8iACy0rhcYBVgqp694q_5MC1lkj" 
                />
              </div>
            </div>
            
            <div className="absolute" style={{ top: '50%', left: '60%' }}>
              <div className="relative group">
                <div className="absolute -top-10 -left-8 bg-white text-black text-xs font-semibold px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Bob Williams
                </div>
                <img 
                  className="w-10 h-10 rounded-full border-2 border-white shadow-xl" 
                  alt="Bob Williams's map pin" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9jvHy8xqtSUpgKybdB4GHwYTBXCOJW5Oee7pN7iwgz9yBR2uLCxFu8P0mEeCOoKlKhplVvJOsziFnIQfhHOa_aGA0J1bzmGmxN2DrxmnnWjSSH_iCfbOyXqm9w5ZyrlENw75ovO00_dGHYCOlQlG_6bjcB44uYQj1WgGnQF66kZEPcdWrdc98jJEtKEZEudmIOpv6NJRpu5hnf-iJ88n2F6HIZzZVdOt4_mkDb5KR5oCSfeHDYj4eOfnxALUPyLBnOpdYXgM5HCo_" 
                />
              </div>
            </div>
            
            <div className="absolute" style={{ top: '65%', left: '25%' }}>
              <div className="relative group">
                <div className="absolute -top-10 -left-8 bg-white text-black text-xs font-semibold px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Diana Prince
                </div>
                <img 
                  className="w-10 h-10 rounded-full border-2 border-white shadow-xl" 
                  alt="Diana Prince's map pin" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl7jtJjY8d-cPvfKHzEswy-QKc4ppakXfRNdSNAYf0CkjSRSfNeuzPHCfWKQNUK8CUAjbGoWm84N0fg-rn9ThRpwiv8Bk10mQtj20VQ-jAG0z8lj973LTwS0NegaPK_CoPC1dQksQXQasJTswfO_rZuOyM_w8JFaZpT8MEWYsgr53CtX_L4qdUAzGg77VoyjY49HyeVsOziMh5zH1_vH21IWsKaT4tocw6GEuUzzE-Vm49U84kGig8U3-0ca7RFexFTa5e4WPvTn7D" 
                />
              </div>
            </div>
            
            {/* Itinerary Point */}
            <div className="absolute" style={{ top: '48%', left: '55%' }}>
              <div className="relative group">
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-semibold px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Grand Hotel
                </div>
                <div className="bg-blue-600 text-white rounded-full p-1.5 shadow-lg border-2 border-white">
                  <span className="material-icons text-sm">hotel</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BtliveTripItinerary;