import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation.jsx';
import { useSupabaseData } from '../../hooks/useSupabaseData.jsx';
import useActiveSection from '../../hooks/useActiveSection.jsx';
import {
  mapEvent,
  mapProgram,
  mapVideo,
  mapGalleryFolder,
  mapCommunity,
  mapTestimonial,
} from '../../lib/mapDbData.js';
import { siteSettings } from '../../config/settings.js';
import {
  mockEvents,
  mockPrograms,
  mockVideos,
  mockGalleryFolders,
  mockCommunities,
} from '../../mocks/data.js';
import { mockTestimonials } from '../../mocks/testimonials.js';

function Home() {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();

  const { data: dbEvents } = useSupabaseData('events', { orderBy: 'date', ascending: true, limit: 3 });
  const { data: dbPrograms } = useSupabaseData('programs', { orderBy: 'day', ascending: true, limit: 5 });
  const { data: dbVideos } = useSupabaseData('videos', { orderBy: 'created_at', ascending: false, limit: 3 });
  const { data: dbGallery } = useSupabaseData('gallery_folders', { orderBy: 'name', ascending: true, limit: 5 });
  const { data: dbCommunities } = useSupabaseData('communities', { orderBy: 'name', ascending: true, limit: 4 });
  const { data: dbTestimonials } = useSupabaseData('testimonials', { orderBy: 'sort_order', ascending: true });

  const events = dbEvents.length > 0 ? dbEvents.map(mapEvent) : mockEvents;
  const programs = dbPrograms.length > 0 ? dbPrograms.map(mapProgram) : mockPrograms;
  const videos = dbVideos.length > 0 ? dbVideos.map(mapVideo) : mockVideos;
  const galleryFolders = dbGallery.length > 0 ? dbGallery.map(mapGalleryFolder) : mockGalleryFolders;
  const communities = dbCommunities.length > 0 ? dbCommunities.map(mapCommunity) : mockCommunities;
  const testimonialsRaw = dbTestimonials.length > 0 ? dbTestimonials.map(mapTestimonial) : mockTestimonials;
  const testimonials = testimonialsRaw.filter(t => t.is_active !== false);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const sectionIds = ['programmes', 'evenements', 'temoignages', 'videos', 'galerie', 'communautes'];
  const activeSection = useActiveSection(sectionIds);

  const anchorLinks = [
    { id: 'programmes', label: t('sections.programs'), icon: 'ri-calendar-event-line' },
    { id: 'evenements', label: t('sections.events'), icon: 'ri-calendar-check-line' },
    { id: 'temoignages', label: t('common.testimonials'), icon: 'ri-chat-quote-line' },
    { id: 'videos', label: t('sections.videos'), icon: 'ri-video-line' },
    { id: 'galerie', label: t('sections.gallery'), icon: 'ri-image-line' },
    { id: 'communautes', label: t('sections.communities'), icon: 'ri-group-line' },
  ];

  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

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

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[420px] md:h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1920&h=1080&fit=crop"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('hero.welcome')}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-4 md:mb-6 text-white/90">
            {t('hero.subtitle')}
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 mb-6 md:mb-8 inline-block max-w-2xl">
            <p className="text-sm md:text-base italic text-white/80">
              &ldquo;{t('hero.verse')}&rdquo;
            </p>
            <p className="text-amber-400 text-xs md:text-sm mt-2 font-medium">
              {t('hero.verseRef')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <button
              onClick={() => handleNav('/contact')}
              className="px-6 md:px-8 py-3 md:py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium transition-all transform hover:scale-105 whitespace-nowrap"
            >
              {t('hero.ctaPrimary')}
            </button>
            <button
              onClick={() => handleNav('/about')}
              className="px-6 md:px-8 py-3 md:py-4 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium transition-all backdrop-blur-sm border border-white/30 whitespace-nowrap"
            >
              {t('hero.ctaSecondary')}
            </button>
          </div>
        </div>
      </section>

      {/* Anchor Navigation */}
      <div className="sticky top-16 md:top-20 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <nav className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
            {anchorLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleAnchorClick(e, link.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeSection === link.id
                    ? 'bg-amber-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <i className={`${link.icon} text-sm`}></i>
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Programs Section */}
      <section id="programmes" className="py-10 md:py-14 bg-white">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8 md:mb-10">
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('sections.programs')}
              </h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
            </div>
            <button
              onClick={() => handleNav('/programs')}
              className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-2 transition-colors"
            >
              {t('common.viewAll')}
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
            {programs.slice(0, 5).map((program) => (
              <div
                key={program.id}
                className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer hover:border-amber-200"
                onClick={() => handleNav('/programs')}
              >
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                  <i className="ri-calendar-event-line text-amber-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                  {program.title}
                </h3>
                <p className="text-amber-600 text-xs font-medium mb-2">
                  {program.day} &bull; {program.startTime}
                </p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {program.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="evenements" className="py-10 md:py-14 bg-[#FAF8F5]">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8 md:mb-10">
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('sections.events')}
              </h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
            </div>
            <button
              onClick={() => handleNav('/events')}
              className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-2 transition-colors"
            >
              {t('common.viewAll')}
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleNav(`/events/${event.id}`)}
              >
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {formatDate(event.date)}
                  </div>
                </div>
                <div className="p-5">
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
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                    {event.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <span className="text-amber-600 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t('common.discover')}
                      <i className="ri-arrow-right-line"></i>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pastor Message Section */}
      <section className="py-10 md:py-14 bg-white">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-full md:w-1/3 flex-shrink-0">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
                    alt={siteSettings.pastor.name}
                    className="w-48 h-48 md:w-full md:h-64 object-cover rounded-2xl mx-auto"
                  />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap">
                    {siteSettings.pastor.name}
                  </div>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <h2
                  className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {t('sections.pastor')}
                </h2>
                <div className="w-16 h-1 bg-amber-500 rounded-full mb-6"></div>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">
                  {siteSettings.pastor.message}
                </p>
                <div className="flex items-center gap-2 text-amber-600">
                  <i className="ri-double-quotes-l text-2xl"></i>
                  <span className="text-xs font-medium">
                    {siteSettings.pastor.title}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section id="temoignages" className="py-10 md:py-14 bg-[#FAF8F5]">
          <div className="w-full px-4 md:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-10">
              <h2
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('common.testimonials')}
              </h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full mx-auto"></div>
              <p className="text-gray-500 text-sm mt-4 max-w-xl mx-auto">
                {t('common.testimonialsSubtitle')}
              </p>
            </div>

            <div className="max-w-4xl mx-auto relative">
              <div className="overflow-hidden rounded-2xl bg-white border border-gray-100">
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="w-full flex-shrink-0 p-6 md:p-10 flex flex-col items-center text-center"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-4 border-2 border-amber-200">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-8 h-8 flex items-center justify-center mb-4">
                        <i className="ri-double-quotes-l text-2xl text-amber-300"></i>
                      </div>
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6 max-w-2xl italic">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {testimonial.name}
                        </p>
                        <p className="text-amber-600 text-xs mt-1">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation arrows */}
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-amber-600 hover:border-amber-200 transition-all z-10"
              >
                <i className="ri-arrow-left-s-line text-xl"></i>
              </button>
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-amber-600 hover:border-amber-200 transition-all z-10"
              >
                <i className="ri-arrow-right-s-line text-xl"></i>
              </button>

              {/* Dots indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentTestimonial
                        ? 'bg-amber-500 w-6'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Videos Section */}
      <section id="videos" className="py-10 md:py-14 bg-white">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8 md:mb-10">
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('sections.videos')}
              </h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
            </div>
            <button
              onClick={() => handleNav('/videos')}
              className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-2 transition-colors"
            >
              {t('common.viewAll')}
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleNav('/videos')}
              >
                <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-amber-500/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="ri-play-fill text-white text-2xl"></i>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                    {video.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                    {video.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
                    {video.description}
                  </p>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <i className="ri-calendar-line"></i>
                    <span>{formatDate(video.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galerie" className="py-10 md:py-14 bg-[#FAF8F5]">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8 md:mb-10">
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('sections.gallery')}
              </h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
            </div>
            <button
              onClick={() => handleNav('/gallery')}
              className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-2 transition-colors"
            >
              {t('common.viewAll')}
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {galleryFolders.map((folder) => (
              <div
                key={folder.id}
                className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[4/3]"
                onClick={() => handleNav(`/gallery/${folder.id}`)}
              >
                <img
                  src={folder.coverImage}
                  alt={folder.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <h3 className="font-semibold text-white text-sm mb-1">
                    {folder.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 text-xs">
                      {folder.photoCount} {t('common.photos')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section id="communautes" className="py-10 md:py-14 bg-white">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8 md:mb-10">
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('sections.communities')}
              </h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
            </div>
            <button
              onClick={() => handleNav('/communities')}
              className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-2 transition-colors"
            >
              {t('common.viewAll')}
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {communities.slice(0, 4).map((community) => (
              <div
                key={community.id}
                className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleNav('/communities')}
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={community.image}
                    alt={community.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                    {community.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                    <i className="ri-user-line text-amber-500"></i>
                    <span>{community.leader}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <i className="ri-calendar-line text-amber-500"></i>
                    <span>{community.day} &bull; {community.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-[#2D5F3F]">
        <div className="w-full px-4 md:px-6 lg:px-8 text-center">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {siteSettings.vision}
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-8">
            {siteSettings.mission}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleNav('/contact')}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium transition-all transform hover:scale-105 whitespace-nowrap"
            >
              {t('common.contactUs')}
            </button>
            <button
              onClick={() => handleNav('/programs')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all border border-white/30 whitespace-nowrap"
            >
              {t('common.discover')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;