import { Storage } from "@ionic/storage";

export class UserDefaults {
    private static instance: UserDefaults;
    private store: Storage;

    private constructor() {
        this.store = new Storage();
        this.store.create().catch((e) => console.error("Error initialising user defaults: " + e))
    }

    public static getInstance(): UserDefaults {
        if (!UserDefaults.instance) {
            UserDefaults.instance = new UserDefaults();
        }

        return UserDefaults.instance;
    }

    public set(key: string, value: string): Promise<any> {
        return this.store.set(key, value);
    }

    public get(key: string): Promise<string> {
        return this.store.get(key);
    }

    public remove(key: string): Promise<any> {
        return this.store.remove(key);
    }

}