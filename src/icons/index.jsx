// Icones de linha usados no app. Todos recebem className/size e usam currentColor,
// para herdar cor do elemento pai (icon badges, botoes, etc).

const base = (size) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
})

export function SyringeIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M18.5 2.5l3 3M16 5l3 3M3 21l3.5-3.5M8 14.5L3.5 19a1.5 1.5 0 0 0 0 2.1l0 0a1.5 1.5 0 0 0 2.1 0L10 16.6" />
      <path d="M8 14.5l6.5-6.5 3 3-6.5 6.5-3-3z" />
      <path d="M12.5 6.5l5 5" />
      <path d="M10 4l2 2" />
      <path d="M13 7l2 2" />
    </svg>
  )
}

export function MonitorIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  )
}

export function DocumentIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v4h4M9 12h6M9 15.5h6M9 8.5h2" />
    </svg>
  )
}

export function CalendarIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  )
}

export function PersonIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c1.2-3.8 4-5.5 7-5.5s5.8 1.7 7 5.5" />
    </svg>
  )
}

export function GearIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className} strokeLinejoin="round">
      <path d="M19.85 15.25 15.25 19.85 8.75 19.85 4.15 15.25 4.15 8.75 8.75 4.15 15.25 4.15 19.85 8.75Z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  )
}

export function EditIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M14.5 4.5l5 5L8 21H3v-5z" />
    </svg>
  )
}

export function TrashIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 7h16M9 7V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V7M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    </svg>
  )
}

export function CheckIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className} strokeWidth={2.4}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  )
}

export function AlertIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3.5l9.5 16.5h-19z" />
      <path d="M12 10v4M12 17v.01" />
    </svg>
  )
}

export function ChevronRightIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

export function ChevronLeftIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  )
}

export function DotsIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className} strokeWidth={2.4}>
      <path d="M5 12h.01M12 12h.01M19 12h.01" />
    </svg>
  )
}

export function ClipboardIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M9 11h6M9 15h6" />
    </svg>
  )
}

export function HistoryIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
      <path d="M3.5 4.5v4h4" />
      <path d="M12 8v4.5l3 2" />
    </svg>
  )
}

export function BoxIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3.5 7.5L12 3l8.5 4.5V16.5L12 21l-8.5-4.5V7.5z" />
      <path d="M3.5 7.5L12 12l8.5-4.5M12 12v9" />
    </svg>
  )
}

export function ClockIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function InfoIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8v.01" />
    </svg>
  )
}

export function PlusIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className} strokeWidth={2.4}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function MinusIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className} strokeWidth={2.4}>
      <path d="M5 12h14" />
    </svg>
  )
}

export function HealthMarkIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 20.3l-1.2-1.1C6.4 15.4 3.5 12.8 3.5 9.5 3.5 6.8 5.6 4.7 8.3 4.7c1.5 0 2.9.7 3.7 1.8.8-1.1 2.2-1.8 3.7-1.8 2.7 0 4.8 2.1 4.8 4.8 0 3.3-2.9 5.9-7.3 9.7L12 20.3z" />
      <path d="M5.2 11h2.6l1.4-2.6 1.8 5.2 1.3-2.6h3.8" />
    </svg>
  )
}

export function DownloadIcon({ size = 24, className }) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3.5v11M7.5 10.5l4.5 4.5 4.5-4.5" />
      <path d="M4.5 17v2.5a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V17" />
    </svg>
  )
}
