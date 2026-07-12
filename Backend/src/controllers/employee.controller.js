const User = require('../models/User.model');
const Department = require('../models/Department.model');
const { Allocation } = require('../models/Allocation.model');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const { getInitials } = require('../utils/helpers');
const { ROLES } = require('../utils/constants');

const formatEmployee = async (user) => {
  const assignedAssetsCount = await Allocation.countDocuments({ employeeId: user._id, status: 'Active' });
  const dept = user.departmentId
    ? await Department.findById(user.departmentId).select('name')
    : null;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    department: dept?.name || user.department,
    departmentId: user.departmentId,
    role: user.role,
    status: user.status,
    avatar: user.avatar || getInitials(user.name),
    phone: user.phone,
    joiningDate: user.joiningDate,
    assignedAssetsCount,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
};

const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, password, departmentId, role, phone, status, joiningDate } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Employee with this email already exists');

  let departmentName = null;
  if (departmentId) {
    const dept = await Department.findById(departmentId);
    if (!dept) throw new ApiError(404, 'Department not found');
    departmentName = dept.name;
  }

  const user = await User.create({
    name,
    email,
    password: password || 'password123',
    departmentId: departmentId || null,
    department: departmentName,
    role: role || ROLES.EMPLOYEE,
    phone: phone || null,
    status: status || 'Active',
    joiningDate: joiningDate || new Date(),
    avatar: getInitials(name),
    isActive: true,
  });

  const employee = await formatEmployee(user);
  res.status(201).json(new ApiResponse(201, { employee }, 'Employee created successfully'));
});

const getEmployees = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.departmentId) filter.departmentId = req.query.departmentId;
  if (req.query.role) filter.role = req.query.role;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  const employees = await Promise.all(users.map(formatEmployee));

  res.status(200).json(
    new ApiResponse(200, { employees, pagination: buildPaginationMeta(total, page, limit) }, 'Employees fetched successfully')
  );
});

const getEmployeeById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Employee not found');

  const employee = await formatEmployee(user);
  res.status(200).json(new ApiResponse(200, { employee }, 'Employee fetched successfully'));
});

const updateEmployee = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Employee not found');

  const { name, email, departmentId, role, phone, status, isActive, joiningDate } = req.body;

  if (email && email !== user.email) {
    const dup = await User.findOne({ email, _id: { $ne: user._id } });
    if (dup) throw new ApiError(409, 'Email already in use');
    user.email = email;
  }

  if (name) {
    user.name = name;
    user.avatar = getInitials(name);
  }

  if (departmentId !== undefined) {
    if (departmentId) {
      const dept = await Department.findById(departmentId);
      if (!dept) throw new ApiError(404, 'Department not found');
      user.departmentId = departmentId;
      user.department = dept.name;
    } else {
      user.departmentId = null;
      user.department = null;
    }
  }

  if (role) user.role = role;
  if (phone !== undefined) user.phone = phone;
  if (status) user.status = status;
  if (isActive !== undefined) user.isActive = isActive;
  if (joiningDate) user.joiningDate = joiningDate;

  await user.save();
  const employee = await formatEmployee(user);

  res.status(200).json(new ApiResponse(200, { employee }, 'Employee updated successfully'));
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Employee not found');

  const activeAllocations = await Allocation.countDocuments({ employeeId: user._id, status: 'Active' });
  if (activeAllocations > 0) {
    throw new ApiError(400, 'Cannot delete employee with active asset allocations');
  }

  user.isActive = false;
  user.status = 'Inactive';
  await user.save();

  res.status(200).json(new ApiResponse(200, null, 'Employee deactivated successfully'));
});

const assignDepartment = asyncHandler(async (req, res) => {
  const { departmentId } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Employee not found');

  const dept = await Department.findById(departmentId);
  if (!dept) throw new ApiError(404, 'Department not found');

  user.departmentId = departmentId;
  user.department = dept.name;
  await user.save();

  const employee = await formatEmployee(user);
  res.status(200).json(new ApiResponse(200, { employee }, 'Department assigned successfully'));
});

const assignRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Employee not found');

  user.role = role;
  await user.save();

  const employee = await formatEmployee(user);
  res.status(200).json(new ApiResponse(200, { employee }, 'Role assigned successfully'));
});

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  assignDepartment,
  assignRole,
};
