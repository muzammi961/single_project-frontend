import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendar = () => {
  const calendarRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [events, setEvents] = useState([]);
  const [eventImages, setEventImages] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events list
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8003/EventListAPIView');
        const eventsData = Array.isArray(response.data) ? response.data : [response.data];
        setEvents(eventsData);
        
        // Format events for FullCalendar
        const calendarEvents = eventsData.map(event => ({
          title: event.name,
          start: event.start_time,
          end: event.end_time,
          extendedProps: {
            eventData: event
          }
        }));
        setEvents(calendarEvents);
        
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Fetch event images
  useEffect(() => {
    const fetchEventImages = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8003/EventImageApiview');
        setEventImages(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (err) {
        console.error('Error fetching event images:', err);
      }
    };

    fetchEventImages();
  }, []);

  const handleDateClick = (arg) => {
    console.log('Date clicked:', arg.dateStr);
    setSelectedDate(arg.dateStr);
    setSelectedEvent(null);
  };

  const handleEventClick = (info) => {
    console.log('Event clicked:', info.event.title);
    setSelectedEvent(info.event.extendedProps.eventData);
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Custom event renderer
  const renderEventContent = (eventInfo) => {
    return (
      <div className="flex flex-col p-1">
        <div className="text-xs font-semibold truncate">{eventInfo.event.title}</div>
        <div className="text-xs opacity-75">{eventInfo.timeText}</div>
      </div>
    );
  };

  // Get events for selected date
  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start).toISOString().split('T')[0];
      return eventDate === date;
    });
  };

  const dateEvents = getEventsForDate(selectedDate);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen w-full flex flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 flex-col lg:flex-row p-3 sm:p-4 lg:p-6 gap-4 lg:gap-6">
          
          {/* Left Column: Events and Images Panel */}
          <div className="w-full lg:w-2/5 flex flex-col gap-4 lg:gap-6 order-2 lg:order-1">
            {/* Selected Event Details */}
            {selectedEvent ? (
              <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  {selectedEvent.name}
                </h2>
                <div className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedEvent.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined text-base mr-2">schedule</span>
                    {selectedEvent.date_human_readable}
                  </div>
                  {selectedEvent.venue_name && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="material-symbols-outlined text-base mr-2">location_on</span>
                      {selectedEvent.venue_name}
                    </div>
                  )}
                  {selectedEvent.publisher && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="material-symbols-outlined text-base mr-2">business</span>
                      {selectedEvent.publisher}
                    </div>
                  )}
                  
                  {/* Ticket Links */}
                  {selectedEvent.ticket_links && selectedEvent.ticket_links.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        Ticket Links
                      </h3>
                      <div className="space-y-2">
                        {selectedEvent.ticket_links.map((link, index) => (
                          link && link.link && (
                            <a
                              key={index}
                              href={link.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm"
                            >
                              {link.fav_icon && (
                                <img 
                                  src={link.fav_icon} 
                                  alt={link.source} 
                                  className="w-4 h-4 mr-2"
                                />
                              )}
                              {link.source}
                            </a>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Events for Selected Date */
              <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  Events on {formatDisplayDate(selectedDate)}
                </h2>
                
                {dateEvents.length > 0 ? (
                  <div className="space-y-4">
                    {dateEvents.map((event, index) => (
                      <div 
                        key={index}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedEvent(event.extendedProps.eventData)}
                      >
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {event.extendedProps.eventData.date_human_readable}
                        </p>
                        {event.extendedProps.eventData.venue_name && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {event.extendedProps.eventData.venue_name}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-center py-6">
                    <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500 mb-3">
                      event_busy
                    </span>
                    <p className="text-gray-900 dark:text-white text-lg font-semibold mb-2">
                      No events for this date
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Select another date to view events.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Event Images Gallery */}
            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Event Images
              </h2>
              
              {eventImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {eventImages.map((image, index) => (
                    <div key={image.image_id || index} className="group flex flex-col gap-2">
                      <div
                        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
                        style={{
                          backgroundImage: `url("${image.url}")`,
                          backgroundColor: image.background_color || '#f3f4f6'
                        }}
                        onClick={() => window.open(image.source_url, '_blank')}
                      />
                      <p className="text-xs text-gray-600 dark:text-gray-400 text-center truncate px-1">
                        {image.title}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center py-6">
                  <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500 mb-3">
                    image_search
                  </span>
                  <p className="text-gray-900 dark:text-white text-lg font-semibold mb-2">
                    No event images available
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Check back later for event images.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: FullCalendar */}
          <div className="w-full lg:w-3/5 flex flex-col order-1 lg:order-2">
            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 flex-1">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: '' // Removed week and day buttons
                  }}
                  events={events}
                  eventContent={renderEventContent}
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                  editable={false}
                  selectable={false}
                  height="auto"
                  aspectRatio={1.5}
                  themeSystem="standard"
                  // Responsive settings
                  dayMaxEventRows={3}
                  handleWindowResize={true}
                  // Styling
                  eventColor="#3B82F6"
                  eventTextColor="#FFFFFF"
                  // Custom class names
                  dayHeaderClassNames="text-xs sm:text-sm font-semibold"
                  dayCellClassNames="text-sm sm:text-base"
                  eventClassNames="text-xs rounded-lg"
                />
              )}
            </div>

            {/* Mobile Quick Actions */}
            <div className="flex lg:hidden gap-2 mt-4">
              <button 
                className="flex-1 bg-primary text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                onClick={() => setSelectedEvent(null)}
              >
                Show All Events
              </button>
              <button 
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2">
        <div className="flex justify-around">
          <button className="flex flex-col items-center p-2 text-primary">
            <span className="material-symbols-outlined text-xl">calendar_today</span>
            <span className="text-xs mt-1">Calendar</span>
          </button>
          <button 
            className="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400"
            onClick={() => setSelectedEvent(null)}
          >
            <span className="material-symbols-outlined text-xl">list</span>
            <span className="text-xs mt-1">Events</span>
          </button>
          <button 
            className="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="material-symbols-outlined text-xl">arrow_upward</span>
            <span className="text-xs mt-1">Top</span>
          </button>
        </div>
      </div>

      {/* Add padding for mobile bottom navigation */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .layout-container {
            padding-bottom: 80px;
          }
        }
      `}</style>
    </div>
  );
};

export default Calendar;