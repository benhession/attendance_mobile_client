import axios, {AxiosResponse} from "axios";

const keycloakMobileClient = axios.create({
    baseURL: 'http://192.168.0.13:9090/auth/realms/master/protocol/openid-connect/token',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
    }
})

export interface KeyCloakTokens {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    'not-before-policy': number;
    session_state: string;
    scope: string;
}

export default {
    fetchTokensPwdGrant(username: string, password: string): Promise<AxiosResponse<KeyCloakTokens>> {

        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('client_id', 'mobile_client');
        params.append('scope', 'mobile_client');
        params.append('username', username);
        params.append('password', password);

        return keycloakMobileClient.post<KeyCloakTokens>("/", params);
    },
    fetchTokensRefreshTokenGrant(refreshToken: string): Promise<AxiosResponse<KeyCloakTokens>> {

        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('client_id', 'mobile_client');
        params.append('refresh_token', refreshToken);

        return keycloakMobileClient.post<KeyCloakTokens>("/", params);
    }
}
