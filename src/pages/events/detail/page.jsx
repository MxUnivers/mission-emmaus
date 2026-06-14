import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from '../../../hooks/useTranslation.jsx';
import { supabase } from '../../../lib/supabase';
import { mapEvent } from '../../../lib/mapDbData';
import { mockEvents } from '../../../mocks/data.js';

function EventDetail() {
  const { t, locale } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [showProgram, setShowProgram] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase.from('events').select('*').eq('id', id).maybeSingle();
        if (error) throw error;
        if (data) {
          setEvent(mapEvent(data));
        } else {
          const mockEvent = mockEvents.find((e) => e.id === id);
          setEvent(mockEvent || null);
        }
      } catch (e) {
        const mockEvent = mockEvents.find((e) => e.id === id);
        setEvent(mockEvent || null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 text-sm">{t('common.loading')}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('events.eventNotFound')}</h2>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 px-6 py-3 bg-amber-500 text-white rounded-full font-medium"
          >
            {t('events.backToEvents')}
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const programSteps = event.program ? event.program.split('\n') : [];

  return (
    <div>
      {/* Hero Image */}
      <section className="relative h-[300px] md:h-[450px] overflow-hidden">
        <img
          src={event.image || 'https://via.placeholder.com/800x400?text=Event'}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="w-full px-4 md:px-6 lg:px-8">
            <button
              onClick={() => navigate('/events')}
              className="mb-4 flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
            >
              <i className="ri-arrow-left-line"></i>
              {t('events.backToEvents')}
            </button>
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <span className="px-3 py-1.5 bg-amber-500 text-white rounded-full text-xs font-medium">
                {formatDate(event.date)}
              </span>
              <span className="px-3 py-1.5 bg-white/20 text-white rounded-full text-xs font-medium">
                {event.startTime} - {event.endTime}
              </span>
              <span className="px-3 py-1.5 bg-white/20 text-white rounded-full text-xs font-medium">
                {event.location}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-14 bg-white">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h2
                  className="text-xl md:text-2xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {t('common.description')}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  {event.description}
                </p>

                {/* Program */}
                {programSteps.length > 0 && (
                  <div className="mb-8">
                    <button
                      onClick={() => setShowProgram(!showProgram)}
                      className="flex items-center gap-2 text-gray-900 font-semibold mb-4"
                    >
                      <i className="ri-list-check-2 text-amber-500"></i>
                      {t('common.detailedProgram')}
                      {showProgram ? <i className="ri-arrow-up-s-line text-gray-400"></i> : <i className="ri-arrow-down-s-line text-gray-400"></i>}
                    </button>
                    {showProgram && (
                      <div className="bg-[#FAF8F5] rounded-xl p-5 md:p-6 border border-gray-100">
                        <div className="space-y-3">
                          {programSteps.map((step, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">{index + 1}</span>
                              </div>
                              <p className="text-gray-600 text-sm">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-1">
                <div className="bg-[#FAF8F5] rounded-xl p-5 md:p-6 border border-gray-100 sticky top-24">
                  <h3 className="font-semibold text-gray-900 mb-4 text-sm">{t('common.info')}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                        <i className="ri-calendar-line text-amber-600"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t('common.date')}</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(event.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                        <i className="ri-time-line text-amber-600"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t('common.time')}</p>
                        <p className="text-sm font-medium text-gray-900">{event.startTime} - {event.endTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                        <i className="ri-map-pin-line text-amber-600"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t('common.location')}</p>
                        <p className="text-sm font-medium text-gray-900">{event.location}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/contact')}
                    className="mt-6 w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm transition-colors"
                  >
                    {t('common.register')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EventDetail;