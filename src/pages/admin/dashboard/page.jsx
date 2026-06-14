import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts';
import { supabase } from '../../../lib/supabase';
import { useTranslation } from '../../../hooks/useTranslation';
import { siteSettings } from '../../../config/settings';
import RecentActivity from './components/RecentActivity';

function getLast30Days() {
  const days = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const label = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    const iso = d.toISOString().split('T')[0];
    days.push({ label, iso, count: 0 });
  }
  return days;
}

function formatByDay(items, dateKey) {
  const days = getLast30Days();
  const map = new Map(days.map((d) => [d.iso, d]));

  items.forEach((item) => {
    const date = item[dateKey]?.split('T')[0];
    if (map.has(date)) {
      map.get(date).count += 1;
    }
  });

  return days;
}

function formatStatusData(statuses, t) {
  const counts = {};
  statuses.forEach((s) => {
    const label =
      s.status === 'new' ? t('common.new') :
      s.status === 'replied' ? t('common.replied') :
      s.status === 'archived' ? t('common.archived') : s.status;
    counts[label] = (counts[label] || 0) + 1;
  });

  const colors = {};
  colors[t('common.new')] = '#2D5F3F';
  colors[t('common.replied')] = '#4A7F5F';
  colors[t('common.archived')] = '#B8923A';

  return Object.entries(counts).map(([name, value]) => ({ name, value, color: colors[name] || '#6B7280' }));
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    events: 0,
    eventsThisMonth: 0,
    messages: 0,
    messagesUnread: 0,
    messagesThisWeek: 0,
    programs: 0,
    communities: 0,
    videos: 0,
    galleryFolders: 0,
    testimonialsActive: 0,
    testimonialsInactive: 0,
  });
  const [messageChartData, setMessageChartData] = useState([]);
  const [eventChartData, setEventChartData] = useState([]);
  const [testimonialChartData, setTestimonialChartData] = useState([]);
  const [messageStatusData, setMessageStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek).toISOString().split('T')[0];
        const startOfChart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29).toISOString().split('T')[0];

        const [
          { count: eventsCount },
          { count: eventsThisMonthCount },
          { count: messagesCount },
          { count: messagesUnreadCount },
          { count: messagesThisWeekCount },
          { count: programsCount },
          { count: communitiesCount },
          { count: videosCount },
          { count: galleryCount },
          { count: testimonialsActiveCount },
          { count: testimonialsInactiveCount },
          { data: messagesRaw },
          { data: eventsRaw },
          { data: testimonialsRaw },
          { data: messageStatuses },
          { data: recentMessagesData },
          { data: recentEventsData },
        ] = await Promise.all([
          supabase.from('events').select('*', { count: 'exact', head: true }),
          supabase.from('events').select('*', { count: 'exact', head: true }).gte('date', startOfMonth),
          supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
          supabase.from('contact_messages').select('*', { count: 'exact', head: true }).gte('created_at', startOfWeek),
          supabase.from('programs').select('*', { count: 'exact', head: true }),
          supabase.from('communities').select('*', { count: 'exact', head: true }),
          supabase.from('videos').select('*', { count: 'exact', head: true }),
          supabase.from('gallery_folders').select('*', { count: 'exact', head: true }),
          supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('is_active', false),
          supabase.from('contact_messages').select('created_at').gte('created_at', startOfChart),
          supabase.from('events').select('date').gte('date', startOfChart),
          supabase.from('testimonials').select('created_at').gte('created_at', startOfChart),
          supabase.from('contact_messages').select('status'),
          supabase.from('contact_messages').select('id, name, email, subject, status, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('events').select('id, title, date, location, start_time, created_at').order('created_at', { ascending: false }).limit(5),
        ]);

        setStats({
          events: eventsCount || 0,
          eventsThisMonth: eventsThisMonthCount || 0,
          messages: messagesCount || 0,
          messagesUnread: messagesUnreadCount || 0,
          messagesThisWeek: messagesThisWeekCount || 0,
          programs: programsCount || 0,
          communities: communitiesCount || 0,
          videos: videosCount || 0,
          galleryFolders: galleryCount || 0,
          testimonialsActive: testimonialsActiveCount || 0,
          testimonialsInactive: testimonialsInactiveCount || 0,
        });

        setMessageChartData(formatByDay(messagesRaw || [], 'created_at'));
        setEventChartData(formatByDay(eventsRaw || [], 'date'));
        setTestimonialChartData(formatByDay(testimonialsRaw || [], 'created_at'));
        setMessageStatusData(formatStatusData(messageStatuses || [], t));
        setRecentMessages(recentMessagesData || []);
        setRecentEvents(recentEventsData || []);
      } catch (e) {
        console.error('Stats error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [t]);

  const cards = [
    { label: t('admin.messages'), value: `${stats.messagesUnread} ${t('common.new')} / ${stats.messages} ${t('common.all')}`, trend: `${stats.messagesThisWeek} ${t('common.last30Days')}`, path: '/admin/messages', icon: 'ri-message-3-line', color: '#2D5F3F' },
    { label: t('admin.events'), value: stats.events, trend: `${stats.eventsThisMonth} ${t('common.last30Days')}`, path: '/admin/events', icon: 'ri-calendar-event-line', color: siteSettings.colors.primary },
    { label: t('admin.programs'), value: stats.programs, path: '/admin/programs', icon: 'ri-book-open-line', color: '#4A7F5F' },
    { label: t('admin.communities'), value: stats.communities, path: '/admin/communities', icon: 'ri-group-line', color: '#6B8F7B' },
    { label: t('admin.videos'), value: stats.videos, path: '/admin/videos', icon: 'ri-video-line', color: '#8B6F47' },
    { label: t('admin.gallery'), value: stats.galleryFolders, path: '/admin/gallery', icon: 'ri-image-line', color: '#B8923A' },
    { label: t('admin.testimonials'), value: `${stats.testimonialsActive} ${t('common.active')} / ${stats.testimonialsInactive} ${t('common.inactive')}`, path: '/admin/testimonials', icon: 'ri-chat-quote-line', color: '#B8923A' },
  ];

  const messageChartColor = '#2D5F3F';
  const eventChartColor = '#8B6F47';
  const testimonialChartColor = '#B8923A';

  return (
    <div>
      <h1 className="text-xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
        {t('admin.dashboard')}
      </h1>

      {loading ? (
        <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>{t('common.loading')}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <Link
                key={card.path}
                to={card.path}
                className="rounded-lg p-5 text-white transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: card.color, cursor: 'pointer' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <i className={card.icon + ' text-xl'}></i>
                  </div>
                  <span className="text-xl font-bold">{card.value}</span>
                </div>
                {card.trend && (
                  <p className="text-xs mb-1 opacity-80">{card.trend}</p>
                )}
                <p className="text-sm font-medium opacity-90">{card.label}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-lg p-6 border" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
                  {t('common.messageEvolution')}
                </h2>
                <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#E8F5E9', color: messageChartColor }}>
                  {t('common.last30Days')}
                </span>
              </div>
              <div className="w-full" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={messageChartData} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: '#6B7280' }}
                      tickLine={false}
                      axisLine={{ stroke: '#E5E7EB' }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#6B7280' }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: '#f5f5f5' }}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        fontSize: '13px',
                      }}
                      labelStyle={{ color: '#374151', fontWeight: 600 }}
                    />
                    <Bar dataKey="count" fill={messageChartColor} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg p-6 border" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
                  {t('common.eventEvolution')}
                </h2>
                <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#FDF6E3', color: eventChartColor }}>
                  {t('common.last30Days')}
                </span>
              </div>
              <div className="w-full" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventChartData} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: '#6B7280' }}
                      tickLine={false}
                      axisLine={{ stroke: '#E5E7EB' }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#6B7280' }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: '#f5f5f5' }}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        fontSize: '13px',
                      }}
                      labelStyle={{ color: '#374151', fontWeight: 600 }}
                    />
                    <Bar dataKey="count" fill={eventChartColor} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg p-6 border" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
                  {t('common.testimonialEvolution')}
                </h2>
                <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#FDF6E3', color: testimonialChartColor }}>
                  {t('common.last30Days')}
                </span>
              </div>
              <div className="w-full" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={testimonialChartData} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: '#6B7280' }}
                      tickLine={false}
                      axisLine={{ stroke: '#E5E7EB' }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#6B7280' }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: '#f5f5f5' }}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        fontSize: '13px',
                      }}
                      labelStyle={{ color: '#374151', fontWeight: 600 }}
                    />
                    <Bar dataKey="count" fill={testimonialChartColor} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-lg p-6 border" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
                  {t('common.messageDistribution')}
                </h2>
                <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#E8F5E9', color: messageChartColor }}>
                  {t('common.byStatus')}
                </span>
              </div>
              <div className="w-full" style={{ height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={messageStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {messageStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        fontSize: '13px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                {messageStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-xs font-medium" style={{ color: siteSettings.colors.text }}>
                      {item.name} ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg p-6 border" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
              <h2 className="text-lg font-bold mb-3" style={{ color: siteSettings.colors.text }}>
                {t('common.welcome')}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: siteSettings.colors.textLight }}>
                {t('common.adminWelcome')}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/admin/messages" className="text-xs font-medium px-3 py-2 rounded-md text-white transition-transform hover:scale-[1.02]" style={{ backgroundColor: '#2D5F3F' }}>
                  <i className="ri-message-3-line mr-1"></i>
                  {t('admin.messages')}
                </Link>
                <Link to="/admin/events" className="text-xs font-medium px-3 py-2 rounded-md text-white transition-transform hover:scale-[1.02]" style={{ backgroundColor: siteSettings.colors.primary }}>
                  <i className="ri-calendar-event-line mr-1"></i>
                  {t('admin.events')}
                </Link>
                <Link to="/admin/testimonials" className="text-xs font-medium px-3 py-2 rounded-md text-white transition-transform hover:scale-[1.02]" style={{ backgroundColor: '#B8923A' }}>
                  <i className="ri-chat-quote-line mr-1"></i>
                  {t('admin.testimonials')}
                </Link>
              </div>
            </div>
          </div>
          <RecentActivity messages={recentMessages} events={recentEvents} loading={loading} />
        </>
      )}
    </div>
  );
}