import React, { useState, useEffect } from "react";
import axios from "axios";

function useFetch(url) {

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState([]);
  const [error, setError] = React.useState([]);

  useEffect(() => {
    setLoading(true);

    axios
      .get(url, { 
        headers: { 
          'Access-Control-Allow-Origin': '*', 
        }
      })
      .then((response) => {
        setData(response.data);
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [url]);

  return { data, loading, error }
}

export default useFetch