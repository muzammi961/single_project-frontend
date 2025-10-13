import React, { useState } from 'react';

const Viewphotoorvideofromprofile = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1);
  const [comments, setComments] = useState([{ id: 1, text: 'Great shot!', user: 'user1' }]);
  const [newComment, setNewComment] = useState('');
  const [showWeather, setShowWeather] = useState(true); // Toggle between weather and media view

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleAddComment = (e) => {
    if (e.key === 'Enter' && newComment.trim()) {
      setComments([...comments, { id: comments.length + 1, text: newComment, user: 'Current User' }]);
      setNewComment('');
    }
  };

  const handleClose = () => {
    // Placeholder for closing modal or navigating back
    console.log('Close view');
    // Could integrate with router: history.goBack();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row p-0 m-0 overflow-hidden">
      {/* Left Side: Dynamic Content - Weather or Full Media Viewer */}
      <div className="w-full lg:w-1/2 h-screen flex flex-col bg-black relative">
        {/* Top Navigation Bar - Fixed */}
        <div className="fixed top-0 left-0 right-0 lg:left-auto lg:right-0 lg:w-1/2 p-4 bg-black border-b border-gray-800 z-20 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button onClick={handleClose} className="text-2xl lg:hidden">←</button>
            {/* <span className="text-xl font-bold">Instagram</span> */}
          </div>
          <div className="flex items-center space-x-4 lg:hidden">
            <span className="text-lg">🧭</span>
            <span className="text-lg">📱</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center pt-16 pb-24 mt-16">
          {showWeather ? (
            // Weather Widget
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl max-w-md w-full mx-4 border border-gray-700">
              <div className="text-6xl font-bold mb-4 text-blue-400">24°</div>
              <div className="text-8xl mb-6 animate-pulse">🌤️</div>
              <div className="text-2xl font-semibold mb-2">New York</div>
              <div className="text-lg text-gray-300">Partly cloudy</div>
              <button
                onClick={() => setShowWeather(false)}
                className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                View Post Media
              </button>
            </div>
          ) : (
            // Full-Screen Media Viewer
            <div className="w-full h-full flex items-center justify-center bg-black">
              <div className="relative w-full max-w-2xl mx-4">
                {/* Sample Image - Replace with video for video */}
                <img
                  src="https://picsum.photos/800/600?random=1" // Placeholder image
                  alt="Post Media"
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-2xl"
                />
                <button
                  onClick={() => setShowWeather(true)}
                  className="absolute top-4 right-4 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                >
                  ↶
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation - Fixed on Mobile, Static on Desktop */}
        <div className="fixed bottom-0 left-0 right-0 lg:static lg:w-1/2 p-4 bg-black border-t border-gray-800 z-10 lg:mt-auto">
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center space-y-1">
              <span className={`text-lg ${isLiked ? 'text-red-500' : 'text-white'}`}>♥</span>
              <span className="text-xs">Like ({likeCount})</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <span className="text-lg">💬</span>
              <span className="text-xs">Comment ({comments.length})</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <span className="text-lg">↗️</span>
              <span className="text-xs">Share</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <span className="text-lg">📌</span>
              <span className="text-xs">Save</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <span className="text-lg">⋯</span>
              <span className="text-xs">More</span>
            </div>
          </div>
        </div>

        {/* Footer - Adjusted Position */}
        <div className="absolute bottom-24 right-4 text-xs text-gray-500 z-10 hidden lg:block">
          <div className="mb-2">⋯</div>
          <div>Also from Meta</div>
        </div>
      </div>

      {/* Right Side: Post Details Panel - Improved Structure */}
      <div className="w-full lg:w-1/2 h-screen flex flex-col bg-black p-4 relative overflow-y-auto">
        {/* Close Button - Only on Desktop */}
        <div className="hidden lg:block absolute top-4 right-4 z-10">
          <button onClick={handleClose} className="text-2xl hover:text-gray-300 transition-colors">×</button>
        </div>

        {/* Post Header */}
        <div className="flex items-center justify-between mb-6 pt-4 sticky top-0 bg-black z-10 pb-2 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              M
            </div>
            <span className="font-semibold text-sm">muzam.mil500</span>
          </div>
          <div className="text-lg cursor-pointer hover:text-gray-300 transition-colors">⋯</div>
        </div>

        {/* Post Metadata */}
        <div className="flex items-start space-x-3 mb-4 pb-2 border-b border-gray-800">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm mb-1">muzam.mil500</div>
            <div className="text-sm text-gray-300 mb-2">Now 1 like this adventure! #Travel #NewYork</div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="flex-1 mb-6">
          <div className="mb-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3 mb-3 p-2 bg-gray-900/50 rounded-lg">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="font-semibold text-xs mb-1">{comment.user}</div>
                  <div className="text-sm text-gray-300">{comment.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Post Caption and Time */}
        <div className="text-sm text-gray-300 mb-2 border-t border-gray-800 pt-2">Be the first to like this</div>
        <div className="text-xs text-gray-500 mb-6">9 minutes ago</div>

        {/* Comment Input - Sticky Bottom */}
        <div className="flex items-center space-x-3 sticky bottom-0 bg-black p-4 border-t border-gray-800">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">😀</div>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleAddComment}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent border-b border-gray-600 py-2 text-sm focus:outline-none focus:border-blue-400 transition-colors"
          />
          <button
            onClick={() => {
              if (newComment.trim()) handleAddComment({ key: 'Enter' });
            }}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-semibold"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Viewphotoorvideofromprofile;


