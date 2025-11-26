import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const SettingRow: React.FC<{icon: string, title: string, subtitle?: string, action?: React.ReactNode, isDestructive?: boolean}> = ({icon, title, subtitle, action, isDestructive}) => (
    <div className={`flex items-center gap-4 bg-transparent px-4 py-3 justify-between ${isDestructive ? '' : 'border-b border-white/5 last:border-0'}`}>
        <div className="flex items-center gap-4 min-w-0">
            <div className={`flex items-center justify-center rounded-lg shrink-0 size-10 ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-primary/20 text-primary'}`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div className="flex flex-col justify-center min-w-0">
                <p className={`text-base font-medium leading-normal truncate ${isDestructive ? 'text-red-500' : 'text-white'}`}>{title}</p>
                {subtitle && <p className="text-zinc-500 text-sm font-normal leading-normal truncate">{subtitle}</p>}
            </div>
        </div>
        <div className="shrink-0 flex items-center">
            {action || (
                <span className="material-symbols-outlined text-zinc-600">chevron_right</span>
            )}
        </div>
    </div>
);

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const { t, language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'fr' : 'en');
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-dark pb-24">
            <div className="flex items-center bg-background-dark/90 p-4 pb-2 justify-between backdrop-blur-sm sticky top-0 z-10 border-b border-white/5">
                <button onClick={() => navigate(-1)} className="flex size-12 shrink-0 items-center text-white hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-3xl">arrow_back</span>
                </button>
                <h1 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] flex-1">{t('settings.title')}</h1>
            </div>

            <main className="flex flex-col gap-6 px-4 py-4">
                <section>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-1 pb-3 pt-2">{t('settings.app_pref')}</h2>
                    <div className="flex flex-col overflow-hidden rounded-xl bg-white/5 border border-white/5">
                        <SettingRow 
                            icon="translate" 
                            title={t('settings.lang')} 
                            subtitle={language === 'en' ? 'English' : 'Français'}
                            action={
                                <button 
                                    onClick={toggleLanguage}
                                    className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-primary border border-primary/20"
                                >
                                    {language === 'en' ? 'EN' : 'FR'}
                                </button>
                            }
                        />
                        <SettingRow icon="photo_camera" title={t('settings.camera')} />
                        <SettingRow 
                            icon="notifications" 
                            title={t('settings.notif')} 
                            subtitle="On" 
                            action={
                                <label className="relative flex h-[24px] w-[44px] cursor-pointer items-center rounded-full bg-primary p-0.5 justify-end">
                                    <div className="h-[20px] w-[20px] rounded-full bg-white shadow-sm"></div>
                                </label>
                            }
                        />
                         <SettingRow 
                            icon="vibration" 
                            title={t('settings.haptic')} 
                            action={
                                <label className="relative flex h-[24px] w-[44px] cursor-pointer items-center rounded-full bg-zinc-700 p-0.5 justify-start">
                                    <div className="h-[20px] w-[20px] rounded-full bg-white shadow-sm"></div>
                                </label>
                            }
                        />
                    </div>
                </section>

                <section>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-1 pb-3 pt-2">{t('settings.account')}</h2>
                    <div className="flex flex-col overflow-hidden rounded-xl bg-white/5 border border-white/5">
                        <SettingRow icon="person" title={t('settings.profile')} />
                        <SettingRow icon="key" title="Change Password" />
                    </div>
                    <div className="mt-3 flex flex-col overflow-hidden rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                        <SettingRow icon="logout" title={t('settings.logout')} isDestructive={true} />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Settings;