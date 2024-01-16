import React, { useState } from "react";
import axios from "axios";

const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

function usePut() {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    async function putData(url, index, queryParams = {userId: loggedInUser?.id}) {

        try{
            setLoading(true);
            await axios.put(`${url}/${index}`, null, { params: queryParams })
                .then(response => {setData(response.data)});
        } catch(err)
        {
            setError(err);
        }
    }

    return { data, loading, error, putData };
}

export default usePut;