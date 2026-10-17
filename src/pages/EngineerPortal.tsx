import type { NavProps } from '../types'
import PortalWorkspace from '../components/PortalWorkspace'

export default function EngineerPortal({ navigate }: NavProps) {
  return <PortalWorkspace role="engineer" navigate={navigate} />
}
