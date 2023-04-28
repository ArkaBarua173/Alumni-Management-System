import SingleForum from "./SingleForum";

export default function AdminForum({ data }) {
  return (
    <div>
      {data?.map((datum) => (
        <div className="my-4 card bg-base-300" key={datum.id}>
          <SingleForum topic={datum} admin={true} />
        </div>
      ))}
    </div>
  );
}
