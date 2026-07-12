import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock } from 'lucide-react';
import TextInput from '../../components/ui/inputs/TextInput';
import Checkbox from '../../components/ui/inputs/Checkbox';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: 'david.m@assetflow.com',
      password: 'password123',
      rememberMe: true
    }
  });

  const onSubmit = (data) => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      toast.success(`Welcome back, ${data.email.split('@')[0]}!`, {
        style: {
          background: '#111827',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }
      });
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      <div className="text-center md:text-left">
        <h2 className="text-xl font-bold text-white tracking-tight">Access AssetFlow</h2>
        <p className="text-xs text-brand-secondaryText mt-1">Sign in with your enterprise credential.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email */}
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
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Y]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />

        {/* Password */}
        <TextInput
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.password?.message}
          required
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
        />

        {/* Remember me & forgot password link */}
        <div className="flex items-center justify-between mt-1 text-xs">
          <Checkbox
            label="Remember me"
            {...register('rememberMe')}
          />
          <Link
            to="/forgot-password"
            className="font-semibold text-brand-primary hover:text-brand-purple transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit */}
        <PrimaryButton
          type="submit"
          loading={loading}
          className="w-full mt-4"
          icon={LogIn}
        >
          Sign In
        </PrimaryButton>
      </form>

      <div className="text-center text-xs text-brand-secondaryText mt-2">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-bold text-brand-primary hover:text-brand-purple transition-colors"
        >
          Register here
        </Link>
      </div>
    </div>
  );
}
