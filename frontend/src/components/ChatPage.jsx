<<<<<<< HEAD
import React from 'react'
import { useSelector } from 'react-redux'
// import SuggestedUsers from './SuggestedUsers';pppppppppppppppppppppppppppppppppppppppppppppppppppppppppp
function ChatPage() {
  const { user, suggestedUsers} = useSelector(store => store.auth)
=======
import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedUser } from '../redux/authSlice';
import { fetchSuggestedUsers } from '../redux/userSlice';

function ChatPage() {
  const { user } = useSelector(store => store.auth);
  const { suggestedUsers, loading, error } = useSelector(store => store.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSuggestedUsers());
  }, [dispatch])

>>>>>>> d997b8b (Initial commit: project ready for deployment)
  return (
    <div className='flex ml-[16%] h-screen'>
      <section className='w-full md:w-1/4 my-8'>
        <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
        <hr className='mb-4 border-gray-300' />
        <div className='overflow-y-auto h-[80vh]'>
          {
            suggestedUsers.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id);
              return (
                <div onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'>
                  {/* <Avatar className='w-14 h-14'>
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar> */}
                  <div className='flex flex-col'>
                    <span className='font-medium'>{suggestedUser?.username}</span>
                    <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'} `}>{isOnline ? 'online' : 'offline'}</span>
                  </div>
                </div>
              )
            })
          }
        </div>

      </section>
    </div>
  )
}

export default ChatPage