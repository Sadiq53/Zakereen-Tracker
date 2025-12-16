import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { Member } from '../types';
import { getMembers, saveMember, deleteMember } from '../services/storage';
import { uploadFileToS3 } from '../services/uploadService';
import { Trash2, Upload, Save, Loader2, User, Phone, MapPin, Hash, GraduationCap } from 'lucide-react';
import { Input, Select } from '../components/Input';

const MemberForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<Member>({
    id: crypto.randomUUID(),
    firstName: '',
    surname: '',
    itsNumber: '',
    houseColor: 'Blue',
    address: '',
    mobileNumber: '',
    grade: '',
    classDivision: '',
    isActive: true,
    createdAt: Date.now(),
    photoUrl: ''
  });

  useEffect(() => {
    if (isEdit) {
      const existing = getMembers().find(m => m.id === id);
      if (existing) setFormData(existing);
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      try {
        const url = await uploadFileToS3(file);
        setFormData(prev => ({ ...prev, photoUrl: url }));
      } catch (err) {
        alert('Failed to upload photo');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.itsNumber) {
      alert("Name and ITS Number are required");
      return;
    }

    if (!isEdit) {
      const exists = getMembers().some(m => m.itsNumber === formData.itsNumber);
      if (exists) {
        alert("ITS Number already exists!");
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      saveMember(formData);
      navigate('/members');
    }, 500);
  };

  const handleDelete = () => {
    // Explicit confirm dialog
    if (window.confirm("CRITICAL WARNING:\n\nAre you sure you want to delete this member?\n\nThis action will:\n1. Delete the member profile\n2. Delete ALL their attendance records\n\nThis cannot be undone.")) {
      deleteMember(formData.id);
      navigate('/members', { replace: true });
    }
  };

  return (
    <div className="bg-background min-h-screen pb-safe">
      <Header title={isEdit ? 'Edit Profile' : 'New Member'} showBack />

      <form onSubmit={handleSubmit} className="px-5 pt-6 pb-32 max-w-lg mx-auto">
        
        {/* Photo Upload Section */}
        <div className="flex flex-col items-center mb-8">
          <label className="relative group cursor-pointer">
            <div className={`
              w-32 h-32 rounded-full overflow-hidden border-4 bg-gray-100 shadow-soft transition-all duration-300
              ${formData.photoUrl ? 'border-white' : 'border-white border-dashed'}
              group-hover:scale-105 group-active:scale-95
            `}>
              {formData.photoUrl ? (
                <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <User size={36} strokeWidth={1.5} />
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="text-white" size={24} />
              </div>

              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white z-10">
                  <Loader2 className="animate-spin" />
                </div>
              )}
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white">
               <Upload size={14} />
            </div>
          </label>
          <p className="mt-3 text-sm text-gray-500 font-medium">
            {formData.photoUrl ? 'Tap to change photo' : 'Upload profile photo'}
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <div className="bg-surface p-5 rounded-2xl shadow-soft space-y-5 border border-gray-100/50">
             <div className="grid grid-cols-2 gap-4">
               <Input 
                 label="First Name" 
                 name="firstName" 
                 value={formData.firstName} 
                 onChange={handleChange} 
                 required 
                 placeholder="e.g. Ali"
               />
               <Input 
                 label="Surname" 
                 name="surname" 
                 value={formData.surname} 
                 onChange={handleChange} 
                 placeholder="e.g. Hussain"
               />
             </div>

             <Input 
               label="ITS Number" 
               name="itsNumber" 
               type="number" 
               value={formData.itsNumber} 
               onChange={handleChange} 
               required 
               disabled={isEdit} 
               icon={<Hash size={18} />}
               placeholder="8-digit ID"
             />

            <div className="grid grid-cols-2 gap-4">
               <Select label="House" name="houseColor" value={formData.houseColor} onChange={handleChange}>
                  <option value="Red">Red House</option>
                  <option value="Blue">Blue House</option>
                  <option value="Green">Green House</option>
                  <option value="Yellow">Yellow House</option>
               </Select>
               <Input 
                 label="Mobile" 
                 name="mobileNumber" 
                 type="tel" 
                 value={formData.mobileNumber} 
                 onChange={handleChange} 
                 icon={<Phone size={18} />}
                 placeholder="555-0000"
               />
            </div>
          </div>

          <div className="bg-surface p-5 rounded-2xl shadow-soft space-y-5 border border-gray-100/50">
             <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Grade" 
                  name="grade" 
                  value={formData.grade} 
                  onChange={handleChange} 
                  icon={<GraduationCap size={18} />}
                />
                <Input 
                  label="Class" 
                  name="classDivision" 
                  value={formData.classDivision} 
                  onChange={handleChange} 
                />
             </div>
             <Input 
               label="Address" 
               name="address" 
               value={formData.address} 
               onChange={handleChange} 
               icon={<MapPin size={18} />}
             />
          </div>

          <div className="bg-surface p-4 rounded-2xl shadow-soft flex items-center justify-between border border-gray-100/50">
            <span className="text-sm font-bold text-gray-700 ml-1">Status: {formData.isActive ? 'Active' : 'Inactive'}</span>
            <div 
              onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${formData.isActive ? 'bg-success' : 'bg-gray-200'}`}
            >
              <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {isEdit ? 'Save Changes' : 'Create Member'}
          </button>

          {isEdit && (
            <button 
              type="button"
              onClick={handleDelete}
              className="w-full bg-red-50 text-danger py-4 rounded-2xl font-bold border border-red-100 hover:bg-red-100 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={20} />
              Delete Member
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MemberForm;