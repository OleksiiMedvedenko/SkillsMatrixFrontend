import React, { useState, useEffect } from "react";
import axios from "axios";

const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

function useFetch(url, queryParams = {userId: loggedInUser?.id}) {

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState([]);
  const [error, setError] = React.useState([]);

  useEffect(() => {
    setLoading(true);

    axios
      .get(url, { 
        headers: { 
          'Access-Control-Allow-Origin': '*', 
        },
        params: queryParams
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

  const fetchData = async (url, queryParams = {userId: loggedInUser?.id}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(url, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        params: queryParams
      });
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData }
}

export default useFetch