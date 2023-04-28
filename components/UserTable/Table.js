import TableRow from "./TableRow";

export default function UserTable({ data }) {
  return (
    <div className="overflow-x-auto my-8">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Job</th>
            <th>View</th>
            <th>Change Role</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((datum) => (
            <TableRow datum={datum} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
