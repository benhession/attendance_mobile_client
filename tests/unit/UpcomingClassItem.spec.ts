import {mount} from '@vue/test-utils'
import UpcomingClassItem from '@/components/UpcomingClassItem.vue'
import MockObjects from "./MockObjects";
import {StudentUniversityClass} from "@/model/StudentUniversityClass";
import {IonChip} from "@ionic/vue";

// Shared Mock Objects
const inProgressClass: StudentUniversityClass = MockObjects.inProgressClass;

describe('UpcomingClassItem.vue', () => {
  it('loads', () => {

    const wrapper = mount(UpcomingClassItem, {
      props: {
        theClass: inProgressClass
      }
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('displays the name of the class', () => {
    const wrapper = mount(UpcomingClassItem, {
      props: {
        theClass: inProgressClass
      }
    });

    expect(wrapper.html().includes(inProgressClass.name)).toBe(true);
  });

  it("has in-progress chip if current time is between start and finish times", () => {
    const wrapper = mount(UpcomingClassItem, {
      props: {
        theClass: inProgressClass
      }
    });
    const chip = wrapper.findComponent(IonChip);
    expect(chip.exists()).toBe(true);
  });

  it("doesn't have in-progress chip if start time is in the future", () => {
    const wrapper = mount(UpcomingClassItem, {
      props: {
        theClass: MockObjects.upcomingClass
      }
    });
    const chip = wrapper.findComponent(IonChip);
    expect(chip.exists()).toBe(false);
  });

});
