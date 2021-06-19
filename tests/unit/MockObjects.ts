import moment from "moment";
import {StudentUniversityClass} from "@/model/StudentUniversityClass";

const fiveMinutesAgo: string = moment().subtract(5, "minutes").toISOString()
    .replace('Z', '');
const tomorrow: string = moment().add(1, "day").toISOString()
    .replace('Z', '');
const oneWeekAgo: string = moment().subtract(1, 'week').toISOString()
    .replace('Z', '');
const twoWeeksAgo: string = moment().subtract(2, "weeks").toISOString()
    .replace('Z', '');
const threeDaysAgo: string = moment().subtract(3, "days").toISOString()
    .replace('Z', '');

function amountAttendedUsingOneHundredClasses(percentage: number): StudentUniversityClass[] {
    const classes = new Array<StudentUniversityClass>();

    for(let i = 0; i < percentage; i++) {
        classes.push(new StudentUniversityClass({
            classId: '',
            name: '',
            location: '',
            dateTime: oneWeekAgo,
            duration: '',
            classType: '',
            module: {
                moduleCode: "",
                moduleYear: "",
                moduleName: ""
            },
            tutor: {
                tutorId: '',
                forename: '',
                surname: '',
            },
            attended: true
        }));
    }

    for(let i = 0; i < 100 - percentage; i++) {
        classes.push(new StudentUniversityClass({
            classId: '',
            name: '',
            location: '',
            dateTime: oneWeekAgo,
            duration: '',
            classType: '',
            module: {
                moduleCode: "",
                moduleYear: "",
                moduleName: ""
            },
            tutor: {
                tutorId: '',
                forename: '',
                surname: '',
            },
            attended: false
        }));
    }

    return classes;
}

export default {
    inProgressClass: new StudentUniversityClass({
        classId: 'TM4702101',
        name: 'Introduction to TM470',
        location: 'Berrill Lecture Theatre',
        dateTime: fiveMinutesAgo,
        duration: 'PT1H',
        classType: 'Lecture',
        module: {
            moduleCode: "TM470",
            moduleYear: "2021",
            moduleName: "The computing and IT project"
        },
        tutor: {
            tutorId: 'dylanb2441',
            forename: 'Bob',
            surname: 'Dylan',
        },
        attended: false
    }),

    upcomingClass: new StudentUniversityClass({
        classId: 'TM4702101',
        name: 'Introduction to TM470',
        location: 'Berrill Lecture Theatre',
        dateTime: tomorrow,
        duration: 'PT1H',
        classType: 'Lecture',
        module: {
            moduleCode: "TM470",
            moduleYear: "2021",
            moduleName: "The computing and IT project"
        },
        tutor: {
            tutorId: 'dylanb2441',
            forename: 'Bob',
            surname: 'Dylan',
        },
        attended: false
    }),
    attendedClass1: new StudentUniversityClass({
        classId: 'TM4702101',
        name: 'Introduction to TM470',
        location: 'Berrill Lecture Theatre',
        dateTime: oneWeekAgo,
        duration: 'PT1H',
        classType: 'Lecture',
        module: {
            moduleCode: "TM470",
            moduleYear: "2021",
            moduleName: "The computing and IT project"
        },
        tutor: {
            tutorId: 'dylanb2441',
            forename: 'Bob',
            surname: 'Dylan',
        },
        attended: true
    }),
    attendedClass2: new StudentUniversityClass({
        classId: 'TM3512001',
        name: 'Introduction to TM351',
        location: 'Berrill Lecture Theatre',
        dateTime: threeDaysAgo,
        duration: 'PT1H',
        classType: 'Lecture',
        module: {
            moduleCode: "TM470",
            moduleYear: "2021",
            moduleName: "The computing and IT project"
        },
        tutor: {
            tutorId: 'dylanb2441',
            forename: 'Bob',
            surname: 'Dylan',
        },
        attended: true
    }),
    absentClass1: new StudentUniversityClass({
        classId: 'TM4702102',
        name: 'TMA01',
        location: 'Berrill Lecture Theatre',
        dateTime: twoWeeksAgo,
        duration: 'PT1H',
        classType: 'Lecture',
        module: {
            moduleCode: "TM470",
            moduleYear: "2021",
            moduleName: "The computing and IT project"
        },
        tutor: {
            tutorId: 'dylanb2441',
            forename: 'Bob',
            surname: 'Dylan',
        },
        attended: false
    }),
    seventyNinePercentAttendance: amountAttendedUsingOneHundredClasses(79),
    eightyPercentAttendance: amountAttendedUsingOneHundredClasses(80)
}