'use strict';

const hostelService  = require('../services/hostel.service');
const { sendSuccess, sendPaginated } = require('../utils/response');

async function getAll(req, res, next) {
  try {
    const { location, page = 1, limit = 20 } = req.query;
    const { hostels, total } = await hostelService.findAll({ location, page, limit });
    sendPaginated(res, hostels, total, page, limit);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const hostel = await hostelService.findById(parseInt(req.params.id, 10));
    sendSuccess(res, 200, hostel);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { name, location, description, amenities, contactEmail, contactPhone } = req.body;
    const hostel = await hostelService.create({ name, location, description, amenities, contactEmail, contactPhone });
    sendSuccess(res, 201, hostel, 'Hostel created successfully.');
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const hostel = await hostelService.update(parseInt(req.params.id, 10), req.body);
    sendSuccess(res, 200, hostel, 'Hostel updated successfully.');
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await hostelService.softDelete(parseInt(req.params.id, 10));
    sendSuccess(res, 200, null, 'Hostel deleted successfully.');
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove };
