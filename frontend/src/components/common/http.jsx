export const apiUrl = 'http://localhost:8000/api'
export const admintoken = () => {
    const data = localStorage.getItem('adminInfo')
    const adminData = JSON.parse(data);
    return adminData.token;
}
export const adminId = () => {
    const data = localStorage.getItem('adminInfo');
    const adminData = JSON.parse(data);
    return adminData.id;
}
export const usertoken = () => {
    const data = localStorage.getItem('userInfo')
    const userData = JSON.parse(data);
    return userData.token;
}
export const userId = () => {
    const data = localStorage.getItem('userInfo')
    const userData = JSON.parse(data);
    return userData.id;
}