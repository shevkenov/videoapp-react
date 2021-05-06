import axios from 'axios';

export const axiosClient = axios.create({
    baseURL: "/api/v1"
})

export function authenticate(response) {
    axiosClient.post('/auth/google-login', {
        idToken: response.tokenId
    }).then(response => {
        console.log('Sing in success: ', response);
        window.location.assign(window.location.href);
    }).then(error => {
        console.log('Sign in error: ', error)
    })
}

export async function signoutUser() {
    await axiosClient.get('/auth/signout');
    window.location.pathname = "/"
}

export async function updateUser() {}

export async function addVideoView() {}

export async function addComment() {}

export async function addVideo() {}

export async function toggleSubscribeUser() {}

export async function likeVideo() {}

export async function dislikeVideo() {}

export async function deleteVideo() {}

export async function deleteComment() {}
