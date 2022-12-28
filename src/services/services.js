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
        body: data
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
