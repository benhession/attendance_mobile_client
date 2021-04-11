import moment from "moment";

export interface UniversityModule {
    moduleCode: string;
    moduleYear: string;
    moduleName: string;
}

export interface Tutor {
    tutorId: string;
    forename: string;
    surname: string;
}

export interface StudentUniversityClassInterface {
    classId: string;
    name: string;
    location: string;
    datetime: string;
    duration: string;
    classType: string;
    module: UniversityModule;
    tutor: Tutor;
    attended: boolean;
}

export class StudentUniversityClass {
    private readonly _classId: string;
    private readonly _name: string;
    private readonly _location: string;
    private readonly _datetime: moment.Moment;
    private readonly _duration: moment.Duration;
    private readonly _classType: string;
    private readonly _module: UniversityModule;
    private readonly _tutor: Tutor;
    private readonly _attended: boolean;

    constructor(classInterface: StudentUniversityClassInterface) {
        this._classId = classInterface.classId;
        this._name = classInterface.name;
        this._location = classInterface.location;
        this._datetime = moment(classInterface.datetime).utc();
        this._duration = moment.duration(classInterface.duration);
        this._classType = classInterface.classType;
        this._module = classInterface.module;
        this._tutor = classInterface.tutor;
        this._attended = classInterface.attended;
    }


    get classId(): string {
        return this._classId;
    }

    get name(): string {
        return this._name;
    }

    get location(): string {
        return this._location;
    }

    get datetimeUTC(): moment.Moment {
        return this._datetime.utc();
    }

    get datetime(): moment.Moment {
        return this._datetime;
    }

    get duration(): moment.Duration {
        return this._duration;
    }

    get classType(): string {
        return this._classType;
    }

    get module(): UniversityModule {
        return this._module;
    }

    get tutor(): Tutor {
        return this._tutor;
    }

    get attended(): boolean {
        return this._attended;
    }
}