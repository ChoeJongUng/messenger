import { Chat } from "@/types/chat";
import { Link } from "@inertiajs/react";
import BadgeOnline from "@/components/chats/BadgeOnline";
import clsx from "clsx";
import { relativeTime } from "@/utils";
import { useChatContext } from "@/contexts/chat-context";
import BadgeChatNotification from "@/components/chats/BadgeChatNotification";
import { fetchChatsInPaginate, markAsRead } from "@/api/chats";
import ChatListAction from "@/components/chats/ChatListAction";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { BsArrowClockwise } from "react-icons/bs";
import { useAppContext } from "@/contexts/app-context";
import { CHAT_TYPE } from "@/types/chat";
type ChatListProps = {
  search: string;
  href: string;
  className?: string;
};

export default function ChatList({ search, href, className }: ChatListProps) {
  const { syncNotification, syncNotificationGroup } = useAppContext();
  const { chats, setChats, paginate, setPaginate } = useChatContext();
  const { ref: loadMoreRef, inView } = useInView();
  useEffect(() => {
    if (inView && loadMoreRef.length > 0) {
      if (paginate.next_page_url) {
        fetchChatsInPaginate(paginate.next_page_url).then((response) => {
          setPaginate(response.data.data);
          setChats([...chats, ...response.data.data.data]);
        });
      }
    }
  }, [inView, paginate]);

  const handleMarkAsRead = (chat: Chat) => {
    if (!chat.is_read) {
      markAsRead(chat).then(syncNotification);
      markAsRead(chat).then(syncNotificationGroup);
    }
  };
  if (chats.length === 0) return;

  return (
    <div
      className={clsx(
        "relative max-h-[calc(100vh_-_176px)] flex-1 overflow-y-auto px-2 sm:max-h-max sm:pb-2",
        className,
      )}
    >
      {chats
        .sort((a, b) => {
          // Check if a or b has the specific from_id
          const specificId = "9e27d661-7fd9-44d3-accf-04d8188b58c8"; // Replace with the actual ID you want to prioritize
          const aIsTarget = a.from_id === specificId;
          const bIsTarget = b.from_id === specificId;

          // If one of them is the target, prioritize it
          if (aIsTarget && !bIsTarget) return -1;
          if (!aIsTarget && bIsTarget) return 1;

          // If search is empty, sort by created_at descending
          if (search.length === 0)
            return b.created_at?.localeCompare(a.created_at);

          // Otherwise, sort by name
          return a.name.localeCompare(b.name);
        })
        .map((chat) => {
          if (route().current("business.*") == true) {
            return (
              chat.chat_type == CHAT_TYPE.GROUP_CHATS && (
                <div className="group relative flex items-center" key={chat.id}>
                  <Link
                    href={route(href, chat.id)}
                    as="button"
                    onClick={() => handleMarkAsRead(chat)}
                    className={clsx(
                      "relative flex w-full flex-1 items-center gap-3 rounded-md p-3 text-left transition-all group-hover:bg-secondary",
                      route().current(href, chat.id) && "bg-secondary",
                      chat.is_contact_blocked && "opacity-25",
                    )}
                  >
                    {search.length === 0 && chat.created_at ? (
                      <>
                        <div className="relative shrink-0">
                          <img
                            src={chat.avatar}
                            alt={chat.name}
                            className="h-12 w-12 rounded-md border border-secondary"
                          />
                          {chat.is_online && <BadgeOnline />}
                        </div>

                        <div className="overflow-hidden">
                          <h5 className="truncate font-medium">{chat.name}</h5>
                          <div className="flex items-center text-sm text-secondary-foreground">
                            <p
                              className={clsx(
                                "truncate",
                                !chat.is_read && "font-medium text-foreground",
                                route().current(href, chat.id) &&
                                  "!text-foreground",
                              )}
                              dangerouslySetInnerHTML={{
                                __html: chat.description,
                              }}
                            />
                            <span className="mx-1">.</span>
                            <span className="shrink-0">
                              {relativeTime(chat.created_at)}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative shrink-0">
                          <img
                            src={chat.avatar}
                            alt={chat.name}
                            className="h-10 w-10 rounded-md border border-secondary"
                          />
                          {chat.is_online && <BadgeOnline />}
                        </div>

                        <div className="overflow-hidden">
                          <h5 className="truncate font-medium">{chat.name}</h5>
                        </div>
                      </>
                    )}
                  </Link>

                  {/* {chat.body && <ChatListAction chat={chat} />} */}
                  {!chat.is_read && chat.chat_type == CHAT_TYPE.GROUP_CHATS && (
                    <BadgeChatNotification />
                  )}
                </div>
              )
            );
          } else {
            return (
              chat.chat_type != CHAT_TYPE.GROUP_CHATS && (
                <div className="group relative flex items-center" key={chat.id}>
                  <Link
                    href={route(href, chat.id)}
                    as="button"
                    onClick={() => handleMarkAsRead(chat)}
                    className={clsx(
                      "relative flex w-full flex-1 items-center gap-3 rounded-md p-3 text-left transition-all group-hover:bg-secondary",
                      route().current(href, chat.id) && "bg-secondary",
                      chat.is_contact_blocked && "opacity-25",
                    )}
                  >
                    {search.length === 0 && chat.created_at ? (
                      <>
                        <div className="relative shrink-0">
                          <img
                            src={chat.avatar}
                            alt={chat.name}
                            className="h-12 w-12 rounded-md border border-secondary"
                          />
                          {chat.is_online && <BadgeOnline />}
                        </div>

                        <div className="overflow-hidden">
                          <h5 className="truncate font-medium">{chat.name}</h5>
                          <div className="flex items-center text-sm text-secondary-foreground">
                            <p
                              className={clsx(
                                "truncate",
                                !chat.is_read && "font-medium text-foreground",
                                route().current(href, chat.id) &&
                                  "!text-foreground",
                              )}
                              dangerouslySetInnerHTML={{ __html: chat.body }}
                            />
                            <span className="mx-1">.</span>
                            <span className="shrink-0">
                              {relativeTime(chat.created_at)}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative shrink-0">
                          <img
                            src={chat.avatar}
                            alt={chat.name}
                            className="h-10 w-10 rounded-md border border-secondary"
                          />
                          {chat.is_online && <BadgeOnline />}
                        </div>

                        <div className="overflow-hidden">
                          <h5 className="truncate font-medium">{chat.name}</h5>
                        </div>
                      </>
                    )}
                  </Link>

                  {chat.body && <ChatListAction chat={chat} />}
                  {!chat.is_read && chat.chat_type == CHAT_TYPE.CHATS && (
                    <BadgeChatNotification />
                  )}
                </div>
              )
            );
          }
        })}

      {paginate.next_page_url && (
        <button className="mx-auto mt-4 flex" ref={loadMoreRef}>
          <BsArrowClockwise className="animate-spin text-2xl text-secondary-foreground" />
        </button>
      )}
    </div>
  );
}
