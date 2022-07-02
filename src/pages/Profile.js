import userimg from '../user.png';
import Camera from '../components/svg/Camera';
import Trash from '../components/svg/Trash';
import { useState, useEffect } from 'react';
import { storage, db, auth } from '../firebase';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

  let navigate = useNavigate();

  const [img, setIMG] = useState('');
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  const handlechange = (e) => {
    setIMG(e.target.files[0]);
  }

  useEffect(() => {

    const getdata = async () => {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      setUser(docSnap.data());
    }
    getdata();

    if (img) {
      const uploadImage = async () => {
        try {
          if (user.avatar) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          setLoading(true);
          const imgRef = ref(storage, `avatar/${new Date().getTime()} - ${img.name}`);

          const snap = await uploadBytes(imgRef, img);

          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath
          });
          setIMG('');
          setLoading(false);
        } catch (err) {
          console.log(err.message);
        }
      };
      uploadImage();
    }
  }, [img]);

  const deleteImage = async () => {
    try {
      const confirm = window.confirm('Delete Avatar');
      if (confirm) {
        await deleteObject(ref(storage, user.avatarPath));

        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          avatar: '',
          avatarPath: ''
        });
      }
      navigate('/', { replace: true });
    } catch (err) {
      console.log(err.message);
    }
  }

  return user ? (
    <section>
      <div className="profile_container" >
        <div className="img_container">
          <img src={user.avatar ? user.avatar : userimg} alt="useravatar" />
          <div className="overlay">
            <div>
              <label htmlFor="photo">
                <Camera />
              </label>
              {user.avatar ? <Trash deleteImage={deleteImage} /> : null}
              <input type="file" accept='image/*' style={{ display: 'none' }} id='photo' onChange={handlechange} />
            </div>
          </div>
        </div>
        <div className="text_container">
          {loading ? <p>Updating Profile</p> : null}
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <hr />
          <small>Joined on: {user.createdAt.toDate().toDateString()} </small>
        </div>
      </div >
    </section >
  ) : null;
}

export default Profile