import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import TextInput from '../../components/ui/inputs/TextInput';
import Select from '../../components/ui/inputs/Select';
import Checkbox from '../../components/ui/inputs/Checkbox';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import { useAuth } from '../../context/AuthContext';

const toastStyle = {
  background: '#111827',
  color: '#fff',
  border: '1px solid rgba(255, 255, 255, 0.05)',
};

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const departmentOptions = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Information Technology', label: 'Information Technology' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Finance & Accounts', label: 'Finance & Accounts' },
    { value: 'Operations', label: 'Operations' },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        department: data.department,
        role: 'Employee',
      });
      toast.success(`Welcome, ${user.name}! Account created successfully.`, { style: toastStyle });
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed', { style: toastStyle });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 select-none">
      <div className="text-center md:text-left">
        <h2 className="text-xl font-bold text-white tracking-tight">Create Account</h2>
        <p className="text-xs text-brand-secondaryText mt-1">Register new organization manager access.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
        <TextInput
          label="Full Name"
          placeholder="e.g. David Miller"
          icon={User}
          error={errors.name?.message}
          required
          {...register('name', { required: 'Name is required' })}
        />

        <TextInput
          label="Email Address"
          type="email"
          placeholder="e.g. david.m@assetflow.com"
          icon={Mail}
          error={errors.email?.message}
          required
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />

        <Select
          label="Department"
          placeholder="Select department..."
          options={departmentOptions}
          error={errors.department?.message}
          required
          {...register('department', { required: 'Department selection is required' })}
        />

        <TextInput
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.password?.message}
          required
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />

        <TextInput
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.confirmPassword?.message}
          required
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        <Checkbox
          label="I agree to the Odoo Hackathon terms & policies."
          className="mt-1"
          {...register('terms', { required: 'You must accept the terms' })}
          error={errors.terms?.message}
        />

        <PrimaryButton type="submit" loading={loading} className="w-full mt-4" icon={UserPlus}>
          Create Account
        </PrimaryButton>
      </form>

      <div className="text-center text-xs text-brand-secondaryText mt-1">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-brand-primary hover:text-brand-purple transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
}
