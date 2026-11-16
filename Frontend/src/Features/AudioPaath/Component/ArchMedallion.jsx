export const ArchMedallion = ({ children, isAvailable = false, size = 64 }) => {
  const strokeColor = isAvailable ? '#d4a359' : '#dcd5c7';
  const fillColor = isAvailable ? 'rgba(212, 163, 89, 0.05)' : 'rgba(0, 0, 0, 0.02)';

  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {/* Decorative Sikh Mehrab / Arch Motif SVG */}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        <path
          d="
            M 50,4
            C 62,4 72,10 76,22
            C 86,22 96,32 96,44
            C 96,56 86,66 76,66
            C 72,78 62,94 50,96
            C 38,94 28,78 24,66
            C 14,66 4,56 4,44
            C 4,32 14,22 24,22
            C 28,10 38,4 50,4 Z
          "
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Content inside medallion */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isAvailable ? 'var(--color-primary)' : 'var(--color-muted)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ArchMedallion;
