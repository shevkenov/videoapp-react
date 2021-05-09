import axios from "axios";

export async function uploadMedia({preset, file, type}) {
    const formData = new FormData();
    formData.append("upload_preset", preset);
    formData.append("file", file);

    const data = await axios.post(`https://api.cloudinary.com/v1_1/andrewsh/${type}/upload`, formData).then(res => res.data);

    return data.secure_url;
}
