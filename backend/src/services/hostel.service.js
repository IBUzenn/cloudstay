'use strict';

const { pool } = require('../config/database');
const { AppError } = require('../utils/response');

async function findAll({ location, minPrice, maxPrice, page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const params = [];
  const where  = ['h.is_active = 1'];

  if (location) {
    where.push('(h.location LIKE ? OR h.name LIKE ?)');
    params.push(`%${location}%`, `%${location}%`);
  }

  const whereClause = where.join(' AND ');

  const [rows] = await pool.query(
    `SELECT h.id, h.name, h.location, h.description, h.amenities,
            h.contact_email, h.contact_phone, h.total_rooms,
            COUNT(CASE WHEN r.status = 'available' THEN 1 END) AS available_rooms
     FROM hostels h
     LEFT JOIN rooms r ON r.hostel_id = h.id
     WHERE ${whereClause}
     GROUP BY h.id
     ORDER BY h.name ASC
     LIMIT ? OFFSET ?`,
    [...params, parseInt(limit, 10), offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM hostels h WHERE ${whereClause}`,
    params
  );

  // Parse JSON amenities if string, or use as-is if already parsed by mysql2
  const hostels = rows.map((h) => ({
    ...h,
    amenities: typeof h.amenities === 'string' ? JSON.parse(h.amenities) : (h.amenities || []),
  }));

  return { hostels, total };
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT h.*, COUNT(CASE WHEN r.status = 'available' THEN 1 END) AS available_rooms
     FROM hostels h LEFT JOIN rooms r ON r.hostel_id = h.id
     WHERE h.id = ? AND h.is_active = 1 GROUP BY h.id`,
    [id]
  );
  if (!rows[0]) throw new AppError('Hostel not found.', 404);
  const hostel = rows[0];
  hostel.amenities = typeof hostel.amenities === 'string' ? JSON.parse(hostel.amenities) : (hostel.amenities || []);
  return hostel;
}

async function create({ name, location, description, amenities, contactEmail, contactPhone }) {
  const amenitiesJson = amenities ? JSON.stringify(amenities) : null;
  const [result] = await pool.query(
    `INSERT INTO hostels (name, location, description, amenities, contact_email, contact_phone)
     VALUES (?,?,?,?,?,?)`,
    [name, location, description || null, amenitiesJson, contactEmail || null, contactPhone || null]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const hostel = await findById(id);
  const fields = [];
  const params = [];

  if (data.name        !== undefined) { fields.push('name = ?');          params.push(data.name); }
  if (data.location    !== undefined) { fields.push('location = ?');      params.push(data.location); }
  if (data.description !== undefined) { fields.push('description = ?');   params.push(data.description); }
  if (data.amenities   !== undefined) { fields.push('amenities = ?');     params.push(JSON.stringify(data.amenities)); }
  if (data.contactEmail!== undefined) { fields.push('contact_email = ?'); params.push(data.contactEmail); }
  if (data.contactPhone!== undefined) { fields.push('contact_phone = ?'); params.push(data.contactPhone); }
  if (data.isActive    !== undefined) { fields.push('is_active = ?');     params.push(data.isActive ? 1 : 0); }

  if (fields.length === 0) return hostel;

  params.push(id);
  await pool.query(`UPDATE hostels SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

async function softDelete(id) {
  // Prevent delete if active bookings exist
  const [[{ count }]] = await pool.query(
    `SELECT COUNT(*) AS count FROM bookings WHERE hostel_id = ? AND status IN ('pending','approved')`,
    [id]
  );
  if (count > 0) {
    throw new AppError('Cannot delete hostel with active or pending bookings.', 409);
  }
  await pool.query('UPDATE hostels SET is_active = 0 WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, softDelete };
