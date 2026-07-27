import { useState, useEffect, useRef } from 'react';
import { sendChatMessage, getChatHistory, clearChatHistory } from '../api/chatApi';
import { useToast } from '../context/ToastContext';
import { extractErrorMessage } from '../utils/errorHandler';

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();
  const messagesEndRef = useRef(null);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await getChatHistory();
      setMessages(response.data);
    } catch (err) {
      showToast(extractErrorMessage(err, 'Failed to load chat history'), 'error');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (open) loadHistory();
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const userMsg = { role: 'USER', content: trimmed, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const response = await sendChatMessage(trimmed);
      const aiMsg = { role: 'AI', content: response.data.reply, createdAt: new Date().toISOString() };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      showToast(extractErrorMessage(err, 'AI assistant is unavailable right now'), 'error');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('Clear this conversation? This cannot be undone.')) return;
    try {
      await clearChatHistory();
      setMessages([]);
      showToast('Conversation cleared', 'success');
    } catch (err) {
      showToast(extractErrorMessage(err, 'Failed to clear conversation'), 'error');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open && (
        <div className="w-80 sm:w-96 h-[28rem] bg-white rounded-lg shadow-2xl flex flex-col mb-3 border">
          <div className="bg-green-800 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <span className="font-semibold text-sm">Smart Traders Assistant</span>
            <div className="flex items-center gap-3">
              <button onClick={handleClear} className="text-xs text-green-200 hover:text-white">
                Clear
              </button>
              <button onClick={() => setOpen(false)} className="text-white hover:text-green-200">
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loadingHistory ? (
              <p className="text-center text-gray-400 text-sm mt-4">Loading conversation...</p>
            ) : messages.length === 0 ? (
              <p className="text-center text-gray-400 text-sm mt-4">
                Ask me about crop pricing, farming tips, or how the marketplace works.
              </p>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                      msg.role === 'USER'
                        ? 'bg-green-700 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-500 px-3 py-2 rounded-lg text-sm rounded-bl-none">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce [animation-delay:0.15s]">●</span>
                    <span className="animate-bounce [animation-delay:0.3s]">●</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              maxLength={2000}
              className="flex-1 border rounded px-3 py-2 text-sm"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="bg-green-700 text-white px-4 py-2 rounded text-sm hover:bg-green-800 disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="bg-green-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-green-800"
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}

export default ChatWidget;