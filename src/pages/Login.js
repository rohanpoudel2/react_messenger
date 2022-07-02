import { useState } from "react";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {

  let navigate = useNavigate();

  const [data, setData] = useState({
    email: '',
    password: '',
    error: null,
    loading: false
  });

  const { email, password, error, loading } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setData({ ...data, error: null, loading: true });

    if (!email || !password) {
      setData({ ...data, error: 'All Fields are required' });
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await updateDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        isOnline: true,
      });
      setData({
        email: '',
        password: '',
        error: null,
        loading: false
      });
      navigate('/', { replace: true });
    } catch (err) {
      setData({ error: err.message, loading: false });
    }

  }


  return (
    <section>
      <h3>Login to your Account</h3>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input_container">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={email} onChange={handleChange} />
          <label htmlFor="password">Passowrd</label>
          <input type="password" name="password" value={password} onChange={handleChange} />
        </div>
        {error ? <p className="error">{error}</p> : null}
        <div className="btn_container">
          <button className="btn" disabled={loading}>
            {loading ? 'Logging in ...' : 'Login'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default Login