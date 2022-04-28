import './Conversation.css';

const Conversation = (props) => {
    console.log(props);
    return <>
        <div className='conversation'>
            <img 
                className='conversationImg' 
                src={props.item.src} 
                alt='User' 
            />
            <span className='conversationName'>{props.item.name}</span>
        </div>
    </>
} 
export default Conversation;