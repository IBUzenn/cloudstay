'use strict';

const { pool }       = require('../config/database');
const { sendSuccess, sendPaginated } = require('../utils/response');

async function getUsers(req, res, next) {
  try {
    const { role, isActive, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const where  = ['1=1'];
    const params = [];

    if (role !== undefined)     { where.push('role = ?');      params.push(role); }
    if (isActive !== undefined) { where.push('is_active = ?'); params.push(isActive === 'true' ? 1 : 0); }

    const whereClause = where.join(' AND ');
    const [rows] = await pool.query(
      `SELECT id, name, email, student_id, role, is_active, created_at
       FROM users WHERE ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit, 10), offset]
    );
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM users WHERE ${whereClause}`, params
    );
    sendPaginated(res, rows, total, page, limit);
  } catch (err) { next(err); }
}

async function toggleUserStatus(req, res, next) {
  try {
    const { isActive } = req.body;
    await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, req.params.id]);
    const [[user]] = await pool.query(
      'SELECT id, name, email, role, is_active FROM users WHERE id = ?', [req.params.id]
    );
    sendSuccess(res, 200, user, `User account ${isActive ? 'activated' : 'deactivated'} successfully.`);
  } catch (err) { next(err); }
}

async function getStats(req, res, next) {
  try {
    const [[users]]    = await pool.query('SELECT COUNT(*) AS total, SUM(is_active) AS active FROM users WHERE role = "student"');
    const [[bookings]] = await pool.query('SELECT COUNT(*) AS total, SUM(status="pending") AS pending, SUM(status="approved") AS approved FROM bookings');
    const [[rooms]]    = await pool.query('SELECT COUNT(*) AS total, SUM(status="available") AS available, SUM(status="booked") AS booked FROM rooms');

    sendSuccess(res, 200, {
      students: { total: users.total, active: users.active },
      bookings: { total: bookings.total, pending: bookings.pending, approved: bookings.approved },
      rooms:    { total: rooms.total, available: rooms.available, booked: rooms.booked },
    });
  } catch (err) { next(err); }
}

module.exports = { getUsers, toggleUserStatus, getStats };
