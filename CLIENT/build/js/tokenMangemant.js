function isLogin(){
    let token = localStorage.getItem('token')?true:false
    return token
}

function loginType(){
    return localStorage.getItem('hospital');
}

export {isLogin,loginType}