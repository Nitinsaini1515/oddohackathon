import React, { useState } from 'react';
import { Bell, CheckSquare, Settings, Mail, Smartphone, Eye, CalendarClock } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import NotificationCard from '../../components/ui/cards/NotificationCard';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import Checkbox from '../../components/ui/inputs/Checkbox';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const {
    notifications,
    currentUser,
    setCurrentUser,
    markNotificationRead,
    markAllNotificationsRead
  } = useMockState();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'

  // Settings form states
  const [emailAlerts, setEmailAlerts] = useState(currentUser.notifications?.emailAlerts ?? true);
  const [pushNotifications, setPushNotifications] = useState(currentUser.notifications?.pushNotifications ?? false);
  const [weeklyDigest, setWeeklyDigest] = useState(currentUser.notifications?.weeklyDigest ?? true);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setCurrentUser(prev => ({
      ...prev,
      notifications: {
        emailAlerts,
        pushNotifications,
        weeklyDigest
      }
    }));
    toast.success('Notification preferences updated!');
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-5.5 h-5.5 text-brand-primary" />
            <span>Notification Center</span>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-brand-danger text-white px-2 py-0.5 rounded-full font-black">
                {unreadCount} New
              </span>
            )}
          </h2>
          <p className="text-xs text-brand-secondaryText mt-1">Configure user alert targets and process system broadcasts.</p>
        </div>
        {unreadCount > 0 && (
          <SecondaryButton onClick={markAllNotificationsRead} icon={CheckSquare} className="text-xs py-2">
            Mark All as Read
          </SecondaryButton>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Notifications Feed */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2.5 border-b border-brand-border/20 pb-3">
            <button
              onClick={() => setActiveTab('all')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'all'
                  ? 'bg-brand-primary/10 text-white border border-brand-primary/20'
                  : 'text-brand-secondaryText hover:text-white'
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'unread'
                  ? 'bg-brand-primary/10 text-white border border-brand-primary/20'
                  : 'text-brand-secondaryText hover:text-white'
              }`}
            >
              Unread Only ({unreadCount})
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <NotificationCard
                  key={notif.id}
                  notification={notif}
                  onMarkRead={markNotificationRead}
                />
              ))
            ) : (
              <div className="text-center py-12 glass-panel border border-brand-border/40 rounded-xl text-brand-secondaryText text-xs">
                No active notifications to display in this view.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Preference Settings */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4.5 self-start">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-brand-primary" /> Delivery Channels
          </h3>

          <form onSubmit={handleSaveSettings} className="flex flex-col gap-4 text-xs">
            <div className="space-y-3 p-3.5 bg-slate-900/60 rounded-xl border border-brand-border/40">
              <Checkbox
                label="Email Alerts (Assignments / Maintenance updates)"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
              />
              <Checkbox
                label="Realtime Push Notifications (Dashboard alerts)"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
              />
              <Checkbox
                label="Weekly Digest summary PDF emails"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
              />
            </div>

            <PrimaryButton type="submit" className="w-full text-xs py-2">
              Save Preferences
            </PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  );
}
