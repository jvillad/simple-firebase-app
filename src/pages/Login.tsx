import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../config/firebase';

function Login() {
  const navigate = useNavigate();
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    navigate('/');
  };
  return (
    <div className="login-page">
      <p>Sign in with google to continue. </p>
      <button type="button" onClick={signInWithGoogle}>
        Log in
      </button>
    </div>
  );
}
export default Login;
