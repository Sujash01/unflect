"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Ban, CheckCircle, X } from "lucide-react";

type Profile = {
  id: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export function ProfilesTable({ profiles }: { profiles: Profile[] }) {
  const router = useRouter();
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);

  const handleSave = async () => {
    if (!editingProfile) return;

    setIsSaving(true);
    try {
      const { id, created_at: _created_at, updated_at: _updated_at, ...updates } = editingProfile;
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });

      if (response.ok) {
        router.refresh();
        setEditingProfile(null);
      } else {
        alert("Failed to update profile");
      }
    } catch {
      alert("Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user account? This will permanently delete all user data including profile and account events. This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete user");
      }
    } catch {
      alert("Error deleting user");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBlock = async (id: string, currentlyBlocked: boolean) => {
    const action = currentlyBlocked ? "unblock" : "block";
    if (!confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    setIsBlocking(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert(`Failed to ${action} user`);
      }
    } catch {
      alert(`Error ${action}ing user`);
    } finally {
      setIsBlocking(false);
    }
  };
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-line bg-navy-raised">
        {profiles.length === 0 ? (
          <p className="p-6 text-sm text-muted">No user profiles found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-line bg-navy">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">Display Name</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">Bio</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">Avatar</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">Created</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => {
                  const isBlocked = profile.settings?.blocked === true;
                  return (
                    <tr key={profile.id} className="border-b border-line last:border-b-0 hover:bg-bone/5">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-bone">
                          {profile.display_name || "—"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-muted max-w-xs truncate">
                          {profile.bio || "—"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        {profile.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={profile.avatar_url} 
                            alt={profile.display_name}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-bone/10 flex items-center justify-center">
                            <span className="text-xs text-muted">—</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {isBlocked ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-red-400 px-2.5 py-1 font-mono text-[10px] text-red-400">
                            <Ban className="h-3 w-3" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-green-400 px-2.5 py-1 font-mono text-[10px] text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-muted">
                          {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingProfile(profile)}
                            className="text-xs text-indigo hover:text-indigo-bright transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleBlock(profile.id, isBlocked)}
                            disabled={isBlocking}
                            className="text-xs text-orange-400 hover:text-orange-300 transition-colors disabled:opacity-50"
                          >
                            {isBlocked ? "Unblock" : "Block"}
                          </button>
                          <button
                            onClick={() => handleDelete(profile.id)}
                            disabled={isDeleting}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {profiles.length === 0 ? (
          <div className="rounded-2xl border border-line bg-navy-raised p-6">
            <p className="text-sm text-muted">No user profiles found.</p>
          </div>
        ) : (
          profiles.map((profile) => {
            const isBlocked = profile.settings?.blocked === true;
            return (
              <div key={profile.id} className="rounded-2xl border border-line bg-navy-raised p-4">
                <div className="flex items-start gap-3 mb-3">
                  {profile.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.display_name}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-bone/10 flex items-center justify-center shrink-0">
                      <span className="text-xs text-muted">—</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-bone">
                      {profile.display_name || "—"}
                    </p>
                    {profile.bio && (
                      <p className="text-xs text-muted mt-1 line-clamp-2">
                        {profile.bio}
                      </p>
                    )}
                  </div>
                  {isBlocked ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-red-400 px-2.5 py-1 font-mono text-[10px] text-red-400">
                      <Ban className="h-3 w-3" />
                      Blocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-green-400 px-2.5 py-1 font-mono text-[10px] text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </span>
                  )}
                </div>

                <div className="text-xs text-muted mb-3">
                  Created {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                </div>

                <div className="flex gap-2 pt-3 border-t border-line">
                  <button
                    onClick={() => setEditingProfile(profile)}
                    className="flex-1 rounded-lg bg-indigo/10 border border-indigo px-3 py-2 text-xs font-medium text-indigo hover:bg-indigo/20 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleBlock(profile.id, isBlocked)}
                    disabled={isBlocking}
                    className="flex-1 rounded-lg bg-orange-400/10 border border-orange-400 px-3 py-2 text-xs font-medium text-orange-400 hover:bg-orange-400/20 transition-colors disabled:opacity-50"
                  >
                    {isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => handleDelete(profile.id)}
                    disabled={isDeleting}
                    className="flex-1 rounded-lg bg-red-400/10 border border-red-400 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-400/20 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Modal */}
      {editingProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm p-4"
          onClick={() => setEditingProfile(null)}
        >
          <div
            className="max-w-lg w-full rounded-2xl border border-line bg-navy-raised p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <h3 className="font-display text-xl text-bone">Edit Profile</h3>
              <button
                onClick={() => setEditingProfile(null)}
                className="text-muted hover:text-bone transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted mb-1 block">Display Name</label>
                <input
                  type="text"
                  value={editingProfile.display_name}
                  onChange={(e) => setEditingProfile({ ...editingProfile, display_name: e.target.value })}
                  className="w-full rounded-lg border border-line bg-navy px-3 py-2 text-sm text-bone focus:border-indigo focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-muted mb-1 block">Bio</label>
                <textarea
                  value={editingProfile.bio}
                  onChange={(e) => setEditingProfile({ ...editingProfile, bio: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-line bg-navy px-3 py-2 text-sm text-bone focus:border-indigo focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-muted mb-1 block">Avatar URL</label>
                <input
                  type="text"
                  value={editingProfile.avatar_url}
                  onChange={(e) => setEditingProfile({ ...editingProfile, avatar_url: e.target.value })}
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
                  onClick={() => setEditingProfile(null)}
                  disabled={isSaving}
                  className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-bone hover:bg-bone/5 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
