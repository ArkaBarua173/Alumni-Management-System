import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import EventTableRow from "./EventTableRow";
import Modal from "./Modal";

export default function EventsTable({ name, data }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [showSelectedDeleteModal, setShowSelectedDeleteModal] = useState(false);
  const [isSelectedModalDisabled, setIsSelectedModalDisabled] = useState(false);
  const [isDeleteAllModalDisabled, setIsDeleteAllModalDisabled] =
    useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const queryClient = useQueryClient();

  const selectedRowsId = selectedRows?.map((selectedRow) => selectedRow.id);
  const selectAllRowsId = data?.map((datum) => datum.id);

  const handleSelectedDelete = async () => {
    setIsSelectedModalDisabled(true);
    await axios
      .delete("/api/events/delete/deleteSelected", {
        data: { selectedEvents: selectedRowsId },
      })
      .then((res) => {
        console.log(res);
        queryClient.invalidateQueries(["events"]);
        if (res.statusText === "OK") {
          setSelectedRows([]);
          setShowSelectedDeleteModal(false);
          setIsSelectedModalDisabled(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDeleteAll = async () => {
    setIsDeleteAllModalDisabled(true);
    await axios
      .delete("/api/events/delete/deleteSelected", {
        data: { selectedEvents: selectAllRowsId },
      })
      .then((res) => {
        console.log(res);
        queryClient.invalidateQueries(["events"]);
        if (res.statusText === "OK") {
          setSelectedRows([]);
          setShowDeleteAllModal(false);
          setIsDeleteAllModalDisabled(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSelectedDeleteModal = () => {
    if (selectedRows.length != 0) {
      setShowSelectedDeleteModal(true);
    }
  };
  const handleDeleteAllModal = () => {
    if (data?.length != 0) {
      setShowDeleteAllModal(true);
    }
  };
  const handleCloseSeletedModel = () => {
    setShowSelectedDeleteModal(false);
  };
  const handleCloseDeleteAllModel = () => {
    setShowDeleteAllModal(false);
  };
  return (
    <>
      <div className="flex justify-between my-10">
        <h1 className="text-2xl font-bold capitalize">{name}</h1>
        <div>
          <button
            onClick={handleSelectedDeleteModal}
            className="border-2 border-red-700 text-red-700 rounded px-3 py-1 hover:bg-red-700 hover:text-white mr-6"
          >
            Delete Selected
          </button>
          <button
            onClick={handleDeleteAllModal}
            className="border-2 border-red-700 text-red-700 rounded px-3 py-1 hover:bg-red-700 hover:text-white"
          >
            Delete All
          </button>
        </div>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Title</th>
              <th>Date</th>
              <th>View</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data?.map((row) => (
                <EventTableRow
                  key={row.id}
                  row={row}
                  isSelected={selectedRows.includes(row)}
                  onSelect={() => {
                    if (selectedRows.includes(row)) {
                      setSelectedRows(
                        selectedRows.filter(
                          (selectedRow) => selectedRow.id !== row.id
                        )
                      );
                    } else {
                      setSelectedRows([...selectedRows, row]);
                    }
                  }}
                />
              ))}
          </tbody>
        </table>
      </div>
      {showSelectedDeleteModal && (
        <Modal>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">
              {selectedRows.length} events selected
            </h2>
            <button
              className="w-6 h-6 rounded-full border-2 border-red-700 hover:bg-red-700 hover:text-white text-red-700 flex justify-center items-center"
              onClick={handleCloseSeletedModel}
            >
              x
            </button>
          </div>
          {selectedRows?.map((selectedRow) => (
            <p className="font-semibold" key={selectedRow.id}>
              {selectedRow.title}
            </p>
          ))}
          <p className="my-4">Do you really want to delete these events?</p>
          <div className="flex justify-end">
            <button
              onClick={handleSelectedDelete}
              disabled={isSelectedModalDisabled}
              className="border-2 border-red-700 text-red-700 rounded px-3 py-1 hover:bg-red-700 hover:text-white"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
      {showDeleteAllModal && (
        <Modal>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold capitalize">Delete All {name}</h2>
            <button
              className="w-6 h-6 rounded-full border-2 border-red-700 hover:bg-red-700 hover:text-white text-red-700 flex justify-center items-center"
              onClick={handleCloseDeleteAllModel}
            >
              x
            </button>
          </div>
          <p className="my-4">Do you really want to delete all {name}?</p>
          <div className="flex justify-end">
            <button
              onClick={handleDeleteAll}
              disabled={isDeleteAllModalDisabled}
              className="border-2 border-red-700 text-red-700 rounded px-3 py-1 hover:bg-red-700 hover:text-white"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
