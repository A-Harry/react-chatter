export function authHeader() {

    let token = localStorage.getItem('token');

    if (!token===null) {
        return { 'Authorization': 'Bearer ' + token };
    } else {
        return {};
    }
}