import Layout from "@/components/Layout";
import Like from "@/components/LIke/LikeComponent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function TopicId() {
  const { data: session } = useSession();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      comment: "",
    },
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const [commentError, setCommonError] = useState("");
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    async (data) => await axios.post("/api/forum/addComment", data),
    {
      onError: (error) => {
        setIsDisabled(false);
        setCommonError(error?.response?.data.message);
      },
      onSuccess: (data) => {
        reset();
        queryClient.invalidateQueries(["topicData"]);
        setIsDisabled(false);
        setCommonError("");
        console.log(data);
      },
    }
  );
  const { query } = useRouter();
  const { pid } = query;
  const getTopic = async () => {
    const response = await axios.get(`/api/forum/${pid}`);
    return response.data.data;
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["topicData"],
    queryFn: getTopic,
  });

  const onSubmit = async (data) => {
    setIsDisabled(true);
    mutate({ topicId: pid, body: data.comment });
  };

  if (error) return log(error);
  if (isLoading) return "Loading";

  return (
    <>
      <Layout />
      <div className="my-8 sm:mx-auto sm:w-full sm:max-w-6xl">
        <div className="card bg-base-300 shadow-xl">
          <div className="card-body">
            <h2 className="text-4xl font-bold">{data?.title}</h2>
            <p>{data?.details}</p>
            <div className="mt-2 flex gap-3">
              <Like topicId={data?.id} />
              <p className="font-bold">{data?.comments?.length} comments</p>
            </div>
          </div>
        </div>

        <div className="mt-8 card bg-base-300 shadow-xl">
          <div className="card-body">
            <h2 className="ml-2 font-semibold">Add a Comment</h2>
            <form className="my-2" onSubmit={handleSubmit(onSubmit)}>
              <textarea
                id="comment"
                type="text"
                required
                className="w-full input input-bordered"
                {...register("comment")}
              ></textarea>
              <button type="submit" className="btn mt-3" disabled={isDisabled}>
                Add Comment
              </button>
            </form>
            {commentError ?? (
              <h2 className="ml-4 text-sm text-error">{commentError}</h2>
            )}
            {data?.comments?.map((comment) => (
              <div
                className="mt-4 p-4 bg-base-100 rounded-lg"
                key={comment?.id}
              >
                <div className="flex gap-4">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img
                        src={comment?.user?.image || "/assets/user_profile.svg"}
                      />
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold">{comment?.user?.name}</h5>
                    <p>
                      {format(
                        parseISO(comment?.createdAt, new Date()),
                        "do LLL, yyyy hh:mm aaa"
                      )}
                    </p>
                  </div>
                  {session && session?.id === comment?.user?.id && (
                    <div className="btn btn-xs text-error btn-outline">
                      Delete
                    </div>
                  )}
                </div>
                <div className="mt-2 ml-1">{comment?.body}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Comment */}
      </div>
    </>
  );
}
