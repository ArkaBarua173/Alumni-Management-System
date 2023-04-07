import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { format, parseISO } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo } from "react";

export default function SingleForum({ topic }) {
  const { data: session } = useSession();
  const avatar = useMemo(() => {
    return createAvatar(initials, {
      size: 128,
      seed: session?.name,
      // ... other options
    }).toDataUriSync();
  }, []);
  return (
    <div className="card-body">
      <div className="flex gap-4">
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img
              src={topic?.user?.image || avatar}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <div>
          <h5 className="font-bold">{topic?.user?.name}</h5>
          <p>
            {format(
              parseISO(topic?.createdAt, new Date()),
              "do LLL, yyyy hh:mm aaa"
            )}
          </p>
        </div>
      </div>
      <h2 className="card-title">{topic?.title}</h2>
      <p className="line-clamp-2">{topic?.details}</p>
      <div className="flex gap-4 items-center">
        <Link
          href={`/forum/${topic?.id}`}
          className="btn btn-outline btn-xs no-animation"
        >
          Open Discussion
        </Link>
        <p className="font-bold">{topic?.comments?.length} comments</p>
      </div>
    </div>
  );
}
