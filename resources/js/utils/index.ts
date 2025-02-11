import { Attachment, Link } from "@/types/chat-message";
import moment from "moment";

export const relativeTime = (time: string) => {
  time = moment(time).startOf("second").fromNow();

  return time
    .replace(
      /(\d+)\s*(minute?|hour?|day?|week?|month?|year?)s?/,
      (match, p1, p2) => {
        switch (p2) {
          case "minute":
            return p1 + "분";
          case "hour":
            return p1 + "시간";
          case "day":
            return p1 + "일";
          case "week":
            return p1 + "주";
          case "month":
            return p1 + "달";
          case "year":
            return p1 + "년";
          default:
            return match;
        }
      },
    )
    .replace(" ago", "전")
    .replace("a few seconds", "방금")
    .replace("a day", "하루")
    .replace("an hour", "한시간")
    .replace("a week", "한주")
    .replace("a month", "한달")
    .replace("in", "")
    .replace("an year", "일년");
};

export const isImageLinkValid = (name: string | null): boolean => {
  if (!name) return false;

  const validExtensions = ["jpg", "jpeg", "png", "gif", "svg", "bmp", "webp"];
  const extension = name.split(".").pop()?.toLowerCase() ?? "";

  return validExtensions.includes(extension);
};

export const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return size.toFixed(2) + " B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + " KB";
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
};

export const existingMedia = (attachments: Attachment[]) => {
  return attachments.some((media) => isImageLinkValid(media.original_name));
};

export const existingFiles = (attachments: Attachment[]) => {
  return attachments.some((media) => !isImageLinkValid(media.original_name));
};

export const existingLinks = (links: Link[]) => {
  return links && links.length > 0;
};

export const replaceBadgeNotificationCount = (notification: number) => {
  const title = document.title;
  const pattern = /\(\d+\)/;

  if (pattern.test(title)) {
    let newTitle = title.replace(pattern, `(${notification})`);
    if (notification === 0) {
      newTitle = newTitle.replace("(0) ", "");
    }

    document.title = newTitle;
  } else if (notification > 0) {
    const newTitle = `(${notification}) ${title}`;

    document.title = newTitle;
  }
};
