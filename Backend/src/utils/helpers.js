const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const parseObjectId = (id, fieldName = 'id') => {
  if (!isValidObjectId(id)) {
    const { ApiError } = require('./ApiError');
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
  return new mongoose.Types.ObjectId(id);
};

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

module.exports = { isValidObjectId, parseObjectId, getInitials };
