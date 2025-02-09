import { fetchChats } from "@/api/chats";
import { useChatContext } from "@/contexts/chat-context";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";

type ChatListSearchProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function ChatListSearch({
  search,
  setSearch,
}: ChatListSearchProps) {
  const { setChats, setPaginate } = useChatContext();
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    setIsFirstLoading(false);

    if (!isFirstLoading) {
      fetchChats(debouncedSearch).then((response) => {
        setChats(response.data.data.data);
        setPaginate(response.data.data);
      });
    }
  }, [debouncedSearch]);

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="relative flex items-center px-2 py-0">
      <span className="absolute left-5">
        <BiSearch className="text-2xl text-secondary-foreground" />
      </span>
      <input
        type="text"
        placeholder={
          route().current("business.*") == true
            ? "거래제안 검색"
            : "대화상대 검색"
        }
        className="w-full rounded-md border-secondary bg-background pl-10 focus:border-secondary focus:ring-transparent"
        value={search}
        onChange={handleOnChange}
      />
    </div>
  );
}
