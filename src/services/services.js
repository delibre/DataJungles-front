export const postData = async (url, data) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: data
    });

    return await res.json();
};

export const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
        throw prompt(new Error(`Could not fetch ${url}, status: ${res.status}`));
    }

    return await res.json();
};

export const getWithAuthorization = async (url, clientToken) => {
    const res = await fetch(url, {
        method: "GET",
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + clientToken
        }
    });

    if (!res.ok) {
        throw prompt(new Error(`Could not fetch ${url}, status: ${res.status}`));
    }

    return await res.json();
};

export const fetchWithAuthorization = async (url, data, clientToken, method) => {
    const res = await fetch(url, {
        method: method,
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + clientToken
        },
        body: data // info, that we send
    });

    return await res.json();
};

export const validateStringFields = (field) => {
    const regex = /^[a-zA-ZAaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlŁłMmNnŃńOoÓóPpRrSsŚśTtUuWwYyZzŹźŻż -]*$/;
    if (regex.test(field) && field.length > 0 && field.length < 50) {
        return true;
    }
    return false;
}

export const validatePasswordField = (field) => {
    return field.length < 6 ? false : true
}

export const validateUsernameField = (field) => {
    return field.length < 4 ? false : true
}

// export const validateEmailField = (field) => {
//     const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     if (regex.test(field) && field.length > 0 && field.length < 50) {
//         return true;
//     }
//     return false;
// }

export const validatePhoneField = (field) => {
    const regex = /^\+[48][0-9]{10}$/;
    return regex.test(field) ? true : false;
}

export const validateAdressField = (field) => {
    const regex = /^[a-zA-ZAaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlŁłMmNnŃńOoÓóPpRrSsŚśTtUuWwYyZzŹźŻż -]+[,]+[ 0-9]+[a-zA-Z]?/;
    if (regex.test(field)  && field.length > 0) {
        return true;
    }
    return false;
}

export const closeModal = (setter) => {
    setter(false);
}

export const createModalContent = (header, messages) => {
    const tempModalContent = {};
    tempModalContent.header = header;
    tempModalContent.messages = messages;

    return tempModalContent;
}

export const setModalAndLoading = (isModal, isError, isLoading, setIsModal, setModalError, setLoading) => {
    setIsModal(isModal);
    setModalError(isError);
    setLoading(isLoading);
}

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
export const calcDistance = (lat1, lon1, lat2, lon2)  => {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var latToRad1 = toRad(lat1);
    var latToRad2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(latToRad1) * Math.cos(latToRad2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    var d = R * c; // Distance in km
    return d;
}

// Converts numeric degrees to radians
export const toRad = (Value) => {
return Value * Math.PI / 180;
}
