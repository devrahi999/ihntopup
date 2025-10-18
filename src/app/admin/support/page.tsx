'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { FaHeadset, FaEnvelope, FaPhone, FaClock, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

export default function SupportManagement() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/support');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to load support tickets');
      }
      
      setTickets(result.supportTickets || []);
    } catch (error) {
      console.error('Error loading support tickets:', error);
      alert('Failed to load support tickets. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/support', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: ticketId,
          status: status,
          updated_at: new Date().toISOString()
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update ticket status');
      }

      // Update local state
      const updatedTickets = tickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, status } : ticket
      );
      setTickets(updatedTickets);
      
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status });
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      alert('Failed to update ticket status. Please try again.');
    }
  };

  const sendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    try {
      const newReply = {
        from: 'Admin',
        message: replyMessage,
        timestamp: new Date().toISOString()
      };

      // Get current replies or initialize empty array
      const currentReplies = selectedTicket.replies || [];
      const updatedReplies = [...currentReplies, newReply];

      // Update via API
      const response = await fetch('/api/admin/support', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedTicket.id,
          replies: updatedReplies,
          status: 'resolved',
          updated_at: new Date().toISOString()
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send reply');
      }

      // Update local state
      const updatedTickets = tickets.map(ticket =>
        ticket.id === selectedTicket.id
          ? { ...ticket, replies: updatedReplies, status: 'resolved' }
          : ticket
      );

      setTickets(updatedTickets);
      setSelectedTicket({ ...selectedTicket, replies: updatedReplies, status: 'resolved' });
      setReplyMessage('');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Support Requests</h1>
          <div className="text-sm text-gray-600">
            Open Tickets: <span className="font-bold text-red-600">{tickets.filter(t => t.status === 'open').length}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <FaClock className="text-2xl text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{tickets.filter(t => t.status === 'open').length}</div>
                <div className="text-sm text-gray-600">Open Tickets</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                <FaHeadset className="text-2xl text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{tickets.filter(t => t.status === 'in-progress').length}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-2xl text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{tickets.filter(t => t.status === 'resolved').length}</div>
                <div className="text-sm text-gray-600">Resolved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary to-primary-dark text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Ticket ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Subject</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Priority</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{ticket.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{ticket.user_name}</div>
                      <div className="text-xs text-gray-500">{ticket.user_email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{ticket.subject}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                        {ticket.status === 'open' && <FaClock className="mr-1" />}
                        {ticket.status === 'resolved' && <FaCheckCircle className="mr-1" />}
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm text-gray-600">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                      >
                        View & Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        {loading ? (
          <div className="text-center py-12">
            <FaSpinner className="text-6xl text-gray-300 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading support tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            <FaHeadset className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No support tickets</p>
          </div>
        ) : null}
        </div>

        {/* Ticket Details Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedTicket.id}</h3>
                    <p className="text-sm opacity-90">{selectedTicket.subject}</p>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* User Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      <span className="text-sm">{selectedTicket.user_email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-400" />
                      <span className="text-sm">{selectedTicket.user_phone}</span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
                  <div className="text-sm text-gray-600 mb-1">Customer Message:</div>
                  <div className="text-gray-800">{selectedTicket.message}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(selectedTicket.created_at).toLocaleString()}
                  </div>
                </div>

                {/* Replies */}
                {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Replies:</h4>
                    {selectedTicket.replies.map((reply: any, index: number) => (
                      <div key={index} className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl">
                        <div className="text-sm font-semibold text-green-700 mb-1">{reply.from}</div>
                        <div className="text-gray-800">{reply.message}</div>
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(reply.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {selectedTicket.status !== 'resolved' && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Send Reply</h4>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply here..."
                      className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:border-primary transition-colors resize-none"
                      rows={4}
                    />
                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={sendReply}
                        className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                      >
                        Send Reply & Resolve
                      </button>
                      <button
                        onClick={() => updateTicketStatus(selectedTicket.id, 'resolved')}
                        className="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Mark as Resolved
                      </button>
                    </div>
                  </div>
                )}

                {selectedTicket.status === 'resolved' && (
                  <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
                    <FaCheckCircle className="text-3xl text-green-600 mx-auto mb-2" />
                    <div className="text-green-700 font-semibold">This ticket has been resolved</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
