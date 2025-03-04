import React from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../store/useAuth'
import { useChat } from '../store/useChat'
import avatar from '../../public/avatar.png'

const ChatHeader = () => {

    const { selectedUser , setSelectedUser } = useChat();
    const { onlineUsers } = useAuth();

  return (
    <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="avatar">
                    <div className="size-10 rounded-full relative">
                        <img src={selectedUser.profilePic || avatar } alt={selectedUser.fullName} />
                    </div>
                </div>

                {/* User info */}
                <div>
                    <h3 className='font-medium'>{selectedUser.fullName}</h3>
                    <p className="text-sm text-base-content">
                        {onlineUsers.includes(selectedUser._id) ? "online" : "offline"}
                    </p>
                </div>
            </div>

            {/* Close Button */}
            <button onClick={()=> setSelectedUser(null)}>
                <X/>
            </button>
        </div>
    </div>
  )
}

export default ChatHeader