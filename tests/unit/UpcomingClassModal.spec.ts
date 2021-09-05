// Mock objects
import MockObjects from "./MockObjects";
import {mount} from "@vue/test-utils";
import UpcomingClassModal from "@/components/UpcomingClassModal.vue";
import {IonChip} from "@ionic/vue";

const upcomingClass = MockObjects.upcomingClass;
const inProgressClass = MockObjects.inProgressClass;

describe('UpcomingClassModal.vue', () => {
   it('loads', () => {
       const wrapper = mount(UpcomingClassModal, {
           props: {
               theClass: upcomingClass
           }
       });
       expect(wrapper.exists()).toBe(true);
   });

   it('displays the tutors name', () => {
       const wrapper = mount(UpcomingClassModal, {
           props: {
               theClass: upcomingClass
           }
       });
        expect(wrapper.html().includes('<p><b>Tutor:</b> Bob Dylan</p>')).toBe(true);
   });

   it('displays the correct location', () => {
       const wrapper = mount(UpcomingClassModal, {
           props: {
               theClass: upcomingClass
           }
       });
       expect(wrapper.html().includes('<p><b>Location:</b> Berrill Lecture Theatre/p>'))
   });

   it('displays the class type', () => {
       const wrapper = mount(UpcomingClassModal, {
           props: {
               theClass: upcomingClass
           }
       });
       expect(wrapper.html().includes('<p><b>Class Type:</b> Lecture</p>')).toBe(true);
   })

    it("has in-progress chip if current time is between start and finish time of class", () => {
        const wrapper = mount(UpcomingClassModal, {
            props: {
                theClass: inProgressClass
            }
        });
        const chip = wrapper.findComponent(IonChip);
        expect(chip.exists()).toBe(true);
    });

    it("doesn't have in-progress chip if start time of class is in the future", () => {
        const wrapper = mount(UpcomingClassModal, {
            props: {
                theClass: upcomingClass
            }
        });
        const chip = wrapper.findComponent(IonChip);
        expect(chip.exists()).toBe(false);
    });



});