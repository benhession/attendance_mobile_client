import {mount} from "@vue/test-utils";
import PreviousClassItem from "@/components/PreviousClassItem.vue";
import MockObjects from "./MockObjects";
import {IonChip, IonLabel} from "@ionic/vue";

const attendedClass1 = MockObjects.attendedClass1;

describe('UpcomingClassItem.vue', () => {
    it('loads', () => {
        const wrapper = mount(PreviousClassItem, {
            props: {
                theClass: attendedClass1
            }
        });

        expect(wrapper.exists()).toBe(true);
    });

    it('displays the name of the class', () => {
        const wrapper = mount(PreviousClassItem, {
            props: {
                theClass: attendedClass1
            }
        });

        expect(wrapper.html().includes(attendedClass1.name)).toBe(true);
    });

    it('displays the correct time and date', () => {
        const wrapper = mount(PreviousClassItem, {
            props: {
                theClass: attendedClass1
            }
        });

        const formattedDateTime = attendedClass1.datetime.format('MMMM Do YYYY, h:mm a');

        expect(wrapper.html().includes(formattedDateTime)).toBe(true);
    })

    it('marks attended classes appropriately', () => {
        const wrapper = mount(PreviousClassItem, {
            props: {
                theClass: attendedClass1
            }
        });

        const chip = wrapper.findComponent(IonChip);
        const label = chip.findComponent(IonLabel);

        expect(chip.exists()).toBe(true);
        expect(label.exists()).toBe(true);

        expect(label.html().includes('>Attended<')).toBe(true)
    });

    it('marks unattended classes appropriately', () => {
        const wrapper = mount(PreviousClassItem, {
            props: {
                theClass: MockObjects.absentClass1
            }
        });

        const chip = wrapper.findComponent(IonChip);
        const label = chip.findComponent(IonLabel);

        expect(chip.exists()).toBe(true);
        expect(label.exists()).toBe(true);

        expect(label.html().includes('>Absent<')).toBe(true);

    });

});