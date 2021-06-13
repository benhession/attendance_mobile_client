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
    dateTime: string;
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
    private readonly _dateTime: string;
    private readonly _duration: string;
    private readonly _classType: string;
    private readonly _module: UniversityModule;
    private readonly _tutor: Tutor;
    private readonly _attended: boolean;

    constructor(classInterface: StudentUniversityClassInterface) {
        this._classId = classInterface.classId;
        this._name = classInterface.name;
        this._location = classInterface.location;
        this._dateTime = classInterface.dateTime.concat("Z");
        this._duration = classInterface.duration;
        this._classType = classInterface.classType;
        this._module = classInterface.module;
        this._tutor = classInterface.tutor;
        this._attended = classInterface.attended;
    }

    // Methods
    isInProgress(): boolean {
        const currentDateTime = moment()
        const startDateTime = this.datetimeUTC
        const endDateTime = this.endTime

        return currentDateTime.isBetween(startDateTime, endDateTime)
    }

    isUpcomingClass(): boolean {
        const currentDateTime = moment();

        return (this.isInProgress() && this.attended ) ? false : this.endTime > currentDateTime;
    }

    isPreviousClass(): boolean {
        const currentDateTime = moment();

        return (this.isInProgress() && this.attended) || this.endTime < currentDateTime

    }

    // Getters

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
        return moment(this._dateTime);
    }

    get datetime(): moment.Moment {
        return moment(this._dateTime).local();
    }

    get duration(): moment.Duration {
        return moment.duration(this._duration);
    }

    get endTime(): moment.Moment {
        return this.datetimeUTC.add(this.duration);
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