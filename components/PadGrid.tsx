
import React from 'react';
import { usePadContext } from '../context/PadContext';
import Pad from './Pad';

const PadGrid: React.FC = () => {
  const { pads } = usePadContext();

  return (
    <div className="grid grid-cols-4 gap-4 aspect-square">
      {pads.map(pad => (
        <Pad key={pad.id} padData={pad} />
      ))}
    </div>
  );
};

export default PadGrid;
