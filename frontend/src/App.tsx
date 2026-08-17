import React, { useState, useEffect } from 'react';
import { User, CreditCard, Mail, FileText, Send, Loader2 } from 'lucide-react';
import { Input } from './components/Input';
import { GlassColorPicker } from './components/GlassColorPicker';
import { TextArea } from './components/TextArea';
import { StatusAlert } from './components/StatusAlert';
import { GlassCard } from './components/GlassCard';
import { RainbowHeader } from './components/RainbowHeader';
import { Navigation, ActiveTab } from './components/Navigation';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LoginView } from './components/auth/LoginView';
import { MathCaptcha } from './components/MathCaptcha';
import { Footer } from './components/Footer';
import { GlassSkeletonCard } from './components/skeletons/GlassSkeletonCard';
import { useCustomerForm } from './hooks/useCustomerForm';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      if (pathname.includes('/admin') || hash.includes('admin')) {
        return 'admin';
      }
      if (pathname.includes('/login') || hash.includes('login')) {
        return 'login';
      }
    }
    return 'form';
  });

  const {
    formData,
    errors,
    availableColors,
    captchaChallenge,
    captchaAnswer,
    websiteUrl,
    isLoadingCaptcha,
    isLoadingConfig,
    isSubmitting,
    status,
    cpfValidationState,
    setCaptchaAnswer,
    setWebsiteUrl,
    refreshCaptcha,
    handleInputChange,
    handleBlur,
    handleSubmit,
    dismissStatus,
  } = useCustomerForm();

  // Route Guard: enforce authentication for the /admin route
  useEffect(() => {
    if (!isAuthLoading) {
      if (activeTab === 'admin' && !isAuthenticated) {
        setActiveTab('login');
        if (typeof window !== 'undefined') {
          window.history.pushState(null, '', '#/login');
        }
      } else if (activeTab === 'login' && isAuthenticated) {
        setActiveTab('admin');
        if (typeof window !== 'undefined') {
          window.history.pushState(null, '', '#/admin');
        }
      }
    }
  }, [activeTab, isAuthenticated, isAuthLoading]);

  // Listen to browser URL changes / hash navigation
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      if (pathname.includes('/admin') || hash.includes('admin')) {
        setActiveTab('admin');
      } else if (pathname.includes('/login') || hash.includes('login')) {
        setActiveTab('login');
      } else {
        setActiveTab('form');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleTabSwitch = (tab: ActiveTab) => {
    if (tab === 'admin' && !isAuthenticated) {
      setActiveTab('login');
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '#/login');
      }
      return;
    }

    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const newUrl = tab === 'admin' ? '#/admin' : tab === 'login' ? '#/login' : '#/';
      window.history.pushState(null, '', newUrl);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center p-4 sm:p-6 md:p-10 overflow-hidden">
      {/* Ambient Decorative Glass Lights (Background Orbs) */}
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-purple-600/20 dark:bg-purple-600/25 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="fixed top-1/3 -right-32 w-96 h-96 bg-blue-600/15 dark:bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="fixed -bottom-32 left-1/3 w-96 h-96 bg-emerald-600/10 dark:bg-emerald-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

      {/* Top Header Navigation Bar */}
      <Navigation activeTab={activeTab} onTabChange={handleTabSwitch} />

      {/* Main View Content Switcher */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center my-auto">
        {activeTab === 'login' ? (
          <LoginView onLoginSuccess={() => handleTabSwitch('admin')} />
        ) : activeTab === 'admin' ? (
          isAuthenticated ? (
            <AdminDashboard />
          ) : (
            <LoginView onLoginSuccess={() => handleTabSwitch('admin')} />
          )
        ) : (
          <main className="w-full max-w-xl">
            {isLoadingConfig ? (
              <GlassSkeletonCard />
            ) : (
              <GlassCard className="border border-white/10 shadow-2xl backdrop-blur-xl">
                <RainbowHeader />

                {/* Status Alert Banner */}
                {status.type && (
                  <div className="mb-6">
                    <StatusAlert
                      type={status.type}
                      message={status.message}
                      onDismiss={dismissStatus}
                    />
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* ---------------------------------------------------- */}
                  {/* BOT PREVENTION LAYER 1: Invisible Honeypot Field */}
                  {/* Hidden completely from human users, catches spam bots */}
                  {/* ---------------------------------------------------- */}
                  <input
                    type="text"
                    name="website_url"
                    tabIndex={-1}
                    autoComplete="off"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      left: '-9999px',
                      height: 0,
                      width: 0,
                      pointerEvents: 'none',
                    }}
                    aria-hidden="true"
                  />

                  {/* Full Name Field */}
                  <Input
                    id="full-name-input"
                    label={t.form.fullNameLabel}
                    name="fullName"
                    placeholder={t.form.fullNamePlaceholder}
                    required
                    icon={<User className="w-5 h-5" />}
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={errors.fullName}
                    autoComplete="name"
                  />

                  {/* Grid for CPF and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* CPF Field with Real-Time Validation & Dynamic Mask */}
                    <Input
                      id="cpf-input"
                      label={t.form.cpfLabel}
                      name="cpf"
                      placeholder="000.000.000-00"
                      required
                      maxLength={14}
                      icon={<CreditCard className="w-5 h-5" />}
                      value={formData.cpf}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      error={errors.cpf}
                      validationState={cpfValidationState}
                      hint={t.form.cpfHint}
                    />

                    {/* Email Field */}
                    <Input
                      id="email-input"
                      label={t.form.emailLabel}
                      name="email"
                      type="email"
                      placeholder={t.form.emailPlaceholder}
                      required
                      icon={<Mail className="w-5 h-5" />}
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      error={errors.email}
                      autoComplete="email"
                    />
                  </div>

                  {/* High-Fidelity Glassmorphic Visual Color Picker */}
                  <GlassColorPicker
                    value={formData.favoriteRainbowColor}
                    onChange={(color) => {
                      handleInputChange({
                        target: { name: 'favoriteRainbowColor', value: color },
                      } as any);
                    }}
                    availableColors={availableColors}
                    error={errors.favoriteRainbowColor}
                    label={t.form.colorLabel}
                    hint={t.form.colorHint}
                  />

                  {/* Additional Notes Field */}
                  <TextArea
                    id="notes-textarea"
                    label={t.form.notesLabel}
                    name="notes"
                    placeholder={t.form.notesPlaceholder}
                    icon={<FileText className="w-5 h-5" />}
                    value={formData.notes}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={errors.notes}
                    hint={t.form.notesHint}
                  />

                  {/* ---------------------------------------------------- */}
                  {/* BOT PREVENTION LAYER 2: Local Math CAPTCHA Widget */}
                  {/* ---------------------------------------------------- */}
                  <MathCaptcha
                    challenge={captchaChallenge}
                    value={captchaAnswer}
                    onChange={setCaptchaAnswer}
                    onRefresh={refreshCaptcha}
                    isLoading={isLoadingCaptcha}
                    error={errors.captchaAnswer}
                  />

                  {/* Submit Action Button */}
                  <button
                    id="submit-registration-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="glass-button-primary w-full py-4 px-6 rounded-2xl text-white font-semibold text-base md:text-lg flex items-center justify-center gap-2.5 mt-6 cursor-pointer tracking-wide"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{t.form.submittingButton}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>{t.form.submitButton}</span>
                      </>
                    )}
                  </button>
                </form>
              </GlassCard>
            )}
          </main>
        )}
      </div>

      {/* Semantic Glassmorphic Footer with Author Credits */}
      <Footer />
    </div>
  );
};

export default App;
