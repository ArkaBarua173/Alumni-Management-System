import { format, parseISO } from "date-fns";

export default function ProfileContent({ data }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex w-full">
        <div className="grid h-15 w-1/2 font-semibold border p-2">User</div>
        <div className="grid h-15 w-1/2 border-r border-b border-t p-2">
          {data?.name}
        </div>
      </div>
      <div className="flex w-full">
        <div className="grid h-15 w-1/2 font-semibold border-l border-r border-b p-2">
          Username
        </div>
        <div className="grid h-15 w-1/2  border-r border-b p-2">
          {data?.profile?.username}
        </div>
      </div>
      <div className="flex w-full">
        <div className="grid h-15 w-1/2 font-semibold border-l border-r border-b p-2">
          Department
        </div>
        <div className="grid h-15 w-1/2  border-r border-b p-2">
          {data?.profile?.department}
        </div>
      </div>
      <div className="flex w-full">
        <div className="grid h-15 w-1/2 font-semibold border-l border-r border-b p-2">
          Degree
        </div>
        <div className="grid h-15 w-1/2  border-r border-b p-2">
          {data?.profile?.degree}
        </div>
      </div>
      <div className="flex w-full">
        <div className="grid h-15 w-1/2 font-semibold border-l border-r border-b p-2">
          Job Status
        </div>
        <div className="grid h-15 w-1/2  border-r border-b p-2">
          {data?.profile?.jobStatus}
        </div>
      </div>
      {data?.profile?.jobStatus === "EMPLOYED" ? (
        <>
          <div className="flex w-full">
            <div className="grid h-15 w-1/2 font-semibold  border-l border-r border-b p-2">
              Job Title
            </div>
            <div className="grid h-15 w-1/2  border-r border-b p-2">
              {data?.profile?.designation}
            </div>
          </div>
          <div className="flex w-full">
            <div className="grid h-15 w-1/2 font-semibold  border-l border-r border-b p-2">
              Job Company
            </div>
            <div className="grid h-15 w-1/2  border-r border-b p-2">
              {data?.profile?.company}
            </div>
          </div>
          <div className="flex w-full">
            <div className="grid h-15 w-1/2 font-semibold  border-l border-r border-b p-2">
              Joined
            </div>
            <div className="grid h-15 w-1/2 border-r border-b p-2">
              Since{" "}
              {format(
                parseISO(data?.profile?.joiningDate, new Date()),
                "LLL, yyyy"
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
