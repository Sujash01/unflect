"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Trash2, X } from "lucide-react";

type Enquiry = {
  id: string;
  reference: string;
  name: string;
  company: string;
  email: string;
  project_type: string;
  goal: string;
  problem: string;
  timeline: string;
  budget: string;
  details: string | null;
  status: string;
  created_at: string;
};

const statusColors: Record<string, string> = {
  new: "border-indigo text-indigo",
  contacted: "border-blue-400 text-blue-400",
  qualified: "border-green-400 text-green-400",
  won: "border-emerald-500 text-emerald-500",
  lost: "border-orange-400 text-orange-400",
  spam: "border-red-400 text-red-400",
};

const statusOptions = ["new", "contacted", "qualified", "won", "lost", "spam"];

export function EnquiriesTable({ enquiries }: { enquiries: Enquiry[] }) {
  const router = useRouter();
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filteredEnquiries = filter === "all" 
    ? enquiries 
    : enquiries.filter(e => e.status === filter);

  const statuses = ["all", "new", "contacted", "qualified", "won", "lost", "spam"];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/enquiries?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
        setSelectedEnquiry(null);
      } else {
        alert("Failed to delete enquiry");
      }
    } catch {
      alert("Error deleting enquiry");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!editingEnquiry) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEnquiry),
      });

      if (response.ok) {
        router.refresh();
        setEditingEnquiry(null);
        setSelectedEnquiry(null);
      } else {
        alert("Failed to update enquiry");
      }
    } catch {
      alert("Error updating enquiry");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Filter Tabs */}
      <div className="mb-4 flex gap-2 flex-wrap">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? "bg-indigo text-navy"
                : "bg-navy-raised text-muted hover:bg-bone/5 hover:text-bone border border-line"
            }`}
          >
            {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== "all" && (
              <span className="ml-1.5 text-xs opacity-70">
                {enquiries.filter(e => e.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-line bg-navy-raised">
        {filteredEnquiries.length === 0 ? (
          <p className="p-6 text-sm text-muted">No enquiries found for this filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-line bg-navy">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">Reference</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">Company</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">Contact</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">Budget</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="border-b border-line last:border-b-0 hover:bg-bone/5">
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs text-indigo">{enquiry.reference}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-bone">{enquiry.company}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-bone">{enquiry.name}</p>
                      <p className="text-xs text-muted mt-0.5">{enquiry.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-muted">{enquiry.project_type}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-muted">{enquiry.budget}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block rounded-full border px-2.5 py-1 font-mono text-[10px] ${statusColors[enquiry.status] || "border-line text-muted"}`}>
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-muted">
                        {formatDistanceToNow(new Date(enquiry.created_at), { addSuffix: true })}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="text-xs text-indigo hover:text-indigo-bright transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setEditingEnquiry(enquiry);
                            setSelectedEnquiry(enquiry);
                          }}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(enquiry.id)}
                          disabled={isDeleting}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {filteredEnquiries.length === 0 ? (
          <div className="rounded-2xl border border-line bg-navy-raised p-6">
            <p className="text-sm text-muted">No enquiries found for this filter.</p>
          </div>
        ) : (
          filteredEnquiries.map((enquiry) => (
            <div key={enquiry.id} className="rounded-2xl border border-line bg-navy-raised p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-xs text-indigo">{enquiry.reference}</p>
                  <p className="mt-1 text-sm font-medium text-bone">{enquiry.company}</p>
                </div>
                <span className={`rounded-full border px-2.5 py-1 font-mono text-[10px] ${statusColors[enquiry.status] || "border-line text-muted"}`}>
                  {enquiry.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-muted">Contact: </span>
                  <span className="text-bone">{enquiry.name}</span>
                </div>
                <div>
                  <span className="text-muted">Email: </span>
                  <span className="text-bone">{enquiry.email}</span>
                </div>
                <div>
                  <span className="text-muted">Type: </span>
                  <span className="text-bone">{enquiry.project_type}</span>
                </div>
                <div>
                  <span className="text-muted">Budget: </span>
                  <span className="text-bone">{enquiry.budget}</span>
                </div>
                <div>
                  <span className="text-muted">Created: </span>
                  <span className="text-bone">
                    {formatDistanceToNow(new Date(enquiry.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-line">
                <button
                  onClick={() => setSelectedEnquiry(enquiry)}
                  className="flex-1 rounded-lg bg-indigo/10 border border-indigo px-3 py-2 text-xs font-medium text-indigo hover:bg-indigo/20 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => {
                    setEditingEnquiry(enquiry);
                    setSelectedEnquiry(enquiry);
                  }}
                  className="flex-1 rounded-lg bg-blue-400/10 border border-blue-400 px-3 py-2 text-xs font-medium text-blue-400 hover:bg-blue-400/20 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(enquiry.id)}
                  disabled={isDeleting}
                  className="flex-1 rounded-lg bg-red-400/10 border border-red-400 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-400/20 transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details/Edit Modal */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm p-4"
          onClick={() => {
            setSelectedEnquiry(null);
            setEditingEnquiry(null);
          }}
        >
          <div
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-line bg-navy-raised p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="font-mono text-xs text-indigo">{selectedEnquiry.reference}</p>
                <h3 className="mt-2 font-display text-xl text-bone">{selectedEnquiry.company}</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedEnquiry(null);
                  setEditingEnquiry(null);
                }}
                className="text-muted hover:text-bone transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {editingEnquiry ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted mb-1 block">Name</label>
                    <input
                      type="text"
                      value={editingEnquiry.name}
                      onChange={(e) => setEditingEnquiry({ ...editingEnquiry, name: e.target.value })}
                      className="w-full rounded-lg border border-line bg-navy px-3 py-2 text-sm text-bone focus:border-indigo focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block">Email</label>
                    <input
                      type="email"
                      value={editingEnquiry.email}
                      onChange={(e) => setEditingEnquiry({ ...editingEnquiry, email: e.target.value })}
                      className="w-full rounded-lg border border-line bg-navy px-3 py-2 text-sm text-bone focus:border-indigo focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted mb-1 block">Company</label>
                  <input
                    type="text"
                    value={editingEnquiry.company}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, company: e.target.value })}
                    className="w-full rounded-lg border border-line bg-navy px-3 py-2 text-sm text-bone focus:border-indigo focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted mb-1 block">Project Type</label>
                    <input
                      type="text"
                      value={editingEnquiry.project_type}
                      onChange={(e) => setEditingEnquiry({ ...editingEnquiry, project_type: e.target.value })}
                      className="w-full rounded-lg border border-line bg-navy px-3 py-2 text-sm text-bone focus:border-indigo focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block">Timeline</label>
                    <input
                      type="text"
                      value={editingEnquiry.timeline}
                      onChange={(e) => setEditingEnquiry({ ...editingEnquiry, timeline: e.target.value })}
                      className="w-full rounded-lg border border-line bg-navy px-3 py-2 text-sm text-bone focus:border-indigo focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted mb-1 block">Budget</label>
                    <input
                      type="text"
                      value={editingEnquiry.budget}
                      onChange={(e) => setEditingEnquiry({ ...editingEnquiry, budget: e.target.value })}
                      className="w-full rounded-lg border border-line bg-navy px-3 py-2 text-sm text-bone focus:border-indigo focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block">Status</label>
                    <select
                      value={editingEnquiry.status}
                      onChange={(e) => setEditingEnquiry({ ...editingEnquiry, status: e.target.value })}
                      className="w-full rounded-lg border border-line bg-navy px-3 py-2 text-sm text-bone focus:border-indigo focus:outline-none"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted mb-1 block">What are they trying to build?</label>
                  <textarea
                    value={editingEnquiry.goal}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, goal: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-line bg-navy px-3 py-2 text-sm text-bone focus:border-indigo focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted mb-1 block">What problem are they solving?</label>
                  <textarea
                    value={editingEnquiry.problem}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, problem: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-line bg-navy px-3 py-2 text-sm text-bone focus:border-indigo focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted mb-1 block">Additional Information</label>
                  <textarea
                    value={editingEnquiry.details || ""}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, details: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-line bg-navy px-3 py-2 text-sm text-bone focus:border-indigo focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 rounded-lg bg-indigo px-4 py-2 text-sm font-medium text-navy hover:bg-indigo-bright transition-colors disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setEditingEnquiry(null)}
                    disabled={isSaving}
                    className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-bone hover:bg-bone/5 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(selectedEnquiry.id)}
                    disabled={isDeleting || isSaving}
                    className="rounded-lg border border-red-400 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-4">
              <div>
                <p className="text-xs text-muted mb-1">Contact</p>
                <p className="text-sm text-bone">{selectedEnquiry.name}</p>
                <p className="text-xs text-muted mt-0.5">{selectedEnquiry.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted mb-1">Project Type</p>
                  <p className="text-sm text-bone">{selectedEnquiry.project_type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Timeline</p>
                  <p className="text-sm text-bone">{selectedEnquiry.timeline}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Budget</p>
                  <p className="text-sm text-bone">{selectedEnquiry.budget}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Status</p>
                  <span className={`inline-block rounded-full border px-2.5 py-1 font-mono text-[10px] ${statusColors[selectedEnquiry.status] || "border-line text-muted"}`}>
                    {selectedEnquiry.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted mb-1">What are they trying to build?</p>
                <p className="text-sm text-bone leading-relaxed">{selectedEnquiry.goal}</p>
              </div>

              <div>
                <p className="text-xs text-muted mb-1">What problem are they solving?</p>
                <p className="text-sm text-bone leading-relaxed">{selectedEnquiry.problem}</p>
              </div>

              {selectedEnquiry.details && (
                <div>
                  <p className="text-xs text-muted mb-1">Additional Information</p>
                  <p className="text-sm text-bone leading-relaxed">{selectedEnquiry.details}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-muted mb-1">Created</p>
                <p className="text-sm text-bone">
                  {new Date(selectedEnquiry.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditingEnquiry(selectedEnquiry)}
                  className="flex items-center gap-2 rounded-lg bg-indigo px-4 py-2 text-sm font-medium text-navy hover:bg-indigo-bright transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Enquiry
                </button>
                <button
                  onClick={() => handleDelete(selectedEnquiry.id)}
                  disabled={isDeleting}
                  className="flex items-center gap-2 rounded-lg border border-red-400 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
