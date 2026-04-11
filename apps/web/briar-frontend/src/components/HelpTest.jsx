import React, { useState, useEffect } from "react";
import axios from "axios";

const HelpTest = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/api/help_equipment",
        );
        setData(response.data.znotifc_epqui_helpType);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <ul className=''>
            {data.map((item) => (
              <li className='flex space-x-6' key={item.Equnr}>
                <strong>Equipment Number:</strong> {item.Equnr}
                <br />
                <strong>Equipment Description:</strong> {item.Eqktx}
                <br />
                <hr />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HelpTest;
