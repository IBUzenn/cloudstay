'use strict';

const { pool } = require('../config/database');
const { AppError } = require('../utils/response');

const BOOKING_SELECT = `
  SELECT
    b.id, b.status, b.check_in_date, b.check_out_date,
    b.receipt_url, b.review_note, b.reviewed_at, b.created_at,
    b.student_id, b.room_id, b.hostel_id,
    u.name   AS student_name,  u.email AS student_email,
    u.student_id AS student_number,
    r.room_number, r.room_type, r.price_per_semester,
    h.name   AS hostel_name,   h.location AS hostel_location,
    rev.name AS reviewed_by_name
  FROM bookings b
  INNER JOIN users u   ON b.student_id   = u.id
  INNER JOIN rooms r   ON b.room_id      = r.id
  INNER JOIN hostels h ON b.hostel_id    = h.id
  LEFT  JOIN users rev ON b.reviewed_by  = rev.id
`;

async function create(studentId, roomId, checkInDate, checkOutDate) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Lock room row
    const [[room]] = await conn.query(
      'SELECT id, hostel_id, status FROM rooms WHERE id = ? FOR UPDATE',
      [roomId]
    );
    if (!room)                    throw new AppError('Room not found.', 404);
    if (room.status !== 'available') throw new AppError('Room is no longer available for booking.', 409);

    // Check student has no active booking
    const [[{ activeCount }]] = await conn.query(
      `SELECT COUNT(*) AS activeCount FROM bookings
       WHERE student_id = ? AND status IN ('pending','approved')`,
      [studentId]
    );
    if (activeCount > 0) {
      throw new AppError('You already have an active or pending booking. Cancel it before booking again.', 409);
    }

    const [result] = await conn.query(
      `INSERT INTO bookings (student_id, room_id, hostel_id, check_in_date, check_out_date, status)
       VALUES (?,?,?,?,?,'pending')`,
      [studentId, roomId, room.hostel_id, checkInDate, checkOutDate]
    );

    await conn.commit();
    conn.release();
    return findById(result.insertId);
  } catch (err) {
    await conn.rollback();
    conn.release();
    throw err;
  }
}

async function findById(id) {
  const [rows] = await pool.query(`${BOOKING_SELECT} WHERE b.id = ?`, [id]);
  if (!rows[0]) throw new AppError('Booking not found.', 404);
  return rows[0];
}

async function findByStudent(studentId, { page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `${BOOKING_SELECT} WHERE b.student_id = ? ORDER BY b.created_at DESC LIMIT ? OFFSET ?`,
    [studentId, parseInt(limit, 10), offset]
  );
  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) AS total FROM bookings WHERE student_id = ?', [studentId]
  );
  return { bookings: rows, total };
}

async function findAll({ status, hostelId, page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const where  = ['1=1'];
  const params = [];

  if (status)   { where.push('b.status = ?');     params.push(status); }
  if (hostelId) { where.push('b.hostel_id = ?');  params.push(hostelId); }

  const whereClause = where.join(' AND ');
  const [rows] = await pool.query(
    `${BOOKING_SELECT} WHERE ${whereClause} ORDER BY b.created_at DESC LIMIT ? OFFSET ?`,
    [...params, parseInt(limit, 10), offset]
  );
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM bookings b WHERE ${whereClause}`, params
  );
  return { bookings: rows, total };
}

async function updateStatus(bookingId, newStatus, reviewedBy, reviewNote) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[booking]] = await conn.query(
      'SELECT id, status, room_id FROM bookings WHERE id = ? FOR UPDATE',
      [bookingId]
    );
    if (!booking) throw new AppError('Booking not found.', 404);

    const validTransitions = {
      approved:  ['pending'],
      rejected:  ['pending'],
      cancelled: ['pending', 'approved'],
    };
    if (!validTransitions[newStatus]?.includes(booking.status)) {
      throw new AppError(
        `Cannot transition booking from '${booking.status}' to '${newStatus}'.`, 409
      );
    }

    await conn.query(
      `UPDATE bookings
       SET status = ?, reviewed_by = ?, review_note = ?, reviewed_at = CASE WHEN ? IS NOT NULL THEN NOW() ELSE NULL END
       WHERE id = ?`,
      [newStatus, reviewedBy || null, reviewNote || null, reviewedBy || null, bookingId]
    );

    // Sync room status
    if (newStatus === 'approved') {
      await conn.query('UPDATE rooms SET status = ? WHERE id = ?', ['booked', booking.room_id]);
    } else if (['rejected', 'cancelled'].includes(newStatus)) {
      await conn.query('UPDATE rooms SET status = ? WHERE id = ?', ['available', booking.room_id]);
    }

    await conn.commit();
    conn.release();
    return findById(bookingId);
  } catch (err) {
    await conn.rollback();
    conn.release();
    throw err;
  }
}

async function attachReceipt(bookingId, studentId, receiptUrl) {
  const [[booking]] = await pool.query(
    'SELECT id, student_id, status FROM bookings WHERE id = ?', [bookingId]
  );
  if (!booking)                          throw new AppError('Booking not found.', 404);
  if (booking.student_id !== studentId)  throw new AppError('Access denied.', 403);
  if (booking.status === 'cancelled')    throw new AppError('Cannot upload receipt for a cancelled booking.', 400);

  await pool.query('UPDATE bookings SET receipt_url = ? WHERE id = ?', [receiptUrl, bookingId]);
  return findById(bookingId);
}

async function cancel(bookingId, studentId) {
  return updateStatus(bookingId, 'cancelled', studentId, 'Cancelled by student.');
}

module.exports = { create, findById, findByStudent, findAll, updateStatus, attachReceipt, cancel };
