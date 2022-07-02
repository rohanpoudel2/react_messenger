import { useEffect, useState } from "react";
import { db, auth, storage } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, Timestamp, orderBy } from "firebase/firestore";
import User from "../components/User";
import MessageForm from "../components/MessageForm";
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import Message from "../components/Message";

const Home = () => {

  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState('');
  const [text, setText] = useState('');
  const [img, setImg] = useState('');
  const [messages, setMessages] = useState('');

  const user1 = auth.currentUser.uid;

  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', 'not-in', [user1]));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let user = []
      querySnapshot.forEach((doc) => {
        user.push(doc.data());
      })
      setUsers(user);
    });
    return () => unsub();
  }, []);

  const selectUser = (user) => {
    setChat(user);

    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const msgsRef = collection(db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMessages(msgs);
    });
  }

  const handleSubmit = async (e) => {

    e.preventDefault();

    const user2 = chat.uid;

    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    let url;

    if (img) {
      const imgRef = ref(storage, `images/${new Date().getTime()}- ${img.name}`);
      const snap = await uploadBytes(imgRef, img);
      const downloadurl = await getDownloadURL(ref(storage, snap.ref.fullPath));

      url = downloadurl;
    }

    await addDoc(collection(db, 'messages', id, 'chat'),
      {
        text,
        from: user1,
        to: user2,
        createdAt: Timestamp.fromDate(new Date()),
        media: url || ''
      }
    );
    setText('');
    setImg('');
  }

  return (
    <div className="home_container">
      <div className="users_container">
        {
          users.map((users) => (<User key={users.uid} users={users} selectUser={selectUser} />))
        }
      </div>
      <div className="messages_container">
        {
          chat ?
            <>
              <div className="messages_user">
                <h3>{chat.name}</h3>
              </div>
              <div className="messages">
                {
                  messages.length ? messages.map((msg, i) => <Message key={i} msg={msg} user1={user1} />)
                    :
                    <h3>Messages not Found</h3>
                }
              </div>
              <MessageForm handleSubmit={handleSubmit} text={text} setText={setText} setImg={setImg} />
            </>
            :
            <h3 className="no_conv">Select someone to start chatting</h3>
        }
      </div>
    </div>
  )
}

export default Home