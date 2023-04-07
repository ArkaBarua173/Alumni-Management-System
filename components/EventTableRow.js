import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { sanitize } from "dompurify";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Modal from "./Modal";

export default function EventTableRow({ row, isSelected, onSelect }) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const { push } = useRouter();

  const closeModal = () => {
    setShowModal(false);
  };
  const handleDelete = async (id) => {
    await axios
      .delete(`/api/events/delete/${id}`)
      .then((res) => {
        console.log(res);
        queryClient.invalidateQueries(["events"]);
      })
      .catch((err) => {
        console.log(err);
      });

    setShowDeleteModal(false);
  };
  const handleClick = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };
  const handleDeleteModal = () => {
    setShowDeleteModal(true);
  };
  return (
    <>
      <tr>
        <th>
          <label>
            <input
              type="checkbox"
              className="checkbox"
              checked={isSelected}
              onChange={onSelect}
            />
          </label>
        </th>
        <td>{row.title}</td>
        <td>
          {format(parseISO(row.date, new Date()), "do LLL, yyyy hh:mm aaa")}
        </td>
        <td>
          <button
            onClick={handleClick}
            className="border-2 border-blue-700 text-blue-700 rounded px-3 py-1 hover:bg-blue-700 hover:text-white"
          >
            View
          </button>
        </td>
        <td>
          <button
            onClick={() =>
              push({
                pathname: "/admin/events/edit",
                query: {
                  id: row.id,
                  title: row.title,
                  banner: row.banner,
                  date: row.date,
                  description: row.description,
                },
              })
            }
            className="border-2 border-blue-700 text-blue-700 rounded px-3 py-1 hover:bg-blue-700 hover:text-white"
          >
            Edit
          </button>
        </td>
        <td>
          <button
            onClick={handleDeleteModal}
            className="border-2 border-red-700 text-red-700 rounded px-3 py-1 hover:bg-red-700 hover:text-white"
          >
            Delete
          </button>
        </td>
      </tr>
      {showModal && (
        <Modal>
          <h1 className="text-xl font-bold">{row.title}</h1>
          <div className="my-3">
            <span className="font-semibold pr-1">Description: </span>
            <div
              className="mt-8 no-tailwindcss-base"
              dangerouslySetInnerHTML={{ __html: sanitize(row.description) }}
            ></div>
          </div>
          <div>
            <span className="font-semibold pr-1">Schedule: </span>
            {format(parseISO(row.date, new Date()), "do LLL, yyyy hh:mm aaa")}
          </div>
          <div className="my-3">
            <span className="font-semibold pr-1">Created By: </span>
            {row.organizedBy.name}
          </div>
          <div className="flex justify-end">
            <button onClick={closeModal} className="btn btn-outline">
              Close
            </button>
          </div>
          {/* <p>{row.banner}</p> */}
        </Modal>
      )}
      {showDeleteModal && (
        <Modal>
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-bold">{row.title}</h1>
            <button
              className="w-6 h-6 rounded-full border-2 border-red-700 hover:bg-red-700 hover:text-white text-red-700 flex justify-center items-center"
              onClick={handleCloseModal}
            >
              x
            </button>
          </div>
          <p className="mb-4">Do you really want to delete this model?</p>
          <div className="flex justify-end ">
            <button
              className="border-2 border-red-700 text-red-700 rounded px-3 py-1 hover:bg-red-700 hover:text-white"
              onClick={() => handleDelete(row.id)}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
