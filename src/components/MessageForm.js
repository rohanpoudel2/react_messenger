import Upload from "./svg/Upload"

const MessageForm = ({ handleSubmit, text, setText, setImg }) => {
  return (
    <form className="message_form" onSubmit={handleSubmit}>
      <label htmlFor="img"><Upload /></label>
      <input onChange={(e) => { setImg(e.target.files[0]); }} type="file" id="img" accept="image/*" style={{ display: 'none' }} />
      <div>
        <input value={text} type="text" placeholder="Type your message here..." onChange={(e) => setText(e.target.value)} />
      </div>
      <div>
        <button className="btn">Send</button>
      </div>
    </form>
  )
}

export default MessageForm