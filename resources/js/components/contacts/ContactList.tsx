import { Link } from "@inertiajs/react";
import BadgeOnline from "@/components/chats/BadgeOnline";
import clsx from "clsx";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { BsArrowClockwise } from "react-icons/bs";
import { useContactContext } from "@/contexts/contact-context";
import { fetchContactsInPaginate } from "@/api/contacts";
import ContactListAction from "@/components/contacts/ContactListAction";

export default function ContactList() {
  const { contacts, setContacts, paginate, setPaginate } = useContactContext();
  const { ref: loadMoreRef, inView } = useInView();
  useEffect(() => {
    if (inView && loadMoreRef.length > 0) {
      if (paginate.next_page_url) {
        fetchContactsInPaginate(paginate.next_page_url).then((response) => {
          setPaginate(response.data.data);
          setContacts([...contacts, ...response.data.data.data]);
        });
      }
    }
  }, [inView, paginate]);
  if (contacts.length === 0) return;

  return (
    <div className="relative max-h-[calc(100vh_-_176px)] flex-1 overflow-y-auto sm:max-h-max sm:pb-2">
      {contacts

        .sort((a, b) => a.name.localeCompare(b.name)) // Sort by name
        .sort((a, b) =>
          a.is_online === b.is_online ? 0 : a.is_online ? -1 : 1,
        ) // Sort online users first
        .sort((a, b) => {
          const specificId = "9e27d661-7fd9-44d3-accf-04d8188b58c8"; // Replace with the actual ID you want to prioritize
          const aIsTarget = a.id === specificId;
          const bIsTarget = b.id === specificId;

          // If one of them is the target, prioritize it
          if (aIsTarget && !bIsTarget) return -1;
          if (!aIsTarget && bIsTarget) return 1;

          return 0;
        })
        .map((contact) => (
          <div
            className=" group relative flex items-center border border-secondary"
            key={contact.id}
          >
            <Link
              href={route("chats.show", contact.id)}
              as="button"
              className={clsx(
                "relative flex w-full flex-1 items-center gap-3 rounded-md p-3 text-left transition-all group-hover:bg-secondary",
                contact.is_contact_blocked && "opacity-25",
              )}
            >
              <div className="relative shrink-0">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="h-10 w-10 rounded-md border border-secondary"
                />
                {(contact.is_online ||
                  contact.id == "9e27d661-7fd9-44d3-accf-04d8188b58c8") && (
                  <BadgeOnline />
                )}
              </div>

              {/* Wrapper div to control spacing */}
              <div className="flex w-full items-center justify-between">
                {/* Contact Name */}
                <h5 className="truncate font-medium">{contact.name}</h5>

                {/* City on the right */}
                <span className="text-sm text-gray-500">
                  {contact.country && (
                    <img
                      className="inline h-5 w-7 border"
                      src={`/images/${contact.country}.png`}
                      alt="국기"
                    />
                  )}
                </span>
              </div>
            </Link>

            {/* <ContactListAction contact={contact} /> */}
          </div>
        ))}

      {paginate.next_page_url && (
        <button className="mx-auto mt-4 flex" ref={loadMoreRef}>
          <BsArrowClockwise className="animate-spin text-2xl text-secondary-foreground" />
        </button>
      )}
    </div>
  );
}
