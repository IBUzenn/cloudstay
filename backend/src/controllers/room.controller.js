'use strict';

const roomService = require('../services/room.service');
const { sendSuccess } = require('../utils/response');

async function getByHostel(req, res, next) {
  try {
    const { hostelId } = req.params;
    const { status, roomType } = req.query;
    const rooms = await roomService.findByHostel(parseInt(hostelId, 10), { status, roomType });
    sendSuccess(res, 200, rooms);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const room = await roomService.findById(parseInt(req.params.id, 10));
    sendSuccess(res, 200, room);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { hostelId, roomNumber, roomType, capacity, pricePerSemester, description } = req.body;
    const room = await roomService.create({ hostelId, roomNumber, roomType, capacity, pricePerSemester, description });
    sendSuccess(res, 201, room, 'Room created successfully.');
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const room = await roomService.update(parseInt(req.params.id, 10), req.body);
    sendSuccess(res, 200, room, 'Room updated successfully.');
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await roomService.remove(parseInt(req.params.id, 10));
    sendSuccess(res, 200, null, 'Room deleted successfully.');
  } catch (err) { next(err); }
}

module.exports = { getByHostel, getById, create, update, remove };
