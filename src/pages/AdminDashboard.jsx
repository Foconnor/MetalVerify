import { uploadCoinProfiles, uploadBarProfiles } from "../firebase/firestoreUpload";

function AdminDashboard() {

    return (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <h1>Admin Dashboard</h1>

            <div style={{ marginTop: "2rem" }}>
                <button onClick={uploadCoinProfiles} style={{ marginRight: "10px" }}>
                    Upload Coin Profiles
                </button>

                <button onClick={uploadBarProfiles}>
                    Upload Bar Profiles
                </button>
            </div>
        </div>
    );
}

export default AdminDashboard;