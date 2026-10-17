import type { FC } from 'react'

interface IconProps {
  size?: number
  color?: string
  strokeWidth?: number
  className?: string
}

const ico = (paths: string, viewBox = '0 0 24 24'): FC<IconProps> =>
  ({ size = 18, color = 'currentColor', strokeWidth = 1.75, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths.split('|').map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )

export const IconSearch = ico('M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z')
export const IconCart = ico('M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z|M3 6h18|M16 10a4 4 0 0 1-8 0')
export const IconHeart = ico('M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z')
export const IconUser = ico('M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z')
export const IconChevronDown = ico('M6 9l6 6 6-6')
export const IconChevronRight = ico('M9 18l6-6-6-6')
export const IconChevronLeft = ico('M15 18l-6-6 6-6')
export const IconMenu = ico('M3 12h18|M3 6h18|M3 18h18')
export const IconX = ico('M18 6 6 18|M6 6l12 12')
export const IconStar = ico('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z')
export const IconTruck = ico('M1 3h15v13H1z|M16 8h4l3 3v5h-7V8z|M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z|M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z')
export const IconShield = ico('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z')
export const IconRefresh = ico('M1 4v6h6|M23 20v-6h-6|M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15')
export const IconPackage = ico('M12 3 2 7.5 12 12l10-4.5-10-4.5zM2 17l10 4.5L22 17|M2 12l10 4.5L22 12')
export const IconPhone = ico('M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z')
export const IconMail = ico('M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z|M22 6l-10 7L2 6')
export const IconPlus = ico('M12 5v14|M5 12h14')
export const IconMinus = ico('M5 12h14')
export const IconGrid = ico('M3 3h7v7H3z|M14 3h7v7h-7z|M14 14h7v7h-7z|M3 14h7v7H3z')
export const IconList = ico('M8 6h13|M8 12h13|M8 18h13|M3 6h.01|M3 12h.01|M3 18h.01')
export const IconFilter = ico('M22 3H2l8 9.46V19l4 2v-8.54L22 3z')
export const IconSliders = ico('M4 21v-7|M4 10V3|M12 21v-9|M12 8V3|M20 21v-5|M20 12V3|M1 14h6|M9 8h6|M17 16h6')
export const IconBell = ico('M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9|M13.73 21a2 2 0 0 1-3.46 0')
export const IconChat = ico('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z')
export const IconFileText = ico('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z|M14 2v6h6|M16 13H8|M16 17H8|M10 9H8')
export const IconSettings = ico('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z')
export const IconBarChart = ico('M12 20V10|M18 20V4|M6 20v-4')
export const IconPieChart = ico('M21.21 15.89A10 10 0 1 1 8 2.83|M22 12A10 10 0 0 0 12 2v10z')
export const IconTrendUp = ico('M23 6l-9.5 9.5-5-5L1 18|M17 6h6v6')
export const IconTrendDown = ico('M23 18l-9.5-9.5-5 5L1 6|M17 18h6v-6')
export const IconBox = ico('M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z|M3.27 6.96 12 12.01l8.73-5.05|M12 22.08V12')
export const IconClipboard = ico('M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2|M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z')
export const IconCheckCircle = ico('M22 11.08V12a10 10 0 1 1-5.93-9.14|M22 4 12 14.01l-3-3')
export const IconAlertCircle = ico('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M12 8v4|M12 16h.01')
export const IconInfo = ico('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M12 16v-4|M12 8h.01')
export const IconDollarSign = ico('M12 1v22|M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6')
export const IconUsers = ico('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2|M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M23 21v-2a4 4 0 0 0-3-3.87|M16 3.13a4 4 0 0 1 0 7.75')
export const IconStore = ico('M2 3h20|M4 3v18|M20 3v18|M6 3h12|M8 7h8|M8 11h8|M8 15h8')
export const IconWrench = ico('M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z')
export const IconClockCircle = ico('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M12 6v6l4 2')
export const IconMapPin = ico('M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z|M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z')
export const IconDownload = ico('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4|M7 10l5 5 5-5|M12 15V3')
export const IconUpload = ico('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4|M17 8l-5-5-5 5|M12 3v12')
export const IconCalendar = ico('M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z|M16 2v4|M8 2v4|M3 10h18')
export const IconExternalLink = ico('M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6|M15 3h6v6|M10 14 21 3')
export const IconShare = ico('M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8|M16 6l-4-4-4 4|M12 2v13')
export const IconCopy = ico('M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z|M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 0 2 2v1')
export const IconEye = ico('M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z|M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z')
export const IconPrinter = ico('M6 9V2h12v7|M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2|M6 14h12v8H6z')
export const IconActivity = ico('M22 12h-4l-3 9L9 3l-3 9H2')
export const IconHome = ico('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z|M9 22V12h6v10')
export const IconLogOut = ico('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4|M16 17l5-5-5-5|M21 12H9')
export const IconGlobe = ico('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M2 12h20|M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z')
export const IconLayers = ico('M12 2 2 7l10 5 10-5-10-5z|M2 17l10 5 10-5|M2 12l10 5 10-5')
export const IconTag = ico('M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z|M7 7h.01')
export const IconPercent = ico('M19 5 5 19|M6.5 6.5h.01|M17.5 17.5h.01')
export const IconZap = ico('M13 2 3 14h9l-1 8 10-12h-9l1-8z')
export const IconMedical = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M12 8v8M8 12h8" />
  </svg>
)
