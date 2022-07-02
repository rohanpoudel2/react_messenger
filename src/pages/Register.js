import { useState } from "react";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Register = () => {

  let navigate = useNavigate();

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    error: null,
    loading: false
  });

  const { name, email, password, error, loading } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setData({ ...data, error: null, loading: true });

    if (!name || !email || !password) {
      setData({ ...data, error: 'All Fields are required' });
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        password,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
      });
      setData({
        name: '',
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
      <h3>Create an Account</h3>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input_container">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={name} onChange={handleChange} />
          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={email} onChange={handleChange} />
          <label htmlFor="password">Passowrd</label>
          <input type="password" name="password" value={password} onChange={handleChange} />
        </div>
        {error ? <p className="error">{error}</p> : null}
        <div className="btn_container">
          <button className="btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default Register