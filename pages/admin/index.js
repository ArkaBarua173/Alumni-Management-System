import AdminDashboard from "@/components/AdminDashboard";
export default function Dashboard() {
  return (
    <AdminDashboard>
      <div className="my-10 mx-8">
        <h1 className="my-8 text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-6 ">
          <div className="card w-80 bg-orange-600 text-base-content">
            <div className="card-body">
              <h2 className="card-title">Upcoming Events</h2>
              <p>5 Upcoming events</p>
              <div className="card-actions justify-end">
                <button className="btn btn-outline text-white">Explore</button>
              </div>
            </div>
          </div>
          <div className="card w-80 bg-yellow-600 text-base-content">
            <div className="card-body">
              <h2 className="card-title">Events</h2>
              <p>5 Events</p>
              <div className="card-actions justify-end">
                <button className="btn btn-outline text-white">Explore</button>
              </div>
            </div>
          </div>
          <div className="card w-80 bg-blue-600 text-base-content">
            <div className="card-body">
              <h2 className="card-title">Discussions</h2>
              <p>5 Discussions</p>
              <div className="card-actions justify-end">
                <button className="btn btn-outline text-white">Explore</button>
              </div>
            </div>
          </div>
          <div className="card w-80 bg-emerald-600 text-base-content">
            <div className="card-body">
              <h2 className="card-title">Gallery</h2>
              <p>10 photos</p>
              <div className="card-actions justify-end">
                <button className="btn btn-outline text-white">Explore</button>
              </div>
            </div>
          </div>
          <div className="card w-80 bg-rose-600 text-base-content">
            <div className="card-body">
              <h2 className="card-title">Alumni</h2>
              <p>6 Alumni</p>
              <div className="card-actions justify-end">
                <button className="btn btn-outline text-white">Explore</button>
              </div>
            </div>
          </div>
          <div className="card w-80 bg-teal-600 text-base-content">
            <div className="card-body">
              <h2 className="card-title">Guest Users</h2>
              <p>3 Guest users</p>
              <div className="card-actions justify-end">
                <button className="btn btn-outline text-white">Explore</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboard>
  );
}
