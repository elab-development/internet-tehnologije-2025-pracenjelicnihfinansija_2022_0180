import { Link, NavLink } from 'react-router-dom';
import { Home, LogIn, UserPlus } from 'lucide-react';

function Navbar() {
  const linkClass =
    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors';

  const activeClass = 'bg-green-600 text-white';
  const inactiveClass = 'text-green-700 hover:bg-green-100';

  return (
    <nav className='w-full bg-white border-b border-green-200 shadow-sm'>
      <div className='max-w-6xl mx-auto px-4 py-3 flex items-center justify-between'>
        <Link to='/' className='text-xl font-bold text-green-700'>
          Spender
        </Link>

        <div className='flex gap-2'>
          <NavLink
            to='/'
            end
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Home size={18} />
            Home
          </NavLink>

          <NavLink
            to='/login'
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <LogIn size={18} />
            Login
          </NavLink>

          <NavLink
            to='/register'
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <UserPlus size={18} />
            Register
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;