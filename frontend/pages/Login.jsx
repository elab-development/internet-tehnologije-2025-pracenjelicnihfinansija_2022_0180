import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = () => {
    const next = {};

    const emailInput = email.trim();
    if (!emailInput) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(emailInput))
      next.email = 'Enter a valid email address.';

    if (!password) next.password = 'Password is required.';
    else if (password.length < 6)
      next.password = 'Password must be at least 6 characters.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const canSubmit = email.trim() !== '' && password !== '';

  const onSubmitForm = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log('LOGIN payload (validated):', {
      email: email.trim(),
      password,
    });
  };

  const showError = (field) => touched[field] && errors[field];

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <div className='max-w-md mx-auto'>
        <div className='bg-white border border-green-200 rounded-2xl shadow-sm p-6'>
          <div className='flex items-center gap-2 text-green-800 mb-2'>
            <div className='w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center'>
              <LogIn size={20} className='text-green-700' />
            </div>
            <div>
              <h1 className='text-2xl font-extrabold text-green-800'>Login</h1>
              <p className='text-green-900/70 text-sm'>
                Access your account to track transactions.
              </p>
            </div>
          </div>

          <form className='mt-5 space-y-4' onSubmit={onSubmitForm} noValidate>
            <div>
              <label className='block text-sm font-semibold text-green-900 mb-1'>
                Email
              </label>
              <div
                className={`flex items-center gap-2 bg-white border rounded-xl px-3 py-2 focus-within:ring-2 ${
                  showError('email')
                    ? 'border-red-300 focus-within:ring-red-200'
                    : 'border-green-200 focus-within:ring-green-200'
                }`}
              >
                <Mail size={18} className='text-green-700' />
                <input
                  type='email'
                  placeholder='you@example.com'
                  className='w-full outline-none text-green-900 placeholder:text-green-900/40'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                />
              </div>
              {showError('email') ? (
                <p className='mt-1 text-sm text-red-600 flex items-center gap-1'>
                  <AlertCircle size={16} />
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label className='block text-sm font-semibold text-green-900 mb-1'>
                Password
              </label>
              <div
                className={`flex items-center gap-2 bg-white border rounded-xl px-3 py-2 focus-within:ring-2 ${
                  showError('password')
                    ? 'border-red-300 focus-within:ring-red-200'
                    : 'border-green-200 focus-within:ring-green-200'
                }`}
              >
                <Lock size={18} className='text-green-700' />
                <input
                  type='password'
                  placeholder='••••••••'
                  className='w-full outline-none text-green-900 placeholder:text-green-900/40'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                />
              </div>
              {showError('password') ? (
                <p className='mt-1 text-sm text-red-600 flex items-center gap-1'>
                  <AlertCircle size={16} />
                  {errors.password}
                </p>
              ) : null}
            </div>

            <button
              type='submit'
              className={`w-full rounded-xl py-2.5 font-semibold transition ${
                canSubmit
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-green-200 text-green-700 cursor-not-allowed'
              }`}
              disabled={!canSubmit}
            >
              Login
            </button>

            <p className='text-xs text-green-900/60 text-center'>
              Don’t have an account?{' '}
              <Link to='/register' className='underline'>
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;