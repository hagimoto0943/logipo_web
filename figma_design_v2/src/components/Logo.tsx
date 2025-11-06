import LogoFull from '../imports/Group1';
import LogoIcon from '../imports/Container';

interface LogoProps {
  variant?: 'full' | 'icon';
  className?: string;
}

export function Logo({ variant = 'full', className = '' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <div className={className} style={{ 
        '--fill-0': '#2C5067',
        '--stroke-0': '#2C5067',
      } as React.CSSProperties}>
        <LogoIcon />
      </div>
    );
  }

  return (
    <div className={className} style={{ 
      '--fill-0': '#2C5067',
      '--stroke-0': '#2C5067',
    } as React.CSSProperties}>
      <LogoFull />
    </div>
  );
}
