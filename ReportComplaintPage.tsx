import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  PlusCircle, 
  ArrowLeft, 
  Image as ImageIcon, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  Info,
  Building,
  Layers,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { EmergencyBanner } from '../components/common/EmergencyBanner';
import { StatusBadge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { detectDuplicates } from '../utils/duplicateDetector';
import { ComplaintCategory, LocationZone, PriorityLevel, ComplaintRecord } from '../types';

const CATEGORIES: ComplaintCategory[] = [
  'Water Leakage',
  'Water Supply Problem',
  'Electricity Failure',
  'Lift Malfunction',
  'Security Concern',
  'Theft or Suspicious Activity',
  'Garbage and Sanitation',
  'Road Damage',
  'Stray Animals',
  'Fire or Safety Hazard',
  'Other Maintenance Issue'
];

export const ReportComplaintPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { complaints, createComplaint } = useData();

  // Form states with query param pre-fills
  const initialBuilding = searchParams.get('building') || 'bldg-a';
  const initialFloor = searchParams.get('floor') || `${initialBuilding}-f2`;
  const initialZone = (searchParams.get('zone') as LocationZone) || 'CORRIDOR';

  const [buildingId, setBuildingId] = useState<string>(initialBuilding);
  const [floorId, setFloorId] = useState<string>(initialFloor);
  const [locationZone, setLocationZone] = useState<LocationZone>(initialZone);
  const [category, setCategory] = useState<ComplaintCategory>('Water Leakage');
  const [title, setTitle] = useState<string>('');
  const [exactLocation, setExactLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [suggestedPriority, setSuggestedPriority] = useState<PriorityLevel>('medium');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Validation & Submission states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [duplicateMatches, setDuplicateMatches] = useState<ComplaintRecord[]>([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState<boolean>(false);

  // Sync floorId when building changes
  useEffect(() => {
    if (!floorId.startsWith(buildingId)) {
      setFloorId(`${buildingId}-f2`);
    }
  }, [buildingId]);

  // Handle Photo selection with size & format validation
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Photo size exceeds 2 MB limit.');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only JPG, PNG, and WebP images are permitted.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (title.trim().length < 5 || title.trim().length > 80) {
      errs.title = 'Title must be between 5 and 80 characters.';
    }
    if (description.trim().length < 20 || description.trim().length > 500) {
      errs.description = 'Description must be between 20 and 500 characters.';
    }
    if (!exactLocation.trim()) {
      errs.exactLocation = 'Please provide exact landmark or location.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Check for duplicates
    const matches = detectDuplicates(
      {
        buildingId,
        floorId,
        category,
        locationZone,
        title,
        description
      },
      complaints
    );

    if (matches.length > 0) {
      setDuplicateMatches(matches);
      setShowDuplicateModal(true);
      return;
    }

    // Proceed if no duplicate detected
    commitSubmission([]);
  };

  const commitSubmission = async (duplicateIds: string[]) => {
    setIsSubmitting(true);
    setShowDuplicateModal(false);

    try {
      const isSensitive = [
        'Theft or Suspicious Activity', 
        'Security Concern'
      ].includes(category);

      const created = await createComplaint({
        title: title.trim(),
        category,
        description: description.trim(),
        buildingId,
        floorId,
        locationZone,
        exactLocation: exactLocation.trim(),
        imageUrl: photoPreview || undefined,
        reporterId: currentUser.userId,
        suggestedPriority,
        priority: suggestedPriority,
        visibility: isSensitive || isPrivate ? 'private' : 'public',
        possibleDuplicateOf: duplicateIds
      });

      navigate(`/complaint/${created.complaintId}`);
    } catch (err) {
      console.error('Failed to submit complaint:', err);
      alert('Failed to submit complaint. Please check fields and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <div className="space-y-1">
        <Link to="/map" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Society Map
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Report Maintenance or Safety Issue
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Logged under Green Valley Residency system • All tickets receive atomic tracking numbers
        </p>
      </div>

      {/* Emergency Advisory Banner */}
      <EmergencyBanner category={category} />

      {/* Report Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Category & Title */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Complaint Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Complaint Title * (5–80 chars)
            </label>
            <input
              type="text"
              placeholder="e.g. Water pooling outside elevator entrance"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.title ? 'border-rose-500' : 'border-slate-800'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
          </div>
        </div>

        {/* Location Mapping Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Building Tower *
            </label>
            <select
              value={buildingId}
              onChange={(e) => setBuildingId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="bldg-a">Building A</option>
              <option value="bldg-b">Building B</option>
              <option value="bldg-c">Building C</option>
              <option value="bldg-d">Building D</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Floor Level *
            </label>
            <select
              value={floorId}
              onChange={(e) => setFloorId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value={`${buildingId}-f0`}>Ground Floor</option>
              <option value={`${buildingId}-f1`}>First Floor</option>
              <option value={`${buildingId}-f2`}>Second Floor</option>
              <option value={`${buildingId}-f3`}>Third Floor</option>
              <option value={`${buildingId}-f4`}>Fourth Floor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Location Zone *
            </label>
            <select
              value={locationZone}
              onChange={(e) => setLocationZone(e.target.value as LocationZone)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="CORRIDOR">Corridor Hallway</option>
              <option value="LIFT_LOBBY">Lift Lobby</option>
              <option value="FLAT_DOOR_AREA">Flat Door Entrance</option>
              <option value="STAIRCASE">Staircase / Fire Exit</option>
              <option value="COMMON_AREA">Common / Utility Area</option>
            </select>
          </div>
        </div>

        {/* Exact Location Landmark */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Exact Location / Specific Landmark *
          </label>
          <input
            type="text"
            placeholder="e.g. Near Flat 202 door and electrical shaft"
            value={exactLocation}
            onChange={(e) => setExactLocation(e.target.value)}
            className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              errors.exactLocation ? 'border-rose-500' : 'border-slate-800'
            }`}
          />
          {errors.exactLocation && <p className="text-xs text-rose-400 mt-1">{errors.exactLocation}</p>}
        </div>

        {/* Detailed Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Detailed Description * (20–500 chars)
          </label>
          <textarea
            rows={4}
            placeholder="Provide clear details on when the issue began, severity, and any immediate hazards..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full bg-slate-950 border rounded-xl p-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              errors.description ? 'border-rose-500' : 'border-slate-800'
            }`}
          />
          <div className="flex justify-between items-center text-xs mt-1">
            {errors.description ? (
              <span className="text-rose-400">{errors.description}</span>
            ) : (
              <span className="text-slate-500">Minimum 20 characters required.</span>
            )}
            <span className={description.length > 500 ? 'text-rose-400' : 'text-slate-500'}>
              {description.length} / 500
            </span>
          </div>
        </div>

        {/* Photo Upload (Max 2MB) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Photo Attachment (Optional, Max 2MB, JPG/PNG/WebP)
          </label>
          
          {photoPreview ? (
            <div className="relative inline-block border border-slate-700 rounded-xl overflow-hidden">
              <img src={photoPreview} alt="Preview" className="h-40 w-auto object-cover" />
              <button
                type="button"
                onClick={() => setPhotoPreview(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 text-rose-400 hover:text-rose-300 hover:bg-slate-950"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition-colors">
              <ImageIcon className="w-8 h-8 text-slate-500 mb-2" />
              <span className="text-xs font-medium text-slate-300">Click to attach photo evidence</span>
              <span className="text-[10px] text-slate-500 mt-0.5">JPG, PNG, or WebP up to 2MB</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Priority & Privacy Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Suggested Resident Priority
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as PriorityLevel[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSuggestedPriority(p)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize border transition-all ${
                    suggestedPriority === p
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center pt-4">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-sky-500 focus:ring-sky-500"
              />
              <span>
                <strong>Share with Admin only</strong> (Do not display on public community map)
              </span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/map')}
            className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            {isSubmitting ? 'Logging Ticket...' : 'Submit Complaint'}
          </button>
        </div>

      </form>

      {/* Duplicate Interception Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-400">
              <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <AlertTriangle className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">Possible Duplicate Complaint Detected</h3>
                <p className="text-xs text-slate-400">
                  An active report already exists in this location for this category.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              To avoid duplicate dispatch of maintenance teams, please check if the existing ticket matches your issue:
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {duplicateMatches.map(item => (
                <div key={item.complaintId} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-sky-400">{item.complaintId}</span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <p className="text-xs font-semibold text-white">{item.title}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                    <span>Logged on {new Date(item.createdAt).toLocaleDateString()}</span>
                    <Link
                      to={`/complaint/${item.complaintId}`}
                      target="_blank"
                      className="text-sky-400 hover:underline flex items-center gap-1"
                    >
                      Inspect Report <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => navigate(`/complaint/${duplicateMatches[0].complaintId}`)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
              >
                View Existing Complaint
              </button>
              <button
                type="button"
                onClick={() => commitSubmission(duplicateMatches.map(m => m.complaintId))}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20"
              >
                Continue with New Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
