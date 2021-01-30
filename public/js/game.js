const getGameId = () => {
    const splitedPath = window.location.pathname.split("/");
    return splitedPath[splitedPath.length - 1];
};

const isSecure = () => {
    return window.location.protocol === "https:";
};

const setConnectionPage = () => {
    const element = document.getElementById("connection");
    element.innerHTML = '<>'
};

export {
    getGameId,
    isSecure,
    setConnectionPage
};
