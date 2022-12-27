import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';

function Nav() {
  // hook will authomatically update user details
  const [user] = useAuthState(auth);

  return (
    <div>
      <Link to="/"> Home </Link>
      <Link to="/login"> Login </Link>
      <div>
        <p>{user?.displayName}</p>
        <img
          src={user?.photoURL || ''}
          alt="user media"
          width={200}
          height={200}
        />
      </div>
    </div>
  );
}
export default Nav;
