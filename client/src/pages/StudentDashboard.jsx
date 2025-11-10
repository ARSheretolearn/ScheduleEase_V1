// src/pages/StudentDashboard.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookAppointmentModal from "../components/BookAppointmentModal";
import CancelAppointmentModal from "../components/CancelAppointmentModal";
import RescheduleAppointmentModal from "../components/RescheduleAppointmentModal"; // ✅ added import
import { PlusCircle, CalendarClock, XCircle } from "lucide-react";

export default function StudentDashboard() {
  const navigate = useNavigate();

  // Mock Appointments
  const [appointments, setAppointments] = useState([
    {
      id: "s-meet",
      title: "Meeting with Director",
      desc: "Project Discussion",
      datetime: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(14, 0, 0, 0);
        return d.toISOString();
      })(),
      status: "Approved",
    },
    {
      id: "s-prop",
      title: "Research Proposal",
      desc: "PhD Proposal Review",
      datetime: new Date(2025, 11, 28, 10, 30).toISOString(),
      status: "Pending",
    },
  ]);

  // State for booking
  const [slotsMap, setSlotsMap] = useState(() => buildDefaultSlots(new Date()));
  const [viewDate, setViewDate] = useState(new Date());
  const [modalPrefill, setModalPrefill] = useState(false);

  // Cancel Modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // ✅ Reschedule Modal state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  // Calendar helpers
  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();
  const monthNames = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Handlers
  const openModal = (pref = { date: "", time: "" }) => setModalPrefill(pref);
  const closeModal = () => setModalPrefill(false);

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = ({ id, reason }) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "Cancelled", reason: reason || "" } : a
      )
    );
  };

  const addAppointment = (appt) => {
    setAppointments((prev) => [appt, ...prev]);
    const dateISO = appt.datetime.slice(0, 10);
    const time = appt.datetime.slice(11, 16);
    setSlotsMap((prev) => {
      const arr = prev[dateISO]?.filter((t) => t !== time) || [];
      return { ...prev, [dateISO]: arr };
    });
  };

  // ✅ Open reschedule modal
  const handleRescheduleClick = (appointment) => {
    setRescheduleTarget(appointment);
    setShowRescheduleModal(true);
  };

  // ✅ Update appointment after reschedule confirmation
  const handleConfirmReschedule = ({ id, datetime }) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, datetime: new Date(datetime).toISOString(), status: "Pending" }
          : a
      )
    );
    setShowRescheduleModal(false);
  };

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} · ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const prevMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          <div>
            <h1 className="text-sky-600 font-semibold text-lg">SchedulEase</h1>
            <p className="text-xs text-gray-500">Student Dashboard</p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="border border-gray-300 text-sm px-3 py-1 rounded-md hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="mt-6 flex justify-center">
        <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
          <button
            onClick={() => openModal({ date: "", time: "" })}
            className="flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-green-400 shadow hover:opacity-90"
          >
            <PlusCircle size={18} /> Book New Appointment
          </button>
          <button
            onClick={() =>
              appointments.length
                ? handleRescheduleClick(appointments[0])
                : alert("No appointments to reschedule")
            }
            className="flex items-center justify-center gap-2 py-3 rounded-lg font-medium bg-white border border-gray-300 hover:border-blue-400 text-gray-700 transition"
          >
            <CalendarClock size={18} /> Reschedule Appointment
          </button>
          <button
            onClick={() => handleCancelClick(appointments[0])}
            className="flex items-center justify-center gap-2 py-3 rounded-lg font-medium bg-white border border-gray-300 hover:border-rose-400 text-gray-700 transition"
          >
            <XCircle size={18} /> Cancel Appointment
          </button>
        </div>
      </section>

      {/* Two Column Layout */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 py-6">
        {/* My Appointments */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">My Appointments</h3>
          {appointments.length === 0 ? (
            <div className="text-gray-500 text-sm">No Appointments Found</div>
          ) : (
            <div className="space-y-4">
              {appointments.map((a) => (
                <div
                  key={a.id}
                  className="border rounded-lg p-4 flex justify-between items-start"
                >
                  <div>
                    <p className="font-semibold text-sm">{a.title}</p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(a.datetime)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{a.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        a.status === "Approved"
                          ? "bg-blue-100 text-blue-700"
                          : a.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {a.status}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRescheduleClick(a)} // ✅ wired to open modal
                        className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancelClick(a)}
                        className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Available Slots</h3>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="px-2 py-1 border rounded">
                ‹
              </button>
              <span className="text-sm text-gray-600">
                {monthNames[month]} {year}
              </span>
              <button onClick={nextMonth} className="px-2 py-1 border rounded">
                ›
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
            {daysOfWeek.map((d) => (
              <div key={d} className="text-center">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-28 rounded border bg-gray-50" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const date = new Date(year, month, idx + 1);
              const iso = date.toISOString().slice(0, 10);
              const times = slotsMap[iso] || [];

              return (
                <div
                  key={iso}
                  className="h-40 rounded border p-2 flex flex-col bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      {idx + 1}
                    </span>
                    <span className="text-xs text-gray-400">{times.length}</span>
                  </div>

                  <div className="mt-1 overflow-auto space-y-1">
                    {times.length === 0 ? (
                      <div className="text-xs text-gray-400">No slots</div>
                    ) : (
                      times.slice(0, 3).map((t) => (
                        <button
                          key={t}
                          onClick={() => openModal({ date: iso, time: t })}
                          className="w-full text-xs text-left px-2 py-1 border rounded hover:bg-blue-50"
                        >
                          {t}
                        </button>
                      ))
                    )}
                    {times.length > 3 && (
                      <div className="text-xs text-gray-400">
                        +{times.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 pb-10">
        <StatCard
          title="Total Appointments"
          value={appointments.length}
          subtitle="+2 this month"
          color="green"
        />
        <StatCard
          title="Pending Requests"
          value={appointments.filter((a) => a.status === "Pending").length}
          subtitle="Awaiting approval"
          color="yellow"
        />
        <StatCard
          title="Approval Rate"
          value={`${Math.round(
            (appointments.filter((a) => a.status === "Approved").length /
              Math.max(1, appointments.length)) *
              100
          )}%`}
          subtitle={`${appointments.filter((a) => a.status === "Approved").length}/${appointments.length} approved`}
          color="blue"
        />
      </section>

      {/* Book Appointment Modal */}
      {modalPrefill && (
        <BookAppointmentModal
          role="Student"
          defaultDate={modalPrefill.date}
          defaultTime={modalPrefill.time}
          onClose={closeModal}
          onSubmit={addAppointment}
        />
      )}

      {/* Cancel Appointment Modal */}
      {showCancelModal && selectedAppointment && (
        <CancelAppointmentModal
          appointment={selectedAppointment}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleConfirmCancel}
        />
      )}

      {/* ✅ Reschedule Appointment Modal */}
      {showRescheduleModal && rescheduleTarget && (
        <RescheduleAppointmentModal
          appointment={rescheduleTarget}
          onClose={() => setShowRescheduleModal(false)}
          onConfirm={handleConfirmReschedule}
        />
      )}
    </div>
  );
}

/* StatCard Component */
function StatCard({ title, value, subtitle, color }) {
  const colorClass = {
    green: "text-green-500",
    yellow: "text-yellow-500",
    blue: "text-blue-500",
  }[color];
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className={`text-xs ${colorClass} mt-1`}>{subtitle}</div>
    </div>
  );
}

/* Helper: Default available slots */
function buildDefaultSlots(date) {
  const map = {};
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= days; i++) {
    const d = new Date(year, month, i);
    const day = d.getDay();
    const key = d.toISOString().slice(0, 10);
    map[key] =
      day === 0 || day === 6
        ? ["09:00", "10:00"]
        : ["09:00", "09:30", "10:00", "11:00", "14:00"];
  }
  return map;
}
