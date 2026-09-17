import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { dashboardStore, useDashboardStore } from '../store/dashboard-store'
import type { AdminRole } from '../types'

export function UsersPage() {
  const { users } = useDashboardStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<AdminRole>('editor')

  const add = () => {
    if (!name.trim() || !email.trim()) return
    dashboardStore.addUser(name, email, role)
    setName('')
    setEmail('')
    setRole('editor')
  }

  return <section>
    <div className="page-heading"><div><p className="eyebrow">Access</p><h1>Users & roles</h1><p>Prepare role assignments now; authentication enforcement will be connected to the secure backend later.</p></div></div>
    <div className="notice">These records are a Dashboard configuration layer only. They do not grant real access until authentication and server-side authorization are connected.</div>
    <div className="content-grid content-grid--2 content-grid--form">
      <article className="panel">
        <div className="panel-heading"><div><span className="panel-kicker">New user</span><h2>Add admin profile</h2></div></div>
        <div className="form-grid">
          <label><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label><span>Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label><span>Role</span><select value={role} onChange={(e) => setRole(e.target.value as AdminRole)}><option value="owner">Owner</option><option value="admin">Admin</option><option value="editor">Editor</option><option value="viewer">Viewer</option></select></label>
        </div>
        <button className="button button--primary" onClick={add}><Plus size={17} /> Add user</button>
      </article>
      <article className="panel">
        <div className="panel-heading"><div><span className="panel-kicker">{users.length} profiles</span><h2>Admin profiles</h2></div></div>
        {users.length === 0 ? <div className="empty-state">No admin profiles yet.</div> : <div className="entity-list">{users.map((user) => <div className="entity-row" key={user.id}>
          <div className="avatar">{user.name.slice(0, 2).toUpperCase()}</div>
          <div className="entity-main"><input className="inline-title" value={user.name} onChange={(e) => dashboardStore.updateUser(user.id, { name: e.target.value })} /><span>{user.email}</span></div>
          <select className="status-select" value={user.role} onChange={(e) => dashboardStore.updateUser(user.id, { role: e.target.value as AdminRole })}><option value="owner">Owner</option><option value="admin">Admin</option><option value="editor">Editor</option><option value="viewer">Viewer</option></select>
          <label className="switch-row compact"><input type="checkbox" checked={user.active} onChange={(e) => dashboardStore.updateUser(user.id, { active: e.target.checked })} /><span>Active</span></label>
          <button className="icon-button danger" onClick={() => dashboardStore.deleteUser(user.id)}><Trash2 size={16} /></button>
        </div>)}</div>}
      </article>
    </div>
  </section>
}
