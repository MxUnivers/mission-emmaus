import { Link } from 'react-router-dom';
import { useTranslation } from '../../../../hooks/useTranslation';
import { siteSettings } from '../../../../config/settings';

function formatDate(iso, t) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return t('common.justNow');
  if (diffMin < 60) return `${diffMin} ${t('common.minutesAgo')}`;
  if (diffHour < 24) return `${diffHour} ${t('common.hoursAgo')}`;
  if (diffDay < 7) return `${diffDay} ${t('common.daysAgo')}`;

  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function formatEventDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function statusBadge(status, t) {
  const styles = {
    new: { bg: '#E8F5E9', color: '#2D5F3F', label: t('common.new') },
    replied: { bg: '#EDF7F2', color: '#4A7F5F', label: t('common.replied') },
    archived: { bg: '#FDF6E3', color: '#B8923A', label: t('common.archived') },
  };
  const s = styles[status] || { bg: '#F3F4F6', color: '#6B7280', label: status };
  return (
    <span
      className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

export default function RecentActivity({ messages, events, loading }) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg p-6 border bg-white" style={{ borderColor: '#E5E7EB' }}>
          <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>{t('common.loading')}</p>
        </div>
        <div className="rounded-lg p-6 border bg-white" style={{ borderColor: '#E5E7EB' }}>
          <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Messages récents */}
      <div className="rounded-lg p-6 border bg-white" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}
          >
            {t('common.message')} {t('common.recent')}
          </h2>
          <Link
            to="/admin/messages"
            className="text-xs font-medium transition-colors hover:underline"
            style={{ color: siteSettings.colors.primary }}
          >
            {t('common.viewAll')}
          </Link>
        </div>
        <div className="space-y-2">
          {messages.length === 0 && (
            <p className="text-xs" style={{ color: siteSettings.colors.textLight }}>
              {t('common.none')}
            </p>
          )}
          {messages.map((msg) => (
            <Link
              key={msg.id}
              to={`/admin/messages`}
              className="flex items-start gap-3 p-3 rounded-md transition-colors hover:bg-gray-50"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#E8F5E9', color: '#2D5F3F' }}
              >
                <i className="ri-message-3-line text-sm"></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium truncate" style={{ color: siteSettings.colors.text }}>
                    {msg.name}
                  </p>
                  <span className="text-[10px] flex-shrink-0" style={{ color: siteSettings.colors.textLight }}>
                    {formatDate(msg.created_at, t)}
                  </span>
                </div>
                <p className="text-xs truncate" style={{ color: siteSettings.colors.textLight }}>
                  {msg.subject || t('common.noSubject')}
                </p>
                <div className="mt-1">{statusBadge(msg.status, t)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Événements récents */}
      <div className="rounded-lg p-6 border bg-white" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}
          >
            {t('common.event')} {t('common.recent')}
          </h2>
          <Link
            to="/admin/events"
            className="text-xs font-medium transition-colors hover:underline"
            style={{ color: siteSettings.colors.primary }}
          >
            {t('common.viewAll')}
          </Link>
        </div>
        <div className="space-y-2">
          {events.length === 0 && (
            <p className="text-xs" style={{ color: siteSettings.colors.textLight }}>
              {t('common.none')}
            </p>
          )}
          {events.map((evt) => (
            <Link
              key={evt.id}
              to={`/admin/events`}
              className="flex items-start gap-3 p-3 rounded-md transition-colors hover:bg-gray-50"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#FDF6E3', color: '#8B6F47' }}
              >
                <i className="ri-calendar-event-line text-sm"></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium truncate" style={{ color: siteSettings.colors.text }}>
                    {evt.title}
                  </p>
                  <span className="text-[10px] flex-shrink-0" style={{ color: siteSettings.colors.textLight }}>
                    {formatDate(evt.created_at, t)}
                  </span>
                </div>
                <p className="text-xs truncate" style={{ color: siteSettings.colors.textLight }}>
                  {evt.location || t('common.noLocation')}
                </p>
                <div className="mt-1">
                  <span
                    className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
                  >
                    {formatEventDate(evt.date)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}