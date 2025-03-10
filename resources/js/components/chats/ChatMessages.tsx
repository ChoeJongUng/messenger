import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import DeleteMessage from "@/components/chats/DeleteMessage";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import { CHAT_TYPE } from "@/types/chat";
import { useAppContext } from "@/contexts/app-context";
import { isImageLinkValid } from "@/utils";
import ChatMessageAttachment from "@/components/chats/ChatMessageAttachment";
import clsx from "clsx";
import { usePremium } from "@/hooks/use-premium";
import Modal from "@/components/Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { Link } from "@inertiajs/react";
export default function ChatMessages() {
  const { auth } = useAppContext();
  const { messages, paginate, user } = useChatMessageContext();
  const { currentPremium, remainedDays } = usePremium();
  const sortedAndFilteredMessages = messages
    .sort((a, b) => a.sort_id - b.sort_id)
    .filter((message, index) => {
      // if (message.chat_type === CHAT_TYPE.GROUP_CHATS && index === 0) {
      //   return false;
      // }

      return true;
    })
    .filter((message) => message.body || message.attachments?.length > 0);

  const closeModal = () => {
    setConfirmingUserDeletion(false);
  };

  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const [hasFetchedPremium, setHasFetchedPremium] = useState(false);

  useEffect(() => {
    if (!hasFetchedPremium && currentPremium !== undefined) {
      setHasFetchedPremium(true);
    }

    if (hasFetchedPremium) {
      setConfirmingUserDeletion(!currentPremium);
    }
  }, [currentPremium, hasFetchedPremium]);
  return (
    <div className="relative flex flex-1 flex-col gap-[3px] overflow-x-hidden">
      {sortedAndFilteredMessages.map((message, index) => {
        const isFirstMessage = index === 0;
        const date = moment(message.created_at);
        const prevDate = sortedAndFilteredMessages[index - 1]?.created_at;
        const isDifferentDate = !date.isSame(prevDate, "date");

        const messageWithImages = message.attachments.filter((attachment) =>
          isImageLinkValid(attachment.original_name),
        );
        const messageWithFiles = message.attachments.filter(
          (attachment) => !isImageLinkValid(attachment.original_name),
        );

        const showProfile =
          (message.chat_type === CHAT_TYPE.GROUP_CHATS &&
            messages[index]?.from_id !== message.from_id) ||
          (message.chat_type === CHAT_TYPE.GROUP_CHATS && index === 0);

        return (
          <Fragment key={`message-${message.id}`}>
            {(isFirstMessage || isDifferentDate) && (
              <p className="p-4 text-center text-xs text-secondary-foreground sm:text-sm">
                {date.format("DD MMMM YYYY")}
              </p>
            )}

            {(message.from_id === user.id && message.from_id !== auth.id) ||
            (message.chat_type === CHAT_TYPE.GROUP_CHATS &&
              message.from_id !== auth.id) ? (
              <div className="flex flex-row justify-start">
                <div className="text-sm text-foreground">
                  {message.body && (
                    <div className="group relative my-1 flex items-center gap-2">
                      <div className="flex">
                        {true && (
                          <div className=" flex items-center gap-2">
                            <img
                              src={message.from.avatar}
                              alt={message.from.name}
                              className="h-7 w-7 rounded-md border border-secondary"
                            />
                          </div>
                        )}

                        <div
                          className="relative flex max-w-xs flex-wrap items-end gap-2 rounded-sm bg-[#07c160] py-1 pl-2 pr-4 text-sm lg:max-w-md"
                          style={{
                            filter: currentPremium ? "none" : "blur(5px)",
                          }}
                        >
                          <p
                            dangerouslySetInnerHTML={{
                              __html:
                                currentPremium == true
                                  ? message.body
                                  : "&nbsp;",
                            }}
                            className="my-auto min-w-[30vw] max-w-[70vw] overflow-auto break-words text-[black]"
                          />
                          <span className="-mt-4 ml-auto text-xs text-white">
                            {date.format("H:mm")}
                          </span>
                        </div>
                      </div>

                      <DeleteMessage message={message} />
                    </div>
                  )}

                  {message.body && message.attachments?.length > 0 && (
                    <div className="my-[3px]"></div>
                  )}

                  <ChatMessageAttachment
                    message={message}
                    messageWithImages={messageWithImages}
                    messageWithFiles={messageWithFiles}
                    dir="ltr"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-row justify-end">
                <div className="text-sm text-white">
                  {message.body && (
                    <div className="group relative my-1 flex items-center gap-2">
                      <div className="flex items-start">
                        <DeleteMessage message={message} />

                        <div
                          className={clsx(
                            "relative flex max-w-xs flex-wrap items-end gap-2 rounded-sm py-1 pl-4 pr-2 lg:max-w-md",
                            !user.message_color && "bg-[#07c160]",
                          )}
                          style={{
                            background: user.message_color
                              ? user.message_color
                              : "",
                            filter: currentPremium ? "none" : "blur(5px)",
                          }}
                        >
                          <p
                            dangerouslySetInnerHTML={{
                              __html:
                                currentPremium == true
                                  ? message.body
                                  : "&nbsp;",
                            }}
                            className="my-auto min-w-[30vw] max-w-[70vw] overflow-auto break-words text-[black]"
                          />
                          <span className="-mt-4 ml-auto text-xs">
                            {date.format("H:mm")}
                          </span>
                        </div>
                      </div>
                      <div className=" flex items-end gap-2">
                        <img
                          src={auth.avatar}
                          alt={auth.name}
                          className="h-7 w-7 rounded-md border border-secondary"
                        />
                      </div>
                    </div>
                  )}

                  {message.body && message.attachments?.length > 0 && (
                    <div className="my-[3px]"></div>
                  )}

                  <ChatMessageAttachment
                    message={message}
                    messageWithImages={messageWithImages}
                    messageWithFiles={messageWithFiles}
                    dir="rtl"
                    className="order-2 justify-end"
                    gridClassName="ml-auto"
                    deleteMessageClassName="order-1 flex-row-reverse"
                  />
                </div>
              </div>
            )}
          </Fragment>
        );
      })}
      <Modal show={confirmingUserDeletion} onClose={closeModal}>
        <div className="p-6">
          <header>
            <h2 className="text-lg font-medium text-foreground">
              정식회원으로 등록하시겠습니까?
            </h2>

            <p className="mt-1 text-sm text-secondary-foreground">
              고객님은 현재 임시회원입니다.
              <br />
              임시회원은 메시지전송, 메시지수신이 불가합니다. 정식회원으로
              등록하여 많은 파트너들을 만나보세요.
            </p>
          </header>

          <div className="mt-6 flex justify-end">
            <SecondaryButton onClick={closeModal}>취소</SecondaryButton>
            <div>
              <Link href={route("profile.premium")}>
                <PrimaryButton className="ms-3 bg-[#07c160]">
                  정식회원 등록
                </PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
