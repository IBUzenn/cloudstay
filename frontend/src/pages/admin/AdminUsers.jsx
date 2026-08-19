import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { Users, Search, Shield, Ban, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';
import Spinner from '../../components/common/Spinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [targetUser, setTargetUser] = useState(null); // User object to toggle
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers();
      setUsers(res.data.data || []);
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!targetUser) return;
    setToggling(true);
    try {
      await adminApi.toggleUserStatus(targetUser.id, !targetUser.is_active);
      toast.success(`User ${targetUser.name} ${targetUser.is_active ? 'deactivated' : 'activated'} successfully.`);
      setTargetUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status.');
    } finally {
      setToggling(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.student_id && u.student_id.toLowerCase().includes(term)) ||
      (u.role && u.role.toLowerCase().includes(term))
    );
  });

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header Bar */}
        <div className="users-header-bar fade-in">
          <div>
            <h1>User Account Management</h1>
            <p className="subtext">
              Inspect student and staff accounts, verify roles, and toggle account activation status
            </p>
          </div>

          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input search-field"
            />
          </div>
        </div>

        {loading ? (
          <Spinner label="Fetching user account list..." />
        ) : filteredUsers.length === 0 ? (
          <div className="card empty-state fade-in">
            <Users size={52} />
            <h3>No Users Found</h3>
            <p>No account records match your search criteria.</p>
            {search && (
              <button className="btn btn-outline btn-sm" onClick={() => setSearch('')}>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper fade-in">
            <table className="table">
              <thead>
                <tr>
                  <th>User Identity</th>
                  <th>Email Address</th>
                  <th>System Role</th>
                  <th>Registered On</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-name-cell">
                        <span className="name-text">{u.name}</span>
                        {u.student_id && (
                          <span className="student-id-sub">{u.student_id}</span>
                        )}
                      </div>
                    </td>
                    <td className="email-cell">{u.email}</td>
                    <td>
                      <span className={`role-badge role-${u.role}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="date-cell">{formatDate(u.created_at)}</td>
                    <td>
                      <span className={`badge ${u.is_active ? 'badge-approved' : 'badge-rejected'}`}>
                        <span className="status-dot" />
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td>
                      <div className="action-cell">
                        {u.role !== 'admin' && (
                          <button
                            type="button"
                            className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => setTargetUser(u)}
                          >
                            {u.is_active ? <Ban size={14} /> : <UserCheck size={14} />}
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </div>
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
          isOpen={!!targetUser}
          title={targetUser.is_active ? 'Deactivate User Account' : 'Reactivate User Account'}
          message={`Are you sure you want to ${targetUser.is_active ? 'deactivate' : 'reactivate'} the account for ${targetUser.name}?`}
          confirmText={targetUser.is_active ? 'Deactivate Account' : 'Reactivate Account'}
          variant={targetUser.is_active ? 'danger' : 'success'}
          loading={toggling}
          onCancel={() => setTargetUser(null)}
          onConfirm={handleToggle}
        />
      )}

      <style>{`
        .users-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .subtext {
          color: var(--slate-400);
          font-size: 0.9rem;
          margin-top: 0.2rem;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 0.9rem;
          color: var(--slate-400);
          pointer-events: none;
        }

        .search-field {
          padding-left: 2.5rem;
          font-size: 0.875rem;
          width: 260px;
        }

        .user-name-cell {
          display: flex;
          flex-direction: column;
        }

        .name-text {
          font-weight: 600;
          color: var(--text-primary);
        }

        .student-id-sub {
          font-size: 0.75rem;
          font-family: monospace;
          color: var(--slate-400);
        }

        .email-cell {
          color: var(--slate-300);
          font-size: 0.875rem;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .role-admin {
          background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.3);
          color: #c084fc;
        }

        .role-manager {
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #60a5fa;
        }

        .role-student {
          background: rgba(100, 116, 139, 0.15);
          border: 1px solid rgba(100, 116, 139, 0.3);
          color: var(--slate-300);
        }

        .date-cell {
          font-size: 0.825rem;
          color: var(--slate-400);
        }

        .action-cell {
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
}
