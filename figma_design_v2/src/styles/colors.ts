// LOGIPO Color System - Dark Base + Google Colors
export const colors = {
  // Base Colors
  text: {
    primary: '#0f172a',      // スレート900 - メインテキスト
    secondary: '#475569',    // スレート600 - サブテキスト
    tertiary: '#94a3b8',     // スレート400 - 補助テキスト
  },
  
  // Brand Color (Original LOGIPO)
  brand: {
    main: '#2C5067',         // オリジナルブランドカラー
    light: '#3d6b82',
    dark: '#1f3a4a',
  },
  
  // Google-inspired Primary Colors
  primary: {
    blue: '#4285F4',         // Google Blue
    red: '#EA4335',          // Google Red
    yellow: '#FBBC04',       // Google Yellow
    green: '#34A853',        // Google Green
  },
  
  // Semantic Colors (Google-based)
  success: {
    main: '#34A853',         // Google Green
    light: '#5bb974',
    dark: '#2d8e47',
  },
  
  info: {
    main: '#4285F4',         // Google Blue
    light: '#669df6',
    dark: '#3367d6',
  },
  
  warning: {
    main: '#FBBC04',         // Google Yellow
    light: '#fcc934',
    dark: '#f9ab00',
  },
  
  error: {
    main: '#EA4335',         // Google Red
    light: '#ee675c',
    dark: '#d33b2c',
  },
  
  // Gamification Colors
  badge: {
    gold: '#FBBC04',         // ゴールドバッジ
    silver: '#9CA3AF',       // シルバーバッジ
    bronze: '#D97706',       // ブロンズバッジ
  },
  
  // Level/Progress Colors
  level: {
    beginner: '#4285F4',     // ブルー
    intermediate: '#8B5CF6', // パープル
    advanced: '#EA4335',     // レッド
    expert: '#FBBC04',       // イエロー
  },
};

// Score-based color mapping (Google colors)
export const getScoreColor = (score: number) => {
  if (score >= 4.5) return colors.success.main;  // Green
  if (score >= 3.5) return colors.info.main;     // Blue
  return colors.warning.main;                     // Yellow
};

export const getScoreGradient = (score: number) => {
  if (score >= 4.5) return `linear-gradient(135deg, ${colors.success.main} 0%, ${colors.success.light} 100%)`;
  if (score >= 3.5) return `linear-gradient(135deg, ${colors.info.main} 0%, ${colors.info.light} 100%)`;
  return `linear-gradient(135deg, ${colors.warning.main} 0%, ${colors.warning.light} 100%)`;
};

export const getScoreTailwindColor = (score: number) => {
  if (score >= 4.5) return 'text-[#34A853]';
  if (score >= 3.5) return 'text-[#4285F4]';
  return 'text-[#FBBC04]';
};

export const getScoreBarTailwindColor = (score: number) => {
  if (score >= 4.5) return 'bg-[#34A853]';
  if (score >= 3.5) return 'bg-[#4285F4]';
  return 'bg-[#FBBC04]';
};
