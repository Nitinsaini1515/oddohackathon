import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ShieldCheck, Mail, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react';
import TextInput from '../../components/ui/inputs/TextInput';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Email request, 2 = OTP digits verification
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [emailSubmitted, setEmailSubmitted] = useState('');

  // OTP inputs references
  const otpInputsRef = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [otpValues, setOtpValues] = useState(['', '', '', '']);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // Timer countdown hook for OTP resends
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendEmail = (data) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmailSubmitted(data.email);
      setStep(2);
      setTimer(60);
      toast.success('Simulation OTP code sent to your inbox!', {
        style: {
          background: '#111827',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }
      });
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.substring(value.length - 1); // Keep last digit
    setOtpValues(newOtp);

    // Focus next input automatically
    if (value && index < 3) {
      otpInputsRef[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Focus previous input on backspace
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputsRef[index - 1].current.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const code = otpValues.join('');
    if (code.length < 4) {
      toast.error('Please fill in all 4 digits');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Identity verified! Redirecting to setup portal...', {
        style: {
          background: '#111827',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }
      });
      // Simulate verification -> Dashboard bypass
      navigate('/dashboard');
    }, 1500);
  };

  const handleResendCode = () => {
    if (timer > 0) return;
    setTimer(60);
    setOtpValues(['', '', '', '']);
    otpInputsRef[0].current.focus();
    toast.success('New simulated OTP dispatched!');
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {step === 1 ? (
        <>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-white tracking-tight">Forgot Password</h2>
            <p className="text-xs text-brand-secondaryText mt-1">
              Provide your email to receive a simulation verification pin.
            </p>
          </div>

          <form onSubmit={handleSubmit(handleSendEmail)} className="flex flex-col gap-4">
            <TextInput
              label="Recovery Email"
              type="email"
              placeholder="e.g. david.m@assetflow.com"
              icon={Mail}
              error={errors.email?.message}
              required
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />

            <PrimaryButton
              type="submit"
              loading={loading}
              className="w-full mt-2"
              icon={KeyRound}
            >
              Request OTP Pin
            </PrimaryButton>

            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-1.5 text-xs text-brand-secondaryText hover:text-white transition-colors mt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </form>
        </>
      ) : (
        <>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white tracking-tight">Verify Identity</h2>
            <p className="text-xs text-brand-secondaryText mt-1">
              We sent a 4-digit simulation code to <span className="font-semibold text-white">{emailSubmitted}</span>
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
            {/* OTP Digit inputs */}
            <div className="flex justify-center gap-4 py-2">
              {otpValues.map((val, idx) => (
                <input
                  key={idx}
                  ref={otpInputsRef[idx]}
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-14 h-14 bg-slate-950/60 border border-brand-border rounded-xl text-center text-xl font-bold text-white focus:bg-slate-950 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-all"
                />
              ))}
            </div>

            {/* Timer / Resend */}
            <div className="text-center text-xs text-brand-secondaryText">
              {timer > 0 ? (
                <span>
                  Resend code in <span className="font-bold text-white font-mono">{timer}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="font-bold text-brand-primary hover:text-brand-purple flex items-center justify-center gap-1.5 mx-auto hover:underline"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} /> Resend Code
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <PrimaryButton
                type="submit"
                loading={loading}
                className="w-full"
                icon={ShieldCheck}
              >
                Verify Code
              </PrimaryButton>
              
              <SecondaryButton
                onClick={() => setStep(1)}
                className="w-full text-xs"
              >
                Change Email Address
              </SecondaryButton>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
