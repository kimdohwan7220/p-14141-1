const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const activeConnections = new Map<string, EventSource>();

export interface SseSubscription {
  unsubscribe: () => void;
}

export function subscribe(
  channel: string,
  callback: (data: string) => void,
): SseSubscription {
  const url = `${NEXT_PUBLIC_API_BASE_URL}/sse/${channel}`;
  const eventSource = new EventSource(url);

  eventSource.addEventListener("message", (event: MessageEvent) => {
    callback(event.data);
  });

  activeConnections.set(channel, eventSource);

  return {
    unsubscribe: () => {
      eventSource.close();
      activeConnections.delete(channel);
    },
  };
}
