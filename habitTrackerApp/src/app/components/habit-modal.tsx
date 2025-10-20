import { Briefcase, Check, Coffee, Heart, Lightbulb, Lock, Sparkles, X, Zap } from 'lucide-react';
import React, { useState } from 'react';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateHabit: (name: string, icon: string, interval: string) => void;
}

const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, onCreateHabit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    interval: '',
    icon: null as string | null
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const icons = [
    { id: 'zap', component: Zap, color: 'bg-yellow-300' },
    { id: 'lightbulb', component: Lightbulb, color: 'bg-blue-500' },
    { id: 'heart', component: Heart, color: 'bg-teal-400' },
    { id: 'briefcase', component: Briefcase, color: 'bg-pink-300' },
    { id: 'check', component: Check, color: 'bg-purple-400' },
    { id: 'lock', component: Lock, color: 'bg-indigo-600' },
    { id: 'coffee', component: Coffee, color: 'bg-amber-400' },
    { id: 'sparkles', component: Sparkles, color: 'bg-blue-300' }
  ];

  const intervals = ['Daily', 'Weekly', 'Monthly'];

  const handleSubmit = () => {
    if (formData.name && formData.interval && formData.icon) {
      const selectedIcon = icons.find(i => i.id === formData.icon);
      if (selectedIcon) {
        onCreateHabit(formData.name, selectedIcon.id, formData.interval);
        setFormData({ name: '', description: '', interval: '', icon: null });
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-96 relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 w-8 h-8 flex items-center justify-center rounded-full border-2 border-black hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-black" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-6 text-black">New Habit</h2>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-3 border-2 border-black rounded-full focus:outline-none focus:border-blue-500 text-black"
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-2">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 border-2 border-black rounded-full focus:outline-none focus:border-blue-500 text-black"
          />
        </div>

        {/* Intervals Dropdown */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-black mb-2">Intervals</label>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full px-4 py-3 border-2 border-black rounded-full bg-gray-100 text-left flex items-center justify-between focus:outline-none focus:border-blue-500"
          >
            <span className={formData.interval ? 'text-black' : 'text-gray-500'}>
              {formData.interval || 'Select'}
            </span>
            <span className="text-black">{isDropdownOpen ? '∧' : '∨'}</span>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute w-full mt-1 bg-gray-100 border-2 border-black rounded-2xl overflow-hidden z-10">
              {intervals.map((interval) => (
                <button
                  key={interval}
                  type="button"
                  onClick={() => {
                    setFormData({...formData, interval});
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-500 hover:text-black transition-colors ${
                    formData.interval === interval ? 'bg-blue-500 text-black' : 'text-black'
                  }`}
                >
                  {interval}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Icons */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-2">Icons</label>
          <div className="grid grid-cols-4 gap-3">
            {icons.map(icon => {
              const IconComponent = icon.component;
              return (
                <button
                  key={icon.id}
                  type="button"
                  onClick={() => setFormData({...formData, icon: icon.id})}
                  className={`w-16 h-16 ${icon.color} rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity ${
                    formData.icon === icon.id ? 'ring-4 ring-blue-500' : ''
                  }`}
                >
                  <IconComponent className="w-7 h-7 text-black" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-2 border-2 border-black rounded-full hover:bg-gray-100 transition-colors text-black"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 px-6 py-2 bg-green-500 text-black rounded-full hover:bg-green-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitModal;
