import axios from "axios";

export async function firebaseVerify(otp,phone,id) {
    try {
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key=${process.env.API_KEY}`, {
                sessionInfo: id,
                code: otp
        });
        const number = response.data.phoneNumber;
        return number===`+91${phone}`;
    } catch (error) {
        console.error('Error verifying phone number', error);
        return false;
    }
}