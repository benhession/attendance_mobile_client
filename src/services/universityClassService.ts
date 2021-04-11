import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

const webServiceStudentClasses = axios.create({
    baseURL: 'http://192.168.0.13:8080/student',
})

export default {
    fetchStudentClasses(accessToken: string): Promise<AxiosResponse> {

        const token = 'Bearer '.concat(accessToken);

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: token,
                Accept: "application/json"
            }
        }

        return webServiceStudentClasses.get("/classes", config);
    }
}