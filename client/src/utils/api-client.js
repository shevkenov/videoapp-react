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

export async function addComment({comment, video}) {
    await axiosClient.post(`/videos/${video.id}/comments`, {text: comment});
    await queryCache.invalidateQueries(["WatchVideo", video.id]);
}

export async function addVideo(video) {
    await axiosClient.post("/videos", video);
    await queryCache.invalidateQueries("Channel");
}

export async function toggleSubscribeUser(channelId) {
    await axiosClient(`/users/${channelId}/toggle-subscribe`);
    await queryCache.invalidateQueries(["WatchVideo"])
    await queryCache.invalidateQueries(["Cannel"])
    await queryCache.invalidateQueries(["Cannels"])
    await queryCache.invalidateQueries(["Subscriptions"])
    await queryCache.invalidateQueries(["AuthProvider"])
    await queryCache.invalidateQueries(["SearchResult"])
}

export async function likeVideo(videoId) {
    await axiosClient(`/videos/${videoId}/like`);
    await queryCache.invalidateQueries(["WatchVideo", videoId]);
}

export async function dislikeVideo(videoId) {
    await axiosClient(`/videos/${videoId}/dislike`);
    await queryCache.invalidateQueries(["WatchVideo", videoId]);
}

export async function deleteVideo() {}

export async function deleteComment() {}
