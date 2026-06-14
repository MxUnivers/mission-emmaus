import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation.jsx';
import { supabase } from '../../lib/supabase';
import { siteSettings } from '../../config/settings';

function Contact() {
  const { t, locale } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('contact-images')
          .upload(fileName, imageFile);
        if (uploadError) {
          console.warn('Upload error:', uploadError);
        } else {
          const { data: urlData } = supabase.storage.from('contact-images').getPublicUrl(fileName);
          imageUrl = urlData?.publicUrl;
        }
      }

      const { error: insertError } = await supabase.from('contact_messages').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        image_url: imageUrl,
        status: 'new',
      });

      if (insertError) throw insertError;

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setPreviewImage(null);
        setImageFile(null);
      }, 3000);
    } catch (err) {
      setError(err.message || t('common.sendError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[320px] md:h-[420px] flex items-center justify-center overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=Warm%20welcoming%20church%20reception%20area%2C%20friendly%20people%20greeting%20visitors%2C%20modern%20church%20interior%20with%20warm%20golden%20lighting%2C%20hospitality%20desk%2C%20amber%20and%20inviting%20atmosphere%2C%20professional%20photography&width=1400&height=500&seq=contact-hero-1&orientation=landscape"
          alt="Contact"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('contact.title')}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-10 md:py-14 bg-white">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Contact Info */}
              <div>
                <h2
                  className="text-xl md:text-2xl font-bold text-gray-900 mb-6"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {t('contact.info')}
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <i className="ri-map-pin-line text-amber-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{t('common.address')}</h3>
                      <p className="text-gray-500 text-sm">{siteSettings.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <i className="ri-phone-line text-amber-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{t('common.phone')}</h3>
                      <a href={`tel:${siteSettings.phone}`} className="text-gray-500 text-sm hover:text-amber-600 transition-colors">
                        {siteSettings.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <i className="ri-mail-line text-amber-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{t('common.email')}</h3>
                      <a href={`mailto:${siteSettings.email}`} className="text-gray-500 text-sm hover:text-amber-600 transition-colors">
                        {siteSettings.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <i className="ri-whatsapp-line text-amber-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">WhatsApp</h3>
                      <a
                        href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 text-sm hover:text-amber-600 transition-colors"
                      >
                        {siteSettings.whatsapp}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div className="mt-8">
                  <h3 className="font-semibold text-gray-900 text-sm mb-4">{t('common.followUs')}</h3>
                  <div className="flex gap-3">
                    <a
                      href={siteSettings.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white hover:bg-amber-500 transition-colors"
                    >
                      <i className="ri-facebook-fill text-sm"></i>
                    </a>
                    <a
                      href={siteSettings.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white hover:bg-amber-500 transition-colors"
                    >
                      <i className="ri-instagram-line text-sm"></i>
                    </a>
                    <a
                      href={siteSettings.social.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white hover:bg-amber-500 transition-colors"
                    >
                      <i className="ri-youtube-fill text-sm"></i>
                    </a>
                    <a
                      href={siteSettings.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white hover:bg-amber-500 transition-colors"
                    >
                      <i className="ri-twitter-x-line text-sm"></i>
                    </a>
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="mt-8 rounded-xl overflow-hidden border border-gray-100 h-48 md:h-64 bg-[#FAF8F5] flex items-center justify-center">
                  <div className="text-center">
                    <i className="ri-map-pin-2-line text-3xl text-amber-500 mb-2"></i>
                    <p className="text-gray-500 text-xs">{t('common.googleMaps')}</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div>
                <h2
                  className="text-xl md:text-2xl font-bold text-gray-900 mb-6"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {t('contact.form')}
                </h2>
                {error && (
                  <div className="mb-4 p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('common.name')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm transition-all"
                      placeholder={t('common.name')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('common.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('common.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm transition-all"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('common.subject')}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm transition-all"
                      placeholder={t('common.subject')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('common.message')}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      maxLength={500}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm transition-all resize-none"
                      placeholder={t('common.message')}
                    ></textarea>
                    <p className="text-gray-400 text-xs mt-1 text-right">
                      {formData.message.length}/500
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('common.imageOptional')}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700 file:text-xs file:font-medium"
                    />
                    {previewImage && (
                      <div className="mt-3 relative inline-block">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => { setPreviewImage(null); setImageFile(null); }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={submitting || submitted}
                    className={`w-full py-3.5 rounded-lg font-medium text-sm transition-all ${
                      submitted
                        ? 'bg-green-500 text-white'
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                  >
                    {submitted ? (
                      <span className="flex items-center justify-center gap-2">
                        <i className="ri-check-line"></i>
                        {t('common.messageSent')}
                      </span>
                    ) : submitting ? (
                      t('common.sending')
                    ) : (
                      t('common.send')
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;