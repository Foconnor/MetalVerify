import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { deleteTest } from "../features/Account/DatabaseCode.js"; // import the delete function
import { db } from "../firebase/firebaseConfig.js";
import { getAuth } from "firebase/auth";

function HistoryPage() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      const user = getAuth().currentUser;

      if (!user) {
        console.log("No user logged in");
        return;
      }

      const testsRef = collection(db, "users", user.uid, "tests");

      const q = query(testsRef, orderBy("createdAt", "desc"));

      const querySnapshot = await getDocs(q);

      const testList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setTests(testList);
    };

    fetchTests();
  }, []);

    const handleDelete = async (testId) => {
        try {
            await deleteTest(testId); // call external function
            setTests(prev => prev.filter(test => test.id !== testId));
        } catch (error) {
            console.error("Error deleting test:", error);
        }
    };

    return (
        <div>
        <h2>Your Scan History</h2>

        {tests.length === 0 ? (
            <p>No tests yet.</p>
        ) : (
            <table border="1" cellPadding="10" align="center">
            <thead>
                <tr>
                <th>Type</th>
                <th>Item</th>
                <th>Density</th>
                <th>Confidence</th>
                <th>Date</th>
                <th>Delete</th>
                </tr>
            </thead>

            <tbody>
                {tests.map((test) => (
                <tr key={test.id}>
                    <td>{test.type}</td>
                    <td>{test.results?.selectedCoin || test.itemType}</td>
                    <td>{Number(test.results?.density).toFixed(2)}</td>
                    <td>{test.results?.confidence}%</td>
                    <td>
                    {test.createdAt?.toDate
                        ? test.createdAt.toDate().toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                        <button onClick={() => handleDelete(test.id)}>Delete</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>
    );
}

export default HistoryPage;
