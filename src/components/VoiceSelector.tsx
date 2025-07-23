import React from 'react';

interface VoiceSelectorProps {
  selectedVoice: string;
  onChange: (voiceId: string) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ 
  selectedVoice, 
  onChange 
}) => {
  const voices = [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Female)' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (Female)' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Female)' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli (Female)' },
    { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh (Male)' },
    { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold (Male)' },
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Male)' },
  ];

  return (
    <div className="mt-1">
      <label className="text-xs text-primary font-medium block mb-1">
        Select AI Voice:
      </label>
      <select 
        className="text-xs border rounded px-1 py-0.5 bg-primary-soft/20 text-primary w-full" 
        value={selectedVoice}
        onChange={(e) => onChange(e.target.value)}
      >
        {voices.map(voice => (
          <option key={voice.id} value={voice.id}>
            {voice.name}
          </option>
        ))}
      </select>
    </div>
  );
};