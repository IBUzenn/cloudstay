import { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { Users, Search, Shield, Ban } from 'lucide-react';
import Spinner from '../../components/common/Spinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [targetUser, setTargetUser] = useState(null); // User to toggle
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers();
      setUsers(res.data.data || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      await adminApi.toggleUserStatus(targetUser.id, !targetUser.is_active);
      toast.success(`User ${targetUser.is_active ? 'deactivated' : 'activated'} successfully.`);
      setTargetUser(null);
      fetchUsers(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status.');
    } finally {
      setToggling(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.student_id && u.student_id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1>Manage Users</h1>
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-2)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>
        </div>

        {loading ? <Spinner /> : filteredUsers.length === 0 ? (
          <div className="card empty-state">
            <Users size={48} color="var(--text-muted)" />
            <p>No users found.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{u.name}</div>
                      {u.student_id && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.student_id}</div>}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{formatDate(u.created_at)}</td>
                    <td>
                      <span className={`badge ${u.is_active ? 'badge-approved' : 'badge-rejected'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {u.role !== 'admin' && (
                        <button 
                          className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-primary'}`}
                          onClick={() => setTargetUser(u)}
                        >
                          {u.is_active ? <Ban size={14}/> : <Shield size={14}/>}
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {targetUser && (
        <ConfirmModal
          title={targetUser.is_active ? 'Deactivate User' : 'Activate User'}
          message={`Are you sure you want to ${targetUser.is_active ? 'deactivate' : 'activate'} ${targetUser.name}?`}
          confirmLabel={targetUser.is_active ? 'Deactivate' : 'Activate'}
          confirmClass={targetUser.is_active ? 'btn-danger' : 'btn-primary'}
          loading={toggling}
          onCancel={() => setTargetUser(null)}
          onConfirm={handleToggle}
        />
      )}
    </div>
  );
}
