import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

const webServiceStudentClasses = axios.create({
    baseURL: 'http://192.168.0.13:8080/student',
})

export const enum ATTEND_STATUS {
    SUCCESS = 'SUCCESS',
    ALREADY_ATTENDED = 'ALREADY_ATTENDED',
    NOT_IN_PROGRESS = 'NOT_IN_PROGRESS',
    NOT_VALID_CLASS = 'NOT_VALID_CLASS'
}

export default {
    fetchStudentClasses(accessToken: string): Promise<AxiosResponse> {

        const token = 'Bearer '.concat(accessToken);

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: token,
                Accept: "application/json"
            },
            timeout: 10000,
            timeoutErrorMessage: 'Unable to get response from resource server'
        }

        return webServiceStudentClasses.get("/classes", config);
    },

    attendClass(accessToken: string, qrString: string): Promise<AxiosResponse> {

        const token = 'Bearer '.concat(accessToken);

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: token,
                Accept: "application/json"
            },
            timeout: 10000,
            timeoutErrorMessage: 'Unable to get response from resource server'
        }

        return webServiceStudentClasses.patch("/attend", {qrString: qrString}, config);
    }
}