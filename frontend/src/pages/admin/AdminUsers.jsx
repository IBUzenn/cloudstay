import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { Users, Search, Ban, UserCheck } from 'lucide-react';
import Spinner from '../../components/common/Spinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [targetUser, setTargetUser] = useState(null);
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
        <div className="users-header-bar">
          <div>
            <h1>User Account Management</h1>
            <p className="subtext">
              Inspect student and staff accounts, verify roles, and toggle account activation status
            </p>
          </div>

          <div className="search-input-wrapper">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search name, email or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input search-field"
            />
          </div>
        </div>

        {loading ? (
          <Spinner label="Fetching user account list..." />
        ) : filteredUsers.length === 0 ? (
          <div className="card empty-state">
            <Users size={44} />
            <h3>No Users Found</h3>
            <p>No account records match your search criteria.</p>
            {search && (
              <button className="btn btn-outline btn-sm" onClick={() => setSearch('')}>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
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
                            {u.is_active ? <Ban size={13} /> : <UserCheck size={13} />}
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
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-field {
          padding-left: 2.25rem;
          font-size: 0.85rem;
          width: 240px;
          background: var(--surface-card);
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
          font-family: ui-monospace, 'SFMono-Regular', Consolas, monospace;
          color: var(--text-muted);
        }

        .email-cell {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.15rem 0.55rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .role-admin {
          background: #f3e8ff;
          border: 1px solid #d8b4fe;
          color: #7e22ce;
        }

        .role-manager {
          background: var(--blue-50);
          border: 1px solid var(--blue-200);
          color: var(--blue-700);
        }

        .role-student {
          background: var(--surface-subtle);
          border: 1px solid var(--border-medium);
          color: var(--text-secondary);
        }

        .date-cell {
          font-size: 0.825rem;
          color: var(--text-muted);
        }

        .action-cell {
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
}
