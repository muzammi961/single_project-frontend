// import React, { useState, useEffect, useRef } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix for default markers in react-leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const Calendar = () => {
//   const [events, setEvents] = useState([]);
//   const [holidays, setHolidays] = useState([]);
//   const [selectedDateEvents, setSelectedDateEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [isMobile, setIsMobile] = useState(false);
//   const calendarRef = useRef(null);

//   // Check if mobile device
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 1024);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);

//     return () => {
//       window.removeEventListener('resize', checkMobile);
//     };
//   }, []);

//   // Load Google Fonts for Inter and Material Symbols
//   useEffect(() => {
//     const link1 = document.createElement('link');
//     link1.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
//     link1.rel = 'stylesheet';
//     document.head.appendChild(link1);

//     const link2 = document.createElement('link');
//     link2.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL@20..48,100..700,0..1';
//     link2.rel = 'stylesheet';
//     document.head.appendChild(link2);

//     return () => {
//       if (document.head.contains(link1)) document.head.removeChild(link1);
//       if (document.head.contains(link2)) document.head.removeChild(link2);
//     };
//   }, []);

//   // Fetch events from API
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const eventsResponse = await fetch('http://127.0.0.1:8003/EventListAPIView');
        
//         if (!eventsResponse.ok) {
//           throw new Error(`HTTP error! status: ${eventsResponse.status}`);
//         }
        
//         const eventsData = await eventsResponse.json();
        
//         // Transform events data for FullCalendar
//         const formattedEvents = eventsData.map(event => ({
//           id: `event-${event.id}`,
//           title: event.name,
//           start: event.start_time,
//           end: event.end_time || event.start_time,
//           extendedProps: {
//             ...event,
//             type: 'event'
//           },
//           backgroundColor: '#3b82f6',
//           borderColor: '#2563eb',
//           textColor: '#ffffff'
//         }));

//         setEvents(formattedEvents);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching events:', error);
//         // Fallback to empty events if API fails
//         setEvents([]);
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   // Fetch holidays for current month when month changes
//   useEffect(() => {
//     const fetchHolidaysForMonth = async () => {
//       try {
//         const year = currentDate.getFullYear();
//         const month = currentDate.getMonth() + 1;
        
//         const holidaysResponse = await fetch(
//           `https://holidays.abstractapi.com/v1/?api_key=6caf3d07b678468f96e31f9f4d1f9077&country=IN&year=${year}&month=${month}`
//         );
        
//         if (!holidaysResponse.ok) {
//           throw new Error(`HTTP error! status: ${holidaysResponse.status}`);
//         }
        
//         const holidaysData = await holidaysResponse.json();
        
//         const formattedHolidays = holidaysData.map(holiday => ({
//           id: `holiday-${holiday.date}-${holiday.name}`,
//           title: holiday.name,
//           start: holiday.date,
//           allDay: true,
//           extendedProps: {
//             ...holiday,
//             type: 'holiday'
//           },
//           backgroundColor: '#ef4444',
//           borderColor: '#dc2626',
//           textColor: '#ffffff'
//         }));

//         setHolidays(formattedHolidays);
//       } catch (error) {
//         console.error('Error fetching holidays:', error);
//         // Fallback to empty holidays if API fails
//         setHolidays([]);
//       }
//     };

//     fetchHolidaysForMonth();
//   }, [currentDate]);

//   const handleDateClick = async (info) => {
//     const clickedDate = info.date;
//     setSelectedDate(new Date(clickedDate));
//     const dateStr = clickedDate.toISOString().split('T')[0];
    
//     // Filter events for the clicked date
//     const dayEvents = events.filter(event => {
//       const eventDate = new Date(event.start).toISOString().split('T')[0];
//       return eventDate === dateStr;
//     });

//     // Filter holidays for the clicked date
//     const dayHolidaysData = holidays.filter(holiday => {
//       const hDate = new Date(holiday.start).toISOString().split('T')[0];
//       return hDate === dateStr;
//     });

//     // Fetch additional holidays for the specific day from API
//     try {
//       const year = clickedDate.getFullYear();
//       const month = clickedDate.getMonth() + 1;
//       const day = clickedDate.getDate();
      
//       const dailyHolidaysResponse = await fetch(
//         `https://holidays.abstractapi.com/v1/?api_key=6caf3d07b678468f96e31f9f4d1f9077&country=IN&year=${year}&month=${month}&day=${day}`
//       );
      
//       if (dailyHolidaysResponse.ok) {
//         const dailyHolidaysData = await dailyHolidaysResponse.json();
        
//         const additionalHolidays = dailyHolidaysData.map(holiday => ({
//           id: `holiday-${holiday.date}-${holiday.name}-daily`,
//           title: holiday.name,
//           start: holiday.date,
//           allDay: true,
//           extendedProps: {
//             ...holiday,
//             type: 'holiday'
//           },
//           backgroundColor: '#ef4444',
//           borderColor: '#dc2626',
//           textColor: '#ffffff'
//         }));

//         // Combine all events and holidays
//         const allHolidayEvents = [...dayHolidaysData, ...additionalHolidays];
//         const uniqueHolidays = allHolidayEvents.filter((holiday, index, self) => 
//           index === self.findIndex(h => h.id === holiday.id)
//         );

//         const holidayEvents = uniqueHolidays.map(holiday => ({
//           ...holiday,
//           title: `🎉 ${holiday.title}`
//         }));

//         setSelectedDateEvents([...dayEvents, ...holidayEvents]);
//       } else {
//         // Use existing holidays if API call fails
//         const holidayEvents = dayHolidaysData.map(holiday => ({
//           ...holiday,
//           title: `🎉 ${holiday.title}`
//         }));
//         setSelectedDateEvents([...dayEvents, ...holidayEvents]);
//       }
//     } catch (error) {
//       console.error('Error fetching daily holidays:', error);
//       // Use existing holidays if API call fails
//       const holidayEvents = dayHolidaysData.map(holiday => ({
//         ...holiday,
//         title: `🎉 ${holiday.title}`
//       }));
//       setSelectedDateEvents([...dayEvents, ...holidayEvents]);
//     }
    
//     setSelectedEvent(null);
//   };

//   const handleEventClick = (info) => {
//     setSelectedEvent(info.event.extendedProps);
//   };

//   const renderEventContent = (eventInfo) => {
//     const eventType = eventInfo.event.extendedProps.type;
    
//     if (eventType === 'holiday') {
//       return (
//         <div className="p-1 text-xs">
//           <div className="font-semibold truncate">🎉 {eventInfo.event.title}</div>
//         </div>
//       );
//     }

//     return (
//       <div className="p-1 text-xs">
//         <div className="font-semibold truncate">{eventInfo.event.title}</div>
//         <div className="text-gray-100 truncate">
//           {new Date(eventInfo.event.start).toLocaleTimeString([], { 
//             hour: '2-digit', 
//             minute: '2-digit' 
//           })}
//         </div>
//       </div>
//     );
//   };

//   const handlePrev = () => {
//     if (calendarRef.current) {
//       calendarRef.current.getApi().prev();
//     }
//   };

//   const handleNext = () => {
//     if (calendarRef.current) {
//       calendarRef.current.getApi().next();
//     }
//   };

//   // Default center for map (India)
//   const defaultCenter = [20.5937, 78.9629];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#101922]">
//         <div className="text-white text-xl">Loading calendar...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#101922] text-white font-['Inter',sans-serif]">
//       {/* Mobile Layout */}
//       {isMobile ? (
//         <div className="flex flex-col h-screen">
//           {/* Calendar Section - Top on Mobile */}
//           <div className="flex-1 flex flex-col p-4 bg-[#101922] min-h-0">
//             <div className="flex flex-col h-full">
//               {/* Navigation */}
//               <div className="flex items-center justify-between mb-4">
//                 <button 
//                   onClick={handlePrev}
//                   className="text-white flex size-10 items-center justify-center hover:bg-[#233648] rounded-full transition-colors"
//                 >
//                   <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_left</span>
//                 </button>
//                 <h2 className="text-white text-xl font-bold leading-tight flex-1 text-center">
//                   {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                 </h2>
//                 <button 
//                   onClick={handleNext}
//                   className="text-white flex size-10 items-center justify-center hover:bg-[#233648] rounded-full transition-colors"
//                 >
//                   <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
//                 </button>
//               </div>

//               {/* FullCalendar */}
//               <div className="flex-grow min-h-0 bg-[#111a22] rounded-lg p-2">
//                 <FullCalendar
//                   ref={calendarRef}
//                   plugins={[dayGridPlugin, interactionPlugin]}
//                   initialView="dayGridMonth"
//                   headerToolbar={false}
//                   events={[...events, ...holidays]}
//                   dateClick={handleDateClick}
//                   eventClick={handleEventClick}
//                   eventContent={renderEventContent}
//                   height="100%"
//                   locale="en"
//                   dayMaxEvents={2}
//                   moreLinkText="more"
//                   eventOrder="start,-duration,allDay,title"
//                   datesSet={(dateInfo) => {
//                     setCurrentDate(dateInfo.start);
//                   }}
//                   dayHeaderClassNames="text-white font-semibold text-xs border-b border-gray-600 py-1"
//                   dayCellClassNames="border border-gray-700 hover:bg-[#233648] transition-colors text-xs"
//                   dayCellContent={(args) => (
//                     <div className="flex items-center justify-center h-full w-full p-1">
//                       <div className="text-white text-xs font-medium">
//                         {args.dayNumberText}
//                       </div>
//                     </div>
//                   )}
//                   dayHeaderContent={(args) => (
//                     <div className="text-white text-xs font-semibold uppercase tracking-wide text-center">
//                       {args.text.substring(0, 3)}
//                     </div>
//                   )}
//                   eventClassNames="cursor-pointer rounded-lg border-0 text-xs"
//                   moreLinkClassNames="text-[#3b82f6] hover:text-[#2563eb] text-xs font-medium"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Events & Details Section - Bottom on Mobile */}
//           <div className="flex-1 flex flex-col bg-[#111a22] border-t border-gray-700 overflow-hidden">
//             {/* Events List */}
//             <div className="flex-shrink-0 p-4 border-b border-gray-700">
//               <h2 className="text-lg font-semibold text-white mb-3">
//                 {selectedDateEvents.length > 0 
//                   ? `Events & Holidays for ${selectedDate ? selectedDate.toLocaleDateString('en-IN', {
//                       weekday: 'short',
//                       month: 'short',
//                       day: 'numeric'
//                     }) : ''}`
//                   : 'Select a date to view events'
//                 }
//               </h2>
//               <div className="max-h-32 overflow-y-auto">
//                 {selectedDateEvents.map(event => {
//                   const type = event.extendedProps?.type || 'event';
//                   const icon = type === 'holiday' ? 'celebration' : 'event';
//                   const iconColor = type === 'holiday' ? '#ef4444' : '#3b82f6';
//                   const bgClass = type === 'holiday' ? 'bg-[#111a22] hover:bg-[#233648]' : 'bg-[#233648] hover:bg-[#2e4257]';
//                   const timeText = type === 'event' 
//                     ? `${new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
//                     : 'All day';
//                   return (
//                     <div
//                       key={event.id}
//                       className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${bgClass} mb-2`}
//                       onClick={() => setSelectedEvent(event.extendedProps)}
//                     >
//                       <div 
//                         className="flex items-center justify-center rounded-lg size-8"
//                         style={{ 
//                           color: iconColor, 
//                           backgroundColor: `${iconColor}20` 
//                         }}
//                       >
//                         <span className="material-symbols-outlined text-inherit text-sm">{icon}</span>
//                       </div>
//                       <div className="flex flex-col justify-center flex-1 min-w-0">
//                         <p className="text-white text-sm font-medium truncate">
//                           {event.title}
//                         </p>
//                         <p className="text-[#92adc9] text-xs font-normal truncate">
//                           {timeText}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 {selectedDateEvents.length === 0 && (
//                   <p className="text-[#92adc9] text-center py-2 text-sm">
//                     No events for selected date
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Event Details */}
//             <div className="flex-1 flex flex-col p-4 bg-[#233648] overflow-y-auto">
//               <h2 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-3">
//                 {selectedEvent ? (selectedEvent.name || 'Event Details') : 'Event Information'}
//               </h2>
              
//               {selectedEvent ? (
//                 <div className="space-y-3">
//                   {selectedEvent.type === 'holiday' ? (
//                     <div className="text-center p-3 bg-[#ef4444]/20 rounded-lg">
//                       <h3 className="text-xl font-bold text-white mb-2">🎉 {selectedEvent.name}</h3>
//                       <p className="text-[#3b82f6] text-sm">Public Holiday</p>
//                       <p className="text-white mt-1 text-sm">Location: {selectedEvent.location || selectedEvent.country || 'India'}</p>
//                       <p className="text-white mt-1 text-sm">Type: {selectedEvent.type || 'Observance'}</p>
//                       <p className="text-xs text-[#92adc9] mt-1">Date: {selectedEvent.date}</p>
//                     </div>
//                   ) : (
//                     <>
//                       <div>
//                         <h3 className="text-md font-bold text-white">
//                           {selectedEvent.name}
//                         </h3>
//                         {selectedEvent.thumbnail ? (
//                           <img 
//                             src={selectedEvent.thumbnail} 
//                             alt={selectedEvent.name}
//                             className="w-full aspect-video object-cover rounded-lg mt-2"
//                             onError={(e) => {
//                               e.target.style.display = 'none';
//                             }}
//                           />
//                         ) : (
//                           <div 
//                             className="w-full aspect-video bg-gradient-to-br from-[#3b82f6] to-[#ef4444] rounded-lg flex items-center justify-center mt-2"
//                           >
//                             <span className="material-symbols-outlined text-white text-2xl">event</span>
//                           </div>
//                         )}
//                         <p className="text-[#92adc9] text-sm mt-1 line-clamp-2">{selectedEvent.description}</p>
//                         <p className="text-xs text-gray-400 mt-1">Published by {selectedEvent.publisher}</p>
//                       </div>

//                       {/* Map for Mobile */}
//                       {selectedEvent.venue && selectedEvent.venue.latitude && selectedEvent.venue.longitude && (
//                         <div className="mt-3">
//                           <h4 className="font-semibold text-white mb-2 text-sm">🗺️ Location:</h4>
//                           <div className="w-full h-32 rounded-lg overflow-hidden">
//                             <MapContainer
//                               center={[parseFloat(selectedEvent.venue.latitude), parseFloat(selectedEvent.venue.longitude)]}
//                               zoom={13}
//                               style={{ height: '100%', width: '100%' }}
//                             >
//                               <TileLayer
//                                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                               />
//                               <Marker
//                                 position={[
//                                   parseFloat(selectedEvent.venue.latitude),
//                                   parseFloat(selectedEvent.venue.longitude)
//                                 ]}
//                               >
//                                 <Popup>
//                                   <div className="text-black p-2">
//                                     <strong className="text-sm block">{selectedEvent.venue.name}</strong>
//                                   </div>
//                                 </Popup>
//                               </Marker>
//                             </MapContainer>
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center text-[#92adc9] py-4">
//                   <div className="text-2xl mb-2">📅</div>
//                   <p className="text-center text-sm">Select a date or event to view details</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       ) : (
//         /* Desktop Layout */
//         <div className="flex h-screen flex-col lg:flex-row">
//           {/* Sidebar */}
//           <div className="w-full lg:w-1/3 bg-[#111a22] p-4 lg:p-6 space-y-4 lg:space-y-6 overflow-y-auto lg:h-full">
//             {/* User Profile */}
//             <div className="flex items-center gap-3">
//               <div 
//                 className="bg-cover bg-center bg-no-repeat aspect-square rounded-full size-12"
//                 style={{ 
//                   backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCp0v2J2WQDvDiRABiJTC3SOzGorY9EPKYct4xgW0uaJ9VOdrIYFiMvOCd40rIiFQhmmz1-jcWWZI4zYvUs_btUgL9AalCy56y1aNHbXc7qZ203GPDRnHvmVPcC0ZKRicyndqMp397b3bv_O8B8LTtf6xpko0z_tYygEXLJxFV8cOmnUV-J5Ou_sdVeIosWN67E8DXu8bWCLuqt_Eg0nDEro8LxIvf9OspSG4lzjcy1UiuS5ldGRXcxjZlrH72V3DyOW-Vc3Ece7h9c")' 
//                 }}
//               />
//               <div>
//                 <h1 className="text-white text-lg font-medium">John Doe</h1>
//                 <p className="text-[#92adc9] text-sm">johndoe@example.com</p>
//               </div>
//             </div>

//             {/* Create Event Button */}
//             <button className="w-full flex items-center justify-center rounded-lg h-12 px-4 bg-[#3b82f6] text-white text-sm font-bold tracking-wider hover:bg-[#2563eb] transition-colors">
//               CREATE EVENT
//             </button>

//             {/* Events and Holidays List */}
//             <div className="flex flex-col gap-4">
//               <h2 className="text-lg font-semibold text-white">
//                 {selectedDateEvents.length > 0 
//                   ? `Events & Holidays for ${selectedDate ? selectedDate.toLocaleDateString('en-IN', {
//                       weekday: 'long',
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric'
//                     }) : ''}`
//                   : 'Select a date to view events'
//                 }
//               </h2>
//               <div className="flex flex-col gap-2 max-h-48 lg:max-h-64 overflow-y-auto">
//                 {selectedDateEvents.map(event => {
//                   const type = event.extendedProps?.type || 'event';
//                   const icon = type === 'holiday' ? 'celebration' : 'event';
//                   const iconColor = type === 'holiday' ? '#ef4444' : '#3b82f6';
//                   const iconBg = type === 'holiday' ? '#ef4444' : '#3b82f6';
//                   const bgClass = type === 'holiday' ? 'bg-[#111a22] hover:bg-[#233648]' : 'bg-[#233648] hover:bg-[#2e4257]';
//                   const timeText = type === 'event' 
//                     ? `${new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${event.end ? new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'All day'}`
//                     : 'All day';
//                   return (
//                     <div
//                       key={event.id}
//                       className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors ${bgClass}`}
//                       onClick={() => setSelectedEvent(event.extendedProps)}
//                     >
//                       <div 
//                         className="flex items-center justify-center rounded-lg size-12"
//                         style={{ 
//                           color: iconColor, 
//                           backgroundColor: `${iconBg}20` 
//                         }}
//                       >
//                         <span className="material-symbols-outlined text-inherit">{icon}</span>
//                       </div>
//                       <div className="flex flex-col justify-center flex-1 min-w-0">
//                         <p className="text-white text-base font-medium truncate">
//                           {event.title}
//                         </p>
//                         <p className="text-[#92adc9] text-sm font-normal truncate">
//                           {timeText}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 {selectedDateEvents.length === 0 && (
//                   <p className="text-[#92adc9] text-center py-4">
//                     No events for selected date
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Event Details */}
//             <div className="flex-grow flex flex-col gap-4 p-4 bg-[#233648] rounded-lg min-h-0">
//               <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">
//                 {selectedEvent ? (selectedEvent.name || 'Event Details') : 'Event Information'}
//               </h2>
              
//               {selectedEvent ? (
//                 <div className="space-y-3 flex-1 flex flex-col overflow-y-auto">
//                   {selectedEvent.type === 'holiday' ? (
//                     <div className="text-center p-4 bg-[#ef4444]/20 rounded-lg">
//                       <h3 className="text-2xl font-bold text-white mb-2">🎉 {selectedEvent.name}</h3>
//                       <p className="text-[#3b82f6]">Public Holiday</p>
//                       <p className="text-white mt-2">Location: {selectedEvent.location || selectedEvent.country || 'India'}</p>
//                       <p className="text-white mt-1">Type: {selectedEvent.type || 'Observance'}</p>
//                       <p className="text-sm text-[#92adc9]">Date: {selectedEvent.date}</p>
//                       {selectedEvent.description && (
//                         <p className="text-sm text-[#92adc9] mt-2">{selectedEvent.description}</p>
//                       )}
//                     </div>
//                   ) : (
//                     <>
//                       <div>
//                         <h3 className="text-lg font-bold text-white">
//                           {selectedEvent.name}
//                         </h3>
//                         {selectedEvent.thumbnail ? (
//                           <img 
//                             src={selectedEvent.thumbnail} 
//                             alt={selectedEvent.name}
//                             className="w-full aspect-video object-cover rounded-lg mt-2"
//                             onError={(e) => {
//                               e.target.style.display = 'none';
//                               e.target.nextSibling.style.display = 'flex';
//                             }}
//                           />
//                         ) : null}
//                         <div 
//                           className="w-full aspect-video bg-gradient-to-br from-[#3b82f6] to-[#ef4444] rounded-lg flex items-center justify-center mt-2 relative overflow-hidden"
//                           style={{ display: selectedEvent.thumbnail ? 'none' : 'flex' }}
//                         >
//                           <span className="material-symbols-outlined text-white text-4xl">event</span>
//                         </div>
//                         <p className="text-[#92adc9] text-sm mt-1">{selectedEvent.description}</p>
//                         <p className="text-xs text-gray-400">Published by {selectedEvent.publisher}</p>
//                       </div>

//                       {selectedEvent.venue && (
//                         <div className="border-t border-gray-700 my-2 pt-2">
//                           <h4 className="font-semibold text-white mb-2">📍 Venue:</h4>
//                           <p className="text-sm text-[#92adc9]">
//                             <span className="font-medium text-white block">{selectedEvent.venue.name}</span>
//                             <span className="block">{selectedEvent.venue.full_address}</span>
//                           </p>
//                           {selectedEvent.venue.phone_number && (
//                             <p className="text-sm text-[#92adc9] mt-1">Phone: {selectedEvent.venue.phone_number}</p>
//                           )}
//                           {selectedEvent.venue.website && (
//                             <a 
//                               href={selectedEvent.venue.website} 
//                               target="_blank" 
//                               rel="noopener noreferrer"
//                               className="text-sm text-[#3b82f6] hover:text-white mt-1 block"
//                             >
//                               Website: {selectedEvent.venue.website}
//                             </a>
//                           )}
//                           {selectedEvent.venue.rating && (
//                             <div className="flex items-center gap-2 mt-1">
//                               <div className="flex text-yellow-400">
//                                 {[...Array(Math.floor(selectedEvent.venue.rating))].map((_, i) => (
//                                   <span key={i} className="material-symbols-outlined !text-base">star</span>
//                                 ))}
//                                 {selectedEvent.venue.rating % 1 !== 0 && (
//                                   <span className="material-symbols-outlined !text-base">star_half</span>
//                                 )}
//                               </div>
//                               <p className="text-xs text-[#92adc9]">({selectedEvent.venue.review_count} reviews)</p>
//                             </div>
//                           )}
//                           {selectedEvent.venue.subtypes && selectedEvent.venue.subtypes.length > 0 && (
//                             <div className="flex flex-wrap gap-1 mt-2">
//                               {selectedEvent.venue.subtypes.map((subtype, index) => (
//                                 <span 
//                                   key={index}
//                                   className="px-2 py-1 bg-[#3b82f6] text-white text-xs rounded-full"
//                                 >
//                                   {subtype}
//                                 </span>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       )}

//                       <div className="border-t border-gray-700 my-2 pt-2">
//                         <h4 className="font-semibold text-white mb-2">🕐 Date & Time:</h4>
//                         <p className="text-sm text-[#92adc9]">{selectedEvent.date_human_readable}</p>
//                       </div>

//                       {selectedEvent.ticket_links && selectedEvent.ticket_links.length > 0 && (
//                         <div className="space-y-2">
//                           <h4 className="font-semibold text-white">🎫 Ticket Links:</h4>
//                           <div className="space-y-2 mt-2">
//                             {selectedEvent.ticket_links.map((link, index) => (
//                               link && link.link && (
//                                 <a
//                                   key={index}
//                                   href={link.link}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="flex items-center space-x-2 p-2 bg-[#233648] rounded hover:bg-[#2e4257] transition-colors"
//                                 >
//                                   {link.fav_icon && (
//                                     <img 
//                                       src={link.fav_icon} 
//                                       alt={link.source}
//                                       className="w-4 h-4 rounded"
//                                       onError={(e) => {
//                                         e.target.style.display = 'none';
//                                       }}
//                                     />
//                                   )}
//                                   <span className="text-[#3b82f6] hover:text-white text-sm">
//                                     {link.source}
//                                   </span>
//                                 </a>
//                               )
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {selectedEvent.ticket_links && selectedEvent.ticket_links.length > 0 && (
//                         <button className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-[#3b82f6] text-white text-sm font-bold tracking-wider hover:bg-[#2563eb] transition-colors">
//                           GET TICKETS
//                         </button>
//                       )}

//                       {/* Map */}
//                       <div className="mt-4">
//                         <h4 className="font-semibold text-white mb-2">🗺️ Location Map:</h4>
//                         <div className="w-full h-48 rounded-lg overflow-hidden">
//                           <MapContainer
//                             center={
//                               selectedEvent.type === 'event' && selectedEvent.venue && selectedEvent.venue.latitude && selectedEvent.venue.longitude
//                                 ? [parseFloat(selectedEvent.venue.latitude), parseFloat(selectedEvent.venue.longitude)]
//                                 : defaultCenter
//                             }
//                             zoom={
//                               selectedEvent.type === 'event' && selectedEvent.venue ? 13 : 5
//                             }
//                             style={{ height: '100%', width: '100%' }}
//                           >
//                             <TileLayer
//                               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                             />
//                             {selectedEvent.type === 'event' && selectedEvent.venue && selectedEvent.venue.latitude && selectedEvent.venue.longitude && (
//                               <Marker
//                                 position={[
//                                   parseFloat(selectedEvent.venue.latitude),
//                                   parseFloat(selectedEvent.venue.longitude)
//                                 ]}
//                               >
//                                 <Popup>
//                                   <div className="text-black p-2">
//                                     <strong className="text-lg block">{selectedEvent.venue.name}</strong>
//                                     <span className="text-sm block">{selectedEvent.venue.full_address}</span>
//                                     {selectedEvent.venue.phone_number && (
//                                       <span className="text-sm block">📞 {selectedEvent.venue.phone_number}</span>
//                                     )}
//                                     {selectedEvent.venue.rating && (
//                                       <span className="text-sm block">
//                                         ⭐ {selectedEvent.venue.rating} ({selectedEvent.venue.review_count} reviews)
//                                       </span>
//                                     )}
//                                   </div>
//                                 </Popup>
//                               </Marker>
//                             )}
//                           </MapContainer>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex-1 flex flex-col items-center justify-center text-[#92adc9] py-8">
//                   <div className="text-4xl mb-4">📅</div>
//                   <p className="text-center">Select a date or event to view details</p>
//                   <p className="text-sm mt-2 text-center">Click on any date to see events and holidays</p>
//                   <p className="text-sm text-center">Click on events to see detailed information</p>
//                 </div>
//               )}
//             </div>

//             {/* Settings */}
//             <div className="pt-4 border-t border-gray-700">
//               <div className="flex items-center gap-3 px-3 py-2 cursor-pointer text-[#92adc9] hover:text-white rounded-lg hover:bg-[#233648] transition-colors">
//                 <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>settings</span>
//                 <p className="text-sm font-medium">Settings</p>
//               </div>
//             </div>
//           </div>

//           {/* Main Content - Calendar */}
//           <div className="w-full lg:w-2/3 p-4 lg:p-6 bg-[#101922] flex-1 flex flex-col min-h-0">
//             <div className="flex flex-col h-full">
//               {/* Navigation */}
//               <div className="flex items-center justify-between mb-4">
//                 <button 
//                   onClick={handlePrev}
//                   className="text-white flex size-10 items-center justify-center hover:bg-[#233648] rounded-full transition-colors"
//                 >
//                   <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_left</span>
//                 </button>
//                 <h2 className="text-white text-2xl font-bold leading-tight flex-1 text-center">
//                   {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                 </h2>
//                 <button 
//                   onClick={handleNext}
//                   className="text-white flex size-10 items-center justify-center hover:bg-[#233648] rounded-full transition-colors"
//                 >
//                   <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
//                 </button>
//               </div>

//               {/* FullCalendar */}
//               <div className="flex-grow min-h-0 bg-[#111a22] rounded-lg p-4">
//                 <FullCalendar
//                   ref={calendarRef}
//                   plugins={[dayGridPlugin, interactionPlugin]}
//                   initialView="dayGridMonth"
//                   headerToolbar={false}
//                   events={[...events, ...holidays]}
//                   dateClick={handleDateClick}
//                   eventClick={handleEventClick}
//                   eventContent={renderEventContent}
//                   height="100%"
//                   locale="en"
//                   dayMaxEvents={3}
//                   moreLinkText="more"
//                   eventOrder="start,-duration,allDay,title"
//                   datesSet={(dateInfo) => {
//                     setCurrentDate(dateInfo.start);
//                   }}
//                   dayHeaderClassNames="text-white font-semibold text-sm border-b border-gray-600 py-2"
//                   dayCellClassNames="border border-gray-700 hover:bg-[#233648] transition-colors"
//                   dayCellContent={(args) => (
//                     <div className="flex items-center justify-center h-full w-full p-1">
//                       <div className="text-white text-sm font-medium">
//                         {args.dayNumberText}
//                       </div>
//                     </div>
//                   )}
//                   dayHeaderContent={(args) => (
//                     <div className="text-white text-sm font-semibold uppercase tracking-wide text-center">
//                       {args.text}
//                     </div>
//                   )}
//                   eventClassNames="cursor-pointer rounded-lg border-0"
//                   moreLinkClassNames="text-[#3b82f6] hover:text-[#2563eb] text-sm font-medium"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Calendar;










































































import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const calendarRef = useRef(null);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Load Google Fonts for Inter and Material Symbols
  useEffect(() => {
    const link1 = document.createElement('link');
    link1.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
    link1.rel = 'stylesheet';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL@20..48,100..700,0..1';
    link2.rel = 'stylesheet';
    document.head.appendChild(link2);

    return () => {
      if (document.head.contains(link1)) document.head.removeChild(link1);
      if (document.head.contains(link2)) document.head.removeChild(link2);
    };
  }, []);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsResponse = await fetch('http://127.0.0.1:8003/EventListAPIView');
        
        if (!eventsResponse.ok) {
          throw new Error(`HTTP error! status: ${eventsResponse.status}`);
        }
        
        const eventsData = await eventsResponse.json();
        
        // Transform events data for FullCalendar
        const formattedEvents = eventsData.map(event => ({
          id: `event-${event.id}`,
          title: event.name,
          start: event.start_time,
          end: event.end_time || event.start_time,
          extendedProps: {
            ...event,
            type: 'event'
          },
          backgroundColor: '#e5e7eb',
          borderColor: '#d1d5db',
          textColor: '#111827'
        }));

        setEvents(formattedEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        // Fallback to empty events if API fails
        setEvents([]);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Fetch holidays for current month when month changes
  useEffect(() => {
    const fetchHolidaysForMonth = async () => {
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        
        const holidaysResponse = await fetch(
          `https://holidays.abstractapi.com/v1/?api_key=6caf3d07b678468f96e31f9f4d1f9077&country=IN&year=${year}&month=${month}`
        );
        
        if (!holidaysResponse.ok) {
          throw new Error(`HTTP error! status: ${holidaysResponse.status}`);
        }
        
        const holidaysData = await holidaysResponse.json();
        
        const formattedHolidays = holidaysData.map(holiday => ({
          id: `holiday-${holiday.date}-${holiday.name}`,
          title: holiday.name,
          start: holiday.date,
          allDay: true,
          extendedProps: {
            ...holiday,
            type: 'holiday'
          },
          backgroundColor: '#fee2e2',
          borderColor: '#fca5a5',
          textColor: '#991b1b'
        }));

        setHolidays(formattedHolidays);
      } catch (error) {
        console.error('Error fetching holidays:', error);
        // Fallback to empty holidays if API fails
        setHolidays([]);
      }
    };

    fetchHolidaysForMonth();
  }, [currentDate]);

  const handleDateClick = async (info) => {
    const clickedDate = info.date;
    setSelectedDate(new Date(clickedDate));
    const dateStr = clickedDate.toISOString().split('T')[0];
    
    // Filter events for the clicked date
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.start).toISOString().split('T')[0];
      return eventDate === dateStr;
    });

    // Filter holidays for the clicked date
    const dayHolidaysData = holidays.filter(holiday => {
      const hDate = new Date(holiday.start).toISOString().split('T')[0];
      return hDate === dateStr;
    });

    // Fetch additional holidays for the specific day from API
    try {
      const year = clickedDate.getFullYear();
      const month = clickedDate.getMonth() + 1;
      const day = clickedDate.getDate();
      
      const dailyHolidaysResponse = await fetch(
        `https://holidays.abstractapi.com/v1/?api_key=6caf3d07b678468f96e31f9f4d1f9077&country=IN&year=${year}&month=${month}&day=${day}`
      );
      
      if (dailyHolidaysResponse.ok) {
        const dailyHolidaysData = await dailyHolidaysResponse.json();
        
        const additionalHolidays = dailyHolidaysData.map(holiday => ({
          id: `holiday-${holiday.date}-${holiday.name}-daily`,
          title: holiday.name,
          start: holiday.date,
          allDay: true,
          extendedProps: {
            ...holiday,
            type: 'holiday'
          },
          backgroundColor: '#fee2e2',
          borderColor: '#fca5a5',
          textColor: '#991b1b'
        }));

        // Combine all events and holidays
        const allHolidayEvents = [...dayHolidaysData, ...additionalHolidays];
        const uniqueHolidays = allHolidayEvents.filter((holiday, index, self) => 
          index === self.findIndex(h => h.id === holiday.id)
        );

        const holidayEvents = uniqueHolidays.map(holiday => ({
          ...holiday,
          title: `🎉 ${holiday.title}`
        }));

        setSelectedDateEvents([...dayEvents, ...holidayEvents]);
      } else {
        // Use existing holidays if API call fails
        const holidayEvents = dayHolidaysData.map(holiday => ({
          ...holiday,
          title: `🎉 ${holiday.title}`
        }));
        setSelectedDateEvents([...dayEvents, ...holidayEvents]);
      }
    } catch (error) {
      console.error('Error fetching daily holidays:', error);
      // Use existing holidays if API call fails
      const holidayEvents = dayHolidaysData.map(holiday => ({
        ...holiday,
        title: `🎉 ${holiday.title}`
      }));
      setSelectedDateEvents([...dayEvents, ...holidayEvents]);
    }
    
    setSelectedEvent(null);
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps);
  };

  const renderEventContent = (eventInfo) => {
    const eventType = eventInfo.event.extendedProps.type;
    
    if (eventType === 'holiday') {
      return (
        <div className="p-1 text-xs">
          <div className="font-semibold truncate">🎉 {eventInfo.event.title}</div>
        </div>
      );
    }

    return (
      <div className="p-1 text-xs">
        <div className="font-semibold truncate">{eventInfo.event.title}</div>
        <div className="text-black truncate">
          {new Date(eventInfo.event.start).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    );
  };

  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
    }
  };

  // Default center for map (India)
  const defaultCenter = [20.5937, 78.9629];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-black text-xl">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-['Inter',sans-serif]">
      {/* Mobile Layout */}
      {isMobile ? (
        <div className="flex flex-col h-screen">
          {/* Calendar Section - Top on Mobile */}
          <div className="flex-1 flex flex-col p-4 bg-white min-h-0">
            <div className="flex flex-col h-full">
              {/* Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={handlePrev}
                  className="text-black flex size-10 items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_left</span>
                </button>
                <h2 className="text-black text-xl font-bold leading-tight flex-1 text-center">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <button 
                  onClick={handleNext}
                  className="text-black flex size-10 items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
                </button>
              </div>

              {/* FullCalendar */}
              <div className="flex-grow min-h-0 bg-white rounded-lg p-2">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={false}
                  events={[...events, ...holidays]}
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                  eventContent={renderEventContent}
                  height="100%"
                  locale="en"
                  dayMaxEvents={3}
                  moreLinkText="more"
                  eventOrder="start,-duration,allDay,title"
                  datesSet={(dateInfo) => {
                    setCurrentDate(dateInfo.start);
                  }}
                  dayHeaderClassNames="text-black font-semibold text-xs border-b border-gray-300 py-1"
                  dayCellClassNames="border border-gray-300 hover:bg-gray-50 transition-colors"
                  dayCellContent={(args) => (
                    <div className="flex items-center justify-center h-full w-full p-1">
                      <div className="text-black text-xs font-medium">
                        {args.dayNumberText}
                      </div>
                    </div>
                  )}
                  dayHeaderContent={(args) => (
                    <div className="text-black text-xs font-semibold uppercase tracking-wide text-center">
                      {args.text.substring(0, 3)}
                    </div>
                  )}
                  eventClassNames="cursor-pointer rounded-lg border-0 text-xs"
                  moreLinkClassNames="text-gray-600 hover:text-gray-800 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Events & Details Section - Bottom on Mobile */}
          <div className="flex-1 flex flex-col bg-white border-t border-gray-300 overflow-hidden">
            {/* Events List */}
            <div className="flex-shrink-0 p-4 border-b border-gray-300">
              <h2 className="text-lg font-semibold text-black mb-3">
                {selectedDateEvents.length > 0 
                  ? `Events & Holidays for ${selectedDate ? selectedDate.toLocaleDateString('en-IN', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    }) : ''}`
                  : 'Select a date to view events'
                }
              </h2>
              <div className="max-h-32 overflow-y-auto">
                {selectedDateEvents.map(event => {
                  const type = event.extendedProps?.type || 'event';
                  const icon = type === 'holiday' ? 'celebration' : 'event';
                  const iconColor = type === 'holiday' ? '#dc2626' : '#6b7280';
                  const bgClass = type === 'holiday' ? 'bg-red-50 hover:bg-red-100' : 'bg-gray-100 hover:bg-gray-200';
                  const timeText = type === 'event' 
                    ? `${new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : 'All day';
                  return (
                    <div
                      key={event.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${bgClass} mb-2`}
                      onClick={() => setSelectedEvent(event.extendedProps)}
                    >
                      <div 
                        className="flex items-center justify-center rounded-lg size-8"
                        style={{ 
                          color: iconColor, 
                          backgroundColor: `${iconColor}20` 
                        }}
                      >
                        <span className="material-symbols-outlined text-inherit text-sm">{icon}</span>
                      </div>
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <p className="text-black text-sm font-medium truncate">
                          {event.title}
                        </p>
                        <p className="text-gray-600 text-xs font-normal truncate">
                          {timeText}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {selectedDateEvents.length === 0 && (
                  <p className="text-gray-500 text-center py-2 text-sm">
                    No events for selected date
                  </p>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="flex-1 flex flex-col p-4 bg-gray-50 overflow-y-auto">
              <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3 text-black">
                {selectedEvent ? (selectedEvent.name || 'Event Details') : 'Event Information'}
              </h2>
              
              {selectedEvent ? (
                <div className="space-y-3">
                  {selectedEvent.type === 'holiday' ? (
                    <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <h3 className="text-xl font-bold text-black mb-2">🎉 {selectedEvent.name}</h3>
                      <p className="text-red-600 text-sm">Public Holiday</p>
                      <p className="text-black mt-1 text-sm">Location: {selectedEvent.location || selectedEvent.country || 'India'}</p>
                      <p className="text-black mt-1 text-sm">Type: {selectedEvent.type || 'Observance'}</p>
                      <p className="text-xs text-gray-600 mt-1">Date: {selectedEvent.date}</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-md font-bold text-black">
                          {selectedEvent.name}
                        </h3>
                        {selectedEvent.thumbnail ? (
                          <img 
                            src={selectedEvent.thumbnail} 
                            alt={selectedEvent.name}
                            className="w-full aspect-video object-cover rounded-lg mt-2"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div 
                            className="w-full aspect-video bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center mt-2"
                          >
                            <span className="material-symbols-outlined text-white text-2xl">event</span>
                          </div>
                        )}
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{selectedEvent.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Published by {selectedEvent.publisher}</p>
                      </div>

                      {/* Map for Mobile */}
                      {selectedEvent.venue && selectedEvent.venue.latitude && selectedEvent.venue.longitude && (
                        <div className="mt-3">
                          <h4 className="font-semibold text-black mb-2 text-sm">🗺️ Location:</h4>
                          <div className="w-full h-32 rounded-lg overflow-hidden">
                            <MapContainer
                              center={[parseFloat(selectedEvent.venue.latitude), parseFloat(selectedEvent.venue.longitude)]}
                              zoom={13}
                              style={{ height: '100%', width: '100%' }}
                            >
                              <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              />
                              <Marker
                                position={[
                                  parseFloat(selectedEvent.venue.latitude),
                                  parseFloat(selectedEvent.venue.longitude)
                                ]}
                              >
                                <Popup>
                                  <div className="text-black p-2">
                                    <strong className="text-sm block">{selectedEvent.venue.name}</strong>
                                  </div>
                                </Popup>
                              </Marker>
                            </MapContainer>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500 py-4">
                  <div className="text-2xl mb-2">📅</div>
                  <p className="text-center text-sm">Select a date or event to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Layout */
        <div className="flex h-screen flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-1/3 bg-white p-4 lg:p-6 space-y-4 lg:space-y-6 overflow-y-auto lg:h-full border-r border-gray-200">
            {/* Create Event Button */}
            {/* <button className="w-full flex items-center justify-center rounded-lg h-12 px-4 bg-gray-800 text-white text-sm font-bold tracking-wider hover:bg-gray-900 transition-colors">
              CREATE EVENT
            </button> */}

            {/* Events and Holidays List */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-black">
                {selectedDateEvents.length > 0 
                  ? `Events & Holidays for ${selectedDate ? selectedDate.toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : ''}`
                  : 'Select a date to view events'
                }
              </h2>
              <div className="flex flex-col gap-2 max-h-48 lg:max-h-64 overflow-y-auto">
                {selectedDateEvents.map(event => {
                  const type = event.extendedProps?.type || 'event';
                  const icon = type === 'holiday' ? 'celebration' : 'event';
                  const iconColor = type === 'holiday' ? '#dc2626' : '#6b7280';
                  const iconBg = type === 'holiday' ? '#dc2626' : '#6b7280';
                  const bgClass = type === 'holiday' ? 'bg-red-50 hover:bg-red-100' : 'bg-gray-100 hover:bg-gray-200';
                  const timeText = type === 'event' 
                    ? `${new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${event.end ? new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'All day'}`
                    : 'All day';
                  return (
                    <div
                      key={event.id}
                      className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors ${bgClass}`}
                      onClick={() => setSelectedEvent(event.extendedProps)}
                    >
                      <div 
                        className="flex items-center justify-center rounded-lg size-12"
                        style={{ 
                          color: iconColor, 
                          backgroundColor: `${iconBg}20` 
                        }}
                      >
                        <span className="material-symbols-outlined text-inherit">{icon}</span>
                      </div>
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <p className="text-black text-base font-medium truncate">
                          {event.title}
                        </p>
                        <p className="text-gray-600 text-sm font-normal truncate">
                          {timeText}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {selectedDateEvents.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No events for selected date
                  </p>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="flex-grow flex flex-col gap-4 p-4 bg-gray-50 rounded-lg min-h-0 border-t border-gray-200">
              <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 text-black">
                {selectedEvent ? (selectedEvent.name || 'Event Details') : 'Event Information'}
              </h2>
              
              {selectedEvent ? (
                <div className="space-y-3 flex-1 flex flex-col overflow-y-auto">
                  {selectedEvent.type === 'holiday' ? (
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <h3 className="text-2xl font-bold text-black mb-2">🎉 {selectedEvent.name}</h3>
                      <p className="text-red-600">Public Holiday</p>
                      <p className="text-black mt-2">Location: {selectedEvent.location || selectedEvent.country || 'India'}</p>
                      <p className="text-black mt-1">Type: {selectedEvent.type || 'Observance'}</p>
                      <p className="text-sm text-gray-600">Date: {selectedEvent.date}</p>
                      {selectedEvent.description && (
                        <p className="text-sm text-gray-600 mt-2">{selectedEvent.description}</p>
                      )}
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-lg font-bold text-black">
                          {selectedEvent.name}
                        </h3>
                        {selectedEvent.thumbnail ? (
                          <img 
                            src={selectedEvent.thumbnail} 
                            alt={selectedEvent.name}
                            className="w-full aspect-video object-cover rounded-lg mt-2"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-full aspect-video bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center mt-2 relative overflow-hidden"
                          style={{ display: selectedEvent.thumbnail ? 'none' : 'flex' }}
                        >
                          <span className="material-symbols-outlined text-white text-4xl">event</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{selectedEvent.description}</p>
                        <p className="text-xs text-gray-500">Published by {selectedEvent.publisher}</p>
                      </div>

                      {selectedEvent.venue && (
                        <div className="border-t border-gray-300 my-2 pt-2">
                          <h4 className="font-semibold text-black mb-2">📍 Venue:</h4>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-black block">{selectedEvent.venue.name}</span>
                            <span className="block">{selectedEvent.venue.full_address}</span>
                          </p>
                          {selectedEvent.venue.phone_number && (
                            <p className="text-sm text-gray-600 mt-1">Phone: {selectedEvent.venue.phone_number}</p>
                          )}
                          {selectedEvent.venue.website && (
                            <a 
                              href={selectedEvent.venue.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-gray-600 hover:text-black mt-1 block"
                            >
                              Website: {selectedEvent.venue.website}
                            </a>
                          )}
                          {selectedEvent.venue.rating && (
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex text-yellow-400">
                                {[...Array(Math.floor(selectedEvent.venue.rating))].map((_, i) => (
                                  <span key={i} className="material-symbols-outlined !text-base">star</span>
                                ))}
                                {selectedEvent.venue.rating % 1 !== 0 && (
                                  <span className="material-symbols-outlined !text-base">star_half</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600">({selectedEvent.venue.review_count} reviews)</p>
                            </div>
                          )}
                          {selectedEvent.venue.subtypes && selectedEvent.venue.subtypes.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {selectedEvent.venue.subtypes.map((subtype, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-gray-200 text-black text-xs rounded-full"
                                >
                                  {subtype}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="border-t border-gray-300 my-2 pt-2">
                        <h4 className="font-semibold text-black mb-2">🕐 Date & Time:</h4>
                        <p className="text-sm text-gray-600">{selectedEvent.date_human_readable}</p>
                      </div>

                      {selectedEvent.ticket_links && selectedEvent.ticket_links.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-black">🎫 Ticket Links:</h4>
                          <div className="space-y-2 mt-2">
                            {selectedEvent.ticket_links.map((link, index) => (
                              link && link.link && (
                                <a
                                  key={index}
                                  href={link.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                                >
                                  {link.fav_icon && (
                                    <img 
                                      src={link.fav_icon} 
                                      alt={link.source}
                                      className="w-4 h-4 rounded"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                  )}
                                  <span className="text-gray-600 hover:text-black text-sm">
                                    {link.source}
                                  </span>
                                </a>
                              )
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedEvent.ticket_links && selectedEvent.ticket_links.length > 0 && (
                        <button className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-gray-800 text-white text-sm font-bold tracking-wider hover:bg-gray-900 transition-colors">
                          GET TICKETS
                        </button>
                      )}

                      {/* Map */}
                      <div className="mt-4">
                        <h4 className="font-semibold text-black mb-2">🗺️ Location Map:</h4>
                        <div className="w-full h-48 rounded-lg overflow-hidden">
                          <MapContainer
                            center={
                              selectedEvent.type === 'event' && selectedEvent.venue && selectedEvent.venue.latitude && selectedEvent.venue.longitude
                                ? [parseFloat(selectedEvent.venue.latitude), parseFloat(selectedEvent.venue.longitude)]
                                : defaultCenter
                            }
                            zoom={
                              selectedEvent.type === 'event' && selectedEvent.venue ? 13 : 5
                            }
                            style={{ height: '100%', width: '100%' }}
                          >
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {selectedEvent.type === 'event' && selectedEvent.venue && selectedEvent.venue.latitude && selectedEvent.venue.longitude && (
                              <Marker
                                position={[
                                  parseFloat(selectedEvent.venue.latitude),
                                  parseFloat(selectedEvent.venue.longitude)
                                ]}
                              >
                                <Popup>
                                  <div className="text-black p-2">
                                    <strong className="text-lg block">{selectedEvent.venue.name}</strong>
                                    <span className="text-sm block">{selectedEvent.venue.full_address}</span>
                                    {selectedEvent.venue.phone_number && (
                                      <span className="text-sm block">📞 {selectedEvent.venue.phone_number}</span>
                                    )}
                                    {selectedEvent.venue.rating && (
                                      <span className="text-sm block">
                                        ⭐ {selectedEvent.venue.rating} ({selectedEvent.venue.review_count} reviews)
                                      </span>
                                    )}
                                  </div>
                                </Popup>
                              </Marker>
                            )}
                          </MapContainer>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-8">
                  <div className="text-4xl mb-4">📅</div>
                  <p className="text-center">Select a date or event to view details</p>
                  <p className="text-sm mt-2 text-center">Click on any date to see events and holidays</p>
                  <p className="text-sm text-center">Click on events to see detailed information</p>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="pt-4 border-t border-gray-300">
              <div className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-600 hover:text-black rounded-lg hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>settings</span>
                <p className="text-sm font-medium">Settings</p>
              </div>
            </div>
          </div>

          {/* Main Content - Calendar */}
          <div className="w-full lg:w-2/3 p-4 lg:p-6 bg-white flex-1 flex flex-col min-h-0">
            <div className="flex flex-col h-full">
              {/* Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={handlePrev}
                  className="text-black flex size-10 items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_left</span>
                </button>
                <h2 className="text-black text-2xl font-bold leading-tight flex-1 text-center">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <button 
                  onClick={handleNext}
                  className="text-black flex size-10 items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
                </button>
              </div>

              {/* FullCalendar */}
              <div className="flex-grow min-h-0 bg-white rounded-lg p-4">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={false}
                  events={[...events, ...holidays]}
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                  eventContent={renderEventContent}
                  height="100%"
                  locale="en"
                  dayMaxEvents={3}
                  moreLinkText="more"
                  eventOrder="start,-duration,allDay,title"
                  datesSet={(dateInfo) => {
                    setCurrentDate(dateInfo.start);
                  }}
                  dayHeaderClassNames="text-black font-semibold text-sm border-b border-gray-300 py-2"
                  dayCellClassNames="border border-gray-300 hover:bg-gray-50 transition-colors"
                  dayCellContent={(args) => (
                    <div className="flex items-center justify-center h-full w-full p-1">
                      <div className="text-black text-sm font-medium">
                        {args.dayNumberText}
                      </div>
                    </div>
                  )}
                  dayHeaderContent={(args) => (
                    <div className="text-black text-sm font-semibold uppercase tracking-wide text-center">
                      {args.text}
                    </div>
                  )}
                  eventClassNames="cursor-pointer rounded-lg border-0"
                  moreLinkClassNames="text-gray-600 hover:text-gray-800 text-sm font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;