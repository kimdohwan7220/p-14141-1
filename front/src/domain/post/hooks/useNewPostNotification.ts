"use client";

import { useEffect, useRef, useState } from "react";

import { useAuthContext } from "@/global/auth/hooks/useAuth";
import { subscribe } from "@/global/sse/sseClient";

export interface PostNotification {
  id: number;
  title: string;
  authorId: number;
  authorName: string;
  authorProfileImgUrl: string;
  createdAt: string;
}

export function useNewPostNotification(
  onNewPost?: (post: PostNotification) => void,
) {
  const [latestPost, setLatestPost] = useState<PostNotification | null>(null);
  const { loginMember } = useAuthContext();
  const callbackRef = useRef(onNewPost);
  const loginMemberRef = useRef(loginMember);

  useEffect(() => {
    callbackRef.current = onNewPost;
  }, [onNewPost]);

  useEffect(() => {
    loginMemberRef.current = loginMember;
  }, [loginMember]);

  useEffect(() => {
    const subscription = subscribe("posts-new", (data) => {
      const post: PostNotification = JSON.parse(data);

      // 작성자 본인이면 무시
      if (loginMemberRef.current?.id === post.authorId) return;

      setLatestPost(post);
      callbackRef.current?.(post);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { latestPost };
}
