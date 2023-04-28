import SingleForum from "../SingleForum";

export default function ForumContent({ data }) {
  return (
    <div>
      {data?.map((datum) => (
        <div className="my-4 card bg-base-300" key={datum.id}>
          <SingleForum topic={datum} />
        </div>
      ))}
    </div>
  );
}
