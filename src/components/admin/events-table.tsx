"use client";

import { formatDistanceToNow } from "date-fns";

type AccountEvent = {
  id: string;
  user_id: string;
  event: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export function EventsTable({ events }: { events: AccountEvent[] }) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-line bg-navy-raised">
        {events.length === 0 ? (
          <p className="p-6 text-sm text-muted">No account events found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-line bg-navy">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">Event</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">User ID</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">Metadata</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted">Time</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-line last:border-b-0 hover:bg-bone/5">
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs text-indigo">{event.event}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-mono text-[10px] text-muted truncate max-w-[120px]">
                        {event.user_id}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-muted max-w-xs truncate">
                        {Object.keys(event.metadata).length > 0 
                          ? JSON.stringify(event.metadata) 
                          : "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-muted">
                        {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                      </p>
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
        {events.length === 0 ? (
          <div className="rounded-2xl border border-line bg-navy-raised p-6">
            <p className="text-sm text-muted">No account events found.</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="rounded-2xl border border-line bg-navy-raised p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="font-mono text-xs text-indigo">{event.event}</p>
                <p className="text-xs text-muted">
                  {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-muted">User ID: </span>
                  <span className="font-mono text-[10px] text-bone break-all">
                    {event.user_id}
                  </span>
                </div>
                {Object.keys(event.metadata).length > 0 && (
                  <div>
                    <span className="text-muted">Metadata: </span>
                    <span className="text-bone break-all">
                      {JSON.stringify(event.metadata)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
