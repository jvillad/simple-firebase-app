import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

function Nav() {
  // hook will authomatically update user details
  const [user] = useAuthState(auth);

  const signUserOut = async () => {
    await signOut(auth);
  };

  return (
    <div>
      <Link to="/"> Home </Link>
      {!user ? (
        <Link to="/login"> Login </Link>
      ) : (
        <Link to="/createpost"> Create Post </Link>
      )}

      <div className="user">
        {/* if user exist display name and photo */}
        {user && (
          <>
            <p>{user?.displayName}</p>
            <img
              src={user?.photoURL || ''}
              alt="user media"
              width={200}
              height={200}
            />
          </>
        )}
      </div>
      {user && (
        <button type="button" onClick={signUserOut}>
          {' '}
          Log Out{' '}
        </button>
      )}
    </div>
  );
}
export default Nav;
