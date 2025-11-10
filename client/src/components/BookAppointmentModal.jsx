import React, { useEffect, useState } from "react";

/**
 * BookAppointmentModal.jsx
 *
 * Props:
 * - role: string (e.g. "NITC Student" or "External User")
 * - defaultDate: "YYYY-MM-DD" (optional)
 * - defaultTime: "HH:MM" (optional)
 * - onClose: function
 * - onSubmit: function(appointmentObject)
 *
 * Appointment object returned on submit:
 * { id, title, meetingType, duration, date, time, agenda, docs, name, email, phone, role, status }
 *
 * This component is intentionally matched to the screenshot: same fields, layout, spacing.
 */

export default function BookAppointmentModal({
  role = "NITC Student",
  defaultDate = "",
  defaultTime = "",
  onClose = () => {},
  onSubmit = () => {},
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    meetingType: "",
    duration: "",
    purpose: "",
    agenda: "",
    docs: "",
    date: defaultDate || "",
    time: defaultTime || "",
  });

  useEffect(() => {
    if (defaultDate) setForm((s) => ({ ...s, date: defaultDate }));
    if (defaultTime) setForm((s) => ({ ...s, time: defaultTime }));
  }, [defaultDate, defaultTime]);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // minimal required validation matching screenshot (fields with *)
    if (!form.name || !form.email || !form.meetingType || !form.duration || !form.purpose || !form.date || !form.time) {
      alert("Please fill all required fields marked with *");
      return;
    }

    const appt = {
      id: "ap" + Math.random().toString(36).slice(2, 9),
      title: form.purpose,
      meetingType: form.meetingType,
      duration: form.duration,
      date: form.date,
      time: form.time,
      agenda: form.agenda,
      docs: form.docs,
      name: form.name,
      email: form.email,
      phone: form.phone,
      role,
      status: role.toLowerCase().includes("student") ? "Approved" : "Pending",
    };

    onSubmit(appt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl mt-12 mb-12">
        {/* top bar */}
        <div className="flex items-start justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Book Appointment - {role}</h3>
            <p className="text-sm text-gray-500">Your appointment will be automatically approved if the time slot is available.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            ✕
          </button>
        </div>

        {/* scrollable body */}
        <form onSubmit={handleSubmit} className="max-h-[72vh] overflow-y-auto p-6 space-y-6">
          {/* badge + small instruction (matches screenshot) */}
          <div className="flex items-center gap-3">
            <div className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Auto-Approval</div>
            <div className="text-sm text-gray-600">Your appointment will be automatically approved if the time slot is available.</div>
          </div>

          {/* Personal Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="text-sky-600">👤</div>
              <h4 className="text-sm font-medium text-gray-800">Personal Information</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">Full Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={change}
                  placeholder="Enter your full name"
                  className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Email Address *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={change}
                  placeholder="your.email@example.com"
                  className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-gray-600">Phone Number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={change}
                  placeholder="+91 98765 43210"
                  className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </div>

          {/* Meeting Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="text-green-600">📅</div>
              <h4 className="text-sm font-medium text-gray-800">Meeting Details</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-xs text-gray-600">Meeting Type *</label>
                <select
                  name="meetingType"
                  value={form.meetingType}
                  onChange={change}
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select meeting type</option>
                  <option value="Project Discussion">Project Discussion</option>
                  <option value="Research Proposal">Research Proposal</option>
                  <option value="Academic Query">Academic Query</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-600">Preferred Duration *</label>
                <select
                  name="duration"
                  value={form.duration}
                  onChange={change}
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select duration</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-600">Date & Time *</label>
                <div className="flex gap-2">
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={change}
                    className="w-1/2 border rounded px-3 py-2 text-sm"
                    required
                  />
                  <input
                    name="time"
                    type="time"
                    value={form.time}
                    onChange={change}
                    className="w-1/2 border rounded px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs text-gray-600">Purpose of Meeting *</label>
              <input
                name="purpose"
                value={form.purpose}
                onChange={change}
                placeholder="Brief summary of the meeting purpose"
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="text-yellow-600">📝</div>
              <h4 className="text-sm font-medium text-gray-800">Additional Information</h4>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600">Meeting Agenda *</label>
                <textarea
                  name="agenda"
                  value={form.agenda}
                  onChange={change}
                  rows={4}
                  placeholder="Detailed agenda or points to be discussed..."
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Documents/Materials</label>
                <input
                  name="docs"
                  value={form.docs}
                  onChange={change}
                  placeholder="List any documents or materials you'll bring or need..."
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-gray-50 border rounded p-3 text-sm text-gray-600">
            <strong className="block mb-1">Important Notes:</strong>
            <ul className="list-disc pl-5 space-y-1">
              <li>Appointments are automatically approved if slot is available.</li>
              <li>You can book until 5:00 PM for the next day.</li>
              <li>Limit of one appointment per day.</li>
              <li>Please arrive 5 minutes before your scheduled time.</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 border rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-2/3 rounded px-4 py-2 text-sm text-white bg-gradient-to-r from-blue-400 to-teal-400 hover:opacity-95"
            >
              Book Appointment
            </button>
          </div>
        </form>

        {/* little decorative scrollbar triangle like screenshot (right side) */}
        <div className="absolute right-2 top-3 text-gray-400 text-xs select-none">▴</div>
      </div>
    </div>
  );
}
