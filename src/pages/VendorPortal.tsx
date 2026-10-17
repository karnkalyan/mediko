import type { NavProps } from '../types'
import PortalWorkspace from '../components/PortalWorkspace'

export default function VendorPortal({ navigate }: NavProps) {
  return <PortalWorkspace role="vendor" navigate={navigate} />
}
