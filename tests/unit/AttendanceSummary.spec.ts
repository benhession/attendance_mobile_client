import {StudentUniversityClass} from "@/model/StudentUniversityClass";
import MockObjects from "./MockObjects";
import {mount} from "@vue/test-utils";
import AttendanceSummary from "@/components/AttendanceSummary.vue";

const seventyFivePercentClasses: StudentUniversityClass[] = [
    MockObjects.attendedClass1,
    MockObjects.attendedClass2,
    MockObjects.attendedClass1,
    MockObjects.absentClass1
];

const oneHundredPercentClasses: StudentUniversityClass[] = [
    MockObjects.attendedClass1,
    MockObjects.attendedClass2
];

describe('AttendanceSummary.vue', () => {
    it('loads', () => {
        const wrapper = mount(AttendanceSummary, {
            props: {
                previousClasses: seventyFivePercentClasses
            }
        });

        expect(wrapper.exists()).toBe(true);
    });

    it('displays correctly when attendance below 80%', () => {
        const wrapper = mount(AttendanceSummary, {
            props: {
                previousClasses: seventyFivePercentClasses
            }
        });

        const p = wrapper.find('p');
        const pAttributes = p.attributes();

        expect(p.text()).toEqual('You have achieved 75% attendance. ' +
            'Attendance below 80% can negatively affect your final grade.');

        expect(pAttributes['style'].includes('color: red')).toBe(true);
    });

    it('displays correctly when attendance above 80%', () => {
        const wrapper = mount(AttendanceSummary, {
            props: {
                previousClasses: oneHundredPercentClasses
            }
        });

        const p = wrapper.find('p');

        expect(p.text()).toEqual('You have achieved 100% attendance. Well done!');

    });

    it('displays correctly when attendance is 0', () => {
        const wrapper = mount(AttendanceSummary, {
            props: {
                previousClasses: []
            }
        });
        const p = wrapper.find('p');
        expect(p.text()).toEqual('Your attendance percentage will be displayed here.');
    })
})