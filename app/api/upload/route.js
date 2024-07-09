import { NextResponse } from 'next/server';
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { firebaseConfig, firebaseStorageURL } from '../../../lib/Utils';
import { check } from '../products/route';
const app = initializeApp(firebaseConfig);
const storage = getStorage(app, firebaseStorageURL);

const unqFileName = (getFile) => {
    const timeStamp = Date.now();
    const randomStringValue = Math.random().toString(36).substring(2, 12);
    return `${getFile.name}-${timeStamp}-${randomStringValue}`;
};

async function helper(file) {
    const uniqueFileName = unqFileName(file);
    const storageRef = ref(storage, `ecommerce/${uniqueFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {
                // You can handle progress here if needed
            },
            (error) => {
                console.error('Error uploading file:', error);
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => resolve({ fileName: uniqueFileName, downloadURL }))
                    .catch((error) => reject(error));
            }
        );
    });
}

export async function POST(req) {
    await check();
    try {
        const formData = await req.formData();
        const files = formData.getAll('file');
        console.log('Files received:', files);
        if (!Array.isArray(files) || files.length === 0) {
            throw new Error('No files uploaded');
        }
        const fileUrls = await Promise.all(files.map(helper));
        console.log('Uploaded file URLs:', fileUrls);
        return NextResponse.json({ message: 'Files uploaded successfully', files: fileUrls });
    } catch (error) {
        console.error('Error processing form data:', error);
        return NextResponse.json({ error: 'Error processing form data' }, { status: 500 });
    }
}

// export const config = {
//     api: { bodyParser: false },
// };
