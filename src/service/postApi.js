import React, { useState } from "react";
import axios from "axios";

const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

function usePost() {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    async function postData(url, obj, queryParams = {userId: loggedInUser?.id}) {

        try{
            setLoading(true);
            await axios.post(url, obj, { params: queryParams })
                .then(response => {setData(response.data)});
        } catch(err)
        {
            setError(err);
        }
    }

    async function postDataWithReturnValue(url, obj, queryParams = {userId: loggedInUser?.id}) {

        try {
            setLoading(true);
            const response = await axios.post(url, obj, { params: queryParams });
            return response.data;
          } catch (err) {
            setError(err);
          }
    }

    return { data, loading, error, postData, postDataWithReturnValue };
}

export default usePost;