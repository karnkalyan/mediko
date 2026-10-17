import type { NavProps } from '../types'
import PortalWorkspace from '../components/PortalWorkspace'

export default function CustomerDashboardPage({ navigate }: NavProps) {
  return <PortalWorkspace role="customer" navigate={navigate} />
}
