export type IconProps = { className?: string };

export const DashboardIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="13" y="3" width="8" height="5" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="13" y="10" width="8" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const PatientsIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3.5 20c0-3.3 2.9-5.5 5.5-5.5s5.5 2.2 5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="17" cy="8.5" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    <path d="M15.2 14.8c2.6-.3 5.3 1.6 5.3 4.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const LibraryIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 4.5h6.5a2 2 0 0 1 2 2V20a1.8 1.8 0 0 0-1.8-1.5H4V4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M20 4.5h-6.5a2 2 0 0 0-2 2V20a1.8 1.8 0 0 1 1.8-1.5H20V4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

export const SessionsIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 3v3M16 3v3M3.5 9.5h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 14l2.3 2.3L16 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TasksIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="3.5" width="16" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 9.5h8M8 13.5h8M8 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const ReportsIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MessagesIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 5.5h16a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H9l-4.5 3.5V17H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

export const ClinicIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 20V9.5L12 4l8 5.5V20" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9.5 20v-6h5v6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

export const SettingsIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M19.4 13.5a7.7 7.7 0 0 0 0-3l1.9-1.4-2-3.4-2.2.7a7.7 7.7 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.4a7.7 7.7 0 0 0-2.6 1.5l-2.2-.7-2 3.4L4.6 10.5a7.7 7.7 0 0 0 0 3L2.7 15l2 3.4 2.2-.7a7.7 7.7 0 0 0 2.6 1.5l.5 2.3h4l.5-2.3a7.7 7.7 0 0 0 2.6-1.5l2.2.7 2-3.4-1.9-1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

export const HomeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 10v9.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

export const ProgressIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 7v5l3.2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TrophyIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M7 4h10v4.5a5 5 0 0 1-10 0V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M7 5.5H4a3 3 0 0 0 3.5 4.7M17 5.5h3a3 3 0 0 1-3.5 4.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 13.5V17M9 20h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const UserIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M4.5 20c0-3.6 3.2-6 7.5-6s7.5 2.4 7.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const BellIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.2 1.5 5.5H4.5C4.5 15.2 6 14 6 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const SearchIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const ChevronLeftIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronRightIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlusIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const XIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const CheckIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 13l4.5 4.5L19 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DownloadIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3v12m0 0-4-4m4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const FilterIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 5h16M7 12h10M10 19h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const StarIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="m12 3.5 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.4l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

export const GiftIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="9.5" width="16" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M4 9.5h16M12 9.5V20M12 9.5c-1.5-4.5-7-4.5-7-1.5 0 1.5 1.7 1.5 7 1.5Zm0 0c1.5-4.5 7-4.5 7-1.5 0 1.5-1.7 1.5-7 1.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

export const CoinIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9.5 9.2c0-1.1 1-2 2.5-2s2.5.7 2.5 1.7c0 2.3-5 1.1-5 3.4 0 1 1 1.8 2.5 1.8s2.5-.8 2.5-1.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 6v1.3M12 16.7V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const EditIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 20h4L18.5 9.5a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L4 16v4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M13 6.5 17.5 11" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export const GripIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="9" cy="6" r="1.4" />
    <circle cx="9" cy="12" r="1.4" />
    <circle cx="9" cy="18" r="1.4" />
    <circle cx="15" cy="6" r="1.4" />
    <circle cx="15" cy="12" r="1.4" />
    <circle cx="15" cy="18" r="1.4" />
  </svg>
);

export const SendIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="m4 12 16-8-6.5 16-2.7-6.8L4 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

export const ClockIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const HeartIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 20s-7.5-4.6-9.7-9.3C.7 6.9 2.6 3.5 6 3.5c2 0 3.6 1.2 6 4.3 2.4-3.1 4-4.3 6-4.3 3.4 0 5.3 3.4 3.7 7.2C19.5 15.4 12 20 12 20Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

export const ShoppingBagIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);