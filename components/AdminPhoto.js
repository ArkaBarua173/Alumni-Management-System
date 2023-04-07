import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import Modal from "./Modal";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import lgZoom from "lightgallery/plugins/zoom";

const LightGallery = dynamic(() => import("lightgallery/react"), {
  ssr: true,
});

export default function AdminPhoto({ datum }) {
  const [showModal, setShowModal] = useState(false);
  const [err, setErr] = useState(false);
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    async () => await axios.delete(`/api/gallery/${datum.id}`),
    {
      onError: (error) => {
        console.log(error);
        setErr(error?.response?.data.err);
      },
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries(["getPhotos"]);
        setShowModal(false);
      },
    }
  );

  const handleClick = () => {
    setShowModal(true);
  };
  const handleModalClick = () => {
    setShowModal(false);
  };

  const handleDelete = () => {
    mutate();
  };

  return (
    <div>
      <LightGallery elementClassNames="" speed={500} plugins={[lgZoom]}>
        <Link
          className="card w-72 h-72 text-primary-content"
          href={`/images/gallery/${datum.photo}`}
        >
          <Image
            alt={datum.title}
            fill
            src={`/images/gallery/${datum.photo}`}
            className="w-full h-full object-cover border border-black rounded-md"
          />
        </Link>
      </LightGallery>
      <div className="text-red-700 mt-2" onClick={handleClick}>
        Delete
      </div>
      {showModal && (
        <Modal>
          <div className="flex justify-between">
            <h2 className="text-xl font-bold">{datum.title}</h2>
            <button
              className="w-6 h-6 rounded-full border-2 border-red-700 hover:bg-red-700 hover:text-white text-red-700 flex justify-center items-center"
              onClick={handleModalClick}
            >
              x
            </button>
          </div>
          <p className="my-4">
            Are you sure that you want to delete this photo?
          </p>
          <div className="flex justify-end">
            <button
              onClick={handleDelete}
              className="text-red-700 font-semibold border-2 border-red-700 hover:bg-red-700 hover:text-white py-2 px-4"
            >
              Delete
            </button>
          </div>
          {err && <p>{err}</p>}
        </Modal>
      )}
    </div>
  );
}
