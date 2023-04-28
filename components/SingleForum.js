import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { format, parseISO } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import Like from "./LIke/LikeComponent";
import Modal from "./Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { data } from "autoprefixer";
import { useRouter } from "next/router";

export default function SingleForum({ topic, profile, admin }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const avatar = useMemo(() => {
    return createAvatar(initials, {
      size: 128,
      seed: session?.name,
    }).toDataUriSync();
  }, []);

  const { mutate } = useMutation(
    async (data) => await axios.delete("/api/forum/userForumDelete", { data }),
    {
      onError: (error) => {
        console.log(error);
        setErr(error?.response?.data.message);
      },
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries(["topics"]);
        queryClient.invalidateQueries(["getUserTopics"]);
      },
    }
  );

  const handleDeleteModel = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = (id) => {
    mutate(id);
  };

  return (
    <div className="card-body">
      <div className="flex gap-4 justify-between">
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
            <Link href={`/user/${topic?.user?.id}`} className="font-bold">
              {topic?.user?.name}
            </Link>
            <p>
              {format(
                parseISO(topic?.createdAt, new Date()),
                "do LLL, yyyy hh:mm aaa"
              )}
            </p>
          </div>
        </div>
        {profile && (
          <div className="flex gap-4">
            <button
              className="btn btn-outline  no-animation"
              onClick={() =>
                push({
                  pathname: "/forum/edit",
                  query: {
                    id: topic?.id,
                    title: topic?.title,
                    details: topic?.details,
                  },
                })
              }
            >
              Edit
            </button>
            <button
              className="btn btn-outline btn-error no-animation"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </button>
          </div>
        )}
        {admin && (
          <button
            className="btn btn-outline btn-error no-animation"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
        )}
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
        <Like topicId={topic?.id} />
        <p className="font-bold">{topic?.comments?.length} comments</p>
      </div>
      {showDeleteModal && (
        <Modal>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold capitalize">Delete Discussion</h2>
            <button
              className="w-6 h-6 rounded-full border-2 border-red-700 hover:bg-red-700 hover:text-white text-red-700 flex justify-center items-center"
              onClick={handleDeleteModel}
            >
              x
            </button>
          </div>
          <p className="my-4">Do you really want to delete the discussion?</p>
          <div className="flex justify-end">
            <button
              onClick={() => handleDelete(topic?.id)}
              // disabled={isDeleteAllModalDisabled}
              className="border-2 border-red-700 text-red-700 rounded px-3 py-1 hover:bg-red-700 hover:text-white"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
