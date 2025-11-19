import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { setMessageandProfileViewid } from '../actioncreate';  
const LikesPage = () => {
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const experienceid = useSelector((state) => state.app.likeexperienceid);
  console.log('likexperine id ,,,',experienceid)
 const navabar=useNavigate()
  const token = localStorage.getItem("access_token");
  const [likesData, setLikesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8004/ExperienceLikesListAPIView/${experienceid}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API Response:', response.data);
        setLikesData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch likes');
        setLoading(false);
        console.error('Error fetching likes:', err);
      }
    };

    fetchLikes();
  }, [token]);

  // Extract liked users from the response data
  const likedUsers = likesData.liked_users || [];
  const totalLikes = likesData.total_likes || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1 justify-center py-5 sm:px-4 md:px-8 lg:px-40">
          <div className="flex flex-col max-w-[960px] flex-1 bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header */}
            <div className="sticky top-0 z-10 flex justify-between items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-200 rounded-t-xl">
              <div className="flex gap-2">
                <button onClick={()=>navabar(-1)} className="p-2 text-gray-800 hover:text-blue-500 transition-colors">
                  <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
              </div>
              <div className="flex-1 text-center">
                <p className="text-gray-900 text-lg font-bold">Likes</p>
              </div>
              <div className="w-10"></div> {/* Spacer */}
            </div>

            {/* Likes Count */}
            <div className="flex flex-wrap justify-between gap-3 p-4 border-b border-gray-200">
              <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                {totalLikes} {totalLikes === 1 ? 'Like' : 'Likes'}
              </p>
            </div>

            {/* Likes List */}
            <div className="flex flex-col">
              {likedUsers.length > 0 ? (
                likedUsers.map((user, index) => (
                  <div
                   
                    key={user.user_id}
                    onClick={()=>{dispatch(setMessageandProfileViewid(user.user_id)) ; navigate('/ProfileOnly'); }}
                    className={`flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between ${
                      index === likedUsers.length - 1 
                        ? 'hover:bg-gray-50 transition-colors rounded-b-xl' 
                        : 'border-b border-gray-200 hover:bg-gray-50 transition-colors'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div 
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 flex-shrink-0"
                        style={{ 
                          backgroundImage: user.profile_picture 
                            ? `url("http://127.0.0.1:8002${user.profile_picture}")`
                            : 'url("https://via.placeholder.com/56x56?text=No+Image")'
                        }}
                        alt={`Profile picture of ${user.name}`}
                      />
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <p className="text-gray-900 text-base font-bold leading-normal truncate">
                          {user.name}
                        </p>
                        <p className="text-gray-500 text-sm font-normal leading-normal truncate">
                          {user.bio || 'Liked your experience'}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <div className="text-gray-400 flex size-7 items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">chevron_right</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-gray-500 text-lg">No likes yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikesPage;