import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Car, Laptop, Clock, AlertTriangle, Trash2, CalendarDays, Plus } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import Calendar from '../../components/ui/common/Calendar';
import Drawer from '../../components/ui/modals/Drawer';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';
import StatusBadge from '../../components/ui/badges/StatusBadge';
import TextInput from '../../components/ui/inputs/TextInput';
import Select from '../../components/ui/inputs/Select';
import toast from 'react-hot-toast';

export default function BookingsPage() {
  const {
    bookings,
    createBooking,
    cancelBooking,
    rescheduleBooking
  } = useMockState();

  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedBkg, setSelectedBkg] = useState(null);

  // Form states
  const [resourceType, setResourceType] = useState('Meeting Rooms');
  const [resourceId, setResourceId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Reschedule form states
  const [resDate, setResDate] = useState('');
  const [resStart, setResStart] = useState('');
  const [resEnd, setResEnd] = useState('');

  const resources = {
    'Meeting Rooms': [
      { id: 'res-room-1', name: 'Conference Room Alpha (Cap: 12)' },
      { id: 'res-room-2', name: 'Board Room Beta (Cap: 8)' },
      { id: 'res-room-3', name: 'Huddle Room Gamma (Cap: 4)' }
    ],
    'Vehicles': [
      { id: 'res-veh-1', name: 'Tesla Model 3 (Fleet A)' },
      { id: 'res-veh-2', name: 'Chevrolet Bolt EV (Fleet B)' }
    ],
    'Equipment': [
      { id: 'res-eq-1', name: 'VR Headset (Vision Pro)' },
      { id: 'res-eq-2', name: '4K DSLR Camera (Sony Alpha)' }
    ]
  };

  const handleBook = (e) => {
    e.preventDefault();
    if (!resourceId || !bookingDate || !startTime || !endTime) {
      toast.error('All fields are required.');
      return;
    }

    if (startTime >= endTime) {
      toast.error('Start time must be before end time.');
      return;
    }

    const selectedResource = resources[resourceType].find(r => r.id === resourceId);

    try {
      createBooking(resourceId, selectedResource.name, resourceType, bookingDate, startTime, endTime);
      
      // Reset Form
      setResourceId('');
      setBookingDate('');
      setStartTime('');
      setEndTime('');
      setIsBookOpen(false);
      toast.success('Resource successfully booked!');
    } catch (err) {
      toast.error(err.message || 'Double booking detected!');
    }
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBkg || !resDate || !resStart || !resEnd) return;

    if (resStart >= resEnd) {
      toast.error('Start time must be before end time.');
      return;
    }

    try {
      rescheduleBooking(selectedBkg.id, resDate, resStart, resEnd);
      setIsRescheduleOpen(false);
      setSelectedBkg(null);
      toast.success('Reservation successfully rescheduled!');
    } catch (err) {
      toast.error(err.message || 'Double booking conflict!');
    }
  };

  const handleCancel = (id) => {
    cancelBooking(id);
    toast.error('Reservation cancelled.');
  };

  const upcomingBookings = bookings.filter(b => b.status === 'Upcoming');
  const pastBookings = bookings.filter(b => b.status !== 'Upcoming');

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Resource Bookings</h2>
          <p className="text-xs text-brand-secondaryText mt-1">Reserve meeting locations, fleet vehicles, and project hardware tools.</p>
        </div>
        <PrimaryButton onClick={() => setIsBookOpen(true)} icon={Plus} className="text-xs">
          New Reservation
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Calendar Grid */}
        <div className="lg:col-span-2">
          <Calendar
            events={bookings}
            onEventClick={(ev) => {
              setSelectedBkg(ev);
              setIsRescheduleOpen(true);
            }}
          />
        </div>

        {/* Right Side: Bookings Logs & Lists */}
        <div className="flex flex-col gap-6">
          {/* Upcoming Reservations */}
          <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-brand-primary" /> Upcoming Bookings
            </h3>
            
            <div className="flex flex-col gap-3.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((b) => (
                  <div key={b.id} className="p-3 bg-slate-900/60 rounded-xl border border-brand-border/60 text-xs flex flex-col gap-2.5">
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <h4 className="font-bold text-white leading-tight">{b.resourceName}</h4>
                        <span className="text-[9px] text-brand-secondaryText uppercase mt-0.5 block">{b.resourceType}</span>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>

                    <div className="flex flex-col gap-1 text-[10px] text-brand-secondaryText font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-mono">{b.date} • {b.startTime} - {b.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Reserved By:</span>
                        <span className="text-white">{b.userName} ({b.userRole})</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-1 border-t border-brand-border/20 pt-2.5">
                      <button
                        onClick={() => {
                          setSelectedBkg(b);
                          setResDate(b.date);
                          setResStart(b.startTime);
                          setResEnd(b.endTime);
                          setIsRescheduleOpen(true);
                        }}
                        className="text-[9px] font-bold text-brand-primary hover:text-white uppercase tracking-wider transition-colors"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="text-[9px] font-bold text-brand-danger hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors ml-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-brand-secondaryText text-[11px]">
                  No upcoming reservations.
                </div>
              )}
            </div>
          </div>

          {/* Past Bookings Summary */}
          <div className="glass-panel p-5 rounded-2xl border border-brand-border/40 bg-[#111827] flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed / Cancelled</h3>
            <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1 text-xs">
              {pastBookings.map((b) => (
                <div key={b.id} className="flex justify-between items-center py-2 border-b border-brand-border/10">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-300 truncate max-w-[150px]">{b.resourceName}</div>
                    <div className="text-[9px] text-brand-secondaryText font-mono mt-0.5">{b.date}</div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Drawer */}
      <Drawer
        isOpen={isBookOpen}
        onClose={() => setIsBookOpen(false)}
        title="Reserve Corporate Resource"
        size="md"
      >
        <form onSubmit={handleBook} className="flex flex-col gap-5">
          <Select
            label="Resource Category"
            value={resourceType}
            onChange={(e) => {
              setResourceType(e.target.value);
              setResourceId('');
            }}
            required
          >
            <option value="Meeting Rooms">Meeting Rooms</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Equipment">Project Equipment</option>
          </Select>

          <Select
            label="Select Resource Item"
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            required
          >
            <option value="">-- Choose item --</option>
            {resources[resourceType].map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </Select>

          <TextInput
            label="Reservation Date"
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3.5">
            <TextInput
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <TextInput
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2.5 mt-3">
            <SecondaryButton type="button" onClick={() => setIsBookOpen(false)} className="flex-1 text-xs py-2">
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" className="flex-1 text-xs py-2">
              Book Resource
            </PrimaryButton>
          </div>
        </form>
      </Drawer>

      {/* Reschedule Drawer */}
      <Drawer
        isOpen={isRescheduleOpen}
        onClose={() => {
          setIsRescheduleOpen(false);
          setSelectedBkg(null);
        }}
        title="Reschedule Reservation"
        size="md"
      >
        {selectedBkg && (
          <form onSubmit={handleRescheduleSubmit} className="flex flex-col gap-5">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-brand-border text-xs text-brand-secondaryText">
              Modifying: <strong className="text-white">{selectedBkg.resourceName}</strong><br />
              Currently Scheduled: <span className="font-mono text-white">{selectedBkg.date} ({selectedBkg.startTime} - {selectedBkg.endTime})</span>
            </div>

            <TextInput
              label="New Reservation Date"
              type="date"
              value={resDate}
              onChange={(e) => setResDate(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3.5">
              <TextInput
                label="New Start Time"
                type="time"
                value={resStart}
                onChange={(e) => setResStart(e.target.value)}
                required
              />
              <TextInput
                label="New End Time"
                type="time"
                value={resEnd}
                onChange={(e) => setResEnd(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-2.5 mt-3">
              <SecondaryButton
                type="button"
                onClick={() => {
                  setIsRescheduleOpen(false);
                  setSelectedBkg(null);
                }}
                className="flex-1 text-xs py-2"
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" className="flex-1 text-xs py-2">
                Save Schedule
              </PrimaryButton>
            </div>
          </form>
        )}
      </Drawer>
    </div>
  );
}
