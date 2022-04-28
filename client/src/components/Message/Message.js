import './Message.css';

const Message = ({own}) => {
    return <>
        <div className={own ? 'message own' :'message'}>
            <div className='messageTop'>
                <img 
                    className='messageImg'
                    src='https://res.cloudinary.com/diqqf3eq2/image/upload/v1595959131/person-2_ipcjws.jpg'
                    alt='message'
                />
                <p className='messageText'>Hello this is a message</p>
            </div>
            <div className='messageBottom'>
                1 hour ago
            </div>
        </div>
    </>
}
export default Message;