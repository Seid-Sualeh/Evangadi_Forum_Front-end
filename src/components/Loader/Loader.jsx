import { ClipLoader } from "react-spinners";
function Loader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "50vh",
      }}
    >
      <ClipLoader color="orange" fontWeight="700" size={50} />
      <p style={{ padding: "10px", fontSize: "25px", color: "orange", fontWeight: "700" }}>Loading...</p>
    </div>
  );
}

export default Loader;
