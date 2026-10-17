import type { NavProps } from '../types'
import SuperAdminWorkspace from '../components/SuperAdminWorkspace'

export default function AdminDashboard({ navigate }: NavProps) {
  return <SuperAdminWorkspace navigate={navigate} />
}
