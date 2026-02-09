import {AbsoluteFill} from 'remotion';

export const Blank: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{color: 'white', fontSize: 48, fontFamily: 'sans-serif'}}>
        it works! 🎉
      </div>
    </AbsoluteFill>
  );
};
