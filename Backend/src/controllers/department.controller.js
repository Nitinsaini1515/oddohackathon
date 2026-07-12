const Department = require('../models/Department.model');
const User = require('../models/User.model');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');

const createDepartment = asyncHandler(async (req, res) => {
  const { name, code, managerId, budget, description, status } = req.body;

  const existing = await Department.findOne({ $or: [{ name }, { code: code.toUpperCase() }] });
  if (existing) {
    throw new ApiError(409, existing.name === name ? 'Department name already exists' : 'Department code already exists');
  }

  if (managerId) {
    const manager = await User.findById(managerId);
    if (!manager) throw new ApiError(404, 'Manager not found');
  }

  const department = await Department.create({
    name,
    code: code.toUpperCase(),
    managerId: managerId || null,
    budget: budget || 0,
    description: description || '',
    status: status || 'Active',
    createdBy: req.user._id,
  });

  const populated = await Department.findById(department._id).populate('managerId', 'name email');

  res.status(201).json(new ApiResponse(201, { department: populated }, 'Department created successfully'));
});

const getDepartments = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { code: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [departments, total] = await Promise.all([
    Department.find(filter).populate('managerId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Department.countDocuments(filter),
  ]);

  const enriched = await Promise.all(
    departments.map(async (dept) => {
      const employeeCount = await User.countDocuments({ departmentId: dept._id, isActive: true });
      return { ...dept.toObject(), employeeCount };
    })
  );

  res.status(200).json(
    new ApiResponse(200, { departments: enriched, pagination: buildPaginationMeta(total, page, limit) }, 'Departments fetched successfully')
  );
});

const getDepartmentById = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id).populate('managerId', 'name email phone');
  if (!department) throw new ApiError(404, 'Department not found');

  const employeeCount = await User.countDocuments({ departmentId: department._id, isActive: true });

  res.status(200).json(
    new ApiResponse(200, { department: { ...department.toObject(), employeeCount } }, 'Department fetched successfully')
  );
});

const updateDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);
  if (!department) throw new ApiError(404, 'Department not found');

  const { name, code, managerId, budget, description, status } = req.body;

  if (name && name !== department.name) {
    const dup = await Department.findOne({ name, _id: { $ne: department._id } });
    if (dup) throw new ApiError(409, 'Department name already exists');
    department.name = name;
  }

  if (code && code.toUpperCase() !== department.code) {
    const dup = await Department.findOne({ code: code.toUpperCase(), _id: { $ne: department._id } });
    if (dup) throw new ApiError(409, 'Department code already exists');
    department.code = code.toUpperCase();
  }

  if (managerId !== undefined) {
    if (managerId) {
      const manager = await User.findById(managerId);
      if (!manager) throw new ApiError(404, 'Manager not found');
    }
    department.managerId = managerId || null;
  }

  if (budget !== undefined) department.budget = budget;
  if (description !== undefined) department.description = description;
  if (status) department.status = status;

  await department.save();
  const populated = await Department.findById(department._id).populate('managerId', 'name email');

  res.status(200).json(new ApiResponse(200, { department: populated }, 'Department updated successfully'));
});

const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);
  if (!department) throw new ApiError(404, 'Department not found');

  const employeeCount = await User.countDocuments({ departmentId: department._id });
  if (employeeCount > 0) {
    throw new ApiError(400, `Cannot delete department with ${employeeCount} assigned employees`);
  }

  await department.deleteOne();
  res.status(200).json(new ApiResponse(200, null, 'Department deleted successfully'));
});

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
