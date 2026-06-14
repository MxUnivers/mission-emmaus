import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useTranslation } from '../../../hooks/useTranslation';
import { siteSettings } from '../../../config/settings';
import Toast from '../../../components/base/Toast';
import { useToast } from '../../../hooks/useToast';

export default function AdminSettings() {
  const { t } = useTranslation();
  const { toast, showToast } = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
      if (error) throw error;
      setSettings(data || {
        site_name: '',
        logo: '',
        primary_color: '#D4A853',
        secondary_color: '#2D5F3F',
        phone: '',
        email: '',
        address: '',
        whatsapp: '',
        facebook: '',
        instagram: '',
        youtube: '',
        footer_text: '',
      });
    } catch (e) {
      console.error('Error fetching settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSaved(false);
    try {
      if (settings.id) {
        const { error } = await supabase.from('site_settings').update(settings).eq('id', settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_settings').insert(settings);
        if (error) throw error;
      }
      showToast('success', 'Paramètres enregistrés avec succès.');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      showToast('error', 'Erreur : ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>{t('common.loading')}</p>;
  }

  if (!settings) return null;

  return (
    <div>
      <Toast toast={toast} />
      <h1 className="text-xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
        {t('admin.settings')}
      </h1>

      {saved && (
        <div className="mb-4 p-3 rounded-md bg-green-50 text-green-700 text-sm border border-green-200">
          {t('common.success')}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>{t('common.siteName')}</label>
            <input type="text" value={settings.site_name || ''} onChange={(e) => setSettings({ ...settings, site_name: e.target.value })} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>{t('common.logoUrl')}</label>
            <input type="text" value={settings.logo || ''} onChange={(e) => setSettings({ ...settings, logo: e.target.value })} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>{t('common.primaryColor')}</label>
            <div className="flex gap-2">
              <input type="color" value={settings.primary_color || '#D4A853'} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="w-10 h-10 rounded-md border cursor-pointer" style={{ borderColor: '#E5E7EB' }} />
              <input type="text" value={settings.primary_color || ''} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="flex-1 px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>{t('common.secondaryColor')}</label>
            <div className="flex gap-2">
              <input type="color" value={settings.secondary_color || '#2D5F3F'} onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })} className="w-10 h-10 rounded-md border cursor-pointer" style={{ borderColor: '#E5E7EB' }} />
              <input type="text" value={settings.secondary_color || ''} onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })} className="flex-1 px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>{t('common.phone')}</label>
            <input type="text" value={settings.phone || ''} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>{t('common.email')}</label>
            <input type="email" value={settings.email || ''} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>{t('common.address')}</label>
          <input type="text" value={settings.address || ''} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>WhatsApp</label>
            <input type="text" value={settings.whatsapp || ''} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>Facebook</label>
            <input type="text" value={settings.facebook || ''} onChange={(e) => setSettings({ ...settings, facebook: e.target.value })} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>Instagram</label>
            <input type="text" value={settings.instagram || ''} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>YouTube</label>
            <input type="text" value={settings.youtube || ''} onChange={(e) => setSettings({ ...settings, youtube: e.target.value })} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>{t('common.footerText')}</label>
          <textarea value={settings.footer_text || ''} onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200 resize-none" style={{ borderColor: '#E5E7EB' }} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 rounded-md text-white text-sm font-medium whitespace-nowrap"
          style={{ backgroundColor: siteSettings.colors.primary, cursor: 'pointer' }}
        >
          {submitting ? t('common.loading') : t('common.save')}
        </button>
      </form>
    </div>
  );
}