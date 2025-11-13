import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setMessageandProfileViewid } from '../actioncreate';

function DirectMessagesUI() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [mobileView, setMobileView] = useState('list'); // 'list' or 'chat'
  const receiverId = useSelector((state) => state.app.messageandprofileviewid);
  const senderId = useSelector((state) => state.app.autherazeduserId);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [emojis, setEmojis] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [chatMembers, setChatMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const socketRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const emojiPanelRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const token = localStorage.getItem("access_token");

  // Create socket URL with current receiverId
  const socketUrl = useMemo(
    () => {
      if (!senderId || !receiverId) return null;
      return `ws://127.0.0.1:8003/ws/socialmedia/${senderId}/${receiverId}/`;
    },
    [senderId, receiverId]
  );

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chat members from API
  const fetchChatMembers = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8003/ChatListAPIView/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Chat members data:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // Transform API data to match your UI structure
        const transformedMembers = response.data.map((chat) => {
          const profile = chat.profile || {};
          return {
            id: chat.user_id,
            user_id: chat.user_id,
            name: profile.name || `User ${chat.user_id}`,
            username: `user${chat.user_id}`,
            online: false,
            unread: chat.is_read ? 0 : 1,
            lastMessage: chat.last_message || "No messages yet",
            lastMessageTime: formatTimeAgo(chat.timestamp),
            profile_picture: profile.profile_picture,
            cover_photo:profile.cover_photo,
            bio: profile.bio || "",
            last_message: chat.last_message,
            timestamp: chat.timestamp,
            is_read: chat.is_read
          };
        });
        
        setChatMembers(transformedMembers);
        
        // Set active chat to current receiverId if available
        if (receiverId && !activeChat) {
          setActiveChat(receiverId);
        }
      }
    } catch (error) {
      console.error("Error fetching chat members:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format timestamp
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Unknown time";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  // Fetch emojis from your Django backend
  const fetchEmojis = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8003/get_emojis");
      if (res.data && Array.isArray(res.data)) {
        setEmojis(res.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(res.data.map(emoji => emoji.group))];
        setCategories(uniqueCategories);
        if (uniqueCategories.length > 0) {
          setActiveCategory(uniqueCategories[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching emojis:", error);
    }
  };

  // Fetch messages for specific chat
  const fetchMessages = async (targetReceiverId = null) => {
    const currentReceiverId = targetReceiverId || receiverId;
    
    if (!senderId || !currentReceiverId || !token) {
      setMessages([]);
      return;
    }
    
    try {
      const response = await axios.get(
        `http://127.0.0.1:8003/GetMessagesofOnetoOne/${senderId}/${currentReceiverId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Sort messages by timestamp to ensure proper order
      const sortedMessages = (response.data || []).sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  // WebSocket connection management
  useEffect(() => {
    if (!socketUrl) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    if (socketRef.current) {
      socketRef.current.close();
    }

    const ws = new WebSocket(socketUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket for user:", receiverId);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        const messageWithTimestamp = {
          ...data,
          timestamp: data.timestamp || new Date().toISOString()
        };
        
        setMessages((prev) => [...prev, messageWithTimestamp]);
        fetchChatMembers();
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log("❌ WebSocket disconnected:", event.code, event.reason);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [socketUrl]);

  // Fetch messages when receiver changes
  useEffect(() => {
    if (senderId && receiverId && token) {
      fetchMessages();
      setActiveChat(receiverId);
      // On mobile, switch to chat view when receiver is set
      if (window.innerWidth < 768 && receiverId) {
        setMobileView('chat');
      }
    }
  }, [senderId, receiverId, token]);

  // Fetch emojis and chat members when component mounts
  useEffect(() => {
    fetchEmojis();
    fetchChatMembers();
  }, []);

  // Send message function
  const sendMessage = () => {
    if (!message.trim() || !receiverId) return;
    
    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ message }));
      setMessage("");
      
      setTimeout(() => fetchChatMembers(), 100);
    } else {
      console.error("WebSocket not connected");
    }
  };

  // Handle emoji selection
  const handleEmojiClick = (emojiCharacter) => {
    setMessage((prevMessage) => prevMessage + emojiCharacter);
    setOpen(false);
  };

  // Handle emoji button click
  const handleEmojiButtonClick = (e) => {
    e.stopPropagation();
    setOpen((prevOpen) => !prevOpen);
  };

  // Handle member click - switch to chat with this user
  const handleMemberClick = (member) => {
    dispatch(setMessageandProfileViewid(member.user_id));
    setActiveChat(member.user_id);
    setMessages([]);
    setOpen(false);
    
    // On mobile, switch to chat view
    if (window.innerWidth < 768) {
      setMobileView('chat');
    }
  };

  // Handle back to list on mobile
  const handleBackToList = () => {
    setMobileView('list');
  };

  // Handle profile navigation
  const handleProfileNavigate = (userId) => {
    dispatch(setMessageandProfileViewid(userId));
    navigate('/ProfileOnly');
  };

  // Filter chat members based on search
  const filteredChatMembers = chatMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close emoji panel on outside click
  useEffect(() => { 
    const handleClickOutside = (event) => {
      if (
        emojiButtonRef.current && 
        !emojiButtonRef.current.contains(event.target) &&
        emojiPanelRef.current && 
        !emojiPanelRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter emojis by active category
  const filteredEmojis = emojis.filter(emoji => emoji.group === activeCategory);

  // Get active member data for header
  const activeMember = activeChat 
    ? chatMembers.find(member => member.user_id === activeChat)
    : null;

  return (
    <div className="flex h-screen bg-white text-black font-sans relative">
      {/* MEMBERS LIST VIEW - Always visible on desktop, conditional on mobile */}
      <div className={`
        ${mobileView === 'list' ? 'flex' : 'hidden'} 
        md:flex md:relative
        w-full md:w-80 bg-gray-50 border-r border-gray-200 flex-col h-full
      `}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-lg text-black">Chats</h2>
          <div className="flex items-center mt-2 text-sm p-1 text-gray-600">
          </div>
        </div>
        
        {/* SEARCH BAR */}
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-black px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500"
            />
            <svg className="w-4 h-4 absolute right-3 top-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* MEMBERS LIST */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredChatMembers.length === 0 ? (
              <div className="text-center py-8 text-white">
                {searchTerm ? "No conversations found" : "No conversations yet"}
              </div>
            ) : (
              filteredChatMembers.map((member) => (
                <div
                  key={member.user_id}
                  onClick={() => handleMemberClick(member)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors   ${
                    activeChat === member.user_id 
                      ? ' border-l-2 border-blue-500 bg-black' 
                      : ' border border-gray-200 bg-black'


                  }`}

                  style={{
                          backgroundImage: member.cover_photo 
                            ? `url(http://127.0.0.1:8002${member.cover_photo})`
                            : 'none',
                          backgroundSize: 'cover',
                          
                          backgroundPosition: 'center'
                        }}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar with online status */}
                    <div className="relative"  >
                      <div 
                        className="w-10 h-10 bg-gray-300 flex items-center justify-center text-white font-semibold rounded-full cursor-pointer"
                        style={{
                          backgroundImage: member.profile_picture 
                            ? `url(http://127.0.0.1:8002${member.profile_picture})`
                            : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProfileNavigate(member.user_id);
                        }}
                      >
                        {!member.profile_picture && member.name.charAt(0)}
                      </div>
                      {member.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    {/* Member info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white truncate">{member.name}</h3>
                     
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-gray-200 truncate">{member.lastMessage}</p>
                        <span className="text-gray-500 text-xs whitespace-nowrap ml-2">
                          {member.lastMessageTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* CHAT AREA - Hidden on mobile when in list view */}
      <div className={`
        ${mobileView === 'chat' ? 'flex' : 'hidden'} 
        md:flex md:relative
        flex-1 flex-col bg-white min-w-0
      `}>
        {/* HEADER */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white"
        >
          <div className="flex items-center gap-3">
            
            {/* Back button for mobile */}
            <button 
              onClick={handleBackToList}
              className="md:hidden p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {activeMember ? (
              <>
                <div 
                  className="w-10 h-10 bg-gray-300 flex items-center justify-center text-gray-800 font-semibold rounded-full cursor-pointer"
                  style={{
                    backgroundImage: activeMember.profile_picture 
                      ? `url(http://127.0.0.1:8002${activeMember.profile_picture})`
                      : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  onClick={() => handleProfileNavigate(activeMember.user_id)}
                >
                  {!activeMember.profile_picture && activeMember.name.charAt(0)}
                </div>
  
                <div>
                  <h2 className="font-semibold text-black">{activeMember.name}</h2>
                  <p className="text-gray-600 text-sm">
                    @{activeMember.username}
                    {/* <span className="ml-2 text-green-600 text-xs">● Online</span> */}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-800">
                  R
                </div>
                <div>
                  <h2 className="font-semibold text-black">
                    {receiverId ? `User #${receiverId}` : 'Select a chat'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {receiverId ? 'Loading...' : 'Choose a conversation to start messaging'}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* MESSAGE LIST */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-scroll  p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          {messages.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  {receiverId ? `No messages with this user` : 'No messages yet'}
                </h3>
                <p className="text-gray-500 text-sm">
                  {receiverId ? `Start a conversation` : 'Select a chat to start messaging'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((m, index) => {
                const isSender = Number(m.sender_id) === Number(senderId);
                return (
                  <div
                    key={`${m.id || index}_${m.timestamp}`}
                    className={`flex w-full  ${
                      isSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-end gap-2 max-w-[85%] md:max-w-[70%] ${
                        isSender ? "flex-row-reverse" : ""
                      }`}
                    >
                      {/* Message Bubble */}
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm ${
                          isSender
                            ? "bg-neutral-500 text-white rounded-tr-sm"
                            : "bg-stone-700 text-white rounded-tl-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {m.content || m.message}
                        </p>
                        <span
                          className={`block text-xs mt-1 ${
                            isSender
                              ? "text-blue-200 text-right"
                              : "text-blue-200"
                          }`}
                        >
                          {m.timestamp
                            ? new Date(m.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* INPUT AREA WITH EMOJI PICKER */}
        <div className="p-4 border-t border-gray-200 relative bg-white">
          <div className="flex items-center bg-gray-100 rounded-ms px-3 py-2">
            <button
              ref={emojiButtonRef}
              onClick={handleEmojiButtonClick}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors text-black"
            >
              <span className="text-lg">😊</span>
            </button>
            
            {/* Emoji Picker Panel */}
            {open && (
              <div 
                ref={emojiPanelRef}
                className="absolute bottom-16 left-4 w-80 h-64 bg-white border border-gray-300 rounded-lg shadow-2xl z-50 flex flex-col"
              >
                {/* Category Tabs */}
                <div className="flex border-b border-gray-300 overflow-x-auto bg-gray-100">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCategory(category);
                      }}
                      className={`px-3 py-2 text-sm whitespace-nowrap ${
                        activeCategory === category 
                          ? "bg-white text-black border-t border-l border-r border-gray-300" 
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Emoji Grid */}
                <div className="flex-1 overflow-y-auto p-3 grid grid-cols-8 gap-2">
                  {filteredEmojis.map(emoji => (
                    <button
                      key={emoji.slug}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEmojiClick(emoji.character);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition-colors text-lg"
                      title={emoji.unicodeName}
                    >
                      {emoji.character}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder={receiverId ? `Type a message...` : "Select a chat to message..."}
              className="flex-1 bg-transparent outline-none text-black placeholder-gray-500 px-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              disabled={!receiverId}
            />
            <button
              onClick={sendMessage}
              disabled={!receiverId || !message.trim()}
              className="ml-2 bg-black text-white hover:bg-gray-700 disabled:bg-black disabled:cursor-not-allowed px-4 py-1 rounded-md text-sm transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DirectMessagesUI;