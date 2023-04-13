import Layout from "@/components/Layout";

export default function About() {
  return (
    <>
      <Layout />
      <div className="h-[calc(100vh-8rem)]">
        <p className="text-2xl text-center mt-8 font-bold capitalize pb-4 ">
          Who we are
        </p>
        <div className="flex justify-center gap-14 mt-4 mb-12">
          <div className="flex">
            <div className="flex flex-col justify-center items-center">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src="/assets/about_p.jpg" />
                </div>
              </div>
              <div className="text-center mt-4">
                Md. Saidur Rahman Chawdhury
              </div>
              <div className="text-center text-xs">Front End Developer</div>
              <div className="text-center text-xs">
                Noakhali Science and Technology University
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col justify-center items-center">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src="/assets/about_p_1.jpg" />
                </div>
              </div>
              <div className="text-center mt-4">Md. Safiul Alam</div>
              <div className="text-center text-xs">Back End Developer</div>
              <div className="text-center text-xs">
                Noakhali Science and Technology University
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col justify-center items-center">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src="/assets/about_p_2.jpg" />
                </div>
              </div>
              <div className="text-center mt-4">Avisheik Chawdhury</div>
              <div className="text-center text-xs">Database Developer</div>
              <div className="text-center text-xs">
                Noakhali Science and Technology University
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <p className="w-4/5 text-justify">
            Welcome to the alumni management website of Noakhali Science and
            Technology University (NSTU). Our platform aims to facilitate
            communication and engagement among our alumni community, connecting
            graduates with one another and with their alma mater. Our mission is
            to create a vibrant and active alumni network that supports lifelong
            connections between alumni and the university. Our platform provides
            a range of services and resources that enable alumni to stay
            connected with each other, share their experiences and
            accomplishments, and contribute to the ongoing success of their alma
            mater. We are committed to building a dynamic and engaged alumni
            community, and we welcome your involvement and participation. Thank
            you for being a part of our community!
          </p>
        </div>
      </div>
    </>
  );
}
