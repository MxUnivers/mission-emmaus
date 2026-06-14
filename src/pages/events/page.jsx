import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation.jsx';
import { useSupabaseData } from '../../hooks/useSupabaseData.jsx';
import { mapEvent } from '../../lib/mapDbData';
import { mockEvents } from '../../mocks/data.js';

function Events() {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const { data: dbEvents } = useSupabaseData('events', { orderBy: 'date', ascending: true });
  const events = (dbEvents.length > 0 ? dbEvents.map(mapEvent) : mockEvents);

  const handleNav = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getMonth = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  };

  const filteredEvents = filter === 'all'
    ? events
    : events.filter((e) => {
        const eventDate = new Date(e.date);
        const now = new Date();
        if (filter === 'upcoming') return eventDate >= now;
        if (filter === 'past') return eventDate < now;
        return true;
      });

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[320px] md:h-[420px] flex items-center justify-center overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=Colorful%20church%20event%20celebration%2C%20people%20gathering%20for%20Christian%20conference%2C%20warm%20festive%20lighting%2C%20decorated%20venue%2C%20joyful%20atmosphere%2C%20amber%20and%20gold%20tones%2C%20professional%20photography%20wide%20angle&width=1400&height=500&seq=events-hero-1&orientation=landscape"
          alt="Événements"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('sections.events')}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            {t('events.subtitle')}
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="inline-flex flex-wrap p-1 bg-[#FAF8F5] rounded-full">
              <button
                onClick={() => setFilter('all')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-amber-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('common.all')}
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  filter === 'upcoming'
                    ? 'bg-amber-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('common.upcoming')}
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  filter === 'past'
                    ? 'bg-amber-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('common.past')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-10 md:py-14 bg-white">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleNav(`/events/${event.id}`)}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {getMonth(event.date)}
                    </div>
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                      <i className="ri-calendar-line"></i>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                      <i className="ri-time-line"></i>
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                      <i className="ri-map-pin-line"></i>
                      <span>{event.location}</span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                      {event.description}
                    </p>
                    <span className="text-amber-600 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t('common.discover')}
                      <i className="ri-arrow-right-line"></i>
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {filteredEvents.length === 0 && (
              <div className="text-center py-16">
                <i className="ri-calendar-event-line text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 text-sm">{t('common.noEvents')}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Events;