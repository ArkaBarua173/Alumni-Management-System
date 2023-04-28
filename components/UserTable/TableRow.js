import { useState } from "react";
import Modal from "../Modal";
import { format, parseISO } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function TableRow({ datum }) {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    async (data) => await axios.put("/api/profile/admin/roleChange", data),
    {
      onError: (error) => {
        console.log(error);
        setErr(error?.response?.data.message);
      },
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries(["getAllUsers"]);
        setShowRoleModal(false);
      },
    }
  );

  const handleViewModal = () => {
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
  };

  const handleRoleChange = () => {
    const dataObj = { id: datum?.id };
    dataObj.role = datum?.role === "ADMIN" ? "USER" : "ADMIN";
    mutate(dataObj);
  };

  const handleDelete = async () => {
    await axios
      .delete("/api/user/delete", {
        data: datum?.id,
      })
      .then((res) => {
        console.log(res);
        queryClient.invalidateQueries(["getAllUsers"]);
        if (res.statusText === "OK") {
          setShowDeleteModal(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <tr className="hover">
        <td>{datum?.name}</td>
        <td>{datum?.email}</td>
        <td>{datum?.role}</td>
        <td>{datum?.profile?.designation}</td>
        <td>
          <button className="btn no-animation" onClick={handleViewModal}>
            View
          </button>
        </td>
        <td>
          <button
            className="btn no-animation"
            onClick={() => setShowRoleModal(true)}
          >
            Change Role
          </button>
        </td>
        <td>
          <button
            className="btn no-animation btn-error"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
        </td>
      </tr>

      {showViewModal && (
        <Modal>
          <h1 className="text-xl font-bold mb-4">{datum?.name}</h1>
          <h1 className="font-semibold mb-4">
            <span>Status: </span>
            {datum?.role}
          </h1>
          <p className="">{datum?.email}</p>
          <p className="">{datum?.profile?.department}</p>
          <p className="">{datum?.profile?.degree}</p>
          {datum?.profile?.jobStatus === "EMPLOYED" && (
            <div>
              <p className="mt-4">{datum?.profile?.designation}</p>
              <p className="">{datum?.profile?.company}</p>
              <p className="">
                since{" "}
                {format(
                  parseISO(datum?.profile?.joiningDate, new Date()),
                  "LLL, yyyy"
                )}
              </p>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <button onClick={closeViewModal} className="btn btn-outline">
              Close
            </button>
          </div>
        </Modal>
      )}
      {showRoleModal && (
        <Modal>
          <div className="flex justify-between">
            <h1 className="text-xl font-bold mb-4">{datum?.name}</h1>
            <button
              className="w-6 h-6 rounded-full border-2 border-red-700 hover:bg-red-700 hover:text-white text-red-700 flex justify-center items-center"
              onClick={() => setShowRoleModal(false)}
            >
              x
            </button>
          </div>
          {datum?.event?.length !== 0 ? (
            <>
              <p>
                You cannot change the role of admin that created several events.
              </p>
              <div className="flex justify-end mt-4">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowRoleModal(false)}
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <>
              <p>
                Do you really want change role of {datum?.name} to{" "}
                {datum?.role === "ADMIN" ? "USER" : "ADMIN"}
              </p>
              <div className="flex justify-end mt-4">
                <button className="btn btn-outline" onClick={handleRoleChange}>
                  Change
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
      {showDeleteModal && (
        <Modal>
          <div className="flex justify-between">
            <h1 className="text-xl font-bold mb-4">{datum?.name}</h1>
            <button
              className="w-6 h-6 rounded-full border-2 border-red-700 hover:bg-red-700 hover:text-white text-red-700 flex justify-center items-center"
              onClick={() => setShowDeleteModal(false)}
            >
              x
            </button>
          </div>
          {datum?.role === "ADMIN" ? (
            <>
              <p>You cannot delete admin.</p>
              <div className="flex justify-end mt-4">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <>
              <p>Do you really want delete user {datum?.name}?</p>
              <div className="flex justify-end mt-4">
                <button className="btn btn-outline" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
