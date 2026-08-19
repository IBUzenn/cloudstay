'use strict';

const bookingService = require('../services/booking.service');
const uploadService  = require('../services/upload.service');
const { sendSuccess, sendPaginated, AppError } = require('../utils/response');

async function create(req, res, next) {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;
    const booking = await bookingService.create(req.user.userId, roomId, checkInDate, checkOutDate);
    sendSuccess(res, 201, booking, 'Booking created successfully. Please upload your payment receipt.');
  } catch (err) { next(err); }
}

async function getMyBookings(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { bookings, total } = await bookingService.findByStudent(req.user.userId, { page, limit });
    sendPaginated(res, bookings, total, page, limit);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const booking = await bookingService.findById(parseInt(req.params.id, 10));
    // Students can only view their own bookings
    if (req.user.role === 'student' && booking.student_id !== req.user.userId) {
      return next(new AppError('Access denied.', 403));
    }
    sendSuccess(res, 200, booking);
  } catch (err) { next(err); }
}

async function getAll(req, res, next) {
  try {
    const { status, hostelId, page = 1, limit = 20 } = req.query;
    const { bookings, total } = await bookingService.findAll({ status, hostelId, page, limit });
    sendPaginated(res, bookings, total, page, limit);
  } catch (err) { next(err); }
}

async function updateStatus(req, res, next) {
  try {
    const { status, reviewNote } = req.body;
    const booking = await bookingService.updateStatus(
      parseInt(req.params.id, 10),
      status,
      req.user.userId,
      reviewNote
    );
    sendSuccess(res, 200, booking, `Booking ${status} successfully.`);
  } catch (err) { next(err); }
}

async function cancel(req, res, next) {
  try {
    const booking = await bookingService.cancel(parseInt(req.params.id, 10), req.user.userId);
    sendSuccess(res, 200, booking, 'Booking cancelled successfully.');
  } catch (err) { next(err); }
}

async function uploadReceipt(req, res, next) {
  try {
    if (!req.file) return next(new AppError('No file uploaded.', 400));

    const receiptUrl = await uploadService.uploadReceipt(
      parseInt(req.params.id, 10),
      req.file.buffer,
      req.file.mimetype
    );
    const booking = await bookingService.attachReceipt(
      parseInt(req.params.id, 10),
      req.user.userId,
      receiptUrl
    );
    sendSuccess(res, 200, booking, 'Payment receipt uploaded successfully.');
  } catch (err) { next(err); }
}

module.exports = { create, getMyBookings, getById, getAll, updateStatus, cancel, uploadReceipt };
