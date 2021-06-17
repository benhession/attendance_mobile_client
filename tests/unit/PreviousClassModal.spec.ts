import {mount} from "@vue/test-utils";
import PreviousClassModal from "@/components/PreviousClassModal.vue";
import MockObjects from "./MockObjects";
import {IonChip, IonLabel} from "@ionic/vue";

const attendedClass = MockObjects.attendedClass1;

describe('UpcomingClassModal.vue', () => {

    it('loads', () => {
        const wrapper = mount(PreviousClassModal, {
            props: {
                theClass: attendedClass
            }
        });
        expect(wrapper.exists()).toBe(true);
    });

    it('displays the tutors name', () => {
        const wrapper = mount(PreviousClassModal, {
            props: {
                theClass: attendedClass
            }
        });
        expect(wrapper.html().includes('<p><b>Tutor:</b> Bob Dylan</p>')).toBe(true);
    });

    it('displays the correct location', () => {
        const wrapper = mount(PreviousClassModal, {
            props: {
                theClass: attendedClass
            }
        });
        expect(wrapper.html().includes('<p><b>Location:</b> Berrill Lecture Theatre/p>'))
    });

    it('displays the class type', () => {
        const wrapper = mount(PreviousClassModal, {
            props: {
                theClass: attendedClass
            }
        });
        expect(wrapper.html().includes('<p><b>Class Type:</b> Lecture</p>'))
    });

    it('marks attended classes appropriately', () => {
        const wrapper = mount(PreviousClassModal, {
            props: {
                theClass: attendedClass
            }
        });

        const chip = wrapper.findComponent(IonChip);
        const label = chip.findComponent(IonLabel);

        expect(chip.exists()).toBe(true);
        expect(label.exists()).toBe(true);
        expect(label.html().includes('>Attended<')).toBe(true)
    });

    it('marks unattended classes appropriately', () => {
        const wrapper = mount(PreviousClassModal, {
            props: {
                theClass: MockObjects.absentClass1
            }
        });

        const chip = wrapper.findComponent(IonChip);
        const label = chip.findComponent(IonLabel);

        expect(chip.exists()).toBe(true);
        expect(label.exists()).toBe(true);
        expect(label.html().includes('>Absent<')).toBe(true)

    });
});