import userimg from '../user.png';

const User = ({ users, selectUser }) => {

  const handleclick = () => {
    selectUser(users);
  }

  return (
    <>
      <div className="user_wrapper" onClick={handleclick}>
        <div className="user_info">
          <div className="user_detail">
            <img src={users.avatar || userimg} alt="avatar" className='avatar' />
            <h4>{users.name}</h4>
          </div>
          <div className={`user_status ${users.isOnline ? 'online' : 'offline'}`} >
          </div>
        </div>
      </div>
      <div onClick={handleclick} className="sm_container">
        <img src={users.avatar || userimg} alt="avatar" className='avatar sm_screen' />
      </div>
    </>
  )
}

export default User