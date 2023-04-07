import AdminPhoto from "@/components/AdminPhoto";
import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import lgZoom from "lightgallery/plugins/zoom";
import Photo from "@/components/Photo";

const LightGallery = dynamic(() => import("lightgallery/react"), {
  ssr: true,
});

const getPhotos = async () => {
  const response = await axios.get("http://localhost:3000/api/gallery");
  return response.data.data;
};

export default function Gallery() {
  const { replace } = useRouter();
  const { data, error, isLoading } = useQuery({
    queryFn: getPhotos,
    queryKey: ["getPhotos"],
  });
  if (error) return error;
  if (isLoading) return <Loading />;

  const onInit = () => {
    console.log("lightGallery has been initialized");
  };
  return (
    <Layout>
      <div className="my-10 lg:ml-36 md:ml-52 xl:ml-28">
        <LightGallery
          elementClassNames="flex flex-wrap gap-12 mx-6"
          // onInit={onInit}
          speed={500}
          plugins={[lgZoom]}
        >
          {data?.map((datum) => (
            <Photo datum={datum} key={datum.id} />
          ))}
        </LightGallery>
      </div>
    </Layout>
  );
}
