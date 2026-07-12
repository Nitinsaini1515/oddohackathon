import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { User, Shield, BellRing, Save, Key, BadgeCheck } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import TextInput from '../../components/ui/inputs/TextInput';
import Toggle from '../../components/ui/inputs/Toggle';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';
import Avatar from '../../components/ui/avatars/Avatar';

export default function Profile() {
  const { currentUser, setCurrentUser } = useMockState();
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'security' | 'notifications'

  // Forms setup
  const {
    register: registerDetails,
    handleSubmit: handleDetailsSubmit,
    formState: { errors: errorsDetails }
  } = useForm({
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone || '',
      role: currentUser.role
    }
  });

  const {
    register: registerSecurity,
    handleSubmit: handleSecuritySubmit,
    reset: resetSecurity,
    watch: watchSecurity,
    formState: { errors: errorsSecurity }
  } = useForm();

  const watchNewPassword = watchSecurity('newPassword');

  const onDetailsSubmit = (data) => {
    setCurrentUser(prev => ({
      ...prev,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role
    }));
    toast.success('Profile details saved successfully!', {
      style: {
        background: '#111827',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }
    });
  };

  const onSecuritySubmit = (data) => {
    toast.success('Security settings modified! Password updated.', {
      style: {
        background: '#111827',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }
    });
    resetSecurity();
  };

  const handleNotificationToggle = (key) => {
    setCurrentUser(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
    toast.success('Notification settings modified.');
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Profile Settings</h2>
        <p className="text-xs text-brand-secondaryText mt-1">Configure account details, notifications, and security protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Profile Card & Navigation Tabs Column */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="glass-panel border border-brand-border/40 rounded-2xl p-5 text-center bg-slate-900/40">
            <Avatar name={currentUser.name} size="xl" className="mx-auto" />
            <h3 className="text-sm font-bold text-white mt-3.5 leading-tight">{currentUser.name}</h3>
            <span className="text-[10px] text-brand-secondaryText font-medium block mt-1">{currentUser.role}</span>
            <span className="text-[9px] bg-slate-950 border border-brand-border text-slate-500 font-mono px-2 py-0.5 rounded mt-2.5 inline-block font-semibold">
              JOINED {currentUser.joiningDate}
            </span>
          </div>

          <div className="glass-panel border border-brand-border/40 rounded-2xl p-2.5 flex flex-col gap-1 bg-slate-900/40 text-xs font-semibold text-brand-secondaryText">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                activeTab === 'details' ? 'bg-brand-primary/10 border border-brand-primary/20 text-white font-bold' : 'hover:bg-brand-cardHover border border-transparent'
              }`}
            >
              <User className="w-4 h-4" /> Account Details
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                activeTab === 'security' ? 'bg-brand-primary/10 border border-brand-primary/20 text-white font-bold' : 'hover:bg-brand-cardHover border border-transparent'
              }`}
            >
              <Shield className="w-4 h-4" /> Password & Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                activeTab === 'notifications' ? 'bg-brand-primary/10 border border-brand-primary/20 text-white font-bold' : 'hover:bg-brand-cardHover border border-transparent'
              }`}
            >
              <BellRing className="w-4 h-4" /> Notification Settings
            </button>
          </div>
        </div>

        {/* Dynamic Details Form Panel Column */}
        <div className="lg:col-span-3 glass-panel border border-brand-border/40 rounded-2xl p-5 md:p-6 bg-slate-900/40">
          
          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <form onSubmit={handleDetailsSubmit(onDetailsSubmit)} className="flex flex-col gap-4">
              <div className="pb-3 border-b border-brand-border/30">
                <h3 className="text-sm font-bold text-white">Account Information</h3>
                <p className="text-[10px] text-brand-secondaryText mt-0.5">Edit basic metadata for your user account.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label="Full Name"
                  placeholder="e.g. David Miller"
                  error={errorsDetails.name?.message}
                  required
                  {...registerDetails('name', { required: 'Name is required' })}
                />
                <TextInput
                  label="Role Description"
                  placeholder="e.g. IT Manager"
                  error={errorsDetails.role?.message}
                  required
                  {...registerDetails('role', { required: 'Role is required' })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label="Email Address"
                  type="email"
                  placeholder="e.g. david.m@assetflow.com"
                  error={errorsDetails.email?.message}
                  required
                  {...registerDetails('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email'
                    }
                  })}
                />
                <TextInput
                  label="Phone Number"
                  placeholder="e.g. +1 (555) 019-5821"
                  error={errorsDetails.phone?.message}
                  {...registerDetails('phone')}
                />
              </div>

              <div className="flex justify-end mt-4">
                <PrimaryButton type="submit" className="text-xs px-5" icon={Save}>
                  Save Profile
                </PrimaryButton>
              </div>
            </form>
          )}

          {/* TAB 2: SECURITY */}
          {activeTab === 'security' && (
            <form onSubmit={handleSecuritySubmit(onSecuritySubmit)} className="flex flex-col gap-4">
              <div className="pb-3 border-b border-brand-border/30">
                <h3 className="text-sm font-bold text-white">Change Credentials</h3>
                <p className="text-[10px] text-brand-secondaryText mt-0.5">Modify account security password keys.</p>
              </div>

              <TextInput
                label="Current Password"
                type="password"
                placeholder="Enter current password..."
                error={errorsSecurity.currentPassword?.message}
                required
                {...registerSecurity('currentPassword', { required: 'Current password is required' })}
              />

              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label="New Password"
                  type="password"
                  placeholder="Enter new password..."
                  error={errorsSecurity.newPassword?.message}
                  required
                  {...registerSecurity('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <TextInput
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm new password..."
                  error={errorsSecurity.confirmPassword?.message}
                  required
                  {...registerSecurity('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (val) => val === watchNewPassword || 'Passwords do not match'
                  })}
                />
              </div>

              <div className="flex justify-end mt-4">
                <PrimaryButton type="submit" className="text-xs px-5" icon={Key}>
                  Update Password
                </PrimaryButton>
              </div>
            </form>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="flex flex-col gap-5">
              <div className="pb-3 border-b border-brand-border/30">
                <h3 className="text-sm font-bold text-white">Alert Preferences</h3>
                <p className="text-[10px] text-brand-secondaryText mt-0.5">Configure when and where to receive alert feeds.</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="p-3 bg-slate-950/40 border border-brand-border/40 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Email Alerts</span>
                    <span className="text-[10px] text-brand-secondaryText block mt-1">Receive procurement and audit notifications in your inbox.</span>
                  </div>
                  <Toggle
                    checked={currentUser.notifications?.emailAlerts}
                    onChange={() => handleNotificationToggle('emailAlerts')}
                  />
                </div>

                <div className="p-3 bg-slate-950/40 border border-brand-border/40 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Push Notifications</span>
                    <span className="text-[10px] text-brand-secondaryText block mt-1">In-browser toast notifications for status updates.</span>
                  </div>
                  <Toggle
                    checked={currentUser.notifications?.pushNotifications}
                    onChange={() => handleNotificationToggle('pushNotifications')}
                  />
                </div>

                <div className="p-3 bg-slate-950/40 border border-brand-border/40 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Weekly Summary Digest</span>
                    <span className="text-[10px] text-brand-secondaryText block mt-1">Receive a weekly digest summarizing total value changes and health metrics.</span>
                  </div>
                  <Toggle
                    checked={currentUser.notifications?.weeklyDigest}
                    onChange={() => handleNotificationToggle('weeklyDigest')}
                  />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
