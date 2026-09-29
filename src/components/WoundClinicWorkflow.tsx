import { useState } from 'react';
import {
  Camera,
  Mic,
  Check,
  ChevronRight,
  AlertTriangle,
  FileText,
  TrendingDown,
  Zap,
  CheckCircle2,
  Activity,
  Stethoscope,
  ClipboardList,
  Pill,
  Calendar,
  Bell,
  Plus,
  X,
  Printer,
  Send,
  Heart,
  Thermometer,
  Wind,
  Droplets,
  MessageSquare,
  UserCheck,
  Users,
} from 'lucide-react';

// ============ TYPES ============
type VisitStatus =
  | 'scheduled'      // On today's schedule
  | 'checked_in'     // Patient arrived
  | 'rooming'        // Nurse taking to room
  | 'nurse_ready'    // Vitals & photos done, waiting for doctor
  | 'with_provider'  // Doctor with patient
  | 'checkout'       // Visit complete, processing orders
  | 'completed';     // Patient left

interface Vitals {
  bp: string;
  hr: number;
  rr: number;
  temp: number;
  spo2: number;
  pain: number;
  weight?: number;
}

interface WoundPhoto {
  id: string;
  url: string;
  timestamp: string;
  measurements?: {
    length: number;
    width: number;
    depth: number;
    area: number;
  };
  tissue?: {
    granulation: number;
    slough: number;
    eschar: number;
    epithelial: number;
  };
}

interface Patient {
  id: string;
  name: string;
  mrn: string;
  dob: string;
  phone: string;
  woundLocation: string;
  woundType: string;
  visitStatus: VisitStatus;
  appointmentTime: string;
  room?: string;
  vitals?: Vitals;
  photos?: WoundPhoto[];
  nurseNotes?: string;
  providerAssessment?: string;
  treatmentPlan?: string;
  orders?: Order[];
  followUp?: string;
}

interface Order {
  id: string;
  type: 'medication' | 'procedure' | 'lab' | 'imaging' | 'referral' | 'supply' | 'followup';
  name: string;
  details?: string;
  status: 'pending' | 'signed' | 'completed';
}

// ============ STATUS CONFIG ============
const STATUS_CONFIG: Record<VisitStatus, { label: string; color: string; bgColor: string; icon: any }> = {
  scheduled: { label: 'Scheduled', color: 'text-gray-500', bgColor: 'bg-gray-100', icon: Calendar },
  checked_in: { label: 'Checked In', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: UserCheck },
  rooming: { label: 'Rooming', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: Users },
  nurse_ready: { label: 'Ready for Provider', color: 'text-purple-600', bgColor: 'bg-purple-50', icon: Bell },
  with_provider: { label: 'With Provider', color: 'text-green-600', bgColor: 'bg-green-50', icon: Stethoscope },
  checkout: { label: 'Checkout', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: ClipboardList },
  completed: { label: 'Completed', color: 'text-gray-500', bgColor: 'bg-gray-50', icon: CheckCircle2 },
};

// ============ DEMO DATA ============
const DEMO_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Robert Chen',
    mrn: 'B5B3DBF3',
    dob: '03/15/1962',
    phone: '(555) 123-4567',
    woundLocation: 'Right plantar foot',
    woundType: 'Diabetic foot ulcer',
    visitStatus: 'nurse_ready',
    appointmentTime: '9:00 AM',
    room: 'Exam 2',
    vitals: { bp: '138/82', hr: 78, rr: 16, temp: 98.4, spo2: 97, pain: 4, weight: 205 },
    photos: [{
      id: 'p1',
      url: '/wound1.jpg',
      timestamp: new Date().toISOString(),
      measurements: { length: 2.3, width: 2.8, depth: 1.2, area: 5.1 },
      tissue: { granulation: 65, slough: 20, eschar: 10, epithelial: 5 },
    }],
    nurseNotes: 'Patient reports wound is less painful than last visit. No fever or chills. Compliant with offloading.',
  },
  {
    id: '2',
    name: 'Maria Santos',
    mrn: '29E03DEA',
    dob: '07/22/1969',
    phone: '(555) 234-5678',
    woundLocation: 'Left lower leg',
    woundType: 'Venous leg ulcer',
    visitStatus: 'checked_in',
    appointmentTime: '9:30 AM',
  },
  {
    id: '3',
    name: 'James Wilson',
    mrn: '614F9EF9',
    dob: '11/08/1954',
    phone: '(555) 345-6789',
    woundLocation: 'Right heel',
    woundType: 'Pressure injury',
    visitStatus: 'with_provider',
    appointmentTime: '10:00 AM',
    room: 'Exam 1',
    vitals: { bp: '142/88', hr: 82, rr: 18, temp: 98.6, spo2: 95, pain: 6 },
    photos: [{
      id: 'p2',
      url: '/wound2.jpg',
      timestamp: new Date().toISOString(),
      measurements: { length: 3.5, width: 3.2, depth: 0.8, area: 8.8 },
      tissue: { granulation: 45, slough: 35, eschar: 15, epithelial: 5 },
    }],
  },
  {
    id: '4',
    name: 'Dorothy Adams',
    mrn: 'A1B2C3D4',
    dob: '04/12/1948',
    phone: '(555) 456-7890',
    woundLocation: 'Sacral area',
    woundType: 'Pressure injury Stage 3',
    visitStatus: 'scheduled',
    appointmentTime: '10:30 AM',
  },
  {
    id: '5',
    name: 'Michael Brown',
    mrn: 'E5F6G7H8',
    dob: '09/30/1958',
    phone: '(555) 567-8901',
    woundLocation: 'Left great toe',
    woundType: 'Diabetic foot ulcer',
    visitStatus: 'checkout',
    appointmentTime: '8:30 AM',
    room: 'Exam 3',
    orders: [
      { id: 'o1', type: 'medication', name: 'Silvadene cream 1%', details: 'Apply to wound daily', status: 'signed' },
      { id: 'o2', type: 'supply', name: 'Foam dressing kit', details: 'Change every 3 days', status: 'signed' },
      { id: 'o3', type: 'followup', name: 'Follow-up visit', details: '1 week', status: 'signed' },
    ],
  },
];

// ============ ORDER TEMPLATES ============
const ORDER_TEMPLATES = {
  medications: [
    { name: 'Silvadene cream 1%', details: 'Apply to wound daily' },
    { name: 'Mupirocin ointment 2%', details: 'Apply to wound BID' },
    { name: 'Metronidazole gel 0.75%', details: 'Apply to wound daily for odor control' },
    { name: 'Santyl ointment', details: 'Apply to wound daily for enzymatic debridement' },
  ],
  supplies: [
    { name: 'Foam dressing kit', details: 'Change every 3 days' },
    { name: 'Alginate dressing', details: 'Change when saturated or every 3-5 days' },
    { name: 'Hydrocolloid dressing', details: 'Change every 5-7 days' },
    { name: 'Collagen matrix dressing', details: 'Apply weekly' },
    { name: 'NPWT supplies', details: 'Change every 48-72 hours' },
  ],
  procedures: [
    { name: 'Sharp debridement', details: 'Remove non-viable tissue' },
    { name: 'Wound vac application', details: 'NPWT at -125 mmHg continuous' },
    { name: 'Skin substitute application', details: 'Apply to wound bed' },
    { name: 'Compression wrap', details: 'Multi-layer compression' },
  ],
};

// ============ MAIN COMPONENT ============
export function WoundClinicWorkflow() {
  const [patients, setPatients] = useState<Patient[]>(DEMO_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [viewMode, setViewMode] = useState<'schedule' | 'nurse' | 'provider'>('schedule');
  const [showOrderPanel, setShowOrderPanel] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);

  // Update patient status
  const updatePatientStatus = (patientId: string, newStatus: VisitStatus, updates?: Partial<Patient>) => {
    setPatients(prev => prev.map(p =>
      p.id === patientId ? { ...p, visitStatus: newStatus, ...updates } : p
    ));
    if (selectedPatient?.id === patientId) {
      setSelectedPatient(prev => prev ? { ...prev, visitStatus: newStatus, ...updates } : null);
    }
  };

  // Add order to pending
  const addOrder = (type: Order['type'], name: string, details?: string) => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      type,
      name,
      details,
      status: 'pending',
    };
    setPendingOrders(prev => [...prev, newOrder]);
  };

  // Sign all orders
  const signOrders = () => {
    if (selectedPatient) {
      const signedOrders = pendingOrders.map(o => ({ ...o, status: 'signed' as const }));
      updatePatientStatus(selectedPatient.id, 'checkout', { orders: signedOrders });
      setPendingOrders([]);
      setShowOrderPanel(false);
    }
  };

  // ============ SCHEDULE VIEW (Front Desk) ============
  const renderScheduleView = () => (
    <div className="space-y-4">
      {/* Status summary */}
      <div className="grid grid-cols-4 gap-4">
        {(['checked_in', 'nurse_ready', 'with_provider', 'checkout'] as VisitStatus[]).map(status => {
          const config = STATUS_CONFIG[status];
          const count = patients.filter(p => p.visitStatus === status).length;
          const Icon = config.icon;
          return (
            <div key={status} className={`${config.bgColor} rounded-xl p-4`}>
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${config.color}`} />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className={`text-sm ${config.color}`}>{config.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Patient list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Today's Schedule</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {patients.map(patient => {
            const config = STATUS_CONFIG[patient.visitStatus];
            const Icon = config.icon;
            return (
              <div
                key={patient.id}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                onClick={() => setSelectedPatient(patient)}
              >
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500 w-16">{patient.appointmentTime}</div>
                  <div>
                    <div className="font-medium text-gray-900">{patient.name}</div>
                    <div className="text-sm text-gray-500">{patient.woundType} • {patient.woundLocation}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {patient.room && (
                    <span className="text-sm text-gray-500">{patient.room}</span>
                  )}
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${config.bgColor} ${config.color}`}>
                    <Icon className="w-4 h-4" />
                    {config.label}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ============ NURSE VIEW ============
  const renderNurseView = () => {
    if (!selectedPatient) {
      return (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a patient from the schedule</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Patient header */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h2>
              <div className="text-sm text-gray-500">
                MRN: {selectedPatient.mrn} • DOB: {selectedPatient.dob} • {selectedPatient.woundType}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedPatient.visitStatus === 'checked_in' && (
                <button
                  onClick={() => updatePatientStatus(selectedPatient.id, 'rooming', { room: 'Exam 2' })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Start Rooming
                </button>
              )}
              {selectedPatient.visitStatus === 'rooming' && (
                <button
                  onClick={() => updatePatientStatus(selectedPatient.id, 'nurse_ready')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Ready for Provider
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Vitals entry */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            Vitals
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'BP', icon: Heart, value: selectedPatient.vitals?.bp || '', unit: 'mmHg', color: 'text-red-500' },
              { label: 'HR', icon: Activity, value: selectedPatient.vitals?.hr || '', unit: 'bpm', color: 'text-pink-500' },
              { label: 'Temp', icon: Thermometer, value: selectedPatient.vitals?.temp || '', unit: '°F', color: 'text-orange-500' },
              { label: 'SpO2', icon: Droplets, value: selectedPatient.vitals?.spo2 || '', unit: '%', color: 'text-blue-500' },
              { label: 'RR', icon: Wind, value: selectedPatient.vitals?.rr || '', unit: '/min', color: 'text-teal-500' },
              { label: 'Pain', icon: AlertTriangle, value: selectedPatient.vitals?.pain || '', unit: '/10', color: 'text-yellow-500' },
            ].map(vital => (
              <div key={vital.label} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <vital.icon className={`w-4 h-4 ${vital.color}`} />
                  {vital.label}
                </div>
                <div className="flex items-baseline gap-1">
                  <input
                    type="text"
                    defaultValue={vital.value}
                    className="w-full text-xl font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                    placeholder="--"
                  />
                  <span className="text-sm text-gray-400">{vital.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wound photo capture */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-500" />
            Wound Photo
          </h3>
          {selectedPatient.photos && selectedPatient.photos.length > 0 ? (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-green-600 font-medium">Photo captured</p>
                  {selectedPatient.photos[0].measurements && (
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedPatient.photos[0].measurements.length} x {selectedPatient.photos[0].measurements.width} x {selectedPatient.photos[0].measurements.depth} cm
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {selectedPatient.photos[0].tissue && Object.entries(selectedPatient.photos[0].tissue).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-2">
                    <div className="text-lg font-semibold">{value}%</div>
                    <div className="text-xs text-gray-500 capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <button className="w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition-colors">
              <Camera className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-gray-600 font-medium">Capture Wound Photo</span>
              <span className="text-sm text-gray-400">AI will auto-measure</span>
            </button>
          )}
        </div>

        {/* Nurse notes */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" />
            Nurse Notes
          </h3>
          <textarea
            defaultValue={selectedPatient.nurseNotes}
            placeholder="Patient reports, observations, concerns..."
            className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
    );
  };

  // ============ PROVIDER VIEW ============
  const renderProviderView = () => {
    if (!selectedPatient) {
      return (
        <div className="text-center py-12 text-gray-500">
          <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a patient to begin assessment</p>
        </div>
      );
    }

    const lastPhoto = selectedPatient.photos?.[0];

    return (
      <div className="space-y-6">
        {/* Patient header with quick info */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{selectedPatient.name}</h2>
              <div className="text-indigo-200 text-sm">
                {selectedPatient.woundType} • {selectedPatient.woundLocation} • {selectedPatient.room}
              </div>
            </div>
            {selectedPatient.visitStatus === 'nurse_ready' && (
              <button
                onClick={() => updatePatientStatus(selectedPatient.id, 'with_provider')}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium"
              >
                Start Visit
              </button>
            )}
          </div>

          {/* Quick vitals */}
          {selectedPatient.vitals && (
            <div className="flex gap-6 mt-4 text-sm">
              <span>BP: <strong>{selectedPatient.vitals.bp}</strong></span>
              <span>HR: <strong>{selectedPatient.vitals.hr}</strong></span>
              <span>Temp: <strong>{selectedPatient.vitals.temp}°F</strong></span>
              <span>SpO2: <strong>{selectedPatient.vitals.spo2}%</strong></span>
              <span>Pain: <strong>{selectedPatient.vitals.pain}/10</strong></span>
            </div>
          )}
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Wound info */}
          <div className="space-y-4">
            {/* Wound measurements */}
            {lastPhoto?.measurements && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Current Measurements</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-gray-900">{lastPhoto.measurements.area.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">Area (cm²)</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-gray-900">{lastPhoto.measurements.depth}</div>
                    <div className="text-sm text-gray-500">Depth (cm)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
                  <TrendingDown className="w-4 h-4" />
                  <span>15% smaller than last visit</span>
                </div>
              </div>
            )}

            {/* Tissue composition */}
            {lastPhoto?.tissue && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Tissue Composition</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Granulation', value: lastPhoto.tissue.granulation, color: 'bg-red-500' },
                    { label: 'Slough', value: lastPhoto.tissue.slough, color: 'bg-yellow-400' },
                    { label: 'Eschar', value: lastPhoto.tissue.eschar, color: 'bg-gray-800' },
                    { label: 'Epithelial', value: lastPhoto.tissue.epithelial, color: 'bg-pink-300' },
                  ].map(t => (
                    <div key={t.label} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${t.color}`} />
                      <span className="text-sm text-gray-600 w-24">{t.label}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${t.color}`} style={{ width: `${t.value}%` }} />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{t.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nurse notes */}
            {selectedPatient.nurseNotes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Nurse Notes
                </h3>
                <p className="text-sm text-yellow-900">{selectedPatient.nurseNotes}</p>
              </div>
            )}
          </div>

          {/* Right: Assessment & Plan */}
          <div className="space-y-4">
            {/* Provider assessment */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-indigo-500" />
                Assessment
              </h3>
              <textarea
                placeholder="Document your clinical assessment...

• Wound appearance and progress
• Signs of infection
• Healing trajectory
• Patient concerns discussed"
                className="w-full h-40 p-3 border border-gray-200 rounded-lg resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
              />
              <div className="flex items-center gap-2 mt-2">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600">
                  <Mic className="w-4 h-4" />
                  Dictate
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-sm text-indigo-600">
                  <Zap className="w-4 h-4" />
                  AI Assist
                </button>
              </div>
            </div>

            {/* Treatment plan */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-green-500" />
                Treatment Plan
              </h3>
              <textarea
                placeholder="Document treatment plan...

• Wound care instructions
• Dressing changes
• Offloading requirements
• Activity modifications"
                className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm"
              />
            </div>

            {/* Order button */}
            <button
              onClick={() => setShowOrderPanel(true)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Orders
            </button>

            {/* Pending orders */}
            {pendingOrders.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Pending Orders ({pendingOrders.length})</h3>
                <div className="space-y-2">
                  {pendingOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                      <div>
                        <div className="font-medium text-sm">{order.name}</div>
                        {order.details && <div className="text-xs text-gray-500">{order.details}</div>}
                      </div>
                      <button
                        onClick={() => setPendingOrders(prev => prev.filter(o => o.id !== order.id))}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={signOrders}
                  className="w-full mt-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Sign Orders & Complete Visit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ============ ORDER PANEL ============
  const renderOrderPanel = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowOrderPanel(false)}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Orders</h2>
          <button onClick={() => setShowOrderPanel(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Medications */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-500" />
              Medications
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {ORDER_TEMPLATES.medications.map(med => (
                <button
                  key={med.name}
                  onClick={() => addOrder('medication', med.name, med.details)}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-sm">{med.name}</div>
                  <div className="text-xs text-gray-500">{med.details}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Supplies */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-green-500" />
              Supplies & Dressings
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {ORDER_TEMPLATES.supplies.map(supply => (
                <button
                  key={supply.name}
                  onClick={() => addOrder('supply', supply.name, supply.details)}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <div className="font-medium text-sm">{supply.name}</div>
                  <div className="text-xs text-gray-500">{supply.details}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Procedures */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-purple-500" />
              Procedures
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {ORDER_TEMPLATES.procedures.map(proc => (
                <button
                  key={proc.name}
                  onClick={() => addOrder('procedure', proc.name, proc.details)}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                >
                  <div className="font-medium text-sm">{proc.name}</div>
                  <div className="text-xs text-gray-500">{proc.details}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Follow-up */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              Follow-up
            </h3>
            <div className="flex gap-2">
              {['3 days', '1 week', '2 weeks', '1 month'].map(interval => (
                <button
                  key={interval}
                  onClick={() => addOrder('followup', 'Follow-up visit', interval)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-sm font-medium"
                >
                  {interval}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => setShowOrderPanel(false)}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
          >
            Done Adding Orders
          </button>
        </div>
      </div>
    </div>
  );

  // ============ CHECKOUT VIEW ============
  const _renderCheckoutView = () => {
    const checkoutPatients = patients.filter(p => p.visitStatus === 'checkout');

    if (checkoutPatients.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No patients in checkout</p>
        </div>
      );
    }

    const patient = checkoutPatients[0];

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center mb-6">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Visit Complete</h2>
            <p className="text-gray-500">{patient.name}</p>
          </div>

          {/* Orders summary */}
          {patient.orders && patient.orders.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Orders</h3>
              <div className="space-y-2">
                {patient.orders.map(order => (
                  <div key={order.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">{order.name}</div>
                      {order.details && <div className="text-sm text-gray-500">{order.details}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 py-3 border border-gray-200 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-50">
              <Printer className="w-5 h-5" />
              Print Instructions
            </button>
            <button className="flex-1 py-3 border border-gray-200 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-50">
              <Send className="w-5 h-5" />
              Send to Patient
            </button>
          </div>

          <button
            onClick={() => updatePatientStatus(patient.id, 'completed')}
            className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium"
          >
            Complete Checkout
          </button>
        </div>
      </div>
    );
  };

  // ============ MAIN RENDER ============
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with role tabs */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Wound Care Clinic</h1>
            <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'nurse', label: 'Nurse', icon: Users },
              { id: 'provider', label: 'Provider', icon: Stethoscope },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        <div className="flex gap-6">
          {/* Left sidebar - patient list (always visible) */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-6">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900 text-sm">Patients</h2>
              </div>
              <div className="divide-y divide-gray-100 max-h-[calc(100vh-200px)] overflow-y-auto">
                {patients.filter(p => p.visitStatus !== 'completed').map(patient => {
                  const config = STATUS_CONFIG[patient.visitStatus];
                  const isSelected = selectedPatient?.id === patient.id;
                  return (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{patient.name}</div>
                          <div className="text-xs text-gray-500">{patient.appointmentTime} • {patient.woundLocation}</div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {viewMode === 'schedule' && renderScheduleView()}
            {viewMode === 'nurse' && renderNurseView()}
            {viewMode === 'provider' && renderProviderView()}
          </div>
        </div>
      </div>

      {/* Order panel modal */}
      {showOrderPanel && renderOrderPanel()}
    </div>
  );
}

export default WoundClinicWorkflow;
