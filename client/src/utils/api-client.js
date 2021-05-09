import axios from 'axios';
import { queryCache } from 'react-query';

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

export async function addVideoView(id) {
    await axiosClient.get(`/videos/${id}/views`);
    await queryCache.invalidateQueries("History");
}

export async function addComment() {}

export async function addVideo(video) {
    await axiosClient.post("/videos", video);
    await queryCache.invalidateQueries("Channel");
}

export async function toggleSubscribeUser() {}

export async function likeVideo() {}

export async function dislikeVideo() {}

export async function deleteVideo() {}

export async function deleteComment() {}
