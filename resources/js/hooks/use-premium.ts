import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import axios from "axios";
export const usePremium = () => {
    const user = usePage<PageProps>().props.auth;
    const [premiumState, setPremiumState] = useState({
        currentPremium: false,
        remainedDays: 0,
    });
    useEffect(()=>{
        axios.get('/get_premium')
        .then(function (response) {
            setPremiumState({currentPremium:response.data.is_premium,remainedDays:response.data.diff}) 
        });
    },[])
    return premiumState;
};
