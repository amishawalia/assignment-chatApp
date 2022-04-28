import './Topbar.css';
import {Search,Person,Chat,Notifications} from '@material-ui/icons';

const Topbar = () => {
    return <>
        <div className='topbarContainer'>
            <div className='topbarLeft'>
                <span className='logo'>ChatApp</span>
            </div>
            <div className='topbarCenter'>
                <div className='searchbar'>
                    <Search className='searchIcon'/>
                    <input 
                        placeholder='Search for a friend or group'
                        className='searchInput'
                    />
                </div>
            </div>
            <div className='topbarRight'>
                <div className="topbarLinks">
                    <span className="topbarLink">Homepage</span>
                    <span className="topbarLink">Timeline</span>
                </div>
                <div className="topbarIcons">
                    <div className='topbarIconItem'>
                        <Person/>
                        <span className='topbarIconBadge'>1</span>
                    </div>
                    <div className='topbarIconItem'>
                        <Chat/>
                        <span className='topbarIconBadge'>2</span>
                    </div>
                    <div className='topbarIconItem'>
                        <Notifications/>
                        <span className='topbarIconBadge'>3</span>
                    </div>
                </div>
                <img 
                    src='https://res.cloudinary.com/diqqf3eq2/image/upload/v1595959131/person-2_ipcjws.jpg' 
                    alt='Profile Pic' 
                    className='topbarImg'
                />
            </div>
        </div>
    </>
}
export default Topbar;