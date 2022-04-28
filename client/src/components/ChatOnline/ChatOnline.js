import './ChatOnline.css'

const ChatOnline = () => {
    return <>
        <div className='chatOnline'>
            <div className='chatOnlineFriend'>
                <div className='chatOnlineImgContainer'>
                    <img
                        className='chatOnlineImg'
                        src='https://res.cloudinary.com/diqqf3eq2/image/upload/v1595959131/person-2_ipcjws.jpg'
                        alt='online friend'
                    />
                    <div className='chatOnlineBadge'>

                    </div>
                </div>
                <span className='chatOnlineName'>Amisha</span>
            </div>
        </div>
    </>
}

export default ChatOnline;