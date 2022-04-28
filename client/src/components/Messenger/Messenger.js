import ChatOnline from '../ChatOnline/ChatOnline';
import Conversation from '../Conversation/Conversation';
import Message from '../Message/Message';
import './Messenger.css';

const Messenger = () => {
    const users =[
        {
            name:'amisha',
            src:'https://res.cloudinary.com/diqqf3eq2/image/upload/v1595959131/person-2_ipcjws.jpg'
        },
        {
            name:'varnika',
            src:'https://res.cloudinary.com/diqqf3eq2/image/upload/v1595959131/person-2_ipcjws.jpg'
        },
        {
            name:'prince',
            src:'https://res.cloudinary.com/diqqf3eq2/image/upload/v1595959131/person-2_ipcjws.jpg'
        },
        {
            name:'shashwat',
            src:'https://res.cloudinary.com/diqqf3eq2/image/upload/v1595959131/person-2_ipcjws.jpg'
        },
       
    ]
    return <>
        <div className='messenger'>
            <div className='chatMenu'>
                <div className='chatMenuWrapper'>
                    <input placeholder="Search for friends" className="chatMenuInput" />
                    {users.map(user => {
                        return <Conversation item={user}/>
                    })}
                </div>
            </div>
            <div className='chatBox'>
                <div className='chatBoxWrapper'>
                    <div className='chatBoxTop'>
                        <Message own={true}/>
                        <Message/>
                        <Message own={true}/>
                        <Message/>
                        <Message own={true}/>
                        <Message/>
                        <Message own={true}/>
                        <Message/>
                        <Message own={true}/>
                        <Message/>
                        <Message own={true}/>
                        <Message/>
                    </div>
                    <div className='chatBoxBottom'>
                        <textarea
                            className='chatMessageInput'
                            placeholder='write a message'
                        />
                        <button className='chatSubmitButton'>Send</button>
                    </div>
                </div>
            </div>
            <div className='chatOnline'>
                <div className='chatOnlineWrapper'>
                    <ChatOnline/>
                </div>
            </div>

        </div>
    </>
}

export default Messenger;