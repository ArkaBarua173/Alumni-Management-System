import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import Loading from "../Loading";

const getTopicLikes = async (topicId) => {
  const response = await axios.get(
    `http://localhost:3000/api/forum/like/${topicId}`
  );
  return response.data.data;
};

export default function Like({ topicId }) {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery({
    queryKey: ["getTopicLikes", topicId],
    queryFn: () => getTopicLikes(topicId),
  });
  const { mutate } = useMutation(
    async (data) => await axios.post("/api/forum/like/likeTopic", data),
    {
      onError: (error) => {
        console.log(error);
        setErr(error?.response?.data.message);
      },
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries(["getTopicLikes"]);
      },
    }
  );
  if (data) {
    const found = data[0]?.likes.some(
      (like) => like.likedByUserId === session?.id
    );
    console.log(found);
  }
  if (error) return error;
  if (isLoading) return <Loading />;

  const handleLike = () => {
    const data = { topicId };
    mutate(data);
  };
  return (
    <div className="flex gap-3">
      {data &&
      data[0]?.likes.some((like) => like.likedByUserId === session?.id) ? (
        <div>
          <span>
            {status === "authenticated" && (
              <AiFillLike
                size={20}
                onClick={handleLike}
                className="cursor-pointer"
              />
            )}
          </span>
        </div>
      ) : (
        <div>
          <span>
            {status === "authenticated" && (
              <AiOutlineLike
                size={20}
                onClick={handleLike}
                className="cursor-pointer"
              />
            )}
          </span>
        </div>
      )}

      {data && data[0]?.likes?.length === 1 ? (
        <p className="font-bold">{data[0]?.likes?.length} like</p>
      ) : (
        <p className="font-bold">{data[0]?.likes?.length} likes</p>
      )}
    </div>
  );
}
