import { useState } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", isBot: true }
  ]);
  const [userInput, setUserInput] = useState('');

  const dummySuggestions = [
    "Tell me about your soaps",
    "What ingredients do you use?",
    "How to place an order?",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: userInput, isBot: false }]);

    // Simulate bot response (dummy response for now)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Thank you for your message! This is a demo response. The chatbot will be fully functional soon.",
        isBot: true
      }]);
    }, 1000);

    setUserInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Popup */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#12372A] p-4 flex justify-between items-center">
            <h3 className="text-white font-semibold">O2 Herbal - Chat bot</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-[#ADBC9F] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="h-80 p-4 overflow-y-auto bg-gray-50 scrollbar-hide">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${msg.isBot ? 'text-left' : 'text-right'}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    msg.isBot
                      ? 'bg-[#ADBC9F] text-[#12372A]'
                      : 'bg-[#12372A] text-white'
                  } max-w-[80%]`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          <div className="p-2 bg-gray-50 border-t border-gray-200">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {dummySuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setUserInput(suggestion)}
                  className="px-3 py-1 text-sm bg-[#436850] text-white rounded-full whitespace-nowrap hover:bg-[#12372A] transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#12372A]"
              />
              <button
                type="submit"
                className="bg-[#12372A] text-white px-4 py-2 rounded-lg hover:bg-[#436850] transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#12372A] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z"
          />
        </svg>
      </button>
    </div>
  );
}