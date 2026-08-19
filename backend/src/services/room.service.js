'use strict';

const { pool } = require('../config/database');
const { AppError } = require('../utils/response');

async function findByHostel(hostelId, { status, roomType } = {}) {
  const where  = ['r.hostel_id = ?'];
  const params = [hostelId];

  if (status)   { where.push('r.status = ?');    params.push(status); }
  if (roomType) { where.push('r.room_type = ?'); params.push(roomType); }

  const [rows] = await pool.query(
    `SELECT r.*, h.name AS hostel_name, h.location AS hostel_location
     FROM rooms r
     INNER JOIN hostels h ON r.hostel_id = h.id
     WHERE ${where.join(' AND ')}
     ORDER BY r.room_number ASC`,
    params
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT r.*, h.name AS hostel_name, h.location AS hostel_location
     FROM rooms r INNER JOIN hostels h ON r.hostel_id = h.id
     WHERE r.id = ?`,
    [id]
  );
  if (!rows[0]) throw new AppError('Room not found.', 404);
  return rows[0];
}

async function create({ hostelId, roomNumber, roomType, capacity, pricePerSemester, description }) {
  const [result] = await pool.query(
    `INSERT INTO rooms (hostel_id, room_number, room_type, capacity, price_per_semester, description)
     VALUES (?,?,?,?,?,?)`,
    [hostelId, roomNumber, roomType, capacity, pricePerSemester, description || null]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  await findById(id);   // ensure exists
  const fields = [];
  const params = [];

  if (data.roomNumber       !== undefined) { fields.push('room_number = ?');         params.push(data.roomNumber); }
  if (data.roomType         !== undefined) { fields.push('room_type = ?');           params.push(data.roomType); }
  if (data.capacity         !== undefined) { fields.push('capacity = ?');            params.push(data.capacity); }
  if (data.pricePerSemester !== undefined) { fields.push('price_per_semester = ?'); params.push(data.pricePerSemester); }
  if (data.status           !== undefined) { fields.push('status = ?');             params.push(data.status); }
  if (data.description      !== undefined) { fields.push('description = ?');        params.push(data.description); }

  if (fields.length === 0) return findById(id);

  params.push(id);
  await pool.query(`UPDATE rooms SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

async function remove(id) {
  const [[{ count }]] = await pool.query(
    `SELECT COUNT(*) AS count FROM bookings WHERE room_id = ? AND status IN ('pending','approved')`,
    [id]
  );
  if (count > 0) throw new AppError('Cannot delete room with active bookings.', 409);
  await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
}

module.exports = { findByHostel, findById, create, update, remove };
