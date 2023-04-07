export default function Modal({ children }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-base-100 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-base-300 p-10 rounded w-[600px] max-h-96 overflow-y-scroll">
        {children}
      </div>
    </div>
  );
}
